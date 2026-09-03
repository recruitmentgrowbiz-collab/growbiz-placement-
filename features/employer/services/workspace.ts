import { applicants, employerCompany, employerJobs, employerPermissions, employerUser, interviews, recruitmentRequests, team, unlockUsage } from "@/features/employer/mock/workspace";
import { employerMembershipPlans } from "@/features/memberships/mock/plans";

export async function getEmployerWorkspace() {
  return { currentEmployerCompany: employerCompany, currentEmployerUser: employerUser, employerRole: "employer_owner" as const, permissions: employerPermissions, plan: employerMembershipPlans[1] };
}
export async function getEmployerDashboard() { return { jobs: employerJobs, applicants, interviews, unlockUsage }; }
export async function getEmployerCompany() { return employerCompany; }
export async function updateEmployerCompany() { return { status: "mock_saved" as const }; }
export async function getEmployerJobs() { return employerJobs; }
export async function getEmployerJob(id: string) { return employerJobs.find((job) => job.id === id) ?? null; }
export async function createEmployerJob() { return { status: "mock_saved" as const }; }
export async function updateEmployerJob() { return { status: "mock_saved" as const }; }
export async function changeJobStatus() { return { status: "mock_saved" as const }; }
export async function duplicateJob() { return { status: "mock_saved" as const }; }
export async function getApplicants() { return applicants; }
export async function getApplicant(id: string) { return applicants.find((item) => item.id === id) ?? null; }
export async function updateApplicationStage() { return { status: "mock_saved" as const }; }
export async function addApplicationNote() { return { status: "mock_saved" as const }; }
export async function updateApplicantTags() { return { status: "mock_saved" as const }; }
export async function searchCandidates() { return applicants; }
export async function unlockCandidate() { return { status: "mock_unlocked" as const }; }
export async function getInterviews() { return interviews; }
export async function scheduleInterview() { return { status: "mock_saved" as const }; }
export async function updateInterview() { return { status: "mock_saved" as const }; }
export async function getEmployerTeam() { return team; }
export async function inviteEmployerUser() { return { status: "mock_saved" as const }; }
export async function updateEmployerRole() { return { status: "mock_saved" as const }; }
export async function getEmployerMembership() { return { plan: employerMembershipPlans[1], unlockUsage, activeJobsUsed: 2, recruiterSeatsUsed: 3, status: "active" as const }; }
export async function getRecruitmentRequests() { return recruitmentRequests; }
export async function createRecruitmentRequest() { return { status: "mock_saved" as const }; }
export async function getEmployerReports() { return { funnel: { applied: 3, screening: 1, shortlisted: 1, interview: 1, offer: 0, hired: 0 }, jobs: employerJobs, applicants }; }
