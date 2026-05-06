import { NextResponse } from "next/server";
import { verifyIpnNotification } from "@/lib/nowpayments";
import { addCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const data = JSON.parse(bodyText);

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Verify IPN notification
    if (!verifyIpnNotification(data, headers)) {
      console.warn("Invalid NowPayments IPN signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // NowPayments IPN payload fields
    const { payment_status, order_id, actually_paid, price_amount } = data;

    // Find purchase
    const purchase = await prisma.purchase.findUnique({
      where: { id: order_id },
    });

    if (!purchase) {
      console.warn(`Purchase not found for order_id: ${order_id}`);
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    if (purchase.status === "completed") {
      // Already processed — idempotent
      return NextResponse.json({ received: true });
    }

    // Process based on payment status
    if (payment_status === "finished" || payment_status === "confirmed") {
      // Payment completed — credit the user
      await addCredits(purchase.userId, purchase.credits);

      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "completed" },
      });

      console.log(`NowPayments: Credited ${purchase.credits} credits to user ${purchase.userId}`);
    } else if (payment_status === "failed" || payment_status === "expired") {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "failed" },
      });
    } else if (payment_status === "partially_paid") {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "pending" },
      });
    } else {
      // awaiting, confirming — keep as pending
      console.log(`NowPayments: Payment ${payment_status} for purchase ${purchase.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("NowPayments webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
