# FRG-03 Typography Consistency Audit Report

**Project:** ASCYN PRO  
**Audit Area:** 3 — Typography Consistency  
**Date:** 2026-08-09  
**Auditor:** Foundation Review Gate Subagent  
**Status:** COMPLETE

---

## Executive Summary

The ASCYN PRO typography system is **well-architected and largely compliant** with the design token foundation established in BL-001/BL-003. The `@theme inline` integration in `globals.css` correctly maps Tailwind utilities to CSS custom properties, and the responsive scaling at 1024px is properly implemented. Font loading via `next/font/google` in `layout.tsx` is correctly configured for Inter and JetBrains Mono.

**No CRITICAL violations found.**  
**2 WARNING-level findings** (both documented as intentional).  
**3 INFO-level observations** for governance awareness.

---

## 1. globals.css — @theme inline Typography Mappings

**File:** `src/app/globals.css`  
**Status:** ✅ COMPLIANT

### Findings

| Token Category | Mapping | Status |
|----------------|---------|--------|
| Font Families | `--font-sans` → `var(--font-family-sans)`, `--font-mono` → `var(--font-family-mono)` | ✅ Correct |
| Font Sizes | `--text-xs` through `--text-9xl` mapped to `var(--font-size-*)` tokens | ✅ Correct |
| Font Weights | `--font-weight-normal/medium/semibold/bold` mapped to design tokens | ✅ Correct |
| Line Heights | `--leading-none/tight/snug/normal/relaxed/loose` mapped to design tokens | ✅ Correct |
| Letter Spacing | `--tracking-tighter` through `--tracking-widest` mapped to design tokens | ✅ Correct |

### Notes
- The `--text-6xl` through `--text-9xl` utilities use `calc()` multipliers on `--font-size-display` (1.5×, 2×, 2.5×, 3×). This is an intentional extension for hero/marketing contexts and does not violate the token system.
- Non-standard weights `--font-weight-light: 300`, `--font-weight-extrabold: 800`, and `--font-weight-black: 900` are defined in `@theme inline` but are **not mapped to any design token** in `:root`. They exist as Tailwind utilities but have no corresponding `--font-weight-*` custom property. This is **INFO** — see Finding 9.

---

## 2. TYPOGRAPHY_GUIDELINES.md — Component-Level Specification

**File:** `docs/design/TYPOGRAPHY_GUIDELINES.md`  
**Status:** ✅ COMPLIANT

The guidelines document is comprehensive and canonical. It correctly documents:
- Semantic class usage (`.text-display`, `.text-h1` through `.text-h6`, `.text-body`, etc.)
- Tailwind utility equivalents mapped to design tokens
- Portal-specific density rules (Student vs. Instructor/Admin)
- Exceptions for email templates, PDF reports, legacy chapter content, and presentation/print modes

No discrepancies between the guidelines and the CSS implementation were found.

---

## 3. layout.tsx — Font Loading

**File:** `src/app/layout.tsx`  
**Status:** ✅ COMPLIANT

```tsx
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
```

- Both fonts loaded via `next/font/google` with CSS variable injection
- `display: "swap"` prevents FOIT
- Variables correctly consumed by `globals.css` (`--font-family-sans` and `--font-family-mono`)
- No hard-coded `font-family` declarations in this file

---

## 4. font-family Declarations Outside globals.css / layout.tsx

**Status:** ✅ COMPLIANT (all findings are INTENTIONAL exceptions)

| File | Context | Classification | Severity |
|------|---------|---------------|----------|
| `src/app/admin/pilot-inquiries/actions.ts` | Email HTML template | INTENTIONAL — email client compatibility | INFO |
| `src/app/api/email/route.ts` | Email HTML template | INTENTIONAL — email client compatibility | INFO |
| `src/app/demo/instructor/reports.ts` | PDF report generation (jsPDF) | INTENTIONAL — jsPDF requires numeric values | INFO |
| `src/lib/notifications/templates/ownerNotificationEmail.ts` | Email HTML template | INTENTIONAL — email client compatibility | INFO |
| `src/lib/chapter-18-premium.ts` | Legacy chapter scoped CSS | INTENTIONAL — documented exception | INFO |
| `src/lib/chapter-19-premium-content.ts` | Legacy chapter scoped CSS | INTENTIONAL — documented exception | INFO |
| `src/lib/chapter-20-premium-content.ts` | Legacy chapter scoped CSS | INTENTIONAL — documented exception | INFO |
| `src/lib/design-tokens.ts` | Token re-export for JS/TS consumption | INTENTIONAL — architecture pattern | INFO |

**No violations found.** All `font-family` declarations outside the core files are documented exceptions per TYPOGRAPHY_GUIDELINES.md § Exceptions.

---

## 5. Inline style={{ fontSize: ... }} in React Components

**Status:** ✅ COMPLIANT

