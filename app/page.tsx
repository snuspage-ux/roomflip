"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CompareSlider } from "@/components/ui/compare-slider";
import Link from "next/link";

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
  { name: "Gothic", emoji: "🖤", color: "from-gray-600 to-slate-800" },
  { name: "Mediterranean", emoji: "☀️", color: "from-orange-400 to-red-500" },
];

// IKEA affiliate links
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
  "Contemporary": [
    { name: "STOCKHOLM Rug", emoji: "🎨", url: `${IKEA_BASE}stockholm+rug`, store: "IKEA" },
    { name: "SKURUP Pendant", emoji: "💡", url: `${IKEA_BASE}skurup+pendant`, store: "IKEA" },
    { name: "ÄPPLARYD Sofa", emoji: "🛋️", url: `${IKEA_BASE}applaryd+sofa`, store: "IKEA" },
    { name: "BESTA Storage", emoji: "📦", url: `${IKEA_BASE}besta+storage`, store: "IKEA" },
  ],
  "Rustic": [
    { name: "STORNÄS Table", emoji: "🪵", url: `${IKEA_BASE}stornas+table`, store: "IKEA" },
    { name: "SINNERLIG Basket", emoji: "🧺", url: `${IKEA_BASE}sinnerlig+basket`, store: "IKEA" },
    { name: "RATTAN Chair", emoji: "🪑", url: `${IKEA_BASE}rattan+chair`, store: "IKEA" },
    { name: "HOLMSTA Throw", emoji: "🧶", url: `${IKEA_BASE}wool+throw+blanket`, store: "IKEA" },
  ],
  "Tropical": [
    { name: "JUNGEL Plant Pot", emoji: "🌿", url: `${IKEA_BASE}plant+pot`, store: "IKEA" },
    { name: "NIPPRIG Basket", emoji: "🧺", url: `${IKEA_BASE}nipprig+basket`, store: "IKEA" },
    { name: "Bamboo Shelf", emoji: "🎍", url: `${IKEA_BASE}bamboo+shelf`, store: "IKEA" },
    { name: "SÖDERHAMN Sofa", emoji: "🛋️", url: `${IKEA_BASE}soderhamn+sofa`, store: "IKEA" },
  ],
  "Art Deco": [
    { name: "Velvet Curtains", emoji: "🎭", url: `${IKEA_BASE}velvet+curtains`, store: "IKEA" },
    { name: "Gold Mirror", emoji: "🪞", url: `${IKEA_BASE}gold+mirror`, store: "IKEA" },
    { name: "ÅRSTID Lamp", emoji: "💡", url: `${IKEA_BASE}arstid+lamp`, store: "IKEA" },
    { name: "KIVIK Velvet", emoji: "🛋️", url: `${IKEA_BASE}velvet+sofa`, store: "IKEA" },
  ],
  "Futuristic": [
    { name: "BEKANT Desk", emoji: "🖥️", url: `${IKEA_BASE}bekant+desk`, store: "IKEA" },
    { name: "LED Strip", emoji: "💡", url: `${IKEA_BASE}led+light+strip`, store: "IKEA" },
    { name: "LÅNGFJÄLL Chair", emoji: "🪑", url: `${IKEA_BASE}langfjall+chair`, store: "IKEA" },
    { name: "White Shelf", emoji: "📦", url: `${IKEA_BASE}white+wall+shelf`, store: "IKEA" },
  ],
  "Gothic": [
    { name: "Dark Curtains", emoji: "🖤", url: `${IKEA_BASE}dark+curtains`, store: "IKEA" },
    { name: "Black Candles", emoji: "🕯️", url: `${IKEA_BASE}black+candle+holder`, store: "IKEA" },
    { name: "Dark Wood Frame", emoji: "🖼️", url: `${IKEA_BASE}dark+wood+frame`, store: "IKEA" },
    { name: "Velvet Cushion", emoji: "🛋️", url: `${IKEA_BASE}velvet+cushion`, store: "IKEA" },
  ],
  "Mediterranean": [
    { name: "Terracotta Pot", emoji: "🏺", url: `${IKEA_BASE}terracotta+pot`, store: "IKEA" },
    { name: "SINNERLIG Table", emoji: "☀️", url: `${IKEA_BASE}sinnerlig+table`, store: "IKEA" },
    { name: "Linen Curtains", emoji: "🪟", url: `${IKEA_BASE}linen+curtains`, store: "IKEA" },
    { name: "Olive Tree", emoji: "🫒", url: `${IKEA_BASE}artificial+olive+tree`, store: "IKEA" },
  ],
};


