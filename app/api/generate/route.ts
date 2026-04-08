export const maxDuration = 120;
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Replicate from "replicate";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY! });
const NANO_BANANA_PRO = "712e06a8e122fb7c8dae55dcf7ad6a8e717afb7b1c41c889fc8c5132fd42f374";

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

const DAILY_LIMIT = 3;
const GLOBAL_DAILY_CAP = 71; // ~$10/day at $0.14/gen
const GLOBAL_CAP_KEY = "global:daily_cap";
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

    // Global daily cost cap
  const globalOk = await checkAndIncrement(GLOBAL_CAP_KEY + ":" + new Date().toISOString().split("T")[0]);
  // checkAndIncrement uses DAILY_LIMIT — override for global cap check
  const todayKey = GLOBAL_CAP_KEY + ":" + new Date().toISOString().split("T")[0];
  const globalResult = await tursoExec("SELECT count FROM RateLimit WHERE id = ?", [{ type: "text", value: todayKey }]);
  const globalCount = parseInt(globalResult?.rows?.[0]?.[0]?.value || "0");
  if (globalCount > GLOBAL_DAILY_CAP) {
    return NextResponse.json({ error: "Service temporarily unavailable. Try again tomorrow!" }, { status: 503 });
  }
  // Increment global counter
  await tursoExec("INSERT INTO RateLimit (id, count, date) VALUES (?, 1, ?) ON CONFLICT(id) DO UPDATE SET count = count + 1, date = ?",
    [{ type: "text", value: todayKey }, { type: "text", value: new Date().toISOString().split("T")[0] }, { type: "text", value: new Date().toISOString().split("T")[0] }]);

  if (!(await checkDailyLimit(ip, fingerprint))) {
    return NextResponse.json({ error: "Daily limit reached (3/day). Come back tomorrow!" }, { status: 429 });
  }

    const { imageUrl, theme, furnitureImage, aspectRatio } = await request.json();
    if (!imageUrl || !theme) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const styleDesc = stylePrompts[theme] || theme.toLowerCase();
    const prompt = furnitureImage
      ? `STRICT ROOM EDIT — NOT a new image. Take this EXACT photo (IMAGE 1) and ONLY change the decor/style. ABSOLUTE RULES: 1) If the photo has 2 windows, the result MUST have exactly 2 windows in the same positions. If it has 0 windows, the result MUST have 0 windows. 2) Same number and position of doors. 3) Same wall layout, same corners, same ceiling height. 4) Same camera angle and perspective — do NOT rotate or shift viewpoint. 5) Same room dimensions and proportions. 6) Do NOT add or remove any architectural features (windows, doors, columns, beams, arches). WHAT TO CHANGE: Replace furniture with ${styleDesc} style furniture. Change wall color/texture. Change flooring material. Change lighting fixtures. Change textiles, curtains, rugs, decorative objects. Place the furniture from IMAGE 2 into the room naturally. The ARCHITECTURE (walls, windows, doors, ceiling) must be pixel-accurate to the input. Photorealistic interior design photograph, magazine quality.`
      : `STRICT ROOM EDIT — NOT a new image. Take this EXACT photo and ONLY change the decor/style. ABSOLUTE RULES: 1) If the photo has 2 windows, the result MUST have exactly 2 windows in the same positions. If it has 0 windows, the result MUST have 0 windows. 2) Same number and position of doors. 3) Same wall layout, same corners, same ceiling height. 4) Same camera angle and perspective — do NOT rotate or shift viewpoint. 5) Same room dimensions and proportions. 6) Do NOT add or remove any architectural features (windows, doors, columns, beams, arches). WHAT TO CHANGE: Replace furniture with ${styleDesc} style furniture. Change wall color/texture. Change flooring material. Change lighting fixtures. Change textiles, curtains, rugs, decorative objects. The ARCHITECTURE (walls, windows, doors, ceiling) must be pixel-accurate to the input. Photorealistic interior design photograph, magazine quality.`;

    const imageInputs = furnitureImage ? [imageUrl, furnitureImage] : [imageUrl];

    // Try up to 2 attempts
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const prediction = await replicate.predictions.create({
          version: NANO_BANANA_PRO,
          input: {
            prompt,
            image_input: imageInputs,
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
