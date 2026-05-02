from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user
from app.core.security import decrypt_value, encrypt_value
from app.models.lead import Lead
from app.models.user import User
from app.schemas.calendly import CalendlyConnectRequest, CreateBookingLinkRequest
from app.services import calendly_service

router = APIRouter(prefix="/calendly", tags=["calendly"])


@router.post("/connect")
async def connect_calendly(
    body: CalendlyConnectRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> dict[str, str]:
    current.calendly_token = encrypt_value(body.token)
    db.add(current)
    await db.flush()
    return {"status": "connected"}


@router.get("/event-types")
async def event_types(
    current: Annotated[User, Depends(get_current_user)],
) -> list[dict[str, Any]]:
    token = decrypt_value(current.calendly_token) or ""
    return await calendly_service.list_event_types(token)


@router.post("/create-booking-link")
async def create_booking_link(
    body: CreateBookingLinkRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> dict[str, Any]:
    try:
        lid = UUID(body.lead_id)
    except Exception:
        raise HTTPException(400, detail="Invalid lead_id")
    res = await db.execute(select(Lead).where(Lead.id == lid, Lead.user_id == current.id))
    lead = res.scalar_one_or_none()
    if not lead:
        raise HTTPException(404, detail="Lead not found")
    token = decrypt_value(current.calendly_token) or ""
    return await calendly_service.create_scheduling_link(token, body.event_type_uri, lead.email)


@router.post("/webhook")
async def calendly_webhook_receiver(request: Request, db: Annotated[AsyncSession, Depends(get_db)]) -> dict[str, str]:
    """Calendly webhook receiver (also available at POST /webhooks/calendly)."""
    from app.services.calendly_webhook import handle_calendly_payload

    payload = await request.json()
    await handle_calendly_payload(db, payload)
    return {"status": "ok"}
