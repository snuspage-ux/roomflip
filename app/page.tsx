"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { CompareSlider } from "@/components/ui/compare-slider";

const ROOMS = ["Living Room","Bedroom","Kitchen","Bathroom","Dining Room","Home Office","Kids Room","Hallway","Outdoor Patio","Garage"];
const STYLES = [
  { name: "Modern", emoji: "🏢", color: "from-slate-500 to-gray-600" },
  { name: "Minimalist", emoji: "⬜", color: "from-gray-400 to-slate-500" },
  { name: "Scandinavian", emoji: "🌲", color: "from-amber-400 to-yellow-600" },
  { name: "Industrial", emoji: "🔩", color: "from-zinc-500 to-stone-600" },
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
const EXAMPLES = [{ before: "/original-room.jpg", after: "https://replicate.delivery/xezq/yOYfWOIwTHSVRqjIM4VeBE6KjbOEurEmJeGNY1zcqQ2dSLZsA/tmpryvpirb0.jpeg", style: "Luxury" }];

const FURNITURE: Record<string, { name: string; emoji: string }[]> = {
  "Modern": [
    { name: "Minimalist sofa", emoji: "🛋️" },
    { name: "Glass coffee table", emoji: "☕" },
    { name: "Floor lamp", emoji: "💡" },
    { name: "Abstract wall art", emoji: "🖼️" },
    { name: "Floating shelves", emoji: "📚" },
  ],
  "Minimalist": [
    { name: "Platform bed", emoji: "🛏️" },
    { name: "Simple wooden chair", emoji: "🪑" },
    { name: "Paper lantern", emoji: "🏮" },
    { name: "Single plant", emoji: "🌿" },
    { name: "Low bench", emoji: "🪵" },
  ],
  "Scandinavian": [
    { name: "Wool throw blanket", emoji: "🧶" },
    { name: "Rattan armchair", emoji: "🪑" },
    { name: "Wooden side table", emoji: "🪵" },
    { name: "Sheepskin rug", emoji: "🐑" },
    { name: "Pendant light", emoji: "💡" },
  ],
  "Industrial": [
    { name: "Metal bar stool", emoji: "🪑" },
    { name: "Pipe shelving unit", emoji: "📚" },
    { name: "Leather sofa", emoji: "🛋️" },
    { name: "Edison pendant lights", emoji: "💡" },
    { name: "Metal trunk table", emoji: "📦" },
  ],
  "Luxury": [
    { name: "Velvet chaise lounge", emoji: "🛋️" },
    { name: "Crystal chandelier", emoji: "✨" },
    { name: "Marble console", emoji: "🏛️" },
    { name: "Gold mirror", emoji: "🪞" },
    { name: "Silk curtains", emoji: "🎭" },
  ],
  "Bohemian": [
    { name: "Macrame wall hanging", emoji: "🧶" },
    { name: "Floor cushions", emoji: "🛋️" },
    { name: "Hanging plants", emoji: "🌿" },
    { name: "Moroccan pouf", emoji: "🟤" },
    { name: "Woven basket", emoji: "🧺" },
  ],
  "Japanese": [
    { name: "Tatami mat", emoji: "🟫" },
    { name: "Shoji screen divider", emoji: "🚪" },
    { name: "Bonsai tree", emoji: "🌳" },
    { name: "Low tea table", emoji: "🍵" },
    { name: "Zabuton cushion", emoji: "🧘" },
  ],
  "Mid-Century Modern": [
    { name: "Eames lounge chair", emoji: "🪑" },
    { name: "Sunburst clock", emoji: "🕐" },
    { name: "Teak sideboard", emoji: "🪵" },
    { name: "Arc floor lamp", emoji: "💡" },
    { name: "Tulip dining table", emoji: "🌷" },
  ],
  "Coastal": [
    { name: "Rope swing chair", emoji: "🪑" },
    { name: "Driftwood coffee table", emoji: "🪵" },
    { name: "Coral decor", emoji: "🪸" },
    { name: "Linen sofa", emoji: "🛋️" },
    { name: "Nautical lantern", emoji: "🏮" },
  ],
  "Farmhouse": [
    { name: "Barn door", emoji: "🚪" },
    { name: "Mason jar lights", emoji: "💡" },
    { name: "Farmhouse dining table", emoji: "🪵" },
    { name: "Vintage ladder shelf", emoji: "🪜" },
    { name: "Wicker basket set", emoji: "🧺" },
  ],
  "Contemporary": [
    { name: "Sculptural chair", emoji: "🪑" },
    { name: "Oversized art piece", emoji: "🖼️" },
    { name: "Geometric rug", emoji: "🔷" },
    { name: "Statement pendant", emoji: "💡" },
    { name: "Lacquer side table", emoji: "🔲" },
  ],
  "Rustic": [
    { name: "Log coffee table", emoji: "🪵" },
    { name: "Antler chandelier", emoji: "🦌" },
    { name: "Stone fireplace", emoji: "🔥" },
    { name: "Plaid wool throw", emoji: "🧶" },
    { name: "Iron candle holders", emoji: "🕯️" },
  ],
  "Tropical": [
    { name: "Banana leaf chair", emoji: "🌴" },
    { name: "Bamboo bed frame", emoji: "🎋" },
    { name: "Monstera plant", emoji: "🌿" },
    { name: "Tiki torch lamp", emoji: "🔥" },
    { name: "Rattan daybed", emoji: "🛋️" },
  ],
  "Art Deco": [
    { name: "Velvet tufted sofa", emoji: "🛋️" },
    { name: "Geometric mirror", emoji: "🪞" },
    { name: "Gold bar cart", emoji: "🍸" },
    { name: "Fan-shaped chair", emoji: "🪑" },
    { name: "Fringed table lamp", emoji: "💡" },
  ],
  "Futuristic": [
    { name: "Egg pod chair", emoji: "🥚" },
    { name: "LED strip lighting", emoji: "💡" },
    { name: "Floating desk", emoji: "🖥️" },
    { name: "Transparent ghost chair", emoji: "🪑" },
    { name: "Smart mirror", emoji: "🪞" },
  ],
};

const FREE_STYLES = ["Modern", "Minimalist", "Luxury", "Industrial", "Mid-Century Modern"];

const PLANS = [
  { key: "free", name: "Free", price: "$0", period: "", features: ["3 redesigns total", "Watermark on images", "5 styles", "720p resolution"], cta: "Current Plan", highlight: false },
  { key: "starter", name: "Starter", price: "$5", period: "/month", features: ["15 redesigns/month", "No watermark", "15 styles", "HD resolution"], cta: "Get Starter", highlight: false },
  { key: "pro", name: "Pro", price: "$9", period: "/month", features: ["50 redesigns/month", "No watermark", "15 styles", "HD resolution", "Priority generation", "Add specific furniture"], cta: "Start Pro", highlight: true },
  { key: "unlimited", name: "Unlimited", price: "$29", period: "/month", features: ["Unlimited redesigns", "No watermark", "15 styles", "4K resolution", "Priority generation", "Add specific furniture", "API access", "Commercial use"], cta: "Go Unlimited", highlight: false },
];

export default function Home() {
  const { data: session } = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [room, setRoom] = useState(ROOMS[0]);
  const [style, setStyle] = useState("Modern");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState("free");
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([]);

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
      const resp = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageUrl: image, theme: style, room, furniture: selectedFurniture }) });
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
            <span className="text-xl font-bold tracking-tight">RoomAI</span>
          </div>
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-1 py-1">
            <a href="#examples" className="px-4 py-1.5 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all">Examples</a>
            <a href="#pricing" className="px-4 py-1.5 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all">Pricing</a>
            {session?.user && <a href="/history" className="px-4 py-1.5 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all">My Designs</a>}
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
                <div className="flex items-center gap-2 bg-white/5 rounded-full pl-1 pr-3 py-1 hover:bg-white/10 transition-all cursor-pointer group" onClick={() => signOut()}>
                  {session.user.image ? <img src={session.user.image} alt="" className="w-7 h-7 rounded-full ring-2 ring-white/10" /> : <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">{session.user.name?.[0] || "?"}</div>}
                  <span className="text-sm text-slate-400 group-hover:text-white transition-colors">{session.user.name?.split(" ")[0] || "Account"}</span>
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
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold">Transform your room</h2>
                {credits !== null && session?.user && <span className="text-sm text-slate-400">{credits === 999999 ? "Unlimited" : credits + " credits left"}</span>}
              </div>
              <p className="text-slate-400 mb-8">Upload a photo and choose your dream style</p>
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
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Room Type</label>
                  <select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full bg-white/5 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all">
                    {ROOMS.map((r) => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Design Style</label>
                  <select value={style} onChange={(e) => { setStyle(e.target.value); setSelectedFurniture([]); }} className="w-full bg-white/5 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all">
                    {(plan === "free" ? STYLES.filter(s => FREE_STYLES.includes(s.name)) : STYLES).map((s) => <option key={s.name} value={s.name} className="bg-slate-900">{s.emoji} {s.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Furniture Picker - Pro+ only */}
              {(plan !== "free" && plan !== "starter") && FURNITURE[style] && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Add Furniture <span className="text-indigo-400 text-xs">(Pro+)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {FURNITURE[style]?.map((f) => {
                      const selected = selectedFurniture.includes(f.name);
                      return (
                        <button key={f.name} type="button"
                          onClick={() => setSelectedFurniture(prev => selected ? prev.filter(x => x !== f.name) : [...prev, f.name])}
                          className={"px-3 py-1.5 rounded-lg text-sm border transition-all " + (selected ? "border-indigo-500 bg-indigo-500/20 text-indigo-300" : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20")}>
                          {f.emoji} {f.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {(plan === "free" || plan === "starter") && (
                <div className="mb-6 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                  <p className="text-xs text-slate-500">🪑 <span className="text-slate-400">Add specific furniture</span> — available from <a href="#pricing" className="text-indigo-400 hover:text-indigo-300">Pro plan ($9/mo)</a></p>
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
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">Your Redesigned Room</h3>
                      <a href={result} download="roomai-redesign.png" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">⬇️ Download</a>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-white/10"><CompareSlider beforeSrc={image} afterSrc={result} beforeLabel="Original" afterLabel={style + " Style"} /></div>
                    {plan === "free" && <p className="text-center text-sm text-slate-500 mt-3">🔒 Free version includes watermark. <a href="#pricing" className="text-indigo-400 hover:text-indigo-300">Upgrade for clean images →</a></p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple pricing</h2><p className="text-slate-400 mb-12">Start free, upgrade when you need more</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {PLANS.map((p, i) => (
              <motion.div key={p.key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={p.highlight ? "rounded-2xl p-6 text-left bg-gradient-to-b from-indigo-500/20 to-purple-500/10 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/20 relative" : "rounded-2xl p-6 text-left bg-white/[0.03] border border-white/10"}>
                {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</div>}
                <h3 className="text-lg font-bold mb-2">{p.name}</h3>
                <div className="mb-5"><span className="text-3xl font-bold">{p.price}</span><span className="text-slate-400 text-sm">{p.period}</span></div>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-slate-300"><svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>))}
                </ul>
                <button onClick={() => handleCheckout(p.key)} disabled={p.key === "free" || p.key === plan}
                  className={p.key === plan ? "w-full py-2.5 rounded-xl font-medium text-sm bg-white/5 text-slate-500 cursor-default" : p.highlight ? "w-full py-2.5 rounded-xl font-medium text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/25 transition-all" : "w-full py-2.5 rounded-xl font-medium text-sm bg-white/10 hover:bg-white/20 transition-all"}>
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
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">R</div><span>RoomAI</span></div>
          <p>© 2026 RoomAI. Powered by Google AI.</p>
          <div className="flex gap-6"><a href="#" className="hover:text-white transition-colors">Privacy</a><a href="#" className="hover:text-white transition-colors">Terms</a><a href="#" className="hover:text-white transition-colors">Contact</a></div>
        </div>
      </footer>
    </main>
  );
}
