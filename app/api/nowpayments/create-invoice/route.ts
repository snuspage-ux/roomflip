import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/nowpayments";
import { getCreditPackage } from "@/lib/credits";
import { getCurrentUser, findOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { packageId, email } = await request.json();

    const pkg = getCreditPackage(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    // Get or create user
    let user = await getCurrentUser();
    if (!user) {
      if (!email) {
        return NextResponse.json({ error: "Email required for new users" }, { status: 400 });
      }
      user = await findOrCreateUser(email);
    }

    // Create a placeholder purchase record to get an order ID
    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        email: user.email,
        amount: pkg.usd,
        credits: pkg.credits,
        method: "crypto",
        status: "pending",
      },
    });

    // Create NowPayments invoice
    const invoice = await createInvoice(pkg.usd, "usd", purchase.id);

    // Update purchase with invoice ID
    await prisma.purchase.update({
      where: { id: purchase.id },
      data: { nowpaymentsInvoiceId: String(invoice.id) },
    });

    return NextResponse.json({
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoice_url,
      purchaseId: purchase.id,
    });
  } catch (error) {
    console.error("NowPayments create invoice error:", error);
    const message = error instanceof Error ? error.message : "Failed to create invoice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
