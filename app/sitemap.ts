import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/data/blog-posts";

const STYLES = [
  "modern", "minimalist", "scandinavian", "japanese", "luxury",
  "mid-century-modern", "bohemian", "tropical", "rustic", "coastal",
  "vintage", "art_deco", "mediterranean", "farmhouse", "gothic",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://roomflip.io", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://roomflip.io/about", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://roomflip.io/blog", lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: "https://roomflip.io/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://roomflip.io/terms", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...getAllSlugs().map((slug) => ({
      url: `https://roomflip.io/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...STYLES.map((style) => ({
      url: `https://roomflip.io/styles/${style}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
