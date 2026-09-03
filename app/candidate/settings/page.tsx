import { SettingsForm } from "@/components/candidate/SettingsForm";
import { getCandidateSettings } from "@/features/candidates/services/candidate";

export const metadata = { title: "Candidate Settings | Grow Biz Jobs" };

export default async function CandidateSettingsPage() {
  const settings = await getCandidateSettings();
  return <SettingsForm initial={settings} />;
}
