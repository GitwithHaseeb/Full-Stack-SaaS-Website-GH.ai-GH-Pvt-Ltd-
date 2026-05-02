import Link from "next/link";
import { LogoMark } from "@/components/marketing/logo-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <Link href="/" className="mb-8 flex items-center gap-2 text-lg font-semibold">
        <LogoMark />
        GH.ai
      </Link>
      <div className="w-full max-w-md rounded-xl border bg-background p-8 shadow-sm">{children}</div>
    </div>
  );
}
