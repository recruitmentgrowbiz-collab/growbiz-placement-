export type CompanyVerificationStatus = "pending" | "verified" | "rejected" | "needs_review";

export type Company = {
  id: string;
  isDemo?: boolean;
  name: string;
  slug: string;
  website?: string;
  industry?: string;
  size?: string;
  locations: string[];
  verificationStatus: CompanyVerificationStatus;
  logoUrl?: string;
  description?: string;
};

export type CompanyUser = {
  id: string;
  companyId: string;
  userId: string;
  role: "owner" | "admin" | "recruiter" | "viewer";
  status: "active" | "invited" | "suspended";
};
