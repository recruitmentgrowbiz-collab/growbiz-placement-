import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Every query here runs through the normal RLS-bound client — this
 * endpoint doesn't need to enumerate what belongs to the user because RLS
 * already guarantees each of these queries can only ever return their own
 * rows (own profile, own candidate/company data, own applications, etc.).
 */
export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const [profile, candidate, experience, education, applications, savedJobs, companyMemberships, notifications] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("candidates").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("candidate_experience").select("*").eq("candidate_id", user.id),
      supabase.from("candidate_education").select("*").eq("candidate_id", user.id),
      supabase.from("applications").select("*, jobs(title)").eq("candidate_id", user.id),
      supabase.from("saved_jobs").select("*, jobs(title)").eq("candidate_id", user.id),
      supabase.from("company_users").select("*, companies(*)").eq("user_id", user.id),
      supabase.from("notifications").select("*").eq("user_id", user.id),
    ]);

  const exportData = {
    exportedAt: new Date().toISOString(),
    account: { email: user.email, createdAt: user.created_at },
    profile: profile.data,
    candidateProfile: candidate.data,
    workExperience: experience.data,
    education: education.data,
    applications: applications.data,
    savedJobs: savedJobs.data,
    companyMemberships: companyMemberships.data,
    notifications: notifications.data,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="grow-biz-jobs-data-${user.id}.json"`,
    },
  });
}
