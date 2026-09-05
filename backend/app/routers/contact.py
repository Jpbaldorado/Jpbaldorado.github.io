"""Contact form endpoint."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status

from ..core.logging import get_logger
from ..core.rate_limit import RateLimiter
from ..dependencies import (
    client_ip,
    get_mailer,
    get_rate_limiter,
    get_store,
)
from ..schemas import ContactRequest, ContactResponse, StoredSubmission
from ..services.mailer import Mailer
from ..services.storage import SubmissionStore

logger = get_logger(__name__)
router = APIRouter(tags=["contact"])


@router.post(
    "/contact",
    response_model=ContactResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a contact message",
)
def submit_contact(
    payload: ContactRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    limiter: RateLimiter = Depends(get_rate_limiter),
    store: SubmissionStore = Depends(get_store),
    mailer: Mailer = Depends(get_mailer),
) -> ContactResponse:
    ip = client_ip(request)

    # Honeypot. Answer 201 so the bot has nothing to tune against, but drop the
    # submission and never store or deliver it.
    if payload.website:
        logger.warning("Honeypot triggered from %s", ip)
        return ContactResponse(reference=uuid.uuid4().hex[:12], delivered=False)

    allowed, retry_after = limiter.check(ip)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many messages from this address. Try again later.",
            headers={"Retry-After": str(retry_after)},
        )

    reference = uuid.uuid4().hex[:12]

    # Store first, deliver second. A mail outage then costs delivery, not data.
    store.append(
        StoredSubmission(
            reference=reference,
            name=payload.name,
            email=payload.email,
            subject=payload.subject,
            message=payload.message,
            client_ip=ip,
            user_agent=request.headers.get("user-agent"),
            freemail=payload.is_freemail,
        )
    )

    # Delivery runs after the response, so a slow SMTP handshake never holds the
    # visitor's browser open.
    background_tasks.add_task(mailer.send, payload, reference)

    return ContactResponse(reference=reference, delivered=False)
