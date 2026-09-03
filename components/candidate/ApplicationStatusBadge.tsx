import type { ApplicationStage } from "@/features/applications/types";

const labels: Record<ApplicationStage, string> = {
  applied: "Applied",
  screening: "Screening",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Not selected",
  withdrawn: "Withdrawn",
};

export function ApplicationStatusBadge({ stage }: { stage: ApplicationStage }) {
  return <span className="inline-flex rounded-pill border border-line bg-plum-50 px-3 py-1 text-[12.5px] font-medium text-plum-700">{labels[stage]}</span>;
}
