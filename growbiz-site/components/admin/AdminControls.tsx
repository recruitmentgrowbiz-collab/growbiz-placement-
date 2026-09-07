"use client";

import { useTransition } from "react";
import { setCompanyVerification, moderateJob, updateUserRole, resolveReport } from "@/lib/supabase/admin-actions";

export function VerificationControls({ companyId }: { companyId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        disabled={isPending}
        onClick={() => startTransition(() => setCompanyVerification(companyId, "verified"))}
        className="rounded-pill bg-plum-600 px-4 py-2 text-[13.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
      >
        Approve
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => setCompanyVerification(companyId, "needs_review"))}
        className="rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300 disabled:opacity-60"
      >
        Needs review
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => setCompanyVerification(companyId, "rejected"))}
        className="rounded-pill border border-red-200 px-4 py-2 text-[13.5px] font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        Reject
      </button>
    </div>
  );
}

export function JobModerationControls({ jobId, status }: { jobId: string; status: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {status !== "closed" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => moderateJob(jobId, "closed"))}
          className="rounded-pill border border-red-200 px-4 py-2 text-[13px] font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
        >
          Remove listing
        </button>
      )}
      {status === "closed" && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => moderateJob(jobId, "published"))}
          className="rounded-pill border border-line px-4 py-2 text-[13px] font-medium text-ink/80 disabled:opacity-60"
        >
          Restore
        </button>
      )}
    </div>
  );
}

const roles = ["candidate", "employer", "recruiter", "admin"] as const;

export function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={currentRole}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateUserRole(userId, e.target.value))}
      className="rounded-pill border border-line px-3 py-1.5 text-[13px] font-medium capitalize text-ink focus:border-plum-400"
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}

export function ResolveReportButton({ reportId }: { reportId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => resolveReport(reportId, "resolved"))}
      className="shrink-0 rounded-pill border border-line px-3.5 py-1.5 text-[12.5px] font-medium text-ink/80 hover:border-plum-300 disabled:opacity-60"
    >
      {isPending ? "…" : "Mark resolved"}
    </button>
  );
}
