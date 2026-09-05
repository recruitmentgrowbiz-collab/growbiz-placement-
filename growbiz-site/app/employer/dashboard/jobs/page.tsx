import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Kicker, PrimaryButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  published: "bg-green-50 text-green-700",
  draft: "bg-plum-50 text-plum-700",
  paused: "bg-gold-500/10 text-gold-600",
  closed: "bg-line text-mist",
  expired: "bg-line text-mist",
};

export default async function EmployerJobsPage() {
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

  const { data: jobs } = companyId
    ? await supabase
        .from("jobs")
        .select("*, applications(count)")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Kicker>Jobs</Kicker>
            <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Manage your job posts</h1>
          </div>
          <PrimaryButton href="/employer/dashboard/jobs/new">Post a Job</PrimaryButton>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {jobs && jobs.length > 0 ? (
            jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/employer/dashboard/jobs/${job.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line p-5 hover:border-plum-300"
              >
                <div>
                  <p className="font-display text-[16px] font-semibold text-ink">{job.title}</p>
                  <p className="mt-1 text-[13.5px] text-mist">
                    {job.location} · {job.mode} · {job.applications?.[0]?.count ?? 0} applicants
                  </p>
                </div>
                <span
                  className={`rounded-pill px-3 py-1 text-[12.5px] font-medium capitalize ${
                    statusStyles[job.status] ?? "bg-line text-mist"
                  }`}
                >
                  {job.status}
                </span>
              </Link>
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
