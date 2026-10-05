"""Enums de dominio compartidos por los modelos SQLAlchemy."""
from __future__ import annotations

import enum


class ProjectStatusEnum(str, enum.Enum):
    IN_DEVELOPMENT = "in_development"
    BETA = "beta"
    PRODUCTION = "production"
    DEPRECATED = "deprecated"
    ARCHIVED = "archived"


class SkillCategoryEnum(str, enum.Enum):
    LANGUAGE = "language"
    FRAMEWORK = "framework"
    DATABASE = "database"
    DEVOPS = "devops"
    CLOUD = "cloud"
    ARCHITECTURE = "architecture"
    SOFT_SKILL = "soft_skill"
    TOOL = "tool"


class SkillLevelEnum(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class ContactStatusEnum(str, enum.Enum):
    NEW = "new"
    READ = "read"
    REPLIED = "replied"
    ARCHIVED = "archived"
    SPAM = "spam"


class MetricUnitEnum(str, enum.Enum):
    COUNT = "count"
    PERCENTAGE = "percentage"
    CURRENCY_USD = "currency_usd"
    MILLISECONDS = "milliseconds"
    SECONDS = "seconds"
    REQUESTS_PER_SECOND = "requests_per_second"
    USERS = "users"
    BYTES = "bytes"
    CUSTOM = "custom"


class EventTypeEnum(str, enum.Enum):
    PAGE_VIEW = "page_view"
    PROJECT_VIEW = "project_view"
    CONTACT_SUBMIT = "contact_submit"
    CONTACT_SUCCESS = "contact_success"
    CONTACT_ERROR = "contact_error"
    CV_DOWNLOAD = "cv_download"
    EXTERNAL_LINK_CLICK = "external_link_click"
    NEWSLETTER_SUBSCRIBE = "newsletter_subscribe"
