import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // Guest user with fingerprint
    if (purchase.userId.startsWith("fp:")) {
      user = await prisma.user.findUnique({ where: { id: purchase.userId } });
      if (!user) {
        const fpSuffix = purchase.userId.replace("fp:", "").substring(0, 8);
        user = await prisma.user.create({
          data: {
            id: purchase.userId,
            email: `fp_${fpSuffix}@local.roomflip.io`,
            credits: purchase.credits, // purchase was paid but webhook may not have fired
          },
        });
      } else if (user.credits < purchase.credits) {
        // Webhook didn't fire — add credits now
        await prisma.user.update({
          where: { id: user.id },
          data: { credits: purchase.credits },
        });
      }
    } else if (purchase.email) {
      // User provided email — find or create
      user = await prisma.user.findUnique({ where: { email: purchase.email } });
      if (!user) {
        user = await prisma.user.create({
          data: { email: purchase.email, credits: purchase.credits },
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
      user = await prisma.user.findUnique({ where: { id: purchase.userId } });
    }

    if (!user) {
      console.error("Could not resolve user for purchase", purchase.id);
      return NextResponse.json({ error: "Could not resolve user" }, { status: 500 });
    }

    // Update purchase userId if it was anonymous
    if (purchase.userId !== user.id) {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { userId: user.id },
      });
    }

    // Auto-login: create session + set httpOnly cookie
    await createSession(user.id);

    return NextResponse.json({
      claimed: true,
      credits: purchase.credits,
      email: purchase.email,
      loggedIn: true,
    });
  } catch (error) {
    console.error("Claim session error:", error);
    return NextResponse.json({ error: "Failed to claim session" }, { status: 500 });
  }
}
