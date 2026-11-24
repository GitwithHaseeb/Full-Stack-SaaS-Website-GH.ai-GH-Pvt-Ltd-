"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Wordmark } from "@/components/marketing/logo-mark";
import { Button } from "@/components/ui/button";
import { Title as SheetTitle } from "@radix-ui/react-dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ivory">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="GH Pvt Ltd — home" className="flex min-h-11 items-center">
          <Wordmark size={40} />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex min-h-11 items-center border-b border-transparent text-sm font-medium text-ink transition-colors hover:text-navy",
                pathname === l.href && "border-brass text-navy",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/login" className="flex min-h-11 items-center text-sm font-medium text-ink hover:text-navy">
            Client login
          </Link>
          <Button asChild size="sm">
            <Link href="/contact">Start a conversation</Link>
          </Button>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="text-navy">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-rule bg-navy text-ivory">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="mt-10 flex flex-col gap-2">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} className="flex min-h-11 items-center font-display text-2xl">
                    {l.label}
                  </Link>
                ))}
                <Link href="/login" className="flex min-h-11 items-center text-mist">
                  Client login
                </Link>
                <span className="rule-brass my-4 !bg-brass-light" />
                <Link href="/contact" className="flex min-h-11 items-center font-medium text-ivory">
                  Start a conversation →
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
