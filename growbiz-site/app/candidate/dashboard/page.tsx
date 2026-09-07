import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Kicker } from "@/components/ui";
import { ProfileForm } from "@/components/candidate/ProfileForm";
import { createClient } from "@/lib/supabase/server";
import type { Candidate } from "@/lib/supabase/types";

const stageLabels: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Not selected",
};

function completeness(c: Candidate | null) {
  if (!c) return 0;
  const fields = [c.headline, c.summary, c.location, c.skills?.length, c.resume_url, c.salary_expectation];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export default async function CandidateDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: candidate }, { data: applications }, { data: savedJobs }] = await Promise.all([
    supabase.from("candidates").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("applications")
      .select("*, jobs(id, title, company_id, companies(name))")
      .eq("candidate_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("saved_jobs")
      .select("job_id, jobs(id, title, companies(name))")
      .eq("candidate_id", user.id),
  ]);

  const score = completeness(candidate);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <Kicker>Candidate dashboard</Kicker>
        <h1 className="mt-3 font-display text-[26px] font-bold text-ink md:text-[30px]">
          Welcome back{candidate?.headline ? `, ${candidate.headline.split(",")[0]}` : ""}
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="font-display text-[17px] font-semibold text-ink">Your profile</h2>
              <div className="mt-3">
                <ProfileForm userId={user.id} initial={candidate as Candidate | null} />
              </div>
            </div>

            <div>
              <h2 className="font-display text-[17px] font-semibold text-ink">
                Applications ({applications?.length ?? 0})
              </h2>
              <div className="mt-3 flex flex-col gap-2.5">
                {applications && applications.length > 0 ? (
                  applications.map((app: any) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-card border border-line p-4"
                    >
                      <div>
                        <p className="text-[14.5px] font-medium text-ink">{app.jobs?.title}</p>
                        <p className="text-[13px] text-mist">{app.jobs?.companies?.name}</p>
                      </div>
                      <span className="rounded-pill bg-plum-50 px-3 py-1 text-[12.5px] font-medium text-plum-700">
                        {stageLabels[app.stage] ?? app.stage}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-card border border-dashed border-line p-6 text-center text-[14px] text-mist">
                    No applications yet.{" "}
                    <Link href="/jobs" className="font-medium text-plum-600">
                      Browse jobs
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-card border border-line p-5">
              <p className="text-[13px] font-medium text-mist">Profile completeness</p>
              <div className="mt-2.5 h-2 w-full rounded-pill bg-plum-50">
                <div
                  className="h-2 rounded-pill bg-plum-600 transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="mt-2 text-[13px] text-mist">{score}% complete</p>
            </div>

            <div className="rounded-card border border-line p-5">
              <p className="text-[13px] font-medium text-mist">
                Saved jobs ({savedJobs?.length ?? 0})
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {savedJobs && savedJobs.length > 0 ? (
                  savedJobs.map((s: any) => (
                    <Link
                      key={s.job_id}
                      href={`/jobs/${s.job_id}`}
                      className="text-[13.5px] font-medium text-ink hover:text-plum-600"
                    >
                      {s.jobs?.title}
                    </Link>
                  ))
                ) : (
                  <p className="text-[13px] text-mist">No saved jobs yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
