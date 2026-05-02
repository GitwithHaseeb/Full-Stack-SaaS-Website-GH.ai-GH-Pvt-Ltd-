import logging
from typing import Annotated

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.v1.api import api_router
from app.api.v1.deps import get_db
from app.api.v1.endpoints import webhooks
from app.core.config import get_settings
from app.core.limiter import limiter
from app.models.waitlist import WaitlistEntry
from app.schemas.email import ContactFormRequest
from app.schemas.waitlist import WaitlistRequest

logger = logging.getLogger(__name__)
settings = get_settings()

app = FastAPI(title="GH.ai API", version="1.0.0")
app.state.limiter = limiter


async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse({"detail": "Rate limit exceeded"}, status_code=429)


app.add_exception_handler(RateLimitExceeded, rate_limit_handler)
app.add_middleware(SlowAPIMiddleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/webhooks")


@app.post("/api/v1/waitlist")
async def join_waitlist(
    body: WaitlistRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict[str, str]:
    existing = await db.execute(select(WaitlistEntry).where(WaitlistEntry.email == body.email))
    if existing.scalar_one_or_none():
        return {"status": "ok", "message": "Already registered"}
    db.add(WaitlistEntry(email=str(body.email)))
    await db.flush()
    return {"status": "ok", "message": "Thank you, we will notify you."}


@app.post("/api/v1/contact")
async def contact_form(body: ContactFormRequest) -> dict[str, str]:
    logger.info(
        "Contact submission from=%s to founders: %s / %s",
        body.email,
        "ghaniatanveer061@gmail.com",
        "haseebch8130@gmail.com",
    )
    return {"status": "ok", "message": "Message received. Our team will respond shortly."}


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
