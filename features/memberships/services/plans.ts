import { employerMembershipPlans } from "@/features/memberships/mock/plans";

export async function getMembershipPlans() {
  return employerMembershipPlans.filter((plan) => plan.status === "active");
}