const INTERSTITIAL_ADS = [
  {
    type: 'adnetwork' as const,
    adScript: 'ADSTERRA_NATIVE', // placeholder - rendered as native banner div
    icon: '📢',
    logo: undefined,
    promo: undefined,
    title: 'Sponsored',
    subtitle: '',
    description: '',
    cta: '',
    ctaUrl: '',
    gradient: 'from-slate-600 to-slate-700',
    bgGlow: 'bg-slate-600/20',
  },
  {
    type: 'adnetwork' as const,
    adScript: 'ADSTERRA_NATIVE', // placeholder - rendered as native banner div
    icon: '📢',
    logo: undefined,
    promo: undefined,
    title: 'Sponsored',
    subtitle: '',
    description: '',
    cta: '',
    ctaUrl: '',
    gradient: 'from-slate-600 to-slate-700',
    bgGlow: 'bg-slate-600/20',
  },
  {
    type: 'tubevoice' as const,
    adScript: undefined,
    icon: '🎙️',
    logo: '/tubevoice-logo.jpg',
    promo: '/tubevoice-promo.jpg',
    title: 'TubeVoice.io',
    subtitle: 'Watch YouTube videos in YOUR language',
    description: 'AI dubs any YouTube video into 50+ languages. Just paste a link, pick your language, and hit play. Works with any video — tutorials, podcasts, news, entertainment.',
    cta: 'Try Free',
    ctaUrl: 'https://tubevoice.io?ref=roomflip',
    gradient: 'from-violet-600 to-indigo-600',
    bgGlow: 'bg-violet-600/20',
  },
];

function AdsterraNativeBanner() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const container = document.createElement('div');
    container.id = 'container-daf40194c79018ddbd9fd6f2ba3ca011';
    ref.current.appendChild(container);
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl29004994.profitablecpmratenetwork.com/daf40194c79018ddbd9fd6f2ba3ca011/invoke.js';
    ref.current.appendChild(script);
    return () => { if(ref.current) ref.current.innerHTML = ''; };
  }, []);
  return <div ref={ref} className="min-h-[250px] flex items-center justify-center"><p className="text-slate-500 text-xs animate-pulse">Loading...</p></div>;
}

