import Stripe from "stripe";

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Test with template variable in URL
    const result = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: "test@roomflip.io",
      metadata: {
        userId: "test123",
        email: "test@roomflip.io",
        credits: "6",
        packageId: "starter",
      },
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Test", description: "Test" },
          unit_amount: 250,
        },
        quantity: 1,
      }],
      success_url: "https://roomflip.io/pricing?success=true&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://roomflip.io/pricing?canceled=true",
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
    });
  }
}
