import { WorkspaceShell } from "@/components/WorkspaceShell";

export const metadata = { robots: { index: false, follow: false } };

const nav = [
  { label: "Overview", href: "/admin" },
  { label: "Employer Verification", href: "/admin/employers" },
  { label: "Job Moderation", href: "/admin/jobs" },
  { label: "Safety Reports", href: "/admin/reports" },
  { label: "Plans", href: "/admin/plans" },
  { label: "Payments", href: "/admin/payments" },
  { label: "Users & Roles", href: "/admin/users" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Support", href: "/admin/support" },
  { label: "Content", href: "/admin/content" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceShell title="Grow Biz Admin Console" subtitle="Internal operations" nav={nav} tone="dark">
      {children}
    </WorkspaceShell>
  );
}
