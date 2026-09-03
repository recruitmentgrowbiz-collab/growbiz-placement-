import type { CareerResource, ContactEnquiryType } from "@/features/public-content/types";

export const aboutPrinciples = [
  "Recruitment expertise",
  "Technology-enabled workflows",
  "Clear employer and candidate paths",
  "Human accountability around AI",
  "Secure-by-default data access",
  "Flexible hiring models",
  "Operational transparency",
];

export const serviceScope = [
  "IT & non-IT recruitment",
  "Sales & marketing recruitment",
  "Fresher placement",
  "Bulk hiring",
  "Executive search",
  "Staffing",
  "Campus recruitment",
  "RPO",
  "Grow Biz Jobs platform",
];

export const campusAudiences = [
  {
    title: "Students/Freshers",
    text: "Create a profile, explore internships and fresher roles, and prepare for placement drives.",
    cta: { label: "Search Fresher Jobs", href: "/jobs?experience=fresher" },
  },
  {
    title: "Institutes",
    text: "Coordinate placement drives, employer access, fresher hiring and readiness support.",
    cta: { label: "Become a Campus Partner", href: "/contact" },
  },
  {
    title: "Employers",
    text: "Access graduate talent, internships, campus hiring support and early-career shortlists.",
    cta: { label: "Explore Campus Hiring", href: "/recruitment-services#campus-recruitment" },
  },
];

export const careerResources: CareerResource[] = [
  { id: "resume-impact", slug: "resume-impact", category: "Resume", title: "Write a Resume That Shows Impact", excerpt: "Turn duties into evidence by showing scope, tools and outcomes.", readTime: "4 min", featured: true },
  { id: "interview-stories", slug: "interview-stories", category: "Interview", title: "Prepare Interview Stories Before You Apply", excerpt: "Build concise examples for problem solving, ownership and teamwork.", readTime: "5 min", featured: true },
  { id: "salary-range", slug: "salary-range", category: "Salary", title: "Handle Salary Conversations Clearly", excerpt: "Use role scope, market context and expectations without overstating certainty.", readTime: "3 min" },
  { id: "skill-roadmap", slug: "skill-roadmap", category: "Skills", title: "Choose Skills From Real Job Descriptions", excerpt: "Compare target roles and prioritize the gaps that appear repeatedly.", readTime: "4 min" },
  { id: "first-month", slug: "first-month", category: "Workplace", title: "Make Your First Month Easier", excerpt: "Learn communication norms, decision paths and expectations early.", readTime: "4 min" },
];

export const careerPlusBenefits = [
  "Resume support",
  "Interview preparation",
  "Profile visibility support",
  "Career readiness guidance",
  "Skill-gap suggestions later",
  "Career assistant later",
];

export const contactTypes: { id: ContactEnquiryType; label: string; description: string }[] = [
  { id: "Employer", label: "I'm an Employer", description: "Hiring, job posting or recruitment support." },
  { id: "Candidate", label: "I'm a Candidate", description: "Job search, applications or profile help." },
  { id: "Institute", label: "I represent an Institute", description: "Campus drives and partnership enquiries." },
  { id: "General", label: "General Enquiry", description: "Other Grow Biz questions." },
];

export const reportTypes = [
  "Suspicious payment request",
  "Fake company/job",
  "Misleading information",
  "Abuse/discrimination",
  "Expired/not available",
  "Other",
];

export const legalShells = {
  privacy: ["Overview", "Data collected", "Use of information", "Candidate data", "Employer data", "Data rights", "Contact"],
  terms: ["Overview", "Candidate use", "Employer use", "Platform conduct", "Account access", "Contact"],
  refund: ["Overview", "Membership payments", "Recruitment services", "Review process", "Contact"],
  consent: ["Overview", "Profile visibility", "Employer access", "Consent controls", "Contact"],
};
