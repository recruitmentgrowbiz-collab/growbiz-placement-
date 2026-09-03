import Link from "next/link";
import { JobCard } from "@/components/JobCard";
import { PrimaryButton } from "@/components/ui";
import { getSavedJobs } from "@/features/candidates/services/candidate";

export const metadata = { title: "Saved Jobs | Grow Biz Jobs" };

export default async function SavedJobsPage() {
  const jobs = await getSavedJobs();
  return (
    <div>
      <h1 className="font-display text-[28px] font-bold text-ink">Saved Jobs</h1>
      <p className="mt-2 text-[15px] text-mist">Save roles you're interested in and return to them here.</p>
      {jobs.length ? <div className="mt-6 grid gap-4 lg:grid-cols-2">{jobs.map((job) => <div key={job.id} className="space-y-3"><JobCard job={job} /><button className="min-h-10 rounded-pill border border-line px-4 text-[13.5px] font-medium text-ink/75 hover:border-plum-300">Remove saved job</button></div>)}</div> : <div className="mt-6 rounded-card border border-dashed border-line bg-white p-8 text-center"><p className="text-mist">No saved jobs yet.</p><div className="mt-5"><PrimaryButton href="/jobs">Search Jobs</PrimaryButton></div></div>}
      <div className="mt-8"><Link href="/jobs" className="text-[14px] font-medium text-plum-600">Search more jobs</Link></div>
    </div>
  );
}
