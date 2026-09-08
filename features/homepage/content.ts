import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Headset,
  Layers,
  MapPinned,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const employerCapabilities = [
  { icon: FileText, title: "Post jobs", text: "Publish openings with structured role details and screening questions." },
  { icon: Search, title: "Find candidates", text: "Search, shortlist and organize candidate profiles as hiring volume grows." },
  { icon: ClipboardCheck, title: "Manage applicants", text: "Track applications, notes, stages and interview follow-ups in one workspace." },
  { icon: Headset, title: "Recruiter support", text: "Bring in Grow Biz specialists for difficult, urgent or managed hiring needs." },
  { icon: Layers, title: "Scale hiring", text: "Support memberships, staffing, bulk hiring, campus drives and RPO workflows." },
  { icon: Sparkles, title: "Assisted matching", text: "Use AI as workflow assistance with human review for hiring decisions." },
];

export const candidateBenefits = [
  { icon: Search, title: "Search opportunities", text: "Browse roles by skill, location, work mode and experience level." },
  { icon: FileText, title: "Build your profile", text: "Create a candidate profile and keep resume details ready for applications." },
  { icon: BadgeCheck, title: "Apply free", text: "Applying to jobs on Grow Biz Jobs is free for candidates." },
  { icon: Route, title: "Track progress", text: "Follow application status and interview updates from one place." },
];

export const employerSteps = [
  "Create employer account",
  "Build company profile and verify",
  "Post a job or choose hiring support",
  "Review applicants and shortlists",
  "Interview and hire",
];

export const candidateSteps = [
  "Create a free account",
  "Complete profile and upload resume",
  "Search relevant jobs",
  "Apply free",
  "Track applications and updates",
];

export const featuredResources = [
  { icon: BookOpen, title: "Resume Tips", text: "Make your resume clearer and easier to screen.", href: "/career-resources" },
  { icon: Users, title: "Interview Preparation", text: "Prepare for screening, technical and role-fit conversations.", href: "/career-resources" },
  { icon: BriefcaseBusiness, title: "Salary Conversations", text: "Discuss current, expected and offer compensation clearly.", href: "/career-resources" },
  { icon: Route, title: "Skill Roadmaps", text: "Plan skills for fresher, sales, operations and technology roles.", href: "/career-resources" },
];

export const trustItems = [
  { icon: ShieldCheck, title: "Applications Are Free", text: "Candidates can search and apply without paying for job access." },
  { icon: Building2, title: "Employer Controls", text: "Company verification and access controls are built into the platform model." },
  { icon: MapPinned, title: "Report Suspicious Jobs", text: "Safety reporting paths help flag unusual job or payment requests." },
  { icon: Users, title: "Human-Reviewed Assistance", text: "AI can assist workflows, but hiring decisions need accountable human review." },
];

export const heroCards = {
  job: { title: "Find your next role", meta: "Search by skill, experience and work mode" },
  activity: { title: "Structured shortlists", meta: "Candidate summaries for active roles" },
};

export const campusAudiences = [
  { icon: GraduationCap, label: "Students and freshers" },
  { icon: Building2, label: "Colleges and institutes" },
  { icon: BriefcaseBusiness, label: "Employers hiring graduates" },
];

export async function getFeaturedResources() {
  return featuredResources;
}
