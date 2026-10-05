"""Modelo: project (sistemas SaaS en producción)."""
from __future__ import annotations

import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, Enum, ForeignKey, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base
from src.models.enums import ProjectStatusEnum
from src.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from src.models.owner import Owner
    from src.models.project_metric import ProjectMetric
    from src.models.project_technology import ProjectTechnology


class Project(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "project"

    owner_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("owner.id", ondelete="CASCADE"), nullable=False
    )
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    tagline: Mapped[str] = mapped_column(String(200), nullable=False)
    description_short: Mapped[str] = mapped_column(String(500), nullable=False)
    description_long: Mapped[str] = mapped_column(Text, nullable=False)
    problem_statement: Mapped[str] = mapped_column(Text, nullable=False)
    solution_summary: Mapped[str] = mapped_column(Text, nullable=False)
    architecture_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[ProjectStatusEnum] = mapped_column(
        Enum(ProjectStatusEnum, name="project_status_enum"),
        nullable=False,
        default=ProjectStatusEnum.PRODUCTION,
    )
    launched_at: Mapped[date | None] = mapped_column(Date, nullable=True)
    live_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    repo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_image_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    demo_video_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    display_order: Mapped[int] = mapped_column(
        SmallInteger, nullable=False, default=0
    )

    owner: Mapped["Owner"] = relationship(back_populates="projects")
    technologies: Mapped[list["ProjectTechnology"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    metrics: Mapped[list["ProjectMetric"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
