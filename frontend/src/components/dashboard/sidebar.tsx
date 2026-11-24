"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, KeyRound, LayoutDashboard, LogOut, Mail, Settings, Sparkles, Users } from "lucide-react";
import { LogoMark } from "@/components/marketing/logo-mark";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/leads", label: "Leads", icon: Users },
  { href: "/dashboard/campaigns", label: "Campaigns", icon: Mail },
  { href: "/dashboard/ai-agent", label: "AI Agent", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/api-keys", label: "API Keys", icon: KeyRound },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
] as const;

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  async function handleLogout() {
    await apiFetch("/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="flex h-full flex-col bg-sidebar text-mist">
      <div className="flex items-center gap-2 px-4 py-5">
        <LogoMark tone="ivory" size={32} />
        <div>
          <div className="font-display text-base font-semibold text-ivory">GH Pvt Ltd</div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-mist">Client portal</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-2">
        {links.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-rule",
                active && "bg-rule text-ivory",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3">
        <Button variant="ghost" className="w-full justify-start text-slate-200 hover:bg-rule" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
