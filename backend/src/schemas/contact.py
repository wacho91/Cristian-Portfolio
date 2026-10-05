"""Schemas Pydantic para el recurso contact_message."""
from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from src.models.enums import ContactStatusEnum


class ContactMessageCreate(BaseModel):
    """Payload de entrada del formulario público /api/contact."""

    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: str = Field(..., min_length=2, max_length=80)
    email: EmailStr = Field(..., max_length=255)
    subject: str | None = Field(default=None, max_length=120)
    message: str = Field(..., min_length=10, max_length=5000)

    @field_validator("message")
    @classmethod
    def reject_blank_message(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("El mensaje no puede estar vacío")
        return value


class ContactMessageRead(BaseModel):
    """Representación de salida de un mensaje persistido."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: EmailStr
    subject: str | None
    message: str
    status: ContactStatusEnum
    created_at: datetime


class ContactMessageResponse(BaseModel):
    """Respuesta mínima tras aceptar un mensaje del formulario."""

    success: bool = True
    message: str = "Mensaje recibido correctamente"
    id: uuid.UUID
    received_at: datetime
