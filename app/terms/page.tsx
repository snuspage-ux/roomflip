import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | RoomFlip.io",
  description: "RoomFlip.io terms of service. Rules and guidelines for using our AI interior design tool, including subscription plans, billing, and refunds.",
  alternates: { canonical: "https://roomflip.io/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-4">Last updated: May 3, 2026</p>

        <div className="mb-8 p-4 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-slate-400">
          <p className="font-semibold text-white mb-1">Service Provider:</p>
          <p>Ondřej Slíva, IČO: 23051256, Pod Křížem 2, Václavovice, 739 34, Czech Republic</p>
          <p className="mt-2">Contact: <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a></p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using RoomFlip.io (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. We reserve the right to modify these terms at any time, and your continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              RoomFlip.io is an AI-powered interior design tool that allows users to upload photos of their rooms and receive AI-generated redesigns in various styles. The Service is offered free of charge with limited daily usage, as well as through paid subscription plans with additional features and higher usage limits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Account Registration</h2>
            <p className="mb-3">
              To use paid features of the Service, you may need to create an account. When creating an account, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Be responsible for all activity under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Subscription Plans &amp; Pricing</h2>
            <p className="mb-3">The Service is available under the following plans:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Free Plan:</strong> 5 room redesigns per day, basic features. No payment required.</li>
              <li><strong className="text-white">Starter Plan:</strong> $5/month (or local equivalent), 20 room redesigns per month, priority support.</li>
              <li><strong className="text-white">Pro Plan:</strong> $9/month (or local equivalent), 50 room redesigns per month, priority support, and additional features.</li>
            </ul>
            <p className="mt-3">
              All prices are in US Dollars and are exclusive of applicable taxes (VAT, sales tax, etc.). We reserve the right to change our pricing at any time. Changes will be communicated at least 14 days in advance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Payment Terms</h2>
            <p className="mb-3">Payment processing details:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Payments are processed securely through GoPay s.r.o., a licensed payment institution regulated by the Czech National Bank</li>
              <li>Subscription fees are charged in advance on a monthly basis</li>
              <li>Accepted payment methods include credit/debit cards and other methods supported by GoPay</li>
              <li>You authorize us to charge your chosen payment method for all fees incurred</li>
              <li>By providing payment information, you represent that you are authorized to use the payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Cancellation &amp; Refunds</h2>
            <p className="mb-3">Cancellation and refund policy:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You can cancel your subscription at any time from your account settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds are provided for partial months of service</li>
              <li><strong className="text-white">14-day cooling-off period:</strong> Under EU consumer law, you have the right to cancel your subscription within 14 days of purchase and receive a full refund, provided you have not fully consumed the service</li>
              <li>To request a refund, contact us at <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. User-Uploaded Content</h2>
            <p className="mb-3">By uploading photos to RoomFlip.io, you represent and warrant that:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>You own the rights to the images you upload, or have permission to use them</li>
              <li>Your uploaded content does not infringe on any third party&apos;s intellectual property rights</li>
              <li>Your uploaded content does not contain illegal, harmful, or offensive material</li>
              <li>You will not upload images containing personally identifiable information of others without their consent</li>
            </ul>
            <p className="mt-3">
              We do not claim ownership of your uploaded images. Your photos are processed transiently by our AI service and are not permanently stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. AI-Generated Content</h2>
            <p>
              The redesigned room images generated by our AI are provided for personal, non-commercial inspiration purposes. While we strive for high-quality results, AI-generated designs are approximations and should not be used as professional architectural or interior design plans. We make no guarantees regarding the accuracy, feasibility, or safety of implementing any AI-suggested designs in real life.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Usage Limits &amp; Fair Use</h2>
            <p className="mb-3">To ensure fair access for all users, the following limits apply:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Free users: 5 room redesigns per day</li>
              <li>Starter plan: 20 room redesigns per month</li>
              <li>Pro plan: 50 room redesigns per month</li>
              <li>Automated or programmatic access to the Service is prohibited</li>
              <li>Attempting to bypass usage limits is a violation of these terms</li>
              <li>We reserve the right to adjust usage limits at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Prohibited Uses</h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Upload illegal, harmful, threatening, abusive, or objectionable content</li>
              <li>Attempt to reverse-engineer, decompile, or hack the Service</li>
              <li>Use automated scripts, bots, or scrapers to access the Service</li>
              <li>Interfere with or disrupt the Service or its infrastructure</li>
              <li>Impersonate any person or entity</li>
              <li>Use the Service for any commercial purpose without our written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Intellectual Property</h2>
            <p>
              The RoomFlip.io website, its original content (excluding user-uploaded images), features, and functionality are owned by RoomFlip and are protected by international copyright, trademark, and other intellectual property laws. Our name, logo, and all related marks are trademarks of RoomFlip.
            </p>
          </section>



          <section>
            <h2 className="text-xl font-semibold text-white mb-3">12. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">13. Limitation of Liability</h2>
            <p>
              IN NO EVENT SHALL ROOMFLIP, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">14. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the Service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach these Terms of Service. Upon termination, your right to use the Service will immediately cease. If you have paid for a subscription, a pro-rata refund may be provided at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">15. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the Czech Republic. Any disputes arising from these terms shall first be resolved through good-faith negotiation. If a resolution cannot be reached, disputes shall be subject to the jurisdiction of the courts of the Czech Republic.
            </p>
            <p className="mt-3">
              <strong className="text-white">EU Online Dispute Resolution:</strong> The European Commission provides an online dispute resolution platform at{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">ec.europa.eu/consumers/odr</a>.{" "}
              Our email for ODR purposes is <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">16. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-3 p-4 bg-white/[0.03] border border-white/10 rounded-xl text-sm">
              <p><strong className="text-white">Service Provider:</strong> Ondřej Slíva</p>
              <p><strong className="text-white">IČO:</strong> 23051256</p>
              <p><strong className="text-white">Address:</strong> Pod Křížem 2, Václavovice, 739 34, Czech Republic</p>
              <p><strong className="text-white">Email:</strong> <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a></p>
            </div>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="text-indigo-400 hover:underline text-sm">Back to RoomFlip.io</Link>
        </div>
      </div>
    </main>
  );
}
