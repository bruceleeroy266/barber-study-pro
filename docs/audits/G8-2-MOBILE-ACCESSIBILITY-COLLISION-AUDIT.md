# G8-2 — Mobile + Accessibility Collision Audit

**Project:** ASCYN PRO  
**Gate:** Gate 8 — Mobile + Accessibility Reliability  
**Slice:** G8-2 — Collision Audit  
**Status:** AUDIT ONLY — NO UI / RUNTIME / SCHEMA CHANGE  
**Baseline:** production `main` at `25b1bb2471cd684fa3edfd5ea0ca8af3ac6dbf1e`  
**Product Boundary classification:** **COMPETE**

## Product-boundary check

> **Product-boundary check:** PASS — this Gate complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and is classified as **COMPETE**. No DO NOT BUILD capability is introduced.

**Guarded-zone contact:** UI/accessibility only. No source-of-truth, calculation, ownership, institutional scope, schema, RLS, grading, H&A, TLS, pilot, Exam Ready scoring, or communications-permission change is introduced.

## 1. Audit method

This slice performs static current-main inspection before any Gate 8 implementation code.

Evidence sources:
- current production layouts and navigation components;
- current shared modal/form/table/messaging components;
- current student learning + Exam Ready components;
- current admin user-management UI;
- current responsive Playwright suites;
- existing accessibility foundation reports only as historical context, never as current proof.

Severity:
- **BLOCKER** — prevents a required workflow or creates severe access failure.
- **HIGH** — materially impairs keyboard/mobile/screen-reader use across a critical workflow or broad route family.
- **MEDIUM** — meaningful access/usability defect with a workaround or narrower blast radius.
- **LOW** — polish/consistency issue with low task-completion risk.
- **ACCEPT** — current implementation already satisfies the inspected Gate 8 contract area; preserve it.

## 2. Executive result

Static current-main audit result:

- **BLOCKER:** 0
- **HIGH:** 7
- **MEDIUM:** 8
- **LOW:** 4
- **ACCEPT / preserve:** 10

No UI code is changed in G8-2.

The dominant collision themes are:
1. inconsistent mobile navigation semantics/focus behavior across roles;
2. a student-only fixed-header layout offset mismatch;
3. a global skip link whose target exists only on protected portal layouts;
4. form/filter labeling gaps on admin operational surfaces;
5. overly-chatty live-region behavior in Exam Ready;
6. older responsive tests that are too shallow for the locked Gate 8 contract;
7. no automated accessibility regression scanner currently found in the repo.

## 3. Route × role × issue × severity matrix

