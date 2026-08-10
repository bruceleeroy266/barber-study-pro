import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  image?: React.ReactNode
  className?: string
}

/**
 * Hero Component
 * 
 * Large promotional section for landing pages and marketing content.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <Hero
 *   title="Welcome to ASCYN PRO"
 *   subtitle="Elevate. Learn. Succeed."
 *   description="AI-powered licensing education platform"
 *   primaryAction={{ label: "Get Started", onClick: () => {} }}
 *   secondaryAction={{ label: "Learn More", onClick: () => {} }}
 * />
 * ```
 */
export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  image,
  className,
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            {subtitle && (
              <p className="text-sm font-semibold text-[var(--color-brand-gold)] uppercase tracking-wide mb-4">
                {subtitle}
              </p>
            )}
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-silver mb-8 leading-relaxed">
                {description}
              </p>
            )}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-wrap gap-4">
                {primaryAction && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={primaryAction.onClick}
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={secondaryAction.onClick}
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>
          {image && (
            <div className="relative">
              {image}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hero
