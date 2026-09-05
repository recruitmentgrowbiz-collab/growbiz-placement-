-- ============================================================================
-- Grow Biz Jobs — Indexes & Data Integrity
-- Two things that are easy to forget and both apply here:
--   1. Postgres does NOT automatically index foreign key columns (only
--      primary keys and unique constraints get automatic indexes) — every
--      join and filter we've been doing (jobs by company, applications by
--      candidate/job, unlocks by company) has been a sequential scan.
--   2. Several fields have obvious integrity rules the schema never
--      enforced (salary_min <= salary_max, fee_percent in a sane range).
-- Run this AFTER 0001-0011.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Foreign key / filter column indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_jobs_company_id on public.jobs(company_id);
create index if not exists idx_jobs_status on public.jobs(status);
create index if not exists idx_jobs_owner_id on public.jobs(owner_id);
create index if not exists idx_jobs_expires_at on public.jobs(expires_at) where status = 'published';

create index if not exists idx_applications_candidate_id on public.applications(candidate_id);
create index if not exists idx_applications_job_id on public.applications(job_id);
create index if not exists idx_applications_stage on public.applications(stage);

create index if not exists idx_company_users_user_id on public.company_users(user_id);
create index if not exists idx_company_users_company_id on public.company_users(company_id);

create index if not exists idx_candidate_unlocks_company_id on public.candidate_unlocks(company_id);
create index if not exists idx_candidate_unlocks_candidate_id on public.candidate_unlocks(candidate_id);
create index if not exists idx_candidate_unlocks_created_at on public.candidate_unlocks(created_at);

create index if not exists idx_notifications_user_unread
  on public.notifications(user_id) where read_at is null;

create index if not exists idx_interviews_application_id on public.interviews(application_id);
create index if not exists idx_placements_company_id on public.placements(company_id);
create index if not exists idx_placements_candidate_id on public.placements(candidate_id);
create index if not exists idx_saved_jobs_candidate_id on public.saved_jobs(candidate_id);
create index if not exists idx_screening_questions_job_id on public.screening_questions(job_id);
create index if not exists idx_application_notes_application_id on public.application_notes(application_id);
create index if not exists idx_payments_company_id on public.payments(company_id);

-- ---------------------------------------------------------------------------
-- Trigram indexes for the ILIKE searches in search_candidates() and the
-- public jobs listing — without this every keyword search is a full table
-- scan with a wildcard-prefixed LIKE, which no plain btree index can use.
-- ---------------------------------------------------------------------------
create extension if not exists pg_trgm;

create index if not exists idx_candidates_headline_trgm on public.candidates using gin (headline gin_trgm_ops);
create index if not exists idx_candidates_location_trgm on public.candidates using gin (location gin_trgm_ops);
create index if not exists idx_jobs_title_trgm on public.jobs using gin (title gin_trgm_ops);
create index if not exists idx_jobs_location_trgm on public.jobs using gin (location gin_trgm_ops);
