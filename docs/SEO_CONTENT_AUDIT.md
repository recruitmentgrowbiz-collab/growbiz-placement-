# SEO content and technical audit

Scope: root Next.js application at `C:/growbiz-site`; the nested `growbiz-site/` legacy copy is unchanged. Reference: all 24 pages of the supplied August 2026 master brief. The user explicitly supersedes the brief's older purple colour direction and requests Indian audience targeting. No new backend connections or business claims are authorised by the document alone.

## Research and implementation

See [SEO_KEYWORD_MAP.md](SEO_KEYWORD_MAP.md) for sources, search intent, long-tail terms and the map prepared before content edits. Qualitative research only; no volume, ranking or traffic estimates are claimed.

Content is configured in `features/public-content/seo-content.ts`, the existing resource content adapter, homepage content and recruitment service data. Existing routes and layouts are retained. Titles use absolute page values to avoid repeating the long parent brand suffix. Homepage approved headline is retained intentionally; exact-match keyword placement does not override approved positioning.

## Colour system

| Token | Value | Purpose |
| --- | --- | --- |
| --gb-ink | #0F172A | Navy text and dark sections |
| --gb-magenta | #C90DFF | Large highlighted words, indicators and accents |
| --gb-magenta-action | #A400CF | Accessible white-text buttons and small links |
| --gb-magenta-hover | #8B00B0 | Hover and focus |
| --gb-magenta-soft | #FDF2FF | Subtle supporting surface |
| --gb-background / --gb-surface | #FFFFFF | Main background and cards |
| --gb-surface-muted | #FCFAFD | Muted surface |
| --gb-border | #E8E1EC | Soft card/control boundaries |
| --gb-text-muted | #5E6777 | Supporting text |

Contrast against white: action 6.04:1, hover 7.71:1, bright accent 4.21:1 (restricted to large text and non-text accents). CSS stores RGB channels so Tailwind opacity modifiers continue to work. Existing plum utility names are compatibility aliases. Navy replaces deep purple panels; large panels do not use bright magenta. Buttons, active navigation, cards, illustration SVGs, payment accent, footer and workspace accents share the token system. Existing typography, radius, spacing and motion primitives are preserved. The image was inspected in the conversation; exact pixel sampling was unavailable because no local image file was supplied. Colours use the user's stated values and visible reference.

## Per-route audit

### `/`

- Search intent: Mixed discovery / hiring
- Primary keyword: Recruitment and job portal India
- Secondary keywords: jobs in India; hire talent; recruitment services
- Audience: Candidates and employers
- H1: Hire Better. Find Better Opportunities.
- Title: Grow Biz Recruitment & Placement | Jobs & Hiring in India
- Meta description: Find jobs in India or hire talent with Grow Biz Recruitment & Placement. Explore free job applications, recruitment services, staffing and campus hiring.
- H2/H3 structure: Employer solutions; Candidate journey; Recruitment services; Jobs; Campus; Resources; Trust. Supporting guide/service headings sit below their parent section.
- Internal links: /jobs, /employers, /recruitment-services, /campus, /career-resources
- Structured data: Organization, WebSite
- Index/canonical: index; self-canonical
- Changes: Preserved approved dual-audience positioning and headline; selective hero accent, India portal context, demo vacancy disclosure, Organization/WebSite schema.

### `/jobs`

- Search intent: Transactional job search
- Primary keyword: Jobs in India
- Secondary keywords: fresher jobs; experienced jobs; latest job openings; remote jobs; internships
- Audience: Candidates
- H1: Find Jobs in India That Match Your Skills
- Title: Jobs in India | Search Openings by Skill | Grow Biz Jobs
- Meta description: Search jobs in India by role, skill, location, experience and work mode. Explore fresher and experienced opportunities. Job applications are free.
- H2/H3 structure: Job results; Find relevant jobs; Candidate safety. Supporting guide/service headings sit below their parent section.
- Internal links: /jobs?experience=fresher, /career-resources, /report
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical; filters/search/sort noindex -> /jobs; valid unfiltered pages self-canonical; invalid pages render not-found/noindex
- Changes: Short India-focused introduction; results first; role/skill/experience guidance after results; crawlable pagination links; demo disclosure; filter canonical and expiry handling.

