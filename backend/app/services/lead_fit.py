"""Rule-based lead fit score (discovery / ICP proxy) — favors fit over raw volume."""

from __future__ import annotations

import re

# Consumer domains — lower score than corporate; still valid for B2B SMB.
_FREE_EMAIL_DOMAINS = frozenset(
    {
        "gmail.com",
        "googlemail.com",
        "yahoo.com",
        "yahoo.co.uk",
        "hotmail.com",
        "outlook.com",
        "live.com",
        "msn.com",
        "icloud.com",
        "me.com",
        "protonmail.com",
        "proton.me",
        "aol.com",
        "gmx.com",
        "mail.com",
        "yandex.com",
    }
)


def _domain_from_email(email: str) -> str | None:
    parts = (email or "").strip().lower().split("@", 1)
    if len(parts) != 2:
        return None
    return parts[1].strip() or None


def compute_lead_fit_score(*, email: str, name: str, company: str | None) -> int:
    """
    Heuristic 0–100: company + corporate email + structured name → higher fit.
    Not a replacement for enrichment APIs; explicit signal for prioritization.
    """
    score = 35
    co = (company or "").strip()
    if len(co) >= 2:
        score += 28
    domain = _domain_from_email(email)
    if domain:
        if domain in _FREE_EMAIL_DOMAINS:
            score += 5
        else:
            score += 32
    nm = (name or "").strip()
    if " " in nm and len(nm) >= 5:
        score += 12
    if re.search(r"\b(ceo|cto|cfo|vp|director|head|founder|owner|manager)\b", nm, re.I):
        score += 15
    return max(0, min(100, score))
