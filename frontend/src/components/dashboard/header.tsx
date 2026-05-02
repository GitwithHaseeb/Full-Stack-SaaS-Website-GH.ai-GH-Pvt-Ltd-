"use client";

import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <div className="flex items-center gap-3 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-0 text-white">
            <DashboardSidebar />
          </SheetContent>
        </Sheet>
        <span className="font-semibold">Dashboard</span>
      </div>
      <div className="hidden text-lg font-semibold md:block">Command Center</div>
      <ThemeToggle />
    </header>
  );
}
