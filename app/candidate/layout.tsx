import { CandidateShell } from "@/components/candidate/CandidateShell";
import { getCandidateSession } from "@/features/candidates/services/candidate";
import { headers } from "next/headers";

export const metadata = { robots: { index: false, follow: false } };

export default async function CandidateLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname") ?? headers().get("next-url") ?? "";
  if (pathname.includes("/candidate/signup")) return children;

  const { candidateProfile } = await getCandidateSession();
  return <CandidateShell name={candidateProfile.name}>{children}</CandidateShell>;
}
