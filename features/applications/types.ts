export type ApplicationStage =
  | "applied"
  | "screening"
  | "shortlisted"
  | "interview"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

export type Application = {
  id: string;
  candidateId: string;
  jobId: string;
  stage: ApplicationStage;
  answers: Record<string, string | string[] | boolean>;
  createdAt: string;
  updatedAt: string;
};

export type Interview = {
  id: string;
  applicationId: string;
  scheduledAt: string;
  mode: "phone" | "video" | "in_person";
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  notes?: string;
};
