import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

/**
 * Badge Component
 * 
 * Display status badges with consistent styling.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">At Risk</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium rounded-full border'

    const variantStyles = {
      default: 'bg-[var(--color-border-secondary)] text-light-gray border-silver-gray',
      success: 'bg-gold/20 text-gold border-gold/30',
      warning: 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30',
      error: 'bg-silver/20 text-silver border-silver/30',
      info: 'bg-silver/20 text-silver border-silver/30',
      gold: 'bg-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]/30',
    }

    const sizeStyles = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    }

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

    return (
      <span ref={ref} className={combinedClassName} {...props}>
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge
