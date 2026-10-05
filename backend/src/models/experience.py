"""Modelo: experience (trayectoria laboral del owner)."""
from __future__ import annotations

import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, ForeignKey, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base
from src.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from src.models.owner import Owner


class Experience(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "experience"

    owner_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("owner.id", ondelete="CASCADE"), nullable=False
    )
    company: Mapped[str] = mapped_column(String(150), nullable=False)
    role: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(String(120), nullable=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    display_order: Mapped[int] = mapped_column(
        SmallInteger, nullable=False, default=0
    )

    owner: Mapped["Owner"] = relationship(back_populates="experiences")
