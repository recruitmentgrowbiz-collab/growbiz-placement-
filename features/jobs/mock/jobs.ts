import { jobs } from "@/lib/data";

export const mockJobs = jobs.map(job => ({ ...job, isDemo: true }));
