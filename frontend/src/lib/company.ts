export const SERVICES_LINE = "Design · Social · Web · IT";

export type Service = {
  num: string;
  slug: string;
  title: string;
  summary: string;
  covers: string[];
  soldAs: string;
};

/** Always listed in this order — social sits second because it is the recurring work (BRAND.md §6). */
export const services: Service[] = [
  {
    num: "01",
    slug: "design",
    title: "Graphic design",
    summary: "Logos, brand identity, posters, banners and packaging artwork that all look like one company.",
    covers: ["Logos and brand identity", "Posters and banners", "Packaging artwork", "Brand guidelines"],
    soldAs: "Per piece",
  },
  {
    num: "02",
    slug: "social",
    title: "Social media & marketing",
    summary: "We run the page — calendar, design, posting, replies — and the campaigns that bring people to it.",
    covers: [
      "Monthly content calendar",
      "Post design, copy and scheduling",
      "Comments and messages answered",
      "Campaigns and paid promotion",
    ],
    soldAs: "Monthly retainer",
  },
  {
    num: "03",
    slug: "web",
    title: "Website development & management",
    summary: "Business sites, landing pages and e-commerce — built, then kept fast, secure and up to date.",
    covers: [
      "Business sites and landing pages",
      "E-commerce stores",
      "WordPress and custom builds",
      "Updates, backups and maintenance",
    ],
    soldAs: "Project + maintenance",
  },
  {
    num: "04",
    slug: "it",
    title: "IT & software development",
    summary: "Hosting, domains and email set up properly — and custom software when off-the-shelf stops fitting.",
    covers: [
      "Hosting, domains and email setup",
      "Custom software and web apps",
      "Dashboards, automation and integrations",
      "Ongoing support",
    ],
    soldAs: "Support hours or project",
  },
];

/** The only way to reach us is email. No names, photos or social profiles on the site. */
export const contactEmails = ["haseebch8130@gmail.com", "ghaniatanveer061@gmail.com"];
