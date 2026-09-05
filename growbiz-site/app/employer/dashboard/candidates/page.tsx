import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Container, Kicker } from "@/components/ui";
import { CandidateSearch } from "@/components/employer/CandidateSearch";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 30;

async function searchCandidates(
  supabase: ReturnType<typeof createClient>,
  searchQuery: string,
  limit: number,
  offset: number
) {
  const result = await supabase.rpc("search_candidates", {
    search_query: searchQuery,
    p_limit: limit,
    p_offset: offset,
  });

  if (result.error?.code !== "PGRST202") {
    return result.data ?? [];
  }

  const fallback = await supabase.rpc("search_candidates", { search_query: searchQuery });
  return ((fallback.data as any[]) ?? []).slice(offset, offset + limit);
}

export default async function EmployerCandidatesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: companyRow } = await supabase
    .from("company_users")
    .select("company_id, companies(verification_status)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  const companyId = companyRow?.company_id;
  const verificationStatus = (companyRow as any)?.companies?.verification_status;

  if (!companyId) redirect("/employer/dashboard");

  if (verificationStatus !== "verified") {
    return (
      <section className="py-14">
        <Container className="max-w-lg">
          <div className="flex flex-col items-start rounded-card border border-line bg-plum-50/60 p-8">
            <ShieldAlert size={26} className="text-plum-600" />
            <h1 className="mt-4 font-display text-[19px] font-semibold text-ink">
              Verification required
            </h1>
            <p className="mt-2 text-[14.5px] leading-relaxed text-mist">
              Candidate database search unlocks once your company is verified. This usually
              happens within one business day — you'll see the status update on your dashboard
              overview.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const searchQuery = searchParams.q ?? "";

  // Teaser fields only — full details (incl. resume) come from a direct table
  // read that RLS itself only permits once a real unlock record exists.
  const [candidates, { data: unlocks }, { data: membership }] = await Promise.all([
    searchCandidates(supabase, searchQuery, PAGE_SIZE, 0),
    supabase.from("candidate_unlocks").select("candidate_id, created_at").eq("company_id", companyId),
    supabase.from("memberships").select("candidate_unlocks_limit").eq("company_id", companyId).maybeSingle(),
  ]);

  const unlockedIds = (unlocks ?? []).map((u) => u.candidate_id);
  const { data: unlockedRows } = unlockedIds.length
    ? await supabase
        .from("candidates")
        .select("user_id, resume_url, salary_expectation, profiles(full_name)")
        .in("user_id", unlockedIds)
    : { data: [] };

  const unlockedDetails = Object.fromEntries(
    (unlockedRows ?? []).map((row: any) => [
      row.user_id,
      {
        full_name: row.profiles?.full_name ?? null,
        resume_url: row.resume_url,
        salary_expectation: row.salary_expectation,
      },
    ])
  );

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const usedThisMonth = (unlocks ?? []).filter((u) => new Date(u.created_at) >= startOfMonth).length;
  const unlocksRemaining = membership ? Math.max(0, membership.candidate_unlocks_limit - usedThisMonth) : null;

  return (
    <section className="py-10 md:py-14">
      <Container>
        <Kicker>Candidate search</Kicker>
        <h1 className="mt-3 font-display text-[24px] font-bold text-ink">
          Search the candidate database
        </h1>
        <p className="mt-2 max-w-lg text-[14px] text-mist">
          Every profile unlock is logged for audit and counts against your plan's monthly
          entitlement. Candidates control their own visibility.
        </p>

        <div className="mt-8">
          <CandidateSearch
            candidates={(candidates as any) ?? []}
            unlockedIds={unlockedIds}
            initialUnlockedDetails={unlockedDetails as any}
            unlocksRemaining={unlocksRemaining}
            initialQuery={searchQuery}
            pageSize={PAGE_SIZE}
          />
        </div>
      </Container>
    </section>
  );
}