function InterstitialOverlay({ ad, onContinue, onClose }: { ad: typeof INTERSTITIAL_ADS[number]; onContinue: () => void; onClose: () => void }) {
  const [countdown, setCountdown] = useState(5);
  const ready = countdown <= 0;

  useEffect(() => {
    if (ready) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, ready]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0a0a1a] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-colors text-lg">&times;</button>
        <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-6 text-center">Sponsored</p>
        {ad.adScript === 'ADSTERRA_NATIVE' ? (
          <div className="mb-4">
            <AdsterraNativeBanner />
          </div>
        ) : ad.promo ? (
          <>
            <a href={ad.ctaUrl} target="_blank" rel="noopener noreferrer" className="block mb-3">
              <img src={ad.promo} alt={ad.title} className="w-full rounded-2xl shadow-lg hover:scale-[1.02] transition-transform" />
            </a>
            <h3 className={`text-xl font-bold text-center mb-1 bg-gradient-to-r ${ad.gradient} bg-clip-text text-transparent`}>{ad.title}</h3>
            <p className="text-sm text-slate-400 text-center mb-2">{ad.subtitle}</p>
            <p className="text-xs text-slate-500 text-center mb-4 leading-relaxed">{ad.description}</p>
            <a href={ad.ctaUrl} target="_blank" rel="noopener noreferrer" className={`block w-full py-3 rounded-xl font-semibold text-center bg-gradient-to-r ${ad.gradient} hover:opacity-90 transition-opacity text-white mb-4`}>
              {ad.cta} &rarr;
            </a>
          </>
        ) : (
          <>
            {ad.logo ? (
              <img src={ad.logo} alt={ad.title} className="mx-auto w-20 h-20 rounded-2xl object-contain mb-4 shadow-lg" />
            ) : (
              <div className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${ad.gradient} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                {ad.icon}
              </div>
            )}
            <h3 className={`text-2xl font-bold text-center mb-1 bg-gradient-to-r ${ad.gradient} bg-clip-text text-transparent`}>{ad.title}</h3>
            <p className="text-sm text-slate-400 text-center mb-3">{ad.subtitle}</p>
            <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">{ad.description}</p>
            {ad.cta && <a href={ad.ctaUrl} target="_blank" rel="noopener noreferrer" className={`block w-full py-3 rounded-xl font-semibold text-center bg-gradient-to-r ${ad.gradient} hover:opacity-90 transition-opacity text-white mb-4`}>
              {ad.cta} &rarr;
            </a>}
          </>
        )}
        {ready ? (
          <motion.button initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} onClick={onContinue}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 transition-all text-white">
            Continue ▶
          </motion.button>
        ) : (
          <p className="text-center text-sm text-slate-600">Continue in {countdown}s...</p>
        )}
      </motion.div>
    </motion.div>
  );
}

const EXAMPLES = [{ before: "/original-room.jpg?v=2", after: "/after-room.jpg?v=2", style: "Modern" }];



