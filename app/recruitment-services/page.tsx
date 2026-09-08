import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import { ServiceNavigator } from "@/components/recruitment/ServiceNavigator";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { getRecruitmentServices } from "@/features/recruitment/services/recruitment-services";
import type { CSSProperties } from "react";

export const metadata = pageMetadata("/recruitment-services");

const process = [
  { title: "Hiring Requirement", description: "Understand role, location, experience and hiring goals." },
  { title: "Requirement Calibration", description: "Align role expectations, must-have skills and selection criteria." },
  { title: "Candidate Sourcing", description: "Identify relevant candidates across approved sourcing channels." },
  { title: "Screening", description: "Review fit, skills, experience, salary and notice period." },
  { title: "Shortlist", description: "Present structured candidate recommendations." },
  { title: "Interview Coordination", description: "Coordinate interview stages and communication." },
  { title: "Offer / Selection", description: "Support final selection and offer coordination." },
  { title: "Joining Support", description: "Track joining status and close the hiring requirement." },
];

const processPhases = [
  { label: "Brief", steps: process.slice(0, 2) },
  { label: "Source", steps: process.slice(2, 4) },
  { label: "Select", steps: process.slice(4, 6) },
  { label: "Join", steps: process.slice(6, 8) },
];

const benefits = [
  {
    title: "FASTER HIRING",
    description: "Reduce the time spent coordinating sourcing, screening and candidate follow-ups.",
  },
  {
    title: "BETTER MATCHING",
    description: "Structured screening aligned to the role.",
  },
  {
    title: "LESS OPERATIONAL LOAD",
    description: "Grow Biz handles the coordination-heavy work.",
  },
  {
    title: "CONSISTENT PROCESS",
    description: "Repeatable workflow from brief to joining.",
  },
  {
    title: "CLEARER VISIBILITY",
    description: "Track candidate stages.",
  },
  {
    title: "END-TO-END SUPPORT",
    description: "Support through joining.",
  },
];

