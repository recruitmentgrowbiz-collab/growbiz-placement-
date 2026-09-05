import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Called by the client immediately after a successful verifyOtp() for a new
 * phone signup. Deliberately a separate HTTP request rather than continuing
 * inline after verifyOtp() in the same client call — the employer/candidate
 * email signup bug (found and fixed earlier this session) was specifically
 * about a session established moments earlier in the SAME request not
 * reliably propagating to the next database write. A fresh request here
 * means the session cookies from verifyOtp() have already fully committed
 * by the time this runs, which sidesteps that entire category of bug rather
 * than repeating it in a new code path.
 */
export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // This phone number might already belong to an existing employer/recruiter/
  // admin account (phone signup with shouldCreateUser:true just logs them in
  // rather than failing) — don't attach a candidate profile to the wrong
  // account type.
  if (profile && profile.role !== "candidate") {
    return NextResponse.json(
      { error: `This phone number is already linked to a ${profile.role} account.` },
      { status: 409 }
    );
  }

  // Idempotent — safe whether this is a genuinely new signup or a repeat call.
  const { data: existing } = await supabase
    .from("candidates")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("candidates").insert({ user_id: user.id });
  }

  return NextResponse.json({ success: true });
}
