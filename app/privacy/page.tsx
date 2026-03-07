import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | RoomFlip.io",
  description: "RoomFlip.io privacy policy. Learn how we handle your data, photos, cookies, and third-party services like Google AdSense.",
  alternates: { canonical: "https://roomflip.io/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last updated: March 6, 2026</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              Welcome to RoomFlip.io (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website at roomflip.io and use our AI-powered interior design tool.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-3">We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Uploaded Images:</strong> When you upload a room photo, the image is sent to our AI processing service to generate your redesign. We do not permanently store your uploaded images on our servers. Images are processed in real-time and discarded after the redesign is generated.</li>
              <li><strong className="text-white">Usage Data:</strong> We automatically collect certain information about your device and how you interact with our website, including your IP address (anonymized for rate limiting), browser type, pages visited, and time spent on the site.</li>
              <li><strong className="text-white">Cookies &amp; Similar Technologies:</strong> We use cookies and similar tracking technologies for analytics and advertising purposes. See section 5 for more details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To provide and maintain our AI room redesign service</li>
              <li>To enforce usage limits (5 redesigns per day per user)</li>
              <li>To improve our website and user experience</li>
              <li>To display relevant advertisements through Google AdSense</li>
              <li>To analyze website traffic and usage patterns</li>
              <li>To detect and prevent abuse or unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services that may collect data:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Google AdSense:</strong> We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
              <li><strong className="text-white">AI Processing Services:</strong> Your uploaded images are processed by third-party AI services (Google AI) to generate room redesigns. These services process images transiently and do not retain them.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Cookies</h2>
            <p className="mb-3">Our website uses the following types of cookies:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-white">Essential Cookies:</strong> Required for the website to function properly, such as rate limiting and session management.</li>
              <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
              <li><strong className="text-white">Advertising Cookies:</strong> Used by Google AdSense to display relevant advertisements. These cookies may track your browsing activity across multiple websites.</li>
            </ul>
            <p className="mt-3">You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Data Retention</h2>
            <p>
              Uploaded images are processed in real-time and are not stored permanently. Generated redesign images are provided to you directly and are not retained on our servers. Usage data and analytics information may be retained for up to 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>The right to access and receive a copy of your personal data</li>
              <li>The right to rectify or update your personal data</li>
              <li>The right to request deletion of your personal data</li>
              <li>The right to restrict or object to processing of your personal data</li>
              <li>The right to data portability</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us at the email address below.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal data from a child under 13, we will take steps to delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of our service after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
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