export default async function RecruitmentServicesPage() {
  const services = await getRecruitmentServices();

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>Managed recruitment</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">{publicSeo["/recruitment-services"].h1}</h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">{publicSeo["/recruitment-services"].description}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/contact">Share Hiring Requirement</PrimaryButton>
              <SecondaryButton href="/employers">Employer Platform</SecondaryButton>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <Kicker>Service areas</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-ink md:text-[30px]">Choose managed support by role, volume or recruitment model</h2>
          <ServiceNavigator services={services} />
        </Container>
      </section>

      <section className="relative overflow-hidden border-b border-line bg-plum-900 py-20 text-white md:py-28 lg:py-32">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
        <Container className="max-w-[1360px] px-6 sm:px-8 lg:px-12 xl:px-20">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end">
            <div className="max-w-2xl gb-process-heading">
              <Kicker><span className="text-plum-200">Recruitment process</span></Kicker>
              <h2 className="mt-5 text-balance font-display text-[28px] font-bold leading-tight md:text-[36px]">
                Need More Than a Job Post? Let Our Recruitment Team Run the Search.
              </h2>
              <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-white/70">
                Grow Biz can manage the recruitment workflow from requirement calibration through joining support.
              </p>
            </div>
            <div className="gb-process-badge rounded-card border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-[13px] font-medium text-plum-200">Managed Recruitment</p>
              <p className="mt-1 font-display text-[18px] font-semibold">8-step hiring workflow</p>
            </div>
          </div>

          <div className="gb-process-board mt-12 rounded-[18px] border border-white/10 bg-white/[0.035] p-4 md:mt-14 md:p-5">
            <ol className="grid gap-4 md:grid-cols-4">
              {processPhases.map((phase, phaseIndex) => (
                <li key={phase.label} className="gb-process-phase relative">
                  <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-plum-200">{phase.label}</p>
                    <span className="text-[11px] font-semibold text-white/40">0{phaseIndex + 1}</span>
                  </div>
                  <ol className="grid gap-3">
                    {phase.steps.map((step, stepIndex) => {
                      const index = phaseIndex * 2 + stepIndex;
                      return (
                        <li
                          key={step.title}
                          className="gb-process-step grid grid-cols-[34px_1fr] gap-3 rounded-card border border-white/[0.09] bg-plum-950/35 p-4 transition duration-[220ms] ease-out hover:border-plum-300/30 hover:bg-white/[0.055]"
                          style={{ "--step-delay": `${index * 70}ms` } as CSSProperties}
                        >
                          <span className="gb-process-node flex h-8 w-8 items-center justify-center rounded-full bg-[rgb(var(--gb-magenta-action))] font-display text-[11px] font-bold text-white">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>
                            <h3 className="font-display text-[15px] font-semibold leading-tight text-white">{step.title}</h3>
                            <p className="mt-2 text-[13px] leading-[1.58] text-white/66">{step.description}</p>
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/45 py-16 md:py-20 lg:py-24">
        <Container className="max-w-[1360px] px-6 sm:px-8 lg:px-12 xl:px-20">
          <div className="gb-benefits-intro max-w-3xl">
            <Kicker>WHY GROW BIZ</Kicker>
            <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-tight text-ink md:text-[36px]">
              A More Structured Way to Hire.
            </h2>
            <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-mist">
              Recruitment support that reduces coordination, improves candidate visibility and keeps every stage of hiring easier to manage.
            </p>
          </div>

          <div className="mt-10 grid gap-8 border-t border-line pt-10 lg:grid-cols-[1fr_390px] lg:items-start">
            <ol className="gb-benefit-list grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit, index) => (
                  <li
                    key={benefit.title}
                  className="gb-benefit-row grid grid-cols-[42px_1fr] gap-4 rounded-card border border-line bg-white px-4 py-4"
                    style={{ "--step-delay": `${index * 80}ms` } as CSSProperties}
                  >
                  <span className="font-display text-[18px] font-bold leading-none text-plum-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                    <h3 className="font-display text-[15px] font-semibold leading-tight text-ink">
                        {benefit.title}
                      </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ol>

            <div className="gb-workspace-visual rounded-card border border-line bg-white p-5">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-plum-700">Recruitment Workspace</p>
                  <p className="mt-1 text-[13px] text-mist">Live hiring flow</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-[rgb(var(--gb-magenta))]" />
                </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-[12px] font-medium text-mist">
                  {["Requirement", "Sourcing", "Screening", "Shortlist", "Interview"].map((stage, index) => (
                    <span key={stage} className="inline-flex items-center gap-2">
                      {stage}
                    {index < 4 ? <ArrowRight size={12} className="text-plum-500" aria-hidden="true" /> : null}
                    </span>
                  ))}
                </div>
                <dl className="mt-7 grid gap-3">
                  {[
                    ["Active Requirement", "12 Candidates"],
                    ["Interview Stage", "3 Shortlisted"],
                    ["Joining", "On Track"],
                  ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[1fr_auto] gap-4 border-t border-line pt-3 text-[13.5px]">
                    <dt className="text-mist">{label}</dt>
                    <dd className="font-semibold text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
          </div>
            <Link href="/contact" className="group mt-9 inline-flex items-center gap-2 border-b border-plum-300/70 pb-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-plum-600 hover:text-plum-700">
              Start a hiring conversation
              <ArrowUpRight size={15} className="transition duration-[220ms] group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </Link>
        </Container>
      </section>

      <section id="hiring-requirement" className="bg-plum-50/60 py-16 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Kicker>Hiring requirement</Kicker>
            <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Share a hiring requirement</h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">Tell Grow Biz what you need to hire. Our recruitment team can support managed recruitment, bulk hiring, staffing, campus hiring and RPO.</p>
            <ul className="mt-6 grid gap-3 text-[14px] text-mist sm:grid-cols-2 lg:grid-cols-1">
              {["Managed Recruitment", "Bulk Hiring", "Staffing", "Campus Hiring", "RPO"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check size={16} className="text-plum-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/contact">Continue to Contact</PrimaryButton>
              <SecondaryButton href="/campus">Explore Campus Hiring</SecondaryButton>
            </div>
          </div>
          <div className="rounded-card border border-line bg-white p-5 shadow-sm md:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {["Company", "Contact person", "Business email", "Roles", "Number of hires", "Location", "Experience", "Timeline"].map((label) => (
                <label key={label} className="text-[13px] font-medium text-ink">
                  {label}
                  <input disabled className="mt-1 block min-h-11 w-full rounded-card border border-line bg-plum-50/35 px-3 text-[14px] outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-200" aria-label={label} />
                </label>
              ))}
              <label className="text-[13px] font-medium text-ink sm:col-span-2">
                Hiring requirement
                <textarea disabled rows={4} className="mt-1 block w-full rounded-card border border-line bg-plum-50/35 px-3 py-2 text-[14px] outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-200" aria-label="Hiring requirement" />
              </label>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
