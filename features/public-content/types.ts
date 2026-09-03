export type LinkTarget = { label: string; href: string };

export type CareerResourceCategory = "Resume" | "Interview" | "Salary" | "Skills" | "Workplace";

export type CareerResource = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: CareerResourceCategory;
  publishedAt?: string;
  readTime?: string;
  featured?: boolean;
};

export type ContactEnquiryType = "Employer" | "Candidate" | "Institute" | "General" | "Safety";

export type ContactEnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  enquiryType: ContactEnquiryType;
  organization?: string;
  subject: string;
  message: string;
};

export type ReportPayload = {
  reportType: string;
  jobOrCompany?: string;
  reason: string;
  description: string;
  contactEmail?: string;
};
