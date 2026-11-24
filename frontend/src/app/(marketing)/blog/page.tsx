import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Insights",
  description: "Short notes from GH Pvt Ltd on brand consistency, social media, websites and IT.",
};

export default function BlogIndexPage() {
  return (
    <section className="bg-ivory">
      <div className="mx-auto max-w-4xl px-4 py-20 md:px-6 md:py-24">
        <p className="eyebrow mb-6 text-navy">Insights</p>
        <h1 className="text-[2.5rem] leading-[1.1] text-navy md:text-5xl">Notes on looking consistent and running online</h1>
        <span className="rule-brass my-8" />
        <ul className="divide-y divide-hairline border-y border-hairline">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="group block space-y-2 py-8">
                <time className="eyebrow text-ink">{p.date}</time>
                <h2 className="text-2xl text-navy underline-offset-4 group-hover:underline">{p.title}</h2>
                <p className="text-ink">{p.excerpt}</p>
                <span className="inline-flex items-center gap-2 pt-1 text-sm font-medium text-navy">
                  Read <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
