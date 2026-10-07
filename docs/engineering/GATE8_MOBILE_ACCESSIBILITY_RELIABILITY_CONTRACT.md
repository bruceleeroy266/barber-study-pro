# G8-1 — Gate 8 Mobile + Accessibility Reliability Contract

**Project:** ASCYN PRO  
**Gate:** Gate 8 — Mobile + Accessibility Reliability  
**Slice:** G8-1 — Contract Lock  
**Status:** CONTRACT ONLY — NO RUNTIME OR SCHEMA CHANGE  
**Baseline:** production `main` at `f6166cd883518e648c91982a5dd5883c5b487b44`  
**Product Boundary classification:** **COMPETE**

## Product-boundary check

> **Product-boundary check:** PASS — this Gate complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and is classified as **COMPETE**. No DO NOT BUILD capability is introduced.

Gate 8 strengthens delivery of ASCYN-owned learning, intervention, exam-readiness, and support workflows. It does not create new institutional systems of record.

### Guarded integration zone contact

Gate 8 may visually certify screens that surface:
- H&A;
- onboarding / roster / enrollment;
- Admin Reporting.

Those are **UI-only guarded-zone contacts**.

Gate 8 MUST NOT change:
- authoritative data source;
- ownership/source-of-truth;
- calculations;
- eligibility semantics;
- approval rules;
- schema;
- RLS;
- permissions;
- reporting scope;
- H&A business logic;
- enrollment semantics.

Any need to change those behaviors exits Gate 8 and requires a separately approved architecture slice.

## 1. Gate 8 goal

Gate 8 certifies that the existing ASCYN PRO product can be used reliably on mobile devices and by users with accessibility needs without changing the underlying certified product behavior.

Gate 8 is a **quality, usability, and access gate**, not a feature-expansion gate.

The target is to make current ASCYN workflows:
- usable on narrow mobile screens;
- resilient to orientation and viewport changes;
- keyboard operable;
- screen-reader understandable;
- readable at zoom/reflow;
- sufficiently contrasted;
- touch friendly;
- focus predictable;
- semantically structured;
- safe under reduced-motion preferences;
- free from mobile-only dead ends.

## 2. Existing behavior frozen by Gate 8

Gate 8 MUST preserve all certified business behavior from prior Gates.

### Communications
Gate 7 is CLOSED / GREEN.

Gate 8 may improve:
- responsive layout;
- focus behavior;
- touch target size;
- semantic labels;
- live-region behavior;
- mobile overflow;
- navigation discoverability.

Gate 8 MUST NOT add:
- new message relationships;
- group chat;
- cross-school messaging;
- new bulletin interaction types;
- Realtime requirements;
- SMS/email delivery;
- message editing/deleting;
- new communications permissions.

Any communications behavior change beyond accessibility/mobile presentation is outside Gate 8.

### Learning / TLS / grading
Gate 8 MUST NOT change:
- canonical learning evidence;
- mastery calculations;
- status rules;
- recommended-action rules;
- grade calculations;
- assessment scoring;
- remediation logic;
- Exam Ready scoring/readiness;
- chapter content meaning.

### H&A
Gate 8 MUST NOT change:
- attendance calculations;
- effective-hours math;
- correction rules;
- provenance;
- caps;
- source-of-truth rules.

### Pilot measurement
Gate 8 MUST NOT change:
- 30/60/90 metrics;
- checkpoint calculations;
- baseline/finalization semantics;
- pilot evidence.

### Authorization
Gate 8 MUST NOT weaken or broaden:
- role access;
- school isolation;
- instructor/student assignment rules;
- platform-admin support actor identity;
- RLS boundaries.

## 3. Accessibility target

Gate 8 targets **WCAG 2.2 Level AA** behavior where applicable to the current web product.

This is an engineering conformance target, not a legal certification or representation of statutory compliance.

Gate 8 must explicitly test and document at minimum:
- perceivable text/controls;
- keyboard operability;
- visible focus;
- logical focus order;
- semantic names/roles/states;
- form labels and error association;
- status announcements;
- color contrast;
- non-color-only meaning;
- touch target usability;
- zoom and reflow;
- orientation resilience;
- reduced motion;
- accessible modal/dialog behavior;
- accessible tables/data views;
- skip/navigation mechanisms where needed.