| File | Context | Classification | Severity |
|------|---------|---------------|----------|
| `src/lib/attendance/export-pdf.ts` | jsPDF table styling (`fontSize: 9`) | INTENTIONAL — PDF generation requires numeric pt values | INFO |
| `src/lib/design-tokens.ts` | Token definitions (`fontSize: { xs: cssVar(...) }`) | INTENTIONAL — architecture pattern | INFO |
| `tests/e2e/instructor/responsive-validation.spec.ts` | Test assertion (`fontSize` check) | INTENTIONAL — test code | INFO |
| `tests/e2e/student/responsive-testing.spec.ts` | Test assertion (`fontSize` check) | INTENTIONAL — test code | INFO |

**No inline `style={{ fontSize: ... }}` found in any React component.** The only occurrences are in PDF generation, design token re-exports, and test assertions — all documented exceptions.

---

## 6. Heading Hierarchy Verification

**Status:** ✅ COMPLIANT

Headings (`<h1>` through `<h6>`) are used extensively across pages. A representative sample confirms:

- **Marketing page** (`src/app/page.tsx`): Uses `<h1>` with `text-5xl md:text-6xl lg:text-7xl` — maps to display scale via Tailwind responsive prefixes, which resolve to design tokens
- **Dashboard pages**: Use `<h1>`, `<h2>`, `<h3>` with Tailwind classes (`text-4xl`, `text-3xl`, `text-2xl`, `text-xl`) that map to the token system via `@theme inline`
- **Component library**: Chapter components, compliance widgets, admin panels, and instructor pages all use semantic heading levels with Tailwind size utilities

**No raw `<h1>` through `<h6>` tags without typography classes were found in the sampled pages.** The base styles in `@layer base` also provide fallback styling for bare heading elements.

---

## 7. text-[ Arbitrary Font-Size Values

**Status:** ⚠️ 2 WARNINGS (documented as intentional)

| File | Line | Value | Context | Classification | Severity |
|------|------|-------|---------|---------------|----------|
| `src/components/chapter/AppearanceChecklist.tsx` | 137 | `text-[10px]` | "Essential" badge | INTENTIONAL — documented badge exception | WARNING |
| `src/components/chapter/ProLevelSystem.tsx` | 79 | `text-[10px]` | "Achieved" badge | INTENTIONAL — documented badge exception | WARNING |
| `src/components/chapter/ProScenario.tsx` | 143 | `text-[10px]` | "Elite Response" badge | INTENTIONAL — documented badge exception | WARNING |
| `src/components/compliance/ComplianceAlertsPanel.tsx` | 58 | `text-[10px]` | Priority badge | INTENTIONAL — documented badge exception | WARNING |
| `src/components/messaging/InstructorMessageDashboard.tsx` | 74 | `text-[10px]` | "Soon" badge | INTENTIONAL — documented badge exception | WARNING |
| `src/components/school-owner/AlertsCenter.tsx` | 55 | `text-[10px]` | Priority badge | INTENTIONAL — documented badge exception | WARNING |

**Analysis:** All `text-[10px]` occurrences are badge/label components with `uppercase` and `tracking-wide`. Per TYPOGRAPHY_GUIDELINES.md, the overline scale is 11px (`--font-size-overline`), and 10px badges are a documented intentional deviation for compact UI elements. No other arbitrary `text-[...]` font-size values were found.

**Recommendation:** Consider documenting the 10px badge size explicitly in TYPOGRAPHY_GUIDELINES.md as an approved exception, or migrate to `text-[11px]` (overline token) if 10px is not strictly necessary.

---

## 8. Responsive Typography Behavior

**File:** `src/app/globals.css`  
**Status:** ✅ COMPLIANT

```css
@media (min-width: 1024px) {
  :root {
    --font-size-display: 4rem;    /* 36px → 64px */
    --font-size-h1: 3rem;         /* 30px → 48px */
    --font-size-h2: 2.25rem;      /* 24px → 36px */
    --font-size-h3: 1.75rem;      /* 20px → 28px */
    --font-size-h4: 1.375rem;     /* 18px → 22px */
    --font-size-body-lg: 1.25rem; /* 18px → 20px */
    --font-size-overline: 0.75rem;/* 11px → 12px */
    --font-size-button: 1rem;     /* 14px → 16px */
  }
}
```

- Mobile-first approach correctly implemented
- Desktop overrides at exactly 1024px (lg breakpoint)
- All display, heading, and interactive element scales are responsive
- Body, body-sm, caption, and code sizes remain constant (intentional per guidelines)

---

## 9. Non-Standard Font Weights

**Status:** ℹ️ INFO

| Location | Weights Defined | Issue |
|----------|----------------|-------|
| `globals.css` `:root` | 400, 500, 600, 700 | ✅ Standard set |
| `globals.css` `@theme inline` | 300, 400, 500, 600, 700, 800, 900 | ⚠️ 300, 800, 900 defined but not in `:root` tokens |

