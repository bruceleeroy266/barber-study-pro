/**
 * ASCYN PRO Design Tokens
 * BL-002 — Token Migration
 * 
 * Centralized design tokens that reference CSS custom properties.
 * All values trace to BL-001 design token foundation.
 * 
 * @see docs/design/TOKEN_ARCHITECTURE.md
 */

// CSS Variable References
const cssVar = (name: string) => `var(--${name})`

export const colors = {
  // Brand Colors — BL-001 Approved Palette
  brand: {
    gold: cssVar('color-brand-gold'),
    goldLight: cssVar('color-brand-gold-light'),
    goldDark: cssVar('color-brand-gold'), // Use gold, darker variant not in BL-001
    black: cssVar('color-brand-black'),
    white: cssVar('color-brand-white'),
  },

  // Semantic Colors — BL-001 Functional Mappings
  semantic: {
    success: {
      light: cssVar('color-success'),
      DEFAULT: cssVar('color-success'),
      dark: cssVar('color-success'),
      bg: cssVar('color-success-bg'),
      border: cssVar('color-success-border'),
    },
    warning: {
      light: cssVar('color-warning'),
      DEFAULT: cssVar('color-warning'),
      dark: cssVar('color-warning'),
      bg: cssVar('color-warning-bg'),
      border: cssVar('color-warning-border'),
    },
    error: {
      light: cssVar('color-error'),
      DEFAULT: cssVar('color-error'),
      dark: cssVar('color-error'),
      bg: cssVar('color-error-bg'),
      border: cssVar('color-error-border'),
    },
    info: {
      light: cssVar('color-info'),
      DEFAULT: cssVar('color-info'),
      dark: cssVar('color-info'),
      bg: cssVar('color-info-bg'),
      border: cssVar('color-info-border'),
    },
  },

  // Neutral Colors — BL-001 Approved Scale
  neutral: {
    50: cssVar('color-brand-off-white'),
    100: cssVar('color-brand-light-gray'),
    200: cssVar('color-brand-light-gray'),
    300: cssVar('color-brand-silver'),
    400: cssVar('color-brand-silver-gray'),
    500: cssVar('color-brand-silver-gray'),
    600: cssVar('color-brand-graphite'),
    700: cssVar('color-brand-graphite'),
    800: cssVar('color-brand-charcoal'),
    900: cssVar('color-brand-charcoal'),
    950: cssVar('color-brand-black'),
  },

  // Text Colors — BL-001 Semantic
  text: {
    primary: cssVar('color-text-primary'),
    secondary: cssVar('color-text-secondary'),
    tertiary: cssVar('color-text-muted'),
    disabled: cssVar('color-text-muted'),
    inverse: cssVar('color-text-inverse'),
  },

  // Background Colors — BL-001 Semantic
  background: {
    primary: cssVar('color-background-primary'),
    secondary: cssVar('color-background-secondary'),
    tertiary: cssVar('color-background-tertiary'),
    elevated: cssVar('color-surface-elevated'),
  },

  // Border Colors — BL-001 Semantic
  border: {
    DEFAULT: cssVar('color-border-primary'),
    light: cssVar('color-border-secondary'),
    dark: cssVar('color-border-muted'),
  },
} as const

export const typography = {
  // Font Families — BL-001
  fontFamily: {
    sans: cssVar('font-family-sans'),
    mono: cssVar('font-family-mono'),
  },

  // Font Sizes — BL-001 (mobile base)
  fontSize: {
    xs: cssVar('font-size-caption'),
    sm: cssVar('font-size-body-sm'),
    base: cssVar('font-size-body'),
    lg: cssVar('font-size-body-lg'),
    xl: cssVar('font-size-h4'),
    '2xl': cssVar('font-size-h3'),
    '3xl': cssVar('font-size-h2'),
    '4xl': cssVar('font-size-h1'),
  },

  // Font Weights — BL-001
  fontWeight: {
    normal: cssVar('font-weight-regular'),
    medium: cssVar('font-weight-medium'),
    semibold: cssVar('font-weight-semibold'),
    bold: cssVar('font-weight-bold'),
  },

  // Line Heights — BL-001
  lineHeight: {
    tight: cssVar('line-height-tight'),
    normal: cssVar('line-height-body'),
    relaxed: cssVar('line-height-body-lg'),
  },
} as const

