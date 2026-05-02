from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user
from app.models.campaign import Campaign
from app.models.user import User
from app.schemas.campaign import CampaignCreate, CampaignOut

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("/", response_model=list[CampaignOut])
async def list_campaigns(
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> list[Campaign]:
    result = await db.execute(select(Campaign).where(Campaign.user_id == current.id).order_by(Campaign.created_at.desc()))
    return list(result.scalars().all())


@router.post("/", response_model=CampaignOut, status_code=201)
async def create_campaign(
    body: CampaignCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> Campaign:
    c = Campaign(
        user_id=current.id,
        name=body.name,
        trigger_type=body.trigger_type,
        trigger_days=body.trigger_days,
        subject=body.subject,
        body=body.body,
    )
    db.add(c)
    await db.flush()
    return c


@router.delete("/{campaign_id}", status_code=204)
async def delete_campaign(
    campaign_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> None:
    from sqlalchemy import delete

    res = await db.execute(delete(Campaign).where(Campaign.id == campaign_id, Campaign.user_id == current.id))
    if res.rowcount == 0:
        raise HTTPException(404, detail="Campaign not found")
