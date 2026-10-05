"""
Configuración de la conexión a base de datos (SQLAlchemy 2.0 async).

Responsabilidad única: exponer engine, session factory y Base declarativa.
No conoce modelos ni lógica de negocio (Clean Architecture).
"""
from __future__ import annotations

import os
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import DeclarativeBase

# ---------------------------------------------------------------------------
# Configuración vía entorno (12-factor). Fallback a SQLite async para dev.
# ---------------------------------------------------------------------------
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./cristian_portfolio.db",
)

ECHO_SQL: bool = os.getenv("DB_ECHO", "false").lower() == "true"

# ---------------------------------------------------------------------------
# Engine asíncrono
# ---------------------------------------------------------------------------
engine: AsyncEngine = create_async_engine(
    DATABASE_URL,
    echo=ECHO_SQL,
    pool_pre_ping=True,
    future=True,
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------
AsyncSessionLocal: async_sessionmaker[AsyncSession] = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


# ---------------------------------------------------------------------------
# Base declarativa (SQLAlchemy 2.0 style)
# ---------------------------------------------------------------------------
class Base(DeclarativeBase):
    """Base declarativa compartida por todos los modelos."""


# ---------------------------------------------------------------------------
# Dependencia FastAPI
# ---------------------------------------------------------------------------
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provee una sesión async por request, con rollback ante excepción."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db() -> None:
    """Crea las tablas (útil en dev/test). En prod usar Alembic."""
    # Importa modelos para registrarlos en Base.metadata
    from src import models  # noqa: F401

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def dispose_db() -> None:
    """Cierra el pool de conexiones (shutdown)."""
    await engine.dispose()
