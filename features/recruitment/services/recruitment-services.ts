import { services } from "@/lib/data";

export type RecruitmentRequestDraft = {
  company?: string;
  contactPerson?: string;
  businessEmail?: string;
  hiringRequirement?: string;
  roles?: string;
  numberOfHires?: string;
  location?: string;
  experience?: string;
  timeline?: string;
  notes?: string;
};

export async function getRecruitmentServices() {
  return services;
}

export async function submitRecruitmentRequest(_request: RecruitmentRequestDraft) {
  return { status: "not_configured" as const };
}
