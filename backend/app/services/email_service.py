"""Gmail send skeleton — real send uses Gmail API with refresh token."""

from typing import Iterable
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.email_log import EmailLog
from app.models.lead import Lead


async def log_outbound(
    session: AsyncSession,
    user_id: UUID,
    lead_id: UUID | None,
    subject: str,
    body: str,
    status: str = "queued",
) -> EmailLog:
    log = EmailLog(
        user_id=user_id,
        lead_id=lead_id,
        subject=subject,
        body=body,
        status=status,
        direction="outbound",
    )
    session.add(log)
    await session.flush()
    return log


async def log_inbound(
    session: AsyncSession,
    user_id: UUID,
    lead_id: UUID | None,
    subject: str,
    body: str,
    status: str = "received",
) -> EmailLog:
    log = EmailLog(
        user_id=user_id,
        lead_id=lead_id,
        subject=subject,
        body=body,
        status=status,
        direction="inbound",
    )
    session.add(log)
    await session.flush()
    return log


async def resolve_leads(session: AsyncSession, user_id: UUID, lead_ids: Iterable[UUID]) -> list[Lead]:
    from sqlalchemy import select

    result = await session.execute(
        select(Lead).where(Lead.user_id == user_id, Lead.id.in_(list(lead_ids)))
    )
    return list(result.scalars().all())
