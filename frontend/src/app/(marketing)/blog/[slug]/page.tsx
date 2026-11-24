import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { posts } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <div>
      <article className="bg-ivory">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-20 md:px-6 md:py-24">
          <Link href="/blog" className="eyebrow inline-flex min-h-11 items-center text-navy hover:underline">
            ← Insights
          </Link>
          <h1 className="text-[2.25rem] leading-[1.15] text-navy md:text-5xl">{post.title}</h1>
          <time className="eyebrow block text-ink">{post.date}</time>
          <span className="rule-brass" />
          <p className="text-xl text-navy">{post.excerpt}</p>
          <div className="space-y-5 text-lg text-ink">
            {post.content.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </div>
      </article>
      <section className="section-dark bg-navy text-mist">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-6">
          <h2 className="text-2xl text-ivory md:text-3xl">Sound familiar? That&apos;s the conversation.</h2>
          <Button asChild size="lg" className="bg-ivory text-navy hover:bg-ivory/90">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
