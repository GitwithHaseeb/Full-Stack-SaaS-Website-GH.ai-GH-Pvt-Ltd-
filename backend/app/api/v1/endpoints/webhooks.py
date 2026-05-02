from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_db
from app.services.calendly_webhook import handle_calendly_payload

router = APIRouter(tags=["webhooks"])


@router.post("/calendly")
async def calendly_root(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    payload = await request.json()
    await handle_calendly_payload(db, payload)
    return {"status": "ok"}


@router.post("/gmail")
async def gmail_root(request: Request) -> dict[str, str]:
    _ = await request.json()
    return {"status": "received"}
