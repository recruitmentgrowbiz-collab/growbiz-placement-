import { applicants, employerCompany, interviews } from "@/features/employer/mock/workspace";
import { placements, requisitions, submissions, tasks } from "@/features/internal/mock/internal";

export async function getRecruiterDashboard() { return { requisitions, applicants, interviews, placements, tasks }; }
export async function getRequisitions() { return requisitions; }
export async function getRequisition(id: string) { return requisitions.find((r) => r.id === id) ?? null; }
export async function searchRecruiterCandidates() { return applicants; }
export async function getSubmissions() { return submissions; }
export async function getRecruiterInterviews() { return interviews; }
export async function getPlacements() { return placements; }
export async function getClients() { return [{ company: employerCompany.name, verificationState: employerCompany.verificationStatus, activeRequisitions: requisitions.length, assignedRecruiter: "Anita Rao", recentActivity: "Requirement updated" }]; }
export async function getRecruiterTasks() { return tasks; }
export async function addCandidateToRequisition() { return { status: "mock_saved" as const }; }
export async function submitCandidateToClient() { return { status: "mock_saved" as const }; }
