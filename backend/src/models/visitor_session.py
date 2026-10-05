"""Modelo: visitor_session (analytics anónimo GDPR-friendly)."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import CHAR, DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base
from src.models.mixins import GUID, UUIDPrimaryKeyMixin


class VisitorSession(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "visitor_session"

    session_token: Mapped[uuid.UUID] = mapped_column(
        GUID(), unique=True, nullable=False, default=uuid.uuid4
    )
    ip_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    country_code: Mapped[str | None] = mapped_column(CHAR(2), nullable=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    last_seen_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
