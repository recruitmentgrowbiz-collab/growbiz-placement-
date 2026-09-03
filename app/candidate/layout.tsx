import { CandidateShell } from "@/components/candidate/CandidateShell";
import { getCandidateSession } from "@/features/candidates/services/candidate";

export const metadata = { robots: { index: false, follow: false } };

export default async function CandidateLayout({ children }: { children: React.ReactNode }) {
  const { candidateProfile } = await getCandidateSession();
  return <CandidateShell name={candidateProfile.name}>{children}</CandidateShell>;
}
