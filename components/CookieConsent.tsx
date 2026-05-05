"use client";

import { useState, useEffect } from "react";

type Consent = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    } else {
      // Show banner after a short delay for smooth UX
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setConsent("accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setConsent("rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4">
      <div className="max-w-3xl mx-auto bg-[#1a1a2e] border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 text-sm text-slate-300 leading-relaxed">
            <p>
              This website uses cookies for analytics to help us improve your experience.{" "}
              <a href="/privacy" className="text-indigo-400 hover:underline whitespace-nowrap">Learn more</a>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={reject}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={accept}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
