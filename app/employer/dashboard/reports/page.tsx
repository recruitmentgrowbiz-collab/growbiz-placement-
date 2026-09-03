import { getEmployerReports } from "@/features/employer/services/workspace";

export const metadata = { title: "Hiring Reports | Grow Biz Jobs" };

export default async function ReportsPage() {
  const reports = await getEmployerReports();
  return <div><h1 className="font-display text-[28px] font-bold text-ink">Reports</h1><p className="mt-2 text-[14.5px] text-mist">Simple hiring summaries without a heavy BI dashboard.</p><div className="mt-6 rounded-card border border-line bg-white p-5"><h2 className="font-display text-[20px] font-semibold text-ink">Hiring Funnel</h2><div className="mt-5 grid gap-3">{Object.entries(reports.funnel).map(([k, v]) => <div key={k}><div className="flex justify-between text-[13px] capitalize text-mist"><span>{k}</span><span>{v}</span></div><div className="mt-1 h-2 rounded-pill bg-plum-50"><div className="h-2 rounded-pill bg-plum-600" style={{ width: `${Math.max(8, Number(v) * 24)}%` }} /></div></div>)}</div></div><div className="mt-6 grid gap-4 lg:grid-cols-2">{reports.jobs.slice(0, 4).map((j) => <article key={j.id} className="rounded-card border border-line bg-white p-5"><h2 className="font-display text-[17px] font-semibold text-ink">{j.title}</h2><p className="mt-1 text-[14px] text-mist">Applications by job summary ready for backend data.</p></article>)}</div><button className="mt-6 min-h-10 rounded-pill border border-line px-4 text-[13.5px] font-medium">Prepare Export</button></div>;
}
