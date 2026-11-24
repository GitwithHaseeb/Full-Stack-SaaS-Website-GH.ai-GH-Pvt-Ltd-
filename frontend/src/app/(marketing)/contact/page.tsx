import { ArrowRight, Mail } from "lucide-react";
import { contactEmails, services } from "@/lib/company";

export default function ContactPage() {
  return (
    <div>
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-6xl gap-14 px-4 py-20 md:grid-cols-[1fr_1.1fr] md:px-6 md:py-24">
          <div className="space-y-6">
            <p className="eyebrow text-navy">Contact</p>
            <h1 className="text-[2.5rem] leading-[1.1] text-navy md:text-5xl">Start a conversation</h1>
            <span className="rule-brass" />
            <p className="text-lg text-ink">
              Tell us where things stand — a quiet page, an old website, a brand that doesn&apos;t match. Email is the
              only way to reach us, and you&apos;ll hear back from the people doing the work, not a sales team.
            </p>
          </div>

          <div className="space-y-8 border border-hairline p-6 md:p-8">
            <div className="space-y-2">
              <p className="eyebrow text-navy">Email us</p>
              <ul className="divide-y divide-hairline border-y border-hairline">
                {contactEmails.map((email) => (
                  <li key={email}>
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent("Enquiry — GH Pvt Ltd")}`}
                      className="group flex min-h-14 items-center justify-between gap-4 py-3 text-navy"
                    >
                      <span className="flex items-center gap-3 break-all text-lg">
                        <Mail className="h-5 w-5 shrink-0" />
                        {email}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <p className="eyebrow text-navy">Helpful to include</p>
              <ul className="space-y-2 text-[15px] text-ink">
                <li>Your business name and what it does</li>
                <li>Which service you need — {services.map((s) => s.title).join(", ")}</li>
                <li>Links to your current page or website, if you have one</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
