import { jsonLd, organizationSchema, websiteSchema, pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Search, UsersRound } from "lucide-react";
import { Container, GhostLink, Kicker, PrimaryButton, SecondaryButton } from "@/components/ui";
import { SearchBar } from "@/components/SearchBar";
import { HeroMedia } from "@/components/HeroMedia";
import { JobCard } from "@/components/JobCard";
import { services } from "@/lib/data";
import { getFeaturedJobs } from "@/features/jobs/services/jobs";
import {
  campusAudiences,
  candidateBenefits,
  candidateSteps,
  employerCapabilities,
  employerSteps,
  getFeaturedResources,
  trustItems,
} from "@/features/homepage/content";

export const metadata = pageMetadata("/");

export default async function HomePage() {
  const [featuredJobs, resources] = await Promise.all([getFeaturedJobs(6), getFeaturedResources()]);
  const servicePreview = services
    .filter((service) =>
      [
        "corporate-recruitment",
        "it-non-it-recruitment",
        "fresher-graduate-placement",
        "bulk-hiring",
        "executive-search",
        "contract-temporary-staffing",
        "campus-recruitment",
        "recruitment-process-outsourcing",
      ].includes(service.slug)
    )
    .slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([organizationSchema, websiteSchema]) }} />
      <section className="border-b border-line bg-plum-50/50">
        <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:py-20">
          <div className="animate-rise">
            <Kicker>Recruitment &amp; job marketplace</Kicker>
            <h1 className="mt-4 max-w-[16ch] text-balance font-display text-[clamp(2.45rem,8vw,4.25rem)] font-bold leading-[1.06] text-ink">
              Hire Better. Find Better <span className="text-brand-accent">Opportunities.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-mist md:text-[17px]">
              Grow Biz Recruitment &amp; Placement connects companies with qualified talent through
              recruitment services, hiring technology and Grow Biz Jobs, a job portal for India. Candidates can search and apply free.
            </p>

            <div className="mt-8 max-w-xl">
              <SearchBar />
            </div>

            <div className="mt-5 flex flex-col gap-3 xs:flex-row xs:items-center">
              <SecondaryButton href="/employers" className="w-full xs:w-auto">
                Hire Talent
              </SecondaryButton>
              <span className="text-[13.5px] text-mist">or search jobs above</span>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[13.5px] text-mist">
              {["Recruitment", "Job Portal", "Staffing", "RPO", "Campus Hiring", "Career Support"].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-plum-300" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <HeroMedia variant="home" />
        </Container>
      </section>

      <section className="border-b border-line bg-white py-14 md:py-16 lg:py-20">
        <Container className="grid gap-9 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <Kicker>For employers</Kicker>
            <h2 className="mt-4 text-balance font-display text-[30px] font-bold leading-tight text-ink md:text-[36px]">
              Everything You Need to Hire - In One Place
            </h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-mist">
              Post jobs, discover candidates, manage applicants and get expert recruitment support
              when you need it. Choose self-service memberships or let our recruitment team manage
              the hiring process for you.
            </p>
            <div className="mt-6">
              <PrimaryButton href="/employers">Explore Employer Solutions</PrimaryButton>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {employerCapabilities.map(({ icon: Icon, title, text }) => (
              <article key={title} className="glass-interactive group rounded-card border border-line bg-paper p-4">
                <Icon size={19} className="text-plum-600" aria-hidden="true" />
                <h3 className="mt-3 font-display text-[15.5px] font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="gb-candidate-panel relative overflow-hidden bg-plum-900 py-14 text-white md:py-16 lg:py-20">
        <Container className="relative z-10 grid gap-9 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="max-w-xl">
            <Kicker><span className="text-plum-200">For candidates</span></Kicker>
            <h2 className="mt-4 text-balance font-display text-[30px] font-bold leading-tight md:text-[36px]">
              Your Next Opportunity Starts Here
            </h2>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-white/72">
              Create your profile, discover relevant jobs and track your applications from one
              place. Job applications are free. Optional career services can help improve your
              resume, interview skills and profile visibility.
            </p>
            <div className="mt-6 flex flex-col gap-3 xs:flex-row">
              <Link href="/jobs" className="gb-button gb-button--candidate-primary inline-flex min-h-11 items-center justify-center rounded-pill bg-white px-5 py-3 text-[15px] font-semibold text-plum-700">
                Browse Jobs
              </Link>
              <Link href="/candidate/signup" className="gb-button gb-button--candidate-secondary inline-flex min-h-11 items-center justify-center rounded-pill border border-white/25 bg-white/[0.06] px-5 py-3 text-[15px] font-medium text-white">
                Create Profile
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {candidateBenefits.map(({ icon: Icon, title, text }) => (
              <article key={title} className="gb-candidate-card group rounded-card border border-white/12 bg-white/[0.055] p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/12 bg-white/[0.07] text-plum-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-[15.5px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/68">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-paper py-14 md:py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Kicker>Recruitment services</Kicker>
              <h2 className="mt-4 text-balance font-display text-[30px] font-bold leading-tight text-ink md:text-[36px]">
                Recruitment Support for Every Stage of Growth
              </h2>
            </div>
            <div className="gb-service-cta-group flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:justify-end">
              <SecondaryButton href="/recruitment-services" className="gb-service-cta gb-service-cta--secondary w-full justify-center sm:w-[190px]">
                Explore Recruitment Services <ArrowRight size={15} aria-hidden="true" />
              </SecondaryButton>
              <PrimaryButton href="/recruitment-services#hiring-requirement" className="gb-service-cta gb-service-cta--primary w-full justify-center sm:w-[190px]">
                Share Hiring Requirement <ArrowRight size={15} aria-hidden="true" />
              </PrimaryButton>
            </div>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {servicePreview.map((service) => (
              <Link key={service.slug} href={`/recruitment-services#${service.slug}`} className="glass-interactive group rounded-card border border-line bg-white p-4">
                <h3 className="font-display text-[15.5px] font-semibold text-ink group-hover:text-ink">{service.name}</h3>
                <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-mist">{service.problem}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-plum-600">
                  Explore service <ArrowRight size={14} className="gb-interaction-arrow" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-white py-14 md:py-16 lg:py-20">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Kicker>Latest opportunities</Kicker>
              <h2 className="mt-4 text-balance font-display text-[30px] font-bold leading-tight text-ink md:text-[36px]">
                Explore Job Roles
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mist">
                Explore the job marketplace. Current listings are demonstration examples, not confirmed live vacancies.
              </p>
            </div>
            <GhostLink href="/jobs">View All Jobs</GhostLink>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featuredJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-plum-50/55 py-14 md:py-16 lg:py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          <ProcessCard kicker="How it works - employers" title="From hiring need to shortlist" steps={employerSteps} href="/employers" cta="Start Hiring" />
          <ProcessCard kicker="How it works - candidates" title="From profile to application" steps={candidateSteps} href="/jobs" cta="Search Jobs" note="Job applications are free." />
        </Container>
      </section>

      <section className="border-b border-line bg-white py-14 md:py-16 lg:py-20">
        <Container className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-card border border-line bg-plum-50/70 p-6 md:p-8">
            <Kicker>Campus &amp; graduate hiring</Kicker>
            <h2 className="mt-4 font-display text-[28px] font-bold leading-tight text-ink md:text-[34px]">
              From Campus to Career
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">
              Connect students, freshers, institutes and employers through internships, fresher
              roles, placement drives and campus hiring partnerships.
            </p>
            <div className="mt-5 grid gap-2">
              {campusAudiences.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-[14px] text-ink/82">
                  <Icon size={17} className="text-plum-600" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <SecondaryButton href="/campus">Explore Campus Hiring</SecondaryButton>
            </div>
          </div>

          <div className="rounded-card border border-line p-6 md:p-8">
            <Kicker>Career resources</Kicker>
            <h2 className="mt-4 font-display text-[28px] font-bold leading-tight text-ink md:text-[34px]">
              Career Resources
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {resources.map(({ icon: Icon, title, text, href }) => (
                <Link key={title} href={href} className="glass-interactive group rounded-card border border-line p-4 transition-colors hover:border-plum-300">
                  <Icon size={18} className="text-plum-600" aria-hidden="true" />
                  <h3 className="mt-3 font-display text-[15.5px] font-semibold text-ink group-hover:text-ink">{title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">{text}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <GhostLink href="/career-resources">Explore Career Resources</GhostLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-paper py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-card border border-line bg-white p-4">
                <Icon size={19} className="text-plum-600" aria-hidden="true" />
                <h3 className="mt-3 font-display text-[15px] font-semibold text-ink">{title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">{text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-14 md:py-16 lg:py-20">
        <Container>
          <div className="gb-final-cta relative overflow-hidden rounded-card bg-plum-600 p-4 text-white sm:p-5">
            <div className="relative z-10 grid gap-3 lg:grid-cols-2">
              <FinalCta icon={Search} title="Find Opportunities" text="Search roles and apply free through Grow Biz Jobs." href="/jobs" cta="Search Jobs" />
              <FinalCta icon={UsersRound} title="Build Your Team" text="Post jobs or get recruitment support from Grow Biz." href="/employers" cta="Hire Talent" secondary />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function ProcessCard({ kicker, title, steps, href, cta, note }: { kicker: string; title: string; steps: string[]; href: string; cta: string; note?: string }) {
  return (
    <article className="rounded-card border border-line bg-white p-5 shadow-soft md:p-7">
      <Kicker>{kicker}</Kicker>
      <h2 className="mt-4 font-display text-[24px] font-bold leading-tight text-ink md:text-[28px]">{title}</h2>
      <ol className="mt-6 grid gap-4">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-plum-100 font-display text-[13px] font-semibold text-plum-700">
              {index + 1}
            </span>
            <span className="pt-1 text-[14.5px] leading-relaxed text-ink/84">{step}</span>
          </li>
        ))}
      </ol>
      {note && <p className="mt-5 inline-flex items-center gap-2 text-[13.5px] font-medium text-plum-700"><CheckCircle2 size={16} aria-hidden="true" />{note}</p>}
      <div className="mt-6">
        <SecondaryButton href={href}>{cta}</SecondaryButton>
      </div>
    </article>
  );
}

function FinalCta({ icon: Icon, title, text, href, cta, secondary = false }: { icon: typeof BriefcaseBusiness; title: string; text: string; href: string; cta: string; secondary?: boolean }) {
  return (
    <article className="gb-final-cta-card group rounded-card border p-4 text-ink sm:p-5">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-plum-100 bg-plum-50 text-plum-600">
        <Icon size={19} aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-[22px] font-bold">{title}</h2>
      <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{text}</p>
      <Link
        href={href}
        className={`gb-button mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-5 py-3 text-[14.5px] font-semibold ${
          secondary ? "border border-plum-200 bg-white text-plum-700" : "bg-plum-600 text-white"
        }`}
      >
        {cta}
        <ArrowRight size={15} className="gb-interaction-arrow" aria-hidden="true" />
      </Link>
    </article>
  );
}
