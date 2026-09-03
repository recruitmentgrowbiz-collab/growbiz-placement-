import { employerCompany, employerJobs, applicants, interviews } from "@/features/employer/mock/workspace";
import { employerMembershipPlans } from "@/features/memberships/mock/plans";
import type { Activity, InternalTask, Placement, Requisition, SafetyReport, Submission, SupportCase } from "@/features/internal/types";

export const requisitions: Requisition[] = [
  { id: "req-1", company: employerCompany.name, role: "Backend Engineer", hires: "2", location: "Bengaluru", experience: "2-4 years", priority: "High", owner: "Anita Rao", status: "Sourcing", createdAt: "2026-08-25", targetTimeline: "2026-09-15", slaState: "Due soon" },
  { id: "req-2", company: "Solara Renewables", role: "Field Sales Executive", hires: "Multiple", location: "Pune", experience: "0-2 years", priority: "Medium", owner: "Meera Nair", status: "Requirement Calibration", createdAt: "2026-08-28", targetTimeline: "2026-09-20", slaState: "On track" },
];
export const submissions: Submission[] = [{ id: "sub-1", candidate: "Aisha Khan", company: employerCompany.name, role: "Product Designer", recruiter: "Anita Rao", submittedAt: "2026-08-30", clientStatus: "Under review", interviewStatus: "Scheduled", offerStatus: "Not started", internalNote: "Strong portfolio", clientVisibleNote: "Relevant SaaS design experience." }];
export const placements: Placement[] = [{ id: "pl-1", candidate: "Rohit Sharma", employer: employerCompany.name, role: "Backend Engineer", offerStatus: "Offer Made", joiningDate: "2026-09-30", placementStatus: "Offer Made", commercialStatus: "Internal review" }];
export const tasks: InternalTask[] = [
  { id: "task-1", task: "Shortlist due", requisitionId: "req-1", dueDate: "2026-09-05", priority: "High", status: "Open" },
  { id: "task-2", task: "Interview follow-up", requisitionId: "req-2", dueDate: "2026-09-06", priority: "Medium", status: "In Progress" },
];
export const safetyReports: SafetyReport[] = [{ id: "rep-1", reporter: "Candidate", target: "Suspicious job post", category: "Suspicious payment request", createdAt: "2026-08-31", status: "Open", owner: "Admin" }];
export const supportCases: SupportCase[] = [{ id: "case-1", case: "Employer verification question", userCompany: employerCompany.name, category: "Employer issue", priority: "Medium", status: "Open", createdAt: "2026-08-30", owner: "Support" }];
export const activities: Activity[] = [{ id: "act-1", actor: "Admin", action: "Employer verification reviewed", target: employerCompany.name, timestamp: "2026-08-31" }];
export const adminUsers = [
  { id: "u1", name: "Rohit Sharma", email: "rohit@example.com", role: "candidate", status: "active", createdAt: "2026-08-20" },
  { id: "u2", name: "Anita Rao", email: "anita@example.com", role: "growbiz_recruiter", status: "active", createdAt: "2026-08-21" },
  { id: "u3", name: "Employer Owner", email: "owner@example.com", role: "employer_owner", status: "active", createdAt: "2026-08-22" },
];
export const adminData = { companies: [employerCompany], jobs: employerJobs, applicants, interviews, plans: employerMembershipPlans, reports: safetyReports, supportCases, activities };
