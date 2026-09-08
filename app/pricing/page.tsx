import { pageMetadata } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { getMembershipPlans } from "@/features/memberships/services/plans";

export const metadata = pageMetadata("/pricing");

const rows = [
  ["Active jobs", "activeJobsLimit"],
  ["Candidate search", "candidateSearchLimit"],
  ["Candidate unlocks", "candidateUnlockLimit"],
  ["Recruiter seats", "recruiterSeats"],
  ["Automation", "automationEnabled"],
  ["Priority support", "prioritySupport"],
  ["Managed recruitment", "managedRecruitmentAddon"],
] as const;

const pricingFaqs = [
  ["Can we upgrade later?", "Contact Grow Biz to discuss a plan change when your job posting, candidate access or team requirements change."],
  ["What happens if our hiring volume increases?", "You can move to a higher access tier or discuss a custom plan for recurring, multi-location or high-volume hiring."],
  ["Does a plan include managed recruitment?", "Memberships are for self-service platform access. Managed recruitment is a separate or additional service where appropriate."],
  ["Is candidate access unlimited?", "No. Candidate search and profile access depend on employer verification, permissions and plan entitlement."],
  ["Do we need employer verification?", "Company verification is required before full candidate-database access, along with the relevant plan entitlement and candidate consent."],
];

export default async function PricingPage() {
  const plans = await getMembershipPlans();

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>Employer memberships</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">{publicSeo["/pricing"].h1}</h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">{publicSeo["/pricing"].description}</p>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="grid gap-4 lg:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.id} className={`glass-interactive flex rounded-card border p-5 ${plan.featured ? "border-plum-600 bg-plum-50/60" : "border-line"}`}>
                <div className="flex w-full flex-col">
                  {plan.featured && <span className="mb-3 w-fit rounded-pill bg-plum-600 px-2.5 py-1 text-[11.5px] font-medium text-white">Recommended</span>}
                  <h2 className="font-display text-[18px] font-semibold text-ink">{plan.name}</h2>
                  <p className="mt-2 min-h-14 text-[13.5px] leading-relaxed text-mist">{plan.description}</p>
                  <p className="mt-4 font-display text-[28px] font-bold text-ink">{plan.price}</p>
                  <p className="text-[12.5px] capitalize text-mist">{plan.billingCycle} terms</p>
                  <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-[13.5px] leading-relaxed text-ink/80">
                        <Check size={15} className="mt-0.5 shrink-0 text-plum-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.ctaHref} className={`gb-button mt-6 inline-flex min-h-11 items-center justify-center rounded-pill px-4 py-2.5 text-[14px] font-medium ${plan.featured ? "bg-plum-600 text-white hover:bg-plum-700" : "border border-plum-600 text-plum-600 hover:bg-plum-50"}`}>
                    {plan.ctaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-mist">Contact Grow Biz for current pricing, included access and billing terms before choosing a plan.</p>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/40 py-16 md:py-20">
        <Container>
          <Kicker>Plan entitlements</Kicker>
          <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Compare employer hiring plans</h2>
          <div className="mt-8 hidden rounded-card border border-line bg-white lg:block">
            <div className="grid grid-cols-[220px_repeat(4,1fr)] border-b border-line">
              <div className="p-4 text-[13px] font-medium text-mist">Feature</div>
              {plans.map((plan) => <div key={plan.id} className="p-4 text-[13px] font-semibold text-ink">{plan.name}</div>)}
            </div>
            {rows.map(([label, key]) => (
              <div key={key} className="grid grid-cols-[220px_repeat(4,1fr)] border-b border-line last:border-b-0">
                <div className="p-4 text-[13px] font-medium text-ink">{label}</div>
                {plans.map((plan) => {
                  const value = plan[key];
                  const text = typeof value === "boolean" ? (value ? "Included" : "Not included") : value;
                  return <div key={plan.id} className="p-4 text-[13px] leading-relaxed text-mist">{text}</div>;
                })}
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-4 lg:hidden">
            {plans.map((plan) => (
              <article key={plan.id} className="rounded-card border border-line bg-white p-5">
                <h3 className="font-display text-[17px] font-semibold text-ink">{plan.name}</h3>
                <dl className="mt-4 space-y-3">
                  {rows.map(([label, key]) => {
                    const value = plan[key];
                    const text = typeof value === "boolean" ? (value ? "Included" : "Not included") : value;
                    return (
                      <div key={key} className="grid grid-cols-[0.9fr_1.1fr] gap-3 text-[13px]">
                        <dt className="font-medium text-ink">{label}</dt>
                        <dd className="text-mist">{text}</dd>
                      </div>
                    );
                  })}
                </dl>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <Kicker><span className="text-plum-200">Managed recruitment add-on</span></Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold md:text-[30px]">Memberships are platform access. Recruitment support is scoped separately.</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/70">Use memberships for self-service job posting, candidate discovery and applicant management. Request managed recruitment when you need Grow Biz recruiters to run sourcing, screening, shortlists and coordination.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/recruitment-services#hiring-requirement" className="inline-flex min-h-11 items-center justify-center rounded-pill bg-white px-5 py-3 text-[15px] font-medium text-plum-700 hover:bg-white/90">Request Recruitment Support</Link>
              <Link href="/employers" className="inline-flex min-h-11 items-center justify-center rounded-pill border border-white/30 px-5 py-3 text-[15px] font-medium text-white hover:bg-white/10">Explore Employer Platform</Link>
            </div>
          </div>
          <div className="rounded-card border border-white/15 p-6">
            <ShieldCheck size={26} className="text-plum-200" />
            <p className="mt-4 font-display text-[20px] font-semibold">Candidate access follows verification and consent</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">Employer verification, plan limits and candidate visibility settings determine profile access. A membership does not provide unrestricted access to candidate data.</p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Kicker>Pricing FAQ</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Common plan questions</h2>
          </div>
          <div className="divide-y divide-line border-t border-line">
            {pricingFaqs.map(([question, answer]) => (
              <details key={question} className="py-5">
                <summary className="cursor-pointer font-medium text-ink">{question}</summary>
                <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{answer}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
