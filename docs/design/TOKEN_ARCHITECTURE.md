# ASCYN PRO Design Token Architecture

**BL-001 — CSS Custom Properties & Design Token Foundation**
**BL-003 — Typography System Implementation**
**Phase 5, Sprint 1**
**Date:** 2026-08-09 (BL-001) / 2026-08-09 (BL-003)
**Status:** Canonical Reference

---

## 1. Brand Colors

All colors trace to approved Phase 4 Visual Identity governance.

### Primary Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-gold` | `#D4AF37` | Primary brand accent, CTAs, highlights |
| `--color-brand-gold-light` | `#F4E4A6` | Gold variant for gradients, hover states |
| `--color-brand-silver` | `#C0C0C0` | Secondary brand accent, text secondary |
| `--color-brand-black` | `#000000` | Primary background, text on light |
| `--color-brand-white` | `#FFFFFF` | Text primary, surface on dark |

### Neutral Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-charcoal` | `#1A1A1A` | Background secondary, surface primary |
| `--color-brand-graphite` | `#2D2D2D` | Background tertiary, surface secondary, borders |
| `--color-brand-silver-gray` | `#8C8C8C` | Text muted, disabled states |
| `--color-brand-light-gray` | `#E5E5E5` | Borders on light, subtle backgrounds |
| `--color-brand-off-white` | `#F5F5F5` | Background subtle, surface on light |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-deep-navy` | `#1B1F3B` | Accent backgrounds, depth |
| `--color-brand-warm-bronze` | `#CD7F32` | Warning states, secondary accent |
| `--color-brand-cool-platinum` | `#E5E4E2` | Subtle highlights, borders |

---

## 2. Semantic Colors

Semantic tokens map brand colors to functional usage.

### Backgrounds

| Token | Maps To | Usage |
|-------|---------|-------|
| `--color-background-primary` | `--color-brand-black` | Main app background |
| `--color-background-secondary` | `--color-brand-charcoal` | Card backgrounds, elevated surfaces |
| `--color-background-tertiary` | `--color-brand-graphite` | Hover states, active surfaces |
| `--color-background-accent` | `--color-brand-deep-navy` | Special sections, callouts |

### Surfaces

| Token | Maps To | Usage |
|-------|---------|-------|
| `--color-surface-primary` | `--color-brand-charcoal` | Primary card surface |
| `--color-surface-secondary` | `--color-brand-graphite` | Secondary card surface |
| `--color-surface-elevated` | `--color-brand-graphite` | Modals, dropdowns, popovers |

### Borders

| Token | Maps To | Usage |
|-------|---------|-------|
| `--color-border-primary` | `--color-brand-graphite` | Default borders |
| `--color-border-secondary` | `#404040` | Subtle borders, dividers |
| `--color-border-accent` | `--color-brand-gold` | Focus states, active borders |
| `--color-border-muted` | `--color-brand-charcoal` | Very subtle borders |

### Text

| Token | Maps To | Usage |
|-------|---------|-------|
| `--color-text-primary` | `--color-brand-white` | Primary text |
| `--color-text-secondary` | `--color-brand-silver` | Secondary text, descriptions |
| `--color-text-muted` | `--color-brand-silver-gray` | Captions, metadata, disabled |
| `--color-text-accent` | `--color-brand-gold` | Links, highlights, CTAs |
| `--color-text-inverse` | `--color-brand-black` | Text on light backgrounds |

### Functional Colors

| Token | Maps To | Usage |
|-------|---------|-------|
| `--color-success` | `--color-brand-gold` | Success states, confirmations |
| `--color-success-bg` | `--color-brand-charcoal` | Success background |
| `--color-success-border` | `--color-brand-gold` | Success borders |
| `--color-warning` | `--color-brand-warm-bronze` | Warning states |
| `--color-warning-bg` | `--color-brand-charcoal` | Warning background |
| `--color-warning-border` | `--color-brand-warm-bronze` | Warning borders |
| `--color-error` | `--color-brand-silver` | Error states (monochrome per governance) |
| `--color-error-bg` | `--color-brand-charcoal` | Error background |
| `--color-error-border` | `--color-brand-silver` | Error borders |
| `--color-info` | `--color-brand-silver` | Info states |
| `--color-info-bg` | `--color-brand-charcoal` | Info background |
| `--color-info-border` | `--color-brand-silver` | Info borders |
| `--color-disabled` | `#404040` | Disabled elements |
| `--color-disabled-bg` | `--color-brand-charcoal` | Disabled backgrounds |
| `--color-disabled-border` | `--color-brand-graphite` | Disabled borders |

