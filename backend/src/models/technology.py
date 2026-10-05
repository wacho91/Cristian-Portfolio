"""Modelo: technology (catálogo normalizado de tecnologías)."""
from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Enum, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base
from src.models.enums import SkillCategoryEnum
from src.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from src.models.project_technology import ProjectTechnology


class Technology(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "technology"

    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    category: Mapped[SkillCategoryEnum] = mapped_column(
        Enum(SkillCategoryEnum, name="skill_category_enum"), nullable=False
    )
    icon_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    official_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    projects: Mapped[list["ProjectTechnology"]] = relationship(
        back_populates="technology"
    )
