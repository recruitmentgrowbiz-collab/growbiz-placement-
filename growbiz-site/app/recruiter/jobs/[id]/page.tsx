import { notFound } from "next/navigation";
import { Container, Kicker } from "@/components/ui";
import { RecruiterStageSelect, PlacementLogger } from "@/components/recruiter/PipelineControls";
import { ResumeLink } from "@/components/ResumeLink";
import { ApplicationNotes } from "@/components/ApplicationNotes";
import { ApplicantAISummary } from "@/components/employer/ApplicantAISummary";
import { createClient } from "@/lib/supabase/server";

export default async function RecruiterJobPipelinePage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: job } = await supabase
    .from("jobs")
    .select("*, companies(id, name)")
    .eq("id", params.id)
    .maybeSingle();
  if (!job) notFound();

  const { data: applications } = await supabase
    .from("applications")
    .select("*, candidates(user_id, headline, location, skills, resume_url, profiles(full_name))")
    .eq("job_id", params.id)
    .order("created_at", { ascending: false });

  const applicationIds = (applications ?? []).map((a) => a.id);
  const { data: notes } = applicationIds.length
    ? await supabase
        .from("application_notes")
        .select("id, application_id, note, created_at, author_id")
        .in("application_id", applicationIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const notesByApp = (notes ?? []).reduce<Record<string, typeof notes>>((map, n) => {
    (map[n.application_id] ??= []).push(n);
    return map;
  }, {});

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>{(job as any).companies?.name}</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">{job.title}</h1>
        <p className="mt-1 text-[14px] text-mist">
          {job.location} · {job.mode} · <span className="capitalize">{job.status}</span>
        </p>

        <div className="mt-8">
          <h2 className="font-display text-[17px] font-semibold text-ink">
            Applicants ({applications?.length ?? 0})
          </h2>

          <div className="mt-4 flex flex-col gap-3">
            {applications && applications.length > 0 ? (
              applications.map((app: any) => (
                <div key={app.id} className="rounded-card border border-line p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink">
                        {app.candidates?.profiles?.full_name ?? "Candidate"}
                      </p>
                      <p className="text-[13.5px] text-mist">
                        {app.candidates?.headline ?? "No headline yet"} ·{" "}
                        {app.candidates?.location ?? "Location not set"}
                      </p>
                      {app.candidates?.skills?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {app.candidates.skills.slice(0, 6).map((s: string) => (
                            <span key={s} className="rounded-pill border border-line px-2 py-0.5 text-[12px] text-ink/70">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      <ApplicantAISummary applicationId={app.id} />
                      <div className="mt-2.5">
                        <ResumeLink resumePath={app.candidates?.resume_url ?? null} />
                      </div>
                      <ApplicationNotes
                        applicationId={app.id}
                        initialNotes={notesByApp[app.id] ?? []}
                        revalidatePathTarget={`/recruiter/jobs/${job.id}`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <RecruiterStageSelect applicationId={app.id} jobId={job.id} currentStage={app.stage} />
                    </div>
                  </div>

                  {(app.stage === "offer" || app.stage === "hired") && (
                    <PlacementLogger
                      applicationId={app.id}
                      jobId={job.id}
                      candidateId={app.candidates?.user_id}
                      companyId={(job as any).companies?.id}
                    />
                  )}
                </div>
              ))
            ) : (
              <p className="rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
                No applicants yet.
              </p>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
