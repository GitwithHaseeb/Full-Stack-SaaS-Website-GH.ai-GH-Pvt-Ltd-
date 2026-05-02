from app.api.v1.deps import CurrentUser, DbSession
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate
from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
async def read_me(current: CurrentUser) -> User:
    return current


@router.put("/me", response_model=UserOut)
async def update_me(body: UserUpdate, db: DbSession, current: CurrentUser) -> User:
    if body.full_name is not None:
        current.full_name = body.full_name
    if body.company is not None:
        current.company = body.company
    if body.timezone is not None:
        current.timezone = body.timezone
    if body.working_hours is not None:
        current.working_hours = body.working_hours
    db.add(current)
    await db.flush()
    return current