## 4. Mobile reliability target

Gate 8 must certify the product at representative narrow, medium, and wide viewports.

Minimum responsive checkpoints:
- 320 CSS px;
- 360 CSS px;
- 390 CSS px;
- 768 CSS px;
- 1024 CSS px;
- desktop reference width.

Required mobile behavior:
- no critical horizontal clipping;
- no inaccessible off-screen action;
- no control overlap;
- no hidden required form field;
- no modal larger than the usable viewport without safe scrolling;
- no fixed footer/header trapping content;
- no table that makes required action unreachable;
- no navigation dead end;
- no dependence on hover;
- no double-tap-only hidden action;
- no mobile-only loss of persisted state;
- portrait/landscape does not alter business state.

## 5. Zoom / reflow contract

Gate 8 must test:
- browser zoom at 200%;
- content reflow expectations equivalent to narrow-width use;
- text enlargement without clipped critical content;
- controls remaining reachable and understandable.

Where complex data tables cannot fully reflow, Gate 8 must provide an accessible alternative such as:
- horizontal scroll with preserved labels;
- stacked/card representation;
- responsive column prioritization;
- equivalent detail view.

No information required for task completion may become unavailable only because of zoom.

## 6. Keyboard contract

Every interactive workflow within Gate 8 scope must be completable without a pointing device where the underlying platform supports keyboard interaction.

Required:
- logical Tab order;
- no keyboard trap;
- visible focus indicator;
- Enter/Space activation where semantically appropriate;
- Escape behavior for dismissible dialogs where appropriate;
- focus returned sensibly after modal/dialog close;
- focus moved intentionally when a workflow transition requires it;
- no positive `tabindex` ordering hacks;
- disabled controls are not misleadingly focusable/actionable.

## 7. Screen-reader / semantics contract

Required:
- interactive controls expose an accessible name;
- headings communicate hierarchy;
- landmarks are used meaningfully;
- icons that act as controls have labels;
- decorative imagery is hidden appropriately;
- meaningful imagery has useful alternative text;
- form controls are associated with labels;
- validation errors are associated with affected fields;
- dynamic success/error/loading states are announced where necessary;
- expandable/collapsible controls expose state;
- dialogs expose role/name and keep focus within the active modal context where appropriate.

ARIA MUST NOT be used to recreate native semantics when a native element is sufficient.

## 8. Touch contract

Primary mobile actions must be reasonably touchable.

Gate 8 target:
- approximately 44x44 CSS px touch area for primary interactive targets where practical;
- sufficient spacing to reduce accidental activation;
- destructive actions separated from common navigation/actions;
- no essential action dependent on precision hover.

Dense table utilities may use smaller visible glyphs only when the effective interactive hit area remains usable.

## 9. Contrast and visual-state contract

Gate 8 must certify:
- normal text contrast at AA target;
- large-text contrast at AA target;
- meaningful control/component state contrast;
- visible focus that is not obscured;
- disabled state distinguishable without becoming unreadable;
- error/success/warning state not conveyed by color alone;
- links distinguishable in context.

Known historical accessibility findings are not accepted as resolved merely because an older audit marked them complete. Current-main evidence is required.

## 10. Motion contract

ASCYN must respect `prefers-reduced-motion` for non-essential animation.

Gate 8 MUST avoid:
- essential meaning conveyed only through animation;
- forced large motion for normal navigation;
- animation that prevents interaction while it completes.

Existing motion may remain when non-essential, brief, and reduced appropriately under user preference.

## 11. Forms and validation contract

Gate 8 certifies current forms for:
- persistent labels;
- input purpose clarity;
- accessible validation;
- error summary or field-level association where appropriate;
- mobile keyboard/input compatibility where practical;
- required-state communication;
- safe submit/retry state;
- no loss of entered data solely because layout changes.

Gate 8 does not authorize new form fields or institutional data collection.

## 12. Tables / dashboards / data-density contract

