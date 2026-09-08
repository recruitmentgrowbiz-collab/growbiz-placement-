import type { Job } from "@/features/jobs/types";

export function isActiveJob(job: Job, now = Date.now()) {
  if ((job.status ?? "published") !== "published") return false;
  if (job.publishedAt && (!Number.isFinite(Date.parse(job.publishedAt)) || Date.parse(job.publishedAt) > now)) return false;
  return !job.expiresAt || (Number.isFinite(Date.parse(job.expiresAt)) && Date.parse(job.expiresAt) > now);
}

export function isPublicJob(job: Job) {
  return job.status !== "draft" && job.status !== "paused";
}