export const spacing = {
  // Spacing Scale — BL-001 (4px base unit)
  0: cssVar('spacing-0'),
  1: cssVar('spacing-1'),
  2: cssVar('spacing-2'),
  3: cssVar('spacing-3'),
  4: cssVar('spacing-4'),
  5: cssVar('spacing-5'),
  6: cssVar('spacing-6'),
  8: cssVar('spacing-8'),
  10: cssVar('spacing-10'),
  12: cssVar('spacing-12'),
  16: cssVar('spacing-16'),
  20: cssVar('spacing-20'),
  24: cssVar('spacing-24'),
  32: cssVar('spacing-32'),
} as const

export const borderRadius = {
  none: cssVar('radius-none'),
  sm: cssVar('radius-sm'),
  DEFAULT: cssVar('radius-md'),
  md: cssVar('radius-md'),
  lg: cssVar('radius-lg'),
  xl: cssVar('radius-xl'),
  '2xl': cssVar('radius-2xl'),
  full: cssVar('radius-full'),
} as const

export const shadows = {
  sm: cssVar('shadow-sm'),
  DEFAULT: cssVar('shadow-md'),
  md: cssVar('shadow-md'),
  lg: cssVar('shadow-lg'),
  xl: cssVar('shadow-xl'),
  '2xl': cssVar('shadow-2xl'),
  gold: cssVar('shadow-gold'),
  inner: cssVar('shadow-inner'),
} as const

export const transitions = {
  fast: `${cssVar('duration-fast')} ${cssVar('ease-default')}`,
  DEFAULT: `${cssVar('duration-normal')} ${cssVar('ease-default')}`,
  slow: `${cssVar('duration-slow')} ${cssVar('ease-default')}`,
} as const

export const zIndex = {
  base: cssVar('z-base'),
  dropdown: cssVar('z-dropdown'),
  sticky: cssVar('z-sticky'),
  fixed: cssVar('z-fixed'),
  modalBackdrop: cssVar('z-modal-backdrop'),
  modal: cssVar('z-modal'),
  popover: cssVar('z-popover'),
  tooltip: cssVar('z-tooltip'),
  skipLink: cssVar('z-skip-link'),
} as const

// Accessibility — BL-001
export const a11y = {
  // Focus ring
  focusRing: `0 0 0 3px ${cssVar('color-border-accent')}`,
  
  // Minimum touch target size (44x44px per WCAG)
  minTouchTarget: '44px',
  
  // Contrast ratios (WCAG AA)
  contrast: {
    normalText: 4.5,
    largeText: 3,
    interactive: 3,
  },
} as const

// Breakpoints (mobile-first) — standard values
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// Component-specific tokens — reference CSS vars
export const components = {
  card: {
    bg: cssVar('color-surface-primary'),
    border: cssVar('color-border-primary'),
    borderRadius: cssVar('radius-lg'),
    padding: cssVar('spacing-6'),
  },
  
  button: {
    borderRadius: cssVar('radius-md'),
    padding: {
      sm: `${cssVar('spacing-2')} ${cssVar('spacing-3')}`,
      md: `${cssVar('spacing-2')} ${cssVar('spacing-4')}`,
      lg: `${cssVar('spacing-3')} ${cssVar('spacing-6')}`,
    },
    fontSize: {
      sm: cssVar('font-size-body-sm'),
      md: cssVar('font-size-body'),
      lg: cssVar('font-size-body-lg'),
    },
  },
  
  input: {
    bg: cssVar('color-background-tertiary'),
    border: cssVar('color-border-primary'),
    borderRadius: cssVar('radius-md'),
    padding: `${cssVar('spacing-2')} ${cssVar('spacing-3')}`,
  },
  
  table: {
    headerBg: cssVar('color-background-tertiary'),
    rowHoverBg: cssVar('color-background-tertiary'),
    borderColor: cssVar('color-border-primary'),
  },
} as const

// Export all tokens as a single object
export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  a11y,
  breakpoints,
  components,
} as const

export default tokens
