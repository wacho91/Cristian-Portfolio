"""Modelo: newsletter_subscriber (doble opt-in)."""
from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base
from src.models.mixins import GUID, UUIDPrimaryKeyMixin


class NewsletterSubscriber(UUIDPrimaryKeyMixin, Base):
    __tablename__ = "newsletter_subscriber"

    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    is_confirmed: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, index=True
    )
    confirm_token: Mapped[uuid.UUID] = mapped_column(
        GUID(), nullable=False, default=uuid.uuid4
    )
    subscribed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    confirmed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    unsubscribed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
