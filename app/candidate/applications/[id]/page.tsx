import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationStatusBadge } from "@/components/candidate/ApplicationStatusBadge";
import { getCandidateApplicationById } from "@/features/candidates/services/candidate";
import { getJobBySlug } from "@/features/jobs/services/jobs";

const order = ["applied", "screening", "shortlisted", "interview", "offer", "hired"];

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await getCandidateApplicationById(params.id);
  if (!application) notFound();
  const job = await getJobBySlug(application.jobId);
  if (!job) notFound();
  const visibleStages = order.slice(0, Math.max(1, order.indexOf(application.stage) + 1));

  return (
    <div>
      <Link href="/candidate/applications" className="text-[14px] font-medium text-plum-600">Back to applications</Link>
      <div className="mt-5 rounded-card border border-line bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[28px] font-bold text-ink">{job.title}</h1>
            <p className="mt-1 text-[14.5px] text-mist">{job.company} - {job.location}</p>
          </div>
          <ApplicationStatusBadge stage={application.stage} />
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div><dt className="text-[13px] font-medium text-mist">Applied date</dt><dd className="mt-1 text-[14.5px] text-ink">{application.createdAt}</dd></div>
          <div><dt className="text-[13px] font-medium text-mist">Last updated</dt><dd className="mt-1 text-[14.5px] text-ink">{application.updatedAt}</dd></div>
        </dl>
      </div>
      <section className="mt-6 rounded-card border border-line bg-white p-6">
        <h2 className="font-display text-[20px] font-semibold text-ink">Candidate-visible timeline</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleStages.map((stage) => <li key={stage} className="rounded-card border border-line p-4 text-[14px] capitalize text-ink/80">{stage.replace("_", " ")}</li>)}
        </ol>
      </section>
      <section className="mt-6 rounded-card border border-line bg-white p-6">
        <h2 className="font-display text-[20px] font-semibold text-ink">Screening answers</h2>
        {Object.keys(application.answers).length ? <pre className="mt-3 whitespace-pre-wrap rounded-card bg-plum-50 p-4 text-[13px] text-ink/75">{JSON.stringify(application.answers, null, 2)}</pre> : <p className="mt-2 text-[14.5px] text-mist">No candidate-visible answers recorded for this mock application.</p>}
        <button className="mt-5 min-h-10 rounded-pill border border-line px-4 text-[13.5px] font-medium text-ink/75">Withdraw application</button>
      </section>
    </div>
  );
}
