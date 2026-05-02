from typing import Any, Optional

from pydantic import BaseModel


class CalendlyConnectRequest(BaseModel):
    token: str


class CreateBookingLinkRequest(BaseModel):
    lead_id: str
    event_type_uri: Optional[str] = None


class CalendlyWebhookPayload(BaseModel):
    event: Optional[str] = None
    payload: Optional[dict[str, Any]] = None
