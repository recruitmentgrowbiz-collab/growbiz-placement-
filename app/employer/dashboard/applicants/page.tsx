import { ApplicationStatusBadge } from "@/components/candidate/ApplicationStatusBadge";
import { getApplicants, getEmployerJobs } from "@/features/employer/services/workspace";

export const metadata = { title: "Applicants | Grow Biz Jobs" };

const filters = ["All", "Applied", "Screening", "Shortlisted", "Interview", "Offer", "Closed"];
const stages = ["applied", "screening", "shortlisted", "interview", "offer", "hired", "rejected"];

export default async function ApplicantsPage() {
  const [apps, jobs] = await Promise.all([getApplicants(), getEmployerJobs()]);
  const jobById = new Map(jobs.map((j) => [j.id, j]));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[28px] font-bold text-ink">Applicants</h1>
          <p className="mt-2 text-[14px] text-mist">{apps.length} applicants across {jobs.length} jobs</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={`min-h-10 rounded-pill border px-4 text-[13px] font-medium transition hover:-translate-y-0.5 hover:border-plum-300 ${
              index === 0 ? "border-plum-200 bg-plum-50 text-plum-700 shadow-[0_10px_22px_-16px_rgba(164,0,207,0.4)]" : "border-line bg-white text-ink/70 shadow-soft"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {apps.map((app) => {
          const job = jobById.get(app.jobId);
          return (
            <article key={app.id} className="rounded-card border border-line bg-white p-5 shadow-[0_20px_44px_-30px_rgba(15,23,42,0.42),0_1px_0_rgba(255,255,255,0.9)_inset] transition hover:-translate-y-0.5 hover:border-plum-200 hover:shadow-[0_28px_56px_-34px_rgba(164,0,207,0.3),0_18px_42px_-34px_rgba(15,23,42,0.48)]">
              <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                <div className="min-w-0">
                  <h2 className="font-display text-[19px] font-semibold text-ink">{app.candidateName}</h2>
                  <p className="mt-1 text-[14px] text-mist">{app.headline} - {app.experience} - {app.location}</p>
                  <p className="mt-1 text-[13px] text-mist">{job?.title} - Applied {app.appliedAt} - Owner {app.owner}</p>
                </div>
                <div className="justify-self-start md:justify-self-end">
                  <ApplicationStatusBadge stage={app.stage} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {app.tags.map((tag) => (
                  <span key={tag} className="rounded-pill border border-line bg-plum-50/45 px-2.5 py-1 text-[12.5px] text-ink/70">{tag}</span>
                ))}
              </div>

              <div className="mt-5 grid gap-3 rounded-card bg-plum-50/35 p-3 sm:grid-cols-[220px_1fr]">
                <label className="text-[13px] font-medium text-ink">
                  Move stage
                  <select defaultValue={app.stage} className="mt-1.5 min-h-11 w-full rounded-control border border-line bg-white px-3 text-[14px] text-ink shadow-sm outline-none focus:border-plum-500 focus:ring-2 focus:ring-plum-200">
                    {stages.map((stage) => <option key={stage}>{stage}</option>)}
                  </select>
                </label>
                <label className="text-[13px] font-medium text-ink">
                  Internal note
                  <input placeholder="Add internal note" className="mt-1.5 min-h-11 w-full rounded-control border border-line bg-white px-3 text-[14px] text-ink shadow-sm outline-none placeholder:text-mist/65 focus:border-plum-500 focus:ring-2 focus:ring-plum-200" />
                </label>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
