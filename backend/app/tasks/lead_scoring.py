import logging

from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="leads.score")
def score_lead_task(lead_id: str) -> str:
    logger.info("Lead scoring placeholder lead=%s", lead_id)
    return "ok"
