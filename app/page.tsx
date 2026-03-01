"use client";

import { useState, useCallback } from "react";

const ROOMS = [
  "Living Room", "Bedroom", "Kitchen", "Bathroom", "Dining Room",
  "Home Office", "Kids Room", "Hallway", "Outdoor Patio", "Garage",
];

const STYLES = [
  "Modern", "Minimalist", "Scandinavian", "Industrial", "Luxury",
  "Bohemian", "Japanese", "Mid-Century Modern", "Coastal", "Farmhouse",
  "Contemporary", "Rustic", "Tropical", "Art Deco", "Futuristic",
];

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [room, setRoom] = useState(ROOMS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleGenerate = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: image, theme: style, room }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setResult(typeof data.output === "string" ? data.output : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            RoomAI
          </h1>
          <p className="text-xl text-slate-300">Upload a photo of your room. AI redesigns it in any style.</p>
          <p className="text-sm text-slate-500 mt-2">✨ 15 design styles • Results in ~30 seconds</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">📸 Upload your room photo</label>
            <input type="file" accept="image/*" onChange={handleUpload}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer cursor-pointer" />
          </div>

          {image && <div className="mb-6"><img src={image} alt="Your room" className="rounded-xl max-h-72 mx-auto" /></div>}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">🏠 Room Type</label>
              <select value={room} onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-slate-700 rounded-xl px-4 py-3 text-white border border-slate-600 focus:border-indigo-500 focus:outline-none">
                {ROOMS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">🎨 Design Style</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-slate-700 rounded-xl px-4 py-3 text-white border border-slate-600 focus:border-indigo-500 focus:outline-none">
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!image || loading}
            className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Redesigning... (~30 sec)
              </span>
            ) : "✨ Redesign My Room"}
          </button>

          {error && <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-xl text-red-300">⚠️ {error}</div>}

          {result && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Your Redesigned Room</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2 text-center">Before</p>
                  <img src={image!} alt="Before" className="rounded-xl w-full" />
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2 text-center">After — {style}</p>
                  <img src={result} alt="After" className="rounded-xl w-full" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <a href={result} download="roomai-redesign.png" target="_blank"
                  className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition-colors">
                  ⬇️ Download Result
                </a>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-12 text-slate-500 text-sm">Powered by AI • Your photos are not stored permanently</footer>
      </div>
    </main>
  );
}
