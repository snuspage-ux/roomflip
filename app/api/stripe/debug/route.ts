import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    // EXACT same parameters as create-checkout route
    const pkg = { id: "starter", credits: 6, usd: 2.5, label: "Starter", description: "6 room redesigns — just $2.5" };
    
    const result = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: "test@roomflip.io",
      metadata: {
        userId: "anonymous",
        email: "test@roomflip.io",
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
