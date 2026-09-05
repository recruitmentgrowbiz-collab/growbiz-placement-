import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateTxnId, generateRequestHash, getPayUCredentials, PAYU_PAYMENT_URL, CAREER_PLUS_PRICE_PAISE } from "@/lib/payu";

export async function POST(_req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: candidate } = await supabase
    .from("candidates")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!candidate) {
    return NextResponse.json({ error: "No candidate profile found for your account" }, { status: 400 });
  }

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  try {
    const { key } = getPayUCredentials();
    const txnid = generateTxnId();
    const amount = (CAREER_PLUS_PRICE_PAISE / 100).toFixed(2);
    const productinfo = "career_plus";
    const firstname = profile?.full_name || "Candidate";
    const email = user.email ?? "";

    const hash = generateRequestHash({ txnid, amount, productinfo, firstname, email });

    await supabase.from("payments").insert({
      candidate_id: user.id,
      plan: "career_plus",
      amount_paise: CAREER_PLUS_PRICE_PAISE,
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
        udf1: "",
        udf2: "",
        udf3: "",
        udf4: "",
        udf5: "",
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
