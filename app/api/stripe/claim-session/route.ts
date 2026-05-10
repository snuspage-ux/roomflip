import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCurrentUser, createSession } from "@/lib/auth";

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

    return NextResponse.json({
      claimed: true,
      credits: purchase.credits,
      email: customerEmail || purchase.email,
      loggedIn: true,
    });
  } catch (error) {
    console.error("Claim session error:", error);
    return NextResponse.json({ error: "Failed to claim session" }, { status: 500 });
  }
}
