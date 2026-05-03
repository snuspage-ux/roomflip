import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | RoomFlip.io",
  description: "Contact RoomFlip.io — business information, customer support, and contact details for our AI interior design service.",
  alternates: { canonical: "https://roomflip.io/contact" },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-2">Contact</h1>
        <p className="text-slate-500 mb-12">Business information and contact details</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          {/* Business Info */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Business Information</h2>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 font-medium min-w-[120px]">Business Name:</span>
                <span>Ondřej Slíva</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 font-medium min-w-[120px]">Trading as:</span>
                <span>RoomFlip.io</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 font-medium min-w-[120px]">ID (IČO):</span>
                <span>23051256</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 font-medium min-w-[120px]">Registered:</span>
                <span>Czech Republic</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 font-medium min-w-[120px]">Address:</span>
                <span>Pod Křížem 2, Václavovice, 739 34, Czech Republic</span>
              </div>
            </div>
          </section>

          {/* Customer Support */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Customer Support</h2>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 font-medium min-w-[120px]">Email:</span>
                <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-indigo-400 font-medium min-w-[120px]">Response Time:</span>
                <span>We typically respond within 24 hours on business days</span>
              </div>
            </div>
          </section>

          {/* Payment Provider */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Payment Provider</h2>
            <p>
              Payments on RoomFlip.io are processed securely through{" "}
              <a href="https://www.gopay.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">GoPay</a>.{" "}
              GoPay is a licensed payment institution regulated by the Czech National Bank.
            </p>
          </section>

          {/* Other Inquiries */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Other Inquiries</h2>
            <p>
              For business inquiries, partnership opportunities, or press, please reach out to us at{" "}
              <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a>.
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
