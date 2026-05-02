import { notFound } from "next/navigation";
import { posts } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-16">
      <p className="text-xs uppercase tracking-wide text-primary">GH.ai Journal</p>
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-sm text-muted-foreground">{post.date}</p>
      <p className="text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
      <div className="max-w-none space-y-4 leading-relaxed text-foreground">
        <p>{post.content}</p>
      </div>
    </article>
  );
}
