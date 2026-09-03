import { PreferencesForm } from "@/components/candidate/PreferencesForm";
import { getCandidatePreferences } from "@/features/candidates/services/candidate";

export const metadata = { title: "Job Preferences | Grow Biz Jobs" };

export default async function PreferencesPage() {
  const preferences = await getCandidatePreferences();
  return <PreferencesForm initial={preferences} />;
}
