import Link from "next/link";
import {
  FileEdit,
  Users,
  Sparkles,
  Headset,
  RefreshCcw,
  Layers,
  ShieldCheck,
  BadgeCheck,
  FlagOff,
} from "lucide-react";
import { Container, Kicker, PrimaryButton, SecondaryButton, GhostLink } from "@/components/ui";
import { SearchBar } from "@/components/SearchBar";
import { HeroArt } from "@/components/HeroArt";
import { JobCard } from "@/components/JobCard";
import { jobs, services } from "@/lib/data";

const employerBullets = [
  { icon: FileEdit, text: "Post and manage job openings" },
  { icon: Users, text: "Search and shortlist candidates" },
  { icon: Sparkles, text: "AI-assisted matching and screening" },
  { icon: Headset, text: "Recruiter support for difficult roles" },
  { icon: RefreshCcw, text: "Memberships for recurring hiring" },
  { icon: Layers, text: "RPO and bulk hiring solutions" },
];

const employerSteps = [
  { title: "Create your employer account", text: "Set up your company profile in a few minutes." },
  { title: "Post a job or share a hiring requirement", text: "Self-service posting, or hand it to our recruiters." },
  { title: "Review applicants or search the talent database", text: "See structured candidate profiles, not raw resume piles." },
  { title: "Shortlist, interview and hire", text: "Or ask Grow Biz to manage the process end to end." },
];

const candidateSteps = [
  { title: "Create a free profile and upload your resume", text: "Takes a few minutes, no cost to apply." },
  { title: "Set your job preferences and alerts", text: "Roles, locations, salary range and work mode." },
  { title: "Apply to relevant opportunities", text: "Structured applications employers can actually review." },
  { title: "Track progress and access optional career support", text: "See application status in one place." },
];

