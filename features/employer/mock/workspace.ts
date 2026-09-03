import { mockCompanies } from "@/features/companies/mock/companies";
import { mockJobs } from "@/features/jobs/mock/jobs";
import { employerMembershipPlans } from "@/features/memberships/mock/plans";
import type { EmployerApplicant, EmployerInterview, EmployerPermission, RecruitmentRequest } from "@/features/employer/types";

export const employerCompany = { ...mockCompanies[0], verificationStatus: "verified" as const, logoStorageKey: "companies/northbridge/logo.webp" };

export const employerUser = {
  id: "company-user-1",
  companyId: employerCompany.id,
  userId: "user-employer-1",
  role: "owner" as const,
  status: "active" as const,
};

export const employerPermissions: EmployerPermission = {
  canManageJobs: true,
  canEditApplicants: true,
  canSearchCandidates: true,
  canManageTeam: true,
  canManageMembership: true,
  canViewReports: true,
};

export const employerJobs = mockJobs.slice(0, 5).map((job, index) => ({
  ...job,
  companyId: employerCompany.id,
  status: (["published", "published", "draft", "paused", "closed"] as const)[index],
  publishedAt: index < 2 ? "2026-08-20" : undefined,
  expiresAt: "2026-10-20",
}));

export const applicants: EmployerApplicant[] = [
  { id: "applicant-1", candidateName: "Rohit Sharma", headline: "Backend Engineer", experience: "3 years", location: "Bengaluru", jobId: employerJobs[0].id, appliedAt: "2026-08-24", stage: "screening", tags: ["Strong fit", "Java"], owner: "Anita Rao", resumeStorageKey: "resumes/rohit.pdf", answers: { notice: "30 days" }, internalNotes: ["Good backend fundamentals."] },
  { id: "applicant-2", candidateName: "Aisha Khan", headline: "Product Designer", experience: "5 years", location: "Remote", jobId: employerJobs[3].id, appliedAt: "2026-08-28", stage: "shortlisted", tags: ["Follow up"], owner: "Anita Rao", answers: {}, internalNotes: [] },
  { id: "applicant-3", candidateName: "Karan Mehta", headline: "Graduate Trainee", experience: "Fresher", location: "Gurugram", jobId: employerJobs[2].id, appliedAt: "2026-08-29", stage: "applied", tags: ["Immediate"], owner: "Meera Nair", answers: {}, internalNotes: [] },
];

export const interviews: EmployerInterview[] = [
  { id: "interview-1", applicantId: "applicant-2", jobId: employerJobs[3].id, scheduledAt: "2026-09-08 11:00", mode: "Video", status: "scheduled", attendees: ["Aisha Khan", "Anita Rao"] },
];

export const team = [
  employerUser,
  { id: "company-user-2", companyId: employerCompany.id, userId: "user-employer-2", role: "recruiter" as const, status: "active" as const, name: "Anita Rao", email: "anita@example.com" },
  { id: "company-user-3", companyId: employerCompany.id, userId: "user-employer-3", role: "viewer" as const, status: "invited" as const, name: "Meera Nair", email: "meera@example.com" },
];

export const recruitmentRequests: RecruitmentRequest[] = [
  { id: "req-1", role: "Field sales hiring", hires: "Multiple", location: "Pune", timeline: "This month", status: "Under Review" },
];

export const unlockUsage = { used: 12, limit: 25 };
