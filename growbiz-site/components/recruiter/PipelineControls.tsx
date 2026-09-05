"use client";

import { useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { updatePipelineStage, recordPlacement, type PlacementState } from "@/lib/supabase/recruiter-actions";
import type { ActionState } from "@/lib/supabase/actions";

const stages = ["applied", "shortlisted", "interview", "offer", "hired", "rejected"] as const;
const stageLabels: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Not selected",
};

export function RecruiterStageSelect({
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
        startTransition(() => updatePipelineStage(applicationId, jobId, e.target.value))
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

const initialState: ActionState = { error: null };

const placementInitialState: PlacementState = { error: null, success: false };

export function PlacementLogger({
  applicationId,
  jobId,
  candidateId,
  companyId,
}: {
  applicationId: string;
  jobId: string;
  candidateId: string;
  companyId: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(recordPlacement, placementInitialState);
  const [isPending, startTransition] = useTransition();

  if (state.success) {
    return (
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-card border border-green-200 bg-green-50 px-3 py-2 text-[13px] font-medium text-green-700">
        ✓ Placement recorded — visible on the Placements tab.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-pill border border-plum-600 px-3 py-1.5 text-[12.5px] font-medium text-plum-600 hover:bg-plum-50"
      >
        Log placement
      </button>
    );
  }

  return (
    <form
      action={(formData) => startTransition(() => formAction(formData))}
      className="mt-3 flex flex-col gap-2.5 rounded-card border border-line bg-plum-50/50 p-4"
    >
      <input type="hidden" name="applicationId" value={applicationId} />
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="candidateId" value={candidateId} />
      <input type="hidden" name="companyId" value={companyId} />

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-[12px] font-medium text-ink">Annual CTC (₹)</label>
          <input
            name="annualCtc"
            type="number"
            required
            className="mt-1 w-full rounded-lg border border-line px-2.5 py-2 text-[13.5px] focus:border-plum-400"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-ink">Fee %</label>
          <input
            name="feePercent"
            type="number"
            step="0.5"
            defaultValue={10}
            className="mt-1 w-full rounded-lg border border-line px-2.5 py-2 text-[13.5px] focus:border-plum-400"
          />
        </div>
      </div>
      <div>
        <label className="text-[12px] font-medium text-ink">Joining date</label>
        <input
          name="joiningDate"
          type="date"
          className="mt-1 w-full rounded-lg border border-line px-2.5 py-2 text-[13.5px] focus:border-plum-400"
        />
      </div>
      {state.error && <p className="text-[12.5px] text-red-700">{state.error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-pill bg-plum-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save placement"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={isPending}
          className="rounded-pill border border-line px-4 py-2 text-[13px] font-medium text-ink/70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
