"""Modelo: project_technology (N:M entre project y technology)."""
from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base
from src.models.mixins import GUID, TimestampMixin

if TYPE_CHECKING:
    from src.models.project import Project
    from src.models.technology import Technology


class ProjectTechnology(TimestampMixin, Base):
    __tablename__ = "project_technology"

    project_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("project.id", ondelete="CASCADE"),
        primary_key=True,
    )
    technology_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("technology.id", ondelete="RESTRICT"),
        primary_key=True,
    )
    role: Mapped[str | None] = mapped_column(String(60), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    project: Mapped["Project"] = relationship(back_populates="technologies")
    technology: Mapped["Technology"] = relationship(back_populates="projects")
