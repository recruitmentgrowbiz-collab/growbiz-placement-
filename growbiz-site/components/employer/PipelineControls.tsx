"use client";

import { useState, useTransition } from "react";
import { updateApplicationStage, updateJobStatus, scheduleInterview } from "@/lib/supabase/employer-actions";

const stages = ["applied", "shortlisted", "interview", "offer", "hired", "rejected"] as const;
const stageLabels: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Not selected",
};

export function StageSelect({
  applicationId,
  jobId,
  currentStage,
}: {
  applicationId: string;
  jobId: string;
  currentStage: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentStage}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => {
          updateApplicationStage(applicationId, jobId, e.target.value);
        })
      }
      className="rounded-pill border border-line px-3 py-1.5 text-[13px] font-medium text-ink focus:border-plum-400"
    >
      {stages.map((s) => (
        <option key={s} value={s}>
          {stageLabels[s]}
        </option>
      ))}
    </select>
  );
}

export function JobStatusControls({ jobId, status }: { jobId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  function set(next: string) {
    startTransition(() => updateJobStatus(jobId, next));
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "published" ? (
        <button
          disabled={isPending}
          onClick={() => set("paused")}
          className="rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300"
        >
          Pause
        </button>
      ) : status === "paused" ? (
        <button
          disabled={isPending}
          onClick={() => set("published")}
          className="rounded-pill border border-plum-600 px-4 py-2 text-[13.5px] font-medium text-plum-600 hover:bg-plum-50"
        >
          Republish
        </button>
      ) : null}
      {status !== "closed" && (
        <button
          disabled={isPending}
          onClick={() => set("closed")}
          className="rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300"
        >
          Close role
        </button>
      )}
    </div>
  );
}

export function InterviewScheduler({
  applicationId,
  jobId,
  existing,
}: {
  applicationId: string;
  jobId: string;
  existing?: { scheduled_at: string | null; mode: string; status: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [scheduledAt, setScheduledAt] = useState("");
  const [mode, setMode] = useState("video");

  if (existing && !open) {
    return (
      <div className="flex items-center gap-2 text-[12.5px] text-mist">
        <span>
          Interview {existing.status}
          {existing.scheduled_at && ` · ${new Date(existing.scheduled_at).toLocaleString()}`}
        </span>
        <button onClick={() => setOpen(true)} className="font-medium text-plum-600 hover:text-plum-700">
          Reschedule
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-pill border border-plum-600 px-3 py-1.5 text-[12.5px] font-medium text-plum-600 hover:bg-plum-50"
      >
        Schedule interview
      </button>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap items-end gap-2.5 rounded-card border border-line bg-plum-50/50 p-3">
      <div>
        <label className="text-[12px] font-medium text-ink">Date &amp; time</label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="mt-1 rounded-lg border border-line px-2.5 py-2 text-[13px] focus:border-plum-400"
        />
      </div>
      <div>
        <label className="text-[12px] font-medium text-ink">Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="mt-1 rounded-lg border border-line px-2.5 py-2 text-[13px] focus:border-plum-400"
        >
          <option value="video">Video</option>
          <option value="phone">Phone</option>
          <option value="in_person">In person</option>
        </select>
      </div>
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await scheduleInterview(
              applicationId,
              jobId,
              scheduledAt ? new Date(scheduledAt).toISOString() : "",
              mode
            );
            setOpen(false);
          })
        }
        className="rounded-pill bg-plum-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Confirm"}
      </button>
      <button
        onClick={() => setOpen(false)}
        className="rounded-pill border border-line px-4 py-2 text-[13px] font-medium text-ink/70"
      >
        Cancel
      </button>
    </div>
  );
}
