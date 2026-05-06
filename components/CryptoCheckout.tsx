"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

interface CryptoCheckoutProps {
  packageId: string;
  amount: number;
  email?: string;
  onSuccess: (credits: number) => void;
  onError: (error: string) => void;
}

export default function CryptoCheckout({ packageId, amount, email, onSuccess, onError }: CryptoCheckoutProps) {
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchaseId, setPurchaseId] = useState<string | null>(null);

  const handleCryptoPayment = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/nowpayments/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, email }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error);

      setInvoiceUrl(data.invoiceUrl);
      setPurchaseId(data.purchaseId);

      // Open NowPayments invoice in new tab/window
      window.open(data.invoiceUrl, "_blank", "noopener,noreferrer");

      // Start polling for payment status
      pollPaymentStatus(data.purchaseId);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to create crypto invoice");
    } finally {
      setLoading(false);
    }
  }, [packageId, email, onError]);

  const pollPaymentStatus = useCallback(async (pid: string) => {
    const maxAttempts = 120; // ~10 minutes with 5s intervals
    let attempts = 0;

    const check = async () => {
      try {
        const resp = await fetch("/api/auth/me");
        const data = await resp.json();
        if (data.user) {
          // Update credits display
          onSuccess(data.user.credits);
          return;
        }
      } catch {
        // ignore polling errors
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(check, 5000);
      }
    };

    // Start checking after 30 seconds (first check)
    setTimeout(check, 30000);
  }, [onSuccess]);

  if (invoiceUrl) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Crypto Payment Initiated</h3>
        <p className="text-sm text-slate-400 mb-4">
          A new tab opened with the payment details. Complete the payment there.
        </p>
        <p className="text-xs text-slate-500 mb-4">
          Credits will be added automatically once the payment is confirmed.
        </p>
        <div className="flex gap-3 justify-center">
          <a
            href={invoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            Open Payment Page
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">Pay with Crypto</h3>
      <p className="text-sm text-slate-400 mb-4">
        Pay with Bitcoin, Ethereum, USDT, and 100+ cryptocurrencies.
      </p>
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {["BTC", "ETH", "USDT", "USDC", "SOL", "XRP"].map((coin) => (
          <span key={coin} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300">
            {coin}
          </span>
        ))}
      </div>
      <button
        onClick={handleCryptoPayment}
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? "Creating invoice..." : `Pay $${amount} with Crypto`}
      </button>
    </div>
  );
}
