from datetime import datetime, timezone
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.calendly_event import CalendlyEvent
from app.models.lead import Lead


async def handle_calendly_payload(db: AsyncSession, payload: dict[str, Any]) -> None:
    """Parse Calendly webhook payload and move matching lead to Meeting Scheduled."""
    resource = payload.get("payload") or payload
    invitee_email: str | None = None
    if isinstance(resource, dict):
        inv = resource.get("invitee")
        if isinstance(inv, dict):
            invitee_email = inv.get("email")
        elif isinstance(inv, str):
            invitee_email = inv
        if not invitee_email:
            invitee_email = resource.get("invitee_email") or resource.get("email")
    if not invitee_email:
        return

    result = await db.execute(select(Lead).where(func.lower(Lead.email) == invitee_email.lower()))
    lead = result.scalar_one_or_none()
    if not lead:
        return

    lead.pipeline_stage = "Meeting Scheduled"
    db.add(lead)
    evt = CalendlyEvent(
        lead_id=lead.id,
        user_id=lead.user_id,
        calendly_event_uri=str(resource.get("uri", "")) if isinstance(resource, dict) else None,
        status="booked",
        booked_at=datetime.now(timezone.utc),
        raw_payload=payload,
    )
    db.add(evt)
    await db.flush()