| ID | Route / surface | Role | Component / file | Category | Finding | Severity | Required Gate 8 disposition |
|---|---|---|---|---|---|---|---|
| G8A-001 | Public/auth routes including `/`, `/login`, `/signup`, `/reset-password`, `/pilot` | Public/Auth | `src/app/layout.tsx` + public/auth pages | Keyboard / bypass blocks | Global “Skip to main content” link always targets `#main-content`, but current search finds that target only in student/instructor/admin layouts. Public/auth pages therefore receive a skip link with no destination. | **HIGH** | Give all rendered route families a real main landmark/target or scope skip link to layouts that provide the target. |
| G8A-002 | All student `/dashboard/*` routes | Student/Apprentice | `src/app/(dashboard)/layout.tsx`, `DashboardNav.tsx` | Mobile layout | Student nav uses a fixed mobile header, but the dashboard main wrapper has no `pt-16` or equivalent spacer. Instructor uses `pt-16`; admin inserts a mobile spacer. Student content can begin underneath the fixed header. | **HIGH** | Add a shared mobile shell offset without changing page/business logic. |
| G8A-003 | All student `/dashboard/*` routes | Student/Apprentice | `DashboardNav.tsx` | Accessible name/state | Student hamburger button has no `aria-label`, `aria-expanded`, or `aria-controls`. Instructor already implements all three. | **HIGH** | Bring student control to the same semantic contract as instructor nav. |
| G8A-004 | Student, instructor, admin mobile nav overlays | Student/Staff/Admin | `DashboardNav.tsx`, `InstructorNav.tsx`, `AdminNav.tsx` | Focus / keyboard | Full-screen mobile nav overlays do not implement explicit focus entry, Escape close, focus containment, or trigger-focus restoration. Instructor button semantics are strong, but overlay focus behavior remains implicit. | **HIGH** | Create one shared accessible mobile-nav overlay behavior; do not change destinations/permissions. |
| G8A-005 | `/dashboard/exam-ready` active exam | Student/Apprentice | `ExamShell.tsx` | Screen reader / live regions | Countdown text is `aria-live="polite"` while updating every second. This can create continuous screen-reader announcements and interfere with answering questions. | **HIGH** | Remove per-second live announcement; announce meaningful thresholds/state changes instead while keeping server timer authoritative. |
| G8A-006 | `/admin/users` | Admin/School Admin | `UserManagementClient.tsx` | Forms / labels | Search input and role/status filters rely on placeholder/option text; no explicit label or accessible name is present in the inspected filter controls. | **HIGH** | Add persistent labels or programmatic names; no filter behavior change. |
| G8A-007 | Automated Gate 8 coverage | All roles | responsive Playwright suites / repo test stack | Certification coverage | Existing responsive suites test 375px/768px/1280px and often only the first element(s). Instructor touch test accepts 20px despite Gate 8’s ~44px target. No current automated axe-style accessibility scanner was found. | **HIGH** | G8-3+ must add current contract coverage: 320/360/390, zoom/reflow, keyboard, names/roles/states, touch targets, and automated a11y regression where practical. |
| G8A-008 | Admin mobile nav | Admin/School Admin | `AdminNav.tsx` | Accessible state | Admin menu button has a good accessible name, but lacks `aria-expanded` and `aria-controls`; opened nav has no explicit navigation label. | **MEDIUM** | Align with instructor navigation semantics. |
| G8A-009 | Student mobile nav | Student/Apprentice | `DashboardNav.tsx` | Navigation landmarks | Mobile/desktop `nav` elements have no explicit accessible label. With repeated navigation/bypass controls, labeling would improve landmark clarity. | **MEDIUM** | Add role-specific nav labels; no route changes. |
| G8A-010 | Exam Ready answer choices | Student/Apprentice | `ExamQuestion.tsx` | Form semantics | “Choose one answer” is visually/screen-reader grouped with `fieldset`, but options are toggle buttons with `aria-pressed` rather than radio semantics. It works, but semantic model is less precise for a mutually exclusive answer set. | **MEDIUM** | Evaluate radio/radiogroup semantics or equivalent single-select pattern without changing answer persistence/scoring. |
| G8A-011 | `/reset-password` | Public/Auth | reset-password page | Dynamic feedback | Error message is plain visual content without `role="alert"` / live announcement. Success swaps the entire card and is visually clear, but error feedback may not be announced when focus remains on submit. | **MEDIUM** | Use shared accessible error/status pattern. |
| G8A-012 | `/admin/users` onboarding recovery actions | Admin/School Admin | `UserManagementClient.tsx` | Touch targets | Several primary operational buttons use `min-h-10` (40px), below Gate 8’s approximate 44px primary touch target. | **MEDIUM** | Increase effective hit area where practical; preserve workflow. |
| G8A-013 | Shared mobile nav overlays | Student/Instructor/Admin | role nav components | Screen-reader context | Background page content is not explicitly inert/hidden while full-screen nav overlay is open. Focus is therefore not structurally constrained to the active navigation layer. | **MEDIUM** | Use accessible disclosure/dialog-style overlay semantics or inert background behavior appropriate to nav. |
| G8A-014 | Exam Ready active exam | Student/Apprentice | `ExamShell.tsx`, `ExamQuestion.tsx` | Focus management | Question position changes after Previous/Next/navigator selection but there is no explicit focus move to the new question heading/content. Keyboard/screen-reader users can remain at controls below the newly changed question. | **MEDIUM** | Add deterministic focus transition to question heading/region after navigation. |
| G8A-015 | Admin filters / tables | Admin/School Admin | user-management and other dense admin surfaces | Responsive data density | Mobile-card alternatives exist in some admin surfaces, but the codebase still contains many desktop table/overflow patterns that require route-by-route live verification at 320/360/390 and 200% zoom. Static audit cannot certify all dense views from class names alone. | **MEDIUM** | Carry forward as mandatory G8-5/G8-7 live certification item, not an automatic redesign. |
| G8A-016 | Shared focus styling | All roles | multiple components | Focus visuals | Many components intentionally use `focus:outline-none` but replace it with custom rings. This is not inherently wrong, yet consistency varies between `focus:` and `focus-visible:`; mouse focus may receive strong rings while some newer components use better focus-visible behavior. | **LOW** | Normalize shared focus primitive in G8-3; do not remove working rings before replacement. |
| G8A-017 | Auth form controls | Public/Auth | login/reset pages | Focus styling | Inputs use a 1px focus ring plus border color. Likely usable, but current static audit does not certify focus contrast/thickness against WCAG 2.2 focus appearance expectations. | **LOW** | Measure in G8-7 before changing tokens. |
| G8A-018 | Role nav active state | Student/Instructor/Admin | nav components | Non-color-only state | Active nav state uses background/border/text changes, not color alone, which is positive. However no `aria-current="page"` is set on primary nav links. | **LOW** | Add `aria-current` for current route when hardening nav. |
| G8A-019 | Legacy/historical audits | All | old audit docs | Evidence quality | Older documents contain stale claims (for example early skeleton dashboards and historical accessibility findings). They cannot be used as present-day certification. | **LOW** | G8 evidence must be generated from current main/current production only. |
| G8A-020 | Root protected portal landmark | Student/Instructor/Admin | protected layouts | Bypass blocks | Protected layouts provide `main id="main-content"`, making the global skip link valid inside those portals. | **ACCEPT** | Preserve. |
| G8A-021 | Instructor mobile menu button | Instructor/Admin-in-instructor | `InstructorNav.tsx` | Accessible name/state | Button has dynamic accessible label, `aria-expanded`, `aria-controls`, and ~44px minimum target. | **ACCEPT** | Use as reference pattern for student/admin nav hardening. |
| G8A-022 | Shared modal | Cross-role | `src/components/ui/Modal.tsx` | Dialog / focus | Shared Modal has dialog semantics, `aria-modal`, label binding, Escape close, focus trap, initial focus, body-scroll lock, and focus restoration. | **ACCEPT** | Preserve; validate individual ad-hoc modals separately in G8-6. |
| G8A-023 | Messaging responsive split view | Student/Instructor/Admin | `ProductionMessageCenter.tsx` | Mobile presentation | Conversation list/detail intentionally switch between list and active detail on narrow layouts; controls have focus-visible rings and accessible labels. | **ACCEPT** | Preserve Gate 7 behavior; only certify presentation in Gate 8. |
| G8A-024 | Messaging status/errors | Student/Instructor/Admin | `ProductionMessageCenter.tsx` | Live feedback | Status region and errors use live/status/alert semantics in the inspected production message center. | **ACCEPT** | Preserve; Gate 8 must not reopen Gate 7 behavior. |
| G8A-025 | `/login` | Public/Auth | login page + `FormError` | Forms | Login fields have explicit labels, autocomplete, required state, invalid/error associations, and shared FormError. | **ACCEPT** | Preserve; only mobile/zoom/contrast still needs live verification. |
| G8A-026 | Shared Modal viewport | Cross-role | `Modal.tsx` | Mobile modal | Modal is width-constrained with `w-full`, viewport max width options, `max-h-[90vh]`, and internal vertical scrolling. | **ACCEPT** | Preserve as baseline; short-viewport live test still required. |
| G8A-027 | Admin user mobile representation | Admin/School Admin | `UserManagementClient.tsx`, `UserManagementMobileCard.tsx` | Responsive data view | User management already has a dedicated `md:hidden` mobile card list, avoiding a desktop-table-only experience. | **ACCEPT** | Preserve; fix labels/touch sizes around it. |
| G8A-028 | H&A student progress semantics | Student | hours portal | Progress semantics | Existing current tests assert `role="progressbar"`, accessible label, values, and attendance summary labeling. | **ACCEPT** | Guarded-zone UI only; preserve H&A math/provenance. |
| G8A-029 | Root viewport | All | `src/app/layout.tsx` | Mobile foundation | Uses device width, initial scale 1, and viewport-fit cover; does not disable user zoom. | **ACCEPT** | Preserve. |

