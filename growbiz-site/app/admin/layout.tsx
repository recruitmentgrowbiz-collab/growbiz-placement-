import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

const tabs = [
  { label: "Employer verification", href: "/admin" },
  { label: "Job moderation", href: "/admin/jobs" },
  { label: "Users & roles", href: "/admin/users" },
  { label: "Analytics", href: "/admin/analytics" },
  { label: "Delivery log", href: "/admin/notifications" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div>
      <div className="border-b border-line bg-plum-900">
        <Container className="flex gap-6 overflow-x-auto py-4">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="whitespace-nowrap text-[14px] font-medium text-white/70 hover:text-white"
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
