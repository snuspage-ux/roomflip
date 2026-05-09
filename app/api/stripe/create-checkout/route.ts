import { stripe } from "@/lib/stripe";
import { getCreditPackage } from "@/lib/credits";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://roomflip.io";

export async function POST(request: Request) {
  try {
    const { packageId, email } = await request.json();

    const pkg = getCreditPackage(packageId);
    if (!pkg) {
      return Response.json({ error: "Invalid package" }, { status: 400 });
    }

    const hdrs = await headers();
    const cookieHeader = hdrs.get("cookie") || "";
    const fpMatch = cookieHeader.match(/rf_fp=([^;]+)/);
    const fingerprint = fpMatch ? fpMatch[1] : null;

    const user = await getCurrentUser();
    const userId = user?.id || fingerprint || "anonymous";
    const userEmail = user?.email || email || "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...(userEmail ? { customer_email: userEmail } : {}),
      metadata: {
        userId,
        email: userEmail,
        credits: String(pkg.credits),
        packageId: pkg.id,
        ...(fingerprint ? { fingerprint } : {}),
      },
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${pkg.credits} Room Credits`, description: pkg.description },
          unit_amount: Math.round(pkg.usd * 100),
        },
        quantity: 1,
      }],
      success_url: `${BASE_URL}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/pricing?canceled=true`,
    });

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

    return Response.json({ url: session.url ?? session.id });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
