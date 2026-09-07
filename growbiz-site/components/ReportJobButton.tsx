"use client";

import { useState, useTransition } from "react";
import { Flag, CheckCircle2 } from "lucide-react";
import { submitJobReport } from "@/lib/supabase/report-actions";

export function ReportJobButton({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await submitJobReport(jobId, reason);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <p className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-green-700">
        <CheckCircle2 size={14} /> Report submitted — our team will review it.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-plum-600 hover:text-plum-700"
      >
        <Flag size={14} /> Report this job
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2.5 rounded-card border border-line bg-white p-3.5">
      <label className="text-[13px] font-medium text-ink">What's wrong with this listing?</label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        placeholder="e.g. asked me to pay a registration fee"
        className="rounded-lg border border-line px-3 py-2 text-[13.5px] focus:border-plum-400"
      />
      {error && <p className="text-[12.5px] text-red-700">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={isPending || !reason.trim()}
          className="rounded-pill bg-plum-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
        >
          {isPending ? "Submitting…" : "Submit report"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-pill border border-line px-4 py-2 text-[13px] font-medium text-ink/70"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
