import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getPostBySlug, getAllSlugs } from "@/data/blog-posts";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function renderContent(blocks: string[]) {
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-4">
          {block.slice(3)}
        </h2>
      );
    }

    // Process inline bold markers
    const parts = block.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    return (
      <p key={i} className="mb-4 leading-relaxed">
        {rendered}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Find related posts (excluding current)
  const related = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-400 transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <article>
          <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-8">{post.title}</h1>

          <div className="text-slate-300 text-lg">
            {renderContent(post.content)}
          </div>
        </article>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to transform your room?</h3>
          <p className="text-slate-400 mb-6">
            Upload a photo and see your room redesigned in seconds. Free, no signup required.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all"
          >
            Try RoomFlip Free
          </a>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold mb-6">More from the blog</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all"
                >
                  <h4 className="font-semibold mb-2 hover:text-indigo-400 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-sm text-slate-500">{p.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
