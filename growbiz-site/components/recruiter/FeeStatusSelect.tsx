"use client";

import { useTransition } from "react";
import { updatePlacementFeeStatus } from "@/lib/supabase/recruiter-actions";

const statuses = ["pending", "invoiced", "paid"] as const;

export function FeeStatusSelect({ placementId, status }: { placementId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  if (status === "not_applicable") return <span className="text-[13px] text-mist">N/A</span>;

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => startTransition(() => updatePlacementFeeStatus(placementId, e.target.value))}
      className="rounded-pill border border-line px-3 py-1.5 text-[12.5px] font-medium capitalize text-ink focus:border-plum-400"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
