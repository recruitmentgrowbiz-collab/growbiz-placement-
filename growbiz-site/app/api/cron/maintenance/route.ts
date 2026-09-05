import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Runs the same maintenance jobs available manually from /admin/analytics
 * (job expiry, membership downgrade, Career Plus expiry — see
 * 0011_expiry_and_deletion.sql and 0019_career_plus_payments.sql) — this is
 * the fallback that works regardless of whether pg_cron is available on
 * your Supabase plan. Point any external scheduler at this route once a day.
 *
 * On Vercel: set a CRON_SECRET env var and add the vercel.json in the repo
 * root — Vercel automatically sends it as "Authorization: Bearer <secret>"
 * for scheduled invocations, no extra config needed.
 *
 * Any other scheduler (cron-job.org, GitHub Actions, etc.): call
 *   GET https://your-domain.com/api/cron/maintenance?secret=YOUR_CRON_SECRET
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const provided = bearerToken ?? req.nextUrl.searchParams.get("secret");

  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not configured on the server." }, { status: 500 });
  }
  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const [expireResult, downgradeResult, careerPlusResult] = await Promise.all([
    supabase.rpc("expire_stale_jobs"),
    supabase.rpc("downgrade_expired_memberships"),
    supabase.rpc("expire_career_plus"),
  ]);

  if (expireResult.error || downgradeResult.error || careerPlusResult.error) {
    return NextResponse.json(
      {
        error: "One or more maintenance jobs failed.",
        expireStaleJobs: expireResult.error?.message ?? "ok",
        downgradeMemberships: downgradeResult.error?.message ?? "ok",
        expireCareerPlus: careerPlusResult.error?.message ?? "ok",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ranAt: new Date().toISOString(), status: "ok" });
}
