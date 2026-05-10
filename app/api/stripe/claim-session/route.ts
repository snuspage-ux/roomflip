import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCurrentUser, createSession } from "@/lib/auth";
import { randomUUID } from "crypto";

/**
 * After a successful Stripe Checkout, the user returns to /pricing?success=true&session_id=xxx
 * This endpoint claims the session: finds the purchase, auto-logs in the user.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Find the purchase by Stripe session ID
    const purchase = await prisma.purchase.findFirst({
      where: { stripeSessionId: sessionId },
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    // Already logged in — just return
    const currentUser = await getCurrentUser();
    if (currentUser) {
      return NextResponse.json({
        claimed: true,
        credits: purchase.credits,
        email: purchase.email,
        alreadyLoggedIn: true,
      });
    }

    let user = null;

    // Resolve the Stripe customer email (useful for anonymous purchases)
    let customerEmail = purchase.email;
    if (!customerEmail && purchase.stripeSessionId) {
      try {
        const stripeSession = await stripe.checkout.sessions.retrieve(purchase.stripeSessionId);
        customerEmail = stripeSession.customer_details?.email || stripeSession.customer_email || "";
      } catch {
        // Stripe API error — ignore, use empty email
      }
    }

    // Guest user with fingerprint
    if (purchase.userId.startsWith("fp:")) {
      user = await prisma.user.findUnique({ where: { id: purchase.userId } });
      if (!user) {
        const fpSuffix = purchase.userId.replace("fp:", "").substring(0, 8);
        user = await prisma.user.create({
          data: {
            id: purchase.userId,
            email: `fp_${fpSuffix}@local.roomflip.io`,
            credits: purchase.credits,
          },
        });
      } else if (user.credits < purchase.credits) {
        await prisma.user.update({
          where: { id: user.id },
          data: { credits: purchase.credits },
        });
      }
    } else if (customerEmail) {
      // User-provided or Stripe-resolved email
      user = await prisma.user.findUnique({ where: { email: customerEmail } });
      if (!user) {
        user = await prisma.user.create({
          data: { email: customerEmail, credits: purchase.credits },
        });
      } else if (user.credits < purchase.credits) {
        await prisma.user.update({
          where: { id: user.id },
          data: { credits: purchase.credits },
        });
      }
    }

    if (!user) {
      // Fallback: try finding by purchase.userId
      if (purchase.userId && purchase.userId !== "anonymous") {
        user = await prisma.user.findUnique({ where: { id: purchase.userId } });
      }
    }

    if (!user) {
      console.error("Could not resolve user for purchase", purchase.id);
      return NextResponse.json({ error: "Could not resolve user" }, { status: 500 });
    }

    // Update purchase with resolved userId and email
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: {
        userId: user.id,
        ...(customerEmail && !purchase.email ? { email: customerEmail } : {}),
      },
    });

    // Mark as completed if webhook didn't fire yet
    if (purchase.status === "pending") {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "completed" },
      });
    }

    // Auto-login: create session + set httpOnly cookie
    await createSession(user.id);

    // Send fallback email with magic link (for another device / closed window)
    const finalEmail = customerEmail || purchase.email || user.email;
    if (finalEmail && !finalEmail.includes("@local.roomflip.io")) {
      try {
        const resendKey = process.env.RESEND_API_KEY?.trim();
        if (resendKey) {
          const magicToken = randomUUID();
          const magicId = "ml_" + randomUUID().replace(/-/g, "").substring(0, 16);
          const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

          await prisma.session.create({
            data: { id: magicId, userId: user.id, token: magicToken, expiresAt, createdAt: new Date() },
          });

          const magicUrl = `https://roomflip.io/api/auth/magic?token=${magicToken}`;
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "RoomFlip <hello@tubevoice.io>",
              to: finalEmail,
              subject: `Your ${purchase.credits} RoomFlip credits are ready!`,
              html: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0a0a0f; color: #e2e8f0; border-radius: 16px;"><div style="text-align: center; margin-bottom: 24px;"><div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #9333ea); border-radius: 12px; line-height: 48px; font-size: 24px; font-weight: bold; color: white;">R</div><h1 style="font-size: 24px; margin: 16px 0 8px;">${purchase.credits} credits ready! 🎉</h1></div><p style="margin-bottom: 24px; color: #94a3b8;">Your purchase was successful. Click below to sign in and start redesigning rooms.</p><div style="text-align: center; margin-bottom: 24px;"><a href="${magicUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #9333ea); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">Sign in & use credits</a></div><p style="font-size: 14px; color: #94a3b8;">Link expires in 1 hour.</p></div>`,
            }),
          });
        }
      } catch (emailErr) {
        console.error("Failed to send fallback email:", emailErr);
      }
    }

    return NextResponse.json({
      claimed: true,
      credits: purchase.credits,
      email: finalEmail || purchase.email,
      loggedIn: true,
    });
  } catch (error) {
    console.error("Claim session error:", error);
    return NextResponse.json({ error: "Failed to claim session" }, { status: 500 });
  }
}
