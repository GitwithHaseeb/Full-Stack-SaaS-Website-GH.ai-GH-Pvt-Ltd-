import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";
import { founders } from "@/lib/company";

export function FoundersGrid({ priority = false }: { priority?: boolean }) {
  return (
    <div className="grid gap-px border border-hairline bg-hairline md:grid-cols-2">
      {founders.map((f) => (
        <article key={f.name} className="flex flex-col gap-6 bg-ivory p-6 sm:flex-row sm:items-start md:p-8">
          <Image
            src={f.photo}
            alt={f.name}
            width={160}
            height={160}
            priority={priority}
            sizes="160px"
            className="aspect-square w-32 shrink-0 object-cover object-top sm:w-36"
          />
          <div className="space-y-3">
            <p className="eyebrow text-navy">{f.role}</p>
            <h3 className="text-2xl text-navy">{f.name}</h3>
            <p className="services-line text-ink">{f.focus}</p>
            <span className="rule-brass" />
            <p className="text-[15px] text-ink">{f.bio}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-sm">
              <a href={`mailto:${f.email}`} className="inline-flex min-h-11 items-center gap-2 text-navy hover:underline">
                <Mail className="h-4 w-4" />
                Email
              </a>
              <a
                href={f.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 text-navy hover:underline"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
