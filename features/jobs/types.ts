export type JobStatus = "draft" | "published" | "paused" | "closed" | "expired";
export type JobType = "Full-time" | "Internship" | "Contract";
export type WorkMode = "On-site" | "Hybrid" | "Remote";
export type JobSort = "relevant" | "newest" | "salary_desc";
export type FreshnessFilter = "24h" | "3d" | "7d" | "30d";
export type ExperienceFilter = "fresher" | "0-2" | "2-5" | "5-10" | "10plus";

export type ScreeningQuestion = {
  id: string;
  label: string;
  type: "text" | "single_select" | "multi_select" | "boolean";
  required: boolean;
  options?: string[];
  order: number;
};

export type Job = {
  id: string;
  slug?: string;
  isDemo?: boolean;
  address?: { locality: string; region?: string; country: string };
  applicantCountries?: string[];
  salaryDetails?: { min: number; max: number; currency: string; unit: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR" };
  companyId?: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  mode: WorkMode;
  type: JobType;
  experience: string;
  experienceMin: number;
  salary?: string;
  posted: string;
  publishedAt?: string;
  expiresAt?: string;
  tags: string[];
  fresherEligible: boolean;
  responsibilities: string[];
  mustHave: string[];
  niceToHave: string[];
  about: string;
  screeningQuestions: string[];
  status?: JobStatus;
};

export type JobsQuery = {
  q?: string;
  location?: string;
  experience?: ExperienceFilter[];
  mode?: WorkMode[];
  type?: JobType[];
  industry?: string[];
  freshness?: FreshnessFilter;
  salaryMin?: number;
  sort?: JobSort;
  page?: number;
  pageSize?: number;
};

export type JobsResult = {
  items: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
