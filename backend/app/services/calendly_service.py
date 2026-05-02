"""Calendly REST — auth via personal token or per-user token from connect."""

import logging
from typing import Any, Optional

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

BASE = "https://api.calendly.com"


def _auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


async def list_event_types(token: str) -> list[dict[str, Any]]:
    """GET /users/me then GET /event_types?user={uri}. Requires users:read + event_types:read."""
    t = token or get_settings().CALENDLY_PERSONAL_TOKEN
    if not t:
        return [
            {
                "uri": "https://api.calendly.com/event_types/demo-placeholder",
                "name": "Demo call (configure CALENDLY_PERSONAL_TOKEN)",
            }
        ]
    headers = _auth_headers(t)
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            me = await client.get(f"{BASE}/users/me", headers=headers)
            if me.status_code != 200:
                logger.warning(
                    "Calendly users/me failed: %s %s",
                    me.status_code,
                    me.text[:500],
                )
                return []
            user_uri = (me.json().get("resource") or {}).get("uri")
            if not user_uri:
                return []
            r = await client.get(
                f"{BASE}/event_types",
                headers=headers,
                params={"user": user_uri},
            )
            r.raise_for_status()
            return r.json().get("collection", [])
        except Exception:
            logger.exception("Calendly list_event_types failed")
            return []


async def create_scheduling_link(
    token: str, event_type_uri: Optional[str], lead_email: str
) -> dict[str, Any]:
    """Prepare one-off scheduling link payload (Calendly API shape may vary by product tier)."""
    t = token or get_settings().CALENDLY_PERSONAL_TOKEN
    if not t:
        return {
            "booking_url": f"https://calendly.com/gh-ai?email={lead_email}",
            "note": "Set user calendly_token or CALENDLY_PERSONAL_TOKEN for live API.",
        }
    headers = _auth_headers(t)
    body: dict[str, Any] = {
        "max_event_count": 1,
        "owner": event_type_uri or "https://api.calendly.com/event_types/placeholder",
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            r = await client.post(f"{BASE}/scheduling_links", headers=headers, json=body)
            if r.status_code >= 400:
                return {"booking_url": f"https://calendly.com/demo?guest={lead_email}", "raw": r.text}
            data = r.json()
            return {"booking_url": data.get("resource", {}).get("booking_url"), "raw": data}
        except Exception as exc:
            return {"booking_url": f"https://calendly.com/demo?guest={lead_email}", "error": str(exc)}
