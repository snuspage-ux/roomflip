import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return NextResponse.redirect(new URL("/pricing?error=expired", request.url));
  }

  // Create a proper long-lived session
  await createSession(session.userId);

  // Delete the magic link session
  await prisma.session.delete({ where: { id: session.id } });

  return NextResponse.redirect(new URL("/pricing", request.url));
}
