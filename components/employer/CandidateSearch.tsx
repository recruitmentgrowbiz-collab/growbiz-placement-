"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, MapPin, Search, Wallet } from "lucide-react";
import { unlockCandidate, getUnlockedCandidateDetails } from "@/lib/supabase/employer-actions";
import { createClient } from "@/lib/supabase/client";
import { ResumeLink } from "@/components/ResumeLink";

type CandidateTeaser = { user_id: string; headline: string | null; location: string | null; skills: string[] };
type UnlockedDetails = { full_name: string | null; resume_url: string | null; salary_expectation: string | null };

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
    router.push(`/employer/dashboard/candidates?q=${encodeURIComponent(query)}`);
  }

  async function loadMore() {
    setLoadingMore(true);
    const supabase = createClient();
    const { data } = await supabase.rpc("search_candidates", { search_query: initialQuery, p_limit: pageSize, p_offset: list.length });
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
      if (fullDetails) setDetails((prev) => ({ ...prev, [candidateId]: fullDetails as UnlockedDetails }));
    });
  }

  return (
    <div>
      <div className="rounded-card border border-line bg-white p-4 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 sm:max-w-xl">
            <div className="flex min-h-11 flex-1 items-center gap-2.5 rounded-control border border-line px-3">
              <Search size={16} className="shrink-0 text-mist" aria-hidden="true" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by skill, headline or location" className="w-full bg-transparent text-[14px] focus:outline-none" />
            </div>
            <button type="submit" className="min-h-11 rounded-control bg-plum-600 px-4 text-[13.5px] font-medium text-white hover:bg-plum-700">Search</button>
          </form>
          {unlocksRemaining !== null && <p className="rounded-pill bg-plum-50 px-3 py-2 text-[13px] font-medium text-plum-700">{unlocksRemaining} unlocks left this month</p>}
        </div>
      </div>

      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2.5 text-[13.5px] text-red-700">{error}</p>}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {list.map((c) => {
          const isUnlocked = unlocked.has(c.user_id);
          const d = details[c.user_id];
          return (
            <div key={c.user_id} className="rounded-card border border-line bg-white p-4 transition-colors hover:border-plum-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{isUnlocked ? d?.full_name ?? "Candidate" : "Candidate profile"}</p>
                  <p className="mt-1 text-[13.5px] text-mist">{c.headline || "Headline not set"}</p>
                </div>
                {isUnlocked && <span className="rounded-pill bg-plum-50 px-2.5 py-1 text-[12px] font-medium text-plum-700">Unlocked</span>}
              </div>
              <p className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] text-mist"><MapPin size={14} aria-hidden="true" /> {c.location || "Location not set"}</p>
              {c.skills?.length > 0 && <div className="mt-2.5 flex flex-wrap gap-1.5">{c.skills.slice(0, 5).map((s) => <span key={s} className="rounded-pill border border-line px-2 py-0.5 text-[12px] text-ink/70">{s}</span>)}</div>}
              <div className="mt-3.5">
                {isUnlocked ? (
                  d ? <div className="flex flex-wrap items-center gap-3">{d.salary_expectation && <span className="inline-flex items-center gap-1.5 text-[13px] text-mist"><Wallet size={14} aria-hidden="true" /> {d.salary_expectation}</span>}<ResumeLink resumePath={d.resume_url} /></div> : <span className="text-[13px] text-mist">Loading details...</span>
                ) : (
                  <button onClick={() => handleUnlock(c.user_id)} disabled={isPending && pendingId === c.user_id} className="inline-flex items-center gap-1.5 rounded-pill bg-plum-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-plum-700 disabled:opacity-60"><Lock size={13} aria-hidden="true" />{isPending && pendingId === c.user_id ? "Unlocking..." : "Unlock profile"}</button>
                )}
              </div>
            </div>
          );
        })}
        {list.length === 0 && <p className="col-span-2 rounded-card border border-dashed border-line p-8 text-center text-[14.5px] text-mist">No candidates match that search.</p>}
      </div>

      {hasMore && <div className="mt-6 flex justify-center"><button onClick={loadMore} disabled={loadingMore} className="inline-flex items-center gap-1.5 rounded-pill border border-line px-5 py-2.5 text-[13.5px] font-medium text-ink/80 hover:border-plum-300 disabled:opacity-60">{loadingMore && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}{loadingMore ? "Loading..." : "Load more"}</button></div>}
    </div>
  );
}
