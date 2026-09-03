import Link from "next/link";
import { getEmployerMembership } from "@/features/employer/services/workspace";

export const metadata = { title: "Membership | Grow Biz Jobs" };

export default async function MembershipPage() {
  const m = await getEmployerMembership();
  return <div><h1 className="font-display text-[28px] font-bold text-ink">Membership</h1><p className="mt-2 text-[14.5px] text-mist">No billing gateway is connected. Plan changes route to pricing/contact for now.</p><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Current plan", m.plan.name],["Plan status", m.status],["Candidate unlocks", `${m.unlockUsage.used}/${m.unlockUsage.limit}`],["Recruiter seats", String(m.recruiterSeatsUsed)],["Active jobs", String(m.activeJobsUsed)],["Priority support", m.plan.prioritySupport ? "Included" : "Not included"]].map(([k,v]) => <div key={k} className="rounded-card border border-line bg-white p-5"><p className="text-[13px] text-mist">{k}</p><p className="mt-2 font-display text-[22px] font-bold text-ink">{v}</p></div>)}</div><div className="mt-6 flex gap-3"><Link href="/pricing" className="rounded-pill bg-plum-600 px-5 py-3 text-[14px] font-medium text-white">View Plans</Link><Link href="/contact" className="rounded-pill border border-line px-5 py-3 text-[14px] font-medium">Contact Sales</Link></div></div>;
}
