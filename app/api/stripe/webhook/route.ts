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
      const fingerprint = metadata.fingerprint || null;

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

      // Determine the real user
      let userId = metadata.userId;
      const isAnonymous = !userId || userId === "anonymous" || !userId.startsWith("cm");

      // Priority: email user > fingerprint user > anonymous
      if (isAnonymous) {
        if (customerEmail) {
          let dbUser = await prisma.user.findUnique({ where: { email: customerEmail } });
          if (!dbUser) {
            dbUser = await prisma.user.create({ data: { email: customerEmail, credits: 0 } });
          }
          userId = dbUser.id;
        } else if (fingerprint) {
          // Fingerprint-based account
          const fpUserId = `fp:${fingerprint}`;
          let fpUser = await prisma.user.findUnique({ where: { id: fpUserId } });
          if (!fpUser) {
            fpUser = await prisma.user.create({
              data: { id: fpUserId, email: `fp_${fingerprint}@local.roomflip.io`, credits: 0 }
            });
          }
          userId = fpUser.id;
        } else if (userId && userId.startsWith("fp:")) {
          // Already fp: format from create-checkout, ensure user exists
          let fpUser = await prisma.user.findUnique({ where: { id: userId } });
          if (!fpUser) {
            fpUser = await prisma.user.create({
              data: { id: userId, email: `fp_${userId.replace("fp:", "").substring(0, 8)}@local.roomflip.io`, credits: 0 }
            });
          }
          userId = fpUser.id;
        }
      }

      if (!userId || userId === "anonymous") {
        console.error("Could not resolve userId for session", sessionId, { customerEmail, fingerprint });
        return NextResponse.json({ received: true });
      }

      // Update purchase with resolved userId
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { userId },
      });

      // Add credits to user
      await addCredits(userId, credits);

      // Mark purchase as completed
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "completed" },
      });

      console.log(`Stripe: Credited ${credits} credits to ${userId} (session ${sessionId})`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