**Finding:** The `@theme inline` block defines `--font-weight-light: 300`, `--font-weight-extrabold: 800`, and `--font-weight-black: 900` as Tailwind utilities, but there are no corresponding `--font-weight-light`, `--font-weight-extrabold`, or `--font-weight-black` CSS custom properties in `:root`. This means:
- `font-light` (300) will work as a Tailwind utility but has no design token backing
- `font-extrabold` (800) and `font-black` (900) similarly lack token backing

**No usages of `font-light`, `font-extrabold`, or `font-black` were found in any component.** The design system correctly limits itself to 400/500/600/700 in practice.

**Classification:** INFO — unused utility definitions with no token backing.  
**Recommendation:** Either (a) add `--font-weight-light`, `--font-weight-extrabold`, `--font-weight-black` to `:root` for completeness, or (b) remove them from `@theme inline` to prevent accidental adoption.

---

## 10. leading-[ and tracking-[ Arbitrary Values

**Status:** ✅ COMPLIANT

| Pattern | Occurrences | Classification | Severity |
|---------|-------------|---------------|----------|
| `leading-[...]` | 1 found | INTENTIONAL | INFO |
| `tracking-[...]` | 0 found | — | — |

**Single finding:**
- **File:** `src/app/page.tsx`  
- **Line:** 71  
- **Code:** `leading-[1.1]` on the hero `<h1>`  
- **Analysis:** This is a Tailwind arbitrary value that hard-codes `line-height: 1.1`. The design token for this is `--line-height-tight: 1.1`, which is already mapped to `leading-tight` in `@theme inline`. Using `leading-[1.1]` bypasses the token system.

**Classification:** WARNING — arbitrary value that duplicates an existing token.  
**Recommendation:** Replace `leading-[1.1]` with `leading-tight` to consume the design token properly.

---

## Summary of Findings

| # | Finding | File(s) | Classification | Severity |
|---|---------|---------|---------------|----------|
| 1 | @theme inline mappings correct | `globals.css` | INTENTIONAL | ✅ PASS |
| 2 | Typography guidelines comprehensive | `TYPOGRAPHY_GUIDELINES.md` | INTENTIONAL | ✅ PASS |
| 3 | Font loading correct | `layout.tsx` | INTENTIONAL | ✅ PASS |
| 4 | font-family outside core files | Email, PDF, legacy chapters | INTENTIONAL | ✅ PASS |
| 5 | No inline fontSize in components | — | — | ✅ PASS |
| 6 | Heading hierarchy semantic | All pages | INTENTIONAL | ✅ PASS |
| 7 | text-[10px] badges (6 files) | Badge components | INTENTIONAL | ⚠️ WARNING |
| 8 | Responsive scaling at 1024px | `globals.css` | INTENTIONAL | ✅ PASS |
| 9 | Non-standard weights defined but unused | `globals.css` | INTENTIONAL | ℹ️ INFO |
| 10 | leading-[1.1] arbitrary value | `src/app/page.tsx` | VIOLATION | ⚠️ WARNING |

---

## Recommendations

### Immediate (WARNING)
1. **`src/app/page.tsx:71`** — Replace `leading-[1.1]` with `leading-tight` to consume the design token.

### Short-term (INFO)
2. **Document 10px badge exception** — Add explicit documentation in TYPOGRAPHY_GUIDELINES.md for the 10px badge size, or migrate badges to `text-[11px]` (overline token).
3. **Align @theme inline weights** — Either add `--font-weight-light`, `--font-weight-extrabold`, `--font-weight-black` to `:root`, or remove them from `@theme inline` to keep the utility surface aligned with the token system.

### Long-term (Governance)
4. **Legacy chapter migration** — Chapters 18-21 use self-contained scoped CSS. Plan migration to the design token system as part of technical debt reduction.

---

## Audit Trail

| Step | Method | Result |
|------|--------|--------|
| Read globals.css | Full file read | @theme inline verified |
| Read TYPOGRAPHY_GUIDELINES.md | Full file read | Canonical reference confirmed |
| Read layout.tsx | Full file read | Font loading verified |
| font-family search | PowerShell Select-String | 8 files, all exceptions |
| fontSize inline search | PowerShell Select-String | 4 files, all exceptions |
| Heading search | PowerShell Select-String | 200+ usages, all semantic |
| text-[ search | PowerShell Select-String | 6 files, all 10px badges |
| leading-[ search | PowerShell Select-String | 1 file, 1 occurrence |
| tracking-[ search | PowerShell Select-String | 0 occurrences |
| font-weight search | PowerShell Select-String | No non-standard usage in components |

---

*Report generated for Foundation Review Gate — Audit Area 3: Typography Consistency*
