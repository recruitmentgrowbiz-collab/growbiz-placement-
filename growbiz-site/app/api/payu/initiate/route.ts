import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateTxnId, generateRequestHash, getPayUCredentials, PAYU_PAYMENT_URL, PLAN_PRICES_PAISE } from "@/lib/payu";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { plan } = await req.json();
  const amountPaise = PLAN_PRICES_PAISE[plan];
  if (!amountPaise) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });

  const { data: companyRow } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!companyRow) return NextResponse.json({ error: "No company found for your account" }, { status: 400 });

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  try {
    const { key } = getPayUCredentials();
    const txnid = generateTxnId();
    const amount = (amountPaise / 100).toFixed(2); // PayU expects rupees, not paise
    const productinfo = `plan_${plan}`;
    const firstname = profile?.full_name || "Employer";
    const email = user.email ?? "";

    const hash = generateRequestHash({ txnid, amount, productinfo, firstname, email });

    await supabase.from("payments").insert({
      company_id: companyRow.company_id,
      plan,
      amount_paise: amountPaise,
      provider_order_id: txnid,
      created_by: user.id,
      status: "created",
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return NextResponse.json({
      paymentUrl: PAYU_PAYMENT_URL,
      fields: {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone: "9999999999",
        surl: `${appUrl}/api/payu/success`,
        furl: `${appUrl}/api/payu/failure`,
        hash,
        service_provider: "payu_paisa",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
