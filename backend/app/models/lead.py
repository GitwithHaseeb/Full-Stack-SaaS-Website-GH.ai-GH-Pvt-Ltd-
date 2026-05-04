import uuid
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.calendly_event import CalendlyEvent
    from app.models.email_log import EmailLog
    from app.models.user import User

PIPELINE_STAGES = ("New Lead", "Contacted", "Meeting Scheduled", "Closed")


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    pipeline_stage: Mapped[str] = mapped_column(String(64), nullable=False, default="New Lead")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    last_contacted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    assigned_agent: Mapped[bool] = mapped_column(Boolean, default=False)
    fit_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    acquisition_source: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    owner: Mapped["User"] = relationship("User", back_populates="leads")
    email_history: Mapped[List["EmailLog"]] = relationship("EmailLog", back_populates="lead", cascade="all, delete-orphan")
    calendly_events: Mapped[List["CalendlyEvent"]] = relationship("CalendlyEvent", back_populates="lead")
