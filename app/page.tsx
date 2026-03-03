"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { CompareSlider } from "@/components/ui/compare-slider";

const STYLES = [
  { name: "Modern", emoji: "🏢", color: "from-slate-500 to-gray-600" },
  { name: "Minimalist", emoji: "⬜", color: "from-gray-400 to-slate-500" },
  { name: "Scandinavian", emoji: "🌲", color: "from-amber-400 to-yellow-600" },
  { name: "Vintage", emoji: "🕰️", color: "from-amber-400 to-orange-500" },
  { name: "Luxury", emoji: "✨", color: "from-amber-300 to-yellow-500" },
  { name: "Bohemian", emoji: "🌸", color: "from-pink-400 to-rose-500" },
  { name: "Japanese", emoji: "🎋", color: "from-emerald-400 to-green-600" },
  { name: "Mid-Century Modern", emoji: "🪑", color: "from-orange-400 to-amber-500" },
  { name: "Coastal", emoji: "🌊", color: "from-cyan-400 to-blue-500" },
  { name: "Farmhouse", emoji: "🏡", color: "from-lime-400 to-green-500" },
  { name: "Contemporary", emoji: "💎", color: "from-violet-400 to-purple-500" },
  { name: "Rustic", emoji: "🪵", color: "from-amber-600 to-yellow-700" },
  { name: "Tropical", emoji: "🌴", color: "from-green-400 to-emerald-500" },
  { name: "Art Deco", emoji: "🎭", color: "from-yellow-400 to-amber-500" },
  { name: "Futuristic", emoji: "🚀", color: "from-blue-400 to-indigo-500" },
];

