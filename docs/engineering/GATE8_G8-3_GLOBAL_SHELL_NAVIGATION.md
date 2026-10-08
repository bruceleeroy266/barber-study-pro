# G8-3 — Global Shell + Navigation Foundation

**Project:** ASCYN PRO  
**Gate:** Gate 8 — Mobile + Accessibility Reliability  
**Slice:** G8-3 — Global Shell + Navigation Foundation  
**Baseline:** production `main` at `1941f5e41f7a7669c14f213ce6d7f45d95483f4c`  
**Status:** IMPLEMENTATION IN PROGRESS — HIGH SHELL/NAV FINDINGS REPAIRED

## Product Boundary

> **Product-boundary check:** PASS — this slice complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and remains classified as **COMPETE**. No DO NOT BUILD capability is introduced.

**Guarded-zone contact:** NONE for this first G8-3 implementation.

No schema, RLS, permission, learning evidence, grading, readiness, H&A, pilot, Exam Ready scoring, reporting-metric, or Gate 7 communications behavior is changed.

## Scope

This first G8-3 implementation addresses the HIGH shell/navigation findings assigned by G8-2:

- G8A-001 — skip-link target coverage;
- G8A-002 — student fixed mobile header overlap;
- G8A-003 — student hamburger accessible name/state relationship;
- G8A-004 — role mobile-nav focus / Escape / focus-return behavior.

Related low-risk navigation semantics needed to make those repairs complete are allowed only where they do not change route availability or authorization.

## Repairs

### G8A-001 — skip navigation
The global skip link continues to target `#main-content`.

Focusable targets now exist for:
- homepage;
- auth route-family layout (login/signup/reset and related auth children);
- pilot page;
- student dashboard layout;
- instructor layout;
- admin layout.

Protected portal main landmarks remain the canonical content landmarks.

### G8A-002 — student fixed-header offset
Student dashboard main content now receives mobile top spacing matching the fixed navigation header and resets that spacing on desktop.

No student page content or business behavior is changed.

### G8A-003 — student menu semantics
Student mobile menu trigger now exposes:
- an accessible open/close name;
- `aria-expanded`;
- `aria-controls`;
- a minimum ~44px touch target.

Student mobile/desktop navigation landmarks are explicitly labeled.

### G8A-004 — shared mobile overlay behavior
Student, instructor, and admin mobile navigation now share one accessibility hook that:
- moves focus into the opened menu;
- traps Tab / Shift+Tab within the menu;
- closes on Escape;
- restores focus to the trigger when closed;
- locks background body scrolling while open.

The full-screen menu containers expose modal dialog semantics while the nested `nav` retains the role-specific navigation landmark.

## Frozen behavior

This slice does not change:
- which links a role receives;
- role authorization;
- support-mode identity/permissions;
- logout behavior;
- messages or bulletins;
- Gate 7 reliability behavior;
- any database object.

## Automated evidence

`src/__tests__/g8-3-global-shell-navigation.test.ts` verifies:
- global skip target coverage;
- mobile student content offset;
- student menu name/state/control semantics;
- shared hook use across all three role shells;
- Escape, focus trap, focus return, and scroll lock implementation;
- no messaging or database migration scope.

## Remaining G8-3 work after this first HIGH pass

Still to certify/consider within G8-3:
- route-current semantics such as `aria-current`;
- shared focus-visible normalization where warranted;
- live 320/360/390 mobile navigation behavior;
- any global overflow/touch primitive needed by later slices.

Those are not allowed to expand business scope.
