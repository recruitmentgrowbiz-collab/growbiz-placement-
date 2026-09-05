import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Clock, ShieldAlert } from "lucide-react";
import { Container, Kicker, PrimaryButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

const verificationCopy: Record<string, { label: string; icon: any; className: string }> = {
  verified: { label: "Verified employer", icon: BadgeCheck, className: "text-green-700 bg-green-50" },
  pending: { label: "Verification pending", icon: Clock, className: "text-gold-600 bg-gold-500/10" },
  needs_review: { label: "Needs review", icon: ShieldAlert, className: "text-orange-700 bg-orange-50" },
  rejected: { label: "Verification rejected", icon: ShieldAlert, className: "text-red-700 bg-red-50" },
};

export default async function EmployerDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership_row } = await supabase
    .from("company_users")
    .select("company_id, companies(*)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const company = (membership_row as any)?.companies;

  if (!company) {
    return (
      <Container className="py-16">
        <p className="text-[15px] text-mist">
          No company found on your account yet. Contact support if this looks wrong.
        </p>
      </Container>
    );
  }

  const [{ data: membership }, { count: jobCount }, { count: applicantCount }] = await Promise.all([
    supabase.from("memberships").select("*").eq("company_id", company.id).maybeSingle(),
    supabase.from("jobs").select("id", { count: "exact", head: true }).eq("company_id", company.id).eq("status", "published"),
    supabase
      .from("applications")
      .select("id, jobs!inner(company_id)", { count: "exact", head: true })
      .eq("jobs.company_id", company.id),
  ]);

  const vStatus = verificationCopy[company.verification_status] ?? verificationCopy.pending;
  const VIcon = vStatus.icon;

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Employer dashboard</Kicker>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[26px] font-bold text-ink md:text-[30px]">{company.name}</h1>
          <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[12.5px] font-medium ${vStatus.className}`}>
            <VIcon size={14} /> {vStatus.label}
          </span>
        </div>

        {company.verification_status !== "verified" && (
          <p className="mt-3 max-w-lg rounded-card border border-line bg-plum-50/60 p-4 text-[13.5px] leading-relaxed text-ink/80">
            You can post jobs while verification is pending, but full candidate-database search
            unlocks only after your company is verified.
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-line p-5">
            <p className="text-[13px] font-medium text-mist">Active jobs</p>
            <p className="mt-2 font-display text-[26px] font-bold text-ink">
              {jobCount ?? 0} <span className="text-[15px] font-normal text-mist">/ {membership?.active_jobs_limit ?? "-"}</span>
            </p>
          </div>
          <div className="rounded-card border border-line p-5">
            <p className="text-[13px] font-medium text-mist">Total applicants</p>
            <p className="mt-2 font-display text-[26px] font-bold text-ink">{applicantCount ?? 0}</p>
          </div>
          <div className="rounded-card border border-line p-5">
            <p className="text-[13px] font-medium text-mist">Current plan</p>
            <p className="mt-2 font-display text-[26px] font-bold capitalize text-ink">
              {membership?.plan ?? "Free"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href="/employer/dashboard/jobs/new">Post a Job</PrimaryButton>
          <Link
            href="/employer/dashboard/jobs"
            className="inline-flex items-center rounded-pill border border-line px-5 py-3 text-[15px] font-medium text-ink/80 hover:border-plum-300"
          >
            Manage Jobs
          </Link>
        </div>
      </Container>
    </section>
  );
}
