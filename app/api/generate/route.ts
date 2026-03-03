export const maxDuration = 120;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Replicate from "replicate";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });
const NANO_BANANA_PRO = "712e06a8e122fb7c8dae55dcf7ad6a8e717afb7b1c41c889fc8c5132fd42f374";

const stylePrompts: Record<string, string> = {
  "Modern": "modern minimalist style with clean lines, neutral tones, minimal furniture, sleek surfaces, oak hardwood flooring",
  "Minimalist": "ultra minimalist style with white walls, very few carefully chosen pieces, zen-like spacious feeling, natural materials",
  "Scandinavian": "scandinavian style with light wood floors, white and soft gray palette, cozy wool textiles, hygge atmosphere",
  "Vintage": "vintage retro style with antique furniture, warm patina finishes, classic floral patterns, ornate picture frames, distressed wood, nostalgic charm",
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

async function addWatermark(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  const metadata = await sharp(buffer).metadata();
  const w = metadata.width || 1024;
  const h = metadata.height || 768;

  const svgText = `<svg width="${w}" height="${h}">
    <style>.t { fill: rgba(255,255,255,0.4); font-size: ${Math.floor(w / 10)}px; font-family: Arial, sans-serif; font-weight: bold; }</style>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="t" transform="rotate(-30, ${w / 2}, ${h / 2})">RoomFlip.io</text>
  </svg>`;

  const watermarked = await sharp(buffer)
    .composite([{ input: Buffer.from(svgText), top: 0, left: 0 }])
    .jpeg({ quality: 90 })
    .toBuffer();

  return `data:image/jpeg;base64,${watermarked.toString("base64")}`;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to generate designs" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: "No credits remaining. Upgrade your plan!" }, { status: 403 });
    }

    const { imageUrl, theme, furnitureImage } = await request.json();
    if (!imageUrl || !theme) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const styleDesc = stylePrompts[theme] || theme.toLowerCase();
    let prompt: string;
    if (furnitureImage) {
      prompt = `IMAGE 1 is a room that must be redesigned. IMAGE 2 is a reference photo of a specific furniture piece. `
        + `TASK: Edit IMAGE 1 — redesign it in ${styleDesc}. CRITICAL: Keep the EXACT same room type, purpose, walls, windows, ceiling, doors, floor shape, camera angle and room dimensions from IMAGE 1 — do NOT change the room structure or purpose. If it's a gym, keep it as a gym. If it's a bedroom, keep it as a bedroom. `
        + `Only update the style, materials, colors, and decorative elements to match ${styleDesc}. Keep all functional equipment and furniture appropriate for the original room type. `
        + `IMPORTANT: Include the exact furniture piece from IMAGE 2 — same design, color, material and shape — placed naturally in the redesigned room. `
        + `Professional interior design photography, photorealistic, 8k quality.`;
    } else {
      prompt = `Edit this photo: redesign the room in ${styleDesc}. CRITICAL RULES: 1) Keep the EXACT same room type and purpose — if it's a gym keep it as a gym, if it's a kitchen keep it as a kitchen, if it's an office keep it as an office. 2) Keep the EXACT same walls, windows, ceiling, doors, floor shape, camera angle and room dimensions — do NOT change the room structure at all. 3) Only change the style, materials, colors, finishes, and decorative elements to match ${styleDesc}. 4) Keep all functional equipment appropriate for the room type (gym equipment stays, kitchen appliances stay, etc). The room shell and purpose must be identical to the input photo. Professional interior design photography, photorealistic, 8k quality.`;
    }

    const prediction = await replicate.predictions.create({
      version: NANO_BANANA_PRO,
      input: { prompt, image_input: furnitureImage ? [imageUrl, furnitureImage] : [imageUrl], resolution: user.plan === 'pro' ? '4K' : user.plan === 'starter' ? '2K' : '1K' },
    });

    let result = await replicate.predictions.get(prediction.id);
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((r) => setTimeout(r, 2000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status !== "succeeded") {
      return NextResponse.json({ error: result.error || "Generation failed" }, { status: 500 });
    }

    const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    // Atomic credit decrement
    const updated = await prisma.user.update({ where: { id: session.user.id }, data: { credits: { decrement: 1 } } });
    if (updated.credits < 0) {
      await prisma.user.update({ where: { id: session.user.id }, data: { credits: 0 } });
    }

    // Save generation
    await prisma.generation.create({
      data: {
        userId: session.user.id,
        inputUrl: imageUrl.substring(0, 200),
        outputUrl: outputUrl as string,
        style: theme,
        room: "auto",
      },
    });

    // Watermark for free users
    let finalOutput = outputUrl as string;
    if (user.plan === "free") {
      try {
        finalOutput = await addWatermark(finalOutput);
      } catch (wmErr) {
        console.error("Watermark failed:", wmErr);
        // Return output with watermark flag so frontend can overlay
      }
    }

    return NextResponse.json({ output: finalOutput, creditsRemaining: user.credits - 1, watermarked: user.plan === "free" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Generation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
