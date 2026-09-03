# Grow Biz Jobs — Phase 1-3 MVP

Public website + candidate portal + employer portal + admin moderation + recruiter workspace for
**Grow Biz Recruitment & Placement**, built from `Website & Job Portal Developer Master Brief v1.0`
and the supporting operating docs (Branding, Website Content & Page Copy, Finance & Pricing).

Real backend: **Supabase (Postgres + Auth + Storage)**, per the brief's tech recommendation.

## What's built

**Public site** — homepage, job search/detail, employer landing, all 11 recruitment services,
pricing, about, campus, career resources, FAQ, contact, and company profile pages
(`/companies/[id]`). Job listings blend real employer-posted jobs (from the database) with
illustrative demo jobs, so the site never looks empty on a fresh install. JobPosting structured
data (schema.org) on every job detail page for search visibility. Dynamic `sitemap.xml` and
`robots.txt`.

**Auth** — candidate signup, employer signup (creates a company + free-plan membership together),
unified login that routes by role, session-aware header with a notification bell, protected
routes via middleware.

**Candidate portal** (`/candidate/dashboard`) — editable profile, resume upload to private
storage, live profile-completeness score, applications list with status, saved jobs.

**Employer portal** (`/employer/dashboard`) — company profile (with logo upload) + verification
status + verification document upload, job posting (enforces the plan's active-jobs limit),
applicant pipeline with stage changes, interview scheduling, internal notes on applicants,
pause/republish/close controls, candidate database search (verification-gated, unlock-quota
tracked, resume access gated by real unlock records — see Security below), self-serve plan
switching with real Razorpay checkout.

**Admin** (`/admin`) — employer verification queue (approve/reject/needs review, with submitted
documents visible before deciding), job moderation, user role management (`/admin/users`,
promote to recruiter/admin from the UI), analytics dashboard (`/admin/analytics`, live counts +
managed-recruitment fee totals), and a manual maintenance runner for job/membership expiry.

**Recruiter workspace** (`/recruiter`) — cross-company requisition list (every job on the
platform, not just one employer's), applicant pipeline per job with the same interview
scheduling and internal notes as the employer side, and placement tracking with fee calculation
(annual CTC × fee % → amount) and fee-status updates (pending/invoiced/paid).

**Notifications** — database triggers log four event types (new applicant, application stage
change, verification decision, placement recorded) to an in-app `notifications` table (bell icon
in the header), plus real email (Resend) and SMS (Twilio) dispatch for the same events. Both
external channels are strictly best-effort — a missing API key, disabled preference, or send
failure never breaks the action that triggered it; in-app is the only channel that's guaranteed.
Users control email/SMS independently at `/settings`, along with a phone number.

**Payments** — real Razorpay checkout for paid plan upgrades (Starter/Growth/Pro). Order creation
and payment verification both happen server-side; the client's "success" callback is never
trusted alone — the HMAC signature is what confirms a real payment before entitlements change. A
webhook provides a second, independent confirmation path in case the browser closes early. The
Free plan switches instantly since there's nothing to charge. Payment verification is idempotent
— a duplicate webhook/verify call can't double-extend a membership.

**Account data rights** — self-service data export (`/settings`, downloads a JSON file of
everything tied to your account) and self-service account deletion (cascades through every
table via `on delete cascade` back to `auth.users`; the deletion request itself is recorded in
`account_deletion_requests` first, deliberately without a foreign key, so the audit trail
survives the user it's about).

**Job and membership expiry** — `jobs.expires_at` and `memberships.ends_at` existed from the
start but nothing ever enforced either. Fixed with: a defensive RLS policy so expired jobs
disappear from public search immediately (not just after a batch job runs), an
`expire_stale_jobs()` function for the status-column cleanup, a `downgrade_expired_memberships()`
function that resets lapsed paid plans to free-tier limits, and job-posting/candidate-unlock
checks that compute *effective* entitlements rather than trusting a possibly-stale stored limit.
Three ways to run the cleanup functions: the manual "Run now" button on `/admin/analytics`
(always available, zero config), `pg_cron` if your Supabase plan supports it, or the
`/api/cron/maintenance` endpoint for any external scheduler (Vercel Cron config included).

**Rate limiting** — a database-level primitive (`check_rate_limit()`), not an external
service, so it works identically regardless of which code path triggers an action. Signup:
5/hour per IP. Login: 8 attempts per 15 minutes per email (protects one account from credential
stuffing even across many IPs). Job applications: 20/hour per candidate, enforced by a database
trigger so it holds even though applications currently insert from the client. Job posting:
10/hour per user, independent of — and in addition to — the plan's monthly entitlement. Candidate
unlocks: 20/minute per user, closing the "a monthly quota isn't a rate limit" gap (previously
nothing stopped burning through a whole month's allowance in seconds).

**Pagination** — `/jobs` and the employer candidate search previously loaded every matching
row in one query, with search filtering only what was already loaded client-side (meaning a
search could silently miss real matches once there was more data than fit in memory). Both now
query and filter server-side: `/jobs` uses real page-based pagination (24/page) with search
terms hitting the trigram-indexed columns directly; candidate search uses a "Load more" pattern
since it needs to preserve unlock state across loads. Demo job listings only appear on the
default, unfiltered first page of `/jobs` — once you search, filter, or page forward, only real
results show.

**Notification delivery tracking** — every email/SMS attempt now writes a row to
`notification_deliveries` (sent, failed, or skipped — and why), instead of just logging failures
to the server console where nobody would ever see them. Two webhooks correlate real outcomes back
to those rows: Resend confirms delivered/bounced/complained, Twilio confirms delivered/failed via
a status callback URL set automatically on every SMS send. `/admin/notifications` shows the last
100 attempts with status and error detail — "sent" is now a checkable claim, not an assumption.

**Phone/OTP login** (candidates only, per design) — a candidate verifies a phone number once
in `/settings` via Supabase's native phone OTP mechanism, then can log in with a text-message
code instead of a password from then on. Deliberately scoped as login-only, not signup: phone
login uses `shouldCreateUser: false` so an unrecognized number fails cleanly instead of silently
creating an account, and phone verification uses `updateUser()` (which only ever modifies an
already-authenticated account) rather than touching the new-user-creation trigger at all — that
trigger already broke signup once this session, and a second, untested code path through it
wasn't worth the risk for what's fundamentally a convenience feature. Full phone-first signup
(no email required) remains a deliberately separate, not-yet-built feature.

## Security highlights

Full Postgres Row Level Security throughout. Employer A cannot query Employer B's jobs,
applicants or notes at the database level — not just hidden in the UI (`0002_rls.sql`).
Recruiters get scoped cross-company access via a separate policy set, not by being added as a
member of every company.

Candidate resume/salary access follows *applying is consent, browsing isn't*: an employer can see
a candidate's full profile (including resume) only if that candidate applied to one of their
jobs, or if the employer unlocked them through search — never just by being a verified employer.
Search results show teaser fields only (headline, location, skills) via a `search_candidates()`
function. Enforced at both the table level (`0007_candidate_visibility.sql`) and the storage
level (`0006_tighten_resume_access.sql`).

Admin analytics is a database function that checks admin status itself
(`get_admin_analytics()`), not a plain view — a plain view granted broadly would let any
logged-in candidate query revenue figures directly through the client SDK.

Payment confirmation requires a verified HMAC signature server-side; the webhook uses a
service-role client (`lib/supabase/admin.ts`) specifically because it has no user session to
rely on. The Resend and Twilio delivery webhooks use the same pattern — Resend's Svix-format
signature and Twilio's own HMAC scheme are both verified before any database write happens.

## What's NOT built yet

- Razorpay subscription/auto-renewal (this implements one-time order payments per upgrade, not
  recurring billing)
- AI resume/matching features (Phase 4 in your roadmap)
- OTP/full phone-first signup (login-only phone auth is built — see above; new candidates can't
  yet sign up with just a phone number, no email)
- Your actual approved logo (a placeholder mark is used throughout — `components/Logo.tsx`)
- Company logos aren't yet threaded through to job cards or public company pages, only the
  employer's own editor

## Setup

### 1. Create a Supabase project

Go to [supabase.com/dashboard](https://supabase.com/dashboard) → New Project.

### 2. Run the migrations

In your project's SQL Editor, run these 14 files in order — one at a time, confirming each
succeeds before the next:

1. `0001_schema.sql` — core tables
2. `0002_rls.sql` — row level security
3. `0003_recruiter_workspace.sql` — interviews, placements, notifications, recruiter access
4. `0004_notification_triggers.sql` — auto-notify on key events
5. `0005_payments.sql` — payment order tracking
6. `0006_tighten_resume_access.sql` — resume file access, storage-level
7. `0007_candidate_visibility.sql` — candidate table access, table-level
8. `0008_fix_new_user_trigger.sql` — fixes a signup-breaking bug in the new-user trigger
9. `0009_notification_preferences.sql` — phone numbers, preferences, admin role management
10. `0010_logos_interviews_analytics.sql` — company logo storage, admin analytics function
11. `0011_expiry_and_deletion.sql` — membership/job expiry enforcement, account deletion
12. `0012_indexes.sql` — performance indexes
13. `0013_data_integrity.sql` — CHECK constraints
14. `0014_verification_documents.sql` — verification document uploads, recruiter notes access
15. `0015_rate_limiting.sql` — rate limiting primitive + application-insert trigger
16. `0016_candidate_search_pagination.sql` — adds limit/offset to search_candidates()
17. `0017_notification_delivery_tracking.sql` — delivery log table

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your project's URL + anon/publishable key from Settings → API in your Supabase dashboard.

### 4. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 5. Create your first admin or recruiter user

New signups default to the `candidate` or `employer` role. Admin (`/admin`) and recruiter
(`/recruiter`) accounts aren't self-service by design — sign up normally, then in the Supabase
SQL Editor run:

```sql
update public.profiles set role = 'admin' where id = 'the-user-uuid-from-auth.users';
-- or role = 'recruiter'
```

Once you have one admin, you can promote everyone else from `/admin/users` instead of SQL.

### 6. Turn off email confirmation (for local testing)

By default, Supabase requires email confirmation before login, and their shared free email
service has a very low send limit. For local testing: Authentication → Providers → Email → turn
off "Confirm email" → **Save**. (Double-check it actually saved — this setting not saving is a
common gotcha.) Configure a real SMTP provider before going live.

### 7. (Optional) Connect Razorpay for real plan payments

Without this, the Free plan still switches instantly, but paid plans (Starter/Growth/Pro) won't
have anything to check out with.

1. Create a Razorpay account and get your API keys (Settings → API Keys) — use test mode first.
2. Add `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_ID`, and `RAZORPAY_KEY_SECRET` to `.env.local`.
3. Get your Supabase service_role key (Settings → API) and add it as `SUPABASE_SERVICE_ROLE_KEY`
   — server-only, never expose this to the browser.
4. In Razorpay, set up a webhook pointing to `https://your-domain.com/api/razorpay/webhook`,
   subscribed to `payment.captured`, and add its signing secret as `RAZORPAY_WEBHOOK_SECRET`.

### 8. (Optional) Connect Resend for real emails

Without this, notifications stay in-app only (the bell icon).

1. Create a [Resend](https://resend.com) account and verify a sending domain.
2. Add `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to `.env.local`.
3. Also needs `SUPABASE_SERVICE_ROLE_KEY` (step 7) to look up recipient email addresses.
4. (Optional, for real delivery/bounce tracking) Resend dashboard → Webhooks → add one pointing
   to `https://your-domain.com/api/webhooks/resend`, subscribe to `email.sent`, `email.delivered`,
   `email.bounced`, and `email.complained`, then add its signing secret as
   `RESEND_WEBHOOK_SECRET`. Without this, sends still work — `/admin/notifications` just won't
   move past "sent" to "delivered"/"bounced".

### 9. (Optional) Connect Twilio for real SMS

Without this, the SMS toggle in `/settings` just won't do anything.

1. Create a [Twilio](https://twilio.com) account and get a phone number.
2. Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` to `.env.local`.
3. Users need a phone number saved in `/settings` with SMS notifications turned on — both are
   off by default.
4. Delivery/failure tracking works automatically once `NEXT_PUBLIC_APP_URL` is set correctly —
   no separate Twilio dashboard webhook setup needed, the status callback URL is sent with every
   message.

### 10. (Optional) Enable phone login for candidates

Without this, the "Phone code" tab on the login page will show errors when used — password
login is unaffected either way.

1. In Supabase: Authentication → Providers → Phone → enable it.
2. Choose an SMS provider for Supabase to send OTPs through (Twilio is the natural choice since
   you likely already have an account from step 9) and enter those credentials here — this is a
   separate configuration from your app's own `TWILIO_*` env vars, since Supabase Auth sends
   OTPs directly, not through your app's code.
3. No code/env changes needed beyond this — candidates verify their number at `/settings`, then
   the "Phone code" login tab works.

### 11. (Optional) Automate job/membership expiry

Without this, expiry still works — the "Run now" button on `/admin/analytics` handles it
manually, with zero config.

**For scheduled automation, pick one:**

- **pg_cron** (if your Supabase plan supports it): Database → Extensions → enable "pg_cron", then
  in the SQL Editor:
  ```sql
  select cron.schedule('expire-stale-jobs', '0 2 * * *', 'select public.expire_stale_jobs()');
  select cron.schedule('downgrade-expired-memberships', '0 3 * * *', 'select public.downgrade_expired_memberships()');
  ```
- **Any external scheduler** (works regardless of Supabase plan): add a random string as
  `CRON_SECRET` in `.env.local` and your hosting provider's environment variables. On Vercel,
  `vercel.json` in the repo root wires this up automatically. Anywhere else, point a scheduler
  (cron-job.org, GitHub Actions, etc.) at
  `https://your-domain.com/api/cron/maintenance?secret=YOUR_CRON_SECRET` once a day.

## Deploying

Standard Next.js 14 App Router project — deploy to Vercel, Netlify, or any Node host. Set the
same environment variables in your hosting provider's dashboard.

```bash
npm run build
npm run start
```

## Project structure

```
app/
  page.tsx                       Homepage
  jobs/                          Public job search + detail (DB + demo jobs merged)
  companies/[id]/                Public company profile pages
  employers/ recruitment-services/ pricing/ about/ campus/ career-resources/ faq/ contact/
  privacy/ terms/ report/        Legal and trust pages
  signup/ login/ candidate/signup/ employer/signup/ settings/
  candidate/dashboard/           Candidate portal
  employer/dashboard/            Employer portal (jobs, candidates, plan, company)
  admin/                         Verification, moderation, users, analytics
  recruiter/                     Cross-company requisitions + placement tracking
  api/razorpay/                  Order creation, payment verification, webhook
  api/notify/                    New-applicant email/SMS trigger (client-side apply flow)
  api/webhooks/resend/           Email delivery/bounce confirmation
  api/webhooks/twilio/           SMS delivery/failure confirmation
  api/account/export/            Data export endpoint
  api/cron/maintenance/          External-scheduler-compatible expiry endpoint
components/                      UI primitives, forms, dashboard widgets
lib/data.ts                      Demo/illustrative content (jobs, services, pricing, FAQs)
lib/seo.ts                       JobPosting structured data builder
lib/email.ts, sms.ts             Resend/Twilio dispatch (fail-safe, preference-aware)
lib/razorpay.ts                  Order creation + signature verification helpers
lib/rate-limit.ts                Rate limiting helper (IP resolution + RPC wrapper)
lib/supabase/
  client.ts, server.ts            Supabase client factories (browser / server)
  admin.ts                        Service-role client (webhooks, data export lookups only)
  types.ts                        TypeScript types matching the DB schema
  queries.ts, mappers.ts          Public-page data fetching + display mapping
  actions.ts                      Auth server actions
  employer-actions.ts             Job posting, pipeline, candidates, plan, company actions
  admin-actions.ts                Verification, moderation, roles, maintenance actions
  recruiter-actions.ts            Cross-company pipeline + placement actions
  notes-actions.ts                Shared application-notes actions (employer + recruiter)
  notification-actions.ts         Preferences, account deletion
middleware.ts                     Session refresh + protects dashboard/settings routes
supabase/migrations/              17 files, run in order — see Setup step 2
vercel.json                       Optional: wires up daily maintenance cron on Vercel
```

## Next steps

1. Add Razorpay Subscriptions for auto-renewal instead of one-time order payments per upgrade
2. Swap the placeholder logo mark (`components/Logo.tsx`) for your approved asset, and thread
   company logos through to job cards and public company pages
3. Full phone-first signup for candidates (currently phone auth is login-only for existing accounts)
4. True one-click email unsubscribe (current "manage preferences" link requires being logged in;
   a signed-token link would remove that requirement)
