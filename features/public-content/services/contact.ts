import type { ContactEnquiryPayload, ReportPayload } from "@/features/public-content/types";

export async function submitContactEnquiry(_payload: ContactEnquiryPayload) {
  return { status: "not_configured" as const };
}

export async function submitSafetyReport(_payload: ReportPayload) {
  return { status: "not_configured" as const };
}
