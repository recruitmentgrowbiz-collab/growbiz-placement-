-- ============================================================================
-- Grow Biz Jobs — Repair Verification Documents + Candidate Search Pagination
-- Safe to run after 0001-0022. This repairs Supabase projects where 0014 or
-- 0016 was missed or only partially applied.
-- ============================================================================

create table if not exists public.company_verification_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  file_name text not null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.company_verification_documents
  add column if not exists uploaded_by uuid references public.profiles(id),
  add column if not exists created_at timestamptz not null default now();

alter table public.company_verification_documents enable row level security;

grant select, insert, delete on public.company_verification_documents to authenticated;
grant usage on schema storage to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'company_verification_documents'
      and policyname = 'verification_documents_select'
  ) then
    create policy "verification_documents_select" on public.company_verification_documents
      for select using (public.is_company_member(company_id) or public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'company_verification_documents'
      and policyname = 'verification_documents_insert'
  ) then
    create policy "verification_documents_insert" on public.company_verification_documents
      for insert with check (public.is_company_member(company_id));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'company_verification_documents'
      and policyname = 'verification_documents_delete'
  ) then
    create policy "verification_documents_delete" on public.company_verification_documents
      for delete using (public.is_company_member(company_id) or public.is_admin());
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('verification-documents', 'verification-documents', false)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'verification_doc_owner_all'
  ) then
    create policy "verification_doc_owner_all" on storage.objects
      for all using (
        bucket_id = 'verification-documents'
        and exists (
          select 1 from public.company_users cu
          where cu.user_id = auth.uid()
          and cu.company_id::text = (storage.foldername(name))[1]
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'verification_doc_admin_read'
  ) then
    create policy "verification_doc_admin_read" on storage.objects
      for select using (
        bucket_id = 'verification-documents' and public.is_admin()
      );
  end if;
end $$;

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

grant execute on function public.search_candidates(text, integer, integer) to authenticated;
