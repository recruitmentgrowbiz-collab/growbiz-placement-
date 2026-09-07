import Link from "next/link";
import { Container, Kicker } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  published: "bg-green-50 text-green-700",
  draft: "bg-plum-50 text-plum-700",
  paused: "bg-gold-500/10 text-gold-600",
  closed: "bg-line text-mist",
  expired: "bg-line text-mist",
};

export default async function RecruiterOverviewPage() {
  const supabase = createClient();

  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, companies(name, verification_status), applications(count)")
    .order("created_at", { ascending: false });

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Recruiter workspace</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">
          All requisitions across employers
        </h1>
        <p className="mt-2 max-w-lg text-[14px] text-mist">
          Every job posted on the platform, regardless of which employer it belongs to — this is
          the shared view for running managed recruitment.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {jobs && jobs.length > 0 ? (
            jobs.map((job: any) => (
              <Link
                key={job.id}
                href={`/recruiter/jobs/${job.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line p-5 hover:border-plum-300"
              >
                <div>
                  <p className="font-display text-[16px] font-semibold text-ink">{job.title}</p>
                  <p className="mt-1 text-[13.5px] text-mist">
                    {job.companies?.name} · {job.location} · {job.applications?.[0]?.count ?? 0} applicants
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
