"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { notifyByEmail } from "@/lib/email";
import { notifyBySms } from "@/lib/sms";
import { verificationDecisionEmail } from "@/lib/email-templates";
import { verificationDecisionSms } from "@/lib/sms-templates";
import { indexJob, removeJobFromIndex } from "@/lib/search/meilisearch";

async function assertAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return null;

  return supabase;
}

export async function setCompanyVerification(companyId: string, status: string) {
  const supabase = await assertAdmin();
  // The page itself already gates access to admins — this is a defensive
  // fallback for a session that expires mid-use, so it fails quietly rather
  // than throwing an unhandled error into the client's transition.
  if (!supabase) return;

  await supabase.from("companies").update({ verification_status: status }).eq("id", companyId);
  await supabase.from("activities").insert({
    action: "company_verification_updated",
    entity_type: "company",
    entity_id: companyId,
    metadata: { status },
  });

  const { data: company } = await supabase.from("companies").select("name").eq("id", companyId).single();
  const { data: owners } = await supabase
    .from("company_users")
    .select("user_id")
    .eq("company_id", companyId)
    .eq("role", "owner");

  if (company) {
    const { subject, html } = verificationDecisionEmail(company.name, status);
    const smsText = verificationDecisionSms(company.name, status);
    for (const owner of owners ?? []) {
      await notifyByEmail(owner.user_id, subject, html);
      await notifyBySms(owner.user_id, smsText);
    }
  }

  revalidatePath("/admin");
  revalidatePath("/employer/dashboard");
  revalidatePath("/employer/dashboard/candidates");
}

export async function moderateJob(jobId: string, status: string) {
  const supabase = await assertAdmin();
  if (!supabase) return;

  const { data: job } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", jobId)
    .select("*, companies(name)")
    .single();

  await supabase.from("activities").insert({
    action: "job_moderated",
    entity_type: "job",
    entity_id: jobId,
    metadata: { status },
  });
  revalidatePath("/admin/jobs");

  if (!job) return;
  if (status === "published") {
    await indexJob({
      id: job.id,
      title: job.title,
      location: job.location,
      mode: job.mode,
      fresher_eligible: job.fresher_eligible,
      company_name: (job as any).companies?.name ?? "",
      status: job.status,
    });
  } else {
    await removeJobFromIndex(jobId);
  }
}

export async function resolveReport(reportId: string, status: string) {
  const supabase = await assertAdmin();
  if (!supabase) return;

  await supabase.from("reports").update({ status }).eq("id", reportId);
  revalidatePath("/admin/jobs");
}

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await assertAdmin();
  if (!supabase) return;

  // Permitted by the profiles_update_admin RLS policy (0009) — no service
  // role needed here, this runs as the admin's own verified session.
  await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
  await supabase.from("activities").insert({
    action: "user_role_updated",
    entity_type: "profile",
    entity_id: userId,
    metadata: { role: newRole },
  });
  revalidatePath("/admin/users");
}

/**
 * Manual trigger for the maintenance functions from 0011 and 0019 —
 * expiring stale job postings, downgrading memberships past their ends_at,
 * and lapsing Career Plus subscriptions past their expiry. Meant as a
 * fallback for projects without pg_cron enabled; see README for the
 * scheduled alternative.
 */
export async function runMaintenanceTasks(): Promise<{
  jobsExpired: number;
  membershipsDowngraded: number;
  careerPlusExpired: number;
} | null> {
  const supabase = await assertAdmin();
  if (!supabase) return null;

  const [{ data: jobsExpired }, { data: membershipsDowngraded }, { data: careerPlusExpired }] =
    await Promise.all([
      supabase.rpc("expire_stale_jobs"),
      supabase.rpc("downgrade_expired_memberships"),
      supabase.rpc("expire_career_plus"),
    ]);

  revalidatePath("/admin/analytics");
  return {
    jobsExpired: (jobsExpired as number) ?? 0,
    membershipsDowngraded: (membershipsDowngraded as number) ?? 0,
    careerPlusExpired: (careerPlusExpired as number) ?? 0,
  };
}