### `/employers`

- Search intent: Commercial hiring
- Primary keyword: Hire talent in India
- Secondary keywords: job posting; candidate search; applicant management; recruitment solutions
- Audience: Employers and recruiters
- H1: Hire Talent in India With Flexible Recruitment Solutions
- Title: Hire Talent in India | Job Posting & Recruitment | Grow Biz
- Meta description: Post jobs, manage applicants and search eligible candidate profiles. Explore managed recruitment, staffing and RPO for your hiring needs in India.
- H2/H3 structure: Hiring benefits; Workflow; Memberships; Managed recruitment; Verification; FAQ. Supporting guide/service headings sit below their parent section.
- Internal links: /pricing, /recruitment-services, /employer/signup
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: India hiring intent, job posting/applicant/search/services introduction, practical plan copy, strict verification/consent explanation, corrected FAQ lookup.

### `/recruitment-services`

- Search intent: Commercial service enquiry
- Primary keyword: Recruitment services in India
- Secondary keywords: IT recruitment; non-IT recruitment; bulk hiring; executive search; contract staffing; RPO
- Audience: Employers
- H1: Recruitment Services in India for Your Hiring Needs
- Title: Recruitment Services in India | Staffing & RPO | Grow Biz
- Meta description: Discuss corporate, IT and non-IT recruitment, bulk hiring, executive search, staffing, campus hiring and RPO with Grow Biz. Share your hiring requirement.
- H2/H3 structure: Core recruitment; Specialized hiring; High-volume and staffing; Campus; RPO; Process. Supporting guide/service headings sit below their parent section.
- Internal links: /contact, /employers, /campus
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: India recruitment intent; retained 11 substantial service sections, specific process and CTAs; removed unapproved retainer/SLA/partner-network claims.

### `/pricing`

- Search intent: Commercial plan comparison
- Primary keyword: Employer hiring plans
- Secondary keywords: job posting plans; candidate access; recruiter seats
- Audience: Employers
- H1: Choose an Employer Hiring Plan for Your Team
- Title: Employer Hiring Plans & Job Posting | Grow Biz Jobs
- Meta description: Compare employer hiring plans for job posting, candidate access and recruiter seats. Contact Grow Biz for pricing and separately scoped recruitment support.
- H2/H3 structure: Plans; Plan comparison; Recruitment support; Pricing FAQ. Supporting guide/service headings sit below their parent section.
- Internal links: /contact, /employers, /recruitment-services
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: Plans remain Contact/Custom; removed implementation jargon, explained access limits, verification and separately scoped managed recruitment.

### `/career-resources`

- Search intent: Informational guidance
- Primary keyword: Career resources for Indian job seekers
- Secondary keywords: resume tips; interview preparation; expected CTC; notice period; skills; career growth
- Audience: Candidates
- H1: Career Resources for Indian Job Seekers
- Title: Career Resources | Resume & Interview Tips | Grow Biz Jobs
- Meta description: Practical career resources for Indian job seekers: improve your resume, prepare interview examples, discuss expected CTC and notice period, and plan your skills.
- H2/H3 structure: Resume; Interview; Salary; Skills; Career Growth; Workplace. Supporting guide/service headings sit below their parent section.
- Internal links: /jobs, /jobs?experience=fresher, /career-plus
- Structured data: BreadcrumbList
- Index/canonical: index; self-canonical
- Changes: Expanded existing hub into six practical guides: resume, interview, salary/CTC/notice period, skills, career growth and workplace. Topic anchors, H2/H3s and relevant job links. No new article routes.

### `/career-plus`

