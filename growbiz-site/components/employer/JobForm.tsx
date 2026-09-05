"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Sparkles, Loader2 } from "lucide-react";
import { Field, SubmitButton, FormError } from "@/components/AuthForm";
import { createJob } from "@/lib/supabase/employer-actions";
import type { ActionState } from "@/lib/supabase/actions";

const initialState: ActionState = { error: null };

export function JobForm() {
  const [state, formAction] = useFormState(createJob, initialState);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function improveWithAI() {
    if (!title.trim()) {
      setAiError("Add a job title first.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai/improve-job-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, draft: description }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Couldn't generate a suggestion.");
      // Fills the field but doesn't submit anything — the employer reviews
      // and edits before Publish, same as if they'd typed it themselves.
      setDescription(result.suggestion);
    } catch (err: any) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-card border border-line p-6">
      <div>
        <label className="text-[13.5px] font-medium text-ink">Job title</label>
        <input
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-[13.5px] font-medium text-ink">Description</label>
          <button
            type="button"
            onClick={improveWithAI}
            disabled={aiLoading}
            className="inline-flex items-center gap-1.5 rounded-pill border border-plum-600 px-3 py-1.5 text-[12.5px] font-medium text-plum-600 hover:bg-plum-50 disabled:opacity-60"
          >
            {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            {aiLoading ? "Writing…" : "Improve with AI"}
          </button>
        </div>
        <textarea
          name="description"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a few notes, or add a title above and click Improve with AI"
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
        {aiError && <p className="mt-1.5 text-[12.5px] text-red-700">{aiError}</p>}
        <p className="mt-1.5 text-[12px] text-mist">
          AI suggestions are a starting point — review and edit before publishing.
        </p>
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
        <Field label="Salary min (₹/year)" name="salaryMin" type="number" required={false} placeholder="e.g. 800000" />
        <Field label="Salary max (₹/year)" name="salaryMax" type="number" required={false} placeholder="e.g. 1200000" />
      </div>

      <FormError error={state.error} />
      <SubmitButton>Publish job</SubmitButton>
    </form>
  );
}
