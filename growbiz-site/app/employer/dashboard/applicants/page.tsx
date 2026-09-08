import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Kicker } from "@/components/ui";
import { StageSelect } from "@/components/employer/PipelineControls";
import { createClient } from "@/lib/supabase/server";
import type { ApplicationStage } from "@/lib/supabase/types";

const stages: ApplicationStage[] = ["applied", "shortlisted", "interview", "offer", "hired", "rejected"];

const stageLabels: Record<ApplicationStage, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Not selected",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EmployerApplicantsPage({
  searchParams,
}: {
  searchParams: { job?: string; stage?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: companyRow } = await supabase
    .from("company_users")
    .select("company_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const companyId = companyRow?.company_id;
  if (!companyId) redirect("/employer/dashboard");

  const selectedJobId = searchParams.job ?? "";
  const selectedStage = stages.includes(searchParams.stage as ApplicationStage)
    ? (searchParams.stage as ApplicationStage)
    : "";

  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, title")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  let applicationsQuery = supabase
    .from("applications")
    .select("*, jobs!inner(id, title, company_id), candidates(user_id, headline, profiles(full_name))")
    .eq("jobs.company_id", companyId)
    .order("created_at", { ascending: false });

  if (selectedJobId) {
    applicationsQuery = applicationsQuery.eq("job_id", selectedJobId);
  }

  if (selectedStage) {
    applicationsQuery = applicationsQuery.eq("stage", selectedStage);
  }

  const { data: applications } = await applicationsQuery;
  const applicantCount = applications?.length ?? 0;

  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Kicker>Applicants</Kicker>
            <h1 className="mt-3 font-display text-[24px] font-bold text-ink">All applicants</h1>
            <p className="mt-2 max-w-lg text-[14px] text-mist">
              Review every application across your company's job posts from one place.
            </p>
          </div>
          <p className="rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/75">
            {applicantCount} {applicantCount === 1 ? "applicant" : "applicants"}
          </p>
        </div>

        <form className="mt-8 flex flex-col gap-3 rounded-card border border-line p-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label htmlFor="job" className="text-[12.5px] font-medium text-ink">
              Job
            </label>
            <select
              id="job"
              name="job"
              defaultValue={selectedJobId}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-[13.5px] text-ink focus:border-plum-400"
            >
              <option value="">All jobs</option>
              {(jobs ?? []).map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="stage" className="text-[12.5px] font-medium text-ink">
              Stage
            </label>
            <select
              id="stage"
              name="stage"
              defaultValue={selectedStage}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-[13.5px] text-ink focus:border-plum-400"
            >
              <option value="">All stages</option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stageLabels[stage]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-pill bg-plum-600 px-4 py-2 text-[13.5px] font-medium text-white hover:bg-plum-700"
            >
              Apply filters
            </button>
            <Link
              href="/employer/dashboard/applicants"
              className="rounded-pill border border-line px-4 py-2 text-[13.5px] font-medium text-ink/70 hover:border-plum-300"
            >
              Clear
            </Link>
          </div>
        </form>

        <div className="mt-6 flex flex-col gap-3">
          {applications && applications.length > 0 ? (
            applications.map((app: any) => (
              <div key={app.id} className="rounded-card border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink">
                      {app.candidates?.profiles?.full_name ?? "Candidate"}
                    </p>
                    <p className="mt-1 text-[13.5px] text-mist">
                      {app.candidates?.headline ?? "No headline yet"}
                    </p>
                    <p className="mt-2 text-[13.5px] text-mist">
                      Applied for{" "}
                      <Link
                        href={`/employer/dashboard/jobs/${app.jobs?.id}`}
                        className="font-medium text-plum-600 hover:text-plum-700"
                      >
                        {app.jobs?.title ?? "Job"}
                      </Link>{" "}
                      on {formatDate(app.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 sm:items-end">
                    <span className="text-[12px] font-medium text-mist">Current stage</span>
                    <StageSelect applicationId={app.id} jobId={app.job_id} currentStage={app.stage} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
              No applicants match these filters.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
