import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const timeline = [
  { year: "2024", title: "GH.ai concept", body: "Explored AI-assisted outbound for SMB and mid-market teams." },
  { year: "2025", title: "Private beta", body: "Shipped Gmail + Calendly automations with human-in-the-loop controls." },
  { year: "2026", title: "GH Pvt Ltd launch", body: "Production platform for pipeline, campaigns, and analytics." },
];

const values = ["Customer obsession", "Craft in software", "Transparency in AI"];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">About GH.ai</h1>
        <p className="text-lg text-muted-foreground">
          GH Pvt Ltd empowers sales teams with AI-driven pipeline automation — from first touch to booked meeting.
        </p>
      </div>

      <section className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Image
              src="https://placehold.co/400x400/png?text=Ghania+Tanveer"
              alt="Ghania Tanveer"
              width={400}
              height={400}
              className="w-full rounded-lg object-cover"
            />
            <h3 className="text-xl font-semibold">Ghania Tanveer</h3>
            <p className="text-sm text-muted-foreground">CEO, Co-Founder — leads product vision and customer success.</p>
            <a className="text-sm text-primary" href="mailto:ghaniatanveer061@gmail.com">
              ghaniatanveer061@gmail.com
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Image
              src="https://placehold.co/400x400/png?text=Muhammad+Haseeb"
              alt="Muhammad Haseeb"
              width={400}
              height={400}
              className="w-full rounded-lg object-cover"
            />
            <h3 className="text-xl font-semibold">Muhammad Haseeb</h3>
            <p className="text-sm text-muted-foreground">CEO, Co-Founder — leads engineering and go-to-market systems.</p>
            <a className="text-sm text-primary" href="mailto:haseebch8130@gmail.com">
              haseebch8130@gmail.com
            </a>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Company timeline</h2>
        <div className="space-y-4">
          {timeline.map((t) => (
            <div key={t.year} className="rounded-lg border p-4">
              <div className="text-sm font-semibold text-primary">{t.year}</div>
              <div className="text-lg font-medium">{t.title}</div>
              <p className="text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Core values</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {values.map((v) => (
            <li key={v} className="rounded-lg border bg-card p-4 text-center font-medium">
              {v}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
