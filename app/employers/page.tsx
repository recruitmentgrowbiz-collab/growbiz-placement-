import { pageMetadata } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, LayoutDashboard, Search, ShieldCheck, UserRoundCheck, UsersRound } from "lucide-react";
import { Container, Kicker, PrimaryButton, SecondaryButton, GhostLink } from "@/components/ui";
import { faqs } from "@/lib/data";
import { getMembershipPlans } from "@/features/memberships/services/plans";

export const metadata = pageMetadata("/employers");

const valueProps = [
  { icon: Search, title: "Faster shortlists", text: "Post roles, organize applicants and move qualified candidates through the hiring pipeline efficiently." },
  { icon: BriefcaseBusiness, title: "Flexible hiring", text: "Use self-service memberships for recurring hiring or request managed recruitment when deeper support is required." },
  { icon: UserRoundCheck, title: "Human support", text: "Grow Biz recruiters can help source, screen and coordinate candidates for difficult or high-volume roles." },
  { icon: LayoutDashboard, title: "One workspace", text: "Manage jobs, applicants, interviews, team access and hiring activity from one place." },
];

const workflowPhases = [
  { phase: "SET UP", steps: ["01 Create Employer Account"], status: "Account started" },
  { phase: "VERIFY", steps: ["02 Complete Company Profile", "03 Submit for Verification"], status: "Company review" },
  { phase: "HIRE", steps: ["04 Post Jobs / Search Talent", "05 Manage Applicants"], status: "Pipeline active" },
  { phase: "SELECT", steps: ["06 Interview & Hire"], status: "Interview scheduled" },
];
const employerFaqs = ["Can companies hire directly from the platform?", "How are employers verified?", "Can we upgrade our employer plan later?", "Can Grow Biz handle recruitment for us?"]
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
            <h1 className="mt-4 text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">{publicSeo["/employers"].h1}</h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-mist">{publicSeo["/employers"].description}</p>
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
          <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
            <div>
              <Kicker>One workspace</Kicker>
              <h2 className="mt-4 font-display text-[28px] font-bold leading-tight text-ink md:text-[34px]">Employer hiring workspace</h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">Manage jobs, applicants, interviews, team access and hiring activity from one place.</p>
              <Link href="/employer/dashboard" className="mt-5 inline-flex min-h-11 items-center text-[14px] font-medium text-plum-600 underline underline-offset-4 hover:text-plum-700">See the workspace</Link>
            </div>
            <div className="rounded-[12px] border border-line bg-plum-50/60 p-3">
              <div className="rounded-[10px] border border-line bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                  <div><p className="font-display text-[17px] font-semibold text-ink">Employer Workspace</p><p className="text-[12.5px] text-mist">Illustrative interface preview</p></div>
                  <Link href="/employer/jobs/new" className="rounded-control bg-plum-600 px-3 py-2 text-[13px] font-medium text-white hover:bg-plum-700">+ Post a Job</Link>
                </div>
                <div className="grid grid-cols-2 gap-px border-b border-line bg-line md:grid-cols-4">
                  {["Active Jobs 4", "Applicants 36", "Interviews 5", "Hired 2"].map((item) => <div key={item} className="bg-white px-4 py-3 text-[13px] font-medium text-ink">{item}</div>)}
                </div>
                <div className="grid gap-0 p-4 md:grid-cols-[0.9fr_1.25fr_0.85fr]">
                  <div className="border-b border-line pb-4 md:border-b-0 md:border-r md:pr-4"><p className="text-[12px] font-semibold uppercase text-mist">Active Jobs</p>{["Backend Eng.", "Sales Exec.", "Ops Lead"].map((row, i) => <div key={row} className={`mt-3 rounded-control px-3 py-2 text-[13px] ${i === 0 ? "bg-plum-50 text-plum-700" : "text-ink/75 hover:bg-plum-50"}`}>{row}</div>)}</div>
                  <div className="border-b border-line py-4 md:border-b-0 md:border-r md:px-4 md:py-0"><p className="text-[12px] font-semibold uppercase text-mist">Applicant Pipeline</p>{[["Applied", "18"], ["Screening", "9"], ["Shortlisted", "5"], ["Interview", "3"]].map(([k, v], i) => <div key={k} className="mt-3 flex items-center justify-between border-b border-line pb-2 last:border-0"><span className="text-[13px] text-ink/75">{k}</span><span className={`rounded-pill px-2 py-0.5 text-[12px] font-medium ${i === 2 ? "bg-plum-50 text-plum-700" : "bg-paper text-ink/70"}`}>{v}</span></div>)}</div>
                  <div className="pt-4 md:pl-4 md:pt-0"><p className="text-[12px] font-semibold uppercase text-mist">Upcoming Interviews</p><div className="mt-3 rounded-control border border-line p-3"><p className="font-medium text-ink">Priya M.</p><p className="mt-1 text-[12.5px] text-mist">11:30 AM</p></div></div>
                </div>
                <div className="border-t border-line px-4 py-3"><p className="text-[12px] font-semibold uppercase text-mist">Recent Applicants</p>{[["Rahul S.", "Backend Developer", "Shortlisted"], ["Priya M.", "Operations Lead", "Screening"]].map(([a, b, c]) => <div key={a} className="grid gap-1 border-b border-line py-2 text-[13px] last:border-0 sm:grid-cols-[1fr_1.4fr_auto]"><span className="font-medium text-ink">{a}</span><span className="text-mist">{b}</span><span className="text-plum-700">{c}</span></div>)}</div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {valueProps.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3 border-t border-line pt-4"><Icon size={18} className="mt-0.5 shrink-0 text-plum-600" /><div><h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink">{title}</h3><p className="mt-1 text-[12.5px] leading-relaxed text-mist">{text}</p></div></div>)}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container>
          <Kicker>Employer workflow</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-ink md:text-[30px]">From verified profile to interviews in one hiring flow</h2>
          <ol className="relative mt-8 grid gap-4 before:absolute before:left-5 before:top-5 before:h-[calc(100%-2.5rem)] before:w-px before:bg-plum-200 lg:grid-cols-4 lg:before:left-0 lg:before:top-1/2 lg:before:h-px lg:before:w-full">
            {workflowPhases.map((phase, index) => (
              <li key={phase.phase} className="relative pl-12 lg:pl-0">
                <span className="absolute left-0 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-plum-200 bg-white font-display text-[13px] font-semibold text-plum-700 lg:left-1/2 lg:-translate-x-1/2">{index + 1}</span>
                <div className="rounded-[10px] border border-line bg-white p-4 shadow-soft lg:mt-16">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-plum-700">{phase.phase}</p>
                  <div className="mt-3 space-y-2">{phase.steps.map((step) => <p key={step} className="rounded-control bg-plum-50/70 px-3 py-2 text-[13px] font-medium text-ink">{step}</p>)}</div>
                  <p className="mt-3 inline-flex rounded-pill bg-white px-2.5 py-1 text-[12px] font-medium text-mist ring-1 ring-line">{phase.status}</p>
                </div>
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
              <h2 className="mt-4 font-display text-[26px] font-bold text-ink md:text-[30px]">Job posting and hiring plans</h2>
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
          <div className="rounded-[12px] border border-white/14 bg-white/[0.06] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/12 pb-4">
              <div><p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-plum-200">Managed recruitment</p><h3 className="mt-2 font-display text-[20px] font-semibold">Senior Sales Manager</h3><p className="mt-1 text-[13px] text-white/62">Bengaluru · 5-8 years · illustrative interface data</p></div>
              <span className="rounded-pill bg-plum-500/20 px-3 py-1.5 text-[12px] font-medium text-plum-100">Shortlisting</span>
            </div>
            <div className="py-4">{[["Requirement Calibration", "Complete"], ["Candidate Sourcing", "Complete"], ["Structured Screening", "In Progress"], ["Shortlist", "Upcoming"], ["Interview Coordination", "Upcoming"], ["Offer / Joining", "Upcoming"]].map(([stage, status], index) => <div key={stage} className="flex items-center justify-between border-b border-white/10 py-3 last:border-0"><div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${index < 2 ? "bg-plum-200" : index === 2 ? "bg-plum-500" : "border border-white/35"}`} /><span className="text-[13.5px] text-white/82">{stage}</span></div><span className="text-[12px] text-white/55">{status}</span></div>)}</div>
            <div className="border-t border-white/12 pt-4"><p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/52">Candidate Pipeline</p><div className="mt-3 grid grid-cols-3 gap-2">{["18 sourced", "8 screened", "4 shortlisted"].map((item) => <div key={item} className="rounded-control border border-white/12 bg-white/[0.04] px-3 py-2 text-[12.5px] text-white/78">{item}</div>)}</div></div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-card border border-line bg-plum-50/60 p-7">
            <ShieldCheck size={26} className="text-plum-600" />
            <h2 className="mt-4 font-display text-[20px] font-semibold text-ink">Employer verification</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-mist">Company identity and business details must be verified before full candidate database access. Access also depends on plan entitlement and candidate consent.</p>
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
