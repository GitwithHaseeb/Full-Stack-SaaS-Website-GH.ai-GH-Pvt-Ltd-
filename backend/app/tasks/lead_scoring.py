import logging

from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="leads.score")
def score_lead_task(lead_id: str) -> str:
    """Reserved for async recompute; fit_score is set on lead create/update in the API."""
    logger.info("Lead scoring task stub lead=%s", lead_id)
    return "ok"
