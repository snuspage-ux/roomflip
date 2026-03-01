import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY!,
});

export async function POST(request: Request) {
  const { imageUrl, theme, room } = await request.json();

  if (!imageUrl || !theme || !room) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const prompt = `a ${theme.toLowerCase()} ${room.toLowerCase()}, interior design photo, professional photography, 8k uhd, high quality`;

  try {
    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38",
      {
        input: {
          image: imageUrl,
          prompt,
          guidance_scale: 15,
          negative_prompt: "lowres, watermark, banner, logo, text, blurry, bad quality, deformed",
          prompt_strength: 0.5,
          num_inference_steps: 50,
        },
      }
    );

    return NextResponse.json({ output });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Replicate error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
