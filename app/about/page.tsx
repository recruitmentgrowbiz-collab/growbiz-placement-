import Link from "next/link";
import { ArrowDown, ArrowRight, BriefcaseBusiness, Check, CircleDot, ShieldCheck, UserRound } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { publicSeo } from "@/features/public-content/seo-content";
import { Container, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";

export const metadata = pageMetadata("/about");

const employerActions = ["Post jobs", "Manage applicants", "Search eligible talent", "Request managed recruitment"];
const candidateActions = ["Search jobs", "Apply free", "Manage their profile", "Track applications"];

const model = [
  {
    title: "Employers",
    icon: BriefcaseBusiness,
    items: ["Post Jobs", "Search Talent", "Managed Recruitment"],
  },
  {
    title: "Grow Biz",
    icon: CircleDot,
    items: ["Recruitment Team", "Grow Biz Jobs", "Automation", "Hiring Workflow"],
  },
  {
    title: "Candidates",
    icon: UserRound,
    items: ["Search Jobs", "Apply Free", "Track Applications", "Career Resources"],
  },
];

const serviceGroups = [
  {
    title: "Recruitment",
    text: "Role-based hiring support for growing teams.",
    items: ["Corporate Recruitment", "IT & Non-IT Recruitment", "Sales & Marketing Hiring", "Experienced Professional Placement", "Executive Search"],
  },
  {
    title: "Volume & Staffing",
    text: "Support for larger hiring needs and flexible workforce models.",
    items: ["Bulk Hiring", "Contract & Temporary Staffing", "Recruitment Process Outsourcing (RPO)"],
  },
  {
    title: "Early Careers",
    text: "Fresher, internship and institute-led hiring pathways.",
    items: ["Fresher & Graduate Placement", "Internship Placement", "Campus Recruitment"],
  },
  {
    title: "Platform",
    text: "Grow Biz Jobs self-service hiring platform for employers.",
    items: ["Job Posting", "Applicant Management", "Candidate Search", "Hiring Workspace"],
  },
];

const principles = [
  ["Human Recruitment Support", "Recruiters support sourcing, screening, shortlists and coordination where managed hiring is required."],
  ["Technology-Enabled Hiring", "Grow Biz Jobs supports job posting, applicant management, candidate search and hiring workflows."],
  ["Flexible Self-Service + Managed Recruitment", "Employers can use platform tools or request deeper support for recruitment, staffing, campus hiring and RPO."],
  ["Clear Candidate & Employer Workflows", "Candidates and employers follow separate paths with clear application, access and hiring controls."],
];

const trustPoints = [
  "Job applications are free for candidates",
  "Grow Biz does not guarantee placement",
  "Employer verification controls restricted access",
  "Candidate data access follows permissions and consent",
];

const normalCard =
  "rounded-card border border-line bg-white shadow-[0_16px_34px_-24px_rgba(15,23,42,0.45),0_1px_0_rgba(255,255,255,0.9)_inset] transition duration-[220ms] ease-out hover:-translate-y-1 hover:border-plum-200 hover:shadow-[0_24px_44px_-26px_rgba(164,0,207,0.28),0_10px_24px_-24px_rgba(15,23,42,0.5),0_1px_0_rgba(255,255,255,0.9)_inset]";

function MiniPill({ children }: { children: string }) {
  return <span className="rounded-pill border border-plum-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink/75">{children}</span>;
}

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <Kicker>About Grow Biz</Kicker>
            <h1 className="mt-4 max-w-3xl text-balance font-display text-[34px] font-bold leading-[1.12] text-ink md:text-[44px]">
              {publicSeo["/about"].h1}
            </h1>
            <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-mist">
              Grow Biz Recruitment &amp; Placement helps companies build stronger teams and helps people discover meaningful career opportunities. We combine recruitment expertise, technology, automation and a growing talent network through recruitment services and Grow Biz Jobs.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/jobs">Search Jobs</PrimaryButton>
              <SecondaryButton href="/employers">Hire Talent</SecondaryButton>
            </div>
          </div>

          <div className="rounded-card border border-line bg-white p-5 shadow-sm">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
              <div className="rounded-card bg-plum-50 p-4">
                <BriefcaseBusiness className="mx-auto text-plum-600" size={24} aria-hidden="true" />
                <p className="mt-3 font-display text-[16px] font-semibold text-ink">Employers</p>
              </div>
              <ArrowRight className="text-plum-500" size={20} aria-hidden="true" />
              <div className="rounded-card bg-plum-50 p-4">
                <UserRound className="mx-auto text-plum-600" size={24} aria-hidden="true" />
                <p className="mt-3 font-display text-[16px] font-semibold text-ink">Candidates</p>
              </div>
            </div>
            <div className="my-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-line" />
              <div className="rounded-pill bg-plum-700 px-4 py-2 text-[13px] font-semibold text-white">Grow Biz</div>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["Recruitment", "Grow Biz Jobs", "Staffing", "Campus", "RPO"].map((item) => <MiniPill key={item}>{item}</MiniPill>)}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-white py-16 md:py-20">
        <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Kicker>What Grow Biz does</Kicker>
            <h2 className="mt-4 max-w-md font-display text-[28px] font-bold leading-tight text-ink md:text-[36px]">
              Recruitment expertise meets hiring technology.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-display text-[18px] font-semibold text-ink">Employers can</h3>
              <ul className="mt-4 grid gap-3 text-[14.5px] text-mist">
                {employerActions.map((item) => <li key={item} className="flex gap-2"><Check size={16} className="mt-0.5 text-plum-600" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-[18px] font-semibold text-ink">Candidates can</h3>
              <ul className="mt-4 grid gap-3 text-[14.5px] text-mist">
                {candidateActions.map((item) => <li key={item} className="flex gap-2"><Check size={16} className="mt-0.5 text-plum-600" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/45 py-16 md:py-20">
        <Container>
          <Kicker>One connected model</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-ink md:text-[32px]">How the recruitment ecosystem fits together</h2>
          <div className="mt-9 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
            {model.map((group, index) => {
              const Icon = group.icon;
              return (
                <div key={group.title} className="contents">
                  <section className={`${normalCard} p-5`}>
                    <div className="flex items-center gap-3">
                      <Icon size={21} className="text-plum-600" aria-hidden="true" />
                      <h3 className="font-display text-[18px] font-semibold text-ink">{group.title}</h3>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {group.items.map((item) => <MiniPill key={item}>{item}</MiniPill>)}
                    </div>
                  </section>
                  {index < model.length - 1 ? (
                    <div className="flex items-center justify-center text-plum-500 lg:px-2">
                      <ArrowDown className="lg:hidden" size={20} aria-hidden="true" />
                      <ArrowRight className="hidden lg:block" size={22} aria-hidden="true" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-white py-16 md:py-20">
        <Container>
          <Kicker>Service scope</Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-ink md:text-[32px]">Recruitment, staffing, campus and platform support</h2>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {serviceGroups.map((group) => (
              <section key={group.title} className={`${normalCard} p-5`}>
                <h3 className="text-[12px] font-bold uppercase tracking-[0.14em] text-plum-700">{group.title}</h3>
                <p className="mt-3 min-h-[42px] text-[13.5px] leading-relaxed text-mist">{group.text}</p>
                <ul className="mt-5 grid gap-2.5 text-[14.5px] text-ink/78">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check size={15} className="mt-1 shrink-0 text-plum-600" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container>
          <Kicker><span className="text-plum-200">What makes the model different</span></Kicker>
          <h2 className="mt-4 max-w-2xl font-display text-[26px] font-bold text-white md:text-[32px]">A practical mix of people, platform and process</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {principles.map(([title, text]) => (
              <section key={title} className="rounded-card border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_42px_-30px_rgba(0,0,0,0.75),0_1px_0_rgba(255,255,255,0.08)_inset] transition duration-[220ms] ease-out hover:-translate-y-1 hover:border-plum-300/35 hover:bg-white/[0.065]">
                <h3 className="font-display text-[18px] font-semibold">{title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/68">{text}</p>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-white py-10">
        <Container>
          <div className="grid gap-3 md:grid-cols-4">
            {trustPoints.map((item) => (
              <div key={item} className={`${normalCard} flex gap-2 p-4 text-[13.5px] leading-relaxed text-mist`}>
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-plum-600" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-plum-50/60 py-16 md:py-20">
        <Container className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-[28px] font-bold text-ink md:text-[34px]">Ready to hire or explore opportunities?</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mist">Use Grow Biz Jobs to search opportunities, or connect with Grow Biz for hiring and recruitment support.</p>
            <Link href="/recruitment-services" className="mt-4 inline-flex items-center gap-1 text-[14.5px] font-medium text-plum-700 hover:text-plum-800">
              Explore Recruitment Services <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/jobs">Search Jobs</PrimaryButton>
            <SecondaryButton href="/employers">Hire Talent</SecondaryButton>
          </div>
        </Container>
      </section>
    </>
  );
}
