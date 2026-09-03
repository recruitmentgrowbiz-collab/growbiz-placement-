import { getEmployerDashboard, getEmployerWorkspace, searchCandidates } from "@/features/employer/services/workspace";

export const metadata = { title: "Candidate Search | Grow Biz Jobs" };

export default async function EmployerCandidatesPage() {
  const [{ currentEmployerCompany }, data, candidates] = await Promise.all([getEmployerWorkspace(), getEmployerDashboard(), searchCandidates()]);
  const restricted = currentEmployerCompany.verificationStatus !== "verified";
  return <div><h1 className="font-display text-[28px] font-bold text-ink">Candidate Search</h1><p className="mt-2 text-[14.5px] text-mist">Candidate access depends on verification, entitlement and candidate consent. Frontend filtering is not security.</p><div className="mt-5 rounded-card border border-line bg-white p-5"><p className="font-medium text-ink">Unlock usage</p><p className="mt-1 text-[14px] text-mist">{data.unlockUsage.used} of {data.unlockUsage.limit} candidate unlocks used</p></div>{restricted ? <div className="mt-6 rounded-card border border-line bg-plum-50/60 p-6">Verification required before full candidate search.</div> : <div className="mt-6 grid gap-4 lg:grid-cols-2">{candidates.map((c) => <article key={c.id} className="rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">{c.candidateName.split(" ")[0]} - {c.headline}</h2><p className="mt-1 text-[14px] text-mist">{c.experience} - {c.location}</p><div className="mt-3 flex flex-wrap gap-1.5">{c.tags.map((t) => <span key={t} className="rounded-pill border border-line px-2.5 py-1 text-[12.5px]">{t}</span>)}</div><button className="mt-4 min-h-10 rounded-pill bg-plum-600 px-4 text-[13.5px] font-medium text-white">Unlock Candidate</button></article>)}</div>}</div>;
}
