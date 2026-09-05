"""Application settings, sourced from environment variables / .env."""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    log_level: str = "INFO"

    cors_origins_raw: str = Field(default="", validation_alias="CORS_ORIGINS")

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    contact_recipient: str = ""

    rate_limit_max_requests: int = 5
    rate_limit_window_seconds: int = 3600

    cv_path: str = "app/assets/John-Patrick-Baldorado-CV.pdf"

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_host)

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
