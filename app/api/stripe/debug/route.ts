import Stripe from "stripe";

export async function GET() {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-12-18.acacia",
    });

    const start = Date.now();
    const result = await stripe.balance.retrieve();
    const elapsed = Date.now() - start;
    
    return Response.json({
      ok: true,
      elapsed,
      available: result.available,
      nodeVersion: process.version,
    });
  } catch (error: any) {
    return Response.json({
      ok: false,
      message: error.message,
      type: error.type,
      code: error.code,
      detail: error.detail || null,
      stack: error.stack?.substring(0, 500),
      cause: error.cause?.message || null,
      nodeVersion: process.version,
      headers: error.headers || null,
      charge: error.charge || null,
      decline_code: error.decline_code || null,
      payment_intent: error.payment_intent?.id || null,
      statusCode: error.statusCode || null,
    });
  }
}
