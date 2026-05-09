import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    // This is what create-checkout does
    const hdrs = await headers();
    const cookieHeader = hdrs.get("cookie") || "";
    
    const user = await getCurrentUser();
    const userId = user?.id || "anonymous";
    const userEmail = user?.email || "test@roomflip.io";

    const pkg = { id: "starter", credits: 6, usd: 2.5, label: "Starter", description: "6 room redesigns — just $2.5" };
    
    const result = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: userEmail,
      metadata: {
        userId: userId,
        email: userEmail,
        credits: "6",
        packageId: pkg.id,
      },
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `${pkg.credits} Room Credits`,
            description: pkg.description,
          },
          unit_amount: Math.round(pkg.usd * 100),
        },
        quantity: 1,
      }],
      success_url: `https://roomflip.io/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://roomflip.io/pricing?canceled=true`,
    });
    
    return Response.json({
      ok: true,
      id: result.id,
      url: result.url,
    });
  } catch (error: any) {
    return Response.json({
      ok: false,
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
    });
  }
}
