import React from 'react'

export interface ProgressBarProps {
  value: number // 0-100
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  className?: string
}

/**
 * ProgressBar Component
 * 
 * Display progress with color-coded bar and optional label.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <ProgressBar value={75} variant="success" showLabel />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant,
  size = 'md',
  showLabel = false,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  // Auto-determine variant based on percentage if not specified
  const autoVariant = variant || (
    percentage >= 80 ? 'success' :
    percentage >= 50 ? 'warning' :
    'error'
  )

  const variantStyles = {
    default: 'bg-[var(--color-brand-gold)]',
    success: 'bg-gold',
    warning: 'bg-warm-bronze',
    error: 'bg-silver',
  }

  const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-silver">{label || 'Progress'}</span>
          <span className="text-sm font-semibold text-white">{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-graphite rounded-full overflow-hidden ${sizeStyles[size]}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={`${sizeStyles[size]} ${variantStyles[autoVariant]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
