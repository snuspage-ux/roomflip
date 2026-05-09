import { stripe, createCheckoutSession } from "@/lib/stripe";

export async function GET() {
  try {
    // Test the exact function used by create-checkout
    const result = await createCheckoutSession({
      packageId: "starter",
      name: "6 Room Credits",
      description: "6 room redesigns — just $2.5",
      amountUsd: 2.5,
      credits: 6,
      userId: "test-user-123",
      email: "test@roomflip.io",
      fingerprint: null,
    });
    
    return Response.json({
      ok: true,
      id: result.id,
      url: typeof result.url,
      hasUrl: !!result.url,
    });
  } catch (error: any) {
    return Response.json({
      ok: false,
      message: error.message,
      type: error.type || typeof error,
      code: error.code,
      name: error.name,
      constructor: error.constructor?.name,
      stack: error.stack?.substring(0, 300),
    });
  }
}