// Set device fingerprint cookie for rate limiting
function setFingerprint() {
  if (typeof document === "undefined") return;
  if (document.cookie.includes("rf_fp=")) return;
  // Simple fingerprint: screen + timezone + language + platform
  const raw = [
    screen.width, screen.height, screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language, navigator.platform,
    new Date().getTimezoneOffset(),
  ].join("|");
  // Simple hash
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = ((h << 5) - h + raw.charCodeAt(i)) | 0;
  }
  const fp = Math.abs(h).toString(36);
  document.cookie = `rf_fp=${fp};path=/;max-age=31536000;SameSite=Lax`;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState("Modern");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [furnitureImage, setFurnitureImage] = useState<string | null>(null);
  const [imageAspect, setImageAspect] = useState<string>('match_input_image');

  // Interstitial ad state
  const [activeInterstitial, setActiveInterstitial] = useState<number | null>(null);
  const [interstitialCallback, setInterstitialCallback] = useState<(() => void) | null>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        // Detect aspect ratio
        const r = img.width / img.height;
        setImageAspect(r >= 1 ? '3:2' : '2:3');
        // Resize to max 1500px to keep data URI small
        const MAX = 1500;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        setImage(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFile(file); }, [handleFile]);
  const handleDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragActive(false); const file = e.dataTransfer.files?.[0]; if (file) handleFile(file); }, [handleFile]);

  const doGenerate = async () => {
    if (!image) return;
    setLoading(true); setError(null); setResult(null);
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const resp = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageUrl: image, theme: style, furnitureImage: furnitureImage, aspectRatio: imageAspect }) });
        const data = await resp.json();
        if (data.error) {
          if (attempt === 0 && !data.error.includes("Daily limit")) { continue; }
          throw new Error(data.error);
        }
        setResult(typeof data.output === "string" ? data.output : null);
        setLoading(false);
        return;
      } catch (err: unknown) {
        if (attempt === 1) setError(err instanceof Error ? err.message : "Generation failed. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleGenerate = () => {
    if (!image) return;
    setActiveInterstitial(0);
    setInterstitialCallback(() => () => {
      setActiveInterstitial(null);
      setInterstitialCallback(null);
      doGenerate();
    });
  };

  const handleDownloadClick = () => {
    setActiveInterstitial(1);
    setInterstitialCallback(() => () => {
      // First interstitial done, show second
      setActiveInterstitial(2);
      setInterstitialCallback(() => () => {
        setActiveInterstitial(null);
        setInterstitialCallback(null);
        if (!result) return;
        const link = document.createElement("a");
        link.href = result;
        link.download = "roomflip-" + style.toLowerCase().replace(/ /g, "-") + ".jpg";
        link.click();
      });
    });
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
            <a href="#generator" className="px-4 py-1.5 rounded-full text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-all">Generate</a>
          </div>
          <div className="flex items-center gap-2 bg-green-500/15 border border-green-500/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-semibold text-green-300">100% Free</span>
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
            Upload a photo of your room and watch AI transform it into 17 stunning design styles. Professional interior design — completely free.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => document.getElementById("generator")?.scrollIntoView({ behavior: "smooth" })} className="group relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all group-hover:scale-105" /><span className="relative">Try it free</span>
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
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-bold text-center mb-8">17 design styles to choose from</motion.h2>
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

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-bold text-center mb-4">How It Works</motion.h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">Redesign any room in three simple steps — no account, no payment, no design skills needed.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: "📸", title: "Upload Your Photo", desc: "Take a photo of any room in your home and upload it. Works with living rooms, bedrooms, kitchens, bathrooms — any space." },
              { step: "2", icon: "🎨", title: "Choose a Style", desc: "Pick from 17 stunning design styles — Modern, Scandinavian, Japanese, Bohemian, Luxury, and more." },
              { step: "3", icon: "✨", title: "Download Your Redesign", desc: "AI generates a photorealistic redesign in ~30 seconds. Download the HD result completely free." },
            ].map((item) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center p-6 bg-white/[0.03] border border-white/10 rounded-2xl">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-bold mb-3">{item.step}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section id="generator" className="py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/[0.08] shadow-2xl overflow-hidden">
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative mb-3">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-center">✨ Transform your room</h2>
                </div>
                <p className="relative text-slate-400 mb-8 text-lg text-center">Upload a photo and choose your dream style</p>
                <div className="relative flex justify-center mb-6"><span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-sm text-indigo-300"><span>🎨</span> 5 free designs per day</span></div>
                <div onDragOver={(e) => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()}
                  className={"relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 " + (dragActive ? "border-indigo-500 bg-indigo-500/10" : image ? "border-green-500/50 bg-green-500/5" : "border-white/10 hover:border-white/30 hover:bg-white/5")}>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  {image ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <img src={image} alt="Room photo uploaded for AI interior redesign" className="rounded-xl max-h-64 mx-auto mb-3" /><p className="text-sm text-slate-400">Click to change photo</p>
                    </motion.div>
                  ) : (
                    <div>
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <p className="text-lg font-medium mb-1">Drop your room photo here</p><p className="text-sm text-slate-500">or click to browse</p>
                    </div>
                  )}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Design Style</label>
                  <select value={style} onChange={(e) => { setStyle(e.target.value); }} className="w-full bg-white/5 rounded-xl px-4 py-3 text-white border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all">
                    {STYLES.map((s) => <option key={s.name} value={s.name} className="bg-slate-900">{s.emoji} {s.name}</option>)}
                  </select>
                </div>

                {/* Furniture Image Upload - available to everyone */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Add Furniture Photo <span className="text-green-400 text-xs">(Free)</span></label>
                  {furnitureImage ? (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 group">
                      <img src={furnitureImage} alt="Furniture reference photo for AI room redesign" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFurnitureImage(null)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">Remove</button>
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
                <motion.button onClick={handleGenerate} disabled={!image || loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/25">
                  {loading ? (<span className="flex items-center justify-center gap-3"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />Transforming your room...</span>)
                    : "Redesign My Room"}
                </motion.button>
                <AnimatePresence>{error && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</motion.div>)}</AnimatePresence>
                <AnimatePresence>
                  {result && image && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-8">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">Your Redesigned Room</h3>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-white/10 relative">
                        <CompareSlider beforeSrc={image} afterSrc={result} beforeLabel="Original" afterLabel={style + " Style"} />
                      </div>
                      <div className="flex justify-center mt-4">
                        <button onClick={handleDownloadClick} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download HD
                        </button>
                      </div>
                      {/* Shop This Look - Affiliate */}
                      <div className="mt-6 p-5 bg-white/[0.03] border border-white/10 rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-slate-300">Shop This Look</h4>
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


        </div>
      </section>


      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="flex items-center justify-center gap-8 text-slate-500 text-sm mb-8 flex-wrap">
              <div className="flex items-center gap-2"><span className="text-2xl font-bold text-white">10K+</span> rooms redesigned</div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" /><div className="flex items-center gap-2"><span className="text-2xl font-bold text-white">4.9</span> <span className="text-yellow-400">★★★★★</span> average rating</div>
              <div className="w-px h-8 bg-white/10 hidden sm:block" /><div className="flex items-center gap-2"><span className="text-2xl font-bold text-white">30s</span> average generation</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Internal Links to Style Pages - SEO */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Explore All Design Styles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { name: "Modern", slug: "modern", emoji: "🏢" },
              { name: "Minimalist", slug: "minimalist", emoji: "⬜" },
              { name: "Scandinavian", slug: "scandinavian", emoji: "🇸🇪" },
              { name: "Japanese", slug: "japanese", emoji: "🏯" },
              { name: "Luxury", slug: "luxury", emoji: "💎" },
              { name: "Mid-Century", slug: "mid-century-modern", emoji: "🪑" },
              { name: "Bohemian", slug: "bohemian", emoji: "🌿" },
              { name: "Tropical", slug: "tropical", emoji: "🌴" },
              { name: "Rustic", slug: "rustic", emoji: "🪵" },
              { name: "Coastal", slug: "coastal", emoji: "🌊" },
              { name: "Vintage", slug: "vintage", emoji: "🕰️" },
              { name: "Art Deco", slug: "art_deco", emoji: "✨" },
              { name: "Mediterranean", slug: "mediterranean", emoji: "☀️" },
              { name: "Farmhouse", slug: "farmhouse", emoji: "🏡" },
              { name: "Gothic", slug: "gothic", emoji: "🖤" },
            ].map((s) => (
              <Link key={s.slug} href={`/styles/${s.slug}`} className="flex items-center gap-2 p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-sm">
                <span>{s.emoji}</span><span>{s.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - SEO */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is RoomFlip really free?", a: "Yes, RoomFlip is 100% free. Upload any room photo and get AI-powered redesigns in 17+ styles without signing up or paying." },
              { q: "How does AI room redesign work?", a: "Upload a photo of your room, select a design style, and our AI analyzes the room structure and generates a photorealistic redesign while preserving your room layout." },
              { q: "How many rooms can I redesign per day?", a: "You can redesign up to 5 rooms per day for free. The limit resets every 24 hours." },
              { q: "What design styles are available?", a: "We offer 17 styles including Modern, Minimalist, Scandinavian, Japanese, Luxury, Bohemian, Mid-Century Modern, Coastal, Farmhouse, Gothic, Mediterranean, and more." },
              { q: "Do I need to create an account?", a: "No account needed. Just upload your photo and start redesigning instantly." },
              { q: "Is my photo safe?", a: "Your photos are processed by AI and not stored permanently. We respect your privacy." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer font-medium hover:bg-white/[0.03] transition-colors flex justify-between items-center">
                  {faq.q}
                  <span className="text-slate-500 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="px-6 pb-4 text-sm text-slate-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

            <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">R</div><span>RoomFlip</span></div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <a href="mailto:hello@roomflip.io" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <p className="text-center text-slate-600 text-xs mt-6">&copy; 2026 RoomFlip.io. Powered by Google AI.</p>
        </div>
      </footer>


      {/* Interstitial Overlay */}
      <AnimatePresence>
        {activeInterstitial !== null && (
          <InterstitialOverlay
            ad={INTERSTITIAL_ADS[activeInterstitial]}
            onContinue={() => interstitialCallback?.()}
            onClose={() => { setActiveInterstitial(null); setInterstitialCallback(null); }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
