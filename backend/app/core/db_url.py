"""Normalize PostgreSQL URLs for asyncpg (sslmode in query string is not a valid asyncpg kwarg)."""

from __future__ import annotations

from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse


def asyncpg_engine_kwargs(database_url: str) -> dict[str, object]:
    """
    Strip sslmode (and channel_binding) from the URL; asyncpg does not accept those as connect kwargs.
    Hosted DBs (Neon, etc.) often append ?sslmode=require&channel_binding=require.
    """
    parsed = urlparse(database_url)
    pairs = parse_qsl(parsed.query, keep_blank_values=True)
    kept: list[tuple[str, str]] = []
    ssl_on = False
    for key, val in pairs:
        lk = key.lower()
        if lk == "sslmode":
            v = (val or "").lower()
            if v in ("require", "verify-ca", "verify-full", "prefer"):
                ssl_on = True
            continue
        if lk == "channel_binding":
            continue
        kept.append((key, val))
    query = urlencode(kept)
    clean = urlunparse(parsed._replace(query=query))
    out: dict[str, object] = {"url": clean}
    if ssl_on:
        out["connect_args"] = {"ssl": True}
    return out
