"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { runMaintenanceTasks } from "@/lib/supabase/admin-actions";

export function MaintenanceRunner() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function handleRun() {
    setResult(null);
    startTransition(async () => {
      const res = await runMaintenanceTasks();
      if (res) {
        setResult(
          `Expired ${res.jobsExpired} stale job(s), downgraded ${res.membershipsDowngraded} lapsed membership(s), lapsed ${res.careerPlusExpired} Career Plus subscription(s).`
        );
      }
    });
  }

  return (
    <div className="mt-8 rounded-card border border-dashed border-line p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-medium text-ink">Maintenance tasks</p>
          <p className="mt-0.5 text-[13px] text-mist">
            Expires stale job postings, downgrades lapsed employer memberships, and lapses expired
            Career Plus subscriptions. Runs automatically if you've set up pg_cron (see README) —
            this is the manual fallback.
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={isPending}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300 disabled:opacity-60"
        >
          <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
          {isPending ? "Running…" : "Run now"}
        </button>
      </div>
      {result && <p className="mt-3 text-[13px] text-plum-700">{result}</p>}
    </div>
  );
}
