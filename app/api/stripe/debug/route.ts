import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET() {
  try {
    const hasKey = !!process.env.STRIPE_SECRET_KEY;
    const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 10) || "NONE";
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia",
    });

    const result = await stripe.balance.retrieve();
    
    return NextResponse.json({
      hasKey,
      keyPrefix,
      balance: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: true,
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack?.substring(0, 500),
      hasKey: !!process.env.STRIPE_SECRET_KEY,
      keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || "NONE",
    });
  }
}
