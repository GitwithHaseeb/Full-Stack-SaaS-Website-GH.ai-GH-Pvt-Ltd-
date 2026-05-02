import json
import re
from typing import Any, Literal

from app.core.config import get_settings

Intent = Literal["schedule_meeting", "question", "ignore"]


def _detect_intent(text: str) -> Intent:
    lowered = text.lower()
    if re.search(r"\b(meeting|schedule|call|available|book|demo)\b", lowered):
        return "schedule_meeting"
    if len(lowered.strip()) < 3:
        return "ignore"
    return "question"


async def classify_and_draft(
    raw_email: str,
    custom_instructions: str = "",
    human_in_loop: bool = False,
) -> dict[str, Any]:
    settings = get_settings()
    intent = _detect_intent(raw_email)

    system = (
        "You are an AI sales agent for GH.ai. Your job is to answer questions, qualify leads, "
        "and propose a meeting link if interested. If the email contains meeting/schedule/call/available "
        "→ intent = schedule_meeting. Otherwise answer normally and ask if they'd like a demo."
    )
    if custom_instructions:
        system += f"\nUser preferences: {custom_instructions}"

    draft = ""
    if settings.OPENAI_API_KEY:
        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            completion = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system},
                    {
                        "role": "user",
                        "content": f"Classify intent (schedule_meeting|question|ignore) and draft reply. "
                        f"Respond as JSON: {{\"intent\": \"...\", \"draft\": \"...\"}}\n\nEmail:\n{raw_email}",
                    },
                ],
                temperature=0.4,
            )
            content = completion.choices[0].message.content or ""
            try:
                data = json.loads(content)
                intent = data.get("intent", intent)  # type: ignore[assignment]
                draft = data.get("draft", "")
            except json.JSONDecodeError:
                draft = content
        except Exception:
            draft = _fallback_draft(intent, raw_email)
    else:
        draft = _fallback_draft(intent, raw_email)

    return {
        "intent": intent,
        "draft": draft,
        "human_in_loop": human_in_loop,
    }


def _fallback_draft(intent: Intent, raw_email: str) -> str:
    if intent == "schedule_meeting":
        return (
            "Thanks for your interest in scheduling time with GH.ai. "
            "Here is your one-time booking link (demo): https://calendly.com/gh-ai/demo — "
            "pick a slot that works for you."
        )
    if intent == "ignore":
        return ""
    return (
        "Thanks for reaching out to GH.ai. I'd love to learn more about your goals and "
        "share how we automate outbound and booking. Would you like a quick demo this week?"
    )


async def generate_reply(email_content: str, custom_instructions: str = "") -> dict[str, Any]:
    result = await classify_and_draft(email_content, custom_instructions, False)
    return {"draft": result["draft"], "intent": result["intent"]}
