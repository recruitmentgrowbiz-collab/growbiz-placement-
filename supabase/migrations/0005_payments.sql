-- ============================================================================
-- Grow Biz Jobs — Payments
-- Tracks Razorpay orders for employer membership upgrades. A payment only
-- upgrades a membership's entitlements once its signature is verified
-- server-side (see app/api/razorpay/verify/route.ts) — never on the client's
-- say-so alone.
-- Run this AFTER 0001-0004.
-- ============================================================================

create type payment_status as enum ('created', 'paid', 'failed');

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan text not null,
  amount_paise integer not null,
  razorpay_order_id text not null unique,
  razorpay_payment_id text,
  status payment_status not null default 'created',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.payments enable row level security;

create policy "payments_select" on public.payments
  for select using (public.is_company_member(company_id) or public.is_admin());

-- Inserts and updates happen only via the server (service-role-adjacent server
-- actions / route handlers using the user's session), scoped to their own company.
create policy "payments_insert" on public.payments
  for insert with check (public.is_company_member(company_id));

create policy "payments_update" on public.payments
  for update using (public.is_company_member(company_id) or public.is_admin());
