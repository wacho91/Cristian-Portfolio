"""Servicio de negocio para el formulario de contacto."""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

from src.models.contact_message import ContactMessage
from src.repositories.contact_repository import ContactRepository
from src.schemas.contact import ContactMessageCreate

logger = logging.getLogger("cristian_portfolio.contact")


class ContactService:
    """Orquesta la recepción, log y persistencia de mensajes de contacto."""

    def __init__(self, repository: ContactRepository) -> None:
        self._repository = repository

    async def register_message(
        self,
        payload: ContactMessageCreate,
        *,
        ip_address: str | None = None,
        user_agent: str | None = None,
        referrer: str | None = None,
        request_id: uuid.UUID | None = None,
    ) -> ContactMessage:
        """Registra el mensaje: log en consola + persistencia en BD."""
        self._log_to_console(payload, ip_address=ip_address, request_id=request_id)

        data = payload.model_dump()
        data.update(
            {
                "ip_address": ip_address,
                "user_agent": user_agent,
                "referrer": referrer,
                "request_id": request_id,
            }
        )
        return await self._repository.create(data)

    @staticmethod
    def _log_to_console(
        payload: ContactMessageCreate,
        *,
        ip_address: str | None,
        request_id: uuid.UUID | None,
    ) -> None:
        """Imprime el mensaje recibido en consola (requisito del endpoint)."""
        ts = datetime.now(timezone.utc).isoformat()
        logger.info(
            "[CONTACT] ts=%s request_id=%s ip=%s name=%s email=%s subject=%s",
            ts,
            request_id,
            ip_address,
            payload.name,
            payload.email,
            payload.subject or "-",
        )
        logger.info("[CONTACT] message=%s", payload.message)
