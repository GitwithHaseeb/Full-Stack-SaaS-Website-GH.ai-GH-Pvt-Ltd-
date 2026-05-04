import asyncio

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import get_settings
from app.core.db_url import asyncpg_engine_kwargs
from app.core.database import Base
from app.models import (  # noqa: F401
    ApiKey,
    CalendlyEvent,
    Campaign,
    EmailLog,
    Lead,
    User,
    WaitlistEntry,
)

config = context.config

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = get_settings().DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    _kw = asyncpg_engine_kwargs(get_settings().DATABASE_URL)
    connectable = create_async_engine(
        str(_kw["url"]),
        poolclass=pool.NullPool,
        connect_args=dict(_kw["connect_args"]) if _kw.get("connect_args") else {},
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
