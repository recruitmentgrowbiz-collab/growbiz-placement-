import { ResumeManager } from "@/components/candidate/ResumeManager";
import { getCandidateResume } from "@/features/candidates/services/candidate";

export const metadata = { title: "Resume | Grow Biz Jobs" };

export default async function ResumePage() {
  const resumes = await getCandidateResume();
  return <ResumeManager resumes={resumes} />;
}
