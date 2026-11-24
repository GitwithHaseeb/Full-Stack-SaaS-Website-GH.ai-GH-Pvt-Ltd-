import Link from "next/link";
import { Wordmark } from "@/components/marketing/logo-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-4 py-12">
      <Link href="/" aria-label="GH Pvt Ltd — home" className="mb-3">
        <Wordmark size={44} />
      </Link>
      <p className="services-line mb-8 text-ink">Client portal</p>
      <div className="w-full max-w-md rounded-lg border border-hairline bg-ivory p-8">{children}</div>
    </div>
  );
}
