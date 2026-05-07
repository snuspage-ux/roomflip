"use client";

import { useState } from "react";

interface StripeCheckoutProps {
  packageId: string;
  amount: number;
  email?: string;
  onSuccess?: (credits: number) => void;
  onError?: (msg: string) => void;
}

export default function StripeCheckout({ packageId, amount, email, onSuccess, onError }: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const resp = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId, email: email || undefined }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      onError?.(msg);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-[#635bff] to-[#7c3aed] hover:from-[#554cff] hover:to-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm transition-all shadow-lg"
    >
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Redirecting to Stripe...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.877 4.56 3.15 3.8 4.992 3.8 7.277c0 4.07 5.25 5.576 7.385 6.33 2.91 1.03 3.928 1.798 3.928 2.94 0 1.358-1.103 2.146-2.993 2.146-2.552 0-5.295-1.293-6.883-2.256l-.915 5.644c1.574.835 4.139 1.519 6.715 1.519 3.767 0 6.422-1.362 7.932-2.854 1.563-1.547 2.34-3.676 2.34-6.22 0-4.476-5.548-6.113-7.533-6.777z"/>
          </svg>
          Pay with Card (Stripe)
        </>
      )}
    </button>
  );
}
