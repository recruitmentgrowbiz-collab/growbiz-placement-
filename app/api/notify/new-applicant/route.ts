import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyByEmail } from "@/lib/email";
import { notifyBySms } from "@/lib/sms";
import { newApplicantEmail } from "@/lib/email-templates";
import { newApplicantSms } from "@/lib/sms-templates";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { jobId } = await req.json();
  if (!jobId) return NextResponse.json({ error: "Missing jobId" }, { status: 400 });

  // Re-fetch the job server-side — never trust the client for who the email goes to.
  const { data: job } = await supabase.from("jobs").select("title, owner_id").eq("id", jobId).single();
  if (!job) return NextResponse.json({ received: true });

  const { subject, html } = newApplicantEmail(job.title);
  await notifyByEmail(job.owner_id, subject, html);
  await notifyBySms(job.owner_id, newApplicantSms(job.title));

  return NextResponse.json({ sent: true });
}
