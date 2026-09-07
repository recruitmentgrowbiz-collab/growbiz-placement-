import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithAI, AIUnavailableError } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { applicationId } = await req.json();
  if (!applicationId) return NextResponse.json({ error: "Missing applicationId" }, { status: 400 });

  // RLS on applications already restricts this to the job's own company
  // members, recruiters, or admins — a candidate or an unrelated employer
  // simply won't find a matching row, so this naturally can't be used to
  // pull someone else's applicant data.
  const { data: application } = await supabase
    .from("applications")
    .select("*, jobs(title, description, requirements), candidates(headline, summary, skills)")
    .eq("id", applicationId)
    .maybeSingle();

  if (!application) {
    return NextResponse.json({ error: "Application not found or not accessible." }, { status: 404 });
  }

  const allowed = await checkRateLimit(`ai_applicant_summary:${user.id}`, 30, 3600);
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  const job = (application as any).jobs;
  const candidate = (application as any).candidates;

  try {
    // Guardrail from the brief: "Do not auto-reject based solely on an
    // opaque AI score" — this deliberately produces a short qualitative
    // note for a human to read, not a numeric score anything could act on
    // by itself.
    const output = await generateWithAI(
      "You write brief, neutral fit summaries to help a recruiter quickly scan an applicant — " +
        "2-3 sentences on how their stated skills/experience line up with the role's requirements. " +
        "Note gaps factually, without speculating about the person. Never comment on demographic " +
        "or personal characteristics. This is a starting point for a human reviewer, not a " +
        "decision — say so is unnecessary, just keep the tone accordingly. Plain text, no markdown.",
      `Job: ${job?.title}\nRequirements: ${(job?.requirements ?? []).join(", ")}\n\n` +
        `Candidate headline: ${candidate?.headline ?? "not set"}\nSummary: ${candidate?.summary ?? "not set"}\n` +
        `Skills: ${(candidate?.skills ?? []).join(", ")}`,
      250
    );

    await supabase.from("ai_generations").insert({
      requested_by: user.id,
      generation_type: "applicant_summary",
      target_id: applicationId,
      input_snapshot: { job, candidate },
      output,
    });

    return NextResponse.json({ summary: output });
  } catch (err: any) {
    if (err instanceof AIUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Couldn't generate a summary right now." }, { status: 500 });
  }
}
