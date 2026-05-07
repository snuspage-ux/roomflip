import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
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

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      packageId: pkg.id,
      name: `${pkg.credits} Room Credits`,
      description: pkg.description,
      amountUsd: pkg.usd,
      credits: pkg.credits,
      userId: user.id,
      email: user.email,
    });

    // Save purchase record
    await prisma.purchase.create({
      data: {
        userId: user.id,
        email: user.email,
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
