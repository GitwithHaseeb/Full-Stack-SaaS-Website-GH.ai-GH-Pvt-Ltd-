import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type EmailLog = {
  id: string;
  subject?: string | null;
  body?: string | null;
  sent_at: string;
  status?: string | null;
  direction: string;
};

type LeadDetail = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  pipeline_stage: string;
  notes?: string | null;
  email_history: EmailLog[];
};

async function loadLead(id: string) {
  const base = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
  const h = await headers();
  const cookie = h.get("cookie") || "";
  const res = await fetch(`${base}/api/v1/leads/${id}`, { headers: { cookie }, cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  return res.json() as Promise<LeadDetail>;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await loadLead(id);
  if (!lead) notFound();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">{lead.name}</h1>
        <p className="text-sm text-muted-foreground">
          {lead.email} · {lead.pipeline_stage}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{lead.notes || "No notes yet."}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Conversation history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lead.email_history?.length ? (
            lead.email_history.map((m) => (
              <div key={m.id} className="rounded-md border bg-card p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{m.direction}</span>
                  <span>{new Date(m.sent_at).toLocaleString()}</span>
                </div>
                <Separator className="my-2" />
                <div className="text-sm font-medium">{m.subject || "(no subject)"}</div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{m.body || ""}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No messages logged yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
