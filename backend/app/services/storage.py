"""Append-only submission log.

Every contact submission is written here before any delivery is attempted, so
a mail outage costs delivery, never data — replay the file when SMTP is back.
"""

from __future__ import annotations

from pathlib import Path

from ..schemas import StoredSubmission


class SubmissionStore:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def append(self, submission: StoredSubmission) -> None:
        with self.path.open("a", encoding="utf-8") as handle:
            handle.write(submission.model_dump_json() + "\n")
