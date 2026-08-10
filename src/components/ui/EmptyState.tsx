import React from 'react'
import Link from 'next/link'

export interface EmptyStateAction {
  label: string
  href: string
}

export interface EmptyStateProps {
  title: string
  description?: string
  action?: EmptyStateAction | React.ReactNode
  icon?: React.ReactNode | string
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  const renderAction = () => {
    if (!action) return null
    
    // Check if action is an EmptyStateAction object
    if (typeof action === 'object' && 'label' in action && 'href' in action) {
      const actionObj = action as EmptyStateAction
      return (
        <Link
          href={actionObj.href}
          className="inline-flex items-center justify-center px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-brand-gold)] text-[var(--color-brand-black)] font-medium hover:bg-[var(--color-brand-gold-light)] transition-colors"
        >
          {actionObj.label}
        </Link>
      )
    }
    
    // Otherwise render as React node
    return action
  }

  const renderIcon = () => {
    if (!icon) return null
    
    if (typeof icon === 'string') {
      return <span className="text-4xl mb-4">{icon}</span>
    }
    
    return (
      <div className="mb-4 text-[var(--color-text-muted)]">
        {icon}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {renderIcon()}
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {renderAction()}
        </div>
      )}
    </div>
  )
}

export default EmptyState
