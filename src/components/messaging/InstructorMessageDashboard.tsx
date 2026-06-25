'use client'

import Link from 'next/link'
import { Mail, Bell, Megaphone, Send, User } from 'lucide-react'
import { Notification, Profile } from '@/types'
import { getThreadDisplayName, formatMessageTime } from '@/lib/messaging'
import { useMessages } from '@/hooks/useMessages'
import { useNotifications } from '@/hooks/useNotifications'
import MessageList from './MessageList'
import MessageThreadView from './MessageThread'
import NotificationCenter from './NotificationCenter'
import UnreadBadge from './UnreadBadge'

interface InstructorMessageDashboardProps {
  instructorId: string
  instructorName: string
  instructorRole: Profile['role']
  initialNotifications: Notification[]
  students: Profile[]
}

export default function InstructorMessageDashboard({
  instructorId,
  instructorName,
  instructorRole,
  initialNotifications,
  students,
}: InstructorMessageDashboardProps) {
  const {
    threads,
    selectedThread,
    selectedMessages,
    selectedThreadId,
    unreadCount,
    selectThread,
    sendReply,
  } = useMessages({ userId: instructorId, userName: instructorName, userRole: instructorRole })

  const {
    notifications,
    unreadCount: unreadNotificationCount,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications({ initialNotifications })

  const threadsNeedingResponse = threads.filter((thread) => thread.unreadCount > 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Instructor Messaging</h1>
          <p className="text-gray-400">Manage student conversations, announcements, and alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/instructor/messages/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] transition-colors"
          >
            <Send className="w-4 h-4" />
            New Message
          </Link>
          <button
            type="button"
            disabled
            title="Announcements are coming soon"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/60 text-gray-400 font-medium rounded-lg cursor-not-allowed border border-gray-700/50"
          >
            <Megaphone className="w-4 h-4" />
            Announcement
            <span className="ml-1 text-[10px] uppercase tracking-wide text-gray-500">Soon</span>
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-2xl font-bold text-white">{threads.length}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Active Conversations</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-400" />
            <UnreadBadge count={unreadCount} className="!text-sm" />
          </div>
          <div className="text-xs text-gray-400 mt-1">Unread Messages</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <span className="text-2xl font-bold text-white">{students.length}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Students</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <span className="text-2xl font-bold text-white">{unreadNotificationCount}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Unread Alerts</div>
        </div>
      </div>

      {/* Messages requiring response */}
      {threadsNeedingResponse.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-400" />
              Messages Requiring Response
            </h2>
          </div>
          <ul className="divide-y divide-gray-800">
            {threadsNeedingResponse.map((thread) => (
              <li key={thread.id}>
                <button
                  onClick={() => selectThread(thread.id)}
                  className="w-full text-left p-4 hover:bg-gray-800/50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-white">{getThreadDisplayName(thread, instructorId)}</p>
                    <p className="text-sm text-gray-400">{thread.subject}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{formatMessageTime(thread.lastMessageAt)}</span>
                    <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {thread.unreadCount}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main messaging area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        <div className="lg:col-span-2 h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            <div className="md:col-span-1 h-full min-h-[250px]">
              <MessageList
                threads={threads}
                selectedThreadId={selectedThreadId}
                currentUserId={instructorId}
                onSelectThread={selectThread}
              />
            </div>
            <div className="md:col-span-2 h-full min-h-[300px]">
              {selectedThread ? (
                <MessageThreadView
                  thread={selectedThread}
                  messages={selectedMessages}
                  currentUserId={instructorId}
                  onSendReply={(body) => sendReply(selectedThread.id, body)}
                />
              ) : (
                <div className="h-full bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm">Choose a student thread to view and reply</p>
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

      {/* Quick student list */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Quick Message Students</h2>
        </div>
        <div className="p-4 flex flex-wrap gap-2">
          {students.slice(0, 8).map((student) => (
            <Link
              key={student.id}
              href={`/instructor/messages/new?to=${student.id}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors"
            >
              <User className="w-3 h-3" />
              {student.full_name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
