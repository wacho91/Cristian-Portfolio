"""Router del formulario de contacto (/api/contact)."""
from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.repositories.contact_repository import ContactRepository
from src.schemas.common import ErrorResponse
from src.schemas.contact import ContactMessageCreate, ContactMessageResponse
from src.services.contact_service import ContactService

logger = logging.getLogger("cristian_portfolio.routes.contact")

router = APIRouter()


def _get_service(db: AsyncSession = Depends(get_db)) -> ContactService:
    """Inyecta el servicio con su repositorio (composición por request)."""
    return ContactService(ContactRepository(db))


@router.post(
    "",
    response_model=ContactMessageResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        422: {"model": ErrorResponse, "description": "Payload inválido"},
        500: {"model": ErrorResponse, "description": "Error interno"},
    },
    summary="Recibir mensaje del formulario de contacto",
)
async def create_contact_message(
    payload: ContactMessageCreate,
    request: Request,
    service: ContactService = Depends(_get_service),
) -> ContactMessageResponse:
    """Recibe el mensaje, lo loguea en consola y lo persiste."""
    request_id = uuid.uuid4()
    client_ip = request.client.host if request.client else None

    try:
        entity = await service.register_message(
            payload,
            ip_address=client_ip,
            user_agent=request.headers.get("user-agent"),
            referrer=request.headers.get("referer"),
            request_id=request_id,
        )
    except SQLAlchemyError as exc:
        logger.exception("Fallo al persistir contacto request_id=%s", request_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo procesar el mensaje. Intenta más tarde.",
        ) from exc

    return ContactMessageResponse(
        success=True,
        message="Mensaje recibido correctamente",
        id=entity.id,
        received_at=datetime.now(timezone.utc),
    )
