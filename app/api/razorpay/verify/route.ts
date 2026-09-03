import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyRazorpaySignature, PLAN_ENTITLEMENTS } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { orderId, paymentId, signature } = await req.json();
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  let valid = false;
  try {
    valid = verifyRazorpaySignature(orderId, paymentId, signature);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Payment signature verification failed" }, { status: 400 });
  }

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("razorpay_order_id", orderId)
    .single();

  if (!payment) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Idempotency guard — the webhook (a second, independent confirmation
  // path) may have already processed this exact payment. Reprocessing would
  // silently re-extend the membership's ends_at from "now" a second time,
  // effectively giving extra free days on every duplicate call.
  if (payment.status === "paid") {
    return NextResponse.json({ success: true, plan: payment.plan, alreadyProcessed: true });
  }

  const entitlements = PLAN_ENTITLEMENTS[payment.plan];
  if (!entitlements) {
    return NextResponse.json({ error: "Unknown plan on this order" }, { status: 400 });
  }

  await supabase
    .from("payments")
    .update({ razorpay_payment_id: paymentId, status: "paid", paid_at: new Date().toISOString() })
    .eq("id", payment.id);

  // One month from now — this implements one-time-order billing (see README:
  // Razorpay Subscriptions would replace this with real recurring billing).
  const endsAt = new Date();
  endsAt.setMonth(endsAt.getMonth() + 1);

  await supabase
    .from("memberships")
    .update({
      plan: payment.plan,
      active_jobs_limit: entitlements.activeJobs,
      candidate_unlocks_limit: entitlements.unlocks,
      status: "active",
      ends_at: endsAt.toISOString(),
    })
    .eq("company_id", payment.company_id);

  return NextResponse.json({ success: true, plan: payment.plan });
}
