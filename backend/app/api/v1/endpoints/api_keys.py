import hashlib
import secrets
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_current_user, get_db
from app.models.api_key import ApiKey
from app.models.user import User
from app.schemas.api_key import ApiKeyCreate, ApiKeyCreated, ApiKeyOut

router = APIRouter(prefix="/api-keys", tags=["api-keys"])


def _hash_key(plaintext: str) -> str:
    return hashlib.sha256(plaintext.encode()).hexdigest()


@router.get("/", response_model=list[ApiKeyOut])
async def list_keys(
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> list[ApiKey]:
    res = await db.execute(
        select(ApiKey).where(ApiKey.user_id == current.id).order_by(ApiKey.created_at.desc())
    )
    return list(res.scalars().all())


@router.post("/", response_model=ApiKeyCreated, status_code=status.HTTP_201_CREATED)
async def create_key(
    body: ApiKeyCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> ApiKeyCreated:
    plain = f"ghai_{secrets.token_urlsafe(32)}"
    prefix = plain[:10]
    row = ApiKey(user_id=current.id, name=body.name, key_hash=_hash_key(plain), key_prefix=prefix)
    db.add(row)
    await db.flush()
    base = ApiKeyOut.model_validate(row)
    return ApiKeyCreated(**base.model_dump(), plaintext_key=plain)


@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_key(
    key_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current: Annotated[User, Depends(get_current_user)],
) -> None:
    res = await db.execute(delete(ApiKey).where(ApiKey.id == key_id, ApiKey.user_id == current.id))
    if res.rowcount == 0:
        raise HTTPException(404, detail="API key not found")
