"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function ResumeFeedbackPanel() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function getFeedback() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/resume-feedback", { method: "POST" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Couldn't generate feedback.");
      setFeedback(result.feedback);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-card border border-line bg-white p-6">
      <div className="flex items-center gap-2">
        <Sparkles size={17} className="text-plum-600" />
        <h3 className="font-display text-[15.5px] font-semibold text-ink">AI resume feedback</h3>
      </div>

      {feedback ? (
        <>
          <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-ink/85">{feedback}</p>
          <p className="mt-3 text-[12px] text-mist">
            This is a starting point, not a rule — update your profile at{" "}
            <a href="/candidate/dashboard" className="text-plum-600 hover:text-plum-700">
              your dashboard
            </a>{" "}
            if any of it's useful.
          </p>
          <button
            onClick={getFeedback}
            disabled={loading}
            className="mt-3 text-[13px] font-medium text-plum-600 hover:text-plum-700 disabled:opacity-60"
          >
            {loading ? "Regenerating…" : "Regenerate"}
          </button>
        </>
      ) : (
        <>
          <p className="mt-2 text-[13.5px] text-mist">
            Get specific, AI-generated feedback on your current profile — what's strong, what to
            improve.
          </p>
          <button
            onClick={getFeedback}
            disabled={loading}
            className="mt-4 inline-flex items-center gap-1.5 rounded-pill bg-plum-600 px-4 py-2 text-[13.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Analyzing your profile…" : "Get feedback"}
          </button>
          {error && <p className="mt-2.5 text-[13px] text-red-700">{error}</p>}
        </>
      )}
    </div>
  );
}
