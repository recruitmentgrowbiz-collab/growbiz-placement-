"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export type ReportState = { error: string | null; success: boolean };

export async function submitContactForm(
  _prev: ReportState,
  formData: FormData
): Promise<ReportState> {
  // Anonymous-friendly, so IP-based limiting is the only option here —
  // there's no user ID to key on for someone who isn't logged in.
  const allowed = await checkRateLimit(`contact:${getClientIp()}`, 5, 3600);
  if (!allowed) return { error: "Too many messages sent recently. Please try again later.", success: false };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const reason = String(formData.get("reason") ?? "Something else");
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const company = String(formData.get("company") ?? "");
  const message = String(formData.get("message") ?? "");

  const description = [
    name && `Name: ${name}`,
    email && `Email: ${email}`,
    company && `Company: ${company}`,
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await supabase.from("reports").insert({
    reporter_id: user?.id ?? null,
    target_type: "contact",
    category: reason,
    description,
  });

  if (error) return { error: "Something went wrong. Please try again.", success: false };
  return { error: null, success: true };
}

export async function submitJobReport(
  jobId: string,
  reason: string
): Promise<ReportState> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Job reports specifically require an account — matches the brief's
  // "report a suspicious job" flow being tied to a real user, not an
  // anonymous drive-by, since these need to be triaged seriously.
  if (!user) return { error: "Please log in to report a job.", success: false };

  const allowed = await checkRateLimit(`job_report:${user.id}`, 10, 3600);
  if (!allowed) return { error: "Too many reports submitted recently. Please try again later.", success: false };

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    target_type: "job",
    target_id: jobId,
    category: "suspicious_job",
    description: reason,
  });

  if (error) return { error: "Something went wrong. Please try again.", success: false };
  return { error: null, success: true };
}
