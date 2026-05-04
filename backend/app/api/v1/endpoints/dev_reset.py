"""Dangerous QA helpers — disabled unless DEV_USER_RESET_SECRET is set in the environment."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_db
from app.core.config import get_settings
from app.core.email_norm import normalize_email
from app.models.user import User

router = APIRouter(prefix="/dev", tags=["dev"])


@router.delete("/reset-test-user", status_code=status.HTTP_204_NO_CONTENT)
async def reset_test_user(
    request: Request,
    db: Annotated[AsyncSession, Depends(get_db)],
    email: Annotated[str, Query(description="Account email to remove from the database")],
) -> None:
    """
    Deletes the user row (and cascaded data) so the same email can register again.
    Only works when DEV_USER_RESET_SECRET is non-empty and request header
    X-GH-Dev-Secret matches. Returns 404 when disabled so the route is not advertised.
    """
    settings = get_settings()
    secret = (settings.DEV_USER_RESET_SECRET or "").strip()
    if not secret or request.headers.get("X-GH-Dev-Secret") != secret:
        raise HTTPException(status_code=404, detail="Not found")
    try:
        validated = TypeAdapter(EmailStr).validate_python(normalize_email(email))
    except ValidationError as exc:
        raise HTTPException(status_code=400, detail="Invalid email") from exc
    norm = normalize_email(str(validated))
    result = await db.execute(select(User).where(func.lower(User.email) == norm))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    await db.execute(delete(User).where(User.id == user.id))
    await db.flush()
