import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PLAN_CREDITS: Record<string, number> = { starter: 20, pro: 50 };

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const userId = s.metadata?.userId;
    const plan = s.metadata?.plan;
    if (userId && plan) {
      await prisma.user.update({ where: { id: userId }, data: { plan, credits: PLAN_CREDITS[plan] || 20, stripeCustomerId: s.customer as string } });
    }
  }

  // Monthly credit refresh
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    if (invoice.billing_reason === "subscription_cycle") {
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: invoice.customer as string } });
      if (user) {
        const refreshCredits = PLAN_CREDITS[user.plan] || 20;
        await prisma.user.update({ where: { id: user.id }, data: { credits: refreshCredits } });
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const user = await prisma.user.findFirst({ where: { stripeCustomerId: sub.customer as string } });
    if (user) await prisma.user.update({ where: { id: user.id }, data: { plan: "free", credits: 0 } });
  }

  return NextResponse.json({ received: true });
}