---

## 3. Typography Variables

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family-sans` | `var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | Primary UI font |
| `--font-family-mono` | `"JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace` | Code, technical content |

### Font Sizes (Mobile / Desktop)

| Token | Mobile | Desktop | Usage |
|-------|--------|---------|-------|
| `--font-size-display` | `2.25rem` | `4rem` | Hero headlines |
| `--font-size-h1` | `1.875rem` | `3rem` | Page titles |
| `--font-size-h2` | `1.5rem` | `2.25rem` | Section headers |
| `--font-size-h3` | `1.25rem` | `1.75rem` | Subsection headers |
| `--font-size-h4` | `1.125rem` | `1.375rem` | Card titles |
| `--font-size-body-lg` | `1.125rem` | `1.25rem` | Large body text |
| `--font-size-body` | `1rem` | `1rem` | Default body text |
| `--font-size-body-sm` | `0.875rem` | `0.875rem` | Small body text |
| `--font-size-caption` | `0.75rem` | `0.75rem` | Captions, labels |
| `--font-size-overline` | `0.6875rem` | `0.75rem` | Overlines, eyebrows |
| `--font-size-button` | `0.875rem` | `1rem` | Button text |
| `--font-size-input` | `1rem` | `1rem` | Form inputs |
| `--font-size-code` | `0.875rem` | `0.875rem` | Code snippets |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-regular` | `400` | Body text |
| `--font-weight-medium` | `500` | Buttons, overlines |
| `--font-weight-semibold` | `600` | Headings h2-h4 |
| `--font-weight-bold` | `700` | Display, h1 |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-tight` | `1.1` | Display, h1 |
| `--line-height-snug` | `1.2` | h2 |
| `--line-height-normal` | `1.25` | h3 |
| `--line-height-relaxed` | `1.3` | h4, overline |
| `--line-height-loose` | `1.4` | Caption, button |
| `--line-height-body` | `1.5` | Body small, input |
| `--line-height-body-lg` | `1.6` | Body, body large, code |

### Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--letter-spacing-tighter` | `-0.02em` | Display |
| `--letter-spacing-tight` | `-0.015em` | h1 |
| `--letter-spacing-snug` | `-0.01em` | h2 |
| `--letter-spacing-normal` | `-0.005em` | h3 |
| `--letter-spacing-body` | `0` | Body, h4 |
| `--letter-spacing-wide` | `0.005em` | Body small |
| `--letter-spacing-wider` | `0.01em` | Caption, button |
| `--letter-spacing-widest` | `0.08em` | Overline |

---

## 4. Spacing Scale

4px base unit system. All values in rem.

| Token | Value | Pixels |
|-------|-------|--------|
| `--spacing-0` | `0` | 0px |
| `--spacing-1` | `0.25rem` | 4px |
| `--spacing-2` | `0.5rem` | 8px |
| `--spacing-3` | `0.75rem` | 12px |
| `--spacing-4` | `1rem` | 16px |
| `--spacing-5` | `1.25rem` | 20px |
| `--spacing-6` | `1.5rem` | 24px |
| `--spacing-8` | `2rem` | 32px |
| `--spacing-10` | `2.5rem` | 40px |
| `--spacing-12` | `3rem` | 48px |
| `--spacing-16` | `4rem` | 64px |
| `--spacing-20` | `5rem` | 80px |
| `--spacing-24` | `6rem` | 96px |
| `--spacing-32` | `8rem` | 128px |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | `0` | Sharp corners |
| `--radius-sm` | `0.125rem` | Subtle rounding (2px) |
| `--radius-md` | `0.375rem` | Default rounding (6px) |
| `--radius-lg` | `0.5rem` | Cards, buttons (8px) |
| `--radius-xl` | `0.75rem` | Large cards, modals (12px) |
| `--radius-2xl` | `1rem` | Extra large elements (16px) |
| `--radius-full` | `9999px` | Pills, circular elements |

---

## 6. Elevation & Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | Elevated cards, dropdowns |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | Modals, popovers |
| `--shadow-2xl` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | Maximum elevation |
| `--shadow-gold` | `0 10px 40px rgba(212, 175, 55, 0.1)` | Gold accent glow |
| `--shadow-inner` | `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)` | Pressed states |

---

