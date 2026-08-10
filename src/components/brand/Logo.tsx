import { forwardRef, HTMLAttributes, ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/* ============================================
   Logo Component Library
   ============================================
   Centralized brand asset system for ASCYN PRO.
   Supports all logo variants, themes, and sizes.
   ============================================ */

export type LogoVariant = 'full' | 'icon' | 'horizontal' | 'vertical'
export type LogoTheme = 'light' | 'dark' | 'gold' | 'white' | 'monochrome'
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface LogoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Logo layout variant */
  variant?: LogoVariant
  /** Color theme */
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
}

const sizeMap: Record<LogoSize, { width: number; height: number }> = {
  xs: { width: 24, height: 24 },
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
  xl: { width: 64, height: 64 },
  '2xl': { width: 96, height: 96 },
}

const variantAspectMap: Record<LogoVariant, number> = {
  full: 200 / 40,      // 5:1 horizontal
  icon: 1,             // 1:1 square
  horizontal: 200 / 40, // 5:1
  vertical: 40 / 200,  // 1:5 (stacked)
}

function getLogoSrc(variant: LogoVariant, theme: LogoTheme): string {
  const base = '/brand'
  
  if (variant === 'icon') {
    switch (theme) {
      case 'gold':
        return `${base}/icon-gold.svg`
      case 'white':
        return `${base}/icon-white.svg`
      case 'monochrome':
        return `${base}/icon-mono.svg`
      case 'light':
        return `${base}/icon-light.svg`
      case 'dark':
      default:
        return `${base}/icon-dark.svg`
    }
  }
  
  if (variant === 'vertical') {
    switch (theme) {
      case 'gold':
        return `${base}/vertical-gold.svg`
      case 'white':
        return `${base}/vertical-white.svg`
      case 'monochrome':
        return `${base}/vertical-mono.svg`
      case 'light':
        return `${base}/vertical-light.svg`
      case 'dark':
      default:
        return `${base}/vertical-dark.svg`
    }
  }
  
  // full / horizontal
  switch (theme) {
    case 'gold':
      return `${base}/horizontal-gold.svg`
    case 'white':
      return `${base}/horizontal-white.svg`
    case 'monochrome':
      return `${base}/horizontal-mono.svg`
    case 'light':
      return `${base}/horizontal-light.svg`
    case 'dark':
    default:
      return `${base}/horizontal-dark.svg`
  }
}

/**
 * ASCYN PRO Logo component.
 * 
 * @example
 * // Default horizontal dark theme
 * <Logo />
 * 
 * @example
 * // Icon only, gold theme, large
 * <Logo variant="icon" theme="gold" size="lg" />
 * 
 * @example
 * // Custom dimensions
 * <Logo variant="full" width={160} height={32} />
 */
export const Logo = forwardRef<HTMLImageElement, LogoProps>(
  (
    {
      variant = 'horizontal',
      theme = 'dark',
      size = 'md',
      width,
      height,
      className,
      decorative = false,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const src = getLogoSrc(variant, theme)
    const defaultSize = sizeMap[size]
    const aspect = variantAspectMap[variant]
    
    const computedWidth = width ?? defaultSize.width
    const computedHeight = height ?? (typeof computedWidth === 'number' 
      ? Math.round(computedWidth / aspect) 
      : defaultSize.height)

    return (
      <img
        ref={ref}
        src={src}
        alt={decorative ? '' : (ariaLabel ?? 'ASCYN PRO')}
        width={computedWidth}
        height={computedHeight}
        className={cn('object-contain', className)}
        aria-hidden={decorative}
        role={decorative ? 'presentation' : 'img'}
        {...props}
      />
    )
  }
)

Logo.displayName = 'Logo'

/* ============================================
   Convenience Components
   ============================================ */

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
  appleTouchIcon: '/brand/apple-touch-icon.png',
  ogImage: '/brand/og-image.png',
  ogImageSquare: '/brand/og-image-square.png',
} as const

export default Logo
