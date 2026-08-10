import React from 'react'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Switch Component
 * 
 * Accessible toggle switch with consistent styling.
 * Follows Phase 4 design system with WCAG AA compliant colors and focus states.
 * 
 * @example
 * ```tsx
 * <Switch label="Enable notifications" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
 * ```
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, size = 'md', className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const sizeStyles = {
      sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
      },
    }

    const styles = sizeStyles[size]

    return (
      <div className="flex items-start gap-3">
        <div className="relative inline-flex flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className="sr-only peer"
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              'inline-flex items-center rounded-full cursor-pointer transition-colors',
              'bg-graphite peer-checked:bg-[var(--color-brand-gold)]',
              'peer-focus:ring-2 peer-focus:ring-[var(--color-brand-gold)] peer-focus:ring-offset-2 peer-focus:ring-offset-gray-950',
              'peer-disabled:opacity-50 peer-disabled:cursor-not-allowed',
              styles.track,
              className
            )}
          >
            <span
              className={cn(
                'inline-block rounded-full bg-white transition-transform',
                'peer-checked:' + styles.translate,
                styles.thumb
              )}
            />
          </label>
        </div>
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-white cursor-pointer select-none"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-silver-gray mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
