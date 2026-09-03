"use client";

import { ChangeEvent, useState } from "react";
import type { Resume } from "@/features/candidates/types";

export function ResumeManager({ resumes }: { resumes: Resume[] }) {
  const [selected, setSelected] = useState<File | null>(null);
  const [error, setError] = useState("");
  const current = resumes.find((resume) => resume.isCurrent);

  function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setError("");
    if (!file) return;
    if (!["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Use PDF, DOC or DOCX.");
      return;
    }
    setSelected(file);
  }

  return (
    <div>
      <h1 className="font-display text-[28px] font-bold text-ink">Resume</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-card border border-line bg-white p-6">
          <h2 className="font-display text-[20px] font-semibold text-ink">Current Resume</h2>
          {current ? <div className="mt-4 rounded-card border border-line p-4"><p className="font-medium text-ink">{current.fileName}</p><p className="mt-1 text-[13px] text-mist">Storage key: {current.storageKey}</p><p className="mt-1 text-[13px] text-mist">Uploaded {current.uploadedAt} - Not processed</p></div> : <p className="mt-4 rounded-card border border-dashed border-line p-5 text-center text-mist">No resume uploaded yet.</p>}
          <h2 className="mt-8 font-display text-[20px] font-semibold text-ink">Upload / Replace Resume</h2>
          <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-card border border-dashed border-line bg-plum-50/50 p-5 text-center text-[14px] text-mist">
            Choose PDF, DOC or DOCX
            <input type="file" accept=".pdf,.doc,.docx" onChange={onFile} className="sr-only" />
          </label>
          {selected && <p className="mt-3 text-[14px] text-ink">Selected: {selected.name} ({Math.round(selected.size / 1024)} KB)</p>}
          {error && <p className="mt-3 rounded-card bg-red-50 p-3 text-[13.5px] text-red-700">{error}</p>}
        </section>
        <aside className="rounded-card border border-line bg-white p-6">
          <h2 className="font-display text-[20px] font-semibold text-ink">Resume tips</h2>
          <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-mist"><li>- Keep file names professional.</li><li>- Use one current resume for applications.</li><li>- Resume parsing can be added later without public URLs.</li></ul>
        </aside>
      </div>
    </div>
  );
}
