import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRazorpayWebhookSignature, PLAN_ENTITLEMENTS } from "@/lib/razorpay";

// Configure this URL in your Razorpay dashboard: Settings -> Webhooks
// Subscribe to the "payment.captured" event.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let valid = false;
  try {
    valid = verifyRazorpayWebhookSignature(rawBody, signature);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  if (!valid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  if (event.event !== "payment.captured") {
    return NextResponse.json({ received: true });
  }

  const orderId = event.payload?.payment?.entity?.order_id;
  const paymentId = event.payload?.payment?.entity?.id;
  if (!orderId) return NextResponse.json({ received: true });

  // The webhook signature (verified above) is the trust boundary here, not a
  // user session — Razorpay's server has neither, so this uses the service
  // role client to legitimately bypass RLS rather than trying to fake a session.
  const supabase = createAdminClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("razorpay_order_id", orderId)
    .eq("status", "created")
    .maybeSingle();

  if (!payment) return NextResponse.json({ received: true });

  const entitlements = PLAN_ENTITLEMENTS[payment.plan];
  if (!entitlements) return NextResponse.json({ received: true });

  await supabase
    .from("payments")
    .update({ razorpay_payment_id: paymentId, status: "paid", paid_at: new Date().toISOString() })
    .eq("id", payment.id);

  // One month from now — matches the verify route's logic. Whichever path
  // (client-side verify call or this webhook) processes the payment first
  // wins; the other is a no-op thanks to the `status = 'created'` filter above.
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

  return NextResponse.json({ received: true });
}
