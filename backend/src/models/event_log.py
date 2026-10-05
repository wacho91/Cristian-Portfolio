"""Modelo: event_log (auditoría de eventos de negocio)."""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from src.database import Base
from src.models.enums import EventTypeEnum
from src.models.mixins import GUID


class EventLog(Base):
    __tablename__ = "event_log"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    session_id: Mapped[uuid.UUID | None] = mapped_column(
        GUID(),
        ForeignKey("visitor_session.id", ondelete="SET NULL"),
        nullable=True,
    )
    event_type: Mapped[EventTypeEnum] = mapped_column(
        Enum(EventTypeEnum, name="event_type_enum"), nullable=False, index=True
    )
    entity_type: Mapped[str | None] = mapped_column(String(60), nullable=True)
    entity_id: Mapped[uuid.UUID | None] = mapped_column(GUID(), nullable=True)
    payload: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