## 4. Role summary

### Student / Apprentice
Highest-risk current findings:
- fixed mobile header can cover top content;
- hamburger lacks accessible name/state;
- full-screen nav lacks explicit focus-management behavior;
- Exam Ready live timer can over-announce;
- Exam Ready question navigation does not intentionally move focus.

### Instructor
Current navigation is the strongest role shell inspected:
- labeled mobile control;
- expanded/control state;
- 44px target;
- labeled nav landmark;
- top-content mobile offset.

Remaining concern:
- full-screen nav overlay focus behavior is still implicit;
- dense instructor tables/dashboard views require route-by-route live certification.

### Admin / School Admin
Strong current patterns:
- separate mobile user cards;
- shared accessible Modal;
- many explicit icon labels in newer admin surfaces.

Highest-risk findings:
- user-management filters lack explicit names/labels;
- mobile menu does not expose expanded/control relationships;
- multiple 40px operational actions miss the Gate 8 primary touch target;
- dense reporting/configuration surfaces still require live 320/360/390 + zoom certification.

### Public / Auth
Strong:
- login has proper labels/error associations.

Primary issue:
- global skip link has no current `#main-content` target on public/auth route families.
- reset-password dynamic error is not announced as an alert/status.

## 5. Shared-component collision map

| Component | Result | Notes |
|---|---|---|
| Root skip link | **HIGH** | Correct pattern, incomplete target coverage. |
| DashboardNav | **HIGH** | Student button semantics + fixed-header offset + overlay focus. |
| InstructorNav | **ACCEPT / MEDIUM overlay** | Best current nav reference implementation. |
| AdminNav | **MEDIUM** | Labeled trigger but incomplete state relationship/focus overlay behavior. |
| Modal | **ACCEPT** | Strong shared dialog/focus behavior. |
| ProductionMessageCenter | **ACCEPT** | Strong responsive/accessibility semantics; preserve Gate 7 behavior. |
| UserManagementClient | **HIGH** | Filter labeling; separate mobile representation is positive. |
| ExamShell | **HIGH** | Per-second live timer; question focus transition. |
| ExamQuestion | **MEDIUM** | Single-select semantics can be more precise. |
| Responsive Playwright suites | **HIGH** | Too shallow for Gate 8 contract and current app breadth. |
| Automated a11y scanner | **HIGH GAP** | No axe-style integration found in current repo search. |

