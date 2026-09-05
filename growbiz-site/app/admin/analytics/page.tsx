import { Users, Building2, Briefcase, FileText, Award, IndianRupee, ShieldAlert, Clock, BadgeCheck } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { MaintenanceRunner } from "@/components/admin/MaintenanceRunner";
import { createClient } from "@/lib/supabase/server";

type AdminAnalytics = {
  total_candidates: number;
  total_employers: number;
  verified_employers: number;
  active_jobs: number;
  total_applications: number;
  total_hires: number;
  total_placements: number;
  billed_fee_paise: number;
  pending_fee_paise: number;
  open_reports: number;
  pending_verifications: number;
  career_plus_active: number;
};

function formatINR(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default async function AdminAnalyticsPage() {
  const supabase = createClient();
  // get_admin_analytics() checks is_admin() itself and returns nothing for
  // anyone else — see 0010_logos_interviews_analytics.sql. The page-level
  // gate in admin/layout.tsx is a UX convenience, not the security boundary.
  const { data } = (await supabase.rpc("get_admin_analytics").maybeSingle()) as {
    data: AdminAnalytics | null;
  };

  if (!data) {
    return (
      <Container className="py-16">
        <p className="text-[15px] text-mist">No analytics data available.</p>
      </Container>
    );
  }

  const cards = [
    { icon: Users, label: "Candidates", value: data.total_candidates },
    { icon: Building2, label: "Employers", value: data.total_employers },
    { icon: Building2, label: "Verified employers", value: data.verified_employers },
    { icon: Briefcase, label: "Active jobs", value: data.active_jobs },
    { icon: FileText, label: "Total applications", value: data.total_applications },
    { icon: Award, label: "Hires (all time)", value: data.total_hires },
    { icon: Award, label: "Placements recorded", value: data.total_placements },
    { icon: BadgeCheck, label: "Career Plus active", value: data.career_plus_active },
    { icon: Clock, label: "Pending verifications", value: data.pending_verifications },
    { icon: ShieldAlert, label: "Open reports", value: data.open_reports },
  ];

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Admin</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Analytics</h1>
        <p className="mt-2 max-w-lg text-[14px] text-mist">
          Live counts from the platform — no separate analytics pipeline, this reads directly
          from the same tables everything else uses.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-card border border-line p-5">
              <Icon size={18} className="text-plum-600" />
              <p className="mt-3 font-display text-[26px] font-bold text-ink">{value}</p>
              <p className="mt-1 text-[13px] text-mist">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-card border border-line bg-plum-50/60 p-5">
            <IndianRupee size={18} className="text-plum-600" />
            <p className="mt-3 font-display text-[24px] font-bold text-ink">
              {formatINR(data.billed_fee_paise)}
            </p>
            <p className="mt-1 text-[13px] text-mist">Invoiced or paid managed-recruitment fees</p>
          </div>
          <div className="rounded-card border border-line p-5">
            <IndianRupee size={18} className="text-mist" />
            <p className="mt-3 font-display text-[24px] font-bold text-ink">
              {formatINR(data.pending_fee_paise)}
            </p>
            <p className="mt-1 text-[13px] text-mist">Pending managed-recruitment fees</p>
          </div>
        </div>

        <MaintenanceRunner />
      </Container>
    </section>
  );
}
