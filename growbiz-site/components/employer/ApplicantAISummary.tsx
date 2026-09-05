"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

export function ApplicantAISummary({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function getSummary() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/applicant-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Couldn't generate a summary.");
      setSummary(result.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (summary) {
    return (
      <div className="mt-2.5 rounded-lg bg-plum-50/60 px-3 py-2.5">
        <p className="flex items-center gap-1.5 text-[11.5px] font-medium text-plum-700">
          <Sparkles size={12} /> AI summary
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-ink/80">{summary}</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        onClick={getSummary}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-plum-600 hover:text-plum-700 disabled:opacity-60"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
        {loading ? "Analyzing…" : "AI fit summary"}
      </button>
      {error && <p className="mt-1 text-[11.5px] text-red-700">{error}</p>}
    </div>
  );
}
