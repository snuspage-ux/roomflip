import { createHmac } from "crypto";

const NOWPAYMENTS_API = "https://api.nowpayments.io/v1";

function getApiKey(): string {
  const key = process.env.NOWPAYMENTS_API_KEY;
  if (!key) throw new Error("NOWPAYMENTS_API_KEY not configured");
  return key;
}

function getIpnSecret(): string {
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!secret) throw new Error("NOWPAYMENTS_IPN_SECRET not configured");
  return secret;
}

interface NowPaymentsInvoice {
  id: number;
  invoice_url: string;
  status: string;
  price_amount: number;
  price_currency: string;
}

export async function createInvoice(
  priceAmount: number,
  priceCurrency: string = "usd",
  orderId: string
): Promise<NowPaymentsInvoice> {
  const apiKey = getApiKey();

  const resp = await fetch(`${NOWPAYMENTS_API}/invoice`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: priceAmount,
      price_currency: priceCurrency,
      order_id: orderId,
      ipn_callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://roomflip.io"}/api/nowpayments/webhook`,
      is_fixed_rate: true,
      is_fee_paid_by_user: true,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`NowPayments create invoice failed: ${resp.status} - ${err}`);
  }

  const data = await resp.json();
  return {
    id: data.id,
    invoice_url: data.invoice_url,
    status: data.invoice_status,
    price_amount: data.price_amount,
    price_currency: data.price_currency,
  };
}

interface NowPaymentsPaymentStatus {
  payment_id: number;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  actually_paid: number;
  order_id: string;
  updated_at: string;
}

export async function getPaymentStatus(paymentId: number): Promise<NowPaymentsPaymentStatus> {
  const apiKey = getApiKey();

  const resp = await fetch(`${NOWPAYMENTS_API}/payment/${paymentId}`, {
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`NowPayments get payment status failed: ${resp.status} - ${err}`);
  }

  return resp.json();
}

export function verifyIpnNotification(
  data: Record<string, unknown>,
  headers: Record<string, string>
): boolean {
  const ipnSecret = getIpnSecret();
  const receivedHmac = headers["x-nowpayments-sig"];

  if (!receivedHmac) {
    console.warn("No HMAC signature in IPN notification");
    return false;
  }

  // NowPayments HMAC is calculated from the IPN secret and the JSON body
  const hmac = createHmac("sha512", ipnSecret)
    .update(JSON.stringify(data))
    .digest("hex");

  return hmac === receivedHmac;
}
