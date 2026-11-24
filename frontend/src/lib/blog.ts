export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  content: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "consistency-not-branding",
    title: "You don't have a branding problem. You have a consistency problem.",
    excerpt: "Why a logo, a page and a website made in three different places cost you work — and how to fix it.",
    date: "2026-11-10",
    content: [
      "Most companies we meet already have a logo. What they don't have is one system: the logo came from one designer, the posters from another, the website from a relative, and the social page from whoever had time.",
      "Each piece is fine on its own. Side by side they read as unserious — different colours, different fonts, different tones of voice. A buyer comparing you to a competitor notices that before they read a word.",
      "The fix is not a rebrand. It is a short list of rules — two colours, two fonts, one mark, used the same way everywhere — and one team applying them to everything you put out.",
    ],
  },
  {
    slug: "social-media-is-a-habit",
    title: "Social media is not a file. It is a habit.",
    excerpt: "Why handing over designed posts isn't enough, and what a managed page actually involves.",
    date: "2026-10-22",
    content: [
      "A designer can send you thirty beautiful posts. Three weeks later, half of them are still in a folder because nobody had time to upload them, write captions or answer the comments.",
      "A managed page works differently: one content calendar you approve once a month, posts designed, written and scheduled for you, and messages answered so enquiries do not go cold.",
      "The result is a page that looks alive every week — which is what a potential customer is checking for when they find you.",
    ],
  },
  {
    slug: "coming-soon-is-costing-you",
    title: "If your website still says “coming soon”, it is costing you",
    excerpt: "What a small business site needs on day one — and what can wait.",
    date: "2026-09-30",
    content: [
      "A business website does not need to be large. It needs to load fast, say clearly what you do, show proof that you have done it, and make it easy to get in touch.",
      "Behind it you need the boring parts done properly: a domain you own, hosting that is backed up, and a business email address instead of a personal one.",
      "After launch, the site needs someone to keep it updated. A site nobody has touched in two years sends the same message as a page nobody posts on.",
    ],
  },
];
