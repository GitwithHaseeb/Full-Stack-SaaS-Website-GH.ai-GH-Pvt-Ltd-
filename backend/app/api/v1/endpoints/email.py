from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, get_db
from app.models.campaign import Campaign
from app.models.user import User
from app.schemas.email import EmailLogOut, SendEmailRequest, StartCampaignRequest
from app.services import email_service
from app.tasks import email_tasks

router = APIRouter(prefix="/email", tags=["email"])


@router.post("/send")
async def send_email(
    body: SendEmailRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> dict[str, str]:
    leads = await email_service.resolve_leads(db, current.id, body.lead_ids)
    if len(leads) != len(set(body.lead_ids)):
        raise HTTPException(400, detail="Some leads were not found")
    for lead in leads:
        await email_service.log_outbound(db, current.id, lead.id, body.subject, body.body, status="queued")
        email_tasks.send_email_task.delay(str(current.id), str(lead.id), body.subject, body.body)
    await db.flush()
    return {"status": "queued"}


@router.post("/campaign/start")
async def start_campaign(
    body: StartCampaignRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> dict[str, str]:
    res = await db.execute(select(Campaign).where(Campaign.id == body.campaign_id, Campaign.user_id == current.id))
    campaign = res.scalar_one_or_none()
    if not campaign:
        raise HTTPException(404, detail="Campaign not found")
    email_tasks.run_campaign_task.delay(str(current.id), str(campaign.id))
    return {"status": "started"}


@router.get("/logs", response_model=list[EmailLogOut])
async def email_logs(
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> list:
    from app.models.email_log import EmailLog

    q = (
        select(EmailLog)
        .where(EmailLog.user_id == current.id)
        .order_by(EmailLog.sent_at.desc())
        .limit(100)
    )
    rows = await db.execute(q)
    return list(rows.scalars().all())
