import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });

const NANO_BANANA_PRO = "712e06a8e122fb7c8dae55dcf7ad6a8e717afb7b1c41c889fc8c5132fd42f374";

const stylePrompts: Record<string, string> = {
  "Modern": "modern minimalist style with clean lines, neutral tones, minimal furniture, sleek surfaces, oak hardwood flooring",
  "Minimalist": "ultra minimalist style with white walls, very few carefully chosen pieces, zen-like spacious feeling, natural materials",
  "Scandinavian": "scandinavian style with light wood floors, white and soft gray palette, cozy wool textiles, hygge atmosphere",
  "Industrial": "industrial loft style with exposed brick walls, black metal fixtures, concrete accents, Edison bulb lighting",
  "Luxury": "luxury high-end style with marble accents, gold fixtures, plush velvet furniture, crystal chandelier, premium materials",
  "Bohemian": "bohemian boho style with colorful layered textiles, many green plants, macrame wall art, eclectic mix of patterns",
  "Japanese": "japanese zen style with tatami elements, shoji screens, natural wood, minimal decoration, peaceful wabi-sabi aesthetic, floor cushions",
  "Mid-Century Modern": "mid-century modern style with iconic retro furniture, warm walnut wood, geometric patterns, statement pieces, organic shapes",
  "Coastal": "coastal beach house style with soft blue and white palette, natural rope and rattan textures, driftwood accents, light fabrics",
  "Farmhouse": "modern farmhouse style with shiplap accent walls, rustic reclaimed wood, vintage fixtures, cozy warm textiles",
  "Contemporary": "contemporary style with bold art pieces, mixed material textures, dramatic statement lighting, sophisticated neutral palette",
  "Rustic": "rustic cabin style with reclaimed wood walls, stone fireplace, warm earth tones, handcrafted furniture, cozy wool throws",
  "Tropical": "tropical resort style with palm leaf patterns, rattan and bamboo furniture, lush green plants, bright accent colors",
  "Art Deco": "art deco style with bold geometric patterns, rich jewel tones, velvet upholstery, gold and brass accents, 1920s glamour",
  "Futuristic": "futuristic style with ambient LED lighting, curved smooth surfaces, minimalist high-tech, white and chrome palette",
};

export async function POST(request: Request) {
  const { imageUrl, theme, room } = await request.json();

  if (!imageUrl || !theme || !room) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const styleDesc = stylePrompts[theme] || theme.toLowerCase();
  const prompt = `Edit this ${room.toLowerCase()} photo: redesign the interior in ${styleDesc}. Keep the exact same room layout, walls, windows, ceiling and dimensions. Only change the furniture, flooring, colors, materials and decorations. Professional interior design photography, photorealistic, 8k quality.`;

  try {
    const prediction = await replicate.predictions.create({
      version: NANO_BANANA_PRO,
      input: {
        prompt,
        image_input: [imageUrl],
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
