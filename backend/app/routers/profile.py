"""Portfolio content and CV download."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse

from ..config import Settings, get_settings
from ..data.profile import (
    achievements,
    certifications,
    metrics,
    profile,
    projects,
    skill_clusters,
    timeline,
)

router = APIRouter(tags=["profile"])


@router.get("/profile")
def get_profile() -> dict:
    return {
        "profile": profile,
        "metrics": metrics,
        "projects": projects,
        "achievements": achievements,
        "skillClusters": skill_clusters,
        "timeline": timeline,
        "certifications": certifications,
    }


@router.get("/cv")
def get_cv(settings: Settings = Depends(get_settings)) -> FileResponse:
    cv_path = Path(settings.cv_path)
    if not cv_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"CV file is not on the server at {cv_path}.",
        )
    return FileResponse(cv_path, filename=cv_path.name, media_type="application/pdf")
