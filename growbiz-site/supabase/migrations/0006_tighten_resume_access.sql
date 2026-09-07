-- ============================================================================
-- Grow Biz Jobs — Tighten Resume Access
-- Closes a gap flagged since 0002_rls.sql: employers could previously read a
-- discoverable candidate's resume file as soon as their company was verified,
-- without an actual unlock record. That made the unlock-quota system in
-- lib/supabase/employer-actions.ts (unlockCandidate) advisory rather than
-- enforced. This migration makes the unlock record the actual gate on the
-- file itself, at the RLS layer, which is the only place that can't be
-- bypassed by calling the API a different way.
-- Run this AFTER 0001-0005.
-- ============================================================================

drop policy if exists "resume_employer_read" on storage.objects;

create policy "resume_employer_read" on storage.objects
  for select using (
    bucket_id = 'resumes' and exists (
      select 1 from public.candidate_unlocks cu
      join public.company_users cou on cou.company_id = cu.company_id
      where cu.candidate_id::text = (storage.foldername(name))[1]
      and cou.user_id = auth.uid()
    )
  );

-- Recruiters run managed recruitment across every employer's candidates and
-- don't go through the per-employer unlock flow — they're trusted internal
-- staff, gated by role rather than by unlock quota.
create policy "resume_recruiter_read" on storage.objects
  for select using (
    bucket_id = 'resumes' and public.is_recruiter()
  );

-- Applying to a job is itself consent to share your resume with THAT employer
-- for THAT application — this must not require a separate unlock, or the
-- applicant pipeline (employer reviewing people who applied to them) breaks.
-- Unlock quota only gates proactive candidate-database SEARCH, not applicants.
create policy "resume_employer_applicant_read" on storage.objects
  for select using (
    bucket_id = 'resumes' and exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.candidate_id::text = (storage.foldername(name))[1]
      and public.is_company_member(j.company_id)
    )
  );
