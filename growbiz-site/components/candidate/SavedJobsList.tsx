"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const DEMO_SAVED_JOBS_KEY = "growbiz_demo_saved_jobs";

type RealSavedJob = {
  job_id: string;
  jobs?: {
    title?: string | null;
  } | null;
};

type DemoSavedJob = {
  id: string;
  title: string;
  company: string;
};

function readDemoSavedJobs() {
  try {
    return JSON.parse(window.localStorage.getItem(DEMO_SAVED_JOBS_KEY) ?? "[]") as DemoSavedJob[];
  } catch {
    return [];
  }
}

export function SavedJobsList({ savedJobs }: { savedJobs: RealSavedJob[] }) {
  const [demoJobs, setDemoJobs] = useState<DemoSavedJob[]>([]);

  useEffect(() => {
    function refresh() {
      setDemoJobs(readDemoSavedJobs());
    }

    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("growbiz-demo-saved-jobs-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("growbiz-demo-saved-jobs-change", refresh);
    };
  }, []);

  const total = savedJobs.length + demoJobs.length;

  return (
    <div className="rounded-card border border-line p-5">
      <p className="text-[13px] font-medium text-mist">Saved jobs ({total})</p>
      <div className="mt-3 flex flex-col gap-2">
        {savedJobs.map((savedJob) => (
          <Link
            key={savedJob.job_id}
            href={`/jobs/${savedJob.job_id}`}
            className="text-[13.5px] font-medium text-ink hover:text-plum-600"
          >
            {savedJob.jobs?.title}
          </Link>
        ))}
        {demoJobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="text-[13.5px] font-medium text-ink hover:text-plum-600"
          >
            {job.title}
            <span className="font-normal text-mist"> · {job.company}</span>
          </Link>
        ))}
        {total === 0 && <p className="text-[13px] text-mist">No saved jobs yet.</p>}
      </div>
    </div>
  );
}
