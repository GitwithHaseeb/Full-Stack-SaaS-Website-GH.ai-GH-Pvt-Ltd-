"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api-client";
import type { Campaign } from "@/types";

export default function CampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiDraft, setAiDraft] = useState("");

  async function refresh() {
    const data = await apiFetch<Campaign[]>("/campaigns/");
    setItems(data);
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function createCampaign(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await apiFetch("/campaigns/", {
      method: "POST",
      json: {
        name: form.get("name"),
        trigger_type: form.get("trigger_type"),
        trigger_days: form.get("trigger_days") ? Number(form.get("trigger_days")) : null,
        subject: form.get("subject"),
        body: form.get("body"),
      },
    });
    setOpen(false);
    await refresh();
  }

  async function generate() {
    const res = await apiFetch<{ draft: string }>("/ai-agent/generate-reply", {
      method: "POST",
      json: { email_content: `Write a concise outbound email about: ${aiTopic}` },
    });
    setAiDraft(res.draft);
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">Sequences, triggers, and AI-assisted templates.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={aiOpen} onOpenChange={setAiOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">AI template</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI-assisted template</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label htmlFor="topic">Describe the offer</Label>
                <Input id="topic" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} />
                <Button type="button" onClick={() => void generate()}>
                  Draft with AI
                </Button>
                <Textarea value={aiDraft} onChange={(e) => setAiDraft(e.target.value)} rows={8} />
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>New campaign</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create campaign</DialogTitle>
              </DialogHeader>
              <form className="space-y-3" onSubmit={createCampaign}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger_type">Trigger</Label>
                  <Input id="trigger_type" name="trigger_type" defaultValue="new_lead" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger_days">After X days (optional)</Label>
                  <Input id="trigger_days" name="trigger_days" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body</Label>
                  <Textarea id="body" name="body" rows={6} />
                </div>
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>Trigger: {c.trigger_type}</div>
              <div>Subject: {c.subject || "—"}</div>
              <div className="line-clamp-4 whitespace-pre-wrap">{c.body || "—"}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
