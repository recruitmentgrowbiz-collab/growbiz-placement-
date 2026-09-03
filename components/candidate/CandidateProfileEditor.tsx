"use client";

import { FormEvent, useState } from "react";
import type { CandidateEducation, CandidateExperience } from "@/features/candidates/types";

export function CandidateProfileEditor({ initial }: { initial: { name: string; email?: string; phone?: string; location?: string; headline?: string; summary?: string; skills: string[]; experience: CandidateExperience[]; education: CandidateEducation[] } }) {
  const [skills, setSkills] = useState(initial.skills);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState(initial.experience);
  const [education, setEducation] = useState(initial.education);
  const [state, setState] = useState<"idle" | "dirty" | "saving" | "saved" | "error">("idle");

  function mockSave(event: FormEvent) {
    event.preventDefault();
    setState("saving");
    window.setTimeout(() => setState("saved"), 250);
  }

  return (
    <form onSubmit={mockSave} onChange={() => state === "idle" && setState("dirty")} className="space-y-6">
      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="font-display text-[20px] font-semibold text-ink">Basic Information</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-[13.5px] font-medium text-ink">Full name<input required defaultValue={initial.name} className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px]" /></label>
          <label className="text-[13.5px] font-medium text-ink">Email<input disabled value={initial.email ?? ""} className="mt-1.5 min-h-11 w-full rounded-card border border-line bg-plum-50 px-3 text-[14.5px]" /></label>
          <label className="text-[13.5px] font-medium text-ink">Phone<input defaultValue={initial.phone} className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px]" /></label>
          <label className="text-[13.5px] font-medium text-ink">Location<input defaultValue={initial.location} className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px]" /></label>
          <label className="text-[13.5px] font-medium text-ink sm:col-span-2">Professional Headline<input defaultValue={initial.headline} className="mt-1.5 min-h-11 w-full rounded-card border border-line px-3 text-[14.5px]" /></label>
        </div>
      </section>
      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="font-display text-[20px] font-semibold text-ink">About / Summary</h2>
        <textarea defaultValue={initial.summary} maxLength={600} rows={5} className="mt-4 w-full rounded-card border border-line px-3 py-2 text-[14.5px]" />
        <p className="mt-2 text-[12.5px] text-mist">Keep this concise. Future resume assistance can use this section later.</p>
      </section>
      <EditableList title="Experience" items={experience.map((e) => `${e.title} at ${e.company}`)} onAdd={() => setExperience([...experience, { id: crypto.randomUUID(), company: "Company name", title: "Job title", startDate: "" }])} onRemove={(i) => setExperience(experience.filter((_, index) => index !== i))} />
      <EditableList title="Education" items={education.map((e) => `${e.qualification} - ${e.institution}`)} onAdd={() => setEducation([...education, { id: crypto.randomUUID(), institution: "Institution", qualification: "Qualification" }])} onRemove={(i) => setEducation(education.filter((_, index) => index !== i))} />
      <section className="rounded-card border border-line bg-white p-6">
        <h2 className="font-display text-[20px] font-semibold text-ink">Skills</h2>
        <div className="mt-4 flex gap-2"><input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} className="min-h-11 flex-1 rounded-card border border-line px-3 text-[14.5px]" /><button type="button" onClick={() => { if (skillInput.trim()) setSkills([...skills, skillInput.trim()]); setSkillInput(""); }} className="min-h-11 rounded-pill bg-plum-600 px-4 text-[14px] font-medium text-white">Add skill</button></div>
        <div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <button type="button" key={skill} onClick={() => setSkills(skills.filter((s) => s !== skill))} className="rounded-pill border border-line px-3 py-1.5 text-[13px] text-ink/75">{skill} x</button>)}</div>
      </section>
      {state === "saved" && <p className="rounded-card bg-plum-50 p-3 text-[13.5px] text-ink/80">Saved in frontend mock state. Backend persistence is not connected yet.</p>}
      <button className="min-h-11 rounded-pill bg-plum-600 px-5 text-[14.5px] font-medium text-white">{state === "saving" ? "Saving..." : "Save Profile"}</button>
    </form>
  );
}

function EditableList({ title, items, onAdd, onRemove }: { title: string; items: string[]; onAdd: () => void; onRemove: (index: number) => void }) {
  return <section className="rounded-card border border-line bg-white p-6"><div className="flex items-center justify-between gap-4"><h2 className="font-display text-[20px] font-semibold text-ink">{title}</h2><button type="button" onClick={onAdd} className="min-h-10 rounded-pill border border-plum-600 px-4 text-[13.5px] font-medium text-plum-600">Add {title}</button></div>{items.length ? <div className="mt-4 grid gap-3">{items.map((item, index) => <div key={`${item}-${index}`} className="flex items-center justify-between gap-3 rounded-card border border-line p-4"><p className="text-[14.5px] text-ink/80">{item}</p><button type="button" onClick={() => onRemove(index)} className="text-[13px] font-medium text-plum-600">Remove</button></div>)}</div> : <p className="mt-4 rounded-card border border-dashed border-line p-5 text-center text-[14px] text-mist">No {title.toLowerCase()} added yet.</p>}</section>;
}
