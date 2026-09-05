import Link from "next/link";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { services } from "@/lib/data";

export const metadata = {
  title: "Recruitment Services",
  description:
    "Corporate recruitment, IT & non-IT hiring, executive search, bulk hiring, RPO and more — managed recruitment services from Grow Biz.",
};

const process = [
  "Requirement calibration — we confirm the target profile with you before sourcing at scale.",
  "Sourcing — across our candidate database, referrals, campus partners and external channels.",
  "Structured screening — eligibility, motivation, salary, notice period and role-specific fit.",
  "Shortlist submission — structured candidate cards with recruiter notes, not raw resumes.",
  "Interview coordination — scheduling, reminders and feedback follow-up.",
  "Offer-to-joining support — compensation alignment, counter-offer risk and joining confirmation.",
];

export default function RecruitmentServicesPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>Recruitment services</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">
              Recruitment Support for Every Stage of Growth
            </h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">
              From a single specialist hire to an outsourced recruitment team, choose the level of
              support that matches how — and how often — you hire.
            </p>
          </div>
        </Container>
      </section>

      {/* Service list */}
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="flex flex-col divide-y divide-line">
            {services.map((s) => (
              <div key={s.slug} id={s.slug} className="scroll-mt-24 py-10 first:pt-0">
                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                  <div>
                    <h2 className="font-display text-[21px] font-bold text-ink">{s.name}</h2>
                    <p className="mt-3 text-[14px] leading-relaxed text-mist">{s.problem}</p>
                    <p className="mt-3 text-[14px] leading-relaxed text-ink/75">
                      <span className="font-medium text-ink">Our approach: </span>
                      {s.approach}
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-[13px] font-medium text-mist">What Grow Biz handles</p>
                      <ul className="mt-2.5 flex flex-col gap-2">
                        {s.handles.map((h) => (
                          <li key={h} className="flex gap-2.5 text-[14px] leading-relaxed text-ink/85">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-400" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[13px] font-medium text-mist">Ideal use case</p>
                      <p className="mt-2.5 text-[14px] leading-relaxed text-ink/85">{s.useCase}</p>
                      <Link
                        href="/contact"
                        className="mt-4 inline-flex items-center rounded-pill border border-plum-600 px-4 py-2 text-[13.5px] font-medium text-plum-600 hover:bg-plum-50"
                      >
                        Share Hiring Requirement
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Managed recruitment process */}
      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <Kicker><span className="text-plum-200">How managed recruitment works</span></Kicker>
            <h2 className="mt-4 text-balance font-display text-[26px] font-bold leading-tight md:text-[30px]">
              Need More Than a Job Post? Let Our Recruitment Team Run the Search.
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              We calibrate the requirement, source candidates, conduct structured screening,
              coordinate interviews and support offer-to-joining. You get a focused shortlist
              instead of a pile of resumes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-pill bg-white px-5 py-3 text-[15px] font-medium text-plum-700 hover:bg-white/90"
              >
                Share Your Hiring Requirement
              </Link>
              <Link
                href="/pricing"
                className="rounded-pill border border-white/30 px-5 py-3 text-[15px] font-medium text-white hover:bg-white/10"
              >
                See Pricing
              </Link>
            </div>
          </div>

          <ol className="flex flex-col gap-3">
            {process.map((step, i) => (
              <li key={step} className="flex gap-3.5 rounded-card border border-white/15 p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-[13px] font-semibold">
                  {i + 1}
                </span>
                <p className="text-[14px] leading-relaxed text-white/80">{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container className="flex flex-col items-start gap-6 rounded-card border border-line bg-plum-50/60 p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="max-w-md text-balance font-display text-[22px] font-bold text-ink">
              Not sure which service fits your hiring plan?
            </h2>
            <p className="mt-2 max-w-md text-[14.5px] text-mist">
              Talk to a recruitment specialist — we'll recommend membership, managed recruitment
              or a hybrid based on your hiring volume and role difficulty.
            </p>
          </div>
          <div className="flex gap-3">
            <PrimaryButton href="/contact">Talk to a Specialist</PrimaryButton>
            <SecondaryButton href="/pricing">See Pricing</SecondaryButton>
          </div>
        </Container>
      </section>
    </>
  );
}
