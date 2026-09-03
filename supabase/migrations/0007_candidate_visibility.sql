-- ============================================================================
-- Grow Biz Jobs — Candidate Table Visibility Hardening
-- 0006 fixed resume FILE access (storage). This closes the matching gap at
-- the table level: candidates_select previously let any verified employer
-- read ANY discoverable candidate's full row directly — including
-- resume_url and salary_expectation — with no unlock required at all.
-- This replaces that with two narrow, intentional paths:
--   1. Employer can see a candidate's row if that candidate applied to one
--      of their jobs (applying is consent — matches 0006's applicant policy).
--   2. Employer can see a candidate's row after unlocking them via search.
-- Browsing/searching before unlock now goes through search_candidates(),
-- which returns teaser fields only (no resume_url, no salary).
-- Run this AFTER 0001-0006.
-- ============================================================================

drop policy "candidates_select" on public.candidates;

create policy "candidates_select" on public.candidates
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or public.is_recruiter()
    or exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.candidate_id = candidates.user_id and public.is_company_member(j.company_id)
    )
    or exists (
      select 1 from public.candidate_unlocks cu
      where cu.candidate_id = candidates.user_id and public.is_company_member(cu.company_id)
    )
  );

-- ---------------------------------------------------------------------------
-- search_candidates() — the browse/search list. Teaser fields only.
-- ---------------------------------------------------------------------------
create or replace function public.search_candidates(search_query text default '')
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
    );
$$;

grant execute on function public.search_candidates to authenticated;
