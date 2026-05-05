import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | RoomFlip.io",
  description: "RoomFlip.io refund and cancellation policy. Your rights under EU consumer law and how to request a refund for credit packs.",
  alternates: { canonical: "https://roomflip.io/refund-policy" },
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-2">Refund & Cancellation Policy</h1>
        <p className="text-slate-500 mb-4">Last updated: May 5, 2026</p>

        <div className="mb-8 p-4 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-slate-400">
          <p className="font-semibold text-white mb-1">Service Provider:</p>
          <p>Ondřej Slíva, IČO: 23051256, Pod Křížem 2, Václavovice, 739 34, Czech Republic</p>
          <p className="mt-2">Contact: <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a></p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Right of Withdrawal (Cooling-Off Period)</h2>
            <p className="mb-3">
              Under EU consumer law (Directive 2011/83/EU), you have the right to withdraw from your purchase within <strong className="text-white">14 calendar days</strong> without giving any reason.
            </p>
            <p className="mb-3">
              The withdrawal period expires 14 days after the day you purchased a credit pack on RoomFlip.io.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. When Refunds Are Available</h2>
            <p className="mb-3">You are entitled to a full refund if:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You request a refund within the 14-day cooling-off period <strong className="text-white">and</strong></li>
              <li>You have <strong className="text-white">not consumed any credits</strong> from the purchased pack (no images downloaded)</li>
            </ul>
            <p className="mt-3">
              Once a credit has been used to download a redesigned image, that portion of the purchase is considered fulfilled and is non-refundable. Any unused credits within the same pack remain eligible for a partial refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How to Request a Refund</h2>
            <p className="mb-3">To exercise your right of withdrawal, contact us at:</p>
            <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl text-sm">
              <p><strong className="text-white">Email:</strong> <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a></p>
            </div>
            <p className="mt-3">
              Please include your device identifier (visible in your purchase confirmation) and the date of purchase. We will process your refund within <strong className="text-white">14 days</strong> of receiving your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Refund Method</h2>
            <p>
              Refunds will be issued using the same payment method you used for the original purchase, unless you explicitly agree to a different method. You will not incur any fees as a result of the refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Non-Refundable Situations</h2>
            <p className="mb-3">Refunds are not available in the following cases:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>All credits in the pack have been consumed (downloaded)</li>
              <li>More than 14 days have passed since the purchase date</li>
              <li>The refund request does not include sufficient information to identify the purchase</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Statutory Rights</h2>
            <p>
              This refund policy does not affect your statutory rights under EU or Czech consumer protection law. If you believe you have additional rights under applicable law, please contact us and we will review your case.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Complaints & Dispute Resolution</h2>
            <p className="mb-3">
              If you are unsatisfied with how we handled your refund request, you may submit a complaint via email to <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a>. We will respond within 14 days.
            </p>
            <p>
              <strong className="text-white">EU Online Dispute Resolution:</strong> The European Commission provides an online dispute resolution platform at{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">ec.europa.eu/consumers/odr</a>.{" "}
              Our email for ODR purposes is <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="text-indigo-400 hover:underline text-sm">Back to RoomFlip.io</Link>
        </div>
      </div>
    </main>
  );
}
