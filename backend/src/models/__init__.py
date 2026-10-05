"""
Registro central de modelos SQLAlchemy.

Importar este paquete garantiza que todas las tablas queden registradas
en `Base.metadata` antes de crear el esquema o ejecutar migraciones.
"""
from src.models.audit_log import AuditLog
from src.models.contact_message import ContactMessage
from src.models.enums import (
    ContactStatusEnum,
    EventTypeEnum,
    MetricUnitEnum,
    ProjectStatusEnum,
    SkillCategoryEnum,
    SkillLevelEnum,
)
from src.models.event_log import EventLog
from src.models.experience import Experience
from src.models.newsletter_subscriber import NewsletterSubscriber
from src.models.owner import Owner
from src.models.project import Project
from src.models.project_metric import ProjectMetric
from src.models.project_technology import ProjectTechnology
from src.models.skill import Skill
from src.models.technology import Technology
from src.models.visitor_session import VisitorSession

__all__ = [
    "AuditLog",
    "ContactMessage",
    "ContactStatusEnum",
    "EventLog",
    "EventTypeEnum",
    "Experience",
    "MetricUnitEnum",
    "NewsletterSubscriber",
    "Owner",
    "Project",
    "ProjectMetric",
    "ProjectStatusEnum",
    "ProjectTechnology",
    "Skill",
    "SkillCategoryEnum",
    "SkillLevelEnum",
    "Technology",
    "VisitorSession",
]
