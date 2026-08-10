import React from 'react'
import { LucideIcon } from 'lucide-react'

export interface MetricCardProps {
  label: string
  value: string | number
  icon?: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  onClick?: () => void
  className?: string
}

/**
 * MetricCard Component
 * 
 * Display a key metric with optional icon, trend, and variant styling.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <MetricCard
 *   label="Total Students"
 *   value={42}
 *   icon={Users}
 *   variant="default"
 * />
 * ```
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const variantStyles = {
    default: 'text-[var(--color-brand-gold)]',
    success: 'text-gold',
    warning: 'text-warm-bronze',
    error: 'text-silver',
    info: 'text-silver',
  }

  const trendColors = {
    up: 'text-gold',
    down: 'text-silver',
    neutral: 'text-silver',
  }

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  }

  const Component = onClick ? 'button' : 'div'
  const interactiveStyles = onClick
    ? 'cursor-pointer hover:border-[var(--color-border-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:ring-offset-2 focus:ring-offset-gray-950'
    : ''

  return (
    <Component
      onClick={onClick}
      className={`bg-charcoal border border-graphite rounded-xl p-5 transition-all ${interactiveStyles} ${className}`}
      {...(onClick && { type: 'button' })}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`text-2xl font-bold ${variantStyles[variant]}`}>
            {value}
          </div>
          <div className="text-xs text-silver mt-1">{label}</div>
          {trend && (
            <div className={`text-xs mt-2 flex items-center gap-1 ${trendColors[trend.direction]}`}>
              <span>{trendIcons[trend.direction]}</span>
              <span>{Math.abs(trend.value)}%</span>
              {trend.label && <span className="text-silver-gray">• {trend.label}</span>}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`${variantStyles[variant]} opacity-50`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Component>
  )
}

export default MetricCard
