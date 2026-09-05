"""Liveness endpoint."""

from __future__ import annotations

from fastapi import APIRouter, Depends

from ..config import Settings, get_settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health(settings: Settings = Depends(get_settings)) -> dict:
    return {
        "status": "ok",
        "email_transport": "smtp" if settings.email_enabled else "log-only",
    }