## 6. Test-coverage findings

Existing responsive tests are useful smoke tests but do not satisfy G8-1.

Current student responsive suite:
- 1280 × 720;
- 768 × 1024;
- 375 × 667;
- checks first visible navigation/content;
- checks only the first button for 44px target;
- no 320/360/390 split;
- no 200% zoom/reflow;
- no keyboard-only completion;
- no screen-reader name/role/state audit.

Current instructor responsive suite:
- same three viewport families;
- only first few buttons inspected;
- permits 20px target in its assertion despite Gate 8’s ~44px primary target;
- no current cross-route inventory;
- no zoom/keyboard/semantic certification.

No current axe-core / `@axe-core/playwright` integration was found in repo search.

This is a **certification gap**, not evidence that every route currently fails accessibility.

## 7. Guarded integration zones

### H&A
**Guarded-zone contact:** UI/accessibility only.

Audit may inspect:
- student hours;
- staff hour management;
- attendance views.

G8 must not change:
- hour math;
- attendance generation;
- correction provenance;
- caps;
- approval/rejection semantics;
- authoritative source.

### Onboarding / roster / enrollment
**Guarded-zone contact:** UI/accessibility only.

Audit may inspect:
- user management;
- invitation/setup;
- enrollment modal;
- assignment controls.

G8 must not add or redefine institutional fields/ownership.

### Admin Reporting
**Guarded-zone contact:** UI/accessibility only.

Audit may inspect:
- table/card presentation;
- filters;
- labels;
- zoom/reflow;
- focus/touch access.

G8 must not change metric definitions or reporting scope.

## 8. Prioritization for implementation slices

### G8-3 — Global shell + navigation foundation
Must address first:
- G8A-001 broken skip-link target coverage;
- G8A-002 student fixed-header content offset;
- G8A-003 student hamburger accessible name/state;
- G8A-004 shared mobile overlay focus/escape/return behavior;
- G8A-008 admin menu state relationship;
- G8A-009 navigation landmark labels;
- G8A-018 `aria-current` consistency.

### G8-4 — Student learning surfaces
Priority:
- G8A-005 Exam Ready timer live-region behavior;
- G8A-010 answer choice semantics;
- G8A-014 question-change focus management;
- live 320/360/390 checks for lesson/flashcard/micro-check/assessment/remediation/Exam Ready.

### G8-5 — Instructor + school operational surfaces
Priority:
- G8A-006 user/filter labels;
- G8A-012 touch targets;
- G8A-015 dense data surfaces;
- guarded-zone presentation only.

### G8-6 — Forms + tables + dialogs + feedback
Priority:
- G8A-011 reset-password error announcement;
- shared labeling/error/live-region consistency;
- ad-hoc modal/dialog inventory;
- table alternatives/overflow semantics.

### G8-7 — Semantic + visual certification
Priority:
- focus appearance consistency;
- 200% zoom/reflow;
- contrast measurement;
- reduced motion;
- orientation;
- primary target sizing.

### G8-8 — Final adversarial certification
Must close G8A-007:
- route-aware responsive automation;
- keyboard workflow automation where practical;
- accessibility scan automation where practical;
- exact-head CI + Vercel;
- production verification.

## 9. Audit stop rules

G8-2 does not authorize a repair simply because an issue exists.

If remediation would require:
- a schema/RLS migration;
- a permission change;
- communications behavior change;
- learning/scoring/evidence change;
- H&A calculation change;
- new institutional field/ownership;
- new reporting metric;
- new product capability;

STOP and move the issue to architecture review outside Gate 8.

## 10. G8-2 exit decision

**G8-2 static collision audit: COMPLETE / READY FOR CERTIFICATION.**

No implementation code has been changed.

The audit has enough evidence to begin G8-3 only after this audit document is certified/merged.

Live-browser accessibility certification is intentionally deferred to the relevant implementation/certification slices because protected role routes require controlled test identities and because G8-1 requires current workflow validation at the point of repair.

**Next authorized slice after G8-2 merge: G8-3 — Global Shell + Navigation Foundation.**
