"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api-client";

export default function SettingsPage() {
  const [calendly, setCalendly] = useState("");
  const [tz, setTz] = useState("UTC");
  const [status, setStatus] = useState<string | null>(null);

  async function connectCalendly() {
    await apiFetch("/calendly/connect", { method: "POST", json: { token: calendly } });
    setStatus("Calendly token saved (encrypted server-side).");
  }

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await apiFetch("/users/me", {
      method: "PUT",
      json: { timezone: form.get("timezone"), working_hours: { start: form.get("start"), end: form.get("end") } },
    });
    setStatus("Profile updated.");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Connect Gmail (OAuth) and Calendly, set availability.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gmail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            OAuth wiring is environment-specific. Add your Google OAuth client in backend `.env` and expose a consent URL
            from your deployment.
          </p>
          <Button variant="outline" disabled>
            Connect Gmail (configure OAuth)
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Calendly</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="cal">Personal access token</Label>
          <Input id="cal" value={calendly} onChange={(e) => setCalendly(e.target.value)} placeholder="pat_..." />
          <Button type="button" onClick={() => void connectCalendly()}>
            Save token
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Working hours</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={saveProfile}>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" value={tz} onChange={(e) => setTz(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <Input id="start" name="start" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <Input id="end" name="end" defaultValue="17:00" />
              </div>
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
