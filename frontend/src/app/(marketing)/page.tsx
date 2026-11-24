import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SERVICES_LINE, services } from "@/lib/company";

const socialSteps = [
  "A content calendar you approve once a month",
  "Posts designed, written and scheduled — not sent to you to upload",
  "Comments and messages answered, so enquiries do not go cold",
];

const sectors = ["Logistics", "Manufacturing", "Retail", "Professional services"];

export default function HomePage() {
  return (
    <div>
      {/* Hero — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-[1.25fr_1fr] md:px-6 md:py-28">
          <div className="space-y-7">
            <p className="services-line text-navy">{SERVICES_LINE}</p>
            <h1 className="text-[2.5rem] leading-[1.1] text-navy md:text-6xl">
              Design and systems for companies that have outgrown DIY
            </h1>
            <span className="rule-brass" />
            <p className="max-w-xl text-lg text-ink">
              Graphic design, social media management, websites and IT — from one team, on one system, so everything
              you put out looks like it came from the same company.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start a conversation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-navy text-navy">
                <Link href="/services">See services</Link>
              </Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm md:max-w-none">
            <Image
              src="/brand/gh-lockup-navy-1000.png"
              alt="GH Pvt Ltd monogram and wordmark"
              width={1000}
              height={1000}
              priority
              sizes="(max-width: 768px) 90vw, 440px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* Problem — Navy */}
      <section className="section-dark bg-navy text-mist">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <p className="eyebrow mb-6 text-ivory">The problem</p>
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
            <h2 className="text-3xl text-ivory md:text-[2.75rem] md:leading-[1.15]">
              Most businesses don&apos;t have a branding problem. They have a consistency problem.
            </h2>
            <div className="space-y-6">
              <span className="rule-brass" />
              <p className="text-lg">
                A logo made in one place. Posters from somewhere else. A website built by a cousin. A page nobody has
                touched in two years. Each piece is fine on its own. Together they read as unserious — and that costs
                real work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <p className="eyebrow text-navy">What we do</p>
              <h2 className="text-4xl text-navy md:text-5xl">Four things. One team.</h2>
            </div>
            <Link href="/services" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-navy hover:underline">
              All services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services#${s.slug}`}
                className="group flex flex-col gap-4 bg-ivory p-7"
              >
                <span className="font-display text-3xl text-brass">{s.num}</span>
                <h3 className="text-xl text-navy underline-offset-4 group-hover:underline">{s.title}</h3>
                <p className="flex-1 text-[15px] text-ink">{s.summary}</p>
                <span className="eyebrow text-navy">{s.soldAs}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social — Navy */}
      <section className="section-dark bg-navy text-mist">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2 md:px-6 md:py-28">
          <div className="space-y-6">
            <p className="eyebrow text-ivory">Social media management</p>
            <h2 className="text-3xl text-ivory md:text-[2.75rem] md:leading-[1.15]">We run the page. Not just design for it.</h2>
            <span className="rule-brass" />
            <p className="text-lg">
              Most designers hand you files and leave. Social media is not a file — it is a habit.
            </p>
          </div>
          <ol className="divide-y divide-rule border-y border-rule">
            {socialSteps.map((step, i) => (
              <li key={step} className="flex gap-6 py-6">
                <span className="font-display text-3xl leading-none text-brass-light">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg text-ivory">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About — Ivory */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-end">
            <div className="space-y-4">
              <p className="eyebrow text-navy">About</p>
              <h2 className="text-4xl text-navy md:text-5xl">You talk to the people doing the work.</h2>
            </div>
            <div className="space-y-5">
              <p className="text-lg text-ink">
                GH Pvt Ltd is a design and technology studio. Small team, on purpose — no account manager in between. We work with people and businesses across:
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {sectors.map((s) => (
                  <li key={s} className="services-line text-navy">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA — Navy */}
      <section className="section-dark bg-navy text-mist">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center md:px-6 md:py-32">
          <span className="rule-brass mx-auto mb-8" />
          <h2 className="text-3xl text-ivory md:text-5xl md:leading-[1.15]">
            If your page has gone quiet or your site still says &ldquo;coming soon,&rdquo; that&apos;s the conversation.
          </h2>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-ivory text-navy hover:bg-ivory/90">
              <Link href="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
