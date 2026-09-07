"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { notifyByEmail } from "@/lib/email";
import { notifyBySms } from "@/lib/sms";

export type PlacementState = { error: string | null; success: boolean };
import { stageChangedEmail, placementCandidateEmail, placementEmployerEmail } from "@/lib/email-templates";
import { stageChangedSms, placementCandidateSms, placementEmployerSms } from "@/lib/sms-templates";

export async function updatePipelineStage(applicationId: string, jobId: string, stage: string) {
  const supabase = createClient();
  await supabase.from("applications").update({ stage }).eq("id", applicationId);
  revalidatePath(`/recruiter/jobs/${jobId}`);

  const { data: app } = await supabase
    .from("applications")
    .select("candidate_id, jobs(title)")
    .eq("id", applicationId)
    .single();
  if (app) {
    const jobTitle = (app as any).jobs?.title ?? "a role";
    const { subject, html } = stageChangedEmail(jobTitle, stage);
    await notifyByEmail(app.candidate_id, subject, html);
    await notifyBySms(app.candidate_id, stageChangedSms(jobTitle, stage));
  }
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
  revalidatePath(`/recruiter/jobs/${jobId}`);
}

export async function recordPlacement(_prev: PlacementState, formData: FormData): Promise<PlacementState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated.", success: false };

  const jobId = String(formData.get("jobId") ?? "");
  const candidateId = String(formData.get("candidateId") ?? "");
  const companyId = String(formData.get("companyId") ?? "");
  const annualCtc = Number(formData.get("annualCtc") ?? 0);
  const feePercent = Number(formData.get("feePercent") ?? 10);
  const feeAmount = Math.round((annualCtc * feePercent) / 100);

  const { error } = await supabase.from("placements").insert({
    job_id: jobId,
    candidate_id: candidateId,
    company_id: companyId,
    joining_date: String(formData.get("joiningDate") ?? "") || null,
    annual_ctc: annualCtc || null,
    fee_percent: feePercent,
    fee_amount: feeAmount,
    fee_status: "pending",
    recorded_by: user.id,
  });

  if (error) return { error: error.message, success: false };

  await supabase.from("applications").update({ stage: "hired" }).eq("id", formData.get("applicationId") as string);

  const { data: job } = await supabase.from("jobs").select("title").eq("id", jobId).single();
  const { data: company } = await supabase.from("companies").select("name").eq("id", companyId).single();
  const { data: owners } = await supabase
    .from("company_users")
    .select("user_id")
    .eq("company_id", companyId)
    .eq("role", "owner");

  if (job && company) {
    const candidateMail = placementCandidateEmail(job.title, company.name);
    await notifyByEmail(candidateId, candidateMail.subject, candidateMail.html);
    await notifyBySms(candidateId, placementCandidateSms(job.title, company.name));

    const employerMail = placementEmployerEmail(job.title);
    const employerSmsText = placementEmployerSms(job.title);
    for (const owner of owners ?? []) {
      await notifyByEmail(owner.user_id, employerMail.subject, employerMail.html);
      await notifyBySms(owner.user_id, employerSmsText);
    }
  }

  revalidatePath("/recruiter/placements");
  revalidatePath(`/recruiter/jobs/${jobId}`);
  return { error: null, success: true };
}

export async function updatePlacementFeeStatus(placementId: string, status: string) {
  const supabase = createClient();
  await supabase.from("placements").update({ fee_status: status }).eq("id", placementId);
  revalidatePath("/recruiter/placements");
}
