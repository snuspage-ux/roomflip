import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About RoomFlip - AI Interior Design Tool",
  description: "Learn about RoomFlip.io, our mission, and how we use AI to help anyone redesign their living spaces in seconds.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-6">About RoomFlip</h1>

        <div className="space-y-8 text-slate-300 leading-relaxed text-lg">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What is RoomFlip?</h2>
            <p>
              RoomFlip.io is a free AI-powered interior design tool that lets anyone reimagine their living spaces in seconds. Simply upload a photo of any room — your bedroom, living room, kitchen, office, or bathroom — choose from 17 carefully curated design styles, and watch as our AI transforms your space into something completely new.
            </p>
            <p className="mt-4">
              Whether you&apos;re planning a renovation, looking for inspiration, or just curious about what your room would look like in a different style, RoomFlip gives you photorealistic visualizations without hiring an interior designer or moving a single piece of furniture.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
            <p>
              Our process is simple and takes less than a minute from start to finish:
            </p>
            <div className="mt-4 space-y-4">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-white">Upload Your Room Photo</h3>
                  <p className="text-slate-400">Take a photo of any room or upload an existing one. Our AI works best with well-lit, clear photos that show the full room.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-white">Choose a Design Style</h3>
                  <p className="text-slate-400">Pick from 17 styles: Modern, Scandinavian, Japanese, Bohemian, Art Deco, and many more. Each style has been carefully crafted to produce authentic results.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-white">Get Your Redesign</h3>
                  <p className="text-slate-400">In about 30 seconds, our AI generates a photorealistic redesign of your room. Download it, compare it with the original using our slider tool, and share it with friends.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
            <p>
              We believe that great interior design should be accessible to everyone, not just those who can afford professional designers. RoomFlip was born from a simple idea: what if you could see your dream room before spending a single dollar on furniture or renovations?
            </p>
            <p className="mt-4">
              We&apos;re a small indie team of designers and developers passionate about the intersection of artificial intelligence and interior design. We started RoomFlip because we were frustrated by the gap between inspiration (scrolling through Pinterest boards for hours) and action (actually knowing what would look good in <em>your specific</em> room). Traditional interior design software is complex and expensive, and hiring a designer isn&apos;t feasible for most people redecorating a single room.
            </p>
            <p className="mt-4">
              RoomFlip bridges that gap. It takes the guesswork out of interior design by showing you exactly what different styles would look like in your actual space, using the latest advances in AI image generation technology.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">The Technology</h2>
            <p>
              RoomFlip is powered by state-of-the-art generative AI models that understand spatial layout, lighting, furniture placement, and design principles. When you upload a room photo, our AI:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 ml-2">
              <li>Analyzes the room structure, including walls, floors, windows, and doors</li>
              <li>Understands the spatial relationships between objects in the room</li>
              <li>Applies the selected design style while preserving the room&apos;s fundamental layout</li>
              <li>Generates photorealistic results with appropriate furniture, colors, textures, and lighting</li>
            </ul>
            <p className="mt-4">
              We use Google&apos;s latest AI models for image generation, ensuring high-quality, detailed results that look natural and achievable. Our technology is continuously improving — each month brings better accuracy, more realistic textures, and faster generation times.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Why Free?</h2>
            <p>
              We believe in making design tools accessible. RoomFlip is supported by advertisements, which allows us to offer the service completely free. Every user gets 5 room redesigns per day — no account required, no credit card needed, no hidden fees. We want as many people as possible to experience the joy of seeing their rooms transformed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
            <p>
              We love hearing from our users! Whether you have feedback, feature requests, or just want to share your amazing room transformations, reach out to us at{" "}
              <a href="mailto:hello@roomflip.io" className="text-indigo-400 hover:underline">hello@roomflip.io</a>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all">
            Try RoomFlip Now
          </a>
        </div>
      </div>
    </main>
  );
}
