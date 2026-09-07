import { notFound } from "next/navigation";
import Image from "next/image";
import { Globe, MapPin, BadgeCheck, Building2 } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { JobCard } from "@/components/JobCard";
import { getCompanyById, getCompanyJobs } from "@/lib/supabase/queries";
import { mapDbJobToDisplayJob } from "@/lib/supabase/mappers";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const company = await getCompanyById(params.id);
  if (!company) return {};
  return {
    title: company.name,
    description: company.description || `${company.name} on Grow Biz Jobs.`,
  };
}

export default async function CompanyProfilePage({ params }: { params: { id: string } }) {
  const company = await getCompanyById(params.id);
  if (!company || company.verification_status !== "verified") notFound();

  const dbJobs = await getCompanyJobs(company.id);
  const jobs = dbJobs.map((j) => mapDbJobToDisplayJob(j));

  return (
    <>
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-14 md:py-16">
          <div className="flex flex-wrap items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-card border border-line bg-white">
              {company.logo_url ? (
                <Image
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <Building2 size={28} className="text-plum-400" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-[26px] font-bold text-ink md:text-[30px]">
                  {company.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-pill bg-green-50 px-2.5 py-1 text-[12px] font-medium text-green-700">
                  <BadgeCheck size={13} /> Verified employer
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[14px] text-mist">
                {company.industry && <span>{company.industry}</span>}
                {company.locations?.length > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} /> {company.locations.join(", ")}
                  </span>
                )}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-plum-600 hover:text-plum-700"
                  >
                    <Globe size={14} /> Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {company.description && (
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-mist">
              {company.description}
            </p>
          )}
        </Container>
      </section>

      <section className="py-14 md:py-16">
        <Container>
          <Kicker>Open roles</Kicker>
          <h2 className="mt-3 font-display text-[22px] font-bold text-ink">
            {jobs.length > 0 ? `${jobs.length} open role${jobs.length > 1 ? "s" : ""}` : "No open roles right now"}
          </h2>

          {jobs.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
              Check back soon, or follow this company for updates.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