// IKEA affiliate links (Awin tracking will be added after approval)
const IKEA_BASE = "https://www.ikea.com/cz/en/search/?q=";
const SHOP_ITEMS: Record<string, { name: string; emoji: string; url: string; store: string }[]> = {
  "Modern": [
    { name: "KIVIK Sofa", emoji: "🛋️", url: `${IKEA_BASE}kivik+sofa`, store: "IKEA" },
    { name: "LACK Coffee Table", emoji: "☕", url: `${IKEA_BASE}lack+coffee+table`, store: "IKEA" },
    { name: "HEKTAR Floor Lamp", emoji: "💡", url: `${IKEA_BASE}hektar+floor+lamp`, store: "IKEA" },
    { name: "BJÖRKSTA Wall Art", emoji: "🖼️", url: `${IKEA_BASE}björksta+picture`, store: "IKEA" },
  ],
  "Minimalist": [
    { name: "MALM Bed Frame", emoji: "🛏️", url: `${IKEA_BASE}malm+bed`, store: "IKEA" },
    { name: "KALLAX Shelf", emoji: "📚", url: `${IKEA_BASE}kallax+shelf`, store: "IKEA" },
    { name: "GUNRID Curtains", emoji: "🪟", url: `${IKEA_BASE}gunrid+curtains`, store: "IKEA" },
    { name: "GRADVIS Vase", emoji: "🏺", url: `${IKEA_BASE}gradvis+vase`, store: "IKEA" },
  ],
  "Scandinavian": [
    { name: "MÖRBYLÅNGA Table", emoji: "🪵", url: `${IKEA_BASE}mörbylånga+dining+table`, store: "IKEA" },
    { name: "INGABRITTA Throw", emoji: "🧶", url: `${IKEA_BASE}ingabritta+throw`, store: "IKEA" },
    { name: "RANARP Pendant", emoji: "💡", url: `${IKEA_BASE}ranarp+pendant+lamp`, store: "IKEA" },
    { name: "LUDDE Sheepskin", emoji: "🐑", url: `${IKEA_BASE}ludde+sheepskin`, store: "IKEA" },
  ],
  "Luxury": [
    { name: "STOCKHOLM Sofa", emoji: "🛋️", url: `${IKEA_BASE}stockholm+sofa`, store: "IKEA" },
    { name: "STOCKHOLM Mirror", emoji: "🪞", url: `${IKEA_BASE}stockholm+mirror`, store: "IKEA" },
    { name: "SJÖPENNA Pendant", emoji: "✨", url: `${IKEA_BASE}sjöpenna+pendant+lamp`, store: "IKEA" },
    { name: "GLADOM Side Table", emoji: "🏛️", url: `${IKEA_BASE}gladom+tray+table`, store: "IKEA" },
  ],
  "Vintage": [
    { name: "STRANDMON Armchair", emoji: "💺", url: `${IKEA_BASE}strandmon+armchair`, store: "IKEA" },
    { name: "PUGG Wall Clock", emoji: "🕰️", url: `${IKEA_BASE}pugg+wall+clock`, store: "IKEA" },
    { name: "ÅRSTID Table Lamp", emoji: "🔔", url: `${IKEA_BASE}årstid+table+lamp`, store: "IKEA" },
    { name: "PERSISK Rug", emoji: "🟤", url: `${IKEA_BASE}persisk+rug`, store: "IKEA" },
  ],
  "Mid-Century Modern": [
    { name: "EKENÄSET Armchair", emoji: "🪑", url: `${IKEA_BASE}ekenäset+armchair`, store: "IKEA" },
    { name: "STOCKHOLM Sideboard", emoji: "🪵", url: `${IKEA_BASE}stockholm+sideboard`, store: "IKEA" },
    { name: "SKAFTET Floor Lamp", emoji: "💡", url: `${IKEA_BASE}skaftet+floor+lamp`, store: "IKEA" },
    { name: "STOCKHOLM Mirror", emoji: "☀️", url: `${IKEA_BASE}stockholm+mirror+round`, store: "IKEA" },
  ],
  "Bohemian": [
    { name: "JASSA Collection", emoji: "🧵", url: `${IKEA_BASE}jassa+decoration`, store: "IKEA" },
    { name: "BUSKBO Armchair", emoji: "🪑", url: `${IKEA_BASE}buskbo+armchair`, store: "IKEA" },
    { name: "SVARTHO Cushion", emoji: "🛋️", url: `${IKEA_BASE}boho+cushion+cover`, store: "IKEA" },
    { name: "FEJKA Plant Pots", emoji: "🪴", url: `${IKEA_BASE}fejka+plant+pot`, store: "IKEA" },
  ],
  "Japanese": [
    { name: "TATAMI Mat", emoji: "🟫", url: `${IKEA_BASE}floor+mat+natural`, store: "IKEA" },
    { name: "RISÖR Room Divider", emoji: "🚪", url: `${IKEA_BASE}risör+room+divider`, store: "IKEA" },
    { name: "BACKIG Tea Set", emoji: "🍵", url: `${IKEA_BASE}backig+tea+set`, store: "IKEA" },
    { name: "FEJKA Bonsai", emoji: "🌳", url: `${IKEA_BASE}fejka+bonsai`, store: "IKEA" },
  ],
  "Coastal": [
    { name: "FLADIS Basket", emoji: "🧺", url: `${IKEA_BASE}fladis+basket`, store: "IKEA" },
    { name: "GURLI Cushion Blue", emoji: "🛋️", url: `${IKEA_BASE}gurli+cushion+blue`, store: "IKEA" },
    { name: "DRIFTWOOD Decor", emoji: "🪵", url: `${IKEA_BASE}decorative+driftwood`, store: "IKEA" },
    { name: "LOHALS Jute Rug", emoji: "🟤", url: `${IKEA_BASE}lohals+rug+jute`, store: "IKEA" },
  ],
  "Farmhouse": [
    { name: "VÄGGIS Board", emoji: "🪵", url: `${IKEA_BASE}väggis+noticeboard`, store: "IKEA" },
    { name: "MASON Jar Lamp", emoji: "🫙", url: `${IKEA_BASE}rustic+pendant+lamp`, store: "IKEA" },
    { name: "HEMNES Storage", emoji: "🚪", url: `${IKEA_BASE}hemnes+storage`, store: "IKEA" },
    { name: "RUNNEN Decor", emoji: "🪧", url: `${IKEA_BASE}farmhouse+decoration`, store: "IKEA" },
  ],
};

const EXAMPLES = [{ before: "/original-room.jpg?v=2", after: "/after-room.jpg?v=2", style: "Modern" }];


const FREE_STYLES = ["Modern", "Minimalist", "Luxury", "Vintage", "Mid-Century Modern"];

