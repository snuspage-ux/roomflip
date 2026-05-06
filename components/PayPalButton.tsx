"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface PayPalButtonProps {
  packageId: string;
  amount: number;
  email?: string;
  onSuccess: (credits: number) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError: (err: unknown) => void;
      }) => {
        render: (container: string) => void;
      };
    };
  }
}

export default function PayPalButton({ packageId, amount, email, onSuccess, onError }: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Load PayPal SDK
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) return;

    if (document.querySelector("script[data-paypal-sdk]")) {
      // SDK already loaded
      const checkReady = setInterval(() => {
        if (window.paypal) {
          setSdkReady(true);
          clearInterval(checkReady);
        }
      }, 200);
      return () => clearInterval(checkReady);
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
    script.setAttribute("data-paypal-sdk", "true");
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);

    return () => {
      // Don't remove — needed for re-renders
    };
  }, []);

  // Wait a tick after SDK is ready before rendering
  useEffect(() => {
    if (!sdkReady || !window.paypal || !buttonRef.current) return;

    // Clear any existing buttons
    buttonRef.current.innerHTML = "";

    window.paypal.Buttons({
      createOrder: async () => {
        setLoading(true);
        try {
          const resp = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ packageId, email }),
          });

          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error);

          return data.orderId;
        } catch (err) {
          onError(err instanceof Error ? err.message : "Failed to create PayPal order");
          setLoading(false);
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          const resp = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID }),
          });

          const result = await resp.json();
          if (!resp.ok) throw new Error(result.error);

          onSuccess(result.credits);
        } catch (err) {
          onError(err instanceof Error ? err.message : "Failed to complete payment");
        } finally {
          setLoading(false);
        }
      },
      onError: (err) => {
        setLoading(false);
        onError("PayPal checkout failed. Please try again.");
      },
    }).render("#paypal-button-container");
  }, [sdkReady, packageId, email, onSuccess, onError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!sdkReady) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-5 h-5 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
        <span className="ml-2 text-sm text-slate-400">Loading PayPal...</span>
      </div>
    );
  }

  return <div id="paypal-button-container" ref={buttonRef} className="min-h-[40px]" />;
}
