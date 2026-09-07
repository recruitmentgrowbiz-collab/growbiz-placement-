import { Mail, MessageSquare } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

const statusStyles: Record<string, string> = {
  sent: "bg-plum-50 text-plum-700",
  delivered: "bg-green-50 text-green-700",
  bounced: "bg-red-50 text-red-700",
  failed: "bg-red-50 text-red-700",
  skipped: "bg-line text-mist",
  queued: "bg-gold-500/10 text-gold-600",
};

export default async function AdminNotificationsPage() {
  const supabase = createClient();
  const { data: deliveries } = await supabase
    .from("notification_deliveries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const counts = (deliveries ?? []).reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Admin</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Notification delivery log</h1>
        <p className="mt-2 max-w-lg text-[14px] text-mist">
          Last 100 email/SMS attempts. "Sent" means the provider accepted it — "delivered" or
          "bounced" comes from the provider's own webhook confirming what actually happened.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {Object.entries(counts).map(([status, count]) => (
            <span
              key={status}
              className={`rounded-pill px-3 py-1.5 text-[12.5px] font-medium capitalize ${statusStyles[status] ?? ""}`}
            >
              {status}: {count}
            </span>
          ))}
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line text-[13px] text-mist">
                <th className="py-3 pr-4 font-medium">Channel</th>
                <th className="py-3 pr-4 font-medium">Recipient</th>
                <th className="py-3 pr-4 font-medium">Template</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Detail</th>
                <th className="py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {(deliveries ?? []).map((d) => (
                <tr key={d.id} className="border-b border-line/70">
                  <td className="py-3 pr-4">
                    {d.channel === "email" ? (
                      <Mail size={14} className="text-mist" />
                    ) : (
                      <MessageSquare size={14} className="text-mist" />
                    )}
                  </td>
                  <td className="py-3 pr-4 text-[13.5px] text-ink/80">{d.recipient ?? "—"}</td>
                  <td className="py-3 pr-4 max-w-[220px] truncate text-[13.5px] text-ink/80">{d.template}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-pill px-2.5 py-0.5 text-[12px] font-medium capitalize ${statusStyles[d.status] ?? ""}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 max-w-[240px] truncate text-[12.5px] text-mist">
                    {d.error_message ?? "—"}
                  </td>
                  <td className="py-3 text-[12.5px] text-mist">
                    {new Date(d.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!deliveries || deliveries.length === 0) && (
            <p className="mt-4 rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
              No delivery attempts logged yet.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
