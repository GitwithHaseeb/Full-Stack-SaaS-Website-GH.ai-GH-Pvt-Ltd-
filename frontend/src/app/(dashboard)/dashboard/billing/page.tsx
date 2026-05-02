import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">Stripe Customer Portal integration can be wired here.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>When Stripe is connected, this button will deep-link authenticated users to the billing portal.</p>
          <Button disabled>Open customer portal (placeholder)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
