from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


class ProcessEmailRequest(BaseModel):
    lead_id: Optional[str] = None
    raw_email: str
    from_address: str


class GenerateReplyRequest(BaseModel):
    email_content: str
    tone: Optional[str] = None


class GenerateReplyResponse(BaseModel):
    draft: str
    intent: Literal["schedule_meeting", "question", "ignore"] = "question"


class AIConfigUpdate(BaseModel):
    enabled: bool | None = None
    human_in_loop: bool | None = None
    custom_instructions: str | None = Field(default=None, max_length=8000)


class AIConfigOut(BaseModel):
    enabled: bool
    human_in_loop: bool
    custom_instructions: str
    recent_decisions: list[dict[str, Any]] = []
