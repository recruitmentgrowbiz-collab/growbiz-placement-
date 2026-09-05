import { redirect } from "next/navigation";
import { Container, Kicker } from "@/components/ui";
import { PlanSwitcher } from "@/components/employer/PlanSwitcher";
import { createClient } from "@/lib/supabase/server";
import { employerPlans } from "@/lib/data";

export default async function EmployerPlanPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: companyRow } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!companyRow?.company_id) redirect("/employer/dashboard");

  const { data: membership } = await supabase
    .from("memberships")
    .select("*")
    .eq("company_id", companyRow.company_id)
    .maybeSingle();

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Plan &amp; billing</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Manage your plan</h1>
        <p className="mt-2 max-w-lg text-[14px] text-mist">
          Paid plans are processed through PayU. Add your PayU keys to see this work
          end-to-end — see the README for setup. The Free plan switches instantly since there's
          nothing to charge.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {employerPlans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-card border p-5 ${
                plan.highlight ? "border-plum-600 bg-plum-50/60" : "border-line"
              }`}
            >
              <p className="font-display text-[15.5px] font-semibold text-ink">{plan.name}</p>
              <p className="mt-2 font-display text-[22px] font-bold text-ink">{plan.price}</p>
              <p className="text-[12px] text-mist">{plan.billing}</p>
              <ul className="mt-4 flex flex-1 flex-col gap-1.5 text-[12.5px] text-ink/75">
                <li>{plan.activeJobs} active jobs</li>
                <li>{plan.candidateUnlocks} candidate unlocks</li>
                <li>{plan.support} support</li>
              </ul>
              <PlanSwitcher currentPlan={membership?.plan ?? "free"} planName={plan.name} price={plan.price} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
