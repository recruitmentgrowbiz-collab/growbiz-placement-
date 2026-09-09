"use client";

import { FormEvent, useState } from "react";
import type { CandidateSettings } from "@/features/candidates/types";

export function SettingsForm({ initial }: { initial: CandidateSettings }) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  function save(event: FormEvent) { event.preventDefault(); setState("saving"); window.setTimeout(() => setState("saved"), 250); }
  return (
    <form onSubmit={save}>
      <h1 className="font-display text-[28px] font-bold text-ink">Settings</h1>
      <div className="mt-6 grid gap-5">
        <Toggle title="Profile Discoverability" text="Allow eligible verified employers/recruiters to discover your profile according to platform permissions." checked={initial.discoverable} />
        <section className="rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Recruiter Contact Preferences</h2><ToggleLine label="Allow recruiter contact" checked={initial.allowRecruiterContact} /><ToggleLine label="Email" checked={initial.contactEmail} /><ToggleLine label="Phone" checked={initial.contactPhone} /><p className="mt-3 text-[13px] text-mist">WhatsApp can be added later when approved.</p></section>
        <section className="rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Communication Preferences</h2><ToggleLine label="Service emails for applications and account activity" checked={initial.serviceEmails} /><ToggleLine label="Marketing consent" checked={initial.marketingConsent} /></section>
        <section className="rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Data & Privacy</h2><div className="mt-4 flex flex-col gap-3 sm:flex-row"><button type="button" className="min-h-11 rounded-pill border border-line px-4 text-[14px] font-medium text-ink/75">Request My Data</button><button type="button" className="min-h-11 rounded-pill border border-line px-4 text-[14px] font-medium text-ink/75">Delete Account Request</button></div></section>
        <section className="rounded-card border border-line bg-plum-50/60 p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Career Plus</h2><p className="mt-2 text-[14px] text-mist">Optional support only. It does not influence employer hiring decisions.</p></section>
      </div>
      {state === "saved" && <p className="mt-5 rounded-card bg-plum-50 p-3 text-[13.5px] text-ink/80">Saved.</p>}
      <button className="gb-button gb-button--primary mt-5 min-h-11 rounded-control bg-plum-600 px-5 text-[14.5px] font-semibold text-white">{state === "saving" ? "Saving..." : "Save Settings"}</button>
    </form>
  );
}

function Toggle({ title, text, checked }: { title: string; text: string; checked: boolean }) {
  return <section className="rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">{title}</h2><p className="mt-2 text-[14px] text-mist">{text}</p><ToggleLine label={title} checked={checked} /></section>;
}

function ToggleLine({ label, checked }: { label: string; checked: boolean }) {
  return <label className="mt-4 flex min-h-11 items-center justify-between gap-4 rounded-card border border-line px-3 text-[14px] text-ink/80"><span>{label}</span><input type="checkbox" defaultChecked={checked} className="h-4 w-4 accent-plum-600" /></label>;
}