- Search intent: Commercial support enquiry
- Primary keyword: Optional career support
- Secondary keywords: resume support; interview preparation; career readiness
- Audience: Candidates
- H1: Optional Career Support With Career Plus
- Title: Career Plus | Optional Resume & Interview Support | Grow Biz
- Meta description: Explore optional resume, interview and career-readiness support with Career Plus. Applications remain free; paid support does not influence hiring decisions.
- H2/H3 structure: Preparation support; Hiring separation; FAQ. Supporting guide/service headings sit below their parent section.
- Internal links: /contact, /career-resources, /jobs
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: Optional career support intent; clear application/hiring separation, availability and price enquiry instead of launch/configuration wording.

### `/campus`

- Search intent: Partnership / early-career discovery
- Primary keyword: Campus recruitment India
- Secondary keywords: graduate hiring; fresher opportunities; internships; campus placement support
- Audience: Students, institutes and employers
- H1: Campus Recruitment and Fresher Opportunities in India
- Title: Campus Recruitment & Fresher Opportunities | Grow Biz India
- Meta description: Explore campus recruitment, fresher jobs and internships. Students, institutes and employers can connect with Grow Biz for hiring and placement-drive support.
- H2/H3 structure: For Students and Freshers; For Institutes; For Employers; Workflow; FAQ. Supporting guide/service headings sit below their parent section.
- Internal links: /jobs?experience=fresher, /employers, /contact
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: India campus intent; separate student/fresher, institute and employer H2s; descriptive fresher link and navy final CTA.

### `/about`

- Search intent: Brand research
- Primary keyword: About Grow Biz Recruitment & Placement
- Secondary keywords: Grow Biz Jobs; recruitment and technology; hiring support
- Audience: All audiences
- H1: About Grow Biz Recruitment & Placement
- Title: About Grow Biz Recruitment & Placement | Grow Biz Jobs
- Meta description: Learn how Grow Biz Recruitment & Placement supports employers and job seekers through recruitment services, hiring tools and the Grow Biz Jobs marketplace.
- H2/H3 structure: Who we are; Services; Principles; Audiences. Supporting guide/service headings sit below their parent section.
- Internal links: /jobs, /employers, /recruitment-services
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: Clear brand identity and Grow Biz Jobs product explanation; service-scope cross-link, factual audience paths retained.

### `/contact`

- Search intent: Navigational contact
- Primary keyword: Contact Grow Biz Recruitment & Placement
- Secondary keywords: employer enquiry; candidate support; campus partnership
- Audience: All audiences
- H1: Contact Grow Biz Recruitment & Placement
- Title: Contact Grow Biz Recruitment & Placement
- Meta description: Contact Grow Biz about hiring, job applications, career support or campus partnerships. Choose employer, candidate, institute or general enquiry.
- H2/H3 structure: Enquiry types; Enquiry form; Safety. Supporting guide/service headings sit below their parent section.
- Internal links: /report, /faq
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: Contact-intent title/H1, concise enquiry routing; form placed first on mobile; no invented contact information.

### `/faq`

- Search intent: Informational support
- Primary keyword: Grow Biz Jobs FAQ
- Secondary keywords: free applications; employer verification; hiring decisions
- Audience: Candidates and employers
- H1: Grow Biz Jobs: Frequently Asked Questions
- Title: Grow Biz Jobs FAQ | Applications, Hiring & Verification
- Meta description: Find answers about free job applications, employer verification, candidate access, managed recruitment and optional career support on Grow Biz Jobs.
- H2/H3 structure: Candidates; Employers; Recruitment services; Trust and safety. Supporting guide/service headings sit below their parent section.
- Internal links: /jobs, /employers, /report, /career-plus
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: Approved answers retained as HTML; corrected section IDs and linked safety page. No FAQ rich-result schema.

### `/report`

- Search intent: Safety / reporting
- Primary keyword: Report suspicious jobs
- Secondary keywords: job scam warning signs; payment requests; fake employer
- Audience: Candidates and employers
- H1: Report a Suspicious Job or Employer
- Title: Report Suspicious Jobs & Payment Requests | Grow Biz Jobs
- Meta description: Report suspicious jobs, fake employers or payment requests on Grow Biz Jobs. Learn warning signs and remember that job applications are free.
- H2/H3 structure: Warning signs; Report form; Candidate safety. Supporting guide/service headings sit below their parent section.
- Internal links: /jobs, /faq, /contact
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: index; self-canonical
- Changes: Explicit free applications and suspicious payment reporting; concise warning signs, honest unsent-form status.

