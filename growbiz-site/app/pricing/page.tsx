import Link from "next/link";
import { Check } from "lucide-react";
import { Container, Kicker, PrimaryButton } from "@/components/ui";
import { employerPlans, recruitmentPricing, faqs } from "@/lib/data";

export const metadata = {
  title: "Employer Membership Plans",
  description:
    "Compare employer hiring memberships for job posting, candidate access, recruiter seats and hiring support.",
};

const rows: { label: string; key: keyof (typeof employerPlans)[number] }[] = [
  { label: "Active jobs", key: "activeJobs" },
  { label: "Recruiter seats", key: "recruiterSeats" },
  { label: "Candidate profile unlocks", key: "candidateUnlocks" },
  { label: "Applicant pipeline", key: "pipeline" },
  { label: "AI shortlist", key: "aiShortlist" },
  { label: "Featured job credits", key: "featuredJobs" },
  { label: "Reports", key: "reports" },
  { label: "Support", key: "support" },
  { label: "Managed recruitment", key: "managedRecruitment" },
];

export default function PricingPage() {
  const paymentFaq = faqs.find((f) => f.q === "How do employer recruitment payments work?");

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>Pricing</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">
              Choose a Hiring Plan That Matches Your Hiring Volume
            </h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">
              Start free, upgrade when you need more active jobs, candidate access, recruiter
              seats, automation and priority support. For complex or high-volume hiring, combine
              your membership with Grow Biz managed recruitment.
            </p>
          </div>
        </Container>
      </section>

      {/* Employer plans */}
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {employerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-card border p-5 ${
                  plan.highlight ? "border-plum-600 bg-plum-50/60" : "border-line"
                }`}
              >
                {plan.highlight && (
                  <span className="mb-3 w-fit rounded-pill bg-plum-600 px-2.5 py-1 text-[11.5px] font-medium text-white">
                    Most popular
                  </span>
                )}
                <p className="font-display text-[16px] font-semibold text-ink">{plan.name}</p>
                <p className="mt-2 font-display text-[24px] font-bold text-ink">{plan.price}</p>
                <p className="text-[12.5px] text-mist">{plan.billing}</p>

                <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                  {rows.map((row) => (
                    <li key={row.key} className="flex items-start gap-2 text-[13px] text-ink/80">
                      <Check size={14} className="mt-0.5 shrink-0 text-plum-600" />
                      <span>
                        <span className="text-mist">{row.label}: </span>
                        {plan[row.key]}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`mt-6 rounded-pill px-4 py-2.5 text-center text-[14px] font-medium ${
                    plan.highlight
                      ? "bg-plum-600 text-white hover:bg-plum-700"
                      : "border border-plum-600 text-plum-600 hover:bg-plum-50"
                  }`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-mist">
            Monthly plans are billed upfront each month; annual plans are billed in full upfront.
            Payments do not retain paid entitlements once expired or failed.
          </p>
        </Container>
      </section>

      {/* Candidate access */}
      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-card border border-white/15 p-6">
            <p className="text-[13px] font-medium text-white/50">For candidates</p>
            <p className="mt-2 font-display text-[24px] font-bold">Free — always</p>
            <p className="mt-2 text-[14.5px] text-white/70">
              Profile creation, resume upload, job search, applications, application tracking and
              alerts never require payment.
            </p>
          </div>
          <div className="rounded-card border border-white/15 p-6">
            <p className="text-[13px] font-medium text-white/50">Career Plus (optional)</p>
            <p className="mt-2 font-display text-[24px] font-bold">₹1,999 / year</p>
            <p className="mt-2 text-[14.5px] text-white/70">
              Profile boost, AI resume feedback, priority alerts and a skill-gap report. Visibility
              support only — never a factor in an employer's hiring decision.
            </p>
          </div>
        </Container>
      </section>

      {/* Recruitment services pricing */}
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <Kicker>Managed recruitment &amp; add-ons</Kicker>
          <h2 className="mt-4 font-display text-[26px] font-bold text-ink">
            Pay only for what you use beyond membership
          </h2>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line text-[13px] text-mist">
                  <th className="py-3 pr-4 font-medium">Service</th>
                  <th className="py-3 pr-4 font-medium">Price</th>
                  <th className="py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {recruitmentPricing.map((row) => (
                  <tr key={row.label} className="border-b border-line/70">
                    <td className="py-4 pr-4 text-[14.5px] font-medium text-ink">{row.label}</td>
                    <td className="py-4 pr-4 text-[14.5px] text-plum-700">{row.price}</td>
                    <td className="py-4 text-[13.5px] leading-relaxed text-mist">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {paymentFaq && (
        <section className="py-16 md:py-20">
          <Container className="max-w-2xl rounded-card border border-line bg-plum-50/60 p-8">
            <p className="font-medium text-ink">{paymentFaq.q}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{paymentFaq.a}</p>
            <div className="mt-5">
              <PrimaryButton href="/contact">Talk to Sales</PrimaryButton>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
