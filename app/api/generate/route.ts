export const maxDuration = 120;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });
const FLUX_KONTEXT_PRO = "897a70f5a7dbd8a0611413b3b98cf417b45f266bd595c571a22947619d9ae462";
const NANO_BANANA_PRO = "712e06a8e122fb7c8dae55dcf7ad6a8e717afb7b1c41c889fc8c5132fd42f374"; // fallback

const stylePrompts: Record<string, string> = {
  "Modern": "modern minimalist with clean lines, neutral tones, sleek surfaces, oak flooring",
  "Minimalist": "ultra minimalist with white walls, few carefully chosen pieces, zen-like spacious, natural materials",
  "Scandinavian": "scandinavian with light wood floors, white and soft gray, cozy wool textiles, hygge",
  "Vintage": "vintage retro with antique furniture, warm patina, classic floral patterns, distressed wood",
  "Luxury": "luxury high-end with marble accents, gold fixtures, plush velvet, crystal chandelier",
  "Bohemian": "bohemian boho with colorful layered textiles, green plants, macrame, eclectic patterns",
  "Japanese": "japanese zen with tatami, shoji screens, natural wood, minimal decoration, wabi-sabi",
  "Mid-Century Modern": "mid-century modern with iconic retro furniture, warm walnut, geometric patterns",
  "Coastal": "coastal beach house with soft blue and white, rope and rattan, driftwood accents",
  "Farmhouse": "modern farmhouse with shiplap walls, rustic reclaimed wood, vintage fixtures",
  "Contemporary": "contemporary with bold art, mixed textures, dramatic lighting, sophisticated neutrals",
  "Rustic": "rustic cabin with reclaimed wood walls, stone fireplace, warm earth tones",
  "Tropical": "tropical resort with palm patterns, rattan and bamboo, lush green plants",
  "Art Deco": "art deco with bold geometric patterns, jewel tones, velvet, gold and brass, 1920s glamour",
  "Futuristic": "futuristic with ambient LED lighting, curved surfaces, high-tech, white and chrome",
  "Gothic": "gothic dark elegant with deep moody colors, velvet and brocade, ornate dark wood, cathedral elements, dramatic lighting",
  "Mediterranean": "mediterranean with terracotta tiles, arched doorways, wrought iron, warm earth tones, textured stucco walls",
};

const DAILY_LIMIT = 5;
const TURSO_URL = (process.env.TURSO_DATABASE_URL || "").replace("libsql://", "https://");
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || "";

async function tursoExec(sql: string, args: Array<{type: string; value: string}> = []): Promise<any> {
  const resp = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${TURSO_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ requests: [{ type: "execute", stmt: { sql, args } }] }),
  });
  return (await resp.json()).results?.[0]?.response?.result;
}

async function checkAndIncrement(id: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  const result = await tursoExec("SELECT count, date FROM RateLimit WHERE id = ?", [{ type: "text", value: id }]);
  const row = result?.rows?.[0];
  if (!row || row[1]?.value !== today) {
    await tursoExec("INSERT INTO RateLimit (id, count, date) VALUES (?, 1, ?) ON CONFLICT(id) DO UPDATE SET count = 1, date = ?",
      [{ type: "text", value: id }, { type: "text", value: today }, { type: "text", value: today }]);
    return true;
  }
  const count = parseInt(row[0]?.value || "0");
  if (count >= DAILY_LIMIT) return false;
  await tursoExec("UPDATE RateLimit SET count = count + 1 WHERE id = ?", [{ type: "text", value: id }]);
  return true;
}

// Check BOTH IP and device fingerprint — if EITHER is over limit, block.
async function checkDailyLimit(ip: string, fingerprint: string | null): Promise<boolean> {
  const ipOk = await checkAndIncrement(`ip:${ip}`);
  if (!ipOk) return false;
  if (fingerprint) {
    const fpOk = await checkAndIncrement(`fp:${fingerprint}`);
    if (!fpOk) return false;
  }
  return true;
}

export async function POST(request: Request) {
  try {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown";

    const cookies = request.headers.get("cookie") || "";
    const fpMatch = cookies.match(/rf_fp=([^;]+)/);
    const fingerprint = fpMatch ? fpMatch[1] : null;

    if (!(await checkDailyLimit(ip, fingerprint))) {
      return NextResponse.json({ error: "Daily limit reached (5/day). Come back tomorrow!" }, { status: 429 });
    }

    const { imageUrl, theme, furnitureImage, aspectRatio } = await request.json();
    if (!imageUrl || !theme) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const styleDesc = stylePrompts[theme] || theme.toLowerCase();
    const prompt = furnitureImage
      ? `Edit this exact room photo (IMAGE 1). THIS IS CRITICAL: You MUST preserve the EXACT same room — same walls, same floor plan, same windows, same doors, same ceiling, same camera angle, same perspective, same room dimensions, same room shape. DO NOT generate a new room. DO NOT change the room layout. ONLY restyle the existing room to ${styleDesc}. Change only: furniture style, wall paint/texture, flooring material, lighting fixtures, textiles, and decorative objects. The room structure must be IDENTICAL to the input. Place the furniture from IMAGE 2 into the room naturally. Photorealistic interior design photo.`
      : `Edit this exact room photo. THIS IS CRITICAL: You MUST preserve the EXACT same room — same walls, same floor plan, same windows, same doors, same ceiling, same camera angle, same perspective, same room dimensions, same room shape. DO NOT generate a new room. DO NOT change the room layout. ONLY restyle the existing room to ${styleDesc}. Change only: furniture style, wall paint/texture, flooring material, lighting fixtures, textiles, and decorative objects. The room structure must be IDENTICAL to the input photo. Photorealistic interior design photo.`;

    const imageInputs = furnitureImage ? [imageUrl, furnitureImage] : [imageUrl];

    // Try up to 2 attempts
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const prediction = await replicate.predictions.create({
          version: FLUX_KONTEXT_PRO,
          input: {
            prompt,
            image: imageInputs[0],
            aspect_ratio: aspectRatio || "match_input_image",
          },
        });

        let result = await replicate.predictions.get(prediction.id);
        let pollCount = 0;
        while (result.status !== "succeeded" && result.status !== "failed" && pollCount < 60) {
          await new Promise((r) => setTimeout(r, 2000));
          result = await replicate.predictions.get(prediction.id);
          pollCount++;
        }

        if (result.status === "succeeded") {
          const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;
          return NextResponse.json({ output: outputUrl });
        }

        // If failed on first attempt, retry
        if (attempt === 0) {
          console.log("Attempt 1 failed, retrying...", result.error);
          continue;
        }
        
        return NextResponse.json({ error: result.error || "Generation failed. Please try again." }, { status: 500 });
      } catch (e) {
        if (attempt === 0) continue;
        throw e;
      }
    }
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Generation error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
