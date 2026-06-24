'use client'

import { useState } from 'react'
import { Megaphone, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Announcement } from '@/types'
import { formatFullTimestamp, priorityColorClasses } from '@/lib/messaging'

interface AnnouncementBannerProps {
  announcements: Announcement[]
  showControls?: boolean
}

export default function AnnouncementBanner({
  announcements,
  showControls = true,
}: AnnouncementBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || announcements.length === 0) return null

  const current = announcements[currentIndex]

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={`rounded-xl border p-4 ${priorityColorClasses(current.priority)}`}>
      <div className="flex items-start gap-3">
        <Megaphone className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold">{current.title}</h3>
            <span className="text-xs opacity-80">
              {formatFullTimestamp(current.createdAt)}
            </span>
          </div>
          <p className="text-sm mt-1 opacity-90">{current.body}</p>
          <p className="text-xs mt-2 opacity-70">
            Posted by {current.authorName}
            {current.expiresAt && ` · Expires ${formatFullTimestamp(current.expiresAt)}`}
          </p>
        </div>

        {showControls && announcements.length > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrev}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Previous announcement"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs px-1.5">
              {currentIndex + 1}/{announcements.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Next announcement"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/10 rounded transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
