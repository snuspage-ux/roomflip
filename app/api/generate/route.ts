import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });

// ControlNet interior-design - preserves room structure, changes style
const CONTROLNET_VERSION = "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";

const stylePrompts: Record<string, string> = {
  "Modern": "modern interior design, clean lines, neutral tones, minimal furniture, sleek surfaces, large windows, natural light, oak flooring",
  "Minimalist": "minimalist interior, white walls, very few items, simple elegant furniture, zen-like spacious, natural materials",
  "Scandinavian": "scandinavian design, light wood floors, white and soft gray palette, cozy wool textiles, hygge atmosphere, simple elegant",
  "Industrial": "industrial loft style, exposed brick walls, black metal fixtures, concrete accents, Edison bulb lighting, raw materials",
  "Luxury": "luxury high-end interior, marble accents, gold fixtures, plush velvet furniture, crystal chandelier, premium materials",
  "Bohemian": "bohemian boho style, colorful layered textiles, many green plants, macrame wall art, eclectic mix of patterns, warm and cozy",
  "Japanese": "japanese zen interior, tatami elements, shoji screen inspiration, natural wood, minimal decoration, peaceful wabi-sabi aesthetic",
  "Mid-Century Modern": "mid-century modern interior, iconic retro furniture, warm walnut wood tones, geometric patterns, statement pieces, organic shapes",
  "Coastal": "coastal beach house style, soft blue and white palette, natural rope and rattan textures, driftwood accents, breezy light fabrics",
  "Farmhouse": "modern farmhouse interior, shiplap accent wall, rustic reclaimed wood, vintage fixtures, cozy warm textiles, barn-inspired details",
  "Contemporary": "contemporary interior, bold art pieces, mixed material textures, dramatic statement lighting, sophisticated neutral palette",
  "Rustic": "rustic cabin interior, reclaimed wood walls, stone fireplace, warm earth tones, handcrafted furniture, cozy wool throws",
  "Tropical": "tropical resort interior, palm leaf patterns, rattan and bamboo furniture, lush green plants, bright accent colors, natural materials",
  "Art Deco": "art deco interior, bold geometric patterns, rich jewel tones, velvet upholstery, gold and brass accents, glamorous 1920s inspired",
  "Futuristic": "futuristic interior, ambient LED lighting, curved smooth surfaces, minimalist high-tech, white and chrome palette, smart home aesthetic",
};

export async function POST(request: Request) {
  const { imageUrl, theme, room } = await request.json();

  if (!imageUrl || !theme || !room) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const styleDesc = stylePrompts[theme] || theme.toLowerCase();
  const prompt = `${styleDesc}, ${room.toLowerCase()}, same room layout and dimensions, professional interior design photography, architectural digest quality, 8k uhd, highly detailed, photorealistic`;

  try {
    const prediction = await replicate.predictions.create({
      version: CONTROLNET_VERSION,
      input: {
        image: imageUrl,
        prompt,
        negative_prompt: "lowres, watermark, banner, logo, text, blurry, ugly, deformed, noisy, dark, cartoon, painting, sketch, different room, extra walls, missing walls",
        prompt_strength: 0.4,
        guidance_scale: 15,
        num_inference_steps: 50,
      },
    });

    let result = await replicate.predictions.get(prediction.id);
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === "succeeded") {
      const output = Array.isArray(result.output) ? result.output[0] : result.output;
      return NextResponse.json({ output });
    }
    return NextResponse.json({ error: result.error || "Generation failed" }, { status: 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
