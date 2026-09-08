# UI polish audit

## Scope and patterns

Preserved the existing navy/magenta palette, page copy, headings, metadata, routes, filters, authentication and service adapters. No backend connected or dependencies added.

Used `C:/Users/rohit/.codex/skills/ui-ux-pro-max/SKILL.md`, its `references/quick-reference.md`, and search results from its style/UX modules: restrained glassmorphism, keyboard navigation, sticky navigation, hover versus tap, reduced motion and excessive motion. Adapted transparency for readable recruitment content; long articles and dashboard data retain opaque surfaces.

## Changes

| Area | Implementation |
|---|---|
| Shared surfaces | `glass-soft`, `glass-elevated`, `glass-interactive`; white 88–98% surfaces, subtle magenta borders, restrained shadows, 14px desktop blur. |
| Motion | Shared 220ms transitions, buttons lift 1px and selected cards 2px on fine-pointer hover; reduced motion removes transforms. |
| Header | Opaque initial background, translucent blurred surface after scrolling, stable navigation order. |
| Search Jobs | Outlined control with subtle lilac glass hover and visible focus. |
| Hire Talent | Strong filled CTA, darker hover, inset highlight and restrained sheen. |
| Login/navigation | Ghost feedback, animated underline, persistent active indicator and 44px targets. |
| Mobile menu | Secondary actions in drawer, safe-area spacing, readable near-opaque surface. |
| Cards | Selected homepage, job, campus and pricing cards gain restrained glass hover; job titles remain navy. |
| Service/resources | Short preview cards use glass; long content cards use border/tint feedback without blur or lift. |
| Dashboards | Subtle stat-card feedback, quick-action hover and simple table-row tint. Employer actions wrap; long text breaks safely. |
| Dialogs/drawers | Portals escape sticky/blurred ancestors; bounded scrolling, Escape dismissal, focus trap, focus restoration, inert background and body scroll lock. |
| Accessibility | Visible keyboard focus, touch actions independent of hover, disabled/busy styling, reduced-motion/transparency and forced-color rules. |
| Mobile performance | Fine-pointer-only hover, 6px soft-surface blur, no blur on mobile elevated drawers. |

## Files changed in this pass

- `app/globals.css`
- `app/page.tsx`, `app/admin/page.tsx`, `app/campus/page.tsx`
- `app/candidate/dashboard/page.tsx`, `app/employer/dashboard/page.tsx`, `app/recruiter/page.tsx`
- `app/career-resources/page.tsx`, `app/recruitment-services/page.tsx`, `app/pricing/page.tsx`, `app/jobs/[id]/page.tsx`
- `components/ui.tsx`, `components/HeaderClient.tsx`, `components/HeroArt.tsx`, `components/SearchBar.tsx`, `components/JobCard.tsx`
- `components/WorkspaceShell.tsx`, `components/ApplyPanel.tsx`, `components/useDialogFocus.ts`
- `components/ContactForm.tsx`, `components/ReportForm.tsx`, `components/candidate/ProfileCompletenessCard.tsx`, `components/jobs/JobsBrowser.tsx`
- `tests/browser-ui.cjs`, this audit

Earlier SEO changes in the working tree are separate from this polish pass.

## Verification

- Lint: passed without warnings.
- Typecheck: passed.
- Existing SEO tests: 7/7 passed.
- Production build: passed; 104 static pages generated, isolated `.next-seo` output.
- Browser: 14 routes × 8 widths = 112 viewport checks passed; HTTP 200, one H1, no horizontal overflow, no console/page errors.
- Widths: 320, 360, 390, 430, 768, 1024, 1280, 1440px.
- Routes: `/`, `/jobs`, `/jobs/backend-engineer-bengaluru-2201`, `/employers`, `/recruitment-services`, `/pricing`, `/career-resources`, `/campus`, `/about`, `/contact`, `/candidate/dashboard`, `/employer/dashboard`, `/recruiter`, `/admin`.
- Interaction checks passed: primary sheen/darker hover, outlined glass hover, header scroll blur, job-card hover/navy title, reduced motion, touch save, header/filter/workspace/report focus trapping and Escape restoration.
- Source comparison against the pre-polish snapshot: page TSX unchanged after removing class attributes; `features`, `lib` and `config` unchanged.
- Screenshots and machine-readable results: `C:/temos/growbiz-ui-qa/`.

No remaining visual issues identified in tested Chrome viewports. Safari/Firefox and physical-device performance were not verified.

## Continuation pass

- Added the requested reusable aliases: `glass-hover`, `glass-strong`, `glass-button`, `glass-panel`, `glass-card-hover`.
- Tightened the glass formula to 58-78% white surfaces, 14-18px blur, saturation, white edge highlights, soft depth shadows and faint magenta reflection only on hover.
- Updated shared `ButtonLink` variants with `primary-glass`, `secondary-glass` and `ghost-glass`.
- Improved Search Jobs, Hire Talent, Login, nav hover capsules, menu/save icon buttons, hero floating cards, search surface and service-card arrow/accent interactions.
- Mobile keeps readable static surfaces with 8-10px blur and no hover-only information.
- Browser QA now validates gradient CTA sheen, outlined glass hover, scroll blur, card hover blur/lift, focus traps, reduced motion and touch save feedback.

## Hero visual animation pass

- Converted `HeroArt` into a lightweight client component only for pointer parallax; no animation dependency was added.
- Preserved the lilac circle, dotted orbit, triangular node graph, 3 outer nodes, center node and both floating card texts.
- Added staged entrance: circle scale/fade, orbit fade, line draw, staggered nodes, center node, then staggered floating cards.
- Added idle motion: subtle circle breathing, orbit shimmer/rotation, line opacity pulse, node float/pulse and card float.
- Added tiny desktop parallax through CSS variables, capped to about 10px total pointer shift with layered depth.
- Mobile disables pointer parallax naturally and keeps the hero visual stacked below the left content.
- Reduced motion disables parallax loops, floats, pulses and line drawing, leaving a minimal fade-in.
- Added `tests/hero-ui.cjs` to verify homepage hero visibility, animation styles, parallax variables, reduced motion, console errors and overflow at 320, 390, 430, 768, 1024, 1280 and 1440px.