## 7. Animation Timing

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `0ms` | No animation |
| `--duration-fast` | `150ms` | Micro-interactions, hover |
| `--duration-normal` | `300ms` | Default transitions |
| `--duration-slow` | `500ms` | Complex animations |
| `--duration-slower` | `700ms` | Page transitions |

### Easing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-linear` | `linear` | Linear motion |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard easing |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Accelerate |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Decelerate |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth both ways |

---

## 8. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Default layer |
| `--z-dropdown` | `1000` | Dropdown menus |
| `--z-sticky` | `1020` | Sticky headers |
| `--z-fixed` | `1030` | Fixed elements |
| `--z-modal-backdrop` | `1040` | Modal overlays |
| `--z-modal` | `1050` | Modal dialogs |
| `--z-popover` | `1060` | Popovers, tooltips |
| `--z-tooltip` | `1070` | Tooltips (highest) |
| `--z-skip-link` | `100` | Accessibility skip links |

---

## 9. Legacy Aliases

For backward compatibility during migration:

| Legacy Token | Maps To |
|--------------|---------|
| `--gold` | `--color-brand-gold` |
| `--gold-light` | `--color-brand-gold-light` |
| `--silver` | `--color-brand-silver` |
| `--black` | `--color-brand-black` |
| `--white` | `--color-brand-white` |
| `--charcoal` | `--color-brand-charcoal` |
| `--graphite` | `--color-brand-graphite` |
| `--silver-gray` | `--color-brand-silver-gray` |
| `--light-gray` | `--color-brand-light-gray` |
| `--off-white` | `--color-brand-off-white` |
| `--deep-navy` | `--color-brand-deep-navy` |
| `--warm-bronze` | `--color-brand-warm-bronze` |
| `--cool-platinum` | `--color-brand-cool-platinum` |
| `--dark` | `--color-brand-black` |
| `--dark-gray` | `--color-brand-charcoal` |
| `--medium-gray` | `--color-brand-graphite` |
| `--bg-primary` | `--color-background-primary` |
| `--bg-secondary` | `--color-background-secondary` |
| `--bg-tertiary` | `--color-background-tertiary` |
| `--surface-primary` | `--color-surface-primary` |
| `--surface-secondary` | `--color-surface-secondary` |
| `--border-primary` | `--color-border-primary` |
| `--border-secondary` | `--color-border-secondary` |
| `--text-primary` | `--color-text-primary` |
| `--text-secondary` | `--color-text-secondary` |
| `--text-muted` | `--color-text-muted` |

---

## 10. Tailwind Utility Mapping (BL-003)

BL-003 maps all Tailwind CSS v4 typography utilities to design tokens via `@theme inline`. This means every existing `text-*`, `font-*`, `leading-*`, and `tracking-*` class in the codebase automatically resolves to the correct design token value without requiring individual file changes.

### Font Size Mapping

| Tailwind Class | Resolves To | Mobile Value | Desktop Value (≥1024px) | Semantic Role |
|---|---|---|---|---|
| `text-xs` | `var(--font-size-caption)` | 0.75rem | 0.75rem | Captions, labels |
| `text-sm` | `var(--font-size-body-sm)` | 0.875rem | 0.875rem | Small body, metadata |
| `text-base` | `var(--font-size-body)` | 1rem | 1rem | Default body text |
| `text-lg` | `var(--font-size-body-lg)` | 1.125rem | 1.25rem | Large body text |
| `text-xl` | `var(--font-size-h4)` | 1.125rem | 1.375rem | Card titles |
| `text-2xl` | `var(--font-size-h3)` | 1.25rem | 1.75rem | Subsection headers |
| `text-3xl` | `var(--font-size-h2)` | 1.5rem | 2.25rem | Section headers |
| `text-4xl` | `var(--font-size-h1)` | 1.875rem | 3rem | Page titles |
| `text-5xl` | `var(--font-size-display)` | 2.25rem | 4rem | Hero headlines |
| `text-6xl` | `calc(var(--font-size-display) * 1.5)` | 3.375rem | 6rem | Oversized display |
| `text-7xl` | `calc(var(--font-size-display) * 2)` | 4.5rem | 8rem | Oversized display |
| `text-8xl` | `calc(var(--font-size-display) * 2.5)` | 5.625rem | 10rem | Oversized display |
| `text-9xl` | `calc(var(--font-size-display) * 3)` | 6.75rem | 12rem | Oversized display |

### Font Weight Mapping

