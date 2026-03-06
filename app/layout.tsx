import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RoomFlip.io - AI Interior Design | Redesign Any Room in Seconds",
    template: "%s | RoomFlip.io",
  },
  description: "Upload a photo of your room and AI redesigns it in 15+ stunning styles. Modern, Scandinavian, Japanese, Luxury and more. Professional interior design — completely free.",
  keywords: ["AI interior design", "room redesign", "AI room makeover", "interior design AI", "room decorator", "AI home staging", "virtual room designer", "room transformation AI", "interior design tool", "room style changer", "AI furniture", "home redesign app"],
  metadataBase: new URL("https://roomflip.io"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "RoomFlip.io - Redesign Any Room with AI",
    description: "Upload a photo. Pick a style. Get a stunning redesign in seconds. 15+ design styles, completely free.",
    url: "https://roomflip.io",
    siteName: "RoomFlip.io",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "RoomFlip AI Interior Design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomFlip.io - AI Interior Design",
    description: "Redesign any room with AI in seconds. 15+ stunning styles. Completely free.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1599056171664080" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        
        <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {"@type": "Question", "name": "Is RoomFlip really free?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, RoomFlip is 100% free. Upload any room photo and get AI-powered redesigns in 17+ styles without signing up or paying."}},
            {"@type": "Question", "name": "How does AI room redesign work?", "acceptedAnswer": {"@type": "Answer", "text": "Upload a photo of your room, select a design style, and our AI analyzes the room structure and generates a photorealistic redesign while preserving your room layout."}},
            {"@type": "Question", "name": "How many rooms can I redesign per day?", "acceptedAnswer": {"@type": "Answer", "text": "You can redesign up to 5 rooms per day for free. The limit resets every 24 hours."}},
            {"@type": "Question", "name": "What design styles are available?", "acceptedAnswer": {"@type": "Answer", "text": "We offer 17 styles: Modern, Minimalist, Scandinavian, Japanese, Luxury, Bohemian, Mid-Century Modern, Coastal, Farmhouse, Contemporary, Rustic, Tropical, Art Deco, Futuristic, and Vintage."}},
            {"@type": "Question", "name": "Do I need to create an account?", "acceptedAnswer": {"@type": "Answer", "text": "No account needed. Just upload your photo and start redesigning instantly."}}
          ]
        }`}} />
        <Script id="json-ld" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{__html: `{"@context":"https://schema.org","@type":"SoftwareApplication","name":"RoomFlip.io","applicationCategory":"DesignApplication","url":"https://roomflip.io","offers":{"@type":"Offer","price":"0","priceCurrency":"USD","name":"Free"}}`}} />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1599056171664080" strategy="afterInteractive" crossOrigin="anonymous" data-overlays="bottom" />
      </body>
    </html>
  );
}
