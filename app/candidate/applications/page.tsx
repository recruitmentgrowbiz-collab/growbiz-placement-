import Link from "next/link";
import { ApplicationStatusBadge } from "@/components/candidate/ApplicationStatusBadge";
import { getCandidateApplications } from "@/features/candidates/services/candidate";
import { getAllJobs } from "@/features/jobs/services/jobs";

export const metadata = { title: "Applications | Grow Biz Jobs" };

export default async function ApplicationsPage() {
  const applications = await getCandidateApplications();
  const allJobs = await getAllJobs();
  const jobById = new Map(allJobs.map((job) => [job.id, job]));
  const filters = ["All", "Active", "Interview", "Offer", "Closed"];

  return (
    <div>
      <h1 className="font-display text-[28px] font-bold text-ink">Applications</h1>
      <div className="mt-5 flex flex-wrap gap-2">{filters.map((f) => <span key={f} className="rounded-pill border border-line bg-white px-3 py-2 text-[13.5px] text-ink/75">{f}</span>)}</div>
      <div className="mt-6 grid gap-3">
        {applications.length ? applications.map((app) => {
          const job = jobById.get(app.jobId);
          return <Link key={app.id} href={`/candidate/applications/${app.id}`} className="rounded-card border border-line bg-white p-5 hover:border-plum-300"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-display text-[18px] font-semibold text-ink">{job?.title}</h2><p className="mt-1 text-[14px] text-mist">{job?.company} - {job?.location}</p></div><ApplicationStatusBadge stage={app.stage} /></div><p className="mt-3 text-[13px] text-mist">Applied {app.createdAt} - Last update {app.updatedAt}</p></Link>;
        }) : <p className="rounded-card border border-dashed border-line bg-white p-6 text-center text-[14px] text-mist">No applications yet.</p>}
      </div>
    </div>
  );
}
