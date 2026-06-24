'use client'

import { Profile } from '@/types'
import { useMessages } from '@/hooks/useMessages'
import MessageList from './MessageList'
import MessageThread from './MessageThread'
import NotificationCenter from './NotificationCenter'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification } from '@/types'
import UnreadBadge from './UnreadBadge'

interface MessageCenterProps {
  userId: string
  userName: string
  userRole: Profile['role']
  initialNotifications: Notification[]
}

export default function MessageCenter({
  userId,
  userName,
  userRole,
  initialNotifications,
}: MessageCenterProps) {
  const {
    threads,
    selectedThread,
    selectedMessages,
    selectedThreadId,
    unreadCount,
    selectThread,
    sendReply,
  } = useMessages({ userId, userName, userRole })

  const {
    notifications,
    unreadCount: unreadNotificationCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications({ initialNotifications })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Messages</h1>
          <p className="text-gray-400">Stay connected with your instructor and classmates</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-sm text-gray-400">Unread</span>
            <UnreadBadge count={unreadCount + unreadNotificationCount} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        <div className="lg:col-span-2 h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className="md:col-span-1 h-full min-h-[250px]">
              <MessageList
                threads={threads}
                selectedThreadId={selectedThreadId}
                currentUserId={userId}
                onSelectThread={selectThread}
              />
            </div>
            <div className="md:col-span-2 h-full min-h-[300px]">
              {selectedThread ? (
                <MessageThread
                  thread={selectedThread}
                  messages={selectedMessages}
                  currentUserId={userId}
                  onSendReply={(body) => sendReply(selectedThread.id, body)}
                />
              ) : (
                <div className="h-full bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a thread from the list to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-full overflow-hidden">
          <NotificationCenter
            notifications={notifications}
            unreadCount={unreadNotificationCount}
            filter={filter}
            onFilterChange={setFilter}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDismiss={dismissNotification}
          />
        </div>
      </div>
    </div>
  )
}
