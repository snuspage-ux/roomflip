import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "./prisma";
import { Resend } from "resend";

const SESSION_DURATION_DAYS = 30;

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY not configured");
  return new Resend(apiKey);
}

export function generateToken(): string {
  return randomUUID();
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60,
    path: "/",
  });

  return token;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

export async function findOrCreateUser(email: string) {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, credits: 0 },
    });
  }
  return user;
}

export async function sendMagicLink(email: string, returnUrl?: string): Promise<boolean> {
  const user = await findOrCreateUser(email);
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

  // Store as a pending magic link session
  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://roomflip.io";
  const magicUrl = `${baseUrl}/api/auth/magic?token=${token}`;

  try {
    const resend = getResend();
    await resend.emails.send({
      from: "RoomFlip <hello@roomflip.io>",
      to: email,
      subject: "Sign in to RoomFlip",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0a0a0f; color: #e2e8f0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #9333ea); border-radius: 12px; line-height: 48px; font-size: 24px; font-weight: bold; color: white;">R</div>
            <h1 style="font-size: 24px; margin: 16px 0 8px;">Sign in to RoomFlip</h1>
          </div>
          <p style="margin-bottom: 24px; color: #94a3b8;">Click the button below to sign in to your account. This link expires in 15 minutes.</p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${magicUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #9333ea); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">Sign In</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error("Failed to send magic link email:", error);
    return false;
  }
}
