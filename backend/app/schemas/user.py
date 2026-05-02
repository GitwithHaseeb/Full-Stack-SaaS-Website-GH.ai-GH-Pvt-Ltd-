from typing import Any, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    full_name: Optional[str] = None
    company: Optional[str] = None
    ai_config: Optional[dict[str, Any]] = None
    timezone: Optional[str] = None
    working_hours: Optional[dict[str, Any]] = None

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    company: Optional[str] = None
    timezone: Optional[str] = None
    working_hours: Optional[dict[str, Any]] = None
