import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyResponseHash, PLAN_ENTITLEMENTS } from "@/lib/payu";
import { findPaymentByOrderId, markPaymentPaid } from "@/lib/payment-records";

/**
 * PayU redirects the user's own browser here via a POST after payment
 * (not a server-to-server call, unlike Razorpay's webhook) — which is why
 * this works fine even in local testing without a public URL. Still, the
 * hash verification below is what actually confirms this came from PayU
 * and wasn't someone POSTing a fake "success" directly at this endpoint —
 * the redirect happening at all proves nothing on its own.
 */
export async function POST(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const formData = await req.formData();
  const fields = Object.fromEntries(formData.entries()) as Record<string, string>;

  const { txnid, amount, productinfo, firstname, email, status, hash, mihpayid } = fields;

  let valid = false;
  try {
    valid = verifyResponseHash({ txnid, amount, productinfo, firstname, email, status, hash });
  } catch {
    valid = false;
  }

  if (!valid || status !== "success") {
    return NextResponse.redirect(`${appUrl}/payment/failed`);
  }

  const admin = createAdminClient();

  const { data: payment } = await findPaymentByOrderId(admin, txnid);

  if (!payment) {
    return NextResponse.redirect(`${appUrl}/payment/failed`);
  }

  // Idempotent — PayU can redirect/retry this callback more than once for
  // the same transaction.
  if (payment.status === "paid") {
    return NextResponse.redirect(
      payment.candidate_id ? `${appUrl}/career-resources` : `${appUrl}/employer/dashboard/plan`
    );
  }

  await markPaymentPaid(admin, payment.id, mihpayid);

  if (payment.candidate_id) {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    await admin
      .from("candidates")
      .update({ career_plus_expires_at: expiresAt.toISOString() })
      .eq("user_id", payment.candidate_id);

    return NextResponse.redirect(`${appUrl}/career-resources`);
  }

  const entitlements = PLAN_ENTITLEMENTS[payment.plan];
  if (entitlements) {
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 30);

    await admin
      .from("memberships")
      .update({
        plan: payment.plan,
        active_jobs_limit: entitlements.activeJobs,
        candidate_unlocks_limit: entitlements.unlocks,
        status: "active",
        ends_at: endsAt.toISOString(),
      })
      .eq("company_id", payment.company_id);
  }

  return NextResponse.redirect(`${appUrl}/employer/dashboard/plan`);
}
