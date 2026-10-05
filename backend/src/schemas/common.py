"""Schemas comunes reutilizables por toda la API."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ErrorResponse(BaseModel):
    """Respuesta estándar de error HTTP."""

    detail: str = Field(..., description="Mensaje legible del error")
    code: str | None = Field(default=None, description="Código interno opcional")
    request_id: str | None = Field(default=None, description="ID de correlación")


class HealthResponse(BaseModel):
    """Respuesta del endpoint de healthcheck."""

    status: str = Field(default="ok")
    service: str = Field(default="cristian-portfolio-api")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class PaginationMeta(BaseModel):
    """Metadatos de paginación para listados."""

    model_config = ConfigDict(from_attributes=True)

    total: int = Field(ge=0)
    page: int = Field(ge=1)
    page_size: int = Field(ge=1, le=100)
