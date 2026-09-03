import { WorkspaceShell } from "@/components/WorkspaceShell";

const nav = [
  { label: "Dashboard", href: "/candidate/dashboard" },
  { label: "Profile", href: "/candidate/profile" },
  { label: "Resume", href: "/candidate/resume" },
  { label: "Preferences", href: "/candidate/preferences" },
  { label: "Applications", href: "/candidate/applications" },
  { label: "Saved Jobs", href: "/candidate/saved-jobs" },
  { label: "Career Plus", href: "/career-plus" },
  { label: "Settings", href: "/candidate/settings" },
];

export function CandidateShell({ children, name }: { children: React.ReactNode; name: string }) {
  return (
    <WorkspaceShell title="Candidate Portal" subtitle={name} nav={nav}>
      {children}
    </WorkspaceShell>
  );
}
