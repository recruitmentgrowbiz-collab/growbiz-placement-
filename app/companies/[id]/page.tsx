import { seoMetadata, breadcrumbSchema, jsonLd } from "@/lib/seo";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, BriefcaseBusiness, Building2, Globe, MapPin } from "lucide-react";
import { Container, Kicker, SecondaryButton } from "@/components/ui";
import { JobCard } from "@/components/JobCard";
import { getCompanyBySlug, getCompanyStaticParams, getJobsByCompany } from "@/features/companies/services/companies";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getCompanyStaticParams();
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const company = await getCompanyBySlug(params.id);
  if (!company) notFound();
  const jobs = await getJobsByCompany(company.id);
  return seoMetadata(`/companies/${company.slug}`, `${company.name} Jobs & Careers | Grow Biz Jobs`,
    `Explore ${company.name} jobs and careers${company.industry ? ` in ${company.industry}` : ""}. View company details and ${jobs.length} listed roles on Grow Biz Jobs.`, !company.isDemo);
}

export default async function CompanyProfilePage({ params }: { params: { id: string } }) {
  const company = await getCompanyBySlug(params.id);
  if (!company) notFound();

  const jobs = await getJobsByCompany(company.id);
  const verified = company.verificationStatus === "verified";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Jobs", path: "/jobs" }, { name: company.name, path: `/companies/${company.slug}` }])) }} />
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-5">
          <nav aria-label="Breadcrumb" className="text-[13.5px] text-mist">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-plum-700">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/jobs" className="hover:text-plum-700">Jobs</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink/75">{company.name}</li>
            </ol>
          </nav>
        </Container>
      </section>

      <section className="border-b border-line bg-white">
        <Container className="py-10 md:py-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-card border border-line bg-plum-50">
              <Building2 size={30} className="text-plum-500" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              {company.isDemo && <p className="mb-3 text-sm text-mist">Demonstration company profile. Business details and vacancies are not verified.</p>}
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-[32px] font-bold leading-tight text-ink md:text-[42px]">{company.name}</h1>
                {verified && (
                  <span className="inline-flex items-center gap-1.5 rounded-pill bg-green-50 px-2.5 py-1 text-[12px] font-medium text-green-700">
                    <BadgeCheck size={13} aria-hidden="true" /> Verified Employer
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[14.5px] text-mist">
                {company.industry && <Meta icon={BriefcaseBusiness}>{company.industry}</Meta>}
                {company.locations.length > 0 && <Meta icon={MapPin}>{company.locations[0]}</Meta>}
                {company.size && <span>{company.size}</span>}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-plum-600 hover:text-plum-700">
                    <Globe size={14} aria-hidden="true" /> Website
                  </a>
                )}
              </div>
              <p className="mt-4 text-[14.5px] font-medium text-plum-700">{jobs.length} active role{jobs.length === 1 ? "" : "s"}</p>
              <div className="mt-5"><SecondaryButton href="#open-roles">View Open Jobs</SecondaryButton></div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-10">
        <Container className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-8">
            {company.description && (
              <section className="rounded-card border border-line bg-white p-5 md:p-6">
                <Kicker>Company overview</Kicker>
                <h2 className="mt-3 font-display text-[24px] font-semibold text-ink">About {company.name}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">{company.description}</p>
              </section>
            )}

            <section id="open-roles" className="rounded-card border border-line bg-white p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <Kicker>Open roles</Kicker>
                  <h2 className="mt-3 font-display text-[24px] font-semibold text-ink">Jobs at {company.name}</h2>
                </div>
                <SecondaryButton href="/jobs">View All Jobs</SecondaryButton>
              </div>
              {jobs.length > 0 ? (
                <div className="mt-6 grid gap-4">
                  {jobs.map((job) => <JobCard key={job.id} job={job} />)}
                </div>
              ) : (
                <div className="mt-6 rounded-card border border-dashed border-line p-8 text-center">
                  <p className="font-medium text-ink">No active roles are currently listed.</p>
                  <div className="mt-5"><SecondaryButton href="/jobs">Browse Other Jobs</SecondaryButton></div>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-card border border-line bg-white p-5">
              <h2 className="font-display text-[18px] font-semibold text-ink">Company information</h2>
              <dl className="mt-4 grid gap-3">
                <Info label="Industry" value={company.industry} />
                <Info label="Size" value={company.size} />
                <Info label="Locations" value={company.locations.join(", ")} />
                <Info label="Active Jobs" value={String(jobs.length)} />
              </dl>
            </section>
            {verified && (
              <section className="rounded-card border border-green-100 bg-green-50 p-5">
                <h2 className="inline-flex items-center gap-2 font-display text-[17px] font-semibold text-green-800">
                  <BadgeCheck size={18} aria-hidden="true" /> Verified Employer
                </h2>
                <p className="mt-2 text-[13.5px] leading-relaxed text-green-800/80">
                  Grow Biz has reviewed this company's business details according to platform verification processes.
                </p>
              </section>
            )}
          </aside>
        </Container>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <div className="flex justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"><dt className="text-[13.5px] text-mist">{label}</dt><dd className="text-right text-[13.5px] font-medium text-ink/82">{value}</dd></div>;
}

function Meta({ icon: Icon, children }: { icon: typeof MapPin; children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5"><Icon size={14} aria-hidden="true" /> {children}</span>;
}
