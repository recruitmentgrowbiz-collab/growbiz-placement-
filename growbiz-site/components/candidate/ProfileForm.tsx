"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Candidate } from "@/lib/supabase/types";

type SaveState = "idle" | "saving" | "saved";

export type CandidateExperience = {
  id: string;
  candidate_id: string;
  company: string;
  title: string;
  start_date: string | null;
  end_date: string | null;
  summary: string | null;
};

export type CandidateEducation = {
  id: string;
  candidate_id: string;
  institution: string;
  qualification: string | null;
  field: string | null;
  start_date: string | null;
  end_date: string | null;
};

function SectionStatus({ state, error }: { state: SaveState; error: string | null }) {
  if (error) return <p className="text-[12.5px] text-red-700">{error}</p>;
  if (state === "saved") return <p className="text-[12.5px] font-medium text-plum-700">Saved</p>;
  return null;
}

export function ProfileForm({
  userId,
  initial,
  initialExperience = [],
  initialEducation = [],
}: {
  userId: string;
  initial: Candidate | null;
  initialExperience?: CandidateExperience[];
  initialEducation?: CandidateEducation[];
}) {
  const [headline, setHeadline] = useState(initial?.headline ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [salary, setSalary] = useState(initial?.salary_expectation ?? "");
  const [discoverable, setDiscoverable] = useState(initial?.discoverable ?? true);
  const [skills, setSkills] = useState((initial?.skills ?? []).join(", "));
  const [resumeName, setResumeName] = useState(initial?.resume_filename ?? "");
  const [resumePath, setResumePath] = useState(initial?.resume_url ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [experience, setExperience] = useState(initialExperience);
  const [education, setEducation] = useState(initialEducation);
  const [basicState, setBasicState] = useState<SaveState>("idle");
  const [skillsState, setSkillsState] = useState<SaveState>("idle");
  const [resumeState, setResumeState] = useState<SaveState>("idle");
  const [experienceState, setExperienceState] = useState<SaveState>("idle");
  const [educationState, setEducationState] = useState<SaveState>("idle");
  const [basicError, setBasicError] = useState<string | null>(null);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [experienceError, setExperienceError] = useState<string | null>(null);
  const [educationError, setEducationError] = useState<string | null>(null);

  function markSaved(setter: (state: SaveState) => void) {
    setter("saved");
    setTimeout(() => setter("idle"), 2500);
  }

  async function saveCandidateFields(fields: Record<string, unknown>) {
    const supabase = createClient();
    return supabase.from("candidates").upsert({
      user_id: userId,
      ...fields,
      updated_at: new Date().toISOString(),
    });
  }

  async function saveBasic(e: FormEvent) {
    e.preventDefault();
    setBasicState("saving");
    setBasicError(null);
    const { error } = await saveCandidateFields({
      headline,
      summary,
      location,
      salary_expectation: salary,
      discoverable,
    });
    if (error) {
      setBasicError(error.message);
      setBasicState("idle");
      return;
    }
    markSaved(setBasicState);
  }

  async function saveSkills(e: FormEvent) {
    e.preventDefault();
    setSkillsState("saving");
    setSkillsError(null);
    const { error } = await saveCandidateFields({
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    if (error) {
      setSkillsError(error.message);
      setSkillsState("idle");
      return;
    }
    markSaved(setSkillsState);
  }

  async function saveResume(e: FormEvent) {
    e.preventDefault();
    if (!file) {
      setResumeError("Choose a resume file first.");
      return;
    }
    setResumeState("saving");
    setResumeError(null);
    const supabase = createClient();
    const path = `${userId}/${file.name}`;
    const { error: uploadError } = await supabase.storage.from("resumes").upload(path, file, { upsert: true });
    if (uploadError) {
      setResumeError(uploadError.message);
      setResumeState("idle");
      return;
    }
    const { error } = await saveCandidateFields({
      resume_url: path,
      resume_filename: file.name,
    });
    if (error) {
      setResumeError(error.message);
      setResumeState("idle");
      return;
    }
    setResumeName(file.name);
    setResumePath(path);
    setFile(null);
    markSaved(setResumeState);
  }

  async function removeResume() {
    if (!resumePath && !resumeName) return;
    setResumeState("saving");
    setResumeError(null);
    const supabase = createClient();

    if (resumePath) {
      const { error: removeError } = await supabase.storage.from("resumes").remove([resumePath]);
      if (removeError) {
        setResumeError(removeError.message);
        setResumeState("idle");
        return;
      }
    }

    const { error } = await saveCandidateFields({
      resume_url: null,
      resume_filename: null,
    });
    if (error) {
      setResumeError(error.message);
      setResumeState("idle");
      return;
    }

    setFile(null);
    setResumeName("");
    setResumePath("");
    markSaved(setResumeState);
  }

  async function addExperience(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setExperienceState("saving");
    setExperienceError(null);
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("candidate_experience")
      .insert({
        candidate_id: userId,
        title: String(formData.get("title") ?? ""),
        company: String(formData.get("company") ?? ""),
        start_date: String(formData.get("startDate") ?? "") || null,
        end_date: String(formData.get("endDate") ?? "") || null,
        summary: String(formData.get("summary") ?? "") || null,
      })
      .select("*")
      .single();
    if (error) {
      setExperienceError(error.message);
      setExperienceState("idle");
      return;
    }
    setExperience((items) => [data as CandidateExperience, ...items]);
    e.currentTarget.reset();
    markSaved(setExperienceState);
  }

  async function addEducation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEducationState("saving");
    setEducationError(null);
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("candidate_education")
      .insert({
        candidate_id: userId,
        institution: String(formData.get("institution") ?? ""),
        qualification: String(formData.get("qualification") ?? "") || null,
        field: String(formData.get("field") ?? "") || null,
        start_date: String(formData.get("startDate") ?? "") || null,
        end_date: String(formData.get("endDate") ?? "") || null,
      })
      .select("*")
      .single();
    if (error) {
      setEducationError(error.message);
      setEducationState("idle");
      return;
    }
    setEducation((items) => [data as CandidateEducation, ...items]);
    e.currentTarget.reset();
    markSaved(setEducationState);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={saveBasic} className="rounded-card border border-line p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-[15.5px] font-semibold text-ink">Headline & basics</h3>
          <SectionStatus state={basicState} error={basicError} />
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label className="text-[13.5px] font-medium text-ink">Headline</label>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Backend Engineer, 3 years"
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[13.5px] font-medium text-ink">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[13.5px] font-medium text-ink">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[13.5px] font-medium text-ink">Salary expectation</label>
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. Rs. 8L - Rs. 10L / year"
                className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-[14px] text-ink/80">
            <input
              type="checkbox"
              checked={discoverable}
              onChange={(e) => setDiscoverable(e.target.checked)}
              className="h-4 w-4 rounded border-line accent-plum-600"
            />
            Let verified employers find my profile in candidate search
          </label>
          <button
            type="submit"
            disabled={basicState === "saving"}
            className="w-fit rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
          >
            {basicState === "saving" ? "Saving..." : "Save basics"}
          </button>
        </div>
      </form>

      <form onSubmit={saveSkills} className="rounded-card border border-line p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-[15.5px] font-semibold text-ink">Skills</h3>
          <SectionStatus state={skillsState} error={skillsError} />
        </div>
        <label className="mt-4 block text-[13.5px] font-medium text-ink">Skills (comma separated)</label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Node.js, PostgreSQL, AWS"
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={skillsState === "saving"}
          className="mt-4 w-fit rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
        >
          {skillsState === "saving" ? "Saving..." : "Save skills"}
        </button>
      </form>

      <form onSubmit={addExperience} className="rounded-card border border-line p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-[15.5px] font-semibold text-ink">Work experience</h3>
          <SectionStatus state={experienceState} error={experienceError} />
        </div>
        {experience.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {experience.map((item) => (
              <div key={item.id} className="rounded-lg bg-plum-50/60 px-3 py-2.5">
                <p className="text-[13.5px] font-medium text-ink">
                  {item.title} at {item.company}
                </p>
                {item.summary && <p className="mt-1 text-[12.5px] text-mist">{item.summary}</p>}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="title" required placeholder="Job title" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
          <input name="company" required placeholder="Company" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
          <input name="startDate" type="date" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
          <input name="endDate" type="date" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
        </div>
        <textarea name="summary" rows={2} placeholder="What did you work on?" className="mt-4 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
        <button type="submit" disabled={experienceState === "saving"} className="mt-4 w-fit rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60">
          {experienceState === "saving" ? "Saving..." : "Add experience"}
        </button>
      </form>

      <form onSubmit={addEducation} className="rounded-card border border-line p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-[15.5px] font-semibold text-ink">Education</h3>
          <SectionStatus state={educationState} error={educationError} />
        </div>
        {education.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {education.map((item) => (
              <div key={item.id} className="rounded-lg bg-plum-50/60 px-3 py-2.5">
                <p className="text-[13.5px] font-medium text-ink">{item.institution}</p>
                <p className="mt-1 text-[12.5px] text-mist">
                  {[item.qualification, item.field].filter(Boolean).join(" | ") || "Education"}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input name="institution" required placeholder="Institution" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
          <input name="qualification" placeholder="Qualification" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
          <input name="field" placeholder="Field of study" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
          <div className="grid gap-4 sm:grid-cols-2">
            <input name="startDate" type="date" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
            <input name="endDate" type="date" className="rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none" />
          </div>
        </div>
        <button type="submit" disabled={educationState === "saving"} className="mt-4 w-fit rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60">
          {educationState === "saving" ? "Saving..." : "Add education"}
        </button>
      </form>

      <form onSubmit={saveResume} className="rounded-card border border-line p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-[15.5px] font-semibold text-ink">Resume</h3>
          <SectionStatus state={resumeState} error={resumeError} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300">
            Choose file
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
          <span className="text-[13px] text-mist">{file?.name || resumeName || "No file uploaded yet"}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="submit" disabled={resumeState === "saving"} className="w-fit rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60">
            {resumeState === "saving" ? "Uploading..." : "Save resume"}
          </button>
          {(resumeName || resumePath) && (
            <button
              type="button"
              onClick={removeResume}
              disabled={resumeState === "saving"}
              className="w-fit rounded-pill border border-line px-5 py-2.5 text-[14.5px] font-medium text-ink/70 hover:border-plum-300 disabled:opacity-60"
            >
              Remove resume
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
