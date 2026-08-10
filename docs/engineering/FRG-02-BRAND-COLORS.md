# FRG-02: Brand Color Consistency Audit

**Audit Area:** 2 — Brand Color Consistency  
**Date:** 2026-08-09  
**Auditor:** Foundation Review Gate Subagent  
**Reference:** `ASCYN PRO/04_VISUAL_IDENTITY/COLOR_SYSTEM.md` v1.0  
**Codebase:** `src/` (globals.css, design-tokens.ts, all components, chapter content, email templates, report generators)

---

## Executive Summary

The ASCYN PRO codebase has a **solid design token foundation** in `globals.css` that faithfully implements the Phase 4 COLOR_SYSTEM.md palette. All 13 canonical brand colors are present as CSS custom properties, correctly mapped to semantic functions, and integrated into Tailwind CSS v4 via `@theme inline`. The app is **dark-only** with no light-mode toggle or `dark:` class prefixes, which aligns with the spec's "dark mode is the default" rule.

However, there are **two parallel color systems** operating alongside the brand tokens: (1) per-chapter `ChapterTheme` objects with unique, non-brand color palettes, and (2) legacy Tailwind `gray-*` utility classes in print-oriented report components and one chapter content file. Additionally, several chapter themes use green (`#22C55E`, `#10B981`) for "level up" rewards, which contradicts the brand's semantic color mapping (success = gold).

---

## Finding 1: Brand Color Token Foundation

**File:** `src/app/globals.css`  
**What was found:** All 13 Phase 4 brand colors are present as CSS custom properties in `:root`, correctly organized into Primary Palette, Neutral Scale, and Accent Colors. Semantic mappings (backgrounds, surfaces, borders, text, functional) are properly aliased. Legacy aliases are provided for backward compatibility. Tailwind CSS v4 `@theme inline` block maps all tokens to Tailwind utilities.

| COLOR_SYSTEM.md Token | globals.css Variable | Hex Match? |
|---|---|---|
| ASCYN Gold #D4AF37 | `--color-brand-gold` | ✅ |
| ASCYN Silver #C0C0C0 | `--color-brand-silver` | ✅ |
| ASCYN Black #000000 | `--color-brand-black` | ✅ |
| ASCYN White #FFFFFF | `--color-brand-white` | ✅ |
| Charcoal #1A1A1A | `--color-brand-charcoal` | ✅ |
| Graphite #2D2D2D | `--color-brand-graphite` | ✅ |
| Silver Gray #8C8C8C | `--color-brand-silver-gray` | ✅ |
| Light Gray #E5E5E5 | `--color-brand-light-gray` | ✅ |
| Off White #F5F5F5 | `--color-brand-off-white` | ✅ |
| Deep Navy #1B1F3B | `--color-brand-deep-navy` | ✅ |
| Warm Bronze #CD7F32 | `--color-brand-warm-bronze` | ✅ |
| Cool Platinum #E5E4E2 | `--color-brand-cool-platinum` | ✅ |
| Border Secondary #404040 | `--color-border-secondary` | ✅ |

**Verdict:** INTENTIONAL  
**Severity:** INFO

---

## Finding 2: Extra `--color-brand-gold-light` Not in Spec

**File:** `src/app/globals.css` line 15  
**What was found:** `--color-brand-gold-light: #F4E4A6` is defined in globals.css but does not appear in COLOR_SYSTEM.md. The spec defines Gold Metallic gradient as `#D4AF37 → #F4D03F → #D4AF37` and Subtle Gold as `#D4AF37 → #B8952E`. The value `#F4E4A6` is a lighter, more pastel gold not in the spec. It is used extensively as a hover state for gold buttons and links across the app (15+ files).

The spec's `#F4D03F` (Gold Metallic middle) is used in chapter themes 18-21 as `primaryLight`, but the global `--color-brand-gold-light` uses a different value (`#F4E4A6`).

**Verdict:** VIOLATION — undocumented color added to the token system  
**Severity:** WARNING — The color is a reasonable hover-state light gold, but it should be documented in COLOR_SYSTEM.md or replaced with the spec's `#F4D03F`.

---

## Finding 3: Semantic Color Mapping Verification

**File:** `src/app/globals.css` lines 55-75  
**What was found:** Semantic color mappings match the spec exactly:

| Function | Spec Color | globals.css Mapping | Match? |
|---|---|---|---|
| Success | Gold #D4AF37 | `--color-success: var(--color-brand-gold)` | ✅ |
| Warning | Warm Bronze #CD7F32 | `--color-warning: var(--color-brand-warm-bronze)` | ✅ |
| Error | Silver #C0C0C0 | `--color-error: var(--color-brand-silver)` | ✅ |
| Info | Silver #C0C0C0 | `--color-info: var(--color-brand-silver)` | ✅ |
| Disabled | #404040 | `--color-disabled: #404040` | ✅ |

No standard Tailwind `bg-green-*`, `text-green-*`, `bg-red-*`, `text-red-*`, `bg-blue-*`, `text-blue-*`, or any other non-brand semantic color classes were found in any `.tsx` component.

**Verdict:** INTENTIONAL  
**Severity:** INFO

---

## Finding 4: Dark Theme Behavior

**Files:** All `src/` files  
**What was found:**
- **Zero** Tailwind `dark:` class prefixes found in any component
- **Zero** `prefers-color-scheme` media queries found
- `body` is hardcoded to `background-color: var(--color-background-primary)` (black) in globals.css
- The app is **dark-only** with no light-mode toggle or detection

The COLOR_SYSTEM.md states: "Dark mode is the default" and "Light mode is an alternative for accessibility." The current implementation is dark-only, which is consistent with the spec's primary mode. However, the spec also defines a complete Light Mode Neutral scale (§7.2) and states "Light mode is an alternative for users who prefer or require light backgrounds" — this is not yet implemented.

**Verdict:** INTENTIONAL (dark-only is the spec default; light mode is a future accessibility feature)  
**Severity:** INFO

---

## Finding 5: Per-Chapter Theme Color Palettes (Parallel Color System)

**Files:**  
- `src/lib/chapter-content.ts` (chapters 1-3 themes)  
- `src/lib/chapter-4-content.ts` / `chapter-4-premium.ts` (chapter 4)  
- `src/lib/chapter-5-premium.ts` through `chapter-17-premium.ts` (chapters 5-17)  
- `src/lib/chapter-18-premium.ts` through `chapter-21-premium-content.ts` (chapters 18-21)

**What was found:** Every chapter defines its own `ChapterTheme` object with a unique color palette. These palettes contain hardcoded hex values that are **not** derived from the brand token system. Examples:

| Chapter | Primary | PrimaryLight | PrimaryDark | Notes |
|---|---|---|---|---|
| Default | #D4AF37 (gold) | #F4E4A6 | #B8941F | Brand-aligned |
| Ch 1 | #C9A84C (aged gold) | #E8D5A3 | #8B6914 | Warm bronze-gold |
| Ch 2 | #00D4FF (electric cyan) | #7EE8FF | #0099CC | Off-brand cyan |
| Ch 3 | #C0A062 (champagne) | — | — | Warm gold |
| Ch 4 | #0891B2 (teal) | #22D3EE | #164E63 | Off-brand teal |
| Ch 5 | #B87333 (copper) | — | — | Warm metallic |
| Ch 6 | #2DD4BF (teal) | — | — | Off-brand teal |
| Ch 7 | #8B5CF6 (purple) | — | #6D28D9 | Off-brand purple |
| Ch 8 | #00E5FF (cyan) | — | — | Off-brand cyan |
| Ch 9 | #FF6B6B (red) | — | — | Off-brand red |
| Ch 10 | #9D4EDD (purple) | #C77DFF | #7B2CBF | Off-brand purple |
| Ch 11 | #059669 (emerald) | #34D399 | #047857 | Off-brand green |
| Ch 12 | #1E3A5F (navy) | #4A6FA5 | #0F1F33 | Dark navy |
| Ch 13 | #8B2635 (crimson) | #B84555 | #5C1A24 | Off-brand red |
| Ch 14 | #3B4252 (slate) | #5E81AC | #2E3440 | Off-brand slate |
| Ch 15 | #5D4037 (brown) | — | — | Warm brown |
| Ch 16 | #D4A574 (tan) | — | — | Warm tan |
| Ch 17 | #4DB6AC (teal) | — | — | Off-brand teal |
| Ch 18-21 | #D4AF37 (gold) | #F4D03F | #AA8A2C | Brand-aligned |

