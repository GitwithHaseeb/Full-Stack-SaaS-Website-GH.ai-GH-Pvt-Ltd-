from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user
from app.models.lead import Lead
from app.models.pipeline_stage import DEFAULT_STAGES
from app.models.user import User
from app.services import pipeline_service

router = APIRouter(prefix="/pipeline", tags=["pipeline"])


@router.get("/stages")
async def list_stages() -> list[dict]:
    return DEFAULT_STAGES


@router.post("/advance/{lead_id}")
async def advance_lead(
    lead_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> dict:
    result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.user_id == current.id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(404, detail="Lead not found")
    nxt = pipeline_service.next_stage(lead.pipeline_stage)
    if not nxt:
        return {"stage": lead.pipeline_stage, "message": "Already at terminal stage"}
    lead.pipeline_stage = nxt
    db.add(lead)
    await db.flush()
    return {"stage": lead.pipeline_stage}


@router.get("/analytics")
async def pipeline_analytics(
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> dict:
    counts = await pipeline_service.stage_counts(db, current.id)
    return {"counts": counts, "stages": [s["key"] for s in DEFAULT_STAGES]}
