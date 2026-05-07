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
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Stripe webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else {
      console.warn("STRIPE_WEBHOOK_SECRET not configured — skipping signature verification");
      event = JSON.parse(body);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;
      const metadata = session.metadata || {};
      const credits = parseInt(metadata.credits || "0", 10);
      const customerEmail = session.customer_details?.email || session.customer_email || metadata.email;

      if (!credits) {
        console.error("Missing credits in session metadata", { sessionId, metadata });
        return NextResponse.json({ received: true });
      }

      // Find the purchase record
      let purchase = await prisma.purchase.findFirst({
        where: { stripeSessionId: sessionId },
      });

      if (!purchase) {
        console.error("Purchase not found for session", sessionId);
        return NextResponse.json({ received: true });
      }

      if (purchase.status === "completed") {
        return NextResponse.json({ received: true });
      }

      // Determine the real user — create account if needed
      let userId = metadata.userId;
      const isAnonymous = !userId || userId === "anonymous";

      if (isAnonymous && customerEmail) {
        // Find or create user by email from Stripe
        let dbUser = await prisma.user.findUnique({
          where: { email: customerEmail },
        });
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: { email: customerEmail, credits: 0 },
          });
        }
        userId = dbUser.id;

        // Update purchase record with real user ID
        await prisma.purchase.update({
          where: { id: purchase.id },
          data: { userId: dbUser.id, email: dbUser.email },
        });
      }

      if (!userId || userId === "anonymous") {
        console.error("Could not resolve userId for session", sessionId, { customerEmail });
        return NextResponse.json({ received: true });
      }

      // Add credits
      await addCredits(userId, credits);

      // Mark purchase as completed
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "completed" },
      });

      console.log(`Stripe: Credited ${credits} credits to user ${userId} (session ${sessionId})`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
