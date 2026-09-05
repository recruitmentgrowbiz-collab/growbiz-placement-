import Link from "next/link";
import { Zap, SlidersHorizontal, HeartHandshake, LayoutGrid, ShieldCheck } from "lucide-react";
import { Container, Kicker, PrimaryButton, SecondaryButton, GhostLink } from "@/components/ui";
import { employerPlans, faqs } from "@/lib/data";

export const metadata = {
  title: "Hire Talent | Job Posting & Recruitment Solutions",
  description:
    "Post jobs, search candidates or use managed recruitment, staffing and RPO solutions with Grow Biz.",
};

const valueProps = [
  {
    icon: Zap,
    title: "Faster shortlists",
    text: "Reach relevant candidates and use structured screening to reduce manual filtering.",
  },
  {
    icon: SlidersHorizontal,
    title: "Flexible commercial model",
    text: "Choose prepaid monthly/annual membership, upfront pay-per-job, one-time success-fee recruitment, monthly-in-advance RPO, or a hybrid plan.",
  },
  {
    icon: HeartHandshake,
    title: "Human recruitment support",
    text: "Our recruiters can source, screen, coordinate and close candidates when your team needs help.",
  },
  {
    icon: LayoutGrid,
    title: "One hiring workspace",
    text: "Manage jobs, applicants, candidate search and recruitment activity from one dashboard.",
  },
];

const workflow = [
  "Create your employer account and submit business details for verification.",
  "Post a job on a membership plan, or share a hiring requirement with our recruitment team.",
  "Review applicants in a structured pipeline, or search the verified candidate database.",
  "Shortlist, interview and hire — with recruiter support on roles that need it.",
];

const employerFaqs = faqs.filter((f) =>
  ["Can companies hire directly from the platform?", "How are employers verified?", "Can we upgrade our employer plan later?"].includes(f.q)
);

export default function EmployersPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-16 md:py-20">
          <div className="max-w-2xl">
            <Kicker>For employers</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">
              Hire the Right People Without Slowing Down Your Business.
            </h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">
              Flexible hiring solutions for startups, SMEs and enterprises — from job posting and
              candidate search to fully managed recruitment and RPO.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PrimaryButton href="/pricing">Post a Job</PrimaryButton>
              <SecondaryButton href="/recruitment-services">Talk to a Recruitment Specialist</SecondaryButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Value props */}
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-card border border-line p-5">
                <Icon size={20} className="text-plum-600" />
                <h3 className="mt-3.5 font-display text-[15.5px] font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Workflow */}
      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Kicker>How the employer workspace works</Kicker>
            <h2 className="mt-4 text-balance font-display text-[26px] font-bold leading-tight text-ink md:text-[30px]">
              One dashboard for jobs, applicants and hiring support
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">
              Whether you're posting your first role or running a recurring hiring program, the
              workflow stays the same.
            </p>
          </div>

          <ol className="flex flex-col gap-5">
            {workflow.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-card border border-line bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-600 font-display text-[14px] font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-[14.5px] leading-relaxed text-ink/85">{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Pricing preview */}
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Membership plans</Kicker>
              <h2 className="mt-4 text-balance font-display text-[26px] font-bold leading-tight text-ink md:text-[30px]">
                Choose a Hiring Plan That Matches Your Hiring Volume
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mist">
                Start free, upgrade when you need more active jobs, candidate access, recruiter
                seats, automation and priority support.
              </p>
            </div>
            <GhostLink href="/pricing">See full pricing</GhostLink>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {employerPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-card border p-5 ${
                  plan.highlight ? "border-plum-600 bg-plum-50/60" : "border-line"
                }`}
              >
                <p className="font-display text-[15.5px] font-semibold text-ink">{plan.name}</p>
                <p className="mt-2 font-display text-[22px] font-bold text-ink">{plan.price}</p>
                <p className="text-[12.5px] text-mist">{plan.billing}</p>
                <p className="mt-3 text-[13px] text-ink/70">{plan.activeJobs} active jobs</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Managed recruitment cross-sell */}
      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Kicker><span className="text-plum-200">Managed recruitment</span></Kicker>
            <h2 className="mt-4 text-balance font-display text-[26px] font-bold leading-tight md:text-[30px]">
              Need More Than a Job Post? Let Our Recruitment Team Run the Search.
            </h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
              We calibrate the requirement, source candidates, conduct structured screening,
              coordinate interviews and support offer-to-joining. You get a focused shortlist
              instead of a pile of resumes.
            </p>
            <div className="mt-6">
              <Link
                href="/recruitment-services"
                className="inline-flex items-center rounded-pill bg-white px-5 py-3 text-[15px] font-medium text-plum-700 hover:bg-white/90"
              >
                Share Your Hiring Requirement
              </Link>
            </div>
          </div>
          <div className="rounded-card border border-white/15 p-6">
            <p className="text-[13px] font-medium text-white/50">Standard managed recruitment</p>
            <p className="mt-2 font-display text-[26px] font-bold">10% of annual CTC</p>
            <p className="mt-1 text-[13.5px] text-white/60">
              One-time fee, invoiced after the candidate joins. No monthly or yearly charge.
            </p>
          </div>
        </Container>
      </section>

      {/* Trust & consent */}
      <section className="border-b border-line py-16 md:py-20">
        <Container className="flex flex-col gap-6 rounded-card border border-line bg-plum-50/60 p-8 md:flex-row md:items-start">
          <ShieldCheck size={28} className="shrink-0 text-plum-600" />
          <div>
            <h2 className="font-display text-[19px] font-semibold text-ink">
              Candidate access, handled with consent
            </h2>
            <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-mist">
              Full candidate-database access is available only to verified employers within their
              plan's entitlement. Every candidate profile unlock is logged, and candidates control
              their own visibility and recruiter-contact preferences. Bulk export or scraping of
              candidate data is not permitted.
            </p>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20">
        <Container className="max-w-2xl">
          <Kicker>Common questions</Kicker>
          <h2 className="mt-4 font-display text-[24px] font-bold text-ink">Employer FAQ</h2>
          <div className="mt-6 flex flex-col divide-y divide-line border-t border-line">
            {employerFaqs.map((f) => (
              <div key={f.q} className="py-5">
                <p className="font-medium text-ink">{f.q}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <GhostLink href="/faq">See all FAQs</GhostLink>
          </div>
        </Container>
      </section>
    </>
  );
}
