import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Briefcase, Clock, Wallet, Flag } from "lucide-react";
import { ReportJobButton } from "@/components/ReportJobButton";
import { Container, Kicker } from "@/components/ui";
import { ApplyPanel } from "@/components/ApplyPanel";
import { jobs } from "@/lib/data";
import { getJobById, getScreeningQuestions, getPublishedJobs } from "@/lib/supabase/queries";
import { mapDbJobToDisplayJob } from "@/lib/supabase/mappers";
import { buildJobPostingSchema } from "@/lib/seo";

export function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const job = jobs.find((j) => j.id === params.id) ?? (await getJobById(params.id).then((j) => j && mapDbJobToDisplayJob(j)));
  if (!job) return {};
  return {
    title: `${job.title} at ${job.company}`,
    description: `${job.title} role at ${job.company}, ${job.location}. ${job.experience} experience.`,
  };
}

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const mockJob = jobs.find((j) => j.id === params.id);
  let job = mockJob;
  let isDbJob = false;
  let companyId: string | null = null;

  if (!job) {
    const dbJob = await getJobById(params.id);
    if (dbJob) {
      const questions = await getScreeningQuestions(dbJob.id);
      job = mapDbJobToDisplayJob(dbJob, questions);
      isDbJob = true;
      companyId = dbJob.company_id;
    }
  }

  if (!job) notFound();

  let related = jobs.filter((j) => j.id !== job.id && j.industry === job.industry).slice(0, 3);
  if (isDbJob) {
    const dbJobs = await getPublishedJobs();
    related = dbJobs
      .filter((j) => j.id !== job!.id)
      .map((j) => mapDbJobToDisplayJob(j))
      .slice(0, 3);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJobPostingSchema(job)) }}
      />
      <section className="border-b border-line bg-plum-50/60">
        <Container className="py-12 md:py-14">
          <Kicker>{job.industry}</Kicker>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="font-display text-[28px] font-bold leading-tight text-ink md:text-[34px]">
                {job.title}
              </h1>
              <p className="mt-1.5 text-[16px] text-mist">
                {isDbJob && companyId ? (
                  <Link href={`/companies/${companyId}`} className="hover:text-plum-600">
                    {job.company}
                  </Link>
                ) : (
                  job.company
                )}
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-ink/75">
                <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {job.location}</span>
                <span className="inline-flex items-center gap-1.5"><Briefcase size={15} /> {job.mode} · {job.type}</span>
                <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {job.experience}</span>
                {job.salary && (
                  <span className="inline-flex items-center gap-1.5"><Wallet size={15} /> {job.salary}</span>
                )}
              </div>
            </div>

            <ApplyPanel
              jobTitle={job.title}
              company={job.company}
              screeningQuestions={job.screeningQuestions}
              dbJobId={isDbJob ? job.id : undefined}
            />
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-display text-[18px] font-semibold text-ink">About the role</h2>
              <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{job.about}</p>
            </div>

            <div>
              <h2 className="font-display text-[18px] font-semibold text-ink">Responsibilities</h2>
              <ul className="mt-2.5 flex flex-col gap-2">
                {job.responsibilities.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[15px] leading-relaxed text-ink/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-[18px] font-semibold text-ink">Must-have</h2>
              <ul className="mt-2.5 flex flex-col gap-2">
                {job.mustHave.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[15px] leading-relaxed text-ink/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {job.niceToHave.length > 0 && (
              <div>
                <h2 className="font-display text-[18px] font-semibold text-ink">Nice-to-have</h2>
                <ul className="mt-2.5 flex flex-col gap-2">
                  {job.niceToHave.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[15px] leading-relaxed text-ink/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-plum-300" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-card border border-line bg-plum-50/60 p-5">
              <p className="text-[14px] leading-relaxed text-ink/80">
                Applying to jobs on Grow Biz Jobs is free. Grow Biz does not promise guaranteed
                placement — hiring decisions are made by {job.company}.
              </p>
              {isDbJob ? (
                <ReportJobButton jobId={job.id} />
              ) : (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] text-mist">
                  <Flag size={14} /> Report this job (demo listing)
                </p>
              )}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-card border border-line p-5">
              <p className="text-[13px] font-medium text-mist">Posted</p>
              <p className="mt-1 text-[14.5px] text-ink">{job.posted}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.tags.map((tag) => (
                  <span key={tag} className="rounded-pill border border-line px-2.5 py-1 text-[12.5px] text-ink/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {related.length > 0 && (
              <div>
                <p className="text-[13px] font-medium text-mist">Similar roles</p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/jobs/${r.id}`}
                      className="block rounded-card border border-line p-3.5 hover:border-plum-300"
                    >
                      <p className="text-[14px] font-medium text-ink">{r.title}</p>
                      <p className="text-[13px] text-mist">{r.company} · {r.location}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </Container>
      </section>
    </>
  );
}
