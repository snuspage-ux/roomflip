import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const balance = await stripe.balance.retrieve();
    return Response.json({ ok: true, balance: balance.available });
  } catch (error: any) {
    return Response.json({ 
      ok: false, 
      message: error.message, 
      type: error.type,
      code: error.code 
    }, { status: 500 });
  }
}
