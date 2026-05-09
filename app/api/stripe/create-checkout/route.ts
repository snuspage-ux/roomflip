import { stripe } from "@/lib/stripe";
import { getCreditPackage } from "@/lib/credits";

export async function POST(request: Request) {
  try {
    const { packageId } = await request.json();
    const pkg = getCreditPackage(packageId);
    if (!pkg) {
      return new Response(JSON.stringify({ error: "Invalid package" }), { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${pkg.credits} Room Credits`, description: pkg.description },
          unit_amount: Math.round(pkg.usd * 100),
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://roomflip.io"}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://roomflip.io"}/pricing?canceled=true`,
    });

    return Response.json({ url: session.url ?? session.id });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return Response.json({ error: error.message, type: error.type, code: error.code }, { status: 500 });
  }
}
