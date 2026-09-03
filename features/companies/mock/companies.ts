import type { Company } from "@/features/companies/types";
import { mockJobs } from "@/features/jobs/mock/jobs";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const mockCompanies: Company[] = Array.from(new Set(mockJobs.map((job) => job.company))).map((name, index) => {
  const jobs = mockJobs.filter((job) => job.company === name);
  return {
    id: slugify(name),
    slug: slugify(name),
    name,
    industry: jobs[0]?.industry,
    size: index % 3 === 0 ? "Growing team" : undefined,
    locations: Array.from(new Set(jobs.map((job) => job.location))),
    verificationStatus: index % 4 === 0 ? "verified" : "pending",
    description: jobs[0]?.about,
  };
});
