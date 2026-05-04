"""Async SQLAlchemy engine targeting PostgreSQL via asyncpg (see Settings.DATABASE_URL)."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings
from app.core.db_url import asyncpg_engine_kwargs

settings = get_settings()

_engine_kw = asyncpg_engine_kwargs(settings.DATABASE_URL)
engine = create_async_engine(
    str(_engine_kw["url"]),
    echo=False,
    pool_pre_ping=True,
    connect_args=dict(_engine_kw["connect_args"]) if _engine_kw.get("connect_args") else {},
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
