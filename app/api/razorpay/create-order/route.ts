import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createRazorpayOrder, PLAN_PRICES_PAISE } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { plan } = await req.json();
  const amount = PLAN_PRICES_PAISE[plan];
  if (!amount) {
    return NextResponse.json({ error: "Unknown or non-purchasable plan" }, { status: 400 });
  }

  const { data: companyRow } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!companyRow?.company_id) {
    return NextResponse.json({ error: "No company found for your account" }, { status: 400 });
  }

  try {
    const order = await createRazorpayOrder(amount, `plan_${plan}_${Date.now()}`);

    await supabase.from("payments").insert({
      company_id: companyRow.company_id,
      plan,
      amount_paise: amount,
      razorpay_order_id: order.id,
      created_by: user.id,
      status: "created",
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
