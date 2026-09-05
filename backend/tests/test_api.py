"""API tests. Run with: pytest -q"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.dependencies import get_rate_limiter
from app.main import app

client = TestClient(app)

VALID_PAYLOAD = {
    "name": "Ana Reyes",
    "email": "ana.reyes@company.com",
    "subject": "Multi-site rollout",
    "message": "We need routing and firewall support for four regional sites in Q3.",
}


@pytest.fixture(autouse=True)
def clear_rate_limiter():
    """Each test starts with an empty window so ordering never matters."""
    get_rate_limiter().reset()
    yield
    get_rate_limiter().reset()


def test_health_reports_transport():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["email_transport"] in {"smtp", "log-only"}


def test_profile_returns_all_content_blocks():
    body = client.get("/api/profile").json()
    for key in ("profile", "metrics", "projects", "achievements", "skillClusters", "timeline"):
        assert key in body
    assert len(body["projects"]) == 3
    assert len(body["achievements"]) == 4


def test_valid_submission_is_accepted():
    response = client.post("/api/contact", json=VALID_PAYLOAD)
    assert response.status_code == 201
    assert len(response.json()["reference"]) == 12


def test_short_message_is_rejected():
    response = client.post("/api/contact", json={**VALID_PAYLOAD, "message": "hi"})
    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"][-1] == "message"


def test_malformed_email_is_rejected():
    response = client.post("/api/contact", json={**VALID_PAYLOAD, "email": "not-an-email"})
    assert response.status_code == 422


def test_honeypot_submission_is_silently_dropped():
    response = client.post("/api/contact", json={**VALID_PAYLOAD, "website": "spam.example"})
    assert response.status_code == 201
    assert response.json()["delivered"] is False


def test_rate_limit_returns_429_with_retry_after():
    limiter = get_rate_limiter()
    for _ in range(limiter.max_requests):
        assert client.post("/api/contact", json=VALID_PAYLOAD).status_code == 201

    blocked = client.post("/api/contact", json=VALID_PAYLOAD)
    assert blocked.status_code == 429
    assert int(blocked.headers["Retry-After"]) > 0


def test_cv_endpoint_explains_a_missing_file():
    response = client.get("/api/cv")
    assert response.status_code in {200, 404}
    if response.status_code == 404:
        assert "CV file is not on the server" in response.json()["detail"]
