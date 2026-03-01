import Stripe from "stripe";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function main() {
  // Create product
  const product = await stripe.products.create({
    name: "RoomAI",
    description: "AI Interior Design - Redesign any room with AI",
  });
  console.log("Product:", product.id);

  // Starter - $5/mo
  const starter = await stripe.prices.create({
    product: product.id,
    unit_amount: 500,
    currency: "usd",
    recurring: { interval: "month" },
    metadata: { plan: "starter", credits: "15" },
  });
  console.log("Starter price:", starter.id);

  // Pro - $9/mo
  const pro = await stripe.prices.create({
    product: product.id,
    unit_amount: 900,
    currency: "usd",
    recurring: { interval: "month" },
    metadata: { plan: "pro", credits: "50" },
  });
  console.log("Pro price:", pro.id);

  // Unlimited - $29/mo
  const unlimited = await stripe.prices.create({
    product: product.id,
    unit_amount: 2900,
    currency: "usd",
    recurring: { interval: "month" },
    metadata: { plan: "unlimited", credits: "999999" },
  });
  console.log("Unlimited price:", unlimited.id);

  console.log("\nAdd these to .env.local:");
  console.log(`STRIPE_STARTER_PRICE_ID=${starter.id}`);
  console.log(`STRIPE_PRO_PRICE_ID=${pro.id}`);
  console.log(`STRIPE_UNLIMITED_PRICE_ID=${unlimited.id}`);
}

main().catch(console.error);
