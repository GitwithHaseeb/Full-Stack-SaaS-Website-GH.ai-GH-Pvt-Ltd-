import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FoundersGrid } from "@/components/marketing/founders";

export const metadata: Metadata = {
  title: "About",
  description:
    "GH Pvt Ltd is a design and technology studio founded by Muhammad Haseeb and Ghania Tanveer. Small team, on purpose.",
};

const principles = [
  {
    title: "One source",
    body: "Your logo, page, posts and website come from the same team, so they finally look like the same company.",
  },
  {
    title: "Small, on purpose",
    body: "You talk to the founders and the people doing the work — never an account manager relaying messages.",
  },
  {
    title: "We run it",
    body: "We don't hand over files and disappear. Pages get posted, sites get updated, support gets answered.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p className="eyebrow mb-6 text-navy">About GH Pvt Ltd</p>
          <h1 className="max-w-4xl text-[2.5rem] leading-[1.1] text-navy md:text-6xl">
            A design and technology studio. Small team, on purpose.
          </h1>
          <span className="rule-brass my-8" />
          <p className="max-w-2xl text-lg text-ink">
            GH Pvt Ltd is a design and technology studio — you talk to the people doing the work, not an account manager.
            We serve individuals and businesses with social media handling, marketing, graphic design, website
            development and management, and custom software. Clients across logistics, manufacturing, retail and
            professional services.
          </p>
        </div>
      </section>

      <section className="section-dark bg-navy text-mist">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <p className="eyebrow mb-10 text-ivory">How we work</p>
          <div className="grid gap-px border border-rule bg-rule md:grid-cols-3">
            {principles.map((p, i) => (
              <div key={p.title} className="space-y-4 bg-navy p-8">
                <span className="font-display text-3xl text-brass-light">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="text-2xl text-ivory">{p.title}</h2>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p className="eyebrow mb-4 text-navy">Founders</p>
          <h2 className="mb-12 text-4xl text-navy md:text-5xl">Muhammad Haseeb &amp; Ghania Tanveer</h2>
          <FoundersGrid priority />
        </div>
      </section>

      <section className="section-dark bg-navy text-mist">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-20 md:flex-row md:items-center md:justify-between md:px-6">
          <h2 className="max-w-2xl text-3xl text-ivory md:text-4xl">Want to see what we would change first?</h2>
          <Button asChild size="lg" className="bg-ivory text-navy hover:bg-ivory/90">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
