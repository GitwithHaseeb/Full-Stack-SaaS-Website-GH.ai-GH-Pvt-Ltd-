"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiFetch } from "@/lib/api-client";
import type { Lead } from "@/types";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  async function refresh() {
    const data = await apiFetch<Lead[]>("/leads/");
    setLeads(data);
  }

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return leads;
    return leads.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase()));
  }, [leads, q]);

  async function addLead(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const src = String(form.get("source") || "").trim();
    await apiFetch("/leads/", {
      method: "POST",
      json: {
        name: form.get("name"),
        email: form.get("email"),
        company: form.get("company") || null,
        pipeline_stage: "New Lead",
        ...(src ? { acquisition_source: src } : {}),
      },
    });
    setOpen(false);
    await refresh();
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm text-muted-foreground">Search, filter, and drill into conversations.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} className="w-56" />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New lead</DialogTitle>
              </DialogHeader>
              <form className="space-y-3" onSubmit={addLead}>
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
                  <Label htmlFor="source">Source (optional)</Label>
                  <Input id="source" name="source" placeholder="e.g. LinkedIn, referral, import" />
                </div>
                <Button type="submit" className="w-full">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fit</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Last contacted</TableHead>
                <TableHead>AI Agent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">
                    <Link className="text-primary hover:underline" href={`/dashboard/leads/${l.id}`}>
                      {l.name}
                    </Link>
                  </TableCell>
                  <TableCell>{l.email}</TableCell>
                  <TableCell>{l.fit_score != null && l.fit_score !== undefined ? `${l.fit_score}/100` : "—"}</TableCell>
                  <TableCell className="max-w-[140px] truncate text-muted-foreground">{l.acquisition_source || "—"}</TableCell>
                  <TableCell>{l.pipeline_stage}</TableCell>
                  <TableCell>{l.last_contacted_at ? new Date(l.last_contacted_at).toLocaleString() : "—"}</TableCell>
                  <TableCell>{l.assigned_agent ? "Enabled" : "Off"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
