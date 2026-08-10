import { NotificationPriority } from '@/types'

export function formatMessageTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatFullTimestamp(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatPreviewText(body: string, maxLength = 80): string {
  const trimmed = body.replace(/\s+/g, ' ').trim()
  if (trimmed.length <= maxLength) return trimmed
  return `${trimmed.slice(0, maxLength)}…`
}

export function priorityColorClasses(priority: NotificationPriority): string {
  switch (priority) {
    case 'urgent':
      return 'bg-silver/20 text-silver border-silver/30'
    case 'high':
      return 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30'
    case 'medium':
      return 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30'
    case 'low':
    default:
      return 'bg-[var(--color-border-secondary)] text-light-gray border-silver-gray'
  }
}

export function priorityDotClass(priority: NotificationPriority): string {
  switch (priority) {
    case 'urgent':
      return 'bg-silver'
    case 'high':
      return 'bg-warm-bronze'
    case 'medium':
      return 'bg-warm-bronze'
    case 'low':
    default:
      return 'bg-silver-gray'
  }
}
