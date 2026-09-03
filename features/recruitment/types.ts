export type RecruitmentRequest = {
  id: string;
  companyId: string;
  jobId?: string;
  serviceSlug: string;
  status: "new" | "qualified" | "in_progress" | "closed";
  notes?: string;
  createdAt: string;
};
