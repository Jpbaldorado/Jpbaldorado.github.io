"""FastAPI dependency providers."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from fastapi import Request

from .config import get_settings
from .core.rate_limit import RateLimiter
from .services.mailer import Mailer
from .services.storage import SubmissionStore


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@lru_cache
def get_rate_limiter() -> RateLimiter:
    settings = get_settings()
    return RateLimiter(
        max_requests=settings.rate_limit_max_requests,
        window_seconds=settings.rate_limit_window_seconds,
    )


@lru_cache
def get_store() -> SubmissionStore:
    return SubmissionStore(Path("data/submissions.jsonl"))


@lru_cache
def get_mailer() -> Mailer:
    return Mailer(get_settings())
