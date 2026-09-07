-- ============================================================================
-- Grow Biz Jobs — Anonymous Report/Contact Submissions
-- reports_insert (0002_rls.sql) required auth.uid() = reporter_id, which
-- fails for an anonymous submitter even with a null reporter_id — NULL =
-- NULL evaluates to NULL, not true, in Postgres. This blocked the entire
-- public contact form (which the brief scopes as usable by anyone, not
-- just logged-in users) and "report this job" for anonymous visitors from
-- ever actually working. Logged-in job reports still attribute correctly;
-- anonymous submissions now work with a null reporter_id.
-- Run this AFTER 0001-0017.
-- ============================================================================

drop policy "reports_insert" on public.reports;

create policy "reports_insert" on public.reports
  for insert with check (
    (auth.uid() is not null and reporter_id = auth.uid())
    or (auth.uid() is null and reporter_id is null)
  );
