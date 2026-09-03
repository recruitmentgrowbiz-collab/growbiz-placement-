export const metadata = { title: "Employer Settings | Grow Biz Jobs" };

export default function EmployerSettingsPage() {
  const prefs = ["New applicant", "Interview reminders", "Recruitment request updates", "Plan usage alerts"];
  return <div><h1 className="font-display text-[28px] font-bold text-ink">Settings</h1><p className="mt-2 text-[14.5px] text-mist">Workspace preferences and notifications. Company, team and membership are managed in their own sections.</p><form className="mt-6 rounded-card border border-line bg-white p-5"><h2 className="font-display text-[20px] font-semibold text-ink">Notifications</h2><div className="mt-4 grid gap-3">{prefs.map((p) => <label key={p} className="flex min-h-11 items-center justify-between rounded-card border border-line px-3 text-[14px] text-ink/80"><span>{p}</span><input type="checkbox" defaultChecked className="accent-plum-600" /></label>)}</div><p className="mt-4 text-[13px] text-mist">WhatsApp notifications are not active until integration is approved.</p><button className="mt-5 min-h-10 rounded-pill bg-plum-600 px-4 text-[13px] font-medium text-white">Save Settings</button></form></div>;
}
