'use client'

import { useState, useMemo, useCallback } from 'react'
import { Notification, NotificationPriority, NotificationType } from '@/types'

interface UseNotificationsOptions {
  initialNotifications: Notification[]
}

export function useNotifications({ initialNotifications }: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<'all' | NotificationType | NotificationPriority>('all')

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const filteredNotifications = useMemo(() => {
    if (filter === 'all') return notifications
    const isPriority = ['low', 'medium', 'high', 'urgent'].includes(filter)
    return notifications.filter((n) =>
      isPriority ? n.priority === filter : n.type === filter
    )
  }, [notifications, filter])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }, [])

  const groupedNotifications = useMemo(() => {
    const groups: Record<string, Notification[]> = {}
    filteredNotifications.forEach((n) => {
      const key = n.type
      groups[key] = groups[key] || []
      groups[key].push(n)
    })
    return groups
  }, [filteredNotifications])

  return {
    notifications: filteredNotifications,
    groupedNotifications,
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  }
}
