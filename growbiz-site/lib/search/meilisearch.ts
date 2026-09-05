/**
 * Optional dedicated search layer (your brief's Phase 5). Falls back to the
 * existing PostgreSQL trigram search (lib/supabase/queries.ts) whenever
 * Meilisearch isn't configured — this is additive, not a replacement that
 * breaks search if the service isn't set up. Meilisearch specifically
 * (over Algolia/Typesense) because it's open-source and self-hostable if
 * you outgrow the free cloud tier, matching the spirit of "when justified"
 * in your brief rather than locking into a single paid vendor immediately.
 */

const MEILI_HOST = process.env.MEILISEARCH_HOST;
const MEILI_KEY = process.env.MEILISEARCH_API_KEY;

export function isSearchConfigured(): boolean {
  return !!(MEILI_HOST && MEILI_KEY);
}

async function meiliFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${MEILI_HOST}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${MEILI_KEY}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Meilisearch request failed (${res.status}): ${await res.text()}`);
  }
  return res.json();
}

export type SearchableJob = {
  id: string;
  title: string;
  location: string;
  mode: string;
  fresher_eligible: boolean;
  company_name: string;
  status: string;
};

/**
 * Upserts one job into the search index. Called from job create/update
 * actions — best-effort, never throws to the caller, since a search-index
 * hiccup should never block someone from actually posting a job.
 */
export async function indexJob(job: SearchableJob): Promise<void> {
  if (!isSearchConfigured()) return;
  try {
    await meiliFetch("/indexes/jobs/documents", {
      method: "POST",
      body: JSON.stringify([job]),
    });
  } catch (err) {
    console.error("Meilisearch index update failed:", err);
  }
}

export async function removeJobFromIndex(jobId: string): Promise<void> {
  if (!isSearchConfigured()) return;
  try {
    await meiliFetch(`/indexes/jobs/documents/${jobId}`, { method: "DELETE" });
  } catch (err) {
    console.error("Meilisearch delete failed:", err);
  }
}

/**
 * Returns null (not an empty array) when search isn't configured or the
 * request fails, so callers can distinguish "no results" from "fall back
 * to Postgres" — an empty array would be indistinguishable from a
 * legitimate zero-result search.
 */
export async function searchJobs(
  query: string,
  filters: { modes?: string[]; fresherOnly?: boolean },
  page: number,
  pageSize: number
): Promise<{ ids: string[]; totalCount: number } | null> {
  if (!isSearchConfigured()) return null;

  const filterParts: string[] = [];
  if (filters.modes && filters.modes.length > 0) {
    filterParts.push(`(${filters.modes.map((m) => `mode = "${m}"`).join(" OR ")})`);
  }
  if (filters.fresherOnly) filterParts.push("fresher_eligible = true");
  filterParts.push('status = "published"');

  try {
    const result = await meiliFetch("/indexes/jobs/search", {
      method: "POST",
      body: JSON.stringify({
        q: query,
        filter: filterParts.join(" AND "),
        offset: (page - 1) * pageSize,
        limit: pageSize,
      }),
    });
    return {
      ids: (result.hits ?? []).map((h: any) => h.id),
      totalCount: result.estimatedTotalHits ?? result.hits?.length ?? 0,
    };
  } catch (err) {
    console.error("Meilisearch query failed, falling back to Postgres:", err);
    return null;
  }
}
