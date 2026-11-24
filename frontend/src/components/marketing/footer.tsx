import Link from "next/link";
import { Linkedin } from "lucide-react";
import { LogoMark } from "@/components/marketing/logo-mark";
import { founders, SERVICES_LINE, services } from "@/lib/company";

export function MarketingFooter() {
  return (
    <footer className="section-dark border-t border-rule bg-navy text-mist">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-[1.3fr_1fr_1fr_1.3fr] md:px-6">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <LogoMark tone="ivory" size={44} />
            <span className="font-display text-2xl font-semibold text-ivory">GH Pvt Ltd</span>
          </div>
          <span className="rule-brass" />
          <p className="services-line text-mist">{SERVICES_LINE}</p>
          <p className="max-w-xs text-sm">
            We handle how a company looks and how it runs online, so everything it puts out comes from one place.
          </p>
        </div>

        <div>
          <div className="eyebrow mb-4 text-ivory">Services</div>
          <ul className="space-y-1 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services#${s.slug}`} className="inline-flex min-h-9 items-center hover:text-ivory">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4 text-ivory">Company</div>
          <ul className="space-y-1 text-sm">
            {[
              ["/about", "About"],
              ["/blog", "Insights"],
              ["/contact", "Contact"],
              ["/login", "Client login"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="inline-flex min-h-9 items-center hover:text-ivory">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4 text-ivory">Founders</div>
          <ul className="space-y-4 text-sm">
            {founders.map((f) => (
              <li key={f.name} className="space-y-1">
                <div className="flex items-center gap-2 text-ivory">
                  {f.name}
                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${f.name} on LinkedIn`}
                    className="inline-flex h-9 w-9 items-center justify-center hover:text-brass-light"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
                <a href={`mailto:${f.email}`} className="break-all hover:text-ivory">
                  {f.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs md:flex-row md:justify-between md:px-6">
          <span>© {new Date().getFullYear()} GH Pvt Ltd. All rights reserved.</span>
          <span className="services-line">{SERVICES_LINE}</span>
        </div>
      </div>
    </footer>
  );
}
