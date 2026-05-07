import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * After a successful Stripe Checkout, the user returns to /pricing?success=true&session_id=xxx
 * This endpoint claims the session: finds the purchase, creates/logs in the user.
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

    // Check if this purchase was already claimed by a logged-in user
    const currentUser = await getCurrentUser();
    if (currentUser) {
      // User is already logged in — just return the purchase info
      return NextResponse.json({
        claimed: true,
        credits: purchase.credits,
        email: purchase.email,
        alreadyLoggedIn: true,
      });
    }

    // Find or create user by the email from the purchase
    let user = await prisma.user.findUnique({
      where: { email: purchase.email },
    });

    if (!user) {
      // Create user — they'll need to log in via magic link to access credits
      user = await prisma.user.create({
        data: {
          email: purchase.email,
          credits: 0, // credits already added via webhook
        },
      });
    }

    // Update purchase userId if it was anonymous
    if (purchase.userId === "anonymous" && user.id !== "anonymous") {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { userId: user.id },
      });
    }

    return NextResponse.json({
      claimed: true,
      credits: purchase.credits,
      email: purchase.email,
      loggedIn: !!currentUser,
    });
  } catch (error) {
    console.error("Claim session error:", error);
    return NextResponse.json({ error: "Failed to claim session" }, { status: 500 });
  }
}
