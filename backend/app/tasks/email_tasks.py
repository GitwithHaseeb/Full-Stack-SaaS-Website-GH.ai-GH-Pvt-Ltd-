import logging

from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="email.send")
def send_email_task(user_id: str, lead_id: str, subject: str, body: str) -> str:
    logger.info("Queued email send user=%s lead=%s subject=%s", user_id, lead_id, subject)
    return "sent"


@celery_app.task(name="email.run_campaign")
def run_campaign_task(user_id: str, campaign_id: str) -> str:
    logger.info("Campaign run user=%s campaign=%s", user_id, campaign_id)
    return "started"
