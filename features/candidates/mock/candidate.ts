import type { Application, Interview } from "@/features/applications/types";
import type { Candidate, CandidateSettings, Resume } from "@/features/candidates/types";

export const mockCandidate: Candidate = {
  id: "candidate-rohit",
  userId: "user-rohit",
  name: "Rohit Sharma",
  email: "rohit@example.com",
  phone: "+91 90000 00000",
  location: "Bengaluru, Karnataka",
  completeness: 75,
  profile: {
    headline: "Backend Engineer",
    summary: "Backend developer focused on APIs, databases and reliable product systems.",
    skills: ["Node.js", "PostgreSQL", "AWS", "REST APIs"],
    visibility: "discoverable",
    experience: [{ id: "exp-1", company: "Northwind Apps", title: "Software Engineer", startDate: "2023-01", summary: "Built backend services and internal APIs." }],
    education: [{ id: "edu-1", institution: "Bangalore University", qualification: "B.Tech", field: "Computer Science", endDate: "2022" }],
    preferences: {
      roles: ["Backend Engineer", "Node.js Developer"],
      skills: ["Node.js", "PostgreSQL"],
      locations: ["Bengaluru", "Remote"],
      workModes: ["Hybrid", "Remote"],
      jobTypes: ["Full-time"],
      industries: ["SaaS", "Fintech"],
      salary: { amount: 1200000, currency: "INR", period: "year" },
    },
  },
};

export const mockResumes: Resume[] = [
  { id: "resume-1", candidateId: mockCandidate.id, fileName: "Rohit_Backend_Resume.pdf", storageKey: "candidate-rohit/resume-1.pdf", uploadedAt: "2026-08-20", isCurrent: true, processingStatus: "not_processed" },
];

export const mockApplications: Application[] = [
  { id: "app-1", candidateId: mockCandidate.id, jobId: "backend-engineer-bengaluru-2201", stage: "screening", answers: { notice: "30 days" }, createdAt: "2026-08-24", updatedAt: "2026-08-30" },
  { id: "app-2", candidateId: mockCandidate.id, jobId: "graduate-trainee-operations-gurugram-3120", stage: "applied", answers: {}, createdAt: "2026-08-28", updatedAt: "2026-08-28" },
];

export const mockInterviews: Interview[] = [];

export const mockSavedJobIds = ["backend-engineer-bengaluru-2201", "senior-product-designer-remote-4410"];

export const mockCandidateSettings: CandidateSettings = {
  discoverable: true,
  allowRecruiterContact: true,
  contactEmail: true,
  contactPhone: false,
  serviceEmails: true,
  marketingConsent: false,
};
