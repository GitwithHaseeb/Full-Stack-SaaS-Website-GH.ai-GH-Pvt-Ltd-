from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.deps import get_db
from app.core.email_norm import normalize_email
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest, TokenPair

router = APIRouter(prefix="/auth", tags=["auth"])


def _set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(
        key="access_token",
        value=access,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 30,
        path="/",
    )


@router.post("/register", response_model=TokenPair)
async def register(
    body: RegisterRequest,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenPair:
    email_norm = normalize_email(str(body.email))
    existing = await db.execute(select(User).where(func.lower(User.email) == email_norm))
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=400,
            detail=(
                "This email already has an account — try logging in. "
                "For extra test accounts on Gmail, use plus addressing (e.g. friend+ghai@gmail.com)."
            ),
        )
    user = User(
        email=email_norm,
        hashed_password=get_password_hash(body.password),
        company=body.company_name,
        ai_config={"enabled": True, "human_in_loop": False, "custom_instructions": "", "recent_decisions": []},
    )
    db.add(user)
    await db.flush()
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    _set_auth_cookies(response, access, refresh)
    return TokenPair(access_token=access, refresh_token=refresh)


@router.post("/login", response_model=TokenPair)
async def login(
    body: LoginRequest,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenPair:
    email_norm = normalize_email(str(body.email))
    result = await db.execute(select(User).where(func.lower(User.email) == email_norm))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    _set_auth_cookies(response, access, refresh)
    return TokenPair(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenPair)
async def refresh_token(
    body: RefreshRequest,
    response: Response,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> TokenPair:
    try:
        payload = decode_token(body.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user_id = UUID(payload["sub"])
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    access = create_access_token(str(user.id))
    refresh = create_refresh_token(str(user.id))
    _set_auth_cookies(response, access, refresh)
    return TokenPair(access_token=access, refresh_token=refresh)


@router.post("/logout")
async def logout(response: Response) -> dict[str, str]:
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"status": "ok"}
