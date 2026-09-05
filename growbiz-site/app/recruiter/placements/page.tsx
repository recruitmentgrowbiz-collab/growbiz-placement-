import { Container, Kicker } from "@/components/ui";
import { FeeStatusSelect } from "@/components/recruiter/FeeStatusSelect";
import { createClient } from "@/lib/supabase/server";

function formatINR(n: number | null) {
  if (!n) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

export default async function RecruiterPlacementsPage() {
  const supabase = createClient();

  const { data: placements } = await supabase
    .from("placements")
    .select("*, jobs(title), companies(name), candidates(profiles(full_name))")
    .order("created_at", { ascending: false });

  const totalPending = (placements ?? [])
    .filter((p) => p.fee_status === "pending" || p.fee_status === "invoiced")
    .reduce((sum, p) => sum + (p.fee_amount ?? 0), 0);

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Placements</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">
          Managed recruitment outcomes
        </h1>

        <div className="mt-6 inline-block rounded-card border border-line p-5">
          <p className="text-[13px] font-medium text-mist">Outstanding fees</p>
          <p className="mt-1.5 font-display text-[24px] font-bold text-ink">
            {formatINR(totalPending)}
          </p>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-[13px] text-mist">
                <th className="py-3 pr-4 font-medium">Candidate</th>
                <th className="py-3 pr-4 font-medium">Role</th>
                <th className="py-3 pr-4 font-medium">Employer</th>
                <th className="py-3 pr-4 font-medium">Annual CTC</th>
                <th className="py-3 pr-4 font-medium">Fee</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(placements ?? []).map((p: any) => (
                <tr key={p.id} className="border-b border-line/70">
                  <td className="py-3.5 pr-4 text-[14px] font-medium text-ink">
                    {p.candidates?.profiles?.full_name ?? "Candidate"}
                  </td>
                  <td className="py-3.5 pr-4 text-[14px] text-ink/80">{p.jobs?.title}</td>
                  <td className="py-3.5 pr-4 text-[14px] text-ink/80">{p.companies?.name}</td>
                  <td className="py-3.5 pr-4 text-[14px] text-ink/80">{formatINR(p.annual_ctc)}</td>
                  <td className="py-3.5 pr-4 text-[14px] font-medium text-plum-700">
                    {formatINR(p.fee_amount)} <span className="text-mist">({p.fee_percent}%)</span>
                  </td>
                  <td className="py-3.5">
                    <FeeStatusSelect placementId={p.id} status={p.fee_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!placements || placements.length === 0) && (
            <p className="mt-4 rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
              No placements recorded yet. Log one from a job's applicant pipeline once a candidate
              reaches offer or hired stage.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
