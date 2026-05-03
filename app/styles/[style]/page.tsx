import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

const STYLE_DATA: Record<string, { title: string; h1: string; description: string; longDesc: string; extendedDesc: string; keywords: string[] }> = {
  modern: {
    title: "AI Modern Interior Design — Free Room Redesign | RoomFlip",
    h1: "Modern Room Design with AI",
    description: "Transform any room into a sleek modern style with AI. Clean lines, neutral colors, and contemporary furniture — completely free, no signup required.",
    longDesc: "Modern interior design emphasizes clean lines, open spaces, and a neutral color palette. Our AI understands the principles of modern design — minimizing clutter, maximizing natural light, and incorporating contemporary materials like glass, steel, and concrete. Upload your room photo and watch AI transform it into a stunning modern space in seconds.",
    extendedDesc: "People love modern design because it creates a sense of calm and order without sacrificing sophistication. The style draws on the legacy of 20th-century modernism, prioritizing function alongside form. Open floor plans, monochromatic color schemes with bold accent pieces, and streamlined furniture define the look. Modern design works best in living rooms and home offices where a clean, professional atmosphere helps you focus. It also shines in kitchens, where handle-less cabinets and integrated appliances create a seamless, uncluttered cooking space. Whether your room is compact or spacious, modern style adapts effortlessly — making it one of the most versatile choices for any home.",
    keywords: ["modern room design", "modern interior design ai", "contemporary room makeover", "modern home design"],
  },
  minimalist: {
    title: "AI Minimalist Interior Design — Free Room Redesign | RoomFlip",
    h1: "Minimalist Room Design with AI",
    description: "Create a clean, minimalist room design with AI. Simple, functional, and beautifully uncluttered — upload your photo and transform instantly for free.",
    longDesc: "Minimalist design philosophy centers on the idea that less is more. Our AI strips away unnecessary elements, focusing on essential furniture and decor. The result is a calming, spacious room with intentional design choices — clean surfaces, monochromatic palettes, and thoughtful negative space.",
    extendedDesc: "Minimalism resonates with people who feel overwhelmed by visual clutter and crave a sense of peace at home. By reducing furniture to only what you truly need and choosing pieces with clean silhouettes, every object in the room becomes intentional and meaningful. The style relies on quality over quantity — a single well-crafted chair can become the focal point of an entire room. Minimalist design is especially effective in bedrooms, where a pared-back environment promotes restful sleep, and in small apartments, where fewer items make limited square footage feel expansive. Bathrooms and entryways also benefit from the minimalist approach, creating a spa-like tranquility that sets the tone for your entire home.",
    keywords: ["minimalist room design", "minimalist interior ai", "simple room makeover", "declutter room ai"],
  },
  scandinavian: {
    title: "AI Scandinavian Interior Design — Free Room Redesign | RoomFlip",
    h1: "Scandinavian Room Design with AI",
    description: "Transform your room to Scandinavian Nordic style with AI. Light wood, white walls, and cozy textiles — free and instant room makeover.",
    longDesc: "Scandinavian design brings the warmth and simplicity of Nordic living to your space. Characterized by light wood tones, white walls, natural textiles, and functional furniture. Our AI captures the essence of hygge — creating rooms that are both beautiful and deeply comfortable.",
    extendedDesc: "Scandinavian style has become globally beloved because it masters the balance between beauty and practicality. Originating from Denmark, Sweden, and Norway, it evolved to combat long, dark winters with light-filled, welcoming interiors. The palette centers on whites, soft grays, and pale blues, warmed by natural oak and birch wood. Textured throws, sheepskin rugs, and candlelight create the hygge feeling — that uniquely Nordic sense of coziness. This style works wonderfully in living rooms where families gather, creating an inviting atmosphere. It is also ideal for nurseries and children's rooms, where the soft palette and natural materials create a soothing environment. Dining rooms benefit from Scandinavian simplicity too, making meals feel relaxed and communal.",
    keywords: ["scandinavian room design", "nordic interior design ai", "hygge room makeover", "scandinavian style room"],
  },
  japanese: {
    title: "AI Japanese Interior Design — Free Room Redesign | RoomFlip",
    h1: "Japanese Zen Room Design with AI",
    description: "Transform your room to Japanese zen style with AI. Natural materials, clean lines, and a tranquil atmosphere — free instant redesign.",
    longDesc: "Japanese interior design embodies wabi-sabi — finding beauty in imperfection and simplicity. Our AI transforms your room with natural materials like bamboo and wood, low-profile furniture, shoji-inspired elements, and a serene color palette that promotes peace and mindfulness.",
    extendedDesc: "Japanese design philosophy goes far deeper than aesthetics — it is a way of living that values harmony between indoor spaces and the natural world. Every element serves a purpose, and empty space (ma) is considered as important as the objects within it. Low furniture, sliding screens, and tatami-inspired textures encourage a grounded, meditative lifestyle. This style is perfect for bedrooms and meditation rooms where tranquility is paramount, but it also transforms living rooms into serene retreats from busy daily life. Home offices benefit from the clarity and focus that Japanese design promotes. Even bathrooms become spa-like sanctuaries with natural stone, wood accents, and simple fixtures that evoke traditional Japanese onsen bathing culture.",
    keywords: ["japanese room design", "zen interior design ai", "japanese style room", "wabi sabi room design"],
  },
  luxury: {
    title: "AI Luxury Interior Design — Free Room Redesign | RoomFlip",
    h1: "Luxury Room Design with AI",
    description: "Transform any room into a luxury interior with AI. Premium materials, elegant furniture, and sophisticated design — completely free.",
    longDesc: "Luxury interior design combines premium materials, sophisticated color palettes, and elegant furniture to create spaces that exude opulence. Our AI adds marble accents, velvet upholstery, gold fixtures, and designer-quality layouts to transform any ordinary room into a luxury retreat.",
    extendedDesc: "Luxury design appeals to those who want their home to feel like a five-star hotel or high-end penthouse. The style is defined by rich textures — think marble countertops, silk drapes, leather seating, and polished brass hardware. Deep jewel tones like emerald, navy, and burgundy add drama, while crystal chandeliers and statement art pieces serve as conversation starters. This style works exceptionally well in master bedrooms, creating a sumptuous sanctuary for rest. Formal dining rooms and living rooms become spaces for impressive entertaining. Even bathrooms can be elevated with luxury design, turning a utilitarian room into a private spa with freestanding tubs, heated floors, and designer vanities. The key to luxury design is ensuring every detail feels curated and intentional.",
    keywords: ["luxury room design", "luxury interior design ai", "premium room makeover", "elegant room design"],
  },
  "mid-century-modern": {
    title: "AI Mid-Century Modern Interior Design — Free Room Redesign | RoomFlip",
    h1: "Mid-Century Modern Room Design with AI",
    description: "Transform your room to mid-century modern style with AI. Iconic furniture, organic shapes, and retro-modern vibes — free instant redesign.",
    longDesc: "Mid-century modern design (1940s-1960s) features organic shapes, clean lines, and a seamless integration of indoor and outdoor spaces. Our AI incorporates iconic furniture silhouettes, warm wood tones, bold accent colors, and the timeless aesthetic that continues to influence modern design.",
    extendedDesc: "Mid-century modern remains one of the most enduringly popular design styles because its principles feel as fresh today as they did seventy years ago. Designers like Charles and Ray Eames, Arne Jacobsen, and George Nelson created furniture that was functional, beautiful, and mass-producible. The style favors open layouts with large windows that blur indoor-outdoor boundaries. Warm walnut and teak wood, mustard yellows, olive greens, and burnt oranges define the color palette. Living rooms are the natural home for mid-century modern design, where iconic lounge chairs and credenzas create effortlessly stylish spaces. Home offices gain creative energy from the retro aesthetic, and dining rooms with tulip tables and molded chairs become design showcases. The style also pairs wonderfully with contemporary architecture.",
    keywords: ["mid century modern room", "mid century interior design ai", "retro modern room", "mcm room design"],
  },
  bohemian: {
    title: "AI Bohemian Interior Design — Free Room Redesign | RoomFlip",
    h1: "Bohemian Room Design with AI",
    description: "Create a colorful bohemian room with AI. Layered textiles, indoor plants, and eclectic patterns — free boho room makeover in seconds.",
    longDesc: "Bohemian design celebrates creativity, color, and personal expression. Our AI fills your room with layered textiles, macramé wall hangings, abundant plants, eclectic furniture, and rich patterns from around the world — creating a space that feels warm, lived-in, and uniquely yours.",
    extendedDesc: "Bohemian style is for free spirits who see their home as a canvas for self-expression rather than a showcase for matching furniture sets. It draws inspiration from global cultures — Moroccan rugs, Indian block prints, Turkish lanterns, and African textiles all coexist harmoniously. There are no strict rules in boho design, which is precisely what makes it so liberating. Layers of cushions, throws, and tapestries create depth and comfort. Plants are essential, from trailing pothos to towering fiddle leaf figs. This style shines brightest in living rooms and bedrooms where comfort is king. Creative studios and reading nooks become inspiring sanctuaries. Even outdoor patios transform into magical bohemian retreats with string lights, floor cushions, and hanging planters that invite you to relax and dream.",
    keywords: ["bohemian room design", "boho interior design ai", "boho chic room", "eclectic room makeover"],
  },
  tropical: {
    title: "AI Tropical Interior Design — Free Room Redesign | RoomFlip",
    h1: "Tropical Room Design with AI",
    description: "Transform your room to tropical resort style with AI. Palm patterns, rattan furniture, and lush greenery — free instant redesign.",
    longDesc: "Tropical design brings the resort vacation feeling into your home. Our AI incorporates palm leaf patterns, rattan and bamboo furniture, lush indoor plants, bright accent colors, and natural materials that create an exotic, relaxing atmosphere year-round.",
    extendedDesc: "Tropical design transports you to a beachside villa or rainforest lodge without leaving your home. Inspired by Southeast Asian, Caribbean, and Pacific Island aesthetics, this style celebrates bold botanical prints, woven natural fibers, and vibrant pops of coral, turquoise, and golden yellow. Rattan armchairs, bamboo bed frames, and wicker pendant lights add texture and warmth. The key to tropical design is layering greenery generously — monstera leaves, bird of paradise plants, and palm fronds become living decor. This style is ideal for sunrooms and enclosed porches where natural light amplifies the lush atmosphere. Living rooms become vacation-like retreats, while bedrooms gain a resort-quality relaxation factor. Even bathrooms can embrace tropical vibes with wood accents, stone tiles, and cascading plants that thrive in humid environments.",
    keywords: ["tropical room design", "resort style interior ai", "tropical home decor", "palm beach room"],
  },
  rustic: {
    title: "AI Rustic Interior Design — Free Room Redesign | RoomFlip",
    h1: "Rustic Room Design with AI",
    description: "Transform your room to rustic country style with AI. Exposed wood, stone accents, and warm earthy tones — free instant makeover.",
    longDesc: "Rustic design celebrates natural imperfections and raw materials. Our AI brings warmth to your space with exposed wooden beams, stone accents, distressed furniture, warm earthy color palettes, and cozy textiles that create a welcoming country-inspired atmosphere.",
    extendedDesc: "Rustic design resonates with people who value authenticity and a connection to nature. Unlike highly polished styles, rustic embraces the beauty of knots in wood, uneven stone surfaces, and weathered metals. It draws from log cabin heritage, mountain lodge aesthetics, and rural farmsteads. Chunky wooden tables, iron light fixtures, and leather upholstery are hallmarks of the style. Color palettes stay grounded in nature — deep browns, forest greens, burnt umber, and warm creams. Rustic design excels in kitchens and dining rooms, where the warmth of natural materials makes gatherings feel intimate and connected. Bedrooms become cozy cabins, while living rooms with a stone fireplace focal point become the heart of the home. This style is particularly stunning in homes surrounded by natural landscapes, creating a seamless transition between indoors and outdoors.",
    keywords: ["rustic room design", "country style interior ai", "farmhouse room makeover", "rustic home design"],
  },
  coastal: {
    title: "AI Coastal Interior Design — Free Room Redesign | RoomFlip",
    h1: "Coastal Room Design with AI",
    description: "Transform your room to coastal beach style with AI. Ocean blues, sandy neutrals, and relaxed vibes — free instant room redesign.",
    longDesc: "Coastal design captures the breezy, relaxed feeling of life by the sea. Our AI transforms your room with ocean-inspired blues, sandy neutrals, natural driftwood textures, light flowing fabrics, and nautical accents that create a perpetual beach house atmosphere.",
    extendedDesc: "Coastal style captures the magic of waking up by the ocean — fresh salt air, the sound of waves, and sun-bleached driftwood. This design philosophy is rooted in relaxation and casual elegance, using a palette of crisp whites, sky blues, seafoam greens, and sandy beiges. Linen upholstery, jute rugs, rope-wrapped accents, and weathered wood furniture create a lived-in, beachy feel without looking themed or kitschy. Shells, coral, and sea glass make tasteful decorative accents. Coastal design is perfect for living rooms and bedrooms where relaxation is the priority, making every day feel like a seaside vacation. Bathrooms become spa retreats with pale blue tiles and white-washed vanities. Open-plan kitchens and dining areas benefit from the light, airy palette that makes spaces feel bright and welcoming even on cloudy days.",
    keywords: ["coastal room design", "beach house interior ai", "coastal style room", "ocean inspired room"],
  },
  vintage: {
    title: "AI Vintage Interior Design — Free Room Redesign | RoomFlip",
    h1: "Vintage Room Design with AI",
    description: "Transform your room to vintage retro style with AI. Classic furniture, nostalgic charm, and timeless elegance — free instant makeover.",
    longDesc: "Vintage design draws inspiration from past decades, blending nostalgic charm with timeless elegance. Our AI curates a mix of antique-inspired furniture, rich color palettes, ornate details, and classic patterns that tell a story and give your room character.",
    extendedDesc: "Vintage design is for those who believe the best things have already been made — or at least inspired by them. Spanning decades from the 1920s through the 1970s, vintage style cherry-picks the finest elements from each era: Art Nouveau curves, Art Deco geometry, mid-century optimism, and 1970s earthiness. Rich color palettes — deep teals, mustard yellows, dusty roses, and forest greens — create warmth and personality. Antique mirrors, crystal decanters, Persian rugs, and tufted velvet sofas add layers of history and charm. This style works beautifully in living rooms and studies, creating sophisticated spaces that feel collected over time rather than designed overnight. Bedrooms gain romantic character with vintage iron bed frames and floral textiles. Dining rooms become intimate spaces for gathering, while entryways set a memorable first impression with vintage console tables and ornate mirrors.",
    keywords: ["vintage room design", "retro interior design ai", "vintage style room", "antique room makeover"],
  },
  art_deco: {
    title: "AI Art Deco Interior Design — Free Room Redesign | RoomFlip",
    h1: "Art Deco Room Design with AI",
    description: "Transform your room to Art Deco style with AI. Bold geometry, gold accents, and 1920s glamour — free instant room redesign.",
    longDesc: "Art Deco design embodies the glamour and sophistication of the 1920s-30s. Our AI adds bold geometric patterns, luxurious gold and chrome accents, rich jewel tones, symmetrical layouts, and dramatic lighting to create a space that channels timeless Hollywood elegance.",
    extendedDesc: "Art Deco emerged in the roaring 1920s as a celebration of modernity, luxury, and bold artistic expression. It draws from Egyptian, Aztec, and machine-age influences, resulting in a style that is unmistakably dramatic. Sunburst mirrors, chevron patterns, fluted columns, and lacquered surfaces define the aesthetic. The color palette is unapologetically rich — black and gold, emerald and brass, navy and silver. Velvet upholstery and mirrored furniture add to the opulence. Art Deco works spectacularly in living rooms and cocktail lounges, creating spaces that feel ready for a Gatsby party. Bedrooms gain Hollywood glamour with upholstered headboards and symmetrical nightstands. Bathrooms with geometric tile work and brass fixtures become statement spaces. Even home bars and entertainment rooms come alive with Art Deco's inherent sense of celebration and sophistication.",
    keywords: ["art deco room design", "art deco interior ai", "1920s room style", "glamorous room design"],
  },
  mediterranean: {
    title: "AI Mediterranean Interior Design — Free Room Redesign | RoomFlip",
    h1: "Mediterranean Room Design with AI",
    description: "Transform your room to Mediterranean style with AI. Terracotta, arched doorways, and warm colors — free instant room makeover.",
    longDesc: "Mediterranean design evokes the sun-drenched charm of Southern Europe. Our AI brings terracotta tiles, arched doorways, wrought iron details, warm earth tones, and textured walls to create a room that feels like a villa on the Italian coast or a hacienda in Spain.",
    extendedDesc: "Mediterranean design captures the effortless elegance of coastal Italian, Spanish, and Greek homes where indoor and outdoor living merge seamlessly. The style celebrates handcrafted materials — hand-painted ceramic tiles, textured stucco walls, hand-forged iron railings, and natural terracotta flooring. Color palettes reflect the landscape: warm ochre, sun-baked terracotta, olive green, and azure blue. Arched windows and doorways create visual rhythm, while exposed wooden ceiling beams add rustic character. This design style is ideal for kitchens and dining rooms, where the warm tones create an inviting atmosphere for cooking and sharing meals. Living rooms with Mediterranean design feel like sun-filled courtyards, and bedrooms become peaceful retreats reminiscent of a seaside villa. Outdoor patios and covered terraces are natural extensions of the Mediterranean aesthetic, perfect for al fresco dining year-round.",
    keywords: ["mediterranean room design", "mediterranean interior ai", "tuscan room style", "spanish style room"],
  },
  farmhouse: {
    title: "AI Farmhouse Interior Design — Free Room Redesign | RoomFlip",
    h1: "Farmhouse Room Design with AI",
    description: "Transform your room to farmhouse style with AI. Shiplap walls, barn doors, and cozy comfort — free instant room redesign.",
    longDesc: "Farmhouse design blends rustic charm with modern comfort. Our AI adds shiplap walls, barn door accents, reclaimed wood, cozy textiles, vintage-inspired fixtures, and a warm neutral palette to create the perfect modern farmhouse space — equal parts stylish and inviting.",
    extendedDesc: "Farmhouse style has surged in popularity because it strikes the perfect balance between nostalgic charm and contemporary livability. Modern farmhouse design takes the warmth of traditional country homes — wide-plank wood floors, apron-front sinks, and open shelving — and refines them with cleaner lines and updated finishes. The color palette is anchored in warm whites, soft grays, and natural wood tones, creating a bright yet cozy atmosphere. Mason jar accents, galvanized metal, and linen textiles add character without clutter. Kitchens are the crown jewel of farmhouse design, with butcher block counters, subway tile backsplashes, and vintage-style pendants creating the ultimate gathering spot. Living rooms feel like warm, welcoming retreats with oversized sofas and woven baskets. Bedrooms gain a restful quality with whitewashed furniture and soft cotton bedding that invites you to slow down and relax.",
    keywords: ["farmhouse room design", "farmhouse interior ai", "modern farmhouse room", "country chic room"],
  },
  gothic: {
    title: "AI Gothic Interior Design — Free Room Redesign | RoomFlip",
    h1: "Gothic Room Design with AI",
    description: "Transform your room to gothic style with AI. Dark elegance, dramatic atmosphere, and rich textures — free instant room redesign.",
    longDesc: "Gothic design creates a dramatically beautiful atmosphere with deep, moody color palettes, rich textures like velvet and brocade, ornate dark wood furniture, cathedral-inspired elements, and atmospheric lighting that transforms your room into a darkly elegant sanctuary.",
    extendedDesc: "Gothic design is for those who find beauty in darkness and drama. Drawing from medieval cathedrals, Victorian mansions, and romantic literature, this style creates interiors that are both mysterious and deeply luxurious. Deep purples, midnight blacks, blood reds, and dark forest greens form the core palette, punctuated by gleaming silver and aged gold. Pointed arch motifs, wrought iron candelabras, heavy velvet drapes, and ornately carved wood furniture define the aesthetic. Gothic design transforms bedrooms into dramatic romantic retreats where heavy textiles and candlelight create an intimate atmosphere. Living rooms and libraries become atmospheric spaces perfect for reading and reflection. Dining rooms gain theatrical grandeur with dark walls, statement chandeliers, and rich table settings. Even bathrooms can embrace gothic elegance with black fixtures, dark tile, and ornate mirrors that turn everyday routines into something extraordinary.",
    keywords: ["gothic room design", "gothic interior design ai", "dark room style", "dramatic room makeover"],
  },
};

