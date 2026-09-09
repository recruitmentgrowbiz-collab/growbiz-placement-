import { CandidateProfileEditor } from "@/components/candidate/CandidateProfileEditor";
import { getCandidateProfile } from "@/features/candidates/services/candidate";

export const metadata = { title: "Candidate Profile | Grow Biz Jobs" };

export default async function CandidateProfilePage() {
  const candidate = await getCandidateProfile();
  return (
    <div>
      <h1 className="font-display text-[24px] font-bold text-ink md:text-[28px]">Profile setup</h1>
      <p className="mt-2 text-[14.5px] text-mist">Add the details employers need to understand your fit. Preferences live on their own page.</p>
      <div className="mt-6">
        <CandidateProfileEditor initial={{ name: candidate.name, email: candidate.email, phone: candidate.phone, location: candidate.location, headline: candidate.profile.headline, summary: candidate.profile.summary, skills: candidate.profile.skills, experience: candidate.profile.experience, education: candidate.profile.education }} />
      </div>
    </div>
  );
}
