import Link from "next/link";
import { posts } from "@/lib/blog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BlogIndexPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-16">
      <div>
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="mt-2 text-muted-foreground">Practical notes on AI sales, automation, and booking.</p>
      </div>
      <div className="grid gap-6">
        {posts.map((p) => (
          <Card key={p.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={`/blog/${p.slug}`} className="hover:text-primary">
                  {p.title}
                </Link>
              </CardTitle>
              <div className="text-xs text-muted-foreground">{p.date}</div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{p.excerpt}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
