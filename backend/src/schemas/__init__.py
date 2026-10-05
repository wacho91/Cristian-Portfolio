"""Registro central de schemas Pydantic (capa de presentación)."""
from src.schemas.common import ErrorResponse, HealthResponse, PaginationMeta
from src.schemas.contact import (
    ContactMessageCreate,
    ContactMessageRead,
    ContactMessageResponse,
)

__all__ = [
    "ContactMessageCreate",
    "ContactMessageRead",
    "ContactMessageResponse",
    "ErrorResponse",
    "HealthResponse",
    "PaginationMeta",
]