const STYLES = Object.keys(STYLE_DATA);

const RELATED_STYLES: Record<string, string[]> = {
  modern: ["minimalist", "scandinavian", "mid-century-modern", "coastal", "japanese"],
  minimalist: ["modern", "japanese", "scandinavian", "coastal", "mid-century-modern"],
  scandinavian: ["minimalist", "modern", "coastal", "farmhouse", "japanese"],
  japanese: ["minimalist", "scandinavian", "modern", "tropical", "coastal"],
  luxury: ["art_deco", "mediterranean", "gothic", "mid-century-modern", "modern"],
  "mid-century-modern": ["modern", "scandinavian", "vintage", "bohemian", "minimalist"],
  bohemian: ["tropical", "vintage", "mediterranean", "farmhouse", "coastal"],
  tropical: ["coastal", "bohemian", "mediterranean", "japanese", "farmhouse"],
  rustic: ["farmhouse", "mediterranean", "vintage", "coastal", "bohemian"],
  coastal: ["scandinavian", "tropical", "minimalist", "farmhouse", "modern"],
  vintage: ["art_deco", "mid-century-modern", "bohemian", "farmhouse", "gothic"],
  art_deco: ["luxury", "vintage", "gothic", "mid-century-modern", "mediterranean"],
  mediterranean: ["rustic", "farmhouse", "tropical", "bohemian", "coastal"],
  farmhouse: ["rustic", "scandinavian", "coastal", "vintage", "mediterranean"],
  gothic: ["luxury", "art_deco", "vintage", "bohemian", "mediterranean"],
};

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
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: data.h1 }],
    },
  };
}

