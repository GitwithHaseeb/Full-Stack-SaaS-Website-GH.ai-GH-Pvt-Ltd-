import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border md:block">
        <DashboardSidebar />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardHeader />
        <div className="flex-1 bg-slate-50/60 p-4 dark:bg-slate-950/40">{children}</div>
      </div>
    </div>
  );
}
