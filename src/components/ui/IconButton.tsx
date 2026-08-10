import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  'aria-label': string
}

/**
 * IconButton Component
 * 
 * Accessible icon-only button with consistent styling.
 * Follows Phase 4 design system with WCAG AA compliant colors and focus states.
 * 
 * @example
 * ```tsx
 * <IconButton icon={Plus} variant="primary" aria-label="Add item" onClick={() => {}} />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon: Icon,
      variant = 'ghost',
      size = 'md',
      loading = false,
      disabled,
      className,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantStyles = {
      primary: 'bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-light)] text-black focus:ring-[var(--color-brand-gold)]',
      secondary: 'bg-[var(--color-border-secondary)] hover:bg-silver-gray text-white focus:ring-silver-gray',
      ghost: 'bg-transparent hover:bg-graphite text-light-gray hover:text-white focus:ring-silver-gray',
      outline: 'bg-transparent border-2 border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 focus:ring-[var(--color-brand-gold)]',
    }

    const sizeStyles = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    }

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        {...props}
      >
        {loading ? (
          <svg
            className={cn('animate-spin', iconSizes[size])}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <Icon className={iconSizes[size]} aria-hidden="true" />
        )}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'

export default IconButton
