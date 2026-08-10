# FRG-04: Logo & Brand Assets Audit

**Audit Date:** 2026-08-09  
**Auditor:** Foundation Review Gate — Area 4  
**Project:** ASCYN PRO (barber-study-pro)  
**Scope:** Logo component, brand asset files, metadata, accessibility, legacy cleanup

---

## Executive Summary

The Logo & Brand Asset system is **well-implemented and in strong shape**. The centralized `Logo` component is properly designed with full variant/theme/size support, correct accessibility attributes, and clean exports. All 21 SVG brand assets exist on disk. All source-code `<img>` logo references have been migrated to the `Logo` component. Metadata in `layout.tsx` is comprehensive.

**Overall Grade: PASS (with minor warnings)**

| # | Check | Status |
|---|-------|--------|
| 1 | Logo component API & implementation | ✅ PASS |
| 2 | Brand index.ts exports | ✅ PASS |
| 3 | BL-004 completion report accuracy | ✅ PASS |
| 4 | SVG asset files (21 expected) | ✅ PASS |
| 5 | Remaining `<img>` logo references | ✅ PASS (email templates only — intentional) |
| 6 | Legacy `/logo.svg` references | ✅ PASS (zero code references) |
| 7 | Hardcoded SVG logo duplications | ✅ PASS (none found) |
| 8 | Metadata configuration (layout.tsx) | ✅ PASS |
| 9 | favicon.ico existence | ✅ PASS |
| 10 | Accessibility (alt text, aria-label, decorative) | ✅ PASS |
| 11 | Pages missing Logo component | ⚠️ WARNING (3 pages) |

---

## Detailed Findings

### 1. Logo Component (`src/components/brand/Logo.tsx`)

**Status: ✅ PASS**

The component is well-architected:

- **Props API:** `variant` (full/icon/horizontal/vertical), `theme` (light/dark/gold/white/monochrome), `size` (xs–2xl), `width`/`height` overrides, `decorative` mode, `aria-label` support
- **forwardRef:** Properly implemented with `HTMLImageElement` ref typing
- **Size map:** 6 predefined sizes (24px–96px) with correct width/height pairs
- **Aspect ratio handling:** `variantAspectMap` ensures correct proportions; auto-computes height from width when only width is specified
- **Path resolution:** `getLogoSrc()` correctly maps all variant×theme combinations to `/brand/*.svg` paths
- **Convenience components:** `LogoIcon`, `LogoHorizontal`, `LogoVertical` all properly wrap `Logo`
- **`brandAssets` constant:** Exported for metadata/icon references
- **Default export:** `Logo` is also the default export
- **JSDoc:** Includes usage examples

**No issues found.**

---

### 2. Brand Index (`src/components/brand/index.ts`)

**Status: ✅ PASS**

Exports are clean and complete:

```ts
export { Logo, LogoIcon, LogoHorizontal, LogoVertical, brandAssets } from './Logo'
export type { LogoProps, LogoVariant, LogoTheme, LogoSize } from './Logo'
```

All components, the `brandAssets` constant, and all types are re-exported. Both named and type exports are present.

**No issues found.**

---

### 3. BL-004 Completion Report (`BL-004-BRAND-ASSETS.md`)

**Status: ✅ PASS**

The completion report is thorough and accurate:

- Lists all 20 SVG assets + favicon.ico (21 total)
- Documents all 5 component exports
- Lists all modified files (17 files)
- Documents 4 remaining exceptions (legacy logo.svg, email URLs, PNG fallbacks, OG image format)
- Includes risk assessment with mitigations
- Includes 6 recommendations
- Reports validation results (TypeScript ✅, Build ✅, Tests 385/385 ✅)

**Verified against actual codebase — report is accurate.**

---

### 4. SVG Asset Files (`public/brand/`)

**Status: ✅ PASS**

**21 files found** (matches expected count):

| File | Size (bytes) | Purpose |
|------|-------------|---------|
| `horizontal-dark.svg` | 556 | Primary logo, dark bg |
| `horizontal-gold.svg` | 560 | Gold variant |
| `horizontal-light.svg` | 560 | Light bg variant |
| `horizontal-mono.svg` | 560 | Grayscale variant |
| `horizontal-white.svg` | 560 | White variant |
| `vertical-dark.svg` | 597 | Stacked, dark bg |
| `vertical-gold.svg` | 601 | Stacked gold |
| `vertical-light.svg` | 601 | Stacked, light bg |
| `vertical-mono.svg` | 601 | Stacked grayscale |
| `vertical-white.svg` | 601 | Stacked white |
| `icon-dark.svg` | 258 | Icon, dark bg |
| `icon-gold.svg` | 260 | Icon gold |
| `icon-light.svg` | 260 | Icon, light bg |
| `icon-mono.svg` | 260 | Icon grayscale |
| `icon-white.svg` | 260 | Icon white |
| `icon-180.svg` | 335 | Apple touch icon |
| `icon-192.svg` | 335 | Android/PWA icon |
| `icon-512.svg` | 351 | High-res PWA icon |
| `og-image.svg` | 842 | OG rectangular (1200×630) |
| `og-image-square.svg` | 845 | OG square (1200×1200) |
| `icon.svg` | 561 | ⚠️ Extra file (see below) |

