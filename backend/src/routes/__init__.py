"""Registro central de routers de la API."""
from fastapi import APIRouter

from src.routes.contact import router as contact_router
from src.routes.health import router as health_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["health"])
api_router.include_router(contact_router, prefix="/contact", tags=["contact"])

__all__ = ["api_router"]
