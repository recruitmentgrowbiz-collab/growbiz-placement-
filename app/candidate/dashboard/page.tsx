import Link from "next/link";
import { Bookmark, Briefcase, FileUp, Search, UserRound } from "lucide-react";
import { ApplicationStatusBadge } from "@/components/candidate/ApplicationStatusBadge";
import { ProfileCompletenessCard } from "@/components/candidate/ProfileCompletenessCard";
import { JobCard } from "@/components/JobCard";
import { getCandidateApplications, getCandidateInterviews, getCandidateProfile, getRecommendedJobs, getSavedJobs } from "@/features/candidates/services/candidate";
import { getAllJobs } from "@/features/jobs/services/jobs";

export const metadata = { title: "Candidate Dashboard | Grow Biz Jobs" };

const quickActions = [
  { label: "Complete Profile", href: "/candidate/profile", icon: UserRound },
  { label: "Upload Resume", href: "/candidate/resume", icon: FileUp },
  { label: "Search Jobs", href: "/jobs", icon: Search },
  { label: "View Applications", href: "/candidate/applications", icon: Briefcase },
];

export default async function CandidateDashboardPage() {
  const [candidate, applications, savedJobs, recommendedJobs, interviews, allJobs] = await Promise.all([
    getCandidateProfile(),
    getCandidateApplications(),
    getSavedJobs(),
    getRecommendedJobs(),
    getCandidateInterviews(),
    getAllJobs(),
  ]);
  const jobById = new Map(allJobs.map((job) => [job.id, job]));

  return (
    <div>
      <p className="text-[13px] font-medium text-plum-600">Candidate dashboard</p>
      <h1 className="mt-2 font-display text-[28px] font-bold text-ink">Welcome back, {candidate.name.split(" ")[0]}</h1>
      <p className="mt-2 text-[15px] text-mist">Continue building your profile and track your applications.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className="glass-interactive flex min-h-16 items-center gap-3 rounded-card border border-line bg-white p-4 text-[14px] font-medium text-ink hover:border-plum-300"><Icon size={18} className="text-plum-600" />{label}</Link>)}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className=" rounded-card border border-line bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-[18px] font-semibold text-ink">Recent applications</h2>
              <Link href="/candidate/applications" className="text-[13.5px] font-medium text-plum-600">View All Applications</Link>
            </div>
            <div className="mt-4 grid gap-3">
              {applications.slice(0, 3).map((app) => {
                const job = jobById.get(app.jobId);
                return <Link key={app.id} href={`/candidate/applications/${app.id}`} className="gb-table-row rounded-card border border-line p-4 hover:border-plum-300"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-medium text-ink">{job?.title}</p><p className="text-[13px] text-mist">{job?.company} - Applied {app.createdAt}</p></div><ApplicationStatusBadge stage={app.stage} /></div><p className="mt-2 text-[13px] text-mist">Last updated {app.updatedAt}</p></Link>;
              })}
            </div>
          </section>
          <section>
            <h2 className="font-display text-[18px] font-semibold text-ink">Jobs based on your preferences</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {recommendedJobs.map((job) => <JobCard key={job.id} job={job} showSave />)}
            </div>
          </section>
        </div>
        <aside className="space-y-5">
          <ProfileCompletenessCard score={candidate.completeness} missing={["Add work preference", "Add education", "Upload latest resume"]} />
          <article className="gb-stat-card rounded-card border border-line bg-white p-5">
            <p className="text-[13px] font-medium text-mist">Saved jobs</p>
            <p className="mt-2 font-display text-[22px] font-bold text-ink">{savedJobs.length}</p>
            <Link href="/candidate/saved-jobs" className="mt-3 inline-flex text-[13.5px] font-medium text-plum-600"><Bookmark size={16} className="mr-1" />Open saved jobs</Link>
          </article>
          <article className="gb-stat-card rounded-card border border-line bg-white p-5">
            <p className="font-display text-[17px] font-semibold text-ink">Upcoming interviews</p>
            {interviews.length ? <p className="mt-2 text-[14px] text-mist">Interview details available.</p> : <p className="mt-2 text-[14px] text-mist">No interviews scheduled yet.</p>}
          </article>
        </aside>
      </div>
    </div>
  );
}
