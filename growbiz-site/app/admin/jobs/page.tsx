import { Container, Kicker } from "@/components/ui";
import { JobModerationControls, ResolveReportButton } from "@/components/admin/AdminControls";
import { createClient } from "@/lib/supabase/server";

export default async function AdminJobsPage() {
  const supabase = createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, companies(name)")
    .order("created_at", { ascending: false });

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const jobTitleById = Object.fromEntries((jobs ?? []).map((j) => [j.id, j.title]));

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Admin</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Job moderation</h1>

        {reports && reports.length > 0 && (
          <div className="mt-6 rounded-card border border-red-200 bg-red-50 p-5">
            <p className="text-[13.5px] font-medium text-red-700">
              {reports.length} open report{reports.length > 1 ? "s" : ""} awaiting review
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-card border border-red-200 bg-white p-3.5"
                >
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">
                      {r.category}
                      {r.target_type === "job" && jobTitleById[r.target_id] && (
                        <span className="text-mist"> — {jobTitleById[r.target_id]}</span>
                      )}
                    </p>
                    {r.description && (
                      <p className="mt-1 max-w-lg whitespace-pre-line text-[13px] text-mist">
                        {r.description}
                      </p>
                    )}
                    <p className="mt-1 text-[12px] text-mist">
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                  </div>
                  <ResolveReportButton reportId={r.id} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {jobs && jobs.length > 0 ? (
            jobs.map((job: any) => (
              <div
                key={job.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line p-5"
              >
                <div>
                  <p className="font-medium text-ink">{job.title}</p>
                  <p className="mt-1 text-[13px] text-mist">
                    {job.companies?.name} · {job.location} ·{" "}
                    <span className="capitalize">{job.status}</span>
                  </p>
                </div>
                <JobModerationControls jobId={job.id} status={job.status} />
              </div>
            ))
          ) : (
            <p className="rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
              No jobs posted yet.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
