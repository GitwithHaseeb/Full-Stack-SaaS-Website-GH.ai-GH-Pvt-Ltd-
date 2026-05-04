from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class LeadCreate(BaseModel):
    name: str
    email: EmailStr
    company: Optional[str] = None
    pipeline_stage: str = "New Lead"
    assigned_agent: bool = False
    acquisition_source: Optional[str] = Field(None, max_length=128)


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    pipeline_stage: Optional[str] = None
    notes: Optional[str] = None
    last_contacted_at: Optional[datetime] = None
    assigned_agent: Optional[bool] = None
    acquisition_source: Optional[str] = Field(None, max_length=128)


class EmailLogOut(BaseModel):
    id: UUID
    subject: Optional[str] = None
    body: Optional[str] = None
    sent_at: datetime
    status: Optional[str] = None
    direction: str = "outbound"

    model_config = {"from_attributes": True}


class LeadOut(BaseModel):
    id: UUID
    name: str
    email: EmailStr
    company: Optional[str] = None
    pipeline_stage: str
    notes: Optional[str] = None
    last_contacted_at: Optional[datetime] = None
    assigned_agent: bool
    fit_score: Optional[int] = None
    acquisition_source: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class LeadDetailOut(LeadOut):
    email_history: List[EmailLogOut] = []
