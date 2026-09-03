import { WorkspaceShell } from "@/components/WorkspaceShell";

export const metadata = { robots: { index: false, follow: false } };

const nav = [
  { label: "Overview", href: "/recruiter" },
  { label: "Requisitions", href: "/recruiter/requisitions" },
  { label: "Candidates", href: "/recruiter/candidates" },
  { label: "Submissions", href: "/recruiter/submissions" },
  { label: "Interviews", href: "/recruiter/interviews" },
  { label: "Placements", href: "/recruiter/placements" },
  { label: "Clients", href: "/recruiter/clients" },
  { label: "Tasks / SLA", href: "/recruiter/tasks" },
];

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceShell title="Grow Biz Recruiter Workspace" subtitle="Recruitment OS" nav={nav} tone="dark">
      {children}
    </WorkspaceShell>
  );
}
