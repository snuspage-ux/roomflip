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

  // Parse fingerprint from cookie header
  const cookieHeader = hdrs.get("cookie") || "";
  const fpMatch = cookieHeader.match(/rf_fp=([^;]+)/);
  const fingerprint = fpMatch ? fpMatch[1] : null;

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

  // Anonymous user — check credits by fingerprint
  const freeUsed = await checkFreeUsed(ip, fingerprint);

  // Check fingerprint-based user
  let fpUserCredits = 0;
  if (fingerprint) {
    const fpUserId = `fp:${fingerprint}`;
    const fpUser = await prisma.user.findUnique({ where: { id: fpUserId } });
    if (fpUser) {
      fpUserCredits = fpUser.credits;
    }
  }

  if (fpUserCredits > 0) {
    return NextResponse.json({
      user: {
        id: `fp:${fingerprint}`,
        email: "",
        credits: fpUserCredits,
      },
      freeUsed: true,
    });
  }

  return NextResponse.json({
    user: null,
    freeUsed,
  });
}
