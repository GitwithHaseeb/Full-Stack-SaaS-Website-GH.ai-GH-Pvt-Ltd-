from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class CampaignCreate(BaseModel):
    name: str
    trigger_type: str = "new_lead"
    trigger_days: Optional[int] = None
    subject: Optional[str] = None
    body: Optional[str] = None


class CampaignOut(BaseModel):
    id: UUID
    name: str
    trigger_type: str
    trigger_days: Optional[int] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
