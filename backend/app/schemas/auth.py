from pydantic import BaseModel, EmailStr, Field, field_validator

from app.core.email_norm import normalize_email


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    company_name: str | None = None

    @field_validator("email", mode="before")
    @classmethod
    def _normalize_email(cls, v: object) -> object:
        if isinstance(v, str):
            return normalize_email(v)
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("email", mode="before")
    @classmethod
    def _normalize_email_login(cls, v: object) -> object:
        if isinstance(v, str):
            return normalize_email(v)
        return v


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str
