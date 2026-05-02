import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, List, Optional

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.api_key import ApiKey
    from app.models.calendly_event import CalendlyEvent
    from app.models.campaign import Campaign
    from app.models.email_log import EmailLog
    from app.models.lead import Lead


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(Text, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    gmail_refresh_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    calendly_token: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    ai_config: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    timezone: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    working_hours: Mapped[Optional[dict[str, Any]]] = mapped_column(JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    leads: Mapped[List["Lead"]] = relationship("Lead", back_populates="owner", cascade="all, delete-orphan")
    email_logs: Mapped[List["EmailLog"]] = relationship("EmailLog", back_populates="user")
    campaigns: Mapped[List["Campaign"]] = relationship("Campaign", back_populates="owner", cascade="all, delete-orphan")
    calendly_events: Mapped[List["CalendlyEvent"]] = relationship("CalendlyEvent", back_populates="user")
    api_keys: Mapped[List["ApiKey"]] = relationship("ApiKey", back_populates="user", cascade="all, delete-orphan")
