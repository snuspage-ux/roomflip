"use client";

import { useState, useRef, useCallback } from "react";
import {
  shouldShowTubevoiceAd,
  markTubevoiceAdShown,
} from "@/lib/ads/tubevoice";

/**
 * Gates an "upload" action behind the TubeVoice interstitial ad.
 *
 * Usage:
 *   const ad = useTubevoiceAd();
 *   <div onClick={() => ad.guard(() => fileRef.current?.click())} />
 *   <TubeVoiceAdModal open={ad.open} onContinue={ad.onContinue} onAdClick={ad.onAdClick} />
 *
 * If the ad is throttled (shown within the last 24h), the action runs
 * immediately with no delay. Otherwise the action is deferred until the
 * user dismisses the modal (X / Continue / ESC).
 */
export function useTubevoiceAd() {
  const [open, setOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const guard = useCallback((action: () => void) => {
    if (shouldShowTubevoiceAd()) {
      pendingAction.current = action;
      setOpen(true);
    } else {
      action();
    }
  }, []);

  const onContinue = useCallback(() => {
    setOpen(false);
    markTubevoiceAdShown();
    const action = pendingAction.current;
    pendingAction.current = null;
    // Run synchronously within the dismiss click so the file dialog stays
    // inside the trusted user-gesture context.
    if (action) action();
  }, []);

  const onAdClick = useCallback(() => {
    // Image click = seen + converted; record so we don't nag again within 24h.
    markTubevoiceAdShown();
  }, []);

  return { open, guard, onContinue, onAdClick };
}
