import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // On Vercel, public/ is read-only. Use /tmp/ instead.
  const uploadDir = join("/tmp", "uploads");
  await mkdir(uploadDir, { recursive: true });
  
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  // Return base64 data URL for Replicate (works everywhere)
  const mimeType = file.type || `image/${ext}`;
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  return NextResponse.json({ url: dataUrl });
}
