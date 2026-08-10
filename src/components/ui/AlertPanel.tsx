import React from 'react'
import { LucideIcon, AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'

export interface AlertPanelProps {
  title: string
  description?: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  icon?: LucideIcon
  dismissible?: boolean
  onDismiss?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  children?: React.ReactNode
  className?: string
}

const defaultIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

/**
 * AlertPanel Component
 * 
 * Display alerts, notifications, and important messages with consistent styling.
 * Follows Phase 4 design system with WCAG AA compliant colors.
 * 
 * @example
 * ```tsx
 * <AlertPanel
 *   title="At-Risk Students"
 *   description="5 students need attention"
 *   variant="warning"
 *   action={{ label: "View", onClick: () => {} }}
 * />
 * ```
 */
export const AlertPanel: React.FC<AlertPanelProps> = ({
  title,
  description,
  variant = 'info',
  icon,
  dismissible = false,
  onDismiss,
  action,
  children,
  className = '',
}) => {
  const Icon = icon || defaultIcons[variant]

  const variantStyles = {
    info: {
      container: 'bg-silver/10 border-silver/30',
      icon: 'text-silver',
      title: 'text-silver',
      text: 'text-silver',
    },
    success: {
      container: 'bg-gold/10 border-gold/30',
      icon: 'text-gold',
      title: 'text-gold',
      text: 'text-gold-light',
    },
    warning: {
      container: 'bg-warm-bronze/10 border-warm-bronze/30',
      icon: 'text-warm-bronze',
      title: 'text-warm-bronze',
      text: 'text-warm-bronze',
    },
    error: {
      container: 'bg-silver/10 border-silver/30',
      icon: 'text-silver',
      title: 'text-silver',
      text: 'text-silver',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div
      className={`border rounded-xl p-4 ${styles.container} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold ${styles.title}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-sm mt-1 ${styles.text}`}>
              {description}
            </p>
          )}
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={`mt-3 text-sm font-medium ${styles.title} hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 rounded`}
            >
              {action.label} →
            </button>
          )}
        </div>

        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ${styles.icon} hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 rounded`}
            aria-label="Dismiss alert"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default AlertPanel
