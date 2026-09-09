import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mockJobs } from "@/features/jobs/mock/jobs";
import type { Application, Interview } from "@/features/applications/types";
import type { Candidate, CandidateEducation, CandidateExperience, CandidatePreferences, CandidateSettings, Resume } from "@/features/candidates/types";
import type { Job } from "@/features/jobs/types";

const emptyPreferences: CandidatePreferences = {
  roles: [],
  skills: [],
  locations: [],
  workModes: [],
  jobTypes: [],
  industries: [],
  salary: { currency: "INR", period: "year" },
};

async function getAuthedCandidate() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role === "employer") redirect("/employer/dashboard");
  if (profile?.role === "recruiter") redirect("/recruiter");
  if (profile?.role === "admin") redirect("/admin");
  if (profile?.role !== "candidate") redirect("/login");

  let { data: candidate } = await supabase
    .from("candidates")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!candidate) {
    const { data: created } = await supabase
      .from("candidates")
      .insert({ user_id: userData.user.id })
      .select()
      .single();
    candidate = created;
  }

  return { supabase, user: userData.user, profile, candidate };
}

function score(candidate: any, experience: CandidateExperience[], education: CandidateEducation[]) {
  const checks = [
    candidate?.headline,
    candidate?.location,
    candidate?.resume_url,
    candidate?.skills?.length,
    experience.length,
    education.length,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export async function getCandidateSession() {
  const candidateProfile = await getCandidateProfile();
  return { currentUser: { id: candidateProfile.userId, role: "candidate" as const }, candidateProfile };
}

export async function getCandidateProfile(): Promise<Candidate> {
  const { supabase, user, profile, candidate } = await getAuthedCandidate();
  const [{ data: experienceRows }, { data: educationRows }] = await Promise.all([
    supabase.from("candidate_experience").select("*").eq("candidate_id", user.id).order("start_date", { ascending: false }),
    supabase.from("candidate_education").select("*").eq("candidate_id", user.id).order("end_date", { ascending: false }),
  ]);

  const experience = (experienceRows ?? []).map((row: any): CandidateExperience => ({
    id: row.id,
    company: row.company,
    title: row.title,
    startDate: row.start_date ?? "",
    endDate: row.end_date ?? undefined,
    summary: row.summary ?? undefined,
  }));
  const education = (educationRows ?? []).map((row: any): CandidateEducation => ({
    id: row.id,
    institution: row.institution,
    qualification: row.qualification ?? "",
    field: row.field ?? undefined,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
  }));

  return {
    id: user.id,
    userId: user.id,
    name: profile?.full_name || user.email?.split("@")[0] || "Candidate",
    email: user.email ?? undefined,
    phone: profile?.phone ?? (user.user_metadata?.phone as string | undefined),
    location: candidate?.location ?? undefined,
    profile: {
      headline: candidate?.headline ?? "",
      summary: candidate?.summary ?? "",
      skills: candidate?.skills ?? [],
      experience,
      education,
      preferences: emptyPreferences,
      visibility: candidate?.discoverable ? "discoverable" : "private",
    },
    completeness: score(candidate, experience, education),
  };
}

export async function getCandidateExperience() { return (await getCandidateProfile()).profile.experience; }
export async function getCandidateEducation() { return (await getCandidateProfile()).profile.education; }
export async function getCandidateResume(): Promise<Resume[]> {
  await getAuthedCandidate();
  return [];
}
export async function getCandidatePreferences() { return emptyPreferences; }
export async function getCandidateSettings(): Promise<CandidateSettings> {
  const { candidate, profile } = await getAuthedCandidate();
  return {
    discoverable: candidate?.discoverable ?? true,
    allowRecruiterContact: true,
    contactEmail: true,
    contactPhone: Boolean(profile?.phone),
    serviceEmails: true,
    marketingConsent: candidate?.marketing_consent ?? false,
  };
}

export async function getCandidateApplications(): Promise<Application[]> { return []; }
export async function getCandidateApplicationById(_id: string): Promise<Application | null> { return null; }
export async function getCandidateInterviews(): Promise<Interview[]> { return []; }
export async function getSavedJobs(): Promise<Job[]> { return []; }
export async function getRecommendedJobs(): Promise<Job[]> { return mockJobs.slice(0, 3); }
export async function updateCandidateProfile(_profile: Partial<Candidate>) { return { status: "saved" as const }; }
export async function addCandidateExperience(_entry: CandidateExperience) { return { status: "saved" as const }; }
export async function updateCandidateExperience(_entry: CandidateExperience) { return { status: "saved" as const }; }
export async function removeCandidateExperience(_id: string) { return { status: "saved" as const }; }
export async function addCandidateEducation(_entry: CandidateEducation) { return { status: "saved" as const }; }
export async function updateCandidateEducation(_entry: CandidateEducation) { return { status: "saved" as const }; }
export async function removeCandidateEducation(_id: string) { return { status: "saved" as const }; }
export async function setCurrentResume(_resumeId: string) { return { status: "saved" as const }; }
export async function updateCandidatePreferences(_preferences: CandidatePreferences) { return { status: "saved" as const }; }
export async function updateCandidateSettings(_settings: CandidateSettings) { return { status: "saved" as const }; }
export async function selectResumeFile(_resume: Resume) { return { status: "selected" as const }; }
