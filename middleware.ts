import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateMap = new Map<string, { count: number; reset: number }>();

function getIP(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const ip = getIP(req);

  // Rate limit generate API: 10 req/min
  if (path === "/api/generate") {
    if (isRateLimited(`gen:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
