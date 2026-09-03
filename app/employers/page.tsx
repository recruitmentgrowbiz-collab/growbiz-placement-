import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, LayoutDashboard, Search, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";
import { Container, Kicker, PrimaryButton, SecondaryButton, GhostLink } from "@/components/ui";
import { faqs } from "@/lib/data";
import { getMembershipPlans } from "@/features/memberships/services/plans";

export const metadata = {
  title: "Hire Talent | Job Posting & Recruitment Solutions - Grow Biz",
  description: "Post jobs, search candidates or use managed recruitment, staffing and RPO solutions.",
};

const valueProps = [
  { icon: Search, title: "Faster shortlists", text: "Post roles, organize applicants and move qualified candidates through the hiring pipeline efficiently." },
  { icon: BriefcaseBusiness, title: "Flexible hiring", text: "Use self-service memberships for recurring hiring or request managed recruitment when deeper support is required." },
  { icon: UserRoundCheck, title: "Human support", text: "Grow Biz recruiters can help source, screen and coordinate candidates for difficult or high-volume roles." },
  { icon: LayoutDashboard, title: "One workspace", text: "Manage jobs, applicants, interviews, team access and hiring activity from one place." },
];

const workflow = ["Create Employer Account", "Complete Company Profile", "Submit for Verification", "Post Jobs / Search Talent", "Manage Applicants", "Interview & Hire"];
const employerFaqs = ["Can companies hire directly from the platform?", "How are employers verified?", "Can we upgrade our employer plan later?", "Can Grow Biz handle recruitment for us."]
  .map((q) => faqs.find((f) => f.q === q))
  .filter(Boolean) as typeof faqs;

