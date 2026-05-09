import Stripe from "stripe";

export async function GET() {
  try {
    // Test with proper email but also test something different
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create like the route does
    const result = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { 
            name: "6 Room Credits", 
            description: "6 room redesigns — just $2.5" 
          },
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
