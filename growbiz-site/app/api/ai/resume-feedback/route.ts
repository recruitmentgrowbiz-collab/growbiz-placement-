import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithAI, AIUnavailableError } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(_req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: candidate } = await supabase
    .from("candidates")
    .select("*, candidate_experience(*), candidate_education(*)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!candidate) {
    return NextResponse.json({ error: "No candidate profile found." }, { status: 400 });
  }

  // This is the "AI-assisted resume feedback" benefit that's been listed on
  // /pricing and /career-resources since early in this session with nothing
  // behind it — gating it here is what actually makes that a real feature
  // rather than a line item on a pricing card.
  const hasCareerPlus = candidate.career_plus_expires_at && new Date(candidate.career_plus_expires_at) > new Date();
  if (!hasCareerPlus) {
    return NextResponse.json(
      { error: "AI resume feedback is a Career Plus benefit. Activate it from /career-resources." },
      { status: 403 }
    );
  }

  const allowed = await checkRateLimit(`ai_resume_feedback:${user.id}`, 10, 3600);
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  const profileSummary = {
    headline: candidate.headline,
    summary: candidate.summary,
    skills: candidate.skills,
    experience: candidate.candidate_experience,
    education: candidate.candidate_education,
  };

  try {
    const output = await generateWithAI(
      "You give honest, specific, encouraging feedback on job candidate profiles for an Indian " +
        "job platform. Point out 2-4 concrete things to improve (missing detail, weak phrasing, " +
        "gaps) and 1-2 genuine strengths. Never invent experience or skills the candidate didn't " +
        "list. Keep it to about 200 words, plain text, no markdown.",
      `Candidate profile:\n${JSON.stringify(profileSummary, null, 2)}`,
      500
    );

    await supabase.from("ai_generations").insert({
      requested_by: user.id,
      generation_type: "resume_feedback",
      target_id: user.id,
      input_snapshot: profileSummary,
      output,
    });

    return NextResponse.json({ feedback: output });
  } catch (err: any) {
    if (err instanceof AIUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Couldn't generate feedback right now." }, { status: 500 });
  }
}
