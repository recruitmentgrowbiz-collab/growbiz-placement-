import type { ApplicationStage } from "@/features/applications/types";
import type { Company, CompanyUser } from "@/features/companies/types";
import type { Job, JobStatus } from "@/features/jobs/types";
import type { MembershipPlan } from "@/features/memberships/types";

export type EmployerPermission = {
  canManageJobs: boolean;
  canEditApplicants: boolean;
  canSearchCandidates: boolean;
  canManageTeam: boolean;
  canManageMembership: boolean;
  canViewReports: boolean;
};

export type EmployerApplicant = {
  id: string;
  candidateName: string;
  headline: string;
  experience: string;
  location: string;
  jobId: string;
  appliedAt: string;
  stage: ApplicationStage;
  tags: string[];
  owner: string;
  resumeStorageKey?: string;
  answers: Record<string, string>;
  internalNotes: string[];
};

export type EmployerInterview = {
  id: string;
  applicantId: string;
  jobId: string;
  scheduledAt: string;
  mode: "Video" | "Phone" | "In-person";
  status: "scheduled" | "completed" | "cancelled";
  attendees: string[];
  feedback?: string;
};

export type CandidateUnlock = {
  id: string;
  candidateId: string;
  reason: string;
  timestamp: string;
};

export type RecruitmentRequest = {
  id: string;
  role: string;
  hires: string;
  location: string;
  timeline: string;
  status: "Submitted" | "Under Review" | "Requirement Calibration" | "Sourcing" | "Shortlisting" | "Interview Coordination" | "Closed";
};

export type EmployerWorkspace = {
  currentEmployerCompany: Company;
  currentEmployerUser: CompanyUser;
  employerRole: "employer_owner" | "employer_admin" | "employer_recruiter" | "employer_viewer";
  permissions: EmployerPermission;
  plan: MembershipPlan;
};