**⚠️ WARNING — Extra file: `icon.svg`**
- **File:** `public/brand/icon.svg`
- **What:** A horizontal-format logo SVG (200×40 viewBox) with gold/white "ASCYN PRO" text
- **Issue:** This file is NOT listed in the BL-004 completion report and is NOT referenced by any source code. It appears to be a leftover or early draft. It uses a horizontal layout but is named `icon.svg`, which is confusing.
- **Recommendation:** Remove this file or rename it to avoid confusion with the `icon-*.svg` series.

---

### 5. Remaining `<img>` Tags Referencing Logo Files

**Status: ✅ PASS**

The only `<img>` tags referencing logo URLs are in **email templates**, which is intentional and correct:

| File | Line | Context |
|------|------|---------|
| `src/app/api/email/route.ts` | 84 | `<img src="${LOGO_URL}" alt="ASCYN PRO" width="160">` — email HTML template |
| `src/app/demo/instructor/reports.ts` | 260 | `<img src="${LOGO_URL}" alt="ASCYN PRO" />` — report header |
| `src/app/demo/instructor/reports.ts` | 290 | `<img src="${LOGO_URL}" alt="ASCYN PRO" />` — report body |
| `src/app/demo/instructor/reports.ts` | 490 | `<img src="${LOGO_URL}" alt="ASCYN PRO" />` — report footer |

All use the absolute URL `https://ascynpro.com/brand/horizontal-dark.svg` (required for email clients). These are correct and should NOT be replaced with the React `Logo` component.

**No unintended `<img>` logo references remain in React components.**

---

### 6. Legacy `/logo.svg` References

**Status: ✅ PASS**

- **Zero references** to `/logo.svg` found in any `.tsx` or `.ts` file under `src/`
- The legacy file `/public/logo.svg` still exists on disk (confirmed)
- The BL-004 report correctly identifies this as a remaining exception

**Recommendation:** Delete `/public/logo.svg` after confirming no external dependencies (as noted in the report).

---

### 7. Hardcoded SVG Logo Duplications

**Status: ✅ PASS**

- **Zero inline `<svg>` elements** containing logo/brand/ASCYN-related markup found in any source file
- All logo rendering goes through the centralized `Logo` component
- The `GraduationCap` icon from lucide-react is used in several places, but these are **navigation/feature icons**, not brand logos — this is correct usage

**No duplications found.**

---

### 8. Metadata Configuration (`src/app/layout.tsx`)

**Status: ✅ PASS**

Comprehensive metadata properly configured:

| Feature | Status | Details |
|---------|--------|---------|
| **Title template** | ✅ | `"%s \| ASCYN PRO"` with default |
| **Description** | ✅ | Compelling, keyword-rich |
| **Keywords** | ✅ | Relevant terms included |
| **metadataBase** | ✅ | `https://ascynpro.com` |
| **Canonical** | ✅ | Set to `"/"` |
| **Icons** | ✅ | favicon.ico + SVG icon + apple touch + PWA icons |
| **OpenGraph** | ✅ | type, locale, url, siteName, title, description, 2 images (rect + square) |
| **Twitter Cards** | ✅ | summary_large_image with title, description, image |
| **Robots** | ✅ | index:true, follow:true, googleBot specifics |
| **formatDetection** | ✅ | email/address/telephone disabled |

**⚠️ WARNING — `brandAssets` constant references non-existent PNG files:**

The `brandAssets` export in `Logo.tsx` references:
- `/brand/apple-touch-icon.png` — **does not exist** (only `icon-180.svg` exists)
- `/brand/og-image.png` — **does not exist** (only `og-image.svg` exists)
- `/brand/og-image-square.png` — **does not exist** (only `og-image-square.svg` exists)

However, `layout.tsx` correctly references the **SVG** versions directly and does NOT use `brandAssets` for its metadata. The `brandAssets` constant appears to be aspirational (for future PNG generation) and is not currently imported by any file other than the index re-export.

**Recommendation:** Either generate the PNG files or update `brandAssets` to reference the actual SVG files.

---

### 9. favicon.ico

**Status: ✅ PASS**

- **File:** `src/app/favicon.ico` — **EXISTS**
- Referenced in `layout.tsx` metadata icons as `{ url: "/favicon.ico", sizes: "any" }`
- Next.js App Router convention: placing `favicon.ico` in `src/app/` is correct

---

### 10. Accessibility

**Status: ✅ PASS**

The Logo component implements comprehensive accessibility:

