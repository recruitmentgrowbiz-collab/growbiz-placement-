import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

const tabs = [
  { label: "Requisitions", href: "/recruiter" },
  { label: "Placements", href: "/recruiter/placements" },
];

export default async function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "recruiter" && profile?.role !== "admin") redirect("/");

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
