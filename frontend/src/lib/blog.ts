export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string;
};

export const posts: BlogPost[] = [
  {
    slug: "ai-in-sales",
    title: "AI in sales: what actually works in 2026",
    excerpt: "Separating hype from workflows that shorten cycles and protect brand voice.",
    date: "2026-01-12",
    content:
      "Teams win when AI handles repetitive triage while humans focus on nuance. Start with intent detection, templated drafts, and strict approval paths before expanding autonomy.",
  },
  {
    slug: "automate-follow-ups",
    title: "How to automate follow-ups without sounding robotic",
    excerpt: "Cadence design, personalization tokens, and quiet hours that respect prospects.",
    date: "2026-02-03",
    content:
      "Great follow-ups mirror human timing: short first bump, value-add second touch, and a respectful break. Layer AI summaries so reps pick up threads instantly.",
  },
  {
    slug: "meeting-booking-best-practices",
    title: "Meeting booking best practices for outbound teams",
    excerpt: "Single-use links, reminder hygiene, and pipeline stages that stay honest.",
    date: "2026-03-18",
    content:
      "Tie booking links to intent signals, sync outcomes to your CRM, and always log no-shows back into the sequence engine to avoid duplicate nudges.",
  },
];
