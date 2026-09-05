"use client";

import { useState, FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Candidate } from "@/lib/supabase/types";

export function ProfileForm({ userId, initial }: { userId: string; initial: Candidate | null }) {
  const [headline, setHeadline] = useState(initial?.headline ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [skills, setSkills] = useState((initial?.skills ?? []).join(", "));
  const [salary, setSalary] = useState(initial?.salary_expectation ?? "");
  const [discoverable, setDiscoverable] = useState(initial?.discoverable ?? true);
  const [resumeName, setResumeName] = useState(initial?.resume_filename ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();

    let resume_url = initial?.resume_url ?? null;
    let resume_filename = initial?.resume_filename ?? null;

    if (file) {
      const path = `${userId}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(path, file, { upsert: true });
      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      resume_url = path;
      resume_filename = file.name;
    }

    const { error: upsertError } = await supabase.from("candidates").upsert({
      user_id: userId,
      headline,
      summary,
      location,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      salary_expectation: salary,
      discoverable,
      resume_url,
      resume_filename,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    if (upsertError) {
      setError(upsertError.message);
    } else {
      setResumeName(resume_filename ?? "");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-card border border-line p-6">
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
            placeholder="e.g. ₹8L - ₹10L / year"
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="text-[13.5px] font-medium text-ink">Skills (comma separated)</label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Node.js, PostgreSQL, AWS"
          className="mt-1.5 w-full rounded-lg border border-line px-3 py-2.5 text-[14.5px] focus:border-plum-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="text-[13.5px] font-medium text-ink">Resume</label>
        <div className="mt-1.5 flex items-center gap-3">
          <label className="cursor-pointer rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/80 hover:border-plum-300">
            Choose file
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <span className="text-[13px] text-mist">{file?.name || resumeName || "No file uploaded yet"}</span>
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

      {error && <p className="rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-1 w-fit rounded-pill bg-plum-600 px-5 py-2.5 text-[14.5px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save profile"}
      </button>
    </form>
  );
}
