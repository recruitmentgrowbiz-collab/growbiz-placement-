export type UserRole = "candidate" | "employer" | "recruiter" | "admin";
export type VerificationStatus = "pending" | "verified" | "rejected" | "needs_review";
export type JobStatus = "draft" | "published" | "paused" | "closed" | "expired";
export type ApplicationStage = "applied" | "shortlisted" | "interview" | "offer" | "hired" | "rejected";

export type Profile = {
  id: string;
  role: UserRole;
  status: string;
  full_name: string | null;
  created_at: string;
};

export type Candidate = {
  user_id: string;
  headline: string | null;
  summary: string | null;
  location: string | null;
  skills: string[];
  salary_expectation: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  discoverable: boolean;
  marketing_consent: boolean;
  updated_at: string;
};

export type Company = {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  size: string | null;
  locations: string[];
  description: string | null;
  logo_url: string | null;
  verification_status: VerificationStatus;
  verification_notes: string | null;
  created_at: string;
};

export type DbJob = {
  id: string;
  company_id: string;
  owner_id: string;
  title: string;
  description: string;
  requirements: string[];
  salary_min: number | null;
  salary_max: number | null;
  location: string | null;
  mode: "On-site" | "Hybrid" | "Remote";
  type: "Full-time" | "Internship" | "Contract";
  experience_min: number;
  fresher_eligible: boolean;
  status: JobStatus;
  expires_at: string | null;
  created_at: string;
  companies?: Company;
};

export type DbApplication = {
  id: string;
  candidate_id: string;
  job_id: string;
  stage: ApplicationStage;
  answers: Record<string, string>;
  source: string;
  created_at: string;
  jobs?: DbJob;
  candidates?: Candidate & { profiles?: Profile };
};

export type Membership = {
  id: string;
  company_id: string;
  plan: string;
  billing: string;
  active_jobs_limit: number;
  candidate_unlocks_limit: number;
  status: string;
  started_at: string;
  ends_at: string | null;
};
