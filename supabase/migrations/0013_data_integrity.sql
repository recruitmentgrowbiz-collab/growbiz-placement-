-- ============================================================================
-- Grow Biz Jobs — Data Integrity Constraints
-- Separate from 0012_indexes.sql on purpose: if you've already created test
-- jobs/placements with data that violates one of these (e.g. a typo'd
-- salary range), this file failing won't roll back the indexes, which are
-- unconditionally safe. If a statement below fails, the error will name the
-- constraint and you can query for the offending row before retrying —
-- e.g. `select * from jobs where salary_min > salary_max;`
-- Run this AFTER 0012.
-- ============================================================================

alter table public.jobs
  add constraint jobs_salary_range_check
  check (salary_min is null or salary_max is null or salary_min <= salary_max);

alter table public.jobs
  add constraint jobs_experience_min_check
  check (experience_min >= 0);

alter table public.placements
  add constraint placements_fee_percent_check
  check (fee_percent is null or (fee_percent >= 0 and fee_percent <= 100));

alter table public.placements
  add constraint placements_annual_ctc_check
  check (annual_ctc is null or annual_ctc >= 0);

alter table public.memberships
  add constraint memberships_limits_check
  check (active_jobs_limit >= 0 and candidate_unlocks_limit >= 0);