**Analysis:** Chapters 18-21 use the brand gold (#D4AF37) as their primary, aligning with the brand system. Chapters 1, 3, 5, 12, 15, and 16 use warm metallic/earth tones that are at least harmonious with the brand's metallic standard. However, chapters 2, 4, 6, 7, 8, 9, 10, 11, 13, 14, and 17 use colors that are **completely outside the brand palette** — electric cyan, teal, purple, red, emerald green, and slate.

These chapter themes are consumed by chapter content components (ActionPrompt, AppearanceChecklist, ChallengeCard, etc.) via `style={{ color: t.primary }}` inline styles, which bypasses the Tailwind/token system entirely.

**Verdict:** VIOLATION — 11 of 21 chapters use non-brand primary colors  
**Severity:** CRITICAL — This is a parallel color system that directly contradicts COLOR_SYSTEM.md §14.1 (Evidence Traceability) and §13 (Color Decision Filter). The spec states "Every color decision must trace to one or more approved canonical documents." These chapter themes trace to no approved document.

**Mitigating factors:**
- The ChapterTheme system appears to be an intentional creative direction for chapter differentiation
- All chapters maintain dark backgrounds and light text, preserving readability
- The default theme and chapters 18-21 are brand-aligned
- The per-chapter theming may have been approved before COLOR_SYSTEM.md was finalized

---

## Finding 6: Green Reward Colors in Chapter Level-Up Components

**Files:** Multiple chapter theme files  
**What was found:** Many chapter themes use green (`#22C55E` or `#10B981`) for "level up" reward text and backgrounds:

- `chapter-4-content.ts:87` — `rewardText: '#10B981'`
- `chapter-4-premium.ts:85` — `rewardText: '#10B981'`
- `chapter-5-premium.ts:85` — `rewardText: '#10B981'`
- `chapter-6-premium.ts:85` — `rewardText: '#10B981'`
- `chapter-7-premium.ts:85` — `rewardText: '#10B981'`
- `chapter-16-premium.ts:86` — `rewardText: '#22C55E'`
- `chapter-17-premium.ts:85` — `rewardText: '#22C55E'`
- `chapter-18-premium.ts:31` — `rewardText: '#22C55E'`
- `chapter-19-premium-content.ts:31` — `rewardText: '#22C55E'`
- `chapter-20-premium-content.ts:31` — `rewardText: '#22C55E'`
- `chapter-21-premium-content.ts:79` — `rewardText: '#22C55E'`
- `chapter-content.ts:757` — `rewardText: '#10B981'`

The COLOR_SYSTEM.md explicitly maps success to **gold (#D4AF37)**, not green. The spec states: "Success uses ASCYN Gold to reinforce the connection between achievement and the brand's metallic standard."

**Verdict:** VIOLATION — green is not a brand color and contradicts the semantic mapping  
**Severity:** WARNING — These are confined to chapter content "level up" gamification elements and don't affect the core app UI, but they contradict the brand's semantic color system.

---

## Finding 7: Legacy Tailwind Gray Classes in Print Report Components

**Files:**  
- `src/components/reports/ClassPerformanceReport.tsx` — 8 instances  
- `src/components/reports/StudentGradeReport.tsx` — 14 instances  
- `src/app/instructor/student/[studentId]/page.tsx` — 8 instances  
- `src/app/instructor/student/[studentId]/ProgressReportModal.tsx` — 12 instances

**What was found:** These components use `border-gray-200`, `border-gray-100`, `text-gray-900`, `text-gray-600`, `text-gray-700`, `bg-gray-50`, and `bg-gray-100` Tailwind classes. All instances are inside `bg-white text-black` containers that are explicitly designed as **print report layouts** — they render as white-background documents for printing/PDF generation.

The `gray-*` classes here are Tailwind's default gray scale, not the brand's neutral scale. However, since these are print-only components that render on white backgrounds, they need light-mode-appropriate colors that the dark-only brand token system doesn't provide.

**Verdict:** INTENTIONAL — print reports need light-mode colors; brand tokens are dark-only  
**Severity:** WARNING — While functionally necessary, these components bypass the brand token system. When light mode is implemented (per COLOR_SYSTEM.md §12.5), these should be migrated to use the light-mode neutral tokens. For now, they should be documented as an accepted exception.

---

## Finding 8: Legacy `text-gray-300` in Chapter 21 Inline HTML

**File:** `src/lib/chapter-21-premium-content.ts`  
**What was found:** 52 instances of `text-gray-300` and 4 instances of `text-gray-200` used as CSS classes in inline HTML template literals. These are rendered via `dangerouslySetInnerHTML` (or similar) and are NOT processed by Tailwind's JIT compiler — they're raw HTML strings.

Additionally, this file uses `text-ascyn-gold` and `bg-ascyn-gold` classes (46 total instances) that are **not defined anywhere** in the CSS. These classes have no effect and the text likely inherits default styling.

**Verdict:** VIOLATION  
**Severity:**  
- `text-gray-300`/`text-gray-200`: **WARNING** — These are inert classes in raw HTML that likely don't match any generated Tailwind utilities. They should use the chapter theme's `text`/`textMuted` colors or brand token classes like `text-silver`.
- `text-ascyn-gold`/`bg-ascyn-gold`: **CRITICAL** — These classes don't exist in the CSS. The content is likely rendering with incorrect/default styling. Should be `text-gold` (which is generated by `@theme inline`) or use inline styles with the chapter theme.

---

## Finding 9: Email Template Hardcoded Colors

**Files:**  
- `src/app/api/contact/route.ts` (lines 77-93)  
- `src/lib/actions.ts` (lines 44-53)  
- `src/lib/ownerNotificationEmail.ts` (lines 54-105)

**What was found:** Email templates use hardcoded hex colors in inline styles:
- `#0a0a0a` (near-black background) — close to but not exactly brand black `#000000`
- `#111111` (card background) — close to but not exactly brand charcoal `#1A1A1A`
- `#2a2a2a` (borders) — close to but not exactly brand graphite `#2D2D2D`
- `#888888` (muted text) — close to but not exactly brand silver-gray `#8C8C8C`
- `#ffffff` (white text) — matches brand white
- `#D4AF37` (gold accents) — matches brand gold exactly

**Verdict:** VIOLATION — approximate but not exact brand colors  
**Severity:** WARNING — Email clients don't support CSS custom properties, so hardcoded hex values are necessary. However, the values should use the exact brand hex codes (`#000000`, `#1A1A1A`, `#2D2D2D`, `#8C8C8C`) rather than approximations. The differences are subtle but violate the spec's precision requirement.

---

## Finding 10: Demo/Presentation Page Light Theme

**File:** `src/app/demo/DemoClient.tsx`  
**What was found:** The demo/presentation page uses a **light theme** with `bg-white` card backgrounds and `bg-[var(--color-brand-off-white)]` page background. This is the only surface in the app that uses a light background. It also has a `highContrast` mode that switches to `bg-white text-black`.

The demo page uses `border-[var(--color-brand-deep-navy)]/10` for card borders, which correctly references brand tokens. The page appears to be designed for projector/conference presentations where a light background may be more readable.

**Verdict:** INTENTIONAL — presentation/demo surface designed for projector visibility  
**Severity:** INFO — This is a deliberate design choice for a specific surface (conference presentations). The COLOR_SYSTEM.md supports light mode as an accessibility alternative. The demo page correctly uses brand tokens for borders and accents.

---

## Finding 11: Print Report Generator Hardcoded Colors

**File:** `src/app/demo/instructor/reports.ts`  
**What was found:** The PDF/print report generator uses hardcoded hex colors throughout its CSS template:
- `const GOLD = '#D4AF37'` — exact brand match ✅
- `const BLACK = '#000000'` — exact brand match ✅
- `const WHITE = '#FFFFFF'` — exact brand match ✅
- Various `#666`, `#888`, `#444`, `#333`, `#1a1a1a`, `#fafafa`, `#f9f9f9`, `#e5e5e5`, `#f0f0f0` — light-mode grays for print output

This file generates standalone HTML for printing/PDF, so it cannot use CSS custom properties from the app's stylesheet. It correctly uses brand gold/black/white constants and uses appropriate light-mode grays for print readability.

**Verdict:** INTENTIONAL — print reports require self-contained styles  
**Severity:** INFO

---

## Finding 12: Legacy CSS Custom Property Definitions in Chapter HTML

**Files:**  
- `src/lib/chapter-18-premium.ts` (line 45)  
- `src/lib/chapter-19-premium-content.ts` (line 45)  
- `src/lib/chapter-20-premium-content.ts` (lines 47, 100, 148, 206, 275, 331, 390)

**What was found:** These files define inline `<style>` blocks with their own CSS custom properties:
```css
--gold: #D4AF37; --dark: #0a0a0a; --dark-gray: #1a1a1a; --medium-gray: #2a2a2a; --light-gray: #888; --white: #ffffff;
```

These shadow/override the global brand tokens with slightly different values (`#0a0a0a` vs `#000000` for dark, `#2a2a2a` vs `#2D2D2D` for medium-gray, `#888` vs `#8C8C8C` for light-gray). They're scoped to `.chXX-legacy-content` so they don't leak globally.

**Verdict:** VIOLATION — approximate brand colors in scoped overrides  
**Severity:** WARNING — The values are close but not exact. Since these are scoped to legacy content wrappers, the impact is contained. However, they should use the exact brand hex values.

---

## Finding 13: Presentation Mode High-Contrast Overrides

**File:** `src/app/globals.css` (lines 1118-1131)  
**What was found:** The presentation mode high-contrast section references `.text-[#B8860B]` and `.text-[#c9a000]` — these are arbitrary-value Tailwind classes used in demo/presentation components. The high-contrast override changes them to `#FFD700` (pure gold). Neither `#B8860B` (dark goldenrod) nor `#c9a000` (dark gold) are brand tokens.

Additionally, `.border-[#1a2332]/10` references a dark navy that's close to but not exactly `--color-brand-deep-navy` (`#1B1F3B`).

**Verdict:** VIOLATION — non-brand hex values in presentation components  
**Severity:** WARNING — These are confined to the demo/presentation surface and the high-contrast override corrects them at runtime. However, the underlying components should use brand tokens.

---

## Finding 14: No Conflicting Gradient Classes

**Files:** All `src/` files  
**What was found:** Zero instances of `from-gray-*`, `to-gray-*`, `via-gray-*`, or any non-brand gradient color stops. All gradient classes use brand tokens:
- `from-[var(--color-brand-gold)] to-[var(--color-brand-gold)]` (button gradients)
- `from-black via-charcoal to-black` (page background gradients)
- `from-[var(--color-brand-gold)]/5 via-transparent to-transparent` (decorative overlays)
- `from-silver/5 to-[var(--color-brand-black)]` (card gradients)

**Verdict:** INTENTIONAL  
**Severity:** INFO

---

## Finding 15: School Branding Custom Color Feature

**File:** `src/components/admin/school-config/BrandingSection.tsx` (line 203)  
**What was found:** The school configuration admin panel allows schools to set a custom `branding.primaryColor` which is applied via `style={{ backgroundColor: branding.primaryColor }}`. This is a user-configurable feature for white-labeling.

**Verdict:** INTENTIONAL — user-configurable branding is a product feature  
**Severity:** INFO — This is a deliberate product feature, not a design system violation. The validation schema (`validation.ts:45`) enforces hex color format.

---

## Summary Table

| # | Finding | Verdict | Severity |
|---|---|---|---|
| 1 | Brand token foundation complete | INTENTIONAL | INFO |
| 2 | `--color-brand-gold-light` not in spec | VIOLATION | WARNING |
| 3 | Semantic color mapping correct | INTENTIONAL | INFO |
| 4 | Dark-only theme (no light mode) | INTENTIONAL | INFO |
| 5 | Per-chapter parallel color palettes | VIOLATION | **CRITICAL** |
| 6 | Green reward colors in chapters | VIOLATION | WARNING |
| 7 | Legacy gray classes in print reports | INTENTIONAL | WARNING |
| 8 | `text-gray-300` + undefined `ascyn-gold` in ch21 | VIOLATION | **CRITICAL** |
| 9 | Email template approximate colors | VIOLATION | WARNING |
| 10 | Demo page light theme | INTENTIONAL | INFO |
| 11 | Print report generator colors | INTENTIONAL | INFO |
| 12 | Legacy CSS custom property overrides | VIOLATION | WARNING |
| 13 | Presentation mode non-brand hex values | VIOLATION | WARNING |
| 14 | No conflicting gradient classes | INTENTIONAL | INFO |
| 15 | School branding custom colors | INTENTIONAL | INFO |

---

## Recommendations

### CRITICAL (must fix before gate passes)

1. **Chapter 21 undefined classes** — Replace all `text-ascyn-gold` and `bg-ascyn-gold` with `text-gold` and `bg-gold` (which are generated by the `@theme inline` block). Replace `text-gray-300`/`text-gray-200` with `text-silver` or the chapter theme's text colors.

2. **Per-chapter color palettes** — Decide whether per-chapter theming is an approved creative direction. If yes, document it as an amendment to COLOR_SYSTEM.md with a governance trail. If no, migrate all chapter themes to use brand-aligned colors (gold/silver/bronze/charcoal/graphite family).

### WARNING (should fix, not blocking)

3. **`--color-brand-gold-light`** — Either add `#F4E4A6` to COLOR_SYSTEM.md as an approved hover-state variant, or replace with the spec's `#F4D03F`.

4. **Green reward colors** — Replace `#22C55E` and `#10B981` with `#D4AF37` (gold) in all chapter theme `rewardText` properties to align with the semantic color mapping.

5. **Email template colors** — Update `#0a0a0a` → `#000000`, `#111111` → `#1A1A1A`, `#2a2a2a` → `#2D2D2D`, `#888888` → `#8C8C8C` for exact brand compliance.

6. **Legacy chapter CSS overrides** — Update `#0a0a0a` → `#000000`, `#2a2a2a` → `#2D2D2D`, `#888` → `#8C8C8C` in chapter 18-20 inline style blocks.

7. **Presentation mode hex values** — Replace `#B8860B` and `#c9a000` with brand token references. Replace `#1a2332` with `#1B1F3B` (deep navy).

8. **Print report gray classes** — Document as an accepted exception for print-only components, or migrate to light-mode brand tokens when light mode is implemented.

---

*Audit complete. All findings verified against COLOR_SYSTEM.md v1.0 and the current codebase.*
