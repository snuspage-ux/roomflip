// Throttle logic for the TubeVoice interstitial ad shown on the upload flow.
// One impression per 24h, persisted in localStorage. SSR-safe.

const STORAGE_KEY = "roomflip:ads:tubevoice:last_shown";
const THROTTLE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Returns true when the TubeVoice ad should be shown:
 * - the key is missing (never shown), or
 * - more than 24h elapsed since the last impression.
 * Always false during SSR (no window).
 */
export function shouldShowTubevoiceAd(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const last = parseInt(raw, 10);
    if (!Number.isFinite(last)) return true;
    return Date.now() - last > THROTTLE_MS;
  } catch {
    // localStorage blocked (private mode, etc.) — don't nag, just skip the ad.
    return false;
  }
}

/**
 * Records "now" as the last-shown timestamp. Call this on dismiss (X / Continue)
 * and also on an image click (the user has seen + converted).
 */
export function markTubevoiceAdShown(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore — best-effort throttle only
  }
}