### `/privacy`

- Search intent: Legal reference
- Primary keyword: Privacy Policy Grow Biz Jobs
- Secondary keywords: policy; support
- Audience: All audiences
- H1: Privacy Policy
- Title: Privacy Policy | Grow Biz Jobs
- Meta description: Read the privacy policy page for Grow Biz Jobs. Approved policy wording is pending review; contact Grow Biz with questions.
- H2/H3 structure: Existing policy sections (pending review). Supporting guide/service headings sit below their parent section.
- Internal links: /contact
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: noindex; pending approved legal wording; excluded from sitemap
- Changes: Unique metadata and canonical; noindex until substantive approved policy text replaces the existing placeholder. No legal wording invented.

### `/terms`

- Search intent: Legal reference
- Primary keyword: Terms of Use Grow Biz Jobs
- Secondary keywords: policy; support
- Audience: All audiences
- H1: Terms of Use
- Title: Terms of Use | Grow Biz Jobs
- Meta description: Read the terms of use page for Grow Biz Jobs. Approved policy wording is pending review; contact Grow Biz with questions.
- H2/H3 structure: Existing policy sections (pending review). Supporting guide/service headings sit below their parent section.
- Internal links: /contact
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: noindex; pending approved legal wording; excluded from sitemap
- Changes: Unique metadata and canonical; noindex until substantive approved policy text replaces the existing placeholder. No legal wording invented.

### `/refund-policy`

- Search intent: Legal reference
- Primary keyword: Refund Policy Grow Biz Jobs
- Secondary keywords: policy; support
- Audience: All audiences
- H1: Refund Policy
- Title: Refund Policy | Grow Biz Jobs
- Meta description: Read the refund policy page for Grow Biz Jobs. Approved policy wording is pending review; contact Grow Biz with questions.
- H2/H3 structure: Existing policy sections (pending review). Supporting guide/service headings sit below their parent section.
- Internal links: /contact
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: noindex; pending approved legal wording; excluded from sitemap
- Changes: Unique metadata and canonical; noindex until substantive approved policy text replaces the existing placeholder. No legal wording invented.

### `/candidate-consent`

- Search intent: Legal reference
- Primary keyword: Candidate Data Consent Grow Biz Jobs
- Secondary keywords: policy; support
- Audience: All audiences
- H1: Candidate Data Consent
- Title: Candidate Data Consent | Grow Biz Jobs
- Meta description: Read the candidate data consent page for Grow Biz Jobs. Approved policy wording is pending review; contact Grow Biz with questions.
- H2/H3 structure: Existing policy sections (pending review). Supporting guide/service headings sit below their parent section.
- Internal links: /contact
- Structured data: None; no unnecessary rich-result markup
- Index/canonical: noindex; pending approved legal wording; excluded from sitemap
- Changes: Unique metadata and canonical; noindex until substantive approved policy text replaces the existing placeholder. No legal wording invented.

### `/jobs/[id]`

- Intent/audience: transactional role search for candidates.
- Primary: [actual job title] in [actual location]; secondary: company, actual skills, experience and work mode.
- H1: actual job title, unchanged.
- Title: [title] in [location] | [company] | Grow Biz Jobs.
- Description: [title] at [company], [location]. [experience]; [mode]. Review requirements and apply free.
- H2: About the role, Responsibilities, Requirements, Preferred qualifications, Skills, Company summary, Candidate safety, Job details, Similar opportunities. H3: company name.
- Links: /jobs, corresponding company, related jobs, report flow.
- Schema: BreadcrumbList; JobPosting only for a non-demo, active, published vacancy with a real publication date and supplied physical address or remote applicant eligibility.
- Index/canonical: self-canonical; demo and closed/expired jobs noindex; draft/paused/unknown IDs render not-found/noindex. Request-time rendering keeps expiry current.
- Changes: removed fabricated relative-date conversion and default expiry; optional numeric pay only; remote eligibility explicit; closing date shown when supplied; safe JSON-LD serialization; no invented directApply claim.

