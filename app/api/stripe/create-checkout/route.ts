import { NextResponse } from "next/server";
import { headers } from "next/headers";
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

    // Get device fingerprint for non-logged-in users
    const hdrs = await headers();
    const cookieHeader = hdrs.get("cookie") || "";
    const fpMatch = cookieHeader.match(/rf_fp=([^;]+)/);
    const fingerprint = fpMatch ? fpMatch[1] : null;

    // Try to get current user; if not logged in, use fingerprint
    const user = await getCurrentUser();
    const userId = user?.id || fingerprint || "anonymous";
    const userEmail = user?.email || email || "";

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      packageId: pkg.id,
      name: `${pkg.credits} Room Credits`,
      description: pkg.description,
      amountUsd: pkg.usd,
      credits: pkg.credits,
      userId,
      email: userEmail,
      fingerprint,
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
