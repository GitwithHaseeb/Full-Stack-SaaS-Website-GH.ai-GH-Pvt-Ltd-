"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

export default function WaitlistPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const res = await apiFetch<{ message?: string }>("/waitlist", {
        method: "POST",
        json: { email: form.get("email") },
      });
      setMessage(res.message || "Thank you, we will notify you.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Join the GH.ai waitlist</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@company.com" />
            </div>
            <Button type="submit" className="w-full">
              Notify me
            </Button>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
