import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";

export const metadata: Metadata = {
  title: "Blog - Interior Design Tips & AI Room Design Guides",
  description: "Expert interior design tips, AI room redesign guides, and the latest design trends. Learn how to transform your living spaces with RoomFlip.",
  alternates: { canonical: "https://roomflip.io/blog" },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">RoomFlip Blog</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Interior design tips, AI room redesign guides, and inspiration to help you create the perfect space.
          </p>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
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
                <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 leading-relaxed">{post.excerpt}</p>
                <div className="mt-4 text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Read more
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all"
          >
            Try RoomFlip Now
          </Link>
        </div>
      </div>
    </main>
  );
}
