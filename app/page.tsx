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
const EXAMPLES = [{ before: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800", after: "https://replicate.delivery/xezq/fEwk9i7bm032aCl0QvhCYgDLsRgyIqEohYDVIU800XYLQSGLA/tmpqwu2ggsv.jpeg", style: "Luxury" }];
const PLANS = [
  { key: "free", name: "Free", price: "$0", period: "", features: ["3 redesigns total", "Watermark on images", "15 styles", "720p resolution"], cta: "Current Plan", highlight: false },
  { key: "starter", name: "Starter", price: "$5", period: "/month", features: ["15 redesigns/month", "No watermark", "15 styles", "HD resolution"], cta: "Get Starter", highlight: false },
  { key: "pro", name: "Pro", price: "$9", period: "/month", features: ["50 redesigns/month", "No watermark", "15 styles", "HD resolution", "Priority generation"], cta: "Start Pro", highlight: true },
  { key: "unlimited", name: "Unlimited", price: "$29", period: "/month", features: ["Unlimited redesigns", "No watermark", "15 styles", "4K resolution", "Priority generation", "API access", "Commercial use"], cta: "Go Unlimited", highlight: false },
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
      const resp = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageUrl: image, theme: style, room }) });
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

      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">R</div>
            <span className="text-lg font-semibold">RoomAI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#examples" className="hover:text-white transition-colors">Examples</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            {session?.user ? (
              <div className="flex items-center gap-4">
                <a href="/history" className="hover:text-white transition-colors">History</a>
                {credits !== null && <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-medium">{credits === 999999 ? "∞" : credits} credits</span>}
                <div className="flex items-center gap-2">
                  {session.user.image && <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />}
                  <button onClick={() => signOut()} className="hover:text-white transition-colors">Sign Out</button>
                </div>
              </div>
            ) : (
              <button onClick={() => signIn("google")} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">Sign In with Google</button>
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
            <button onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })} className="group relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden">
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
                  <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-white/5 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all">
                    {STYLES.map((s) => <option key={s.name} value={s.name} className="bg-slate-900">{s.emoji} {s.name}</option>)}
                  </select>
                </div>
              </div>
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
