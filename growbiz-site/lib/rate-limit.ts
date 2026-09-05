import { headers } from "next/headers";
import { createClient } from "./supabase/server";

/**
 * Best-effort client IP resolution. Works on Vercel and most reverse-proxy
 * setups via x-forwarded-for; falls back to a shared bucket if unavailable
 * (e.g. local dev without a proxy) rather than throwing — a rate limiter
 * that can't identify the caller should fail open, not break the request.
 */
export function getClientIp(): string {
  const h = headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

/**
 * Returns true if under the limit (and records this attempt), false if
 * over. Fails open (returns true) if the check itself errors — a rate
 * limiter should never be the reason a legitimate request breaks.
 */
export async function checkRateLimit(
  identifier: string,
  maxEvents: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_identifier: identifier,
      p_max_events: maxEvents,
      p_window_seconds: windowSeconds,
    });
    if (error) return true;
    return data ?? true;
  } catch {
    return true;
  }
}
