from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai_agent,
    api_keys,
    auth,
    calendly,
    campaigns,
    dev_reset,
    email,
    leads,
    pipeline,
    users,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(leads.router)
api_router.include_router(pipeline.router)
api_router.include_router(campaigns.router)
api_router.include_router(ai_agent.router)
api_router.include_router(calendly.router)
api_router.include_router(email.router)
api_router.include_router(api_keys.router)
api_router.include_router(dev_reset.router)
