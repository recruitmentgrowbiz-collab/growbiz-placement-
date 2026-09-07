-- ============================================================================
-- Grow Biz Jobs — AI Feature Support (Phase 4)
-- Your brief's AI guardrails (Section 17) require: showing AI output as
-- suggestions not facts, allowing edits before anything is saved, never
-- auto-rejecting based on an opaque AI score, and logging model-assisted
-- actions. This table is that log — every AI generation this app produces
-- (job description help, resume feedback, applicant fit summaries) writes
-- one row here, with the input and output stored separately for
-- auditability, before anything is ever shown to a user as "AI suggested
-- this, you decide."
-- Run this AFTER 0001-0020.
-- ============================================================================

create type ai_generation_type as enum ('job_description', 'resume_feedback', 'applicant_summary');

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid references public.profiles(id) on delete set null,
  generation_type ai_generation_type not null,
  target_id uuid,
  input_snapshot jsonb not null default '{}',
  output text not null,
  created_at timestamptz not null default now()
);

create index idx_ai_generations_requested_by on public.ai_generations(requested_by);
create index idx_ai_generations_target_id on public.ai_generations(target_id);

alter table public.ai_generations enable row level security;

-- Requester can see their own generations; admins can see everything (audit).
create policy "ai_generations_select" on public.ai_generations
  for select using (requested_by = auth.uid() or public.is_admin());

-- Written only by server-side code using the requesting user's own session —
-- no client ever inserts here directly with an arbitrary requested_by.
create policy "ai_generations_insert" on public.ai_generations
  for insert with check (requested_by = auth.uid());
