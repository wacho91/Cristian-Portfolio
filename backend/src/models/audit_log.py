"""Modelo: audit_log (auditoría técnica de cambios)."""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import BigInteger, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import JSON

from src.database import Base
from src.models.mixins import GUID


class AuditLog(Base):
    __tablename__ = "audit_log"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    table_name: Mapped[str] = mapped_column(String(80), nullable=False)
    record_id: Mapped[uuid.UUID] = mapped_column(GUID(), nullable=False)
    operation: Mapped[str] = mapped_column(String(10), nullable=False)
    changed_by: Mapped[str | None] = mapped_column(String(120), nullable=True)
    old_values: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    new_values: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
