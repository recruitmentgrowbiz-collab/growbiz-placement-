"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/supabase/actions";
import { notifyByEmail } from "@/lib/email";
import { notifyBySms } from "@/lib/sms";
import { stageChangedEmail } from "@/lib/email-templates";
import { stageChangedSms } from "@/lib/sms-templates";
import { checkRateLimit } from "@/lib/rate-limit";
import { indexJob, removeJobFromIndex } from "@/lib/search/meilisearch";

async function getMyCompanyId(): Promise<{ companyId: string | null; userId: string | null }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { companyId: null, userId: null };

  const { data } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return { companyId: data?.company_id ?? null, userId: user.id };
}

const FREE_TIER_DEFAULTS = { activeJobsLimit: 1, candidateUnlocksLimit: 10 };

/**
 * Returns the company's effective entitlements — free-tier defaults if the
 * membership has expired or isn't active, regardless of what plan/limits are
 * still sitting in the memberships row. This is what actually enforces
 * "don't let expired accounts retain paid entitlements," not just the
 * numbers stored on the membership record.
 */
async function getEffectiveEntitlements(supabase: ReturnType<typeof createClient>, companyId: string) {
  const { data: membership } = await supabase
    .from("memberships")
    .select("plan, status, ends_at, active_jobs_limit, candidate_unlocks_limit")
    .eq("company_id", companyId)
    .maybeSingle();

  if (!membership) return FREE_TIER_DEFAULTS;

  const isActive = membership.status === "active" && (!membership.ends_at || new Date(membership.ends_at) > new Date());
  if (!isActive) return FREE_TIER_DEFAULTS;

  return {
    activeJobsLimit: membership.active_jobs_limit,
    candidateUnlocksLimit: membership.candidate_unlocks_limit,
  };
}

export async function createJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = createClient();
  const { companyId, userId } = await getMyCompanyId();
  if (!companyId || !userId) return { error: "No company found for your account." };

  // Burst protection independent of the plan's monthly active-jobs limit —
  // a scripted actor could otherwise post jobs as fast as the network allows
  // right up to the entitlement cap.
  const allowed = await checkRateLimit(`create_job:${userId}`, 10, 3600);
  if (!allowed) return { error: "Too many jobs posted recently. Please try again in a while." };

  // Enforce the membership's active-jobs entitlement (Master Brief, Section 9) —
  // using the EFFECTIVE entitlement, which falls back to free-tier limits if
  // the membership has expired, rather than trusting stale stored limits.
  const { activeJobsLimit } = await getEffectiveEntitlements(supabase, companyId);

  const { count } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .eq("status", "published");

  if ((count ?? 0) >= activeJobsLimit) {
    return {
      error: `You've reached your plan's limit of ${activeJobsLimit} active job(s). Upgrade your plan to post more.`,
    };
  }

  const requirements = String(formData.get("requirements") ?? "")
    .split("\n")
    .map((r) => r.trim())
    .filter(Boolean);

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      company_id: companyId,
      owner_id: userId,
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      requirements,
      location: String(formData.get("location") ?? ""),
      mode: String(formData.get("mode") ?? "On-site"),
      type: String(formData.get("type") ?? "Full-time"),
      experience_min: Number(formData.get("experienceMin") ?? 0),
      fresher_eligible: formData.get("fresherEligible") === "on",
      salary_min: formData.get("salaryMin") ? Number(formData.get("salaryMin")) : null,
      salary_max: formData.get("salaryMax") ? Number(formData.get("salaryMax")) : null,
      status: "published",
    })
    .select("*, companies(name)")
    .single();

  if (error) return { error: error.message };

  await indexJob({
    id: job.id,
    title: job.title,
    location: job.location,
    mode: job.mode,
    fresher_eligible: job.fresher_eligible,
    company_name: (job as any).companies?.name ?? "",
    status: job.status,
  });

  redirect(`/employer/dashboard/jobs/${job.id}`);
}