export default async function EmployersPage() {
  const plans = await getMembershipPlans();

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <Kicker>Recruitment, staffing &amp; hiring solutions</Kicker>
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">Hire the Right People Without Slowing Down Your Business.</h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">Flexible hiring solutions for startups, SMEs and enterprises - from job posting and candidate search to fully managed recruitment and RPO.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/employer/signup" className="w-full sm:w-auto">Post a Job</PrimaryButton>
              <SecondaryButton href="/recruitment-services#hiring-requirement" className="w-full sm:w-auto">Talk to a Recruitment Specialist</SecondaryButton>
            </div>
            <p className="mt-4 text-[13.5px] text-mist">Flexible self-service + recruiter-supported hiring</p>
          </div>
          <div className="rounded-card border border-line bg-white p-4 shadow-soft">
            <div className="rounded-[10px] border border-line bg-plum-50/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-[17px] font-semibold text-ink">Hiring workspace</p>
                  <p className="text-[13px] text-mist">Jobs, applicants, interviews and team activity</p>
                </div>
                <span className="rounded-pill bg-white px-3 py-1 text-[12px] font-medium text-plum-700">Preview</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
                <div className="space-y-3">
                  {["Dashboard", "Jobs", "Applicants", "Candidate Search", "Interviews"].map((item, index) => (
                    <div key={item} className={`rounded-card border p-3 text-[13px] font-medium ${index === 1 ? "border-plum-500 bg-white text-plum-700" : "border-line bg-white/70 text-ink/70"}`}>{item}</div>
                  ))}
                </div>
                <div className="rounded-card border border-line bg-white p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-ink">Backend Engineer</p>
                    <span className="text-[12px] text-mist">Active role</span>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {["Applied", "Screening", "Shortlist"].map((stage) => (
                      <div key={stage} className="rounded-card bg-plum-50 p-3">
                        <p className="text-[12px] text-mist">{stage}</p>
                        <div className="mt-3 h-2 rounded-full bg-plum-200">
                          <div className="h-2 w-2/3 rounded-full bg-plum-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 space-y-2">
                    {["Candidate profile reviewed", "Interview pending", "Recruiter note added"].map((row) => (
                      <div key={row} className="flex items-center gap-2 rounded-card border border-line px-3 py-2 text-[13px] text-ink/75">
                        <CheckCircle2 size={15} className="text-plum-600" />{row}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-card border border-line p-5">
                <Icon size={20} className="text-plum-600" />
                <h2 className="mt-3.5 font-display text-[16px] font-semibold text-ink">{title}</h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container>
          <Kicker>Employer workflow</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-ink md:text-[30px]">From verified profile to interviews in one hiring flow</h2>
          <ol className="mt-9 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
            {workflow.map((step, index) => (
              <li key={step} className="rounded-card border border-line bg-white p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plum-600 font-display text-[13px] font-semibold text-white">{index + 1}</span>
                <p className="mt-4 text-[14px] font-medium leading-snug text-ink">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6"><GhostLink href="/recruitment-services#hiring-requirement">Need deeper support?</GhostLink></div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Membership preview</Kicker>
              <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Self-service plans without final public pricing</h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mist">Compare plan structure for job posting, candidate access, recruiter seats and support.</p>
            </div>
            <GhostLink href="/pricing">View Plans</GhostLink>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.id} className={`rounded-card border p-5 ${plan.featured ? "border-plum-600 bg-plum-50/60" : "border-line"}`}>
                <h3 className="font-display text-[16px] font-semibold text-ink">{plan.name}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{plan.description}</p>
                <p className="mt-4 font-display text-[22px] font-bold text-ink">{plan.price}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Kicker><span className="text-plum-200">Managed recruitment / RPO</span></Kicker>
            <h2 className="mt-4 text-balance font-display text-[26px] font-bold leading-tight md:text-[30px]">Need More Than a Job Post? Let Our Recruitment Team Run the Search.</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">Grow Biz can support requirement calibration, sourcing, structured screening, shortlist submission, interview coordination and offer-to-joining workflows.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-pill bg-white px-5 py-3 text-[15px] font-medium text-plum-700 hover:bg-white/90">Share Hiring Requirement</Link>
              <Link href="/recruitment-services" className="inline-flex min-h-11 items-center justify-center rounded-pill border border-white/30 px-5 py-3 text-[15px] font-medium text-white hover:bg-white/10">Explore Recruitment Services</Link>
            </div>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {["Requirement calibration", "Sourcing", "Structured screening", "Shortlist", "Interview coordination", "Offer-to-joining support"].map((item, index) => (
              <li key={item} className="rounded-card border border-white/15 p-4 text-[14px] text-white/80"><span className="font-display text-[15px] font-semibold text-white">{index + 1}. </span>{item}</li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-card border border-line bg-plum-50/60 p-7">
            <ShieldCheck size={26} className="text-plum-600" />
            <h2 className="mt-4 font-display text-[20px] font-semibold text-ink">Employer verification</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-mist">Company identity and business details may be reviewed before full candidate database access. Verification status can affect platform permissions and plan entitlements.</p>
          </article>
          <article className="rounded-card border border-line bg-plum-50/60 p-7">
            <UsersRound size={26} className="text-plum-600" />
            <h2 className="mt-4 font-display text-[20px] font-semibold text-ink">Candidate access with controls</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-mist">Candidate profiles are accessed according to permissions, membership entitlement and visibility controls. Access can be audited, and bulk scraping/export is not part of normal access.</p>
          </article>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container className="max-w-2xl">
          <Kicker>Common questions</Kicker>
          <h2 className="mt-4 font-display text-[24px] font-bold text-ink">Employer FAQ</h2>
          <div className="mt-6 divide-y divide-line border-t border-line">
            {employerFaqs.map((f) => (
              <details key={f.q} className="py-5">
                <summary className="cursor-pointer font-medium text-ink">{f.q}</summary>
                <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{f.a}</p>
              </details>
            ))}
            <details className="py-5">
              <summary className="cursor-pointer font-medium text-ink">How does candidate access work?</summary>
              <p className="mt-2 text-[14.5px] leading-relaxed text-mist">Full candidate access depends on verification, membership entitlement and candidate visibility settings.</p>
            </details>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20">
        <Container className="grid gap-4 md:grid-cols-2">
          <article className="rounded-card border border-line p-7">
            <h2 className="font-display text-[22px] font-bold text-ink">Self-Service Hiring</h2>
            <p className="mt-2 text-[14.5px] text-mist">Post jobs, manage applicants and search talent from the employer workspace.</p>
            <div className="mt-5"><PrimaryButton href="/employer/signup">Post a Job</PrimaryButton></div>
          </article>
          <article className="rounded-card border border-line bg-plum-50/60 p-7">
            <h2 className="font-display text-[22px] font-bold text-ink">Recruitment Support</h2>
            <p className="mt-2 text-[14.5px] text-mist">Ask Grow Biz recruiters to source, screen, shortlist and coordinate candidates.</p>
            <div className="mt-5"><SecondaryButton href="/recruitment-services#hiring-requirement">Talk to a Recruitment Specialist</SecondaryButton></div>
          </article>
        </Container>
      </section>
    </>
  );
}
