import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { addCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    let event;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      // Verify signature with webhook secret
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Stripe webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      // No webhook secret configured — parse raw JSON (less secure, but works for dev)
      console.warn("STRIPE_WEBHOOK_SECRET not configured — skipping signature verification");
      event = JSON.parse(body);
    }

    const eventType = event.type;

    // Handle checkout.session.completed
    if (eventType === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;
      const metadata = session.metadata || {};
      const userId = metadata.userId;
      const credits = parseInt(metadata.credits || "0", 10);

      if (!userId || !credits) {
        console.error("Missing userId or credits in session metadata", { sessionId, metadata });
        return NextResponse.json({ received: true });
      }

      // Update purchase status
      const purchase = await prisma.purchase.findFirst({
        where: { stripeSessionId: sessionId },
      });

      if (!purchase) {
        console.error("Purchase not found for session", sessionId);
        return NextResponse.json({ received: true });
      }

      if (purchase.status === "completed") {
        // Already processed — idempotent
        return NextResponse.json({ received: true });
      }

      // Add credits
      await addCredits(userId, credits);

      // Mark purchase as completed
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "completed" },
      });

      console.log(
        `Stripe: Credited ${credits} credits to user ${userId} (session ${sessionId})`
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
