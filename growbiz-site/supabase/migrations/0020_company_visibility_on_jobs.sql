-- ============================================================================
-- Grow Biz Jobs — Company Visibility on Job Listings
-- companies_select (0002_rls.sql) only allowed reading a company's row if
-- verified, a member, admin, or recruiter — which meant an unverified
-- company's job postings (themselves already publicly visible per
-- jobs_select) showed a generic "Company" placeholder instead of the real
-- name, since the embedded companies(*) join was silently filtered out by
-- RLS. Verification should gate the full company PROFILE PAGE
-- (/companies/[id] already enforces this at the application level) and
-- candidate-database search access — not whether a candidate can see who's
-- hiring for a job that's already public. Extends the policy to also allow
-- reading a company's row if it has at least one published job.
-- Run this AFTER 0001-0019.
-- ============================================================================

drop policy "companies_select" on public.companies;

create policy "companies_select" on public.companies
  for select using (
    verification_status = 'verified'
    or public.is_company_member(id)
    or public.is_admin()
    or public.is_recruiter()
    or exists (
      select 1 from public.jobs j
      where j.company_id = companies.id and j.status = 'published'
    )
  );
