import { forwardRef, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/* ============================================
   ASCYN PRO Official Brand Logo Component
   ============================================
   Centralized brand asset system using the
   official transparent PNG source assets.

   Supports responsive switching between full
   logo and A-mark based on viewport/context.
   ============================================ */

export type LogoVariant = 'full' | 'compact' | 'icon' | 'horizontal' | 'vertical'
export type LogoTheme = 'light' | 'dark' | 'gold' | 'white' | 'monochrome'
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

export interface LogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Logo layout variant */
  variant?: LogoVariant
  /** Color theme (legacy compat — all official assets are transparent PNG) */
  theme?: LogoTheme
  /** Predefined size */
  size?: LogoSize
  /** Custom width (overrides size) */
  width?: number | string
  /** Custom height (overrides size) */
  height?: number | string
  /** Accessible label (defaults to "ASCYN PRO") */
  'aria-label'?: string
  /** Whether the logo is decorative only */
  decorative?: boolean
  /** Force specific asset source (advanced) */
  src?: string
}

/* ─── Official asset paths ─── */
const ASSETS = {
  full: {
    sm: '/brand/logo-full-128.png',
    md: '/brand/logo-full-256.png',
    lg: '/brand/logo-full-512.png',
    xl: '/brand/logo-full-transparent.png',
    srcSet:
      '/brand/logo-full-128.png 128w, ' +
      '/brand/logo-full-256.png 256w, ' +
      '/brand/logo-full-512.png 512w, ' +
      '/brand/logo-full-transparent.png 1916w',
  },
  compact: {
    sm: '/brand/logo-a-mark-64.png',
    md: '/brand/logo-a-mark-128.png',
    lg: '/brand/logo-a-mark-256.png',
    xl: '/brand/logo-a-mark-transparent.png',
    srcSet:
      '/brand/logo-a-mark-64.png 64w, ' +
      '/brand/logo-a-mark-128.png 128w, ' +
      '/brand/logo-a-mark-256.png 256w, ' +
      '/brand/logo-a-mark-transparent.png 1536w',
  },
  // Legacy SVG fallbacks for icon/horizontal/vertical (placeholder system)
  icon: {
    dark: '/brand/icon-dark.svg',
    gold: '/brand/icon-gold.svg',
    white: '/brand/icon-white.svg',
    monochrome: '/brand/icon-mono.svg',
    light: '/brand/icon-light.svg',
  },
  horizontal: {
    dark: '/brand/horizontal-dark.svg',
    gold: '/brand/horizontal-gold.svg',
    white: '/brand/horizontal-white.svg',
    monochrome: '/brand/horizontal-mono.svg',
    light: '/brand/horizontal-light.svg',
  },
  vertical: {
    dark: '/brand/vertical-dark.svg',
    gold: '/brand/vertical-gold.svg',
    white: '/brand/vertical-white.svg',
    monochrome: '/brand/vertical-mono.svg',
    light: '/brand/vertical-light.svg',
  },
} as const

/* ─── Size maps (width in px) ─── */
const sizeMap: Record<LogoSize, number> = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
  '3xl': 140,
  '4xl': 160,
}

/* ─── Aspect ratios ─── */
const aspectMap: Record<Exclude<LogoVariant, 'icon' | 'horizontal' | 'vertical'>, number> = {
  full: 1916 / 821,      // ~2.334:1
  compact: 1536 / 1024,  // ~1.5:1
}

function getOfficialSrc(
  variant: 'full' | 'compact',
  size: LogoSize,
  customWidth?: number | string
): { src: string; srcSet?: string; sizes?: string } {
  const width = typeof customWidth === 'number' ? customWidth : sizeMap[size]
  const asset = ASSETS[variant]

  // Pick appropriate resolution based on display width
  let src: string
  if (width <= 64) src = asset.sm
  else if (width <= 128) src = asset.md
  else if (width <= 256) src = asset.lg
  else src = asset.xl

  return {
    src,
    srcSet: asset.srcSet,
    sizes: `(max-width: 64px) 64px, (max-width: 128px) 128px, (max-width: 256px) 256px, 100vw`,
  }
}

function getLegacySrc(variant: 'icon' | 'horizontal' | 'vertical', theme: LogoTheme): string {
  const themeAssets = ASSETS[variant]
  switch (theme) {
    case 'gold':
      return themeAssets.gold
    case 'white':
      return themeAssets.white
    case 'monochrome':
      return themeAssets.monochrome
    case 'light':
      return themeAssets.light
    case 'dark':
    default:
      return themeAssets.dark
  }
}

