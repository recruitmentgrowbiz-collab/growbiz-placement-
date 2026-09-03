import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationStatusBadge } from "@/components/candidate/ApplicationStatusBadge";
import { EmployerJobEditor } from "@/components/employer/EmployerJobEditor";
import { getApplicants, getEmployerJob } from "@/features/employer/services/workspace";

export default async function EmployerJobDetailPage({ params }: { params: { id: string } }) {
  const [job, applicants] = await Promise.all([getEmployerJob(params.id), getApplicants()]);
  if (!job) notFound();
  const jobApplicants = applicants.filter((app) => app.jobId === job.id);
  return (
    <div>
      <Link href="/employer/dashboard/jobs" className="text-[14px] font-medium text-plum-600">Back to jobs</Link>
      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] font-bold text-ink">{job.title}</h1>
          <p className="mt-1 text-[14.5px] text-mist">{job.location} - {job.mode} - {job.type}</p>
        </div>
        <span className="rounded-pill bg-plum-50 px-3 py-1 text-[12.5px] font-medium text-plum-700">{job.status}</span>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <section><EmployerJobEditor /></section>
        <aside className="space-y-4">
          <div className="rounded-card border border-line bg-white p-5">
            <h2 className="font-display text-[18px] font-semibold text-ink">Lifecycle</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Publish", "Pause / Resume", "Close", "Duplicate"].map((action) => <button key={action} className="rounded-pill border border-line px-3 py-2 text-[13px]">{action}</button>)}
            </div>
            <p className="mt-3 text-[13px] text-mist">Close Job and draft deletion should require confirmation when backend actions are connected.</p>
          </div>
          <div className="rounded-card border border-line bg-white p-5">
            <h2 className="font-display text-[18px] font-semibold text-ink">Applicants ({jobApplicants.length})</h2>
            <div className="mt-4 grid gap-3">{jobApplicants.map((app) => <div key={app.id} className="rounded-card border border-line p-3"><p className="font-medium text-ink">{app.candidateName}</p><ApplicationStatusBadge stage={app.stage} /></div>)}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
