-- ============================================================================
-- Grow Biz Jobs — Employer Verification Documents + Recruiter Notes Access
-- Two related fixes:
--   1. Admin could approve/reject a company's verification_status with
--      nothing to actually review — no document upload existed anywhere.
--      This adds a private storage bucket + tracking table so employers
--      submit real evidence and admins can view it before approving.
--   2. application_notes only granted employer company members access —
--      recruiters had no way to leave "client notes" on an applicant,
--      despite that being an explicit recruiter-workspace feature.
-- Run this AFTER 0001-0013.
-- ============================================================================

create table public.company_verification_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  file_name text not null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.company_verification_documents enable row level security;

create policy "verification_documents_select" on public.company_verification_documents
  for select using (public.is_company_member(company_id) or public.is_admin());

create policy "verification_documents_insert" on public.company_verification_documents
  for insert with check (public.is_company_member(company_id));

create policy "verification_documents_delete" on public.company_verification_documents
  for delete using (public.is_company_member(company_id) or public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: private bucket. Company members manage their own folder
-- (path convention: verification-documents/{company_id}/filename), admins
-- can read everything to review submissions.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('verification-documents', 'verification-documents', false)
on conflict (id) do nothing;

create policy "verification_doc_owner_all" on storage.objects
  for all using (
    bucket_id = 'verification-documents'
    and exists (
      select 1 from public.company_users cu
      where cu.user_id = auth.uid()
      and cu.company_id::text = (storage.foldername(name))[1]
    )
  );

create policy "verification_doc_admin_read" on storage.objects
  for select using (
    bucket_id = 'verification-documents' and public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- application_notes originally only granted access to employer company
-- members (0002_rls.sql) — recruiters had no way to leave "client notes" on
-- an applicant, despite that being an explicit recruiter-workspace feature
-- in the brief. Extending rather than replacing the existing policy.
-- ---------------------------------------------------------------------------
drop policy "application_notes_rw" on public.application_notes;

create policy "application_notes_rw" on public.application_notes
  for all using (
    public.is_admin()
    or public.is_recruiter()
    or exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.id = application_id and public.is_company_member(j.company_id)
    )
  );
