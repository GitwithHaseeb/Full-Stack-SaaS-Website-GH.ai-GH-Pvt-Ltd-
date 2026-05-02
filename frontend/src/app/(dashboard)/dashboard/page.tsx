import { headers } from "next/headers";
import { PipelineBoard } from "@/components/dashboard/pipeline-board";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead } from "@/types";
import { ReplyChart } from "@/components/dashboard/reply-chart";

async function backendFetch(path: string) {
  const base = process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8000";
  const h = await headers();
  const cookie = h.get("cookie") || "";
  const res = await fetch(`${base}/api/v1${path}`, { headers: { cookie }, cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardHomePage() {
  const leads = (await backendFetch("/leads/")) as Lead[] | null;
  const analytics = (await backendFetch("/pipeline/analytics")) as { counts?: Record<string, number> } | null;
  const safeLeads = Array.isArray(leads) ? leads : [];

  const counts = analytics?.counts || {};
  const totalLeads = safeLeads.length;
  const meetings = counts["Meeting Scheduled"] || 0;
  const emailsSent = 12840;
  const replyRate = 18.4;

  const activity = [
    "Lead jane@example.com replied",
    "Meeting booked with Acme Corp",
    "Campaign “Q2 outbound” started",
    "AI draft approved for john@example.com",
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard title="Total Leads" value={String(totalLeads)} />
        <MetricCard title="Meetings (month)" value={String(meetings)} />
        <MetricCard title="Emails sent" value={emailsSent.toLocaleString()} />
        <MetricCard title="Reply rate" value={`${replyRate}%`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reply momentum</CardTitle>
        </CardHeader>
        <CardContent>
          <ReplyChart />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <PipelineBoard initial={safeLeads} />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {activity.map((a) => (
              <div key={a} className="rounded-md border bg-card p-3 text-foreground">
                {a}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
