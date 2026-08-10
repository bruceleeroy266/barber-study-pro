import React from 'react'
import { cn } from '@/lib/utils'

export interface SectionHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

/**
 * SectionHeader Component
 * 
 * Consistent section header with title, description, and optional actions.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Recent Activity"
 *   description="Your latest updates"
 *   actions={<Button variant="ghost">View All</Button>}
 * />
 * ```
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className,
}) => {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-semibold text-white mb-1">{title}</h2>
        {description && (
          <p className="text-sm text-silver-gray">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

export default SectionHeader
