'use client'

import { SchoolOwnerAlert } from '@/types'
import { AlertTriangle, Target, Clock, ClipboardCheck, Bell, AlertCircle } from 'lucide-react'

interface Props {
  alerts: SchoolOwnerAlert[]
  maxItems?: number
}

const alertIcons: Record<string, React.ElementType> = {
  low_attendance: Clock,
  low_readiness: Target,
  missing_hours: AlertCircle,
  failed_assessment: ClipboardCheck,
  unread_notification: Bell,
}

const alertColors: Record<string, string> = {
  low_attendance: 'text-warm-bronze bg-warm-bronze/10 border-warm-bronze/20',
  low_readiness: 'text-warm-bronze bg-warm-bronze/10 border-warm-bronze/20',
  missing_hours: 'text-silver bg-silver/10 border-silver/20',
  failed_assessment: 'text-silver bg-silver/10 border-silver/20',
  unread_notification: 'text-silver bg-silver/10 border-silver/20',
}

export default function AlertsCenter({ alerts, maxItems = 50 }: Props) {
  const display = alerts.slice(0, maxItems)

  return (
    <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
      <div className="p-4 border-b border-graphite flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[var(--color-brand-gold)]" />
          Alerts Center
        </h2>
        <span className="text-xs text-silver-gray">{alerts.length} total</span>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {display.map((alert) => {
          const Icon = alertIcons[alert.type] || AlertTriangle
          return (
            <div
              key={alert.id}
              className="p-4 border-b border-graphite hover:bg-graphite/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg border ${alertColors[alert.type] || alertColors.low_readiness}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-white">{alert.title}</p>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${
                        alert.priority === 'urgent'
                          ? 'bg-silver/20 text-silver'
                          : alert.priority === 'high'
                          ? 'bg-warm-bronze/20 text-warm-bronze'
                          : alert.priority === 'medium'
                          ? 'bg-warm-bronze/20 text-warm-bronze'
                          : 'bg-[var(--color-border-secondary)] text-light-gray'
                      }`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                  <p className="text-sm text-silver truncate">{alert.description}</p>
                  {alert.studentName && (
                    <p className="text-xs text-silver-gray mt-1">Student: {alert.studentName}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {display.length === 0 && (
          <div className="p-8 text-center text-silver-gray">
            No active alerts. School is on track.
          </div>
        )}
      </div>
    </div>
  )
}
