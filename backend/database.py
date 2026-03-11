"""
database.py – Async SQLAlchemy engine, session factory, and base model.
All modules import `get_db` to receive a per-request async session.
"""

import logging
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from config import settings

logger = logging.getLogger(__name__)

# ── Engine ────────────────────────────────────────────────────────────────────
# `echo=True` logs every SQL statement – disable in production
engine = create_async_engine(settings.DATABASE_URL, echo=settings.DEBUG, future=True)

# ── Session factory ───────────────────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,   # objects remain accessible after commit
    autoflush=False,
    autocommit=False,
)


# ── Declarative base ──────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    """All ORM models inherit from this base class."""
    pass


# ── Dependency ────────────────────────────────────────────────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields a database session.
    The session is automatically closed after the request finishes.

    Yields:
        AsyncSession: The database asynchronous session.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception as e:
            logger.error(f"Rolling back session due to error: {e}")
            await session.rollback()
            raise


# ── Table creation helper ─────────────────────────────────────────────────────
async def create_tables() -> None:
    """Create all tables on startup (development convenience)."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Failed to create tables: {e}")
        raise
