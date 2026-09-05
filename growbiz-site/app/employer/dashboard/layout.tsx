import Link from "next/link";
import { Container } from "@/components/ui";

const tabs = [
  { label: "Overview", href: "/employer/dashboard" },
  { label: "Jobs", href: "/employer/dashboard/jobs" },
  { label: "Candidates", href: "/employer/dashboard/candidates" },
  { label: "Company profile", href: "/employer/dashboard/company" },
  { label: "Plan", href: "/employer/dashboard/plan" },
];

export default function EmployerDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-line bg-plum-50/50">
        <Container className="flex gap-6 overflow-x-auto py-4">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="whitespace-nowrap text-[14px] font-medium text-ink/70 hover:text-plum-600"
            >
              {tab.label}
            </Link>
          ))}
        </Container>
      </div>
      {children}
    </div>
  );
}
