import React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressRingProps {
  value: number // 0-100
  size?: 'sm' | 'md' | 'lg' | 'xl'
  strokeWidth?: number
  showLabel?: boolean
  label?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

/**
 * ProgressRing Component
 * 
 * Circular progress indicator with customizable size and color.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <ProgressRing value={75} size="lg" showLabel variant="success" />
 * ```
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 'md',
  strokeWidth = 4,
  showLabel = false,
  label,
  variant = 'default',
  className,
}) => {
  const percentage = Math.min(Math.max(value, 0), 100)

  const sizeMap = {
    sm: 40,
    md: 60,
    lg: 80,
    xl: 120,
  }

  const diameter = sizeMap[size]
  const radius = (diameter - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const variantColors = {
    default: 'var(--color-brand-gold)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
  }

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: diameter, height: diameter }}>
        <svg
          width={diameter}
          height={diameter}
          className="transform -rotate-90"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progress'}
        >
          {/* Background circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke="var(--color-brand-graphite)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            stroke={variantColors[variant]}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        {showLabel && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm text-silver text-center">{label}</span>
      )}
    </div>
  )
}

export default ProgressRing
