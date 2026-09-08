"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const DEMO_SAVED_JOBS_KEY = "growbiz_demo_saved_jobs";

function getDemoSavedJobs() {
  try {
    return JSON.parse(window.localStorage.getItem(DEMO_SAVED_JOBS_KEY) ?? "[]") as {
      id: string;
      title: string;
      company: string;
    }[];
  } catch {
    return [];
  }
}

export function ApplyPanel({
  jobId,
  jobTitle,
  company,
  screeningQuestions,
  dbJobId,
}: {
  jobId: string;
  jobTitle: string;
  company: string;
  screeningQuestions: string[];
  dbJobId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(!!dbJobId);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!dbJobId) {
      setSaved(getDemoSavedJobs().some((job) => job.id === jobId));
      return;
    }
    const supabase = createClient();
    if (open) setCheckingAuth(true);
    supabase.auth.getUser().then(async ({ data }) => {
      setUserId(data.user?.id ?? null);
      if (data.user) {
        const { data: savedRow } = await supabase
          .from("saved_jobs")
          .select("job_id")
          .eq("candidate_id", data.user.id)
          .eq("job_id", dbJobId)
          .maybeSingle();
        setSaved(!!savedRow);
      }
      if (open) setCheckingAuth(false);
    });
  }, [open, dbJobId, jobId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!dbJobId) {
      // Demo/illustrative job — no real backend to submit to.
      setSubmitted(true);
      return;
    }

    if (!userId) return;

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const answers: Record<string, string> = {};
    screeningQuestions.forEach((q, i) => {
      answers[q] = String(formData.get(`question-${i}`) ?? "");
    });

    const supabase = createClient();
    const { error: insertError } = await supabase.from("applications").insert({
      candidate_id: userId,
      job_id: dbJobId,
      answers,
    });

    setSubmitting(false);
    if (insertError) {
      if (insertError.code === "23505") {
        setError("You've already applied to this job.");
      } else if (insertError.message.includes("applications_candidate_id_fkey")) {
        setError(
          "This account doesn't have a candidate profile — you're likely logged in as an employer or recruiter account. Log in with a candidate account to apply."
        );
      } else {
        setError(insertError.message);
      }
      return;
    }
    // Fire-and-forget — the in-app notification (DB trigger) already covers this;
    // email is a best-effort extra that shouldn't block the success state.
    fetch("/api/notify/new-applicant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: dbJobId }),
    }).catch(() => {});
    setSubmitted(true);
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setError(null);
    }, 300);
  }

  async function toggleSave() {
    setSaveError(null);
    if (!dbJobId) {
      const savedJobs = getDemoSavedJobs();
      const nextSaved = !saved;
      const nextJobs = nextSaved
        ? [...savedJobs.filter((job) => job.id !== jobId), { id: jobId, title: jobTitle, company }]
        : savedJobs.filter((job) => job.id !== jobId);
      window.localStorage.setItem(DEMO_SAVED_JOBS_KEY, JSON.stringify(nextJobs));
      window.dispatchEvent(new Event("growbiz-demo-saved-jobs-change"));
      setSaved(nextSaved);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setOpen(true);
      return;
    }
    setSavingJob(true);
    if (saved) {
      const { error: deleteError } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("candidate_id", data.user.id)
        .eq("job_id", dbJobId);
      setSavingJob(false);
      if (deleteError) {
        setSaveError(deleteError.message);
        return;
      }
      setSaved(false);
    } else {
      const { error: insertError } = await supabase
        .from("saved_jobs")
        .insert({ candidate_id: data.user.id, job_id: dbJobId });
      setSavingJob(false);
      if (insertError) {
        if (insertError.code === "23505") {
          setSaved(true);
          return;
        }
        setSaveError(insertError.message);
        return;
      }
      setSaved(true);
    }
  }

  return (
    <>
      <div>
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            onClick={() => setOpen(true)}
            className="rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-plum-700"
          >
            Apply Now
          </button>
          <button
            onClick={toggleSave}
            disabled={savingJob}
            className={`rounded-pill border px-5 py-3 text-[15px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              saved
                ? "border-plum-600 bg-plum-50 text-plum-700"
                : "border-line text-ink/80 hover:border-plum-300"
            }`}
          >
            {savingJob ? "Saving…" : saved ? "Saved" : "Save Job"}
          </button>
        </div>
        {saveError && <p className="mt-2 text-[12.5px] text-red-700">{saveError}</p>}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-card bg-white p-6 shadow-soft sm:rounded-card">
            {checkingAuth ? (
              <div className="flex flex-col items-center py-14">
                <Loader2 size={28} className="animate-spin text-plum-400" />
              </div>
            ) : dbJobId && !userId ? (
              <div className="flex flex-col items-center py-8 text-center">
                <h3 className="font-display text-[18px] font-semibold text-ink">
                  Create a free profile to apply
                </h3>
                <p className="mt-2 max-w-xs text-[14.5px] text-mist">
                  Applying is always free. Sign up in under a minute, then come back and apply to{" "}
                  {jobTitle}.
                </p>
                <div className="mt-6 flex gap-3">
                  <Link
                    href="/candidate/signup"
                    className="rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700"
                  >
                    Create free profile
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-pill border border-line px-5 py-2.5 text-[14.5px] font-medium text-ink/80"
                  >
                    Log in
                  </Link>
                </div>
                <button onClick={close} className="mt-4 text-[13px] text-mist hover:text-ink">
                  Cancel
                </button>
              </div>
            ) : !submitted ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-[18px] font-semibold text-ink">Apply to {jobTitle}</h3>
                    <p className="mt-0.5 text-[14px] text-mist">{company}</p>
                  </div>
                  <button aria-label="Close" onClick={close} className="text-mist hover:text-ink">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  {!dbJobId && (
                    <>
                      <div>
                        <label className="text-[13.5px] font-medium text-ink">Full name</label>
                        <input
                          required
                          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-[13.5px] font-medium text-ink">Email or mobile</label>
                        <input
                          required
                          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400"
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-[13.5px] font-medium text-ink">Resume</label>
                        <div className="mt-1.5 rounded-lg border border-dashed border-line px-3 py-4 text-center text-[13.5px] text-mist">
                          Upload PDF or DOCX (demo only — not stored)
                        </div>
                      </div>
                    </>
                  )}

                  {dbJobId && (
                    <p className="rounded-lg bg-plum-50/60 px-3 py-2.5 text-[13px] text-ink/70">
                      Applying using your Grow Biz profile and resume on file.
                    </p>
                  )}

                  {screeningQuestions.length > 0 && (
                    <div className="flex flex-col gap-4 border-t border-line pt-4">
                      <p className="text-[13px] font-medium text-mist">Screening questions</p>
                      {screeningQuestions.map((question, i) => (
                        <div key={question}>
                          <label className="text-[13.5px] text-ink">{question}</label>
                          <input
                            required
                            name={dbJobId ? `question-${i}` : undefined}
                            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 rounded-pill bg-plum-600 px-5 py-3 text-[15px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit Application"}
                  </button>
                  <p className="text-center text-[12.5px] text-mist">
                    {dbJobId
                      ? "Applying is free."
                      : "Applying is free. This demo form does not send real data anywhere."}
                  </p>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 size={40} className="text-plum-600" />
                <h3 className="mt-4 font-display text-[18px] font-semibold text-ink">
                  Application submitted
                </h3>
                <p className="mt-2 max-w-xs text-[14.5px] text-mist">
                  {dbJobId
                    ? "You can track its status from your candidate dashboard."
                    : "In the live product this would appear in your candidate dashboard with a trackable status."}
                </p>
                <div className="mt-6 flex gap-3">
                  {dbJobId && (
                    <Link
                      href="/candidate/dashboard"
                      className="rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700"
                    >
                      View dashboard
                    </Link>
                  )}
                  <button
                    onClick={close}
                    className="rounded-pill border border-line px-5 py-2.5 text-[14.5px] font-medium text-ink hover:border-plum-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
