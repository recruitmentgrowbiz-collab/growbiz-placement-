import { getEmployerTeam } from "@/features/employer/services/workspace";

export const metadata = { title: "Team | Grow Biz Jobs" };

export default async function TeamPage() {
  const users = await getEmployerTeam();
  return <div><h1 className="font-display text-[28px] font-bold text-ink">Team</h1><div className="mt-6 grid gap-3">{users.map((u: any) => <article key={u.id} className="rounded-card border border-line bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-display text-[18px] font-semibold text-ink">{u.name ?? "Workspace owner"}</h2><p className="text-[14px] text-mist">{u.email ?? "owner@example.com"}</p></div><span className="rounded-pill bg-plum-50 px-3 py-1 text-[12.5px] font-medium text-plum-700">{u.role} - {u.status}</span></div></article>)}</div><form className="mt-6 rounded-card border border-line bg-white p-5"><h2 className="font-display text-[18px] font-semibold text-ink">Invite user</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-[13px] font-medium">Email<input type="email" className="mt-1 min-h-10 w-full rounded-card border border-line px-3" /></label><label className="text-[13px] font-medium">Role<select className="mt-1 min-h-10 w-full rounded-card border border-line px-3"><option>admin</option><option>recruiter</option><option>viewer</option></select></label></div><button className="mt-4 min-h-10 rounded-pill bg-plum-600 px-4 text-[13px] font-medium text-white">Prepare Invite</button></form></div>;
}
