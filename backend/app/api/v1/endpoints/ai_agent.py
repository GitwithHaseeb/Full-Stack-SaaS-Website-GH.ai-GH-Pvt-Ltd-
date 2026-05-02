from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, get_db
from app.core.limiter import limiter
from app.models.lead import Lead
from app.models.user import User
from app.schemas.ai_agent import (
    AIConfigOut,
    AIConfigUpdate,
    GenerateReplyRequest,
    GenerateReplyResponse,
    ProcessEmailRequest,
)
from app.services import ai_service
from app.services import calendly_service as cal_svc
from app.core.security import decrypt_value

router = APIRouter(prefix="/ai-agent", tags=["ai-agent"])


def _ai_config(user: User) -> dict[str, Any]:
    cfg = user.ai_config or {}
    return {
        "enabled": bool(cfg.get("enabled", True)),
        "human_in_loop": bool(cfg.get("human_in_loop", False)),
        "custom_instructions": str(cfg.get("custom_instructions", "")),
        "recent_decisions": list(cfg.get("recent_decisions", []))[-50:],
    }


@router.get("/config", response_model=AIConfigOut)
async def get_ai_config(current: Annotated[User, Depends(get_current_user)]) -> AIConfigOut:
    c = _ai_config(current)
    return AIConfigOut(**c)


@router.put("/config", response_model=AIConfigOut)
async def put_ai_config(
    body: AIConfigUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> AIConfigOut:
    cfg = dict(current.ai_config or {})
    data = body.model_dump(exclude_unset=True)
    if "enabled" in data and data["enabled"] is not None:
        cfg["enabled"] = data["enabled"]
    if "human_in_loop" in data and data["human_in_loop"] is not None:
        cfg["human_in_loop"] = data["human_in_loop"]
    if "custom_instructions" in data and data["custom_instructions"] is not None:
        cfg["custom_instructions"] = data["custom_instructions"]
    cfg.setdefault("recent_decisions", [])
    current.ai_config = cfg
    db.add(current)
    await db.flush()
    return AIConfigOut(**_ai_config(current))


@router.post("/process-email")
@limiter.limit("10/minute")
async def process_email(
    request: Request,
    body: ProcessEmailRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> dict[str, Any]:
    cfg = _ai_config(current)
    result = await ai_service.classify_and_draft(
        body.raw_email,
        cfg["custom_instructions"],
        cfg["human_in_loop"],
    )
    decisions = list(cfg["recent_decisions"])
    decisions.append({"intent": result["intent"], "preview": body.raw_email[:200]})
    merged = {**cfg, "recent_decisions": decisions[-50:]}
    current.ai_config = {**(current.ai_config or {}), **merged}
    db.add(current)

    lead: Lead | None = None
    if body.lead_id:
        try:
            lid = UUID(body.lead_id)
            r = await db.execute(select(Lead).where(Lead.id == lid, Lead.user_id == current.id))
            lead = r.scalar_one_or_none()
        except ValueError:
            lead = None

    booking_url = None
    if result["intent"] == "schedule_meeting":
        plain = decrypt_value(current.calendly_token) or ""
        link = await cal_svc.create_scheduling_link(plain, None, body.from_address)
        booking_url = link.get("booking_url")

    await db.flush()
    return {
        "intent": result["intent"],
        "draft": result["draft"],
        "booking_url": booking_url,
        "human_in_loop": cfg["human_in_loop"],
        "lead_id": str(lead.id) if lead else None,
    }


@router.post("/generate-reply", response_model=GenerateReplyResponse)
@limiter.limit("10/minute")
async def generate_reply_ep(
    request: Request,
    body: GenerateReplyRequest,
    current: Annotated[User, Depends(get_current_user)],
) -> GenerateReplyResponse:
    cfg = _ai_config(current)
    out = await ai_service.generate_reply(body.email_content, cfg["custom_instructions"])
    intent = out["intent"]
    if intent not in ("schedule_meeting", "question", "ignore"):
        intent = "question"
    return GenerateReplyResponse(draft=out["draft"], intent=intent)  # type: ignore[arg-type]
