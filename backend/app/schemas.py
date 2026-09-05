"""Request/response and storage models."""

from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, Field, computed_field

FREEMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com",
}


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    subject: str = Field(min_length=3, max_length=160)
    message: str = Field(min_length=10, max_length=4000)
    # Honeypot: real visitors never see or fill this field.
    website: str = Field(default="", max_length=200)

    @computed_field
    @property
    def is_freemail(self) -> bool:
        domain = self.email.split("@")[-1].lower()
        return domain in FREEMAIL_DOMAINS


class ContactResponse(BaseModel):
    reference: str
    delivered: bool


class StoredSubmission(BaseModel):
    reference: str
    name: str
    email: EmailStr
    subject: str
    message: str
    client_ip: str
    user_agent: str | None = None
    freemail: bool = False
    received_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
