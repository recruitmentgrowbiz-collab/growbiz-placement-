import { mockJobs } from "@/features/jobs/mock/jobs";
import { mockApplications, mockCandidate, mockCandidateSettings, mockInterviews, mockResumes, mockSavedJobIds } from "@/features/candidates/mock/candidate";
import type { Candidate, CandidateEducation, CandidateExperience, CandidatePreferences, CandidateSettings, Resume } from "@/features/candidates/types";

export async function getCandidateSession() {
  return { currentUser: { id: mockCandidate.userId, role: "candidate" as const }, candidateProfile: mockCandidate };
}

export async function getCandidateProfile() { return mockCandidate; }
export async function updateCandidateProfile(_profile: Partial<Candidate>) { return { status: "mock_saved" as const }; }
export async function getCandidateExperience() { return mockCandidate.profile.experience; }
export async function addCandidateExperience(_entry: CandidateExperience) { return { status: "mock_saved" as const }; }
export async function updateCandidateExperience(_entry: CandidateExperience) { return { status: "mock_saved" as const }; }
export async function removeCandidateExperience(_id: string) { return { status: "mock_saved" as const }; }
export async function getCandidateEducation() { return mockCandidate.profile.education; }
export async function addCandidateEducation(_entry: CandidateEducation) { return { status: "mock_saved" as const }; }
export async function updateCandidateEducation(_entry: CandidateEducation) { return { status: "mock_saved" as const }; }
export async function removeCandidateEducation(_id: string) { return { status: "mock_saved" as const }; }
export async function getCandidateResume() { return mockResumes; }
export async function setCurrentResume(_resumeId: string) { return { status: "mock_saved" as const }; }
export async function updateCandidatePreferences(_preferences: CandidatePreferences) { return { status: "mock_saved" as const }; }
export async function getCandidatePreferences() { return mockCandidate.profile.preferences; }
export async function getCandidateApplications() { return mockApplications; }
export async function getCandidateApplicationById(id: string) { return mockApplications.find((app) => app.id === id) ?? null; }
export async function getCandidateInterviews() { return mockInterviews; }
export async function getSavedJobs() { return mockJobs.filter((job) => mockSavedJobIds.includes(job.id)); }
export async function getRecommendedJobs() { return mockJobs.filter((job) => job.location.includes("Bengaluru") || job.tags.some((tag) => mockCandidate.profile.skills.includes(tag))).slice(0, 3); }
export async function getCandidateSettings() { return mockCandidateSettings; }
export async function updateCandidateSettings(_settings: CandidateSettings) { return { status: "mock_saved" as const }; }
export async function selectResumeFile(_resume: Resume) { return { status: "mock_selected" as const }; }
