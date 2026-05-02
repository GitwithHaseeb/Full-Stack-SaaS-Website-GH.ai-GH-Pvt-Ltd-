"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      await apiFetch<{ message?: string }>("/contact", {
        method: "POST",
        json: {
          name: form.get("name"),
          email: form.get("email"),
          company: form.get("company") || null,
          message: form.get("message"),
        },
      });
      setStatus("Thanks — your message was sent to our founders.");
      e.currentTarget.reset();
    } catch {
      setStatus("Could not send right now. Please email us directly.");
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold">Contact</h1>
        <p className="mt-3 text-muted-foreground">
          Talk with GH Pvt Ltd about pilots, partnerships, or enterprise rollout.
        </p>
        <div className="mt-8 space-y-3 text-sm">
          <div>
            <div className="font-semibold">Ghania Tanveer</div>
            <a className="text-primary" href="mailto:ghaniatanveer061@gmail.com">
              ghaniatanveer061@gmail.com
            </a>
          </div>
          <div>
            <div className="font-semibold">Muhammad Haseeb</div>
            <a className="text-primary" href="mailto:haseebch8130@gmail.com">
              haseebch8130@gmail.com
            </a>
          </div>
          <div className="pt-4 text-muted-foreground">Phone: +92-300-0000000 (placeholder)</div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Send a message</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" required rows={5} />
            </div>
            <Button type="submit">Submit</Button>
            {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
