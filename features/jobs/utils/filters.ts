import { isActiveJob } from "@/features/jobs/utils/lifecycle";
import type { ExperienceFilter, FreshnessFilter, Job, JobsQuery, JobSort, JobType, WorkMode } from "@/features/jobs/types";

export const WORK_MODES: WorkMode[] = ["Remote", "Hybrid", "On-site"];
export const JOB_TYPES: JobType[] = ["Full-time", "Contract", "Internship"];

export const EXPERIENCE_OPTIONS: { label: string; value: ExperienceFilter }[] = [
  { label: "Fresher", value: "fresher" },
  { label: "0-2 years", value: "0-2" },
  { label: "2-5 years", value: "2-5" },
  { label: "5-10 years", value: "5-10" },
  { label: "10+ years", value: "10plus" },
];

export const FRESHNESS_OPTIONS: { label: string; value: FreshnessFilter }[] = [
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 3 days", value: "3d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

export const SORT_OPTIONS: { label: string; value: JobSort }[] = [
  { label: "Most Relevant", value: "relevant" },
  { label: "Newest", value: "newest" },
  { label: "Salary: High to Low", value: "salary_desc" },
];

export function normalize(value = "") {
  return value.trim().toLowerCase();
}

export function parseList<T extends string>(value: string | string[] | undefined, allowed: readonly T[]) {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is T => allowed.includes(item as T));
}

export function parseJobsQuery(params: Record<string, string | string[] | undefined>): JobsQuery {
  const page = Number(Array.isArray(params.page) ? params.page[0] : params.page);
  const salaryMin = Number(Array.isArray(params.salaryMin) ? params.salaryMin[0] : params.salaryMin);
  const sort = parseList(params.sort, SORT_OPTIONS.map((o) => o.value))[0];
  const freshness = parseList(params.freshness, FRESHNESS_OPTIONS.map((o) => o.value))[0];

  const experience = parseList(params.experience, EXPERIENCE_OPTIONS.map((o) => o.value));
  if (first(params.fresher) === "true" && !experience.includes("fresher")) experience.push("fresher");

  return {
    q: first(params.q),
    location: first(params.location),
    experience,
    mode: parseList(params.mode, WORK_MODES),
    type: parseList(params.type, JOB_TYPES),
    industry: parseRawList(params.industry),
    freshness,
    salaryMin: Number.isFinite(salaryMin) && salaryMin > 0 ? salaryMin : undefined,
    sort: sort ?? "relevant",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 8,
  };
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseRawList(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}

export function filterJobs(jobs: Job[], query: JobsQuery) {
  const q = normalize(query.q);
  const location = normalize(query.location);
  return jobs.filter((job) => {
    if (!isActiveJob(job)) return false;
    if (q) {
      const haystack = normalize([job.title, job.company, job.industry, ...job.tags].join(" "));
      if (!haystack.includes(q)) return false;
    }
    if (location && !normalize(job.location).includes(location)) return false;
    if (query.mode?.length && !query.mode.includes(job.mode)) return false;
    if (query.type?.length && !query.type.includes(job.type)) return false;
    if (query.industry?.length && !query.industry.includes(job.industry)) return false;
    if (query.experience?.length && !query.experience.some((range) => matchesExperience(job, range))) return false;
    if (query.freshness && postedDays(job.posted) > freshnessDays(query.freshness)) return false;
    if (query.salaryMin && salaryHigh(job.salary) < query.salaryMin) return false;
    return true;
  });
}

export function sortJobs(jobs: Job[], sort: JobSort = "relevant") {
  return [...jobs].sort((a, b) => {
    if (sort === "newest") return postedDays(a.posted) - postedDays(b.posted);
    if (sort === "salary_desc") return salaryHigh(b.salary) - salaryHigh(a.salary);
    return Number(b.fresherEligible) - Number(a.fresherEligible) || postedDays(a.posted) - postedDays(b.posted);
  });
}

export function paginateJobs(jobs: Job[], page = 1, pageSize = 8) {
  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: jobs.slice(start, start + pageSize), page: safePage, totalPages };
}

export function getFilterOptions(jobs: Job[]) {
  return {
    industries: Array.from(new Set(jobs.map((job) => job.industry))).sort(),
  };
}

export function salaryHigh(salary?: string) {
  if (!salary) return 0;
  const lakhs = [...salary.matchAll(/(\d+(?:\.\d+)?)\s*L/gi)].map((m) => Number(m[1]) * 100000);
  if (lakhs.length) return Math.max(...lakhs);
  const thousands = [...salary.matchAll(/(\d{2,})/g)].map((m) => Number(m[1].replace(/,/g, "")));
  return thousands.length ? Math.max(...thousands) : 0;
}

export function postedDays(posted: string) {
  const text = normalize(posted);
  if (text.includes("today") || text.includes("hour")) return 0;
  const match = text.match(/(\d+)/);
  if (!match) return 30;
  if (text.includes("week")) return Number(match[1]) * 7;
  return Number(match[1]);
}

function freshnessDays(freshness: FreshnessFilter) {
  return freshness === "24h" ? 1 : freshness === "3d" ? 3 : freshness === "7d" ? 7 : 30;
}

function matchesExperience(job: Job, range: ExperienceFilter) {
  if (range === "fresher") return job.fresherEligible || job.experienceMin === 0;
  if (range === "0-2") return job.experienceMin <= 2;
  if (range === "2-5") return job.experienceMin >= 2 && job.experienceMin <= 5;
  if (range === "5-10") return job.experienceMin >= 5 && job.experienceMin <= 10;
  return job.experienceMin >= 10;
}
