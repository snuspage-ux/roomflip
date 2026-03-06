import { Metadata } from "next";
import Link from "next/link";

const STYLE_DATA: Record<string, { title: string; h1: string; description: string; longDesc: string; keywords: string[] }> = {
  modern: {
    title: "AI Modern Room Design - Transform Your Room to Modern Style",
    h1: "Modern Room Design with AI",
    description: "Transform any room into a sleek modern style with AI. Clean lines, neutral colors, and contemporary furniture. Free, instant results.",
    longDesc: "Modern interior design emphasizes clean lines, open spaces, and a neutral color palette. Our AI understands the principles of modern design — minimizing clutter, maximizing natural light, and incorporating contemporary materials like glass, steel, and concrete. Upload your room photo and watch AI transform it into a stunning modern space in seconds.",
    keywords: ["modern room design", "modern interior design ai", "contemporary room makeover", "modern home design"],
  },
  minimalist: {
    title: "AI Minimalist Room Design - Less is More",
    h1: "Minimalist Room Design with AI",
    description: "Create a clean, minimalist room design with AI. Simple, functional, beautiful. Upload your photo and transform instantly.",
    longDesc: "Minimalist design philosophy centers on the idea that less is more. Our AI strips away unnecessary elements, focusing on essential furniture and decor. The result is a calming, spacious room with intentional design choices — clean surfaces, monochromatic palettes, and thoughtful negative space.",
    keywords: ["minimalist room design", "minimalist interior ai", "simple room makeover", "declutter room ai"],
  },
  scandinavian: {
    title: "AI Scandinavian Room Design - Nordic Style Interior",
    h1: "Scandinavian Room Design with AI",
    description: "Transform your room to Scandinavian Nordic style with AI. Light wood, white walls, cozy textiles. Free and instant.",
    longDesc: "Scandinavian design brings the warmth and simplicity of Nordic living to your space. Characterized by light wood tones, white walls, natural textiles, and functional furniture. Our AI captures the essence of hygge — creating rooms that are both beautiful and deeply comfortable.",
    keywords: ["scandinavian room design", "nordic interior design ai", "hygge room makeover", "scandinavian style room"],
  },
  japanese: {
    title: "AI Japanese Room Design - Zen Interior Style",
    h1: "Japanese Zen Room Design with AI",
    description: "Transform your room to Japanese zen style. Natural materials, clean lines, tranquil atmosphere. AI-powered, free.",
    longDesc: "Japanese interior design embodies wabi-sabi — finding beauty in imperfection and simplicity. Our AI transforms your room with natural materials like bamboo and wood, low-profile furniture, shoji-inspired elements, and a serene color palette that promotes peace and mindfulness.",
    keywords: ["japanese room design", "zen interior design ai", "japanese style room", "wabi sabi room design"],
  },
  luxury: {
    title: "AI Luxury Room Design - Premium Interior Style",
    h1: "Luxury Room Design with AI",
    description: "Transform any room into a luxury interior with AI. Premium materials, elegant furniture, sophisticated design. Free.",
    longDesc: "Luxury interior design combines premium materials, sophisticated color palettes, and elegant furniture to create spaces that exude opulence. Our AI adds marble accents, velvet upholstery, gold fixtures, and designer-quality layouts to transform any ordinary room into a luxury retreat.",
    keywords: ["luxury room design", "luxury interior design ai", "premium room makeover", "elegant room design"],
  },
  "mid-century-modern": {
    title: "AI Mid-Century Modern Room Design",
    h1: "Mid-Century Modern Room Design with AI",
    description: "Transform your room to mid-century modern style with AI. Iconic furniture, organic shapes, retro-modern vibes. Free.",
    longDesc: "Mid-century modern design (1940s-1960s) features organic shapes, clean lines, and a seamless integration of indoor and outdoor spaces. Our AI incorporates iconic furniture silhouettes, warm wood tones, bold accent colors, and the timeless aesthetic that continues to influence modern design.",
    keywords: ["mid century modern room", "mid century interior design ai", "retro modern room", "mcm room design"],
  },
  bohemian: {
    title: "AI Bohemian Room Design - Boho Chic Interior",
    h1: "Bohemian Room Design with AI",
    description: "Create a colorful bohemian room with AI. Layered textiles, plants, eclectic patterns. Free boho room makeover.",
    longDesc: "Bohemian design celebrates creativity, color, and personal expression. Our AI fills your room with layered textiles, macramé wall hangings, abundant plants, eclectic furniture, and rich patterns from around the world — creating a space that feels warm, lived-in, and uniquely yours.",
    keywords: ["bohemian room design", "boho interior design ai", "boho chic room", "eclectic room makeover"],
  },
  tropical: {
    title: "AI Tropical Room Design - Resort Style Interior",
    h1: "Tropical Room Design with AI",
    description: "Transform your room to tropical resort style with AI. Palm patterns, rattan, lush greenery. Free instant redesign.",
    longDesc: "Tropical design brings the resort vacation feeling into your home. Our AI incorporates palm leaf patterns, rattan and bamboo furniture, lush indoor plants, bright accent colors, and natural materials that create an exotic, relaxing atmosphere year-round.",
    keywords: ["tropical room design", "resort style interior ai", "tropical home decor", "palm beach room"],
  },
  rustic: {
    title: "AI Rustic Room Design - Country Style Interior",
    h1: "Rustic Room Design with AI",
    description: "Transform your room to rustic country style with AI. Exposed wood, stone, warm earthy tones. Free.",
    longDesc: "Rustic design celebrates natural imperfections and raw materials. Our AI brings warmth to your space with exposed wooden beams, stone accents, distressed furniture, warm earthy color palettes, and cozy textiles that create a welcoming country-inspired atmosphere.",
    keywords: ["rustic room design", "country style interior ai", "farmhouse room makeover", "rustic home design"],
  },
  coastal: {
    title: "AI Coastal Room Design - Beach House Interior",
    h1: "Coastal Room Design with AI",
    description: "Transform your room to coastal beach style with AI. Ocean blues, sandy neutrals, relaxed vibes. Free.",
    longDesc: "Coastal design captures the breezy, relaxed feeling of life by the sea. Our AI transforms your room with ocean-inspired blues, sandy neutrals, natural driftwood textures, light flowing fabrics, and nautical accents that create a perpetual beach house atmosphere.",
    keywords: ["coastal room design", "beach house interior ai", "coastal style room", "ocean inspired room"],
  },
  vintage: {
    title: "AI Vintage Room Design - Retro Style Interior",
    h1: "Vintage Room Design with AI",
    description: "Transform your room to vintage retro style with AI. Classic furniture, nostalgic charm, timeless elegance. Free.",
    longDesc: "Vintage design draws inspiration from past decades, blending nostalgic charm with timeless elegance. Our AI curates a mix of antique-inspired furniture, rich color palettes, ornate details, and classic patterns that tell a story and give your room character.",
    keywords: ["vintage room design", "retro interior design ai", "vintage style room", "antique room makeover"],
  },
  art_deco: {
    title: "AI Art Deco Room Design - Glamorous Interior",
    h1: "Art Deco Room Design with AI",
    description: "Transform your room to Art Deco style with AI. Bold geometry, gold accents, 1920s glamour. Free instant redesign.",
    longDesc: "Art Deco design embodies the glamour and sophistication of the 1920s-30s. Our AI adds bold geometric patterns, luxurious gold and chrome accents, rich jewel tones, symmetrical layouts, and dramatic lighting to create a space that channels timeless Hollywood elegance.",
    keywords: ["art deco room design", "art deco interior ai", "1920s room style", "glamorous room design"],
  },
  mediterranean: {
    title: "AI Mediterranean Room Design - Southern European Style",
    h1: "Mediterranean Room Design with AI",
    description: "Transform your room to Mediterranean style with AI. Terracotta, arches, warm colors. Free instant makeover.",
    longDesc: "Mediterranean design evokes the sun-drenched charm of Southern Europe. Our AI brings terracotta tiles, arched doorways, wrought iron details, warm earth tones, and textured walls to create a room that feels like a villa on the Italian coast or a hacienda in Spain.",
    keywords: ["mediterranean room design", "mediterranean interior ai", "tuscan room style", "spanish style room"],
  },
  farmhouse: {
    title: "AI Farmhouse Room Design - Modern Country Style",
    h1: "Farmhouse Room Design with AI",
    description: "Transform your room to farmhouse style with AI. Shiplap, barn doors, cozy comfort. Free instant redesign.",
    longDesc: "Farmhouse design blends rustic charm with modern comfort. Our AI adds shiplap walls, barn door accents, reclaimed wood, cozy textiles, vintage-inspired fixtures, and a warm neutral palette to create the perfect modern farmhouse space — equal parts stylish and inviting.",
    keywords: ["farmhouse room design", "farmhouse interior ai", "modern farmhouse room", "country chic room"],
  },
  gothic: {
    title: "AI Gothic Room Design - Dark Dramatic Interior",
    h1: "Gothic Room Design with AI",
    description: "Transform your room to gothic style with AI. Dark elegance, dramatic atmosphere, rich textures. Free.",
    longDesc: "Gothic design creates a dramatically beautiful atmosphere with deep, moody color palettes, rich textures like velvet and brocade, ornate dark wood furniture, cathedral-inspired elements, and atmospheric lighting that transforms your room into a darkly elegant sanctuary.",
    keywords: ["gothic room design", "gothic interior design ai", "dark room style", "dramatic room makeover"],
  },
};

