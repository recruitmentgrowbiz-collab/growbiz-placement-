import type { DbJob } from "./types";
import type { Job } from "@/lib/data";

function formatLakhs(n?: number | null) {
  if (!n) return null;
  const lakhs = n / 100000;
  return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
}

function relativeTime(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

export function mapDbJobToDisplayJob(job: DbJob, screeningQuestions: string[] = []): Job {
  const min = formatLakhs(job.salary_min);
  const max = formatLakhs(job.salary_max);
  const salary = min || max ? `${min ?? ""}${min && max ? " - " : ""}${max ?? ""} / year` : undefined;

  return {
    id: job.id,
    title: job.title,
    company: job.companies?.name ?? "Company",
    industry: job.companies?.industry || "General",
    location: job.location || "Location not specified",
    mode: job.mode,
    type: job.type,
    experience: job.fresher_eligible ? "Fresher" : `${job.experience_min}+ years`,
    experienceMin: job.experience_min,
    salary,
    posted: relativeTime(job.created_at),
    tags: [],
    fresherEligible: job.fresher_eligible,
    responsibilities: job.description.split("\n").map((s) => s.trim()).filter(Boolean),
    mustHave: job.requirements,
    niceToHave: [],
    about: job.companies?.description || `${job.companies?.name ?? "This company"} is hiring via Grow Biz Jobs.`,
    screeningQuestions,
  };
}
