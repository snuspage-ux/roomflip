import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
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
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://roomflip.io/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      authors: ["RoomFlip Team"],
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/og-image.jpg"],
    },
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

  const howToLd = slug === "how-to-redesign-room-with-ai" ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Redesign Your Room Using AI",
    description: "Learn how to use AI-powered tools like RoomFlip to visualize your dream room before spending a dime.",
    totalTime: "PT2M",
    tool: [{ "@type": "HowToTool", name: "RoomFlip.io" }],
    step: [
      { "@type": "HowToStep", position: 1, name: "Take a Great Room Photo", text: "Use natural lighting, capture the full room from a corner or doorway, keep the room tidy, and hold your phone steady for a sharp image." },
      { "@type": "HowToStep", position: 2, name: "Choose the Right Style", text: "Pick from 17 design styles based on your room's purpose. Try Scandinavian for living rooms, Japanese for bedrooms, or Modern for home offices." },
      { "@type": "HowToStep", position: 3, name: "Upload and Generate", text: "Visit roomflip.io, drag and drop your room photo, select your preferred style, and hit Redesign My Room. AI generates a photorealistic redesign in about 30 seconds." },
      { "@type": "HowToStep", position: 4, name: "Compare and Refine", text: "Use the built-in comparison slider to see before and after. Try 3-4 different styles to find your preference." },
      { "@type": "HowToStep", position: 5, name: "Turn Inspiration into Action", text: "Use the redesigned image as a reference when shopping. Try the Shop This Look feature for curated furniture suggestions." },
    ],
  } : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "RoomFlip Team", url: "https://roomflip.io" },
    publisher: { "@type": "Organization", name: "RoomFlip", url: "https://roomflip.io", logo: { "@type": "ImageObject", url: "https://roomflip.io/og-image.jpg" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://roomflip.io/blog/${slug}` },
    image: "https://roomflip.io/og-image.jpg",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://roomflip.io" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://roomflip.io/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://roomflip.io/blog/${slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Script id="article-ld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <Script id="breadcrumb-ld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {howToLd && <Script id="howto-ld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />}
      <div className="max-w-3xl mx-auto px-6 py-24">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-slate-400 truncate max-w-[200px]">{post.title}</li>
          </ol>
        </nav>

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
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span>By RoomFlip Team</span>
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
            Upload a photo and see your room redesigned in seconds. No signup required.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all"
          >
            Try RoomFlip Now
          </Link>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
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
                  <p className="text-sm text-slate-500 mb-2">{p.excerpt}</p>
                  <p className="text-xs text-slate-600">{p.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
