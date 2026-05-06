import { NextResponse } from "next/server";
import { verifyPayPalWebhook } from "@/lib/paypal";
import { addCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook(headers, body);
    if (!isValid) {
      console.warn("Invalid PayPal webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;

    // Handle CHECKOUT.ORDER.APPROVED
    if (eventType === "CHECKOUT.ORDER.APPROVED") {
      const orderId = event.resource?.id;
      if (orderId) {
        await prisma.purchase.updateMany({
          where: { paypalOrderId: orderId, status: "pending" },
          data: { status: "approved" },
        });
      }
    }

    // Handle PAYMENT.CAPTURE.COMPLETED
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = event.resource;
      const orderId = capture?.supplementary_data?.related_ids?.order_id;

      if (orderId) {
        const purchase = await prisma.purchase.findFirst({
          where: { paypalOrderId: orderId },
        });

        if (purchase && purchase.status !== "completed") {
          await addCredits(purchase.userId, purchase.credits);
          await prisma.purchase.update({
            where: { id: purchase.id },
            data: { status: "completed" },
          });
          console.log(`Credited ${purchase.credits} credits to user ${purchase.userId}`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
