"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Lock, Loader2 } from "lucide-react";
import { unlockCandidate, getUnlockedCandidateDetails } from "@/lib/supabase/employer-actions";
import { createClient } from "@/lib/supabase/client";
import { ResumeLink } from "@/components/ResumeLink";

type CandidateTeaser = {
  user_id: string;
  headline: string | null;
  location: string | null;
  skills: string[];
};

type UnlockedDetails = {
  full_name: string | null;
  resume_url: string | null;
  salary_expectation: string | null;
};

export function CandidateSearch({
  candidates,
  unlockedIds,
  initialUnlockedDetails,
  unlocksRemaining,
  initialQuery,
  pageSize,
}: {
  candidates: CandidateTeaser[];
  unlockedIds: string[];
  initialUnlockedDetails: Record<string, UnlockedDetails>;
  unlocksRemaining: number | null;
  initialQuery: string;
  pageSize: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [list, setList] = useState(candidates);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(candidates.length === pageSize);
  const [unlocked, setUnlocked] = useState(new Set(unlockedIds));
  const [details, setDetails] = useState<Record<string, UnlockedDetails>>(initialUnlockedDetails);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Full search runs server-side (search_candidates() covers the whole
    // table, not just whatever's currently loaded) — client-side filtering
    // here would silently miss matches beyond the first page.
    router.push(`/employer/dashboard/candidates?q=${encodeURIComponent(query)}`);
  }

  async function loadMore() {
    setLoadingMore(true);
    const supabase = createClient();
    const result = await supabase.rpc("search_candidates", {
      search_query: initialQuery,
      p_limit: pageSize,
      p_offset: list.length,
    });
    const data =
      result.error?.code === "PGRST202"
        ? (
            await supabase.rpc("search_candidates", {
              search_query: initialQuery,
            })
          ).data?.slice(list.length, list.length + pageSize)
        : result.data;
    setLoadingMore(false);
    const next = (data as CandidateTeaser[]) ?? [];
    setList((prev) => [...prev, ...next]);
    setHasMore(next.length === pageSize);
  }

  function handleUnlock(candidateId: string) {
    setError(null);
    setPendingId(candidateId);
    startTransition(async () => {
      const result = await unlockCandidate(candidateId);
      if (result.error) {
        setError(result.error);
        setPendingId(null);
        return;
      }
      const fullDetails = await getUnlockedCandidateDetails(candidateId);
      setPendingId(null);
      setUnlocked((prev) => new Set(prev).add(candidateId));
      if (fullDetails) {
        setDetails((prev) => ({ ...prev, [candidateId]: fullDetails as UnlockedDetails }));
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 sm:max-w-sm">
          <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-line px-3 py-2.5">
            <Search size={16} className="shrink-0 text-mist" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by skill, headline or location"
              className="w-full bg-transparent text-[14px] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-pill bg-plum-600 px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-plum-700"
          >
            Search
          </button>
        </form>
        {unlocksRemaining !== null && (
          <p className="text-[13px] text-mist">{unlocksRemaining} unlocks left this month</p>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map((c) => {
          const isUnlocked = unlocked.has(c.user_id);
          const d = details[c.user_id];
          return (
            <div key={c.user_id} className="rounded-card border border-line p-4">
              <p className="font-medium text-ink">
                {isUnlocked ? d?.full_name ?? "Candidate" : "Candidate profile"}
              </p>
              <p className="mt-0.5 text-[13.5px] text-mist">
                {c.headline || "Headline not set"} · {c.location || "Location not set"}
              </p>
              {c.skills?.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {c.skills.slice(0, 5).map((s) => (
                    <span key={s} className="rounded-pill border border-line px-2 py-0.5 text-[12px] text-ink/70">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3.5">
                {isUnlocked ? (
                  d ? (
                    <ResumeLink resumePath={d.resume_url} />
                  ) : (
                    <span className="text-[13px] text-mist">Loading details…</span>
                  )
                ) : (
                  <button
                    onClick={() => handleUnlock(c.user_id)}
                    disabled={isPending && pendingId === c.user_id}
                    className="inline-flex items-center gap-1.5 rounded-pill bg-plum-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"
                  >
                    <Lock size={13} />
                    {isPending && pendingId === c.user_id ? "Unlocking…" : "Unlock profile"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {list.length === 0 && (
          <p className="col-span-2 rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">
            No candidates match that search.
          </p>
        )}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-1.5 rounded-pill border border-line px-5 py-2.5 text-[13.5px] font-medium text-ink/80 hover:border-plum-300 disabled:opacity-60"
          >
            {loadingMore && <Loader2 size={14} className="animate-spin" />}
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
