import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const comparisonRows = [
  {
    aspect: "Core focus",
    agent: "AI replies & qualification",
    warmup: "Deliverability ramp",
    booking: "Self-serve scheduling",
    analytics: "Funnel & performance",
  },
  {
    aspect: "Best for",
    agent: "Inbound + outbound conversations",
    warmup: "New domains & volume scaling",
    booking: "Demo calls & AE calendars",
    analytics: "RevOps reporting",
  },
  {
    aspect: "Automation depth",
    agent: "Full dialogue + intent routing",
    warmup: "Mailbox behavior patterns",
    booking: "Webhook → pipeline updates",
    analytics: "Recharts dashboards",
  },
];

const blocks = [
  {
    title: "AI Sales Agent",
    body: "Drafts on-brand replies, detects scheduling intent, and hands off to Calendly when prospects raise their hand.",
    example: "“Looks like Tuesday works — here’s a link to grab 20 minutes.”",
  },
  {
    title: "Warmup & Deliverability",
    body: "Gradual ramp, reputation monitoring, and safe sending patterns to keep domains healthy.",
    example: "Ramp from 10 → 80 emails/day per inbox with guardrails.",
  },
  {
    title: "Meeting Booking",
    body: "One-time scheduling links per lead, webhook confirmation, and automatic stage updates.",
    example: "Invitee.created → pipeline moves to Meeting Scheduled.",
  },
  {
    title: "Analytics",
    body: "Revenue-focused dashboards: pipeline distribution, sends, replies, and meetings booked.",
    example: "Compare reply rate week-over-week inside the dashboard.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-4 py-16">
      <div>
        <h1 className="text-4xl font-bold">Features</h1>
        <p className="mt-2 text-muted-foreground">Deep dive into the GH.ai platform modules.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead> </TableHead>
                <TableHead>AI Sales Agent</TableHead>
                <TableHead>Warmup</TableHead>
                <TableHead>Meeting Booking</TableHead>
                <TableHead>Analytics</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonRows.map((r) => (
                <TableRow key={r.aspect}>
                  <TableCell className="font-medium">{r.aspect}</TableCell>
                  <TableCell>{r.agent}</TableCell>
                  <TableCell>{r.warmup}</TableCell>
                  <TableCell>{r.booking}</TableCell>
                  <TableCell>{r.analytics}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {blocks.map((b) => (
          <Card key={b.title}>
            <CardHeader>
              <CardTitle>{b.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{b.body}</p>
              <div className="rounded-md bg-muted p-3 text-foreground">Example: {b.example}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
