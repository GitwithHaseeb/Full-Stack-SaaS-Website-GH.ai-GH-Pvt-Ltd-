"use client";

import { useState } from "react";
import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";
import { founders, services } from "@/lib/company";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const service = form.get("service");
    const message = String(form.get("message") ?? "");
    setSending(true);
    try {
      await apiFetch<{ message?: string }>("/contact", {
        method: "POST",
        json: {
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company") || null,
          message: service ? `[${service}] ${message}` : message,
        },
      });
      setStatus("Thank you — your message has reached the founders.");
      formEl.reset();
    } catch {
      setStatus("Could not send right now. Please email one of us directly.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 md:grid-cols-[1fr_1.1fr] md:px-6 md:py-24">
          <div className="space-y-6">
            <p className="eyebrow text-navy">Contact</p>
            <h1 className="text-[2.5rem] leading-[1.1] text-navy md:text-5xl">Start a conversation</h1>
            <span className="rule-brass" />
            <p className="text-lg text-ink">
              Tell us where things stand — a quiet page, an old website, a brand that doesn&apos;t match. You&apos;ll hear
              back from one of the founders, not a sales team.
            </p>
            <ul className="divide-y divide-hairline border-y border-hairline pt-0">
              {founders.map((f) => (
                <li key={f.name} className="space-y-1 py-5">
                  <div className="font-display text-xl text-navy">{f.name}</div>
                  <div className="services-line text-ink">{f.focus}</div>
                  <div className="flex flex-wrap gap-x-5 text-sm">
                    <a href={`mailto:${f.email}`} className="inline-flex min-h-11 items-center gap-2 text-navy hover:underline">
                      <Mail className="h-4 w-4" />
                      {f.email}
                    </a>
                    <a
                      href={f.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 text-navy hover:underline"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form className="space-y-5 border border-hairline p-6 md:p-8" onSubmit={onSubmit}>
            <h2 className="text-2xl text-navy">Send a message</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="eyebrow text-navy">
                  Name
                </Label>
                <Input id="name" name="name" required className="h-11 bg-ivory" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="eyebrow text-navy">
                  Email
                </Label>
                <Input id="email" name="email" type="email" required className="h-11 bg-ivory" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="eyebrow text-navy">
                Company <span className="font-normal normal-case tracking-normal text-ink">(optional)</span>
              </Label>
              <Input id="company" name="company" className="h-11 bg-ivory" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="service" className="eyebrow text-navy">
                What do you need?
              </Label>
              <select
                id="service"
                name="service"
                defaultValue=""
                className="flex h-11 w-full rounded-md border border-input bg-ivory px-3 text-sm text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Not sure yet</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="eyebrow text-navy">
                Message
              </Label>
              <Textarea id="message" name="message" required rows={5} className="bg-ivory" />
            </div>
            <Button type="submit" size="lg" disabled={sending}>
              {sending ? "Sending…" : "Send message"}
            </Button>
            {status ? <p className="text-sm text-ink">{status}</p> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
