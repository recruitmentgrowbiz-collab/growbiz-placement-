import { mockJobs } from "@/features/jobs/mock/jobs";
import type { JobsQuery, JobsResult } from "@/features/jobs/types";
import { filterJobs, paginateJobs, sortJobs } from "@/features/jobs/utils/filters";

export async function getJobs(query: JobsQuery = {}): Promise<JobsResult> {
  const pageSize = query.pageSize ?? 8;
  const filtered = filterJobs(mockJobs, query);
  const sorted = sortJobs(filtered, query.sort);
  const paged = paginateJobs(sorted, query.page ?? 1, pageSize);
  return {
    items: paged.items,
    total: filtered.length,
    page: paged.page,
    pageSize,
    totalPages: paged.totalPages,
  };
}

export async function getFeaturedJobs(limit = 6) {
  return mockJobs.slice(0, limit);
}

export async function getAllJobs() {
  return mockJobs;
}

export async function getJobBySlug(slug: string) {
  return mockJobs.find((job) => job.id === slug) ?? null;
}

export async function getRelatedJobs(jobId: string, limit = 4) {
  const job = mockJobs.find((item) => item.id === jobId);
  if (!job) return [];
  return mockJobs
    .filter((item) => item.id !== job.id)
    .filter((item) => item.industry === job.industry || item.location === job.location || item.tags.some((tag) => job.tags.includes(tag)))
    .slice(0, limit);
}
