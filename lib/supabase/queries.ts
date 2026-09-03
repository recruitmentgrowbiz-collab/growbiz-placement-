import { createClient } from "./server";
import type { DbJob } from "./types";

const JOBS_PAGE_SIZE = 24;

export type JobFilters = {
  q?: string;
  location?: string;
  modes?: string[];
  fresherOnly?: boolean;
  page?: number;
};

export async function getPublishedJobsPaginated(
  filters: JobFilters
): Promise<{ jobs: DbJob[]; totalCount: number; page: number; pageSize: number }> {
  const supabase = createClient();
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * JOBS_PAGE_SIZE;
  const to = from + JOBS_PAGE_SIZE - 1;

  let query = supabase
    .from("jobs")
    .select("*, companies(*)", { count: "exact" })
    .eq("status", "published");

  // Uses the trigram indexes from 0012_indexes.sql — without those, this
  // wildcard-prefixed ilike would be a full table scan at any real scale.
  if (filters.q) {
    query = query.or(`title.ilike.%${filters.q}%,location.ilike.%${filters.q}%`);
  }
  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }
  if (filters.modes && filters.modes.length > 0) {
    query = query.in("mode", filters.modes);
  }
  if (filters.fresherOnly) {
    query = query.eq("fresher_eligible", true);
  }

  const { data, count } = await query.order("created_at", { ascending: false }).range(from, to);

  return {
    jobs: (data as DbJob[]) ?? [],
    totalCount: count ?? 0,
    page,
    pageSize: JOBS_PAGE_SIZE,
  };
}

export async function getPublishedJobs(): Promise<DbJob[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, companies(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return (data as DbJob[]) ?? [];
}

export async function getJobById(id: string): Promise<DbJob | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, companies(*)")
    .eq("id", id)
    .maybeSingle();
  return (data as DbJob) ?? null;
}

export async function getScreeningQuestions(jobId: string): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("screening_questions")
    .select("question")
    .eq("job_id", jobId)
    .order("sort_order");
  return (data ?? []).map((r) => r.question);
}

export async function getCompanyById(id: string) {
  const supabase = createClient();
  const { data } = await supabase.from("companies").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getCompanyJobs(companyId: string): Promise<DbJob[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("jobs")
    .select("*, companies(*)")
    .eq("company_id", companyId)
    .eq("status", "published")
    .order("created_at", { ascending: false });
  return (data as DbJob[]) ?? [];
}
