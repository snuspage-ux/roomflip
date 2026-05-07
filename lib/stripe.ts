import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured in environment variables");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

/**
 * Create a Stripe Checkout Session for a one-time credit purchase.
 */
export async function createCheckoutSession(params: {
  packageId: string;
  name: string;
  description: string;
  amountUsd: number;
  credits: number;
  userId: string;
  email: string;
}) {
  const { packageId, name, description, amountUsd, credits, userId, email } = params;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    metadata: {
      userId,
      email,
      credits: credits.toString(),
      packageId,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name,
            description,
          },
          unit_amount: Math.round(amountUsd * 100), // cents
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://roomflip.io"}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://roomflip.io"}/pricing?canceled=true`,
  });

  return session;
}
