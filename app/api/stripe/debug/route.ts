export const runtime = "nodejs";

export async function GET() {
  try {
    // Test with raw fetch (not Stripe SDK)
    const resp = await fetch("https://api.stripe.com/v1/balance", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      },
    });
    
    const data = await resp.json();
    
    return Response.json({
      status: resp.status,
      ok: resp.ok,
      data,
      nodeVersion: process.version,
    });
  } catch (error: any) {
    return Response.json({
      error: true,
      message: error.message,
      cause: error.cause?.message,
      nodeVersion: process.version,
    });
  }
}
