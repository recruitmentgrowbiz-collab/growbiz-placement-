import { isActiveJob } from "@/features/jobs/utils/lifecycle";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Briefcase, CalendarDays, Clock, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { ApplyPanel } from "@/components/ApplyPanel";
import { JobCard } from "@/components/JobCard";
import { JobCompanyAvatar } from "@/components/JobCompanyAvatar";
import { JobStickyHeader } from "@/components/jobs/JobStickyHeader";
import { Container, Kicker, SecondaryButton } from "@/components/ui";
import { getAllJobs, getJobBySlug, getRelatedJobs } from "@/features/jobs/services/jobs";
import { getCompanyBySlug, getCompanySlugByName } from "@/features/companies/services/companies";
import { buildJobPostingSchema, seoMetadata, breadcrumbSchema, jsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const jobs = await getAllJobs();
  return jobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = await getJobBySlug(params.id);
  if (!job) notFound();
  return seoMetadata(`/jobs/${job.id}`, `${job.title} in ${job.location} | ${job.company} | Grow Biz Jobs`,
    `${job.title} at ${job.company}, ${job.location}. ${job.experience}; ${job.mode}. Review requirements and apply free.`, !job.isDemo && isActiveJob(job));
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await getJobBySlug(params.id);
  if (!job) notFound();

  const companySlug = await getCompanySlugByName(job.company);
  const company = await getCompanyBySlug(companySlug);
  const related = await getRelatedJobs(job.id, 4);
  const closed = !isActiveJob(job);
  const schema = buildJobPostingSchema(job, company);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Jobs", path: "/jobs" }, { name: job.title, path: `/jobs/${job.id}` }])) }} />
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />}
      <JobStickyHeader
        title={job.title}
        company={job.company}
        companyHref={`/companies/${companySlug}`}
        logoUrl={company?.logoUrl}
        location={job.location}
        mode={job.mode}
        type={job.type}
        experience={job.experience}
        closed={closed}
        jobHref={`/jobs/${job.id}`}
      />
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-5">
          <nav aria-label="Breadcrumb" className="text-[13.5px] text-mist">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-plum-700">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/jobs" className="hover:text-plum-700">Jobs</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink/75">{job.title}</li>
            </ol>
          </nav>
        </Container>
      </section>

      <article>
        <section className="relative overflow-hidden bg-plum-50/55">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(201,13,255,0.09),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.76),rgba(253,242,255,0.5))]" />
          <Container className="relative grid gap-8 py-10 lg:grid-cols-[1fr_330px] lg:items-start lg:py-12">
            <div className="rounded-card border border-line bg-white/82 p-5 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.42),0_1px_0_rgba(255,255,255,0.9)_inset] md:p-7">
              <div className="flex flex-wrap items-center gap-2">
                <Kicker>{job.industry}</Kicker>
                {job.isDemo && <span className="rounded-pill border border-amber-200 bg-amber-50 px-3 py-1 text-[12px] font-medium text-amber-700">Demonstration listing</span>}
              </div>
              {job.isDemo && <p className="mt-3 text-sm text-mist">Demonstration listing. This is not a confirmed live vacancy.</p>}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {closed && <span className="rounded-pill bg-line px-3 py-1 text-[12.5px] font-medium text-ink/70">No longer accepting applications</span>}
                {company?.verificationStatus === "verified" && (
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-green-50 px-2.5 py-1 text-[12px] font-medium text-green-700">
                    <BadgeCheck size={13} aria-hidden="true" /> Verified Employer
                  </span>
                )}
              </div>
              <div className="mt-5 flex gap-4">
                <JobCompanyAvatar company={job.company} logoUrl={company?.logoUrl} size="lg" />
                <div className="min-w-0">
                  <h1 className="max-w-3xl text-balance font-display text-[34px] font-bold leading-tight text-ink md:text-[46px]">
                    {job.title}
                  </h1>
                  <p className="mt-2 text-[17px] text-mist">
                    <Link href={`/companies/${companySlug}`} className="hover:text-plum-700">{job.company}</Link>
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14.5px] text-ink/75">
                <Meta icon={MapPin}>{job.location}</Meta>
                <Meta icon={Briefcase}>{job.mode} - {job.type}</Meta>
                <Meta icon={Clock}>{job.experience}</Meta>
                {job.salary && <Meta icon={Wallet}>{job.salary}</Meta>}
              </div>
              <div className="mt-7 grid gap-3 border-t border-line pt-5 sm:grid-cols-3">
                <HeroFact icon={ShieldCheck} label="Applications" value="Free on Grow Biz" />
                <HeroFact icon={CalendarDays} label="Posted" value={job.publishedAt ? new Date(job.publishedAt).toLocaleDateString("en-IN") : job.posted} />
                <HeroFact icon={Briefcase} label="Hiring mode" value={job.type} />
              </div>
            </div>
            <aside className="hidden lg:block lg:sticky lg:top-24">
              <ApplyPanel jobTitle={job.title} company={job.company} screeningQuestions={job.screeningQuestions} jobHref={`/jobs/${job.id}`} closed={closed} />
            </aside>
          </Container>
        </section>

        <section className="bg-paper py-10">
          <Container className="grid gap-8 lg:grid-cols-[1fr_330px]">
            <div className="min-w-0 space-y-8">
              <ContentSection title="About the role"><p>{job.about || "Role description will appear here once the employer publishes the full listing."}</p></ContentSection>
              <ListSection title="Responsibilities" items={job.responsibilities} />
              <ListSection title="Requirements" items={job.mustHave} emptyText="Requirements will appear here once the employer publishes the full listing." />
              <ListSection title="Preferred qualifications" items={job.niceToHave} />
              <ContentSection title="Skills">
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag) => <span key={tag} className="rounded-pill border border-line bg-white px-3 py-1.5 text-[13px] text-ink/75">{tag}</span>)}
                </div>
              </ContentSection>

              <ContentSection title="Company summary">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <JobCompanyAvatar company={job.company} logoUrl={company?.logoUrl} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[18px] font-semibold text-ink">{job.company}</h3>
                      {company?.verificationStatus === "verified" && <span className="text-[12.5px] font-medium text-green-700">Verified Employer</span>}
                    </div>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{company?.description ?? job.about}</p>
                    <div className="mt-4"><SecondaryButton href={`/companies/${companySlug}`}>View Company Profile</SecondaryButton></div>
                  </div>
                </div>
              </ContentSection>

              <ContentSection title="Candidate safety">
                <p>Applying to jobs on Grow Biz Jobs is free. Grow Biz does not promise guaranteed placement. Optional career services are separate from employer hiring decisions, and suspicious jobs or payment requests can be reported.</p><Link href={`/report?job=${encodeURIComponent(job.id)}`} className="mt-3 inline-flex min-h-11 items-center text-plum-600 underline">Report this job or a payment request</Link>
              </ContentSection>
            </div>

            <aside className="space-y-4">
              <InfoCard job={job} />
            </aside>
          </Container>
        </section>

        {related.length > 0 && (
          <section className="border-t border-line bg-white py-12">
            <Container>
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <Kicker>Related jobs</Kicker>
                  <h2 className="mt-3 font-display text-[28px] font-bold text-ink">Similar opportunities</h2>
                </div>
                <SecondaryButton href="/jobs">View More Jobs</SecondaryButton>
              </div>
              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                {related.map((item) => <JobCard key={item.id} job={item} />)}
              </div>
            </Container>
          </section>
        )}
      </article>

      <div className="h-24 lg:hidden" aria-hidden="true" />

      <div className="glass-soft fixed inset-x-0 bottom-0 z-header border-t border-line p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lift lg:hidden">
        <Container className="px-0">
          <ApplyPanel jobTitle={job.title} company={job.company} screeningQuestions={job.screeningQuestions} jobHref={`/jobs/${job.id}`} closed={closed} compact />
        </Container>
      </div>
    </>
  );
}

function ContentSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-line bg-white p-5 md:p-6">
      <h2 className="font-display text-[20px] font-semibold text-ink">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-mist">{children}</div>
    </section>
  );
}

function ListSection({ title, items, emptyText }: { title: string; items: string[]; emptyText?: string }) {
  if (!items.length) return emptyText ? <ContentSection title={title}><p>{emptyText}</p></ContentSection> : null;
  return <ContentSection title={title}><ul className="grid gap-2">{items.map((item) => <li key={item} className="flex gap-2.5 text-ink/82"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-400" />{item}</li>)}</ul></ContentSection>;
}

function InfoCard({ job }: { job: Awaited<ReturnType<typeof getJobBySlug>> & {} }) {
  const rows = [
    ["Experience", job.experience],
    ["Employment Type", job.type],
    ["Work Mode", job.mode],
    ["Location", job.location],
    ["Industry", job.industry],
    ["Salary", job.salary],
    ["Posted", job.publishedAt ? new Date(job.publishedAt).toLocaleDateString("en-IN") : job.posted],
    ["Closing date", job.expiresAt ? new Date(job.expiresAt).toLocaleDateString("en-IN") : undefined],
  ].filter(([, value]) => value);
  return (
    <section className="rounded-card border border-line bg-white p-5">
      <h2 className="font-display text-[18px] font-semibold text-ink">Job details</h2>
      <dl className="mt-4 grid gap-3">
        {rows.map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"><dt className="text-[13.5px] text-mist">{label}</dt><dd className="text-right text-[13.5px] font-medium text-ink/82">{value}</dd></div>)}
      </dl>
    </section>
  );
}

function Meta({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return <span className="inline-flex min-h-9 items-center gap-1.5 rounded-pill border border-line bg-white px-3 text-[13.5px] shadow-sm"><Icon size={15} className="text-plum-600" aria-hidden="true" /> {children}</span>;
}

function HeroFact({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return (
    <div className="rounded-card bg-plum-50/70 p-3">
      <div className="flex items-center gap-2 text-[12px] font-medium text-mist">
        <Icon size={14} className="text-plum-600" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-1 text-[13.5px] font-semibold text-ink">{value}</p>
    </div>
  );
}
