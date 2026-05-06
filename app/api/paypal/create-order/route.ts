import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { getCreditPackage } from "@/lib/credits";
import { getCurrentUser, findOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { packageId, email } = await request.json();

    const pkg = getCreditPackage(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Get or create user
    let user = await getCurrentUser();
    if (!user) {
      if (!email) {
        return NextResponse.json({ error: "Email required for new users" }, { status: 400 });
      }
      user = await findOrCreateUser(email);
    }

    // Create PayPal order
    const order = await createPayPalOrder(pkg.usd);

    // Save purchase record
    await prisma.purchase.create({
      data: {
        userId: user.id,
        email: user.email,
        amount: pkg.usd,
        credits: pkg.credits,
        method: "paypal",
        status: "pending",
        paypalOrderId: order.id,
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("PayPal create order error:", error);
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