export async function updateJobStatus(jobId: string, status: string) {
  const supabase = createClient();
  const { data: job } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", jobId)
    .select("*, companies(name)")
    .single();

  revalidatePath("/employer/dashboard/jobs");
  revalidatePath(`/employer/dashboard/jobs/${jobId}`);

  if (!job) return;

  // Only published jobs stay searchable — paused/closed jobs come out of
  // the index rather than lingering as stale, unclickable search results.
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

export async function updateApplicationStage(applicationId: string, jobId: string, stage: string) {
  const supabase = createClient();
  await supabase.from("applications").update({ stage }).eq("id", applicationId);
  revalidatePath(`/employer/dashboard/jobs/${jobId}`);

  const { data: app } = await supabase
    .from("applications")
    .select("candidate_id, jobs(title)")
    .eq("id", applicationId)
    .single();
  if (app) {
    const { subject, html } = stageChangedEmail((app as any).jobs?.title ?? "a role", stage);
    await notifyByEmail(app.candidate_id, subject, html);
    await notifyBySms(app.candidate_id, stageChangedSms((app as any).jobs?.title ?? "a role", stage));
  }
}

const PLAN_LIMITS: Record<string, { activeJobs: number; unlocks: number }> = {
  free: { activeJobs: 1, unlocks: 10 },
  starter: { activeJobs: 5, unlocks: 100 },
  growth: { activeJobs: 15, unlocks: 300 },
  pro: { activeJobs: 40, unlocks: 800 },
};

export async function changePlan(planKey: string): Promise<ActionState> {
  const supabase = createClient();
  const { companyId } = await getMyCompanyId();
  if (!companyId) return { error: "No company found for your account." };

  const limits = PLAN_LIMITS[planKey];
  if (!limits) {
    return { error: "That plan isn't available for self-serve changes — contact sales." };
  }

  const { error } = await supabase
    .from("memberships")
    .update({
      plan: planKey,
      active_jobs_limit: limits.activeJobs,
      candidate_unlocks_limit: limits.unlocks,
      status: "active",
    })
    .eq("company_id", companyId);

  if (error) return { error: error.message };

  revalidatePath("/employer/dashboard/plan");
  revalidatePath("/employer/dashboard");
  return { error: null };
}

export async function scheduleInterview(
  applicationId: string,
  jobId: string,
  scheduledAt: string,
  mode: string
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("interviews").insert({
    application_id: applicationId,
    scheduled_at: scheduledAt || null,
    mode,
    created_by: user?.id,
  });
  await supabase.from("applications").update({ stage: "interview" }).eq("id", applicationId);
  revalidatePath(`/employer/dashboard/jobs/${jobId}`);
}

export async function unlockCandidate(candidateId: string): Promise<ActionState> {
  const supabase = createClient();
  const { companyId, userId } = await getMyCompanyId();
  if (!companyId || !userId) return { error: "No company found for your account." };

  // Burst protection — the monthly quota checked further below limits total
  // volume, but nothing previously stopped a script from burning through an
  // entire month's allowance in seconds.
  const burstAllowed = await checkRateLimit(`unlock_candidate:${userId}`, 20, 60);
  if (!burstAllowed) return { error: "Too many unlocks too quickly. Please slow down." };

  const { data: company } = await supabase
    .from("companies")
    .select("verification_status")
    .eq("id", companyId)
    .single();

  if (company?.verification_status !== "verified") {
    return { error: "Your company must be verified before unlocking candidate profiles." };
  }

  // Idempotent — if already unlocked, don't count against quota again.
  const { data: existing } = await supabase
    .from("candidate_unlocks")
    .select("id")
    .eq("company_id", companyId)
    .eq("candidate_id", candidateId)
    .maybeSingle();

  if (existing) return { error: null };

  const { candidateUnlocksLimit } = await getEffectiveEntitlements(supabase, companyId);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("candidate_unlocks")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .gte("created_at", startOfMonth.toISOString());

  if ((count ?? 0) >= candidateUnlocksLimit) {
    return {
      error: `You've reached your plan's monthly limit of ${candidateUnlocksLimit} candidate unlocks. Upgrade your plan for more.`,
    };
  }

  const { error } = await supabase.from("candidate_unlocks").insert({
    company_id: companyId,
    candidate_id: candidateId,
    unlocked_by: userId,
    reason: "candidate_search",
  });

  if (error) return { error: error.message };

  revalidatePath("/employer/dashboard/candidates");
  return { error: null };
}

export async function getUnlockedCandidateDetails(candidateId: string) {
  const supabase = createClient();
  // The candidates_select RLS policy itself permits this once a real unlock
  // record exists (see 0007_candidate_visibility.sql) — no special RPC needed,
  // this fails closed automatically for anyone who hasn't actually unlocked.
  const { data } = await supabase
    .from("candidates")
    .select("resume_url, salary_expectation, profiles(full_name)")
    .eq("user_id", candidateId)
    .maybeSingle();

  if (!data) return null;
  return {
    full_name: (data as any).profiles?.full_name ?? null,
    resume_url: data.resume_url,
    salary_expectation: data.salary_expectation,
  };
}
