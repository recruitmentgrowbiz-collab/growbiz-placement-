"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { CandidateEducation, CandidateExperience } from "@/features/candidates/types";

export function CandidateProfileEditor({ initial }: { initial: { name: string; email?: string; phone?: string; location?: string; headline?: string; summary?: string; skills: string[]; experience: CandidateExperience[]; education: CandidateEducation[] } }) {
  const [skills, setSkills] = useState(initial.skills);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState(initial.experience);
  const [education, setEducation] = useState(initial.education);
  const [state, setState] = useState<"idle" | "dirty" | "saving" | "saved" | "error">("idle");

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const formData = new FormData(event.currentTarget);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      setState("error");
      return;
    }

    const fullName = String(formData.get("fullName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const headline = String(formData.get("headline") ?? "").trim();
    const summary = String(formData.get("summary") ?? "").trim();

    const [{ error: profileError }, { error: candidateError }] = await Promise.all([
      supabase.from("profiles").update({ full_name: fullName, phone: phone || null }).eq("id", userData.user.id),
      supabase.from("candidates").upsert({
        user_id: userData.user.id,
        location: location || null,
        headline: headline || null,
        summary: summary || null,
        skills,
        updated_at: new Date().toISOString(),
      }),
    ]);

    setState(profileError || candidateError ? "error" : "saved");
  }

  return (
    <form onSubmit={saveProfile} onChange={() => state === "idle" && setState("dirty")} className="space-y-4 md:space-y-5">
      <section className="rounded-card border border-line bg-white p-4 shadow-soft md:p-5">
        <h2 className="font-display text-[18px] font-semibold text-ink">Basic Information</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-[13px] font-medium text-ink">Full name<input name="fullName" required defaultValue={initial.name} className="mt-1.5 min-h-11 w-full rounded-control border border-line px-3 text-[14px]" /></label>
          <label className="text-[13px] font-medium text-ink">Email<input disabled value={initial.email ?? ""} className="mt-1.5 min-h-11 w-full rounded-control border border-line bg-plum-50 px-3 text-[14px] text-ink/70" /></label>
          <label className="text-[13px] font-medium text-ink">Phone<input name="phone" defaultValue={initial.phone} className="mt-1.5 min-h-11 w-full rounded-control border border-line px-3 text-[14px]" /></label>
          <label className="text-[13px] font-medium text-ink">Location<input name="location" defaultValue={initial.location} placeholder="Add your location" className="mt-1.5 min-h-11 w-full rounded-control border border-line px-3 text-[14px]" /></label>
          <label className="text-[13px] font-medium text-ink sm:col-span-2">Professional headline<input name="headline" defaultValue={initial.headline} placeholder="Add your current role or target role" className="mt-1.5 min-h-11 w-full rounded-control border border-line px-3 text-[14px]" /></label>
        </div>
      </section>
      <section className="rounded-card border border-line bg-white p-4 shadow-soft md:p-5">
        <h2 className="font-display text-[18px] font-semibold text-ink">About / Summary</h2>
        <textarea name="summary" defaultValue={initial.summary} maxLength={600} rows={4} placeholder="Add a short professional summary" className="mt-4 w-full rounded-control border border-line px-3 py-2 text-[14px]" />
        <p className="mt-2 text-[12.5px] text-mist">Keep this concise. Future resume assistance can use this section later.</p>
      </section>
      <EditableList title="Experience" empty="No experience added yet." items={experience.map((e) => ({ title: e.title, meta: `${e.company}${e.startDate ? ` · ${e.startDate}` : ""}${e.endDate ? ` - ${e.endDate}` : ""}` }))} onAdd={() => setExperience([...experience, { id: crypto.randomUUID(), company: "", title: "", startDate: "" }])} onRemove={(i) => setExperience(experience.filter((_, index) => index !== i))} />
      <EditableList title="Education" empty="Add your education." items={education.map((e) => ({ title: e.qualification || "Qualification", meta: `${e.institution}${e.endDate ? ` · ${e.endDate}` : ""}` }))} onAdd={() => setEducation([...education, { id: crypto.randomUUID(), institution: "", qualification: "" }])} onRemove={(i) => setEducation(education.filter((_, index) => index !== i))} />
      <section className="rounded-card border border-line bg-white p-4 shadow-soft md:p-5">
        <h2 className="font-display text-[18px] font-semibold text-ink">Skills</h2>
        <div className="mt-4 grid gap-2 xs:grid-cols-[1fr_auto]">
          <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add skills" className="min-h-11 w-full rounded-control border border-line px-3 text-[14px]" />
          <button type="button" onClick={() => { if (skillInput.trim()) setSkills([...skills, skillInput.trim()]); setSkillInput(""); }} className="gb-button gb-button--primary min-h-11 whitespace-nowrap rounded-control bg-plum-600 px-4 text-[14px] font-semibold text-white">Add skill</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{skills.length ? skills.map((skill) => <button type="button" key={skill} onClick={() => setSkills(skills.filter((s) => s !== skill))} className="inline-flex min-h-9 items-center gap-1.5 rounded-pill border border-line bg-plum-50 px-3 text-[13px] text-ink/75">{skill}<X size={13} aria-hidden="true" /></button>) : <p className="rounded-card border border-dashed border-line p-4 text-center text-[14px] text-mist">Add skills</p>}</div>
      </section>
      {state === "saved" && <p className="rounded-card bg-plum-50 p-3 text-[13.5px] text-ink/80">Saved.</p>}
      {state === "error" && <p className="rounded-card bg-red-50 p-3 text-[13.5px] text-red-700">Could not save. Please try again.</p>}
      <button className="gb-button gb-button--primary min-h-11 rounded-control bg-plum-600 px-5 text-[14.5px] font-semibold text-white">{state === "saving" ? "Saving..." : "Save Profile"}</button>
    </form>
  );
}

function EditableList({ title, empty, items, onAdd, onRemove }: { title: string; empty: string; items: { title: string; meta: string }[]; onAdd: () => void; onRemove: (index: number) => void }) {
  return <section className="rounded-card border border-line bg-white p-4 shadow-soft md:p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-display text-[18px] font-semibold text-ink">{title}</h2><button type="button" onClick={onAdd} className="gb-button gb-button--secondary min-h-10 whitespace-nowrap rounded-control border border-plum-600 bg-white px-3 text-[13.5px] font-semibold text-plum-600">Add {title}</button></div>{items.length ? <div className="mt-4 grid gap-2.5">{items.map((item, index) => <div key={`${item.title}-${index}`} className="flex items-center justify-between gap-3 rounded-card border border-line p-3"><div className="min-w-0"><p className="truncate text-[14px] font-medium text-ink">{item.title || `New ${title.toLowerCase()}`}</p><p className="mt-0.5 truncate text-[12.5px] text-mist">{item.meta || "Details not added"}</p></div><button type="button" onClick={() => onRemove(index)} className="min-h-9 shrink-0 rounded-control px-2 text-[13px] font-medium text-red-600 hover:bg-red-50">Remove</button></div>)}</div> : <p className="mt-4 rounded-card border border-dashed border-line p-4 text-center text-[14px] text-mist">{empty}</p>}</section>;
}
