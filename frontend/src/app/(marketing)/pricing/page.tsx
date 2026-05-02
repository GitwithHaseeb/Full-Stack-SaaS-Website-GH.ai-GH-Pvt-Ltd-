import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Growth",
    price: "$47",
    cadence: "/month",
    items: [
      "Unlimited Email Accounts",
      "Unlimited Email Warmup",
      "1,000 Uploaded Contacts",
      "5,000 Emails Monthly",
      "Chat Support",
    ],
    cta: "Get Started",
    href: "/waitlist",
    featured: false,
  },
  {
    name: "Hypergrowth",
    price: "$97",
    cadence: "/month",
    items: [
      "Unlimited Email Accounts",
      "Unlimited Email Warmup",
      "25,000 Uploaded Contacts",
      "100,000 Emails Monthly",
      "Premium Live Support",
    ],
    cta: "Get Started",
    href: "/waitlist",
    featured: true,
  },
  {
    name: "Light Speed",
    price: "$358",
    cadence: "/month",
    items: [
      "Everything in Hyper Growth +",
      "500,000 Emails Monthly",
      "100,000 Uploaded Contacts",
      "SISR System",
    ],
    cta: "Get Started",
    href: "/waitlist",
    featured: false,
  },
  {
    name: "Enterprise",
    price: "Custom pricing",
    cadence: "",
    items: [
      "Everything in Light Speed +",
      "500,000+ Emails Monthly",
      "100,000+ Uploaded Contacts",
      "Private Deliverability Network",
    ],
    cta: "Contact Sales",
    href: "/contact",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="mt-2 text-muted-foreground">Scale from first inbox to enterprise deliverability.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={p.featured ? "border-primary shadow-lg ring-2 ring-primary/30" : "border-border/80"}
          >
            <CardHeader>
              <CardTitle className="text-xl">{p.name}</CardTitle>
              <div className="text-3xl font-bold">
                {p.price}
                {p.cadence ? <span className="text-base font-normal text-muted-foreground">{p.cadence}</span> : null}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {p.items.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={p.featured ? "default" : "outline"}>
                <Link href={p.href}>{p.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