export default function HomePage() {
  const featuredJobs = jobs.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-plum-50/50">
        <Container className="grid gap-12 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-20">
          <div className="animate-rise">
            <Kicker>Recruitment &amp; job marketplace</Kicker>
            <h1 className="mt-4 text-balance font-display text-[38px] font-bold leading-[1.1] text-ink md:text-[54px]">
              Hire Better. Find Better Opportunities.
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-mist">
              Grow Biz Recruitment &amp; Placement connects companies with qualified talent through
              recruitment services, smart hiring technology and a growing job marketplace.
            </p>

            <div className="mt-8 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <SecondaryButton href="/employers">Hire Talent</SecondaryButton>
              <span className="text-[13.5px] text-mist">or search jobs above</span>
            </div>

            <p className="mt-8 text-[13.5px] text-mist">
              Recruitment · Job Portal · Staffing · RPO · Campus Hiring · Career Support
            </p>
          </div>

          <HeroArt />
        </Container>
      </section>

      {/* Employer strip */}
      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <Kicker>For employers</Kicker>
            <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-tight text-ink md:text-[32px]">
              Everything You Need to Hire — In One Place
            </h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-mist">
              Post jobs, discover candidates, manage applicants and get expert recruitment support
              when you need it. Choose self-service memberships or let our recruitment team manage
              the hiring process for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton href="/employers">Post a Job</PrimaryButton>
              <SecondaryButton href="/recruitment-services">Talk to a Specialist</SecondaryButton>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {employerBullets.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 rounded-card border border-line p-4">
                <Icon size={18} className="mt-0.5 shrink-0 text-plum-600" />
                <span className="text-[14.5px] leading-snug text-ink/85">{text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Candidate strip */}
      <section className="border-b border-line bg-plum-900 py-16 text-white md:py-20">
        <Container className="grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div>
            <Kicker>
              <span className="text-plum-200">For candidates</span>
            </Kicker>
            <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-tight md:text-[32px]">
              Your Next Opportunity Starts Here
            </h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-white/70">
              Create your profile, discover relevant jobs and track your applications from one
              place. Job applications are free. Optional career services can help you improve your
              resume, interview skills and profile visibility.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton href="/jobs" className="bg-white !text-plum-700 hover:bg-white/90">
                Create Free Profile
              </PrimaryButton>
              <Link
                href="/jobs"
                className="inline-flex items-center rounded-pill border border-white/30 px-5 py-3 text-[15px] font-medium text-white hover:bg-white/10"
              >
                Browse Jobs
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              ["Free", "to search & apply"],
              ["10", "job categories live"],
              ["No", "guaranteed-placement claims"],
              ["Optional", "career support only"],
            ].map(([big, small]) => (
              <div key={small} className="rounded-card border border-white/15 p-4">
                <p className="font-display text-[26px] font-bold">{big}</p>
                <p className="mt-1 text-[13px] text-white/60">{small}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Recruitment services grid */}
      <section className="border-b border-line py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Recruitment services</Kicker>
              <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-tight text-ink md:text-[32px]">
                Recruitment Support for Every Stage of Growth
              </h2>
            </div>
            <GhostLink href="/recruitment-services">View all services</GhostLink>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                href={`/recruitment-services#${s.slug}`}
                className="group rounded-card border border-line p-5 transition-colors hover:border-plum-300"
              >
                <h3 className="font-display text-[16px] font-semibold text-ink group-hover:text-plum-600">
                  {s.name}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mist">{s.problem}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Featured jobs */}
      <section className="border-b border-line bg-plum-50/50 py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Latest openings</Kicker>
              <h2 className="mt-4 text-balance font-display text-[28px] font-bold leading-tight text-ink md:text-[32px]">
                Fresh Roles From Verified Employers
              </h2>
            </div>
            <GhostLink href="/jobs">View all jobs</GhostLink>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-14 md:grid-cols-2">
          <div>
            <Kicker>How it works — employers</Kicker>
            <ol className="mt-6 flex flex-col gap-6">
              {employerSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-600 font-display text-[14px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{step.title}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-mist">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <Kicker>How it works — candidates</Kicker>
            <ol className="mt-6 flex flex-col gap-6">
              {candidateSteps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-100 font-display text-[14px] font-semibold text-plum-700">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{step.title}</p>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-mist">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Campus + career resources teaser */}
      <section className="border-b border-line py-16 md:py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-line bg-plum-50/60 p-8">
            <Kicker>Campus &amp; internships</Kicker>
            <h3 className="mt-4 font-display text-[22px] font-bold text-ink">From Campus to Career</h3>
            <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-mist">
              We partner with colleges, universities and training institutions to connect students
              with internships, fresher roles, placement drives and career-readiness support.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <SecondaryButton href="/campus">Partner With Us</SecondaryButton>
              <GhostLink href="/jobs?fresher=true">Explore Fresher Jobs</GhostLink>
            </div>
          </div>

          <div className="rounded-card border border-line p-8">
            <Kicker>Career resources</Kicker>
            <h3 className="mt-4 font-display text-[22px] font-bold text-ink">
              Build a Stronger Career Profile
            </h3>
            <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-mist">
              Resume tips, interview preparation, salary conversations and skill roadmaps — free
              content to help you move your career forward.
            </p>
            <div className="mt-5">
              <GhostLink href="/career-resources">Explore career resources</GhostLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-plum-50/60 py-12">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-plum-600" />
              <p className="text-[14px] leading-relaxed text-ink/80">
                Applying to jobs on Grow Biz Jobs is always free.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <BadgeCheck size={20} className="mt-0.5 shrink-0 text-plum-600" />
              <p className="text-[14px] leading-relaxed text-ink/80">
                We do not promise guaranteed placement — hiring decisions stay with employers.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <FlagOff size={20} className="mt-0.5 shrink-0 text-plum-600" />
              <p className="text-[14px] leading-relaxed text-ink/80">
                Report suspicious jobs or payment requests directly from the platform.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20">
        <Container className="flex flex-col items-start gap-6 rounded-card bg-plum-600 p-10 text-white md:flex-row md:items-center md:justify-between md:p-14">
          <div>
            <h2 className="max-w-md text-balance font-display text-[26px] font-bold leading-tight md:text-[30px]">
              Ready to hire faster, or find your next opportunity?
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="rounded-pill bg-white px-5 py-3 text-[15px] font-medium text-plum-700 hover:bg-white/90"
            >
              Search Jobs
            </Link>
            <Link
              href="/employers"
              className="rounded-pill border border-white/40 px-5 py-3 text-[15px] font-medium text-white hover:bg-white/10"
            >
              Hire Talent
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
