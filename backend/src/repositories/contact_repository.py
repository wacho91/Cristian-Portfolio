"""Repositorio de persistencia para ContactMessage."""
from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.contact_message import ContactMessage


class ContactRepository:
    """Encapsula el acceso a datos de contact_message (sin lógica de negocio)."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(self, payload: dict) -> ContactMessage:
        """Inserta un nuevo mensaje y devuelve la entidad persistida."""
        entity = ContactMessage(**payload)
        self._session.add(entity)
        await self._session.flush()
        await self._session.refresh(entity)
        return entity

    async def get_by_id(self, message_id: uuid.UUID) -> ContactMessage | None:
        """Recupera un mensaje por su identificador."""
        stmt = select(ContactMessage).where(ContactMessage.id == message_id)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_recent(self, limit: int = 50) -> list[ContactMessage]:
        """Lista los mensajes más recientes (uso administrativo)."""
        stmt = (
            select(ContactMessage)
            .order_by(ContactMessage.created_at.desc())
            .limit(limit)
        )
        result = await self._session.execute(stmt)
        return list(result.scalars().all())
