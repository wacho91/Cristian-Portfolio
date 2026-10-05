"""Modelo: skill (habilidades del owner)."""
from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import (
    Enum,
    ForeignKey,
    SmallInteger,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base
from src.models.enums import SkillCategoryEnum, SkillLevelEnum
from src.models.mixins import GUID, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from src.models.owner import Owner


class Skill(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "skill"
    __table_args__ = (
        UniqueConstraint("owner_id", "name", name="skill_unique_per_owner"),
    )

    owner_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("owner.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    category: Mapped[SkillCategoryEnum] = mapped_column(
        Enum(SkillCategoryEnum, name="skill_category_enum"), nullable=False
    )
    level: Mapped[SkillLevelEnum] = mapped_column(
        Enum(SkillLevelEnum, name="skill_level_enum"),
        nullable=False,
        default=SkillLevelEnum.ADVANCED,
    )
    proficiency: Mapped[int] = mapped_column(
        SmallInteger, nullable=False, default=80
    )
    years_used: Mapped[int] = mapped_column(
        SmallInteger, nullable=False, default=0
    )
    display_order: Mapped[int] = mapped_column(
        SmallInteger, nullable=False, default=0
    )

    owner: Mapped["Owner"] = relationship(back_populates="skills")
