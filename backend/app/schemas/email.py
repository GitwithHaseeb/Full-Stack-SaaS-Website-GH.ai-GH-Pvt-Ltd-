from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr


class SendEmailRequest(BaseModel):
    lead_ids: List[UUID]
    subject: str
    body: str


class StartCampaignRequest(BaseModel):
    campaign_id: UUID


class EmailLogOut(BaseModel):
    id: UUID
    lead_id: Optional[UUID] = None
    subject: Optional[str] = None
    body: Optional[str] = None
    sent_at: datetime
    status: Optional[str] = None

    model_config = {"from_attributes": True}


class ContactFormRequest(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    message: str
