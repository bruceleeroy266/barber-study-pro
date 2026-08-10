import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'

export interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'highlighted'
  className?: string
}

/**
 * FeatureCard Component
 * 
 * Display a feature or benefit with icon, title, and description.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={Zap}
 *   title="Fast Performance"
 *   description="Lightning-fast load times"
 *   action={{ label: "Learn More", onClick: () => {} }}
 * />
 * ```
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className,
}) => {
  return (
    <Card
      variant={variant === 'highlighted' ? 'elevated' : 'default'}
      padding="lg"
      hover={!!action}
      className={cn('h-full', className)}
    >
      <CardContent>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[var(--color-brand-gold)]/10 mb-4">
            <Icon className="w-6 h-6 text-[var(--color-brand-gold)]" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-silver flex-1">{description}</p>
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="mt-4 text-sm font-medium text-[var(--color-brand-gold)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] rounded self-start"
            >
              {action.label} →
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FeatureCard
