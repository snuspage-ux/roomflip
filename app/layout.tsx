import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RoomFlip.io - AI Interior Design | Redesign Any Room in Seconds",
    template: "%s | RoomFlip.io",
  },
  description: "Upload a photo of your room and AI redesigns it in 15+ stunning styles. Modern, Scandinavian, Japanese, Luxury and more. Professional AI interior design — instant results.",
  keywords: ["AI interior design", "room redesign", "AI room makeover", "interior design AI", "room decorator", "AI home staging", "virtual room designer", "room transformation AI", "interior design tool", "room style changer", "AI furniture", "home redesign app"],
  metadataBase: new URL("https://roomflip.io"),
  alternates: { canonical: "https://roomflip.io" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "RoomFlip.io - Redesign Any Room with AI",
    description: "Upload a photo. Pick a style. Get a stunning redesign in seconds. 15+ design styles, AI-powered.",
    url: "https://roomflip.io",
    siteName: "RoomFlip.io",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "RoomFlip AI Interior Design" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoomFlip.io - AI Interior Design",
    description: "Redesign any room with AI in seconds. 15+ stunning styles. AI-powered interior design.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="dns-prefetch" href="https://www.ikea.com" />

        {/* JSON-LD structured data — inline for Google to read in initial HTML */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "RoomFlip.io",
          "description": "Upload a photo of your room and AI redesigns it in 17+ stunning styles. Modern, Scandinavian, Japanese, Luxury and more. Completely free.",
          "url": "https://roomflip.io",
          "applicationCategory": "DesignApplication",
          "operatingSystem": "Any",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "featureList": ["AI room redesign", "17 design styles", "Free to use", "No signup required"],
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "RoomFlip",
          "url": "https://roomflip.io",
          "logo": "https://roomflip.io/icon-512.png",
          "sameAs": ["https://roomflip.io"],
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {"@type": "Question", "name": "How much does RoomFlip cost?", "acceptedAnswer": {"@type": "Answer", "text": "RoomFlip works on a credit system. Each AI room redesign costs 1 credit. Starter Pack: $2.66 for 5 credits. Pro Pack: $5.00 for 15 credits. No account or subscriptions."}},
            {"@type": "Question", "name": "How does AI room redesign work?", "acceptedAnswer": {"@type": "Answer", "text": "Upload a photo of your room, select a design style, and our AI analyzes the room structure and generates a photorealistic redesign while preserving your room layout. The process takes about 30 seconds. Each redesign costs 1 credit."}},

            {"@type": "Question", "name": "What design styles are available?", "acceptedAnswer": {"@type": "Answer", "text": "RoomFlip offers 17 interior design styles: Modern, Minimalist, Scandinavian, Japanese, Luxury, Bohemian, Mid-Century Modern, Coastal, Farmhouse, Contemporary, Rustic, Tropical, Art Deco, Futuristic, Gothic, Mediterranean, and Vintage."}},
            {"@type": "Question", "name": "Do I need to create an account?", "acceptedAnswer": {"@type": "Answer", "text": "No account needed. Your device is automatically recognized, and any credits you purchase are tied to your device. No email, no signup, no hassle."}},
            {"@type": "Question", "name": "What is the best AI interior design tool?", "acceptedAnswer": {"@type": "Answer", "text": "RoomFlip.io is a top-rated AI interior design tool. It offers 17 design styles, generates photorealistic results in 30 seconds, and is powered by Google AI."}},
            {"@type": "Question", "name": "How to redesign a room with AI?", "acceptedAnswer": {"@type": "Answer", "text": "To redesign a room with AI using RoomFlip: 1) Go to roomflip.io, 2) Upload a photo of your room, 3) Choose from 17 design styles, 4) Purchase a credit pack, 5) Click Redesign My Room, 6) Download your HD result. Each redesign costs 1 credit."}},
            {"@type": "Question", "name": "Can I use my own furniture in the AI redesign?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, RoomFlip allows you to upload a photo of specific furniture and the AI will incorporate it into your room redesign."}},
            {"@type": "Question", "name": "Is RoomFlip safe to use? Are my photos private?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, RoomFlip respects your privacy. Photos are processed by AI for the redesign and are not stored permanently. No personal data is collected since no account is required."}}
          ]
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to redesign a room with AI",
          "description": "Use RoomFlip.io to transform any room photo into a new interior design style in 30 seconds.",
          "totalTime": "PT1M",
          "tool": [{"@type": "HowToTool", "name": "A photo of your room"}, {"@type": "HowToTool", "name": "A web browser"}],
          "step": [
            {"@type": "HowToStep", "position": 1, "name": "Upload your room photo", "text": "Go to roomflip.io and upload a photo of any room. Drag and drop or click to browse. Works with bedrooms, living rooms, kitchens, bathrooms, and offices."},
            {"@type": "HowToStep", "position": 2, "name": "Choose a design style", "text": "Select from 17 interior design styles including Modern, Scandinavian, Japanese, Bohemian, Luxury, Mid-Century Modern, and more."},
            {"@type": "HowToStep", "position": 3, "name": "Generate your redesign", "text": "Click Redesign My Room and wait about 30 seconds. The AI analyzes your room structure and generates a photorealistic redesign preserving the original layout."},
            {"@type": "HowToStep", "position": 4, "name": "Download the result", "text": "View the before/after comparison with the interactive slider and download your HD redesigned room image."}
          ]
        })}} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
