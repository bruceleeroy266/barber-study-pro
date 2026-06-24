'use client'

import Link from 'next/link'
import { Bell, Check, X, Filter } from 'lucide-react'
import { Notification, NotificationPriority, NotificationType } from '@/types'
import { formatMessageTime, priorityColorClasses } from '@/lib/messaging'

interface NotificationCenterProps {
  notifications: Notification[]
  unreadCount: number
  filter: string
  onFilterChange: (filter: 'all' | NotificationType | NotificationPriority) => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDismiss: (id: string) => void
}

const FILTER_OPTIONS: { value: 'all' | NotificationType | NotificationPriority; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'attendance_alert', label: 'Attendance' },
  { value: 'board_readiness', label: 'Readiness' },
  { value: 'message', label: 'Messages' },
]

export default function NotificationCenter({
  notifications,
  unreadCount,
  filter,
  onFilterChange,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss,
}: NotificationCenterProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-[#D4AF37] hover:text-[#F4E4A6] font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === option.value
                  ? 'bg-[#D4AF37] text-gray-950'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-10 h-10 mx-auto mb-3 text-gray-600" />
            <p>No notifications to display.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 transition-colors ${
                  notification.read ? 'bg-gray-900/50' : 'bg-gray-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColorClasses(
                          notification.priority
                        )}`}
                      >
                        {notification.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatMessageTime(notification.createdAt)}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <h3 className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{notification.body}</p>
                    {notification.actionUrl && (
                      <Link
                        href={notification.actionUrl}
                        className="inline-block mt-2 text-xs text-[#D4AF37] hover:text-[#F4E4A6]"
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        View details →
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                        aria-label="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDismiss(notification.id)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                      aria-label="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
