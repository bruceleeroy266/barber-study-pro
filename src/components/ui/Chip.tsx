import React from 'react'
import { cn } from '@/lib/utils'

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  onRemove?: () => void
  children: React.ReactNode
}

/**
 * Chip Component
 * 
 * Display compact status indicators or tags with optional remove action.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <Chip variant="success" onRemove={() => {}}>Active</Chip>
 * ```
 */
export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ variant = 'default', size = 'md', onRemove, className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1 font-medium rounded-full border'

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

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] rounded-full"
            aria-label="Remove"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </span>
    )
  }
)

Chip.displayName = 'Chip'

export default Chip
