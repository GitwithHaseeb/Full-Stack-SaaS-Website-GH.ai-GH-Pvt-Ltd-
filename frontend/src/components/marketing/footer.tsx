import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { LogoMark } from "@/components/marketing/logo-mark";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-slate-50 py-12 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <LogoMark />
            <span>GH.ai</span>
          </div>
          <p className="text-sm text-muted-foreground">
            GH Pvt Ltd builds AI-native sales automation — pipeline, outreach, and meeting booking in one place.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm md:grid-cols-3">
          <div>
            <div className="mb-2 font-medium">Product</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/features">Features</Link>
              </li>
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/waitlist">Waitlist</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-2 font-medium">Company</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="mb-2 font-medium">Founders</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="mailto:ghaniatanveer061@gmail.com">ghaniatanveer061@gmail.com</a>
              </li>
              <li>
                <a href="mailto:haseebch8130@gmail.com">haseebch8130@gmail.com</a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3 text-foreground">
              <a href="#" aria-label="Twitter" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl px-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} GH Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
}
