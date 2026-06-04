"use client";

import { Dialog } from "radix-ui";
import { motion } from "motion/react";
import { X, ExternalLink } from "lucide-react";

const AD_HREF = "https://tubevoice.io/?ref=roomflip";

interface TubeVoiceAdModalProps {
  /** Controls visibility. */
  open: boolean;
  /**
   * Called when the ad is dismissed (X, "Continue" button, or ESC).
   * The caller should run the original action (open file dialog / process drop)
   * and persist the throttle timestamp here.
   */
  onContinue: () => void;
  /** Called when the user clicks through to tubevoice.io (seen + converted). */
  onAdClick?: () => void;
}

export default function TubeVoiceAdModal({
  open,
  onContinue,
  onAdClick,
}: TubeVoiceAdModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        // Any close path (X / ESC) routes through onContinue so the original
        // action runs and the throttle is recorded exactly once.
        if (!next) onContinue();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          />
        </Dialog.Overlay>
        <Dialog.Content
          aria-describedby={undefined}
          // Backdrop click must NOT dismiss — user has to use X or Continue.
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          asChild
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100vw-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          >
            <Dialog.Title className="sr-only">
              Sponzorovaná reklama: TubeVoice
            </Dialog.Title>

            <div className="relative rounded-2xl bg-slate-900/95 p-4 shadow-2xl ring-1 ring-white/10">
              {/* Close (X) */}
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Zavřít reklamu"
                  className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white/90 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.Close>

              {/* Hero image — whole thing is the click target */}
              <a
                href={AD_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onAdClick?.()}
                className="block overflow-hidden rounded-2xl drop-shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <img
                  src="/ads/tubevoice-ad.jpg"
                  alt="TubeVoice — vyzkoušej AI hlasové funkce"
                  className="block w-full"
                  width={900}
                  height={900}
                />
              </a>

              {/* Visible CTA link — image alone isn't obviously clickable */}
              <a
                href={AD_HREF}
                target="_blank"
                rel="noopener"
                onClick={() => onAdClick?.()}
                className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-purple-400 transition-colors hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
              >
                tubevoice.io
                <ExternalLink size={14} />
              </a>

              {/* Sponsored disclosure (legal: must be disclosed as advertising) */}
              <p className="mt-3 text-center text-[11px] leading-tight text-slate-500">
                Sponzorováno · Reklamní sdělení
              </p>

              {/* Continue to roomflip — skip the ad, go to original action.
                  Closing routes through onOpenChange(false) → onContinue(). */}
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="mt-3 w-full rounded-xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Pokračovat na roomflip
                </button>
              </Dialog.Close>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