function styleName(slug: string) {
  return slug.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function StylePage({ params }: { params: Promise<{ style: string }> }) {
  const { style } = await params;
  const data = STYLE_DATA[style];
  if (!data) return <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">Style not found</div>;

  const related = (RELATED_STYLES[style] || STYLES.filter((s) => s !== style).slice(0, 5)).slice(0, 6);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://roomflip.io" },
      { "@type": "ListItem", position: 2, name: "Design Styles", item: "https://roomflip.io/#styles" },
      { "@type": "ListItem", position: 3, name: data.h1, item: `https://roomflip.io/styles/${style}` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Script id="breadcrumb-ld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-8">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-slate-300">{styleName(style)} Style</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{data.h1}</h1>
        <p className="text-lg text-slate-300 mb-6 leading-relaxed">{data.longDesc}</p>
        <p className="text-base text-slate-400 mb-8 leading-relaxed">{data.extendedDesc}</p>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="space-y-3 text-slate-300">
            <li className="flex gap-3"><span className="text-indigo-400 font-bold">1.</span> Upload a photo of your room</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-bold">2.</span> Select &quot;{styleName(style)}&quot; style</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-bold">3.</span> AI generates your redesigned room in ~30 seconds</li>
            <li className="flex gap-3"><span className="text-indigo-400 font-bold">4.</span> Download your HD result</li>
          </ol>
        </div>

        <div className="text-center">
          <Link href="/#generator" className="inline-flex px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25">
            Try {styleName(style)} Style Now
          </Link>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {related.map((s) => (
              <Link key={s} href={`/styles/${s}`} className="p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-center">
                <span className="text-sm font-medium">{styleName(s)}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
