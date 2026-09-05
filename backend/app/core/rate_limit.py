"""In-process fixed-window rate limiter.

Behind multiple workers or replicas, swap the dict below for Redis — `check`
and `reset` are the only interface callers depend on.
"""

from __future__ import annotations

import time


class RateLimiter:
    def __init__(self, max_requests: int = 5, window_seconds: int = 3600) -> None:
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self._hits: dict[str, list[float]] = {}

    def check(self, key: str) -> tuple[bool, int]:
        now = time.monotonic()
        window_start = now - self.window_seconds
        hits = [t for t in self._hits.get(key, []) if t > window_start]

        if len(hits) >= self.max_requests:
            retry_after = int(self.window_seconds - (now - hits[0])) + 1
            self._hits[key] = hits
            return False, retry_after

        hits.append(now)
        self._hits[key] = hits
        return True, 0

    def reset(self) -> None:
        self._hits.clear()
