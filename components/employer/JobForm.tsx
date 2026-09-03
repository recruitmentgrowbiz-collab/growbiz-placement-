"use client";

import { useFormState } from "react-dom";
import { Field, SubmitButton, FormError } from "@/components/AuthForm";
import { createJob } from "@/lib/supabase/employer-actions";
import type { ActionState } from "@/lib/supabase/actions";

const initialState: ActionState = { error: null };

export function JobForm() {
  const [state, formAction] = useFormState(createJob, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-card border border-line p-6">
      <Field label="Job title" name="title" />
      <div>
        <label className="text-[13.5px] font-medium text-ink">Description</label>
        <textarea
          name="description"
          required
          rows={4}
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-[13.5px] font-medium text-ink">Requirements (one per line)</label>
        <textarea
          name="requirements"
          rows={3}
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location" name="location" />
        <div>
          <label className="text-[13.5px] font-medium text-ink">Work mode</label>
          <select
            name="mode"
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
          >
            <option>On-site</option>
            <option>Hybrid</option>
            <option>Remote</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-[13.5px] font-medium text-ink">Job type</label>
          <select
            name="type"
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
          >
            <option>Full-time</option>
            <option>Internship</option>
            <option>Contract</option>
          </select>
        </div>
        <Field label="Min. experience (years)" name="experienceMin" type="number" required={false} placeholder="0" />
        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2 text-[14px] text-ink/80">
            <input type="checkbox" name="fresherEligible" className="h-4 w-4 rounded border-line accent-plum-600" />
            Fresher friendly
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Salary min (₹/year)" name="salaryMin" type="number" required={false} />
        <Field label="Salary max (₹/year)" name="salaryMax" type="number" required={false} />
      </div>

      <FormError error={state.error} />
      <SubmitButton>Publish job</SubmitButton>
    </form>
  );
}
