import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });

export async function POST(request: Request) {
  const { imageUrl, theme, room } = await request.json();

  if (!imageUrl || !theme || !room) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const stylePrompts: Record<string, string> = {
    "Modern": "modern interior design, clean lines, neutral colors, minimal furniture, large windows, natural light",
    "Minimalist": "minimalist interior, very few items, white walls, simple furniture, zen-like, spacious",
    "Scandinavian": "scandinavian design, light wood, white and gray, cozy textiles, hygge, simple elegant",
    "Industrial": "industrial style, exposed brick, metal pipes, concrete floors, vintage lighting, raw materials",
    "Luxury": "luxury interior, marble floors, gold accents, designer furniture, crystal chandelier, premium materials",
    "Bohemian": "bohemian style, colorful textiles, plants everywhere, eclectic mix, layered rugs, macrame",
    "Japanese": "japanese interior, tatami, shoji screens, minimal, natural wood, zen garden view, wabi-sabi",
    "Mid-Century Modern": "mid-century modern, retro furniture, warm wood tones, iconic chairs, geometric patterns",
    "Coastal": "coastal style, blue and white, natural textures, driftwood, sea-inspired, breezy and light",
    "Farmhouse": "modern farmhouse, shiplap walls, barn doors, rustic wood, vintage accents, cozy and warm",
    "Contemporary": "contemporary design, bold art pieces, mixed materials, statement lighting, sophisticated",
    "Rustic": "rustic interior, reclaimed wood, stone fireplace, warm earthy tones, cabin-like comfort",
    "Tropical": "tropical interior, palm plants, rattan furniture, bright colors, resort-style, natural materials",
    "Art Deco": "art deco interior, geometric patterns, velvet furniture, gold and black, glamorous, 1920s inspired",
    "Futuristic": "futuristic interior, LED lighting, curved furniture, minimalist high-tech, smart home, sleek surfaces",
  };

  const styleDesc = stylePrompts[theme] || theme.toLowerCase();
  const prompt = `a beautiful ${styleDesc}, ${room.toLowerCase()}, professional interior photography, 8k uhd, architectural digest`;

  try {
    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      {
        input: {
          image: imageUrl,
          prompt,
          guidance_scale: 15,
          negative_prompt: "lowres, watermark, banner, logo, text, blurry, ugly, deformed, noisy, dark",
          prompt_strength: 0.5,
          num_inference_steps: 50,
        },
      }
    );

    return NextResponse.json({ output });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
