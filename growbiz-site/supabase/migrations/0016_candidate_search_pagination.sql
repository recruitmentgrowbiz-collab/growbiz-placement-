-- ============================================================================
-- Grow Biz Jobs — Candidate Search Pagination
-- search_candidates() (0007_candidate_visibility.sql) returned every
-- matching discoverable candidate in one call — fine at a handful of
-- candidates, a real problem once the database has thousands. Adds
-- limit/offset parameters with backward-compatible defaults, so existing
-- callers (none currently rely on unlimited results being exhaustive) keep
-- working without a code change, while the employer candidate search page
-- now passes explicit pagination.
-- Run this AFTER 0001-0015.
-- ============================================================================

create or replace function public.search_candidates(
  search_query text default '',
  p_limit integer default 30,
  p_offset integer default 0
)
returns table (
  user_id uuid,
  headline text,
  location text,
  skills text[]
)
language sql
security definer
stable
as $$
  select c.user_id, c.headline, c.location, c.skills
  from public.candidates c
  where c.discoverable = true
    and exists (
      select 1 from public.company_users cu
      join public.companies co on co.id = cu.company_id
      where cu.user_id = auth.uid() and co.verification_status = 'verified'
    )
    and (
      search_query = ''
      or c.headline ilike '%' || search_query || '%'
      or c.location ilike '%' || search_query || '%'
      or exists (select 1 from unnest(c.skills) s where s ilike '%' || search_query || '%')
    )
  order by c.updated_at desc
  limit p_limit offset p_offset;
$$;

grant execute on function public.search_candidates to authenticated;
