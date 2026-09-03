"use client";

import { FormEvent, useState } from "react";
import type { CandidatePreferences } from "@/features/candidates/types";

export function PreferencesForm({ initial }: { initial: CandidatePreferences }) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  function save(event: FormEvent) { event.preventDefault(); setState("saving"); window.setTimeout(() => setState("saved"), 250); }
  return (
    <form onSubmit={save}>
      <h1 className="font-display text-[28px] font-bold text-ink">Preferences</h1>
      <div className="mt-6 grid gap-5">
        <Field label="Target Roles" value={initial.roles.join(", ")} />
        <Field label="Preferred Locations" value={initial.locations.join(", ")} />
        <Field label="Skills" value={initial.skills.join(", ")} />
        <fieldset className="rounded-card border border-line bg-white p-5"><legend className="font-display text-[18px] font-semibold text-ink">Work Mode</legend><CheckGroup values={["Remote", "Hybrid", "On-site"]} selected={initial.workModes} /></fieldset>
        <fieldset className="rounded-card border border-line bg-white p-5"><legend className="font-display text-[18px] font-semibold text-ink">Job Type</legend><CheckGroup values={["Full-time", "Part-time", "Contract", "Internship"]} selected={initial.jobTypes} /></fieldset>
        <Field label="Industries" value={initial.industries?.join(", ") ?? ""} />
        <section className="rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Salary Expectation</h2><div className="mt-4 grid gap-4 sm:grid-cols-3"><label className="text-[13.5px] font-medium text-ink">Amount<input defaultValue={initial.salary?.amount} type="number" className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3" /></label><label className="text-[13.5px] font-medium text-ink">Currency<input defaultValue={initial.salary?.currency ?? "INR"} className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3" /></label><label className="text-[13.5px] font-medium text-ink">Period<select defaultValue={initial.salary?.period ?? "year"} className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3"><option value="year">Year</option><option value="month">Month</option></select></label></div></section>
      </div>
      {state === "saved" && <p className="mt-5 rounded-card bg-plum-50 p-3 text-[13.5px] text-ink/80">Saved in frontend mock state. Backend persistence is not connected yet.</p>}
      <button className="mt-5 min-h-11 rounded-pill bg-plum-600 px-5 text-[14.5px] font-medium text-white">{state === "saving" ? "Saving..." : "Save Preferences"}</button>
    </form>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <label className="rounded-card border border-line bg-white p-5 text-[13.5px] font-medium text-ink">{label}<input defaultValue={value} className="mt-2 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px]" /></label>;
}

function CheckGroup({ values, selected }: { values: string[]; selected: readonly string[] }) {
  return <div className="mt-4 grid gap-2 sm:grid-cols-2">{values.map((value) => <label key={value} className="flex min-h-11 items-center gap-2 rounded-card border border-line px-3 text-[14px] text-ink/75"><input type="checkbox" defaultChecked={selected.includes(value)} className="accent-plum-600" />{value}</label>)}</div>;
}
