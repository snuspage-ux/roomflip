import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkFreeUsed(ip: string, fingerprint: string | null): Promise<boolean> {
  const ipResult = await prisma.rateLimit.findUnique({ where: { id: `free:${ip}` } });
  if (ipResult) return true;
  if (fingerprint) {
    const fpResult = await prisma.rateLimit.findUnique({ where: { id: `free:fp:${fingerprint}` } });
    if (fpResult) return true;
  }
  return false;
}

export async function GET() {
  const user = await getCurrentUser();
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || hdrs.get("x-real-ip") || "unknown";

  if (user) {
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        credits: user.credits,
      },
      freeUsed: false,
    });
  }

  // Anonymous user — check if free generation is used
  const freeUsed = await checkFreeUsed(ip, null);

  return NextResponse.json({
    user: null,
    freeUsed,
  });
}
