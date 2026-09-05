type NotificationPayload = Record<string, any>;

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

export function describeNotification(template: string, payload: NotificationPayload): string {
  switch (template) {
    case "new_applicant":
      return `New applicant for ${payload.job_title ?? "your job"}`;
    case "application_stage_changed":
      return `Your application for ${payload.job_title ?? "a job"} moved to ${
        stageLabels[payload.stage] ?? payload.stage
      }`;
    case "verification_decision":
      return `${payload.company_name ?? "Your company"} was ${
        verificationLabels[payload.status] ?? payload.status
      }`;
    case "placement_recorded":
      return `You've been placed at ${payload.company_name ?? "an employer"} for ${
        payload.job_title ?? "a role"
      }`;
    case "placement_recorded_employer":
      return `A placement was recorded for ${payload.job_title ?? "your job"}`;
    default:
      return "You have a new update";
  }
}
