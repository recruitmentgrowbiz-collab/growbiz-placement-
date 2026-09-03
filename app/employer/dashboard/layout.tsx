import { getEmployerWorkspace } from "@/features/employer/services/workspace";
import { WorkspaceShell } from "@/components/WorkspaceShell";

export const metadata = { robots: { index: false, follow: false } };

const nav = [
  { label: "Overview", href: "/employer/dashboard" },
  { label: "Jobs", href: "/employer/dashboard/jobs" },
  { label: "Applicants", href: "/employer/dashboard/applicants" },
  { label: "Candidate Search", href: "/employer/dashboard/candidates" },
  { label: "Interviews", href: "/employer/dashboard/interviews" },
  { label: "Team", href: "/employer/dashboard/team" },
  { label: "Membership", href: "/employer/dashboard/membership" },
  { label: "Recruitment Support", href: "/employer/dashboard/recruitment" },
  { label: "Reports", href: "/employer/dashboard/reports" },
  { label: "Company Profile", href: "/employer/dashboard/company" },
  { label: "Settings", href: "/employer/dashboard/settings" },
];

export default async function EmployerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { currentEmployerCompany, employerRole } = await getEmployerWorkspace();
  return (
    <WorkspaceShell title={currentEmployerCompany.name} subtitle={employerRole} nav={nav}>
      {children}
    </WorkspaceShell>
  );
}
