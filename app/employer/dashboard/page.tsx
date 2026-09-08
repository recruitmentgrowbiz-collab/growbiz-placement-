import Link from "next/link";
import { BadgeCheck, Briefcase, Users, CalendarDays, Search } from "lucide-react";
import { ApplicationStatusBadge } from "@/components/candidate/ApplicationStatusBadge";
import { getEmployerDashboard, getEmployerWorkspace } from "@/features/employer/services/workspace";
import { getAllJobs } from "@/features/jobs/services/jobs";

export const metadata = { title: "Employer Overview | Grow Biz Jobs" };

export default async function EmployerDashboardPage() {
  const [{ currentEmployerCompany, plan }, data, allJobs] = await Promise.all([getEmployerWorkspace(), getEmployerDashboard(), getAllJobs()]);
  const activeJobs = data.jobs.filter((j) => j.status === "published").length;
  return (
    <div>
      <p className="text-[13px] font-medium text-plum-600">Employer dashboard</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-[28px] font-bold text-ink">{currentEmployerCompany.name}</h1>
        {currentEmployerCompany.verificationStatus === "verified" && <span className="inline-flex items-center gap-1 rounded-pill bg-green-50 px-3 py-1 text-[12.5px] font-medium text-green-700"><BadgeCheck size={14} />Verified Employer</span>}
      </div>
      <p className="mt-2 break-words text-[14.5px] text-mist">Current plan: {plan.name}. Frontend data is scoped through currentEmployerCompany/currentEmployerUser adapters.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[["Active Jobs", activeJobs, Briefcase], ["Total Applications", data.applicants.length, Users], ["New Applicants", data.applicants.filter((a) => a.stage === "applied").length, Users], ["Upcoming Interviews", data.interviews.length, CalendarDays], ["Unlock Usage", `${data.unlockUsage.used}/${data.unlockUsage.limit}`, Search]].map(([label, value, Icon]: any) => <div key={label} className="gb-stat-card rounded-card border border-line bg-white p-5"><Icon size={18} className="text-plum-600" /><p className="mt-3 text-[13px] text-mist">{label}</p><p className="mt-1 font-display text-[24px] font-bold text-ink">{value}</p></div>)}
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link href="/employer/dashboard/jobs/new" className="gb-button gb-button--primary inline-flex min-h-11 items-center justify-center rounded-pill bg-plum-600 px-5 text-[15px] font-medium text-white">Post a Job</Link>
        <Link href="/employer/dashboard/applicants" className="gb-button gb-button--secondary inline-flex min-h-11 items-center justify-center rounded-pill border border-line px-5 text-[15px] font-medium text-ink/75">Review Applicants</Link>
        <Link href="/employer/dashboard/candidates" className="gb-button gb-button--secondary inline-flex min-h-11 items-center justify-center rounded-pill border border-line px-5 text-[15px] font-medium text-ink/75">Search Candidates</Link>
        <Link href="/employer/dashboard/recruitment" className="gb-button gb-button--secondary inline-flex min-h-11 items-center justify-center rounded-pill border border-line px-5 text-[15px] font-medium text-ink/75">Request Recruitment Support</Link>
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className=" rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Recent Applications</h2><div className="mt-4 grid gap-3">{data.applicants.slice(0, 3).map((a) => { const job = allJobs.find((j) => j.id === a.jobId); return <Link key={a.id} href="/employer/dashboard/applicants" className="gb-table-row rounded-card border border-line p-4"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-medium text-ink">{a.candidateName}</p><p className="text-[13px] text-mist">{job?.title} - {a.appliedAt}</p></div><ApplicationStatusBadge stage={a.stage} /></div></Link>; })}</div></section>
        <section className=" rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Active Jobs</h2><div className="mt-4 grid gap-3">{data.jobs.slice(0, 4).map((job) => <Link key={job.id} href={`/employer/dashboard/jobs/${job.id}`} className="gb-table-row rounded-card border border-line p-4"><p className="font-medium text-ink">{job.title}</p><p className="mt-1 text-[13px] text-mist">{job.location} - {job.status}</p></Link>)}</div></section>
      </div>
    </div>
  );
}

