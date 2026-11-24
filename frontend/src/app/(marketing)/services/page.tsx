import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SERVICES_LINE, services } from "@/lib/company";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Graphic design, social media management and marketing, website development and management, IT and software development — from one team.",
};

const engagement = [
  { title: "Per piece", body: "A logo, a poster, a packaging run. Quoted up front, delivered as final files." },
  { title: "Monthly retainer", body: "Social media and marketing. One calendar, approved once a month, run by us." },
  { title: "Project + maintenance", body: "A website or software build, then a fixed monthly plan to keep it healthy." },
  { title: "Support hours", body: "Hosting, domains, email and IT support, billed by the hour as you use it." },
];

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-24">
          <p className="services-line mb-6 text-navy">{SERVICES_LINE}</p>
          <h1 className="max-w-3xl text-[2.5rem] leading-[1.1] text-navy md:text-6xl">Four things. One team.</h1>
          <span className="rule-brass my-8" />
          <p className="max-w-2xl text-lg text-ink">
            We handle how a company looks and how it runs online — for individuals, small businesses and growing
            companies — so everything it puts out comes from one place.
          </p>
        </div>
      </section>

      {services.map((s, i) => {
        const dark = i % 2 === 0;
        return (
          <section
            key={s.slug}
            id={s.slug}
            className={dark ? "section-dark scroll-mt-20 bg-navy text-mist" : "scroll-mt-20 bg-ivory text-ink"}
          >
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[auto_1fr_1fr] md:px-6">
              <span className={`font-display text-5xl leading-none ${dark ? "text-brass-light" : "text-brass"}`}>
                {s.num}
              </span>
              <div className="space-y-5">
                <h2 className={`text-3xl md:text-4xl ${dark ? "text-ivory" : "text-navy"}`}>{s.title}</h2>
                <p className="text-lg">{s.summary}</p>
                <p className={`eyebrow ${dark ? "text-ivory" : "text-navy"}`}>Sold as · {s.soldAs}</p>
              </div>
              <ul className={`divide-y border-y ${dark ? "divide-rule border-rule" : "divide-hairline border-hairline"}`}>
                {s.covers.map((c) => (
                  <li key={c} className={`py-4 ${dark ? "text-ivory" : "text-navy"}`}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="section-dark bg-navy text-mist">
        <div className="mx-auto max-w-6xl border-t border-rule px-4 py-20 md:px-6">
          <p className="eyebrow mb-4 text-ivory">How engagements work</p>
          <h2 className="mb-12 max-w-2xl text-3xl text-ivory md:text-4xl">Priced the way each kind of work is actually done.</h2>
          <div className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
            {engagement.map((e) => (
              <div key={e.title} className="space-y-3 bg-navy p-6">
                <h3 className="text-xl text-ivory">{e.title}</h3>
                <p className="text-[15px]">{e.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Button asChild size="lg" className="bg-ivory text-navy hover:bg-ivory/90">
              <Link href="/contact">Start a conversation</Link>
            </Button>
            <p className="text-sm">Tell us what you have today. We&apos;ll tell you what we would change first.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
