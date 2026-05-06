import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { addCredits } from "@/lib/credits";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Find the purchase
    const purchase = await prisma.purchase.findFirst({
      where: { paypalOrderId: orderId },
    });

    if (!purchase) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    if (purchase.status === "completed") {
      return NextResponse.json({ success: true, credits: purchase.credits });
    }

    // Capture the PayPal order
    const capture = await capturePayPalOrder(orderId);

    const isCompleted = capture.status === "COMPLETED" ||
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.status === "COMPLETED";

    if (!isCompleted) {
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: "failed" },
      });
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    // Credit the user
    await addCredits(purchase.userId, purchase.credits);

    // Update purchase status
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { status: "completed" },
    });

    return NextResponse.json({ success: true, credits: purchase.credits });
  } catch (error) {
    console.error("PayPal capture error:", error);
    const message = error instanceof Error ? error.message : "Failed to capture order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