### `/companies/[id]`

- Intent/audience: company careers and job search for candidates.
- Primary: [company name] jobs; secondary: careers and known industry.
- H1: company name.
- Title: [company name] Jobs & Careers | Grow Biz Jobs.
- Description: Explore [company] jobs and careers [industry if known]. View company details and [count] listed roles on Grow Biz Jobs.
- H2: About [company] when description exists; Jobs at [company]; Company information; Verified Employer only when verified. Job cards retain role titles as descriptive links.
- Links: corresponding job details, /jobs and factual external website if supplied.
- Schema: BreadcrumbList.
- Index/canonical: self-canonical; mock profiles noindex; unknown IDs 404. Request-time rendering keeps active count current.
- Changes: removed fabricated index-based verification and team size; removed role description masquerading as company description; demo disclosure; active-only vacancies; removed nested main landmark.

## Technical findings and decisions

- Segmented sitemap index: `/sitemap.xml` -> `/sitemaps/jobs.xml`, `/sitemaps/companies.xml`, `/sitemaps/content.xml`. Same public service adapters as route rendering; no disconnected DB-only URLs, synthetic last-modified timestamps, demo inventory, expired jobs, filters, internal pages or policy shells. Job/company segments are intentionally empty while the current public adapters serve demo data.
- Robots allows public crawling. Internal/auth routes receive `X-Robots-Tag: noindex, nofollow`; existing internal layouts also retain noindex metadata. Not blocking these HTML routes in robots allows crawlers to observe noindex. API paths remain disallowed. Indexing controls do not provide access control.
- No new role/location pages, service subpages or article detail routes. No mass-generated keyword pages. Existing aliases retain their redirects.
- No FAQPage schema: the FAQ documentation currently redirects to Search updates. Visible native details/summary answers are retained for users and crawlers. No unsupported author, address, phone, social link, business review or founding date schema.
- Images: public visuals are lightweight decorative SVGs with aria-hidden; no new raster images, image downloads or heavy visual libraries. Existing font swap/preconnect retained. Raster image optimisation remains relevant when real assets are introduced.
- Mobile: smaller first-screen H1 and hero spacing, wrapping CTA labels, form-first contact layout, 44px shared links, native job pagination and visible filter control. Requested viewport QA is recorded below.
- Architecture: mock adapters, Supabase integrations, authentication and dashboard feature architecture preserved. The nested legacy copy is excluded from root TypeScript/lint scope. Build output can use `GROWBIZ_BUILD_DIR` to avoid locking the user's existing development build.

## Remaining launch issues

- Public job/company adapters are demos; replace through existing service boundaries with approved live inventory before enabling their indexing. Real dates, structured address/remote eligibility and numeric salary units must be supplied. Do not infer them from display strings.
- Existing contact/report forms do not deliver submissions. Updated feedback explicitly says nothing was sent; connecting a backend is outside this request.
- Existing internal dashboards expose mock data without full production role enforcement. Noindex is in place, but existing authentication/authorization must be completed before exposing real sensitive data.
- Legal policies, public phone/address/email, commercial pricing and verification policy require business/legal confirmation already identified in the brief. No values invented.
- Search Console ownership, sitemap submission, Google live URL/Rich Results validation and real field Core Web Vitals require the deployed site and appropriate access. No indexing/ranking outcome is claimed.
- 21st catalogue search requires login; retained the supplied visual direction and existing primitives. No third-party UI package was added.

## Validation

