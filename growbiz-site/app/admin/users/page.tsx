import { Container, Kicker } from "@/components/ui";
import { RoleSelect } from "@/components/admin/AdminControls";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const roleStyles: Record<string, string> = {
  admin: "bg-plum-600 text-white",
  recruiter: "bg-plum-50 text-plum-700",
  employer: "bg-gold-500/10 text-gold-600",
  candidate: "bg-line text-ink/70",
};

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  // Profiles doesn't store email — cross-reference with Supabase Auth via the
  // service role. Falls back gracefully (shows "—" for email) if
  // SUPABASE_SERVICE_ROLE_KEY isn't configured yet.
  let emailById: Record<string, string> = {};
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers({ perPage: 200 });
    emailById = Object.fromEntries((data?.users ?? []).map((u) => [u.id, u.email ?? "—"]));
  } catch {
    // Service role not configured — role management still works, just without emails shown.
  }

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Admin</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">Users &amp; roles</h1>
        <p className="mt-2 max-w-lg text-[14px] text-mist">
          Promote someone to recruiter or admin here instead of running SQL directly. Be careful —
          this takes effect immediately.
        </p>

        <div className="mt-8 flex flex-col gap-2.5">
          {profiles && profiles.length > 0 ? (
            profiles.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line p-4"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="font-medium text-ink">{p.full_name || "Unnamed"}</p>
                    <span className={`rounded-pill px-2 py-0.5 text-[11.5px] font-medium capitalize ${roleStyles[p.role]}`}>
                      {p.role}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-mist">{emailById[p.id] ?? "—"}</p>
                </div>
                <RoleSelect userId={p.id} currentRole={p.role} />
              </div>
            ))
          ) : (
            <p className="rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
              No users yet.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