Current dashboards may remain information-dense, but must remain operable on mobile and with assistive technology.

Required:
- column headers remain associated with data;
- actions remain reachable;
- overflow is intentional, not accidental;
- critical metrics are not truncated without equivalent access;
- responsive cards/stacked layouts may replace tables when that preserves meaning;
- sorting/filtering controls expose clear names/states;
- empty/no-data/loading/error states are distinguishable.

Gate 8 must not alter canonical metric calculations while changing presentation.

## 13. Navigation contract

Across student, instructor, school-admin, and platform-admin/support surfaces:
- current page/location must be understandable;
- mobile navigation must be reachable and dismissible;
- menu state must be announced where appropriate;
- back/close controls must have clear accessible names;
- skip-to-content or equivalent fast navigation must exist where repeated chrome makes it necessary;
- role-specific navigation must not expose unauthorized destinations.

## 14. Required surface inventory

G8-2 must inventory current production routes before repairs begin.

Minimum surfaces to classify and certify:

### Student
- dashboard;
- chapter/lesson surfaces;
- assessments / reassessment;
- flashcards / micro-checks;
- remediation;
- Exam Ready;
- progress/readiness;
- messages/bulletins;
- account/setup flows used by active students.

### Instructor
- dashboard;
- student list/detail;
- learning diagnostics;
- intervention/action surfaces;
- reporting views used for instruction;
- communications;
- pilot measurement views where present.

### School Admin / Admin
- dashboard;
- school/student management required to operate ASCYN;
- instructor management;
- instructional reporting;
- support/access surfaces;
- communications/bulletins.

### Platform Admin Support Mode
- role switching/support entry;
- visible actor/support context;
- normal destination controls while support mode is active.

### Public / authentication / setup
- sign-in;
- invitation/setup;
- password/setup/reset surfaces actually used by current production;
- legal/consent surfaces that block entry to the product.

## 15. Guarded integration-zone rule

If Gate 8 touches H&A, onboarding/roster, or Admin Reporting:

Required statement in that slice:

> **Guarded-zone contact:** UI/accessibility only. No source-of-truth, calculation, ownership, institutional scope, or schema change is introduced.

A Gate 8 slice is BLOCKED if a UI problem can only be solved by changing guarded-zone business semantics unless a separate architecture approval is created.

## 16. Data and schema rule

Default Gate 8 rule:

**NO DATABASE SCHEMA CHANGE.**

A schema/RLS/function migration is not authorized merely to make a screen easier to use.

If a real accessibility blocker requires persistence:
1. document why browser/runtime state is insufficient;
2. run Product Boundary review;
3. prove existing business evidence is not redefined;
4. create a separately approved implementation slice.

## 17. Performance boundary

Gate 8 may fix performance problems only when they materially block mobile/accessibility use, such as:
- oversized client rendering causing unusable mobile interaction;
- layout shift obscuring controls;
- loading state preventing assistive-tech understanding;
- excessive work causing repeated input loss.

Gate 8 is not a general performance-rewrite program.

## 18. Explicit non-goals

Gate 8 does NOT authorize:
- visual rebrand;
- wholesale design-system replacement;
- new dashboards;
- new analytics;
- new communications features;
- new enrollment fields;
- new H&A capabilities;
- new reporting metrics;
- changes to TLS;
- changes to grading;
- changes to readiness;
- changes to pilot measurement;
- changes to exam scoring;
- new SIS/ERP functionality;
- financial aid/accounting/compliance-reporting functionality;
- native iOS/Android app development;
- push notifications;
- offline mode;
- PWA scope;
- Realtime scope;
- feature work disguised as accessibility work.

## 19. G8 implementation sequence

### G8-1 — Contract lock
This document. No implementation code.

### G8-2 — Mobile + accessibility collision audit
Inventory production routes/components and classify findings:
- BLOCKER;
- HIGH;
- MEDIUM;
- LOW;
- ACCEPT / NO CHANGE.

Produce route × issue × role × severity × WCAG/mobile category matrix before broad repairs begin.

