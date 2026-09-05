import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Uses the service role key, which bypasses Row Level Security entirely.
 * Only use this for genuinely trusted server-to-server contexts (like a
 * signature-verified webhook) where there is no user session to act as —
 * never expose this client or its key to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Add it to .env.local (server-only, from " +
        "Settings -> API -> service_role in your Supabase dashboard) to use admin/webhook routes."
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