const STYLES = Object.keys(STYLE_DATA);

export async function generateStaticParams() {
  return STYLES.map((style) => ({ style }));
}

export async function generateMetadata({ params }: { params: Promise<{ style: string }> }): Promise<Metadata> {
  const { style } = await params;
  const data = STYLE_DATA[style];
  if (!data) return { title: "Style Not Found" };
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: { canonical: `/styles/${style}` },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://roomflip.io/styles/${style}`,
      type: "website",
    },
  };
}

export default async function StylePage({ params }: { params: Promise<{ style: string }> }) {
  const { style } = await params;
  const data = STYLE_DATA[style];
  if (!data) return <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">Style not found</div>;

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 text-sm">← Back to RoomFlip</Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{data.h1}</h1>
        <p className="text-lg text-slate-300 mb-8 leading-relaxed">{data.longDesc}</p>
        
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="space-y-3 text-slate-300">
            <li className="flex gap-3"><span className="text-indigo-400 font-bold">1.</span> Upload a photo of your room</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-bold">2.</span> Select &quot;{style.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}&quot; style</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-bold">3.</span> AI generates your redesigned room in ~30 seconds</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-bold">4.</span> Download your HD result — completely free</li>
          </ol>
        </div>
        
        <div className="text-center">
          <Link href="/#generator" className="inline-flex px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25">
            Try {style.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Style — Free
          </Link>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Other Styles You Might Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {STYLES.filter(s => s !== style).slice(0, 6).map(s => (
              <Link key={s} href={`/styles/${s}`} className="p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-center">
                <span className="text-sm font-medium capitalize">{s.replace(/-/g, ' ').replace(/_/g, ' ')}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