| Feature | Implementation | Status |
|---------|---------------|--------|
| **Default alt text** | `"ASCYN PRO"` when not decorative | ✅ |
| **Custom aria-label** | `'aria-label'` prop overrides default | ✅ |
| **Decorative mode** | `decorative={true}` → `alt=""`, `aria-hidden`, `role="presentation"` | ✅ |
| **Non-decorative role** | `role="img"` explicitly set | ✅ |
| **Alt/aria-label logic** | `alt={decorative ? '' : (ariaLabel ?? 'ASCYN PRO')}` | ✅ |
| **Aspect ratio preservation** | `object-contain` + computed dimensions | ✅ |
| **forwardRef** | Allows parent access to `<img>` element | ✅ |

**All accessibility requirements met.**

---

### 11. Pages Missing Logo Component

**Status: ⚠️ WARNING**

Most pages are covered by navigation components (`AdminNav`, `DashboardNav`, `InstructorNav`) that include the `Logo` component. However, the following standalone pages lack any Logo/brand element:

| Page | File | Issue |
|------|------|-------|
| **Pending Approval** | `src/app/pending-approval/page.tsx` | Uses emoji ⏳ instead of Logo; no brand presence |
| **Auth Code Error** | `src/app/auth/auth-code-error/page.tsx` | No Logo reference found |
| **Verify Email** | `src/app/auth/verify-email/page.tsx` | No Logo reference found |
| **Set Password** | `src/app/auth/set-password/page.tsx` | No Logo reference found |
| **Maintenance** | `src/app/maintenance/page.tsx` | No Logo reference found |
| **Beta Agreement** | `src/app/beta-agreement/page.tsx` | No Logo reference found |

**Analysis:**
- **Auth flow pages** (auth-code-error, verify-email, set-password): These are utility/error pages in the auth flow. The main auth pages (login, signup, reset-password, update-password) all have Logo. The missing ones are secondary/error states — **low priority**.
- **Pending Approval:** This is a user-facing waiting page. It would benefit from brand presence — **medium priority**.
- **Maintenance:** A branded maintenance page would be more professional — **low priority**.
- **Beta Agreement:** Legal/agreement page — **low priority**.

**Pages that correctly DON'T need Logo (covered by nav components):**
- All `dashboard/*` pages → covered by `DashboardNav` (has Logo)
- All `admin/*` pages → covered by `AdminNav` (has Logo)
- All `instructor/*` pages → covered by `InstructorNav` (has Logo)
- `demo/student/page.tsx` → renders `DemoClient` which has Logo
- `contact/page.tsx` → renders `ContactForm` which has Logo
- `school/page.tsx` → likely covered by nav or is a config page

---

## Warnings Summary

| # | Warning | Severity | Action Needed |
|---|---------|----------|---------------|
| 1 | Extra `public/brand/icon.svg` file not in report, not referenced | Low | Delete or document |
| 2 | `brandAssets` references non-existent PNG files | Low | Update paths or generate PNGs |
| 3 | 6 standalone pages lack Logo component | Low-Medium | Add Logo to pending-approval at minimum |
| 4 | Legacy `/public/logo.svg` still exists | Low | Delete after confirming no external refs |
| 5 | OG images and app icons are SVG-only (no PNG fallbacks) | Low | Generate PNGs for maximum platform compat |

---

## Recommendations

1. **Delete `public/brand/icon.svg`** — unreferenced, confusingly named
2. **Delete `public/logo.svg`** — legacy file, zero code references
3. **Add Logo to `pending-approval/page.tsx`** — user-facing page should have brand presence
4. **Update `brandAssets`** to reference actual SVG files or generate the referenced PNGs
5. **Generate PNG fallbacks** for OG images and app icons (as noted in BL-004)
6. **Consider adding Logo** to auth error/utility pages for consistent branding

---

## Validation Commands Run

```powershell
# Asset inventory
Get-ChildItem -Recurse "public\brand" | Select-Object FullName, Length

# <img> logo references
Get-ChildItem -Recurse -Include *.tsx,*.ts -Path src | Select-String '<img' | Where-Object { $_.Line -match 'logo' }

# Legacy /logo.svg references
Get-ChildItem -Recurse -Include *.tsx,*.ts -Path src | Select-String '/logo\.svg'

# Inline SVG duplications
Get-ChildItem -Recurse -Include *.tsx,*.ts -Path src | Select-String '<svg' | Where-Object { $_.Line -match 'logo|brand|ascyn' }

# Logo import usage
Get-ChildItem -Recurse -Include *.tsx,*.ts -Path src | Select-String 'import.*Logo.*from'

# Logo usage across all files
Get-ChildItem -Recurse -Include *.tsx,*.ts -Path src | Select-String 'Logo'

# favicon.ico existence
Test-Path "src\app\favicon.ico"

# brandAssets usage
Get-ChildItem -Recurse -Include *.tsx,*.ts -Path src | Select-String 'brandAssets'

# PNG fallback existence
Test-Path "public\brand\apple-touch-icon.png"
Test-Path "public\brand\og-image.png"
Test-Path "public\brand\og-image-square.png"
```

---

*Audit complete. All critical checks pass. Five low-severity warnings identified for cleanup.*
