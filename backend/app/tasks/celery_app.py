from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "ghai",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

celery_app.conf.task_default_queue = "ghai"

import app.tasks.email_tasks  # noqa: E402,F401
import app.tasks.lead_scoring  # noqa: E402,F401