### G8-3 — Global shell + navigation foundation
Certify/fix:
- skip navigation;
- focus-visible baseline;
- mobile menus;
- landmarks;
- route/location clarity;
- global modal/dialog shell;
- global touch/overflow primitives.

No business logic change.

### G8-4 — Student learning surfaces
Certify/fix mobile/accessibility for:
- lessons;
- flashcards;
- micro-checks;
- assessments;
- remediation;
- Exam Ready;
- progress/readiness;
- student communications presentation.

No evidence/scoring change.

### G8-5 — Instructor + school operational surfaces
Certify/fix:
- instructor dashboards;
- student detail;
- diagnostics/intervention;
- school instructional reporting;
- user/instructor management;
- support mode;
- guarded-zone UI surfaces.

No institutional-scope expansion.

### G8-6 — Forms + tables + dialogs + dynamic feedback
Cross-role hardening for:
- forms;
- tables;
- filters;
- modals;
- alerts;
- loading;
- empty states;
- errors;
- live regions;
- focus return.

### G8-7 — Screen reader + zoom + contrast + motion certification
Run cross-surface semantic and visual certification:
- accessible names;
- headings;
- landmarks;
- contrast;
- zoom/reflow;
- reduced motion;
- orientation;
- touch target review.

### G8-8 — Final cross-role adversarial certification
Run:
- keyboard-only workflows;
- narrow viewport workflows;
- refresh/back/orientation;
- zoom/reflow;
- screen-reader semantics checks;
- automated accessibility regression;
- Engineering Verification;
- exact-head Vercel preview;
- merge;
- exact production main;
- production READY verification.

## 20. Required evidence matrix

Gate 8 cannot close without current-main evidence for at least:

### Mobile
- 320px critical workflow completion;
- 360/390px mobile workflow completion;
- tablet-width workflow completion;
- orientation change without state corruption;
- no inaccessible clipped primary action;
- navigation open/close/reopen;
- modal/dialog on short viewport;
- table/data view access on narrow screen.

### Keyboard
- sign-in/setup path;
- student core learning path;
- assessment interaction;
- Exam Ready critical path;
- instructor student-detail path;
- instructor intervention/action path;
- admin required operational path;
- communications presentation path;
- dialog open/close/focus return.

### Screen reader / semantics
- page titles/headings;
- landmarks;
- navigation;
- forms;
- errors;
- dynamic status;
- expandable controls;
- tables or equivalent structure;
- dialogs.

### Visual
- contrast;
- focus visibility;
- zoom/reflow;
- text enlargement;
- non-color-only state;
- reduced motion.

## 21. Gate 8 stop conditions

Implementation MUST STOP for architecture review if a proposed Gate 8 repair:
- changes business rules;
- changes learning evidence;
- changes grades/readiness;
- changes H&A calculations;
- changes pilot metrics;
- broadens communications;
- broadens role permissions;
- introduces new institutional data ownership;
- adds DO NOT BUILD scope;
- requires a schema change without separate approval;
- becomes a visual redesign rather than access/reliability repair.

## 22. Gate 8 GREEN decision rule

Gate 8 is GREEN only when all are true:
- critical current workflows are usable on representative mobile widths;
- keyboard-only completion succeeds for required workflows;
- no critical keyboard trap exists;
- required controls expose accessible names/roles/states;
- focus is visible and deterministic;
- current forms expose labels/errors accessibly;
- critical dynamic state is announced where needed;
- required text/control contrast meets the Gate 8 target;
- zoom/reflow does not hide required content/actions;
- reduced-motion behavior is respected;
- guarded integration zones receive UI-only changes;
- Gate 7 communications behavior remains unchanged and GREEN;
- TLS/grading/H&A/pilot/exam evidence semantics remain unchanged;
- no DO NOT BUILD scope is introduced;
- exact-head CI and Vercel preview pass;
- merged production deployment reaches READY.

## 23. Gate 8 implementation authorization

No Gate 8 implementation code may begin until:
1. G8-1 is merged to production `main`;
2. exact production Vercel is READY;
3. this contract remains classified **COMPETE**;
4. G8-2 is started as an audit-first slice.

Until then, Gate 8 is **NOT implementation-ready**.
