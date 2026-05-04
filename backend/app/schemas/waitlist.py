from pydantic import BaseModel, EmailStr, field_validator

from app.core.email_norm import normalize_email


class WaitlistRequest(BaseModel):
    email: EmailStr

    @field_validator("email", mode="before")
    @classmethod
    def _normalize_email_waitlist(cls, v: object) -> object:
        if isinstance(v, str):
            return normalize_email(v)
        return v
