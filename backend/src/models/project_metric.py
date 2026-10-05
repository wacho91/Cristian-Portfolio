"""Modelo: project_metric (métricas cuantitativas por proyecto)."""
from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Numeric,
    SmallInteger,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base
from src.models.enums import MetricUnitEnum
from src.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from src.models.project import Project


class ProjectMetric(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "project_metric"
    __table_args__ = (
        UniqueConstraint("project_id", "metric_key", name="project_metric_unique_key"),
    )

    project_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("project.id", ondelete="CASCADE"), nullable=False
    )
    metric_key: Mapped[str] = mapped_column(String(60), nullable=False)
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    value_numeric: Mapped[Decimal] = mapped_column(Numeric(18, 4), nullable=False)
    unit: Mapped[MetricUnitEnum] = mapped_column(
        Enum(MetricUnitEnum, name="metric_unit_enum"),
        nullable=False,
        default=MetricUnitEnum.COUNT,
    )
    custom_unit: Mapped[str | None] = mapped_column(String(30), nullable=True)
    display_order: Mapped[int] = mapped_column(
        SmallInteger, nullable=False, default=0
    )
    measured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    project: Mapped["Project"] = relationship(back_populates="metrics")
