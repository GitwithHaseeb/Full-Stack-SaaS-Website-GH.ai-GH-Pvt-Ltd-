import Link from "next/link";
import { ArrowRight, Calendar, Mail, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const features = [
  {
    title: "Email Automation",
    body: "Warm inboxes, sequence outreach, and track replies without leaving GH.ai.",
    icon: Mail,
  },
  {
    title: "Pipeline Tracking",
    body: "Kanban stages from first touch to closed — always synced with real activity.",
    icon: Workflow,
  },
  {
    title: "Calendly Integration",
    body: "When prospects are ready to talk, drop a booking link and update the pipeline automatically.",
    icon: Calendar,
  },
];

const steps = [
  { title: "Connect channels", body: "Link Gmail and Calendly so GH.ai can send and book on your behalf." },
  { title: "Launch AI agent", body: "Define tone, guardrails, and human-in-the-loop approvals." },
  { title: "Close faster", body: "Watch meetings populate while the agent qualifies inbound replies." },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-border bg-gradient-to-b from-slate-50 to-background dark:from-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 md:flex-row md:items-center md:py-28">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">GH Pvt Ltd</p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">AI Sales Agent that books meetings automatically</h1>
            <p className="text-lg text-muted-foreground">
              Find leads, automate outreach, close more deals with GH.ai — inspired by modern outbound, built for serious
              teams.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/waitlist" className="inline-flex items-center">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
          <Card className="flex-1 border-primary/20 bg-card/80 shadow-lg backdrop-blur">
            <CardHeader>
              <CardTitle>Pipeline snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span>New Lead</span>
                <span className="font-semibold text-foreground">128</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span>Meeting Scheduled</span>
                <span className="font-semibold text-foreground">34</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span>Reply rate</span>
                <span className="font-semibold text-primary">18%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold">Built for revenue teams</h2>
          <p className="mt-2 text-muted-foreground">Everything you need to run outbound like a product.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-border/80">
              <CardHeader>
                <f.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-xl">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{f.body}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-slate-50 py-16 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-3xl font-semibold">How it works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-3 text-sm font-semibold text-primary">Step {i + 1}</div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-center text-3xl font-semibold">Loved by outbound teams</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["Acme Outbound", "Northwind Labs", "Contoso Revenue"].map((org, idx) => (
            <Card key={org}>
              <CardContent className="flex flex-col gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://randomuser.me/api/portraits/${idx % 2 === 0 ? "women" : "men"}/${40 + idx}.jpg`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{org}</div>
                    <div className="text-xs text-muted-foreground">GTM Lead</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  “GH.ai tightened our follow-up loop and made demos predictable. The AI drafts feel on-brand.”
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
