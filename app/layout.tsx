import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoomAI — AI Interior Design | Redesign Any Room in Seconds",
  description: "Upload a photo of your room and let AI redesign it in any style. Modern, minimalist, scandinavian, and 12 more styles. Professional results in under a minute.",
  keywords: "AI interior design, room redesign, virtual staging, AI room planner, interior decorator AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
