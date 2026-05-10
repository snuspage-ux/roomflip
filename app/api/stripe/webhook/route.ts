import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { addCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

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

      // Send fallback email if we have a real email
      const resolveEmail = customerEmail || (await prisma.user.findUnique({ where: { id: userId }, select: { email: true } }))?.email;
      if (resolveEmail && !resolveEmail.includes("@local.roomflip.io")) {
        try {
          const magicToken = randomUUID();
          const magicId = "ml_" + randomUUID().replace(/-/g, "").substring(0, 16);
          const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

          await prisma.session.create({
            data: {
              id: magicId,
              userId,
              token: magicToken,
              expiresAt,
              createdAt: new Date(),
            },
          });

          const magicUrl = `https://roomflip.io/api/auth/magic?token=${magicToken}`;
          const resendKey = process.env.RESEND_API_KEY?.trim();

          if (resendKey) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "RoomFlip <hello@tubevoice.io>",
                to: resolveEmail,
                subject: `Your ${credits} RoomFlip credits are ready!`,
                html: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0a0a0f; color: #e2e8f0; border-radius: 16px;"><div style="text-align: center; margin-bottom: 24px;"><div style="display: inline-block; width: 48px; height: 48px; background: linear-gradient(135deg, #6366f1, #9333ea); border-radius: 12px; line-height: 48px; font-size: 24px; font-weight: bold; color: white;">R</div><h1 style="font-size: 24px; margin: 16px 0 8px;">${credits} credits ready! 🎉</h1></div><p style="margin-bottom: 24px; color: #94a3b8;">Your purchase was successful. Click below to sign in and start redesigning rooms — no watermark, all styles unlocked.</p><div style="text-align: center; margin-bottom: 24px;"><a href="${magicUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #9333ea); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px;">Sign in & use credits</a></div><p style="font-size: 14px; color: #94a3b8; text-align: center;">or copy this link:<br/><span style="font-size: 12px; color: #64748b; word-break: break-all;">${magicUrl}</span></p><p style="font-size: 12px; color: #64748b; margin-top: 24px;">Link expires in 1 hour. If you didn't buy credits, ignore this email.</p></div>`,
              }),
            });
            console.log(`Sent fallback email to ${resolveEmail} for session ${sessionId}`);
          }
        } catch (emailErr) {
          console.error("Failed to send fallback email:", emailErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
