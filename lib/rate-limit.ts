/**
 * useRateLimit — client-side daily rate limiter using localStorage.
 *
 * Resets automatically each calendar day by comparing stored date string.
 * NOT a security boundary — intended for UX gating on public portfolio tools.
 *
 * @param limit - Max uses per day (default: 3)
 * @returns { remaining, isLimitReached, consume }
 */

const STORAGE_KEY_REMAINING = "cvearly_remaining";
const STORAGE_KEY_DATE = "cvearly_reset_date";

export function getRateLimitState(limit: number): number {
  if (typeof window === "undefined") return limit;

  const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
  const today = new Date().toDateString();

  if (storedDate !== today) {
    // New calendar day — reset counter
    localStorage.setItem(STORAGE_KEY_DATE, today);
    localStorage.setItem(STORAGE_KEY_REMAINING, String(limit));
    return limit;
  }

  const cached = localStorage.getItem(STORAGE_KEY_REMAINING);
  return cached !== null ? parseInt(cached, 10) : limit;
}

export function consumeRateLimit(current: number): number {
  const next = Math.max(0, current - 1);
  localStorage.setItem(STORAGE_KEY_REMAINING, String(next));
  return next;
}
