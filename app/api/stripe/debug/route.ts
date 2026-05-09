import Stripe from "stripe";

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const result = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: "test@roomflip.io",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "Test Product", description: "Test description" },
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
      param: error.param,
      code: error.code,
    });
  }
}