- `npm run lint`: passed with no warnings or errors. ESLint configured for the existing Next 14 app; literal prose apostrophes are allowed. App Router global font loading is excluded from the Pages Router-only font rule.
- `npm run typecheck`: passed.
- `GROWBIZ_BUILD_DIR=.next-seo npm run build`: passed (104 generated pages; public pages server-rendered). A pre-existing process locked the normal `.next/trace`, so the existing preview was left intact.
- `node --test tests/seo.test.cjs`: 7/7 passed (original dates, salary types, vacancy lifecycle, remote eligibility, JSON-LD escaping, canonical/indexing, sitemap exclusions).
- Browser: 36 public pages (16 static routes, 10 job details, 10 company profiles), each at 320, 390, 430, 768, 1024 and 1440px. 216 viewport checks; no horizontal overflow; one H1 in both server HTML and browser DOM; no heading-level jumps; 36 unique titles and descriptions; no browser console/runtime errors.
- Screenshots inspected for home, jobs, job detail, company, employers, recruitment services, pricing, career resources, campus, about and contact at desktop and mobile widths.
- Mobile filter drawer opens and closes with Escape. Pagination links retain query state; page 2 exposes the remaining inventory. Internal link HTTP checks found no broken destination.
- All tested internal/auth routes returned noindex headers; existing internal layouts also rendered noindex. Employer alias kept its 307 redirect. Filter/sort pages noindex with /jobs canonical; page 2 self-canonical.
- Missing company/ordinary URLs return HTTP 404. Under the existing jobs loading boundary, unknown job IDs and invalid pagination render the not-found screen with noindex but may return HTTP 200 after streaming starts. Metadata now validates before generating an indexable canonical. This is [documented Next.js streamed not-found behaviour](https://nextjs.org/docs/14/app/api-reference/file-conventions/not-found), not a successful vacancy response. Kept existing loading UX; strict 404 status requires changing that streaming boundary.
- Public visuals are SVG; no raster alt text omissions were introduced. An empty favicon data URI suppresses the browser's missing-favicon request while an approved icon master is unavailable.
- Local, unthrottled headless Chrome observations at 390px: homepage LCP 1.016s, CLS 0; jobs LCP 0.096s, CLS 0; career hub LCP 0.128s, CLS 0. These are local smoke measurements, not field Core Web Vitals or production performance claims.
- 21st review ran; existing transition-all warnings and its inability to resolve global focus/token styles were reviewed. Removed focus-outline suppression on public job controls; local primitives retained. Catalogue search remained unavailable without login.
- Browser harness: `tests/browser-seo.cjs`; set `PLAYWRIGHT_MODULE` to an installed Playwright module and optionally `CHROME_PATH`, `QA_BASE_URL`, `QA_OUTPUT`. Default preview is localhost:3100. Detailed JSON/screenshots were saved outside the repo in the local temp QA folder.


## Rendered dynamic URL inventory

| URL | H1 | Title | Indexing |
| --- | --- | --- | --- |
| /jobs/graduate-trainee-operations-gurugram-3120 | Graduate Trainee - Operations | Graduate Trainee - Operations in Gurugram, Haryana  /  Veltrix Logistics  /  Grow Biz Jobs | noindex, follow |
| /jobs/customer-support-associate-hubballi-2755 | Customer Support Associate | Customer Support Associate in Hubballi, Karnataka  /  Anchorline Retail  /  Grow Biz Jobs | noindex, follow |
| /jobs/software-intern-hyderabad-6602 | Software Development Intern | Software Development Intern in Hyderabad, Telangana  /  Kiln Labs  /  Grow Biz Jobs | noindex, follow |
| /jobs/field-sales-executive-pune-0587 | Field Sales Executive | Field Sales Executive in Pune, Maharashtra  /  Solara Renewables  /  Grow Biz Jobs | noindex, follow |
| /jobs/hr-generalist-noida-9021 | HR Generalist | HR Generalist in Noida, Uttar Pradesh  /  Brightpath Consulting  /  Grow Biz Jobs | noindex, follow |
| /jobs/backend-engineer-bengaluru-2201 | Backend Engineer | Backend Engineer in Bengaluru, Karnataka  /  Northbridge Fintech  /  Grow Biz Jobs | noindex, follow |
| /jobs/manufacturing-supervisor-nashik-1890 | Manufacturing Supervisor | Manufacturing Supervisor in Nashik, Maharashtra  /  Ferro Industries  /  Grow Biz Jobs | noindex, follow |
| /jobs/digital-marketing-executive-ahmedabad-3345 | Digital Marketing Executive | Digital Marketing Executive in Ahmedabad, Gujarat  /  Loom & Leaf Interiors  /  Grow Biz Jobs | noindex, follow |
| /jobs/senior-product-designer-remote-4410 | Senior Product Designer | Senior Product Designer in Remote (India)  /  Hearth & Co  /  Grow Biz Jobs | noindex, follow |
| /jobs/regional-account-manager-chennai-7734 | Regional Account Manager | Regional Account Manager in Chennai, Tamil Nadu  /  Palmleaf FMCG  /  Grow Biz Jobs | noindex, follow |
| /companies/veltrix-logistics | Veltrix Logistics | Veltrix Logistics Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/anchorline-retail | Anchorline Retail | Anchorline Retail Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/kiln-labs | Kiln Labs | Kiln Labs Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/solara-renewables | Solara Renewables | Solara Renewables Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/brightpath-consulting | Brightpath Consulting | Brightpath Consulting Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/northbridge-fintech | Northbridge Fintech | Northbridge Fintech Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/ferro-industries | Ferro Industries | Ferro Industries Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/loom-leaf-interiors | Loom & Leaf Interiors | Loom & Leaf Interiors Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/hearth-co | Hearth & Co | Hearth & Co Jobs & Careers  /  Grow Biz Jobs | noindex, follow |
| /companies/palmleaf-fmcg | Palmleaf FMCG | Palmleaf FMCG Jobs & Careers  /  Grow Biz Jobs | noindex, follow |

## Files changed

- `.21st/DESIGN.md`
- `.21st/design.json`
- `.eslintrc.json`
- `.gitignore`
- `app/about/page.tsx`
- `app/campus/page.tsx`
- `app/candidate-consent/page.tsx`
- `app/career-plus/page.tsx`
- `app/career-resources/page.tsx`
- `app/companies/[id]/page.tsx`
- `app/contact/page.tsx`
- `app/employers/page.tsx`
- `app/faq/page.tsx`
- `app/globals.css`
- `app/jobs/[id]/page.tsx`
- `app/jobs/page.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `app/pricing/page.tsx`
- `app/privacy/page.tsx`
- `app/recruitment-services/page.tsx`
- `app/refund-policy/page.tsx`
- `app/report/page.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `app/sitemap.xml/route.ts`
- `app/sitemaps/companies.xml/route.ts`
- `app/sitemaps/content.xml/route.ts`
- `app/sitemaps/jobs.xml/route.ts`
- `app/terms/page.tsx`
- `components/ContactForm.tsx`
- `components/Footer.tsx`
- `components/HeaderClient.tsx`
- `components/HeroArt.tsx`
- `components/Logo.tsx`
- `components/ReportForm.tsx`
- `components/SearchBar.tsx`
- `components/employer/RazorpayCheckout.tsx`
- `components/jobs/JobsBrowser.tsx`
- `components/ui.tsx`
- `docs/SEO_CONTENT_AUDIT.md`
- `docs/SEO_KEYWORD_MAP.md`
- `features/companies/mock/companies.ts`
- `features/companies/services/companies.ts`
- `features/companies/types.ts`
- `features/homepage/content.ts`
- `features/jobs/mock/jobs.ts`
- `features/jobs/services/jobs.ts`
- `features/jobs/types.ts`
- `features/jobs/utils/filters.ts`
- `features/jobs/utils/lifecycle.ts`
- `features/public-content/mock/content.ts`
- `features/public-content/seo-content.ts`
- `features/public-content/types.ts`
- `lib/data.ts`
- `lib/seo.ts`
- `lib/sitemaps.ts`
- `next.config.mjs`
- `package-lock.json`
- `package.json`
- `tailwind.config.ts`
- `tests/browser-seo.cjs`
- `tests/seo.test.cjs`
- `tsconfig.json`
