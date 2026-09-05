const stageLabels: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Not selected",
};

const verificationLabels: Record<string, string> = {
  verified: "verified",
  rejected: "rejected",
  needs_review: "flagged for review",
};

export function newApplicantSms(jobTitle: string) {
  return `Grow Biz Jobs: New applicant for ${jobTitle}. Check your dashboard.`;
}

export function stageChangedSms(jobTitle: string, stage: string) {
  return `Grow Biz Jobs: Your application for ${jobTitle} moved to ${stageLabels[stage] ?? stage}.`;
}

export function verificationDecisionSms(companyName: string, status: string) {
  return `Grow Biz Jobs: ${companyName} has been ${verificationLabels[status] ?? status}.`;
}

export function placementCandidateSms(jobTitle: string, companyName: string) {
  return `Grow Biz Jobs: Congratulations! You've been placed at ${companyName} for ${jobTitle}.`;
}

export function placementEmployerSms(jobTitle: string) {
  return `Grow Biz Jobs: A placement was recorded for ${jobTitle}.`;
}
