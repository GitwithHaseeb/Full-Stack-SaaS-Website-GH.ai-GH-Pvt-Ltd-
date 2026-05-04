"""Canonical email form for auth and waitlist (case-insensitive, trimmed)."""


def normalize_email(email: str) -> str:
    return (email or "").strip().lower()
