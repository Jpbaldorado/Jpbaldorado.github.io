"""Outbound mail for contact submissions.

Leave SMTP_HOST empty and the mailer runs in log-only mode: submissions are
logged but never emailed. That is the default, so development and CI need no
mail credentials.
"""

from __future__ import annotations

import smtplib
from email.message import EmailMessage

from ..config import Settings
from ..core.logging import get_logger
from ..schemas import ContactRequest

logger = get_logger(__name__)


class Mailer:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def send(self, payload: ContactRequest, reference: str) -> None:
        if not self.settings.email_enabled:
            logger.info(
                "[log-only] contact %s from %s <%s>: %s",
                reference, payload.name, payload.email, payload.subject,
            )
            return

        message = EmailMessage()
        message["Subject"] = f"[Portfolio contact] {payload.subject}"
        message["From"] = self.settings.smtp_user or self.settings.contact_recipient
        message["To"] = self.settings.contact_recipient
        message["Reply-To"] = payload.email
        message.set_content(
            f"Reference: {reference}\nFrom: {payload.name} <{payload.email}>\n\n{payload.message}"
        )

        try:
            with smtplib.SMTP(self.settings.smtp_host, self.settings.smtp_port) as server:
                server.starttls()
                if self.settings.smtp_user:
                    server.login(self.settings.smtp_user, self.settings.smtp_password)
                server.send_message(message)
            logger.info("Delivered contact %s via SMTP", reference)
        except Exception:
            logger.exception("Failed to deliver contact %s via SMTP", reference)
