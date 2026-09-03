"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Briefcase, Clock, MapPin, Wallet } from "lucide-react";
import type { Job } from "@/features/jobs/types";

export function JobCard({ job, showSave = false }: { job: Job; showSave?: boolean }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group rounded-card border border-line bg-white p-5 transition-all hover:border-plum-300 hover:shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/jobs/${job.id}`} className="rounded-control font-display text-[18px] font-semibold leading-snug text-ink transition-colors hover:text-plum-700">
            {job.title}
          </Link>
          <p className="mt-1 text-[14.5px] text-mist">{job.company}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {job.fresherEligible && (
            <span className="hidden rounded-pill bg-gold-500/10 px-2.5 py-1 text-[12px] font-medium text-gold-600 xs:inline-flex">
              Fresher
            </span>
          )}
          {showSave && (
            <button
              type="button"
              aria-pressed={saved}
              aria-label={saved ? `Remove saved job ${job.title}` : `Save job ${job.title}`}
              onClick={() => setSaved((value) => !value)}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-control border transition-colors ${
                saved ? "border-plum-300 bg-plum-50 text-plum-700" : "border-line text-mist hover:border-plum-300 hover:text-plum-700"
              }`}
            >
              <Bookmark size={17} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13.5px] text-mist">
        <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" /> {job.location}</span>
        <span className="inline-flex items-center gap-1.5"><Briefcase size={14} aria-hidden="true" /> {job.mode} - {job.type}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden="true" /> {job.experience}</span>
        {job.salary && <span className="inline-flex items-center gap-1.5 font-medium text-plum-700"><Wallet size={14} aria-hidden="true" /> {job.salary}</span>}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {job.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-pill border border-line px-2.5 py-1 text-[12.5px] text-ink/70">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[13px] text-mist">{job.posted}</span>
      </div>
    </article>
  );
}
