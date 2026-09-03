import type { WorkMode, JobType } from "@/features/jobs/types";

export type CandidateExperience = {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  summary?: string;
};

export type CandidateEducation = {
  id: string;
  institution: string;
  qualification: string;
  field?: string;
  startDate?: string;
  endDate?: string;
};

export type CandidatePreferences = {
  roles: string[];
  skills: string[];
  locations: string[];
  workModes: WorkMode[];
  jobTypes: JobType[];
  industries?: string[];
  salary?: { amount?: number; currency: string; period: "month" | "year" };
};

export type CandidateProfile = {
  headline?: string;
  summary?: string;
  skills: string[];
  experience: CandidateExperience[];
  education: CandidateEducation[];
  preferences: CandidatePreferences;
  visibility: "private" | "recruiter_only" | "discoverable";
};

export type Candidate = {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  profile: CandidateProfile;
  completeness: number;
};

export type Resume = {
  id: string;
  candidateId: string;
  fileName: string;
  storageKey: string;
  uploadedAt: string;
  isCurrent: boolean;
  processingStatus: "not_processed" | "processing" | "processed";
};

export type CandidateSettings = {
  discoverable: boolean;
  allowRecruiterContact: boolean;
  contactEmail: boolean;
  contactPhone: boolean;
  serviceEmails: boolean;
  marketingConsent: boolean;
};
