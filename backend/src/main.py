"""Punto de entrada FastAPI — Cristian-Portfolio API.

Responsabilidad única: construir la app, configurar CORS, registrar routers
modulares y gestionar el ciclo de vida (lifespan) de recursos compartidos.
"""
from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database import dispose_db, init_db
from src.routes import api_router

# ---------------------------------------------------------------------------
# Logging global (formato consistente para todos los módulos)
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("cristian_portfolio.main")

# ---------------------------------------------------------------------------
# CORS: orígenes permitidos desde entorno (coma-separados)
# ---------------------------------------------------------------------------
_raw_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173",
)
ALLOWED_ORIGINS: list[str] = [o.strip() for o in _raw_origins.split(",") if o.strip()]


# ---------------------------------------------------------------------------
# Ciclo de vida: init_db al arrancar, dispose_db al apagar
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Gestiona recursos compartidos durante el ciclo de vida de la app."""
    logger.info("Iniciando Cristian-Portfolio API...")
    await init_db()
    logger.info("Base de datos inicializada. CORS origins=%s", ALLOWED_ORIGINS)
    try:
        yield
    finally:
        logger.info("Apagando API, liberando pool de conexiones...")
        await dispose_db()
        logger.info("Recursos liberados correctamente.")


# ---------------------------------------------------------------------------
# Instancia FastAPI
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Cristian-Portfolio API",
    description="Backend del portafolio personal — FastAPI + SQLAlchemy async.",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ---------------------------------------------------------------------------
# Middleware CORS (permite el origen del Frontend)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
    max_age=600,
)

# ---------------------------------------------------------------------------
# Routers modulares bajo /api
# ---------------------------------------------------------------------------
app.include_router(api_router, prefix="/api")


@app.get("/", include_in_schema=False)
async def root() -> dict[str, str]:
    """Redirección informativa a la documentación."""
    return {"service": "cristian-portfolio-api", "docs": "/api/docs"}
