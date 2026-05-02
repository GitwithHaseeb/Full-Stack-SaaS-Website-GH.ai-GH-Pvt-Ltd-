"""Default pipeline stage ordering for GH.ai (also enforced on Lead.pipeline_stage)."""

DEFAULT_STAGES: list[dict[str, str | int]] = [
    {"key": "New Lead", "order": 0},
    {"key": "Contacted", "order": 1},
    {"key": "Meeting Scheduled", "order": 2},
    {"key": "Closed", "order": 3},
]