| Tailwind Class | Resolves To | Value |
|---|---|---|
| `font-light` | `300` | 300 |
| `font-normal` | `var(--font-weight-regular)` | 400 |
| `font-medium` | `var(--font-weight-medium)` | 500 |
| `font-semibold` | `var(--font-weight-semibold)` | 600 |
| `font-bold` | `var(--font-weight-bold)` | 700 |
| `font-extrabold` | `800` | 800 |
| `font-black` | `900` | 900 |

### Line Height Mapping

| Tailwind Class | Resolves To | Value |
|---|---|---|
| `leading-none` | `1` | 1 |
| `leading-tight` | `var(--line-height-tight)` | 1.1 |
| `leading-snug` | `var(--line-height-snug)` | 1.2 |
| `leading-normal` | `var(--line-height-normal)` | 1.25 |
| `leading-relaxed` | `var(--line-height-relaxed)` | 1.3 |
| `leading-loose` | `var(--line-height-loose)` | 1.4 |

### Letter Spacing Mapping

| Tailwind Class | Resolves To | Value |
|---|---|---|
| `tracking-tighter` | `var(--letter-spacing-tighter)` | -0.02em |
| `tracking-tight` | `var(--letter-spacing-tight)` | -0.015em |
| `tracking-normal` | `var(--letter-spacing-body)` | 0 |
| `tracking-wide` | `var(--letter-spacing-wide)` | 0.005em |
| `tracking-wider` | `var(--letter-spacing-wider)` | 0.01em |
| `tracking-widest` | `var(--letter-spacing-widest)` | 0.08em |

### Semantic Base Styles (BL-003)

The following HTML elements receive automatic typography from `@layer base`:

| Element | Font Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| `body` | `--font-size-body` | 400 | 1.6 | 0 |
| `h1` | `--font-size-h1` | 700 | 1.1 | -0.015em |
| `h2` | `--font-size-h2` | 600 | 1.2 | -0.01em |
| `h3` | `--font-size-h3` | 600 | 1.25 | -0.005em |
| `h4` | `--font-size-h4` | 600 | 1.3 | 0 |
| `h5` | `--font-size-body-lg` | 600 | 1.6 | 0 |
| `h6` | `--font-size-body` | 600 | 1.6 | 0 |
| `p` | `--font-size-body` | 400 | 1.6 | 0 |
| `label` | `--font-size-body-sm` | 500 | 1.5 | 0.005em |
| `input/textarea/select` | `--font-size-input` | 400 | 1.5 | 0 |
| `code/pre` | `--font-size-code` (mono) | 400 | 1.6 | 0 |
| `table` | `--font-size-body-sm` | 400 | 1.5 | 0.005em |
| `th` | `--font-size-body-sm` | 500 | 1.5 | 0.01em |
| `td` | `--font-size-body-sm` | 400 | 1.5 | 0.005em |
| `nav` | `--font-size-body-sm` | 500 | 1.5 | 0.005em |
| `ul/ol` | `--font-size-body` | 400 | 1.6 | 0 |
| `blockquote` | `--font-size-body-lg` | 400 | 1.6 | 0 |
| `small` | `--font-size-caption` | 400 | 1.4 | 0.01em |
| `strong/b` | inherits size | 600 | inherits | inherits |

---

## 11. Traceability Matrix

| Token Category | Governance Source | Status |
|----------------|-------------------|--------|
| Brand Colors | Phase 4 COLOR_SYSTEM.md | ✅ Approved |
| Semantic Colors | Phase 4 COLOR_SYSTEM.md | ✅ Approved |
| Typography | Phase 4 TYPOGRAPHY_SYSTEM.md | ✅ Approved |
| Spacing | 4px base unit (industry standard) | ✅ Approved |
| Border Radius | Phase 4 Visual Identity | ✅ Approved |
| Shadows | Phase 4 Visual Identity | ✅ Approved |
| Animation | Phase 4 Visual Identity | ✅ Approved |
| Z-Index | Standard layering practice | ✅ Approved |
| Tailwind Font Size Mapping | BL-003 Typography System | ✅ Implemented |
| Tailwind Font Weight Mapping | BL-003 Typography System | ✅ Implemented |
| Tailwind Line Height Mapping | BL-003 Typography System | ✅ Implemented |
| Tailwind Letter Spacing Mapping | BL-003 Typography System | ✅ Implemented |
| Semantic Base Styles | BL-003 Typography System | ✅ Implemented |
| Responsive Typography | BL-003 Typography System | ✅ Implemented |

---

*This document is the canonical reference for all design tokens in ASCYN PRO. All future UI components must consume these tokens.*
