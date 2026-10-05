"""Router de healthcheck."""
from __future__ import annotations

from fastapi import APIRouter, status

from src.schemas.common import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Estado del servicio",
)
async def health_check() -> HealthResponse:
    """Devuelve el estado básico del backend."""
    return HealthResponse()