const PLANS = [
  { key: "free", name: "Free", price: "$0", period: "", features: ["3 redesigns total", "Watermark on images", "5 styles", "1K resolution"], cta: "Current Plan", highlight: false },
  { key: "starter", name: "Starter", price: "$5", period: "/month", features: ["20 redesigns/month", "No watermark", "15 styles", "2K resolution"], cta: "Get Starter", highlight: false },
  { key: "pro", name: "Pro", price: "$9", period: "/month", features: ["50 redesigns/month", "No watermark", "15 styles", "4K resolution", "Priority generation", "Add specific furniture", "Generation history"], cta: "Start Pro", highlight: true },

];

export default function Home() {
  const { data: session } = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState("Modern");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState("free");
  const fileRef = useRef<HTMLInputElement>(null);

  const downloadWithWatermark = async (url: string, filename: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      ctx.save();
      const fontSize = Math.floor(canvas.width / 12);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const text = "RoomFlip.io";
      const spacingX = fontSize * 8;
      const spacingY = fontSize * 4;
      ctx.rotate(-30 * Math.PI / 180);
      for (let y = -canvas.height; y < canvas.height * 2; y += spacingY) {
        for (let x = -canvas.width; x < canvas.width * 2; x += spacingX) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/jpeg", 0.9);
      link.click();
    };
    img.src = url;
  };
  const [furnitureImage, setFurnitureImage] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("switch") === "1") {
      window.history.replaceState({}, "", "/");
      signIn("google");
      return;
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user").then(r => r.json()).then(d => { if (d.credits !== undefined) setCredits(d.credits); if (d.plan) setPlan(d.plan); }).catch(() => {});
    }
  }, [session]);

  const handleFile = useCallback((file: File) => { const reader = new FileReader(); reader.onloadend = () => setImage(reader.result as string); reader.readAsDataURL(file); }, []);
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFile(file); }, [handleFile]);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragActive(false); const file = e.dataTransfer.files?.[0]; if (file) handleFile(file); }, [handleFile]);

  const handleGenerate = async () => {
    if (!image) return;
    if (!session?.user) { signIn("google"); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const resp = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageUrl: image, theme: style, furnitureImage: furnitureImage }) });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setResult(typeof data.output === "string" ? data.output : null);
      if (data.creditsRemaining !== undefined) setCredits(data.creditsRemaining);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Generation failed"); } finally { setLoading(false); }
  };

  const handleCheckout = async (planKey: string) => {
    if (!session?.user) { signIn("google"); return; }
    if (planKey === "free") return;
    try {
      const resp = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: planKey }) });
      const data = await resp.json();
      if (data.url) window.location.href = data.url;
    } catch { /* ignore */ }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[128px]" />
      </div>
      <div className="fixed inset-0 -z-10 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base font-bold shadow-lg shadow-indigo-500/30">R</div>
            <span className="text-xl font-bold tracking-tight">RoomFlip</span>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-1 py-1">
            <a href="#examples" className="px-4 py-1.5 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all">Examples</a>
            <a href="#pricing" className="px-4 py-1.5 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all">Pricing</a>
            
          </div>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                {credits !== null && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                    <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <span className="text-xs font-semibold text-indigo-300">{credits === 999999 ? "Unlimited" : credits}</span>
                  </div>
                )}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-3 py-1 hover:bg-white/10 transition-all cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
                    {session.user.image ? <img src={session.user.image} alt="" className="w-7 h-7 rounded-full ring-2 ring-white/10" /> : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">{session.user.name?.[0] || "?"}</div>}
                    <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{session.user.name?.split(" ")[0] || "Account"}</span>
                  </div>
                  <div className={"absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl transition-all z-50 py-1 " + (menuOpen ? "opacity-100 visible" : "opacity-0 invisible")}>
                    {plan !== "free" && <a href="/history" className="block px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">📁 My Designs</a>}
                    {plan !== "free" && <button onClick={async () => { const r = await fetch("/api/stripe/portal", { method: "POST" }); const d = await r.json(); if (d.url) window.location.href = d.url; }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">⚙️ Manage Subscription</button>}
                    <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/?switch=1" }); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">🔄 Switch Account</button>
                    <button onClick={() => { setMenuOpen(false); signOut(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors border-t border-white/5">🚪 Sign Out</button>
                  </div>
                </div>
              </>
            ) : (
              <button onClick={() => signIn("google")}
                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-100 transition-all shadow-lg shadow-white/10 hover:shadow-white/20">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
              Powered by Google AI — Photorealistic results
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Redesign any room with <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI in seconds</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
            Upload a photo of your room and watch AI transform it into 15+ stunning design styles. Professional interior design — without the designer.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => { if (!session?.user) { signIn("google"); } else { document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" }); } }} className="group relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all group-hover:scale-105" /><span className="relative">Try it free →</span>
            </button>
            <a href="#examples" className="px-8 py-4 rounded-xl font-semibold text-lg border border-white/10 hover:bg-white/5 transition-colors">See examples</a>
          </motion.div>
        </div>
      </section>

      <section id="examples" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10">
                <CompareSlider beforeSrc={ex.before} afterSrc={ex.after} beforeLabel="Original" afterLabel={ex.style + " Style"} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-bold text-center mb-8">15 design styles to choose from</motion.h2>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap gap-3 justify-center">
            {STYLES.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className={"inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r " + s.color + " bg-opacity-20 border border-white/10 text-sm font-medium hover:scale-105 transition-transform cursor-default"}>
                <span>{s.emoji}</span><span>{s.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="generator" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/[0.08] shadow-2xl overflow-hidden">
              
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Transform your room</h2>
                </div>
                {credits !== null && session?.user && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-medium text-slate-300">{credits === 999999 ? "∞" : credits} <span className="text-slate-500">credits</span></span>
                  </div>
                )}
              </div>
              <p className="relative text-slate-400 mb-8 text-lg">Upload a photo and choose your dream style ✨</p>
              <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()}
                className={"relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 " + (dragActive ? "border-indigo-500 bg-indigo-500/10" : image ? "border-green-500/50 bg-green-500/5" : "border-white/10 hover:border-white/30 hover:bg-white/5")}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                {image ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <img src={image} alt="Your room" className="rounded-xl max-h-64 mx-auto mb-3" /><p className="text-sm text-slate-400">Click to change photo</p>
                  </motion.div>
                ) : (
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-lg font-medium mb-1">Drop your room photo here</p><p className="text-sm text-slate-500">or click to browse • JPG, PNG, WebP</p>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-400 mb-2">Design Style</label>
                <select value={style} onChange={(e) => { setStyle(e.target.value); }} className="w-full bg-white/5 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all">
                  {(plan === "free" ? STYLES.filter(s => FREE_STYLES.includes(s.name)) : STYLES).map((s) => <option key={s.name} value={s.name} className="bg-slate-900">{s.emoji} {s.name}</option>)}
                </select>
              </div>

              {/* Furniture Image Upload - Pro+ only */}
              {(plan !== "free" && plan !== "starter") ? (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Add Furniture Photo <span className="text-indigo-400 text-xs">(Pro+)</span></label>
                  {furnitureImage ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group">
                      <img src={furnitureImage} alt="Furniture" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFurnitureImage(null)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">✕ Remove</button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer">
                      <span className="text-2xl">🪑</span>
                      <div>
                        <p className="text-sm text-slate-300">Upload a furniture photo</p>
                        <p className="text-xs text-slate-500">AI will incorporate it into your redesign</p>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { const reader = new FileReader(); reader.onload = (ev) => setFurnitureImage(ev.target?.result as string); reader.readAsDataURL(file); }
                      }} />
                    </label>
                  )}
                </div>
              ) : (
                <div className="mb-6 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-xs text-slate-500">🪑 <span className="text-slate-400">Upload furniture photo to include</span> — available from <a href="#pricing" className="text-indigo-400 hover:text-indigo-300">Pro plan ($9/mo)</a></p>
                </div>
              )}
              <motion.button onClick={handleGenerate} disabled={!image || loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25">
                {loading ? (<span className="flex items-center justify-center gap-3"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />Transforming your room...</span>)
                  : !session?.user ? "Sign in with Google to start" : "✨ Redesign My Room"}
              </motion.button>
              <AnimatePresence>{error && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</motion.div>)}</AnimatePresence>
              <AnimatePresence>
                {result && image && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold">Your Redesigned Room</h3>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-white/10 relative">{plan === "free" && <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" style={{ transform: "rotate(-30deg)", transformOrigin: "center center" }}>{Array.from({length: 8}).map((_, i) => <div key={i} className="flex gap-24 justify-center mb-16"><span className="text-white/25 text-3xl md:text-5xl font-bold select-none whitespace-nowrap">RoomFlip.io</span><span className="text-white/25 text-3xl md:text-5xl font-bold select-none whitespace-nowrap">RoomFlip.io</span><span className="text-white/25 text-3xl md:text-5xl font-bold select-none whitespace-nowrap">RoomFlip.io</span></div>)}</div>}<CompareSlider beforeSrc={image} afterSrc={result} beforeLabel="Original" afterLabel={style + " Style"} /></div>
                    {plan === "free" && <p className="text-center text-sm text-slate-500 mt-3">🔒 Free version includes watermark. <a href="#pricing" className="text-indigo-400 hover:text-indigo-300">Upgrade for clean images →</a></p>}
                    <div className="flex justify-center mt-4">
                      {plan === "free" ? <button onClick={() => downloadWithWatermark(result, "roomflip-" + style.toLowerCase().replace(/ /g, "-") + ".jpg")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download (with watermark)
                      </button> : <a href={result} download={"roomflip-" + style.toLowerCase().replace(/ /g, "-") + ".jpg"} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download HD
                      </a>}
                    </div>
                    {/* Shop This Look - Affiliate */}
                    <div className="mt-6 p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-slate-300">🛒 Shop This Look</h4>
                        <span className="text-[10px] text-slate-600">Sponsored</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {SHOP_ITEMS[style]?.map((item, i) => (
                          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="group block p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-center">
                            <span className="text-2xl block mb-1">{item.emoji}</span>
                            <span className="text-xs text-slate-400 group-hover:text-slate-300 block">{item.name}</span>
                            <span className="text-[10px] text-indigo-400 mt-1 block">{item.store}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
      {/* AdSense for free users */}
      {plan === "free" && session?.user && (
        <section className="py-6 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-center">
              <div id="roomflip-ad-banner" className="min-h-[90px] flex items-center justify-center">
                <ins className="adsbygoogle" style={{display:"block"}} data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto" data-full-width-responsive="true"></ins>
              </div>
              <p className="text-[10px] text-slate-700 mt-2">Ad-free experience with <a href="#pricing" className="text-indigo-500">Starter plan</a></p>
            </div>
          </div>
        </section>
      )}

      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple pricing</h2><p className="text-slate-400 mb-12">Start free, upgrade when you need more</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {PLANS.map((p, i) => (
              <motion.div key={p.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} onClick={() => { if (p.key !== "free" && p.key !== plan) handleCheckout(p.key); }} style={{ cursor: p.key !== "free" && p.key !== plan ? "pointer" : "default" }}
                className={p.highlight ? "rounded-2xl p-6 text-left bg-gradient-to-b from-indigo-500/20 to-purple-500/10 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/20 relative" : "rounded-2xl p-6 text-left bg-white/[0.03] border border-white/10"}>
                {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>}
                <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                <div className="mb-5"><span className="text-3xl font-bold">{p.price}</span><span className="text-slate-400 text-sm">{p.period}</span></div>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-slate-300"><svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>))}
                </ul>
                <button onClick={() => handleCheckout(p.key)} disabled={p.key === "free" || p.key === plan}
                  className={p.key === plan ? "w-full py-2.5 rounded-xl font-medium text-sm bg-white/5 text-slate-500 cursor-default" : p.highlight ? "w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all" : "w-full py-3 rounded-xl font-semibold text-sm bg-white/15 border border-white/20 hover:bg-white/25 hover:border-white/30 transition-all shadow-md"}>
                  {p.key === plan ? "Current Plan" : p.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-8 text-slate-500 text-sm mb-8 flex-wrap">
              <div className="flex items-center gap-2"><span className="text-2xl font-bold text-white">10K+</span> rooms redesigned</div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" /><div className="flex items-center gap-2"><span className="text-2xl font-bold text-white">4.9</span> ⭐ average rating</div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" /><div className="flex items-center gap-2"><span className="text-2xl font-bold text-white">30s</span> average generation</div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">R</div><span>RoomFlip</span></div>
          <p>© 2026 RoomFlip.io. Powered by Google AI.</p>
          <div className="flex gap-6"><a href="#" className="hover:text-white transition-colors">Privacy</a><a href="#" className="hover:text-white transition-colors">Terms</a><a href="#" className="hover:text-white transition-colors">Contact</a></div>
        </div>
      </footer>
    </main>
  );
}
