from typing import Annotated, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.v1.deps import get_current_user
from app.models.email_log import EmailLog
from app.models.lead import Lead, PIPELINE_STAGES
from app.models.user import User
from app.schemas.lead import EmailLogOut, LeadCreate, LeadDetailOut, LeadOut, LeadUpdate

router = APIRouter(prefix="/leads", tags=["leads"])


@router.get("/", response_model=list[LeadOut])
async def list_leads(
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
    stage: Optional[str] = None,
    q: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> list[Lead]:
    stmt = select(Lead).where(Lead.user_id == current.id)
    if stage:
        stmt = stmt.where(Lead.pipeline_stage == stage)
    if q:
        like = f"%{q}%"
        stmt = stmt.where((Lead.name.ilike(like)) | (Lead.email.ilike(like)))
    stmt = stmt.order_by(Lead.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.post("/", response_model=LeadOut, status_code=status.HTTP_201_CREATED)
async def create_lead(
    body: LeadCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> Lead:
    if body.pipeline_stage not in PIPELINE_STAGES:
        raise HTTPException(400, detail=f"Invalid stage. Allowed: {PIPELINE_STAGES}")
    lead = Lead(
        user_id=current.id,
        name=body.name,
        email=str(body.email),
        company=body.company,
        pipeline_stage=body.pipeline_stage,
        assigned_agent=body.assigned_agent,
    )
    db.add(lead)
    await db.flush()
    return lead


@router.get("/{lead_id}", response_model=LeadDetailOut)
async def get_lead(
    lead_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> LeadDetailOut:
    result = await db.execute(
        select(Lead)
        .options(selectinload(Lead.email_history))
        .where(Lead.id == lead_id, Lead.user_id == current.id)
    )
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(404, detail="Lead not found")
    history = [
        EmailLogOut.model_validate(
            {
                "id": e.id,
                "subject": e.subject,
                "body": e.body,
                "sent_at": e.sent_at,
                "status": e.status,
                "direction": e.direction,
            }
        )
        for e in sorted(lead.email_history, key=lambda x: x.sent_at, reverse=True)
    ]
    base = LeadOut.model_validate(lead)
    return LeadDetailOut(**base.model_dump(), email_history=history)


@router.put("/{lead_id}", response_model=LeadOut)
async def update_lead(
    lead_id: UUID,
    body: LeadUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> Lead:
    result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.user_id == current.id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(404, detail="Lead not found")
    if body.pipeline_stage is not None and body.pipeline_stage not in PIPELINE_STAGES:
        raise HTTPException(400, detail="Invalid pipeline stage")
    data = body.model_dump(exclude_unset=True)
    for k, v in data.items():
        setattr(lead, k, v)
    db.add(lead)
    await db.flush()
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(
    lead_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> None:
    result = await db.execute(select(Lead).where(Lead.id == lead_id, Lead.user_id == current.id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(404, detail="Lead not found")
    await db.execute(delete(Lead).where(Lead.id == lead_id, Lead.user_id == current.id))
