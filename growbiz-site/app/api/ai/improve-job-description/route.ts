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

  const allowed = await checkRateLimit(`ai_job_description:${user.id}`, 20, 3600);
  if (!allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  const { title, draft } = await req.json();
  if (!title) return NextResponse.json({ error: "Missing job title" }, { status: 400 });

  try {
    const output = await generateWithAI(
      "You write clear, honest job descriptions for an Indian recruitment platform. Never invent " +
        "specific benefits, salary figures, or company facts that weren't given to you. Keep it " +
        "concise — 3-5 short paragraphs covering the role, responsibilities, and what a strong " +
        "candidate looks like. Plain text only, no markdown formatting.",
      `Job title: ${title}\n\nRough draft or notes from the employer:\n${draft || "(none provided — write from the title alone, keeping it general)"}`,
      600
    );

    await supabase.from("ai_generations").insert({
      requested_by: user.id,
      generation_type: "job_description",
      input_snapshot: { title, draft },
      output,
    });

    return NextResponse.json({ suggestion: output });
  } catch (err: any) {
    if (err instanceof AIUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Couldn't generate a suggestion right now." }, { status: 500 });
  }
}