/**
 * ASCYN PRO Official Logo component.
 *
 * Uses the official transparent PNG assets for `full` and `compact` variants.
 * Legacy SVG placeholders remain for `icon`, `horizontal`, `vertical`.
 *
 * @example
 * // Default: full logo, auto-sized
 * <Logo />
 *
 * @example
 * // Compact A-mark for constrained spaces
 * <Logo variant="compact" size="sm" />
 *
 * @example
 * // Responsive: full on desktop, compact on mobile (via CSS/media queries)
 * <Logo variant="full" className="hidden sm:block" />
 * <Logo variant="compact" className="sm:hidden" />
 *
 * @example
 * // Custom dimensions
 * <Logo variant="full" width={200} />
 */
export const Logo = forwardRef<HTMLImageElement, LogoProps>(
  (
    {
      variant = 'full',
      theme = 'dark',
      size = 'md',
      width,
      height,
      className,
      decorative = false,
      'aria-label': ariaLabel,
      src: forcedSrc,
      ...props
    },
    ref
  ) => {
    const isOfficial = variant === 'full' || variant === 'compact'
    const computedWidth = width ?? sizeMap[size]

    let src: string
    let srcSet: string | undefined
    let sizes: string | undefined
    let computedHeight: number | string

    if (forcedSrc) {
      src = forcedSrc
      computedHeight = height ?? (typeof computedWidth === 'number' ? computedWidth : sizeMap[size])
    } else if (isOfficial) {
      const official = getOfficialSrc(variant, size, typeof computedWidth === 'number' ? computedWidth : undefined)
      src = official.src
      srcSet = official.srcSet
      sizes = official.sizes
      const aspect = aspectMap[variant]
      computedHeight = height ?? (typeof computedWidth === 'number' ? Math.round(computedWidth / aspect) : Math.round(sizeMap[size] / aspect))
    } else {
      // Legacy SVG
      src = getLegacySrc(variant, theme)
      const legacyAspects: Record<string, number> = {
        icon: 1,
        horizontal: 5,
        vertical: 1 / 5,
      }
      const aspect = legacyAspects[variant] ?? 5
      computedHeight = height ?? (typeof computedWidth === 'number' ? Math.round(computedWidth / aspect) : sizeMap[size])
    }

    return (
      <img
        ref={ref}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={decorative ? '' : (ariaLabel ?? 'ASCYN PRO')}
        width={computedWidth}
        height={computedHeight}
        className={cn('object-contain', className)}
        aria-hidden={decorative}
        role={decorative ? 'presentation' : 'img'}
        loading="eager"
        {...props}
      />
    )
  }
)

Logo.displayName = 'Logo'

/* ============================================
   Convenience Components
   ============================================ */

export type LogoCompactProps = Omit<LogoProps, 'variant'>

export function LogoCompact(props: LogoCompactProps) {
  return <Logo variant="compact" {...props} />
}

export type LogoIconProps = Omit<LogoProps, 'variant'>

export function LogoIcon(props: LogoIconProps) {
  return <Logo variant="icon" {...props} />
}

export type LogoHorizontalProps = Omit<LogoProps, 'variant'>

export function LogoHorizontal(props: LogoHorizontalProps) {
  return <Logo variant="horizontal" {...props} />
}

export type LogoVerticalProps = Omit<LogoProps, 'variant'>

export function LogoVertical(props: LogoVerticalProps) {
  return <Logo variant="vertical" {...props} />
}

/* ============================================
   Brand Assets (for metadata/icons)
   ============================================ */

export const brandAssets = {
  favicon: {
    ico: '/favicon.ico',
    svg: '/brand/icon-gold.svg',
  },
  appleTouchIcon: '/brand/icon-180.svg',
  ogImage: '/brand/og-image.png',
  ogImageSquare: '/brand/og-image-square.png',
  // Official transparent assets
  fullLogo: '/brand/logo-full-transparent.png',
  fullLogoSrcSet: ASSETS.full.srcSet,
  compactLogo: '/brand/logo-a-mark-transparent.png',
  compactLogoSrcSet: ASSETS.compact.srcSet,
} as const

export default Logo
