import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const formData = await req.formData();
  const txnid = formData.get("txnid") as string | null;

  if (txnid) {
    const admin = createAdminClient();
    await admin.from("payments").update({ status: "failed" }).eq("provider_order_id", txnid).eq("status", "created");
  }

  return NextResponse.redirect(`${appUrl}/payment/failed`);
}
