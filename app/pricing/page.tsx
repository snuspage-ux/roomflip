"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { CREDIT_PACKAGES } from "@/lib/credits";
import PricingCard from "@/components/PricingCard";
import EmailModal from "@/components/EmailModal";
import PayPalButton from "@/components/PayPalButton";
import CryptoCheckout from "@/components/CryptoCheckout";

type PaymentMethod = "paypal" | "crypto" | null;

interface UserData {
  id: string;
  email: string;
  credits: number;
}

export default function PricingPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check auth status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const resp = await fetch("/api/auth/me");
        const data = await resp.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const pkg = selectedPackage ? CREDIT_PACKAGES.find((p) => p.id === selectedPackage) : null;

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setPaymentMethod(null);
    setSuccessMessage(null);
    setError(null);

    if (!user && !loading) {
      setShowEmailModal(true);
    }
  };

  const handleEmailSent = (email: string) => {
    // User needs to click magic link in email
    setShowEmailModal(false);
  };

  const handlePaymentSuccess = (credits: number) => {
    setSuccessMessage(`You got ${credits} credits! You can now generate ${credits} room redesigns.`);
    setPaymentMethod(null);
    setSelectedPackage(null);

    // Refresh user data
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  };

  const handlePaymentError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>
      <div className="fixed inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base font-bold shadow-lg shadow-indigo-500/30">R</div>
            <span className="text-xl font-bold tracking-tight">RoomFlip</span>
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-indigo-300">{user.credits} credits</span>
              </div>
            )}
            <Link href="/" className="px-4 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all">
              Back to App
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Get more <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">redesigns</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Buy credits to redesign rooms beyond the daily free limit. 1 credit = 1 room redesign.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto items-start"
          >
            {CREDIT_PACKAGES.map((pkg) => (
              <PricingCard
                key={pkg.id}
                id={pkg.id}
                credits={pkg.credits}
                usd={pkg.usd}
                label={pkg.label}
                description={pkg.description}
                popular={pkg.id === "popular"}
                onSelect={handleSelectPackage}
              />
            ))}
          </motion.div>

          {/* Payment Flow */}
          <AnimatePresence>
            {selectedPackage && pkg && !successMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      {pkg.label} — ${pkg.usd}
                    </h3>
                    <button
                      onClick={() => { setSelectedPackage(null); setPaymentMethod(null); setError(null); }}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-sm text-green-400 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    You get {pkg.credits} credits — {pkg.credits} room redesigns
                  </p>

                  {/* Payment method selection */}
                  {!paymentMethod && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400 mb-3">Choose payment method:</p>
                      <button
                        onClick={() => setPaymentMethod("paypal")}
                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#003087] flex items-center justify-center text-white text-xs font-bold">
                          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/>
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">PayPal</p>
                          <p className="text-xs text-slate-500">Pay with card or PayPal</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setPaymentMethod("crypto")}
                        className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">Crypto</p>
                          <p className="text-xs text-slate-500">Bitcoin, Ethereum, USDT + 100 more</p>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* PayPal */}
                  {paymentMethod === "paypal" && (
                    <div>
                      <PayPalButton
                        packageId={selectedPackage}
                        amount={pkg.usd}
                        email={user?.email}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                      <button
                        onClick={() => setPaymentMethod(null)}
                        className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-400 transition-colors"
                      >
                        Choose another method
                      </button>
                    </div>
                  )}

                  {/* Crypto */}
                  {paymentMethod === "crypto" && (
                    <div>
                      <CryptoCheckout
                        packageId={selectedPackage}
                        amount={pkg.usd}
                        email={user?.email}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                      <button
                        onClick={() => setPaymentMethod(null)}
                        className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-400 transition-colors"
                      >
                        Choose another method
                      </button>
                    </div>
                  )}

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 text-sm text-red-400 text-center"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-white/[0.03] border border-green-500/20 rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Payment Successful!</h3>
                  <p className="text-sm text-slate-300 mb-4">{successMessage}</p>
                  <Link
                    href="/"
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all"
                  >
                    Redesign a Room
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PayPal coming soon */}
          <div className="mt-12 max-w-md mx-auto text-center">
            <p className="text-xs text-slate-500">PayPal payments coming soon.</p>
          </div>

          {/* Features list */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Why buy credits?</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "🎨", title: "All styles unlocked", desc: "Access all 17 interior design styles with every generation." },
                { icon: "🔓", title: "Skip the daily limit", desc: "Credit users bypass the 1/day free limit. Generate as much as you want." },
                { icon: "💾", title: "HD downloads", desc: "Download your redesigned rooms in high resolution." },
                { icon: "♾️", title: "Never expire", desc: "Credits never expire. Buy now, use whenever you want." },
                { icon: "🪑", title: "Furniture upload", desc: "Upload your own furniture photos to include in redesigns." },
                { icon: "🔄", title: "Multiple generations", desc: "Try different styles on the same room without limits." },
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                  <span className="text-xl shrink-0">{feature.icon}</span>
                  <div>
                    <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                    <p className="text-xs text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Payment FAQ</h2>
            <div className="space-y-3">
              {[
                { q: "What payment methods do you accept?", a: "We accept cryptocurrency payments through NowPayments (Bitcoin, Ethereum, USDT, and 100+ cryptocurrencies). PayPal coming soon." },
                { q: "How do credits work?", a: "1 credit = 1 AI room redesign. When you buy a credit pack, the credits are added to your account immediately. Each generation consumes 1 credit, and you skip the daily free limit." },
                { q: "Do credits expire?", a: "No! Credits never expire. Buy once and use them whenever you want." },
                { q: "Is crypto payment safe?", a: "Yes. All crypto payments are processed through NowPayments, a trusted payment gateway. You can pay with Bitcoin, Ethereum, USDT, and many other cryptocurrencies." },
                { q: "What is your refund policy?", a: "We offer refunds for unused credits. If you haven't used any credits, we'll refund your purchase. See our <a href='/refund-policy' class='text-indigo-400 hover:underline'>Refund Policy</a> for details." },
              ].map((faq, i) => (
                <details key={i} className="group bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                  <summary className="px-5 py-3.5 cursor-pointer font-medium text-sm hover:bg-white/[0.03] transition-colors flex justify-between items-center">
                    {faq.q}
                    <span className="text-slate-500 group-open:rotate-45 transition-transform text-lg shrink-0 ml-2">+</span>
                  </summary>
                  <p className="px-5 pb-3.5 text-sm text-slate-400" dangerouslySetInnerHTML={{ __html: faq.a }} />
                </details>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => { setShowEmailModal(false); setSelectedPackage(null); }}
        onEmailSent={handleEmailSent}
      />
    </main>
  );
}
