import { stripe, createCheckoutSession } from "@/lib/stripe";
import { getCreditPackage } from "@/lib/credits";
import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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
