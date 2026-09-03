export type Membership = {
  id: string;
  ownerType: "company" | "candidate";
  ownerId: string;
  planId: string;
  status: "trialing" | "active" | "past_due" | "cancelled" | "expired";
  entitlements: Record<string, number | boolean | string>;
  startsAt: string;
  endsAt?: string;
};

export type MembershipPlanStatus = "draft" | "active" | "archived";

export type MembershipPlan = {
  id: string;
  name: string;
  description: string;
  billingCycle: "monthly" | "annual" | "custom";
  price: string;
  currency: "INR" | "CUSTOM";
  isCustomPricing: boolean;
  activeJobsLimit: string;
  candidateSearchLimit: string;
  candidateUnlockLimit: string;
  recruiterSeats: string;
  automationEnabled: boolean;
  prioritySupport: boolean;
  managedRecruitmentAddon: string;
  featured?: boolean;
  status: MembershipPlanStatus;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
};
