"use client";

import { FormEvent, useState } from "react";
import { reportTypes } from "@/features/public-content/mock/content";

export function ReportForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    window.setTimeout(() => setState("success"), 250);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line p-6">
      <h2 className="font-display text-[22px] font-bold text-ink">Report details</h2>
      <div className="mt-5 grid gap-4">
        <label className="text-[13.5px] font-medium text-ink">Report type<select required defaultValue="" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500"><option value="" disabled>Select report type</option>{reportTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="text-[13.5px] font-medium text-ink">Job URL / company<input className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500" /></label>
        <label className="text-[13.5px] font-medium text-ink">Reason<input required className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500" /></label>
        <label className="text-[13.5px] font-medium text-ink">Description<textarea required rows={5} className="mt-1.5 w-full rounded-card border border-line px-3 py-2 text-[14.5px] focus:border-plum-500" /></label>
        <label className="text-[13.5px] font-medium text-ink">Contact email optional<input type="email" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px] focus:border-plum-500" /></label>
      </div>
      {state === "success" && <p role="status" className="mt-4 rounded-card bg-plum-50 p-3 text-[13.5px] text-ink/80">Online report submission is not available yet. Your report has not been sent.</p>}
      {state === "error" && <p role="alert" className="mt-4 rounded-card bg-red-50 p-3 text-[13.5px] text-red-700">Something went wrong. Please try again.</p>}
      <button disabled={state === "submitting"} className="gb-button gb-button--primary mt-5 min-h-11 w-full rounded-control bg-plum-600 px-5 py-3 text-[15px] font-medium text-white hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-70">
        {state === "submitting" ? "Preparing..." : "Submit Report"}
      </button>
    </form>
  );
}
