import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    // Test with empty email (like when user is not logged in)
    const result = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: "",
      metadata: {
        userId: "anonymous",
        email: "",
        credits: "6",
        packageId: "starter",
      },
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "6 Room Credits", description: "6 room redesigns — just $2.5" },
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
