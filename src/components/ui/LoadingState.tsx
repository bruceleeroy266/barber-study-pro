import React from 'react'

export interface LoadingStateProps {
  variant?: 'card' | 'table' | 'list' | 'text'
  count?: number
  className?: string
}

/**
 * LoadingState Component
 * 
 * Display loading skeletons for different content types.
 * Follows Phase 4 design system.
 * 
 * @example
 * ```tsx
 * <LoadingState variant="card" count={3} />
 * ```
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="bg-charcoal border border-graphite rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-graphite rounded w-1/3 mb-4" />
            <div className="h-4 bg-graphite rounded w-2/3 mb-2" />
            <div className="h-4 bg-graphite rounded w-1/2" />
          </div>
        )
      
      case 'table':
        return (
          <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden animate-pulse">
            <div className="p-4 border-b border-graphite">
              <div className="h-5 bg-graphite rounded w-1/4" />
            </div>
            <div className="divide-y divide-graphite">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 bg-graphite rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-graphite rounded w-1/3" />
                    <div className="h-3 bg-graphite rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'list':
        return (
          <div className="space-y-3 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-12 w-12 bg-graphite rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-graphite rounded w-3/4" />
                  <div className="h-3 bg-graphite rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-graphite rounded w-full" />
            <div className="h-4 bg-graphite rounded w-5/6" />
            <div className="h-4 bg-graphite rounded w-4/6" />
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className={i > 0 ? 'mt-4' : ''}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  )
}

export default LoadingState
