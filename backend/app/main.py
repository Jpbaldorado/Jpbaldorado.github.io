"""FastAPI application for the JPB portfolio.

Endpoints
    GET  /api/health   liveness and active mail transport
    GET  /api/profile  full portfolio content
    GET  /api/cv       CV download
    POST /api/contact  contact form submission
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .config import get_settings
from .core.logging import configure_logging, get_logger
from .routers import contact, health, profile

settings = get_settings()
configure_logging(settings.log_level)
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    logger.info(
        "API starting | env=%s mail=%s origins=%s",
        settings.app_env,
        "smtp" if settings.email_enabled else "log-only",
        ", ".join(settings.cors_origins) or "none",
    )
    yield
    logger.info("API stopped")


app = FastAPI(
    title="JPB Portfolio API",
    version="1.0.0",
    description="Backend for johnpatrickbaldorado.dev — contact intake and content.",
    lifespan=lifespan,
    # Interactive docs are useful in development and noise in production.
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    max_age=600,
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    """Baseline hardening on every response."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response


@app.exception_handler(Exception)
async def unhandled_exception(request: Request, exc: Exception) -> JSONResponse:
    """Log the detail, return a message the visitor can act on."""
    logger.exception("Unhandled error on %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Something failed on the server. Try again shortly."},
    )


app.include_router(health.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
app.include_router(contact.router, prefix="/api")
