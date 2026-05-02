from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.lead import Lead
from app.models.pipeline_stage import DEFAULT_STAGES


async def stage_counts(session: AsyncSession, user_id: UUID) -> dict[str, int]:
    q = (
        select(Lead.pipeline_stage, func.count(Lead.id))
        .where(Lead.user_id == user_id)
        .group_by(Lead.pipeline_stage)
    )
    rows = (await session.execute(q)).all()
    out = {s["key"]: 0 for s in DEFAULT_STAGES}
    for stage, cnt in rows:
        if stage in out:
            out[stage] = int(cnt)
    return out


def next_stage(current: str) -> str | None:
    keys = [s["key"] for s in DEFAULT_STAGES]
    if current not in keys:
        return keys[0] if keys else None
    idx = keys.index(current)
    if idx + 1 < len(keys):
        return keys[idx + 1]
    return None
