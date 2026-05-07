import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getCreditPackage } from "@/lib/credits";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { packageId, email } = await request.json();

    const pkg = getCreditPackage(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Try to get current user; if not logged in, use the email from Stripe later
    const user = await getCurrentUser();
    const userId = user?.id || "anonymous";
    const userEmail = user?.email || email || "";

    // Create Stripe checkout session (Stripe handles email if not provided)
    const session = await createCheckoutSession({
      packageId: pkg.id,
      name: `${pkg.credits} Room Credits`,
      description: pkg.description,
      amountUsd: pkg.usd,
      credits: pkg.credits,
      userId,
      email: userEmail,
    });

    // Save purchase record
    await prisma.purchase.create({
      data: {
        userId,
        email: userEmail,
        amount: pkg.usd,
        credits: pkg.credits,
        method: "stripe",
        status: "pending",
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({ url: session.url ?? session.id });
  } catch (error) {
    console.error("Stripe create checkout error:", error);
    const message = error instanceof Error ? error.message : "Failed to create checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
