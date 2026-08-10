'use client'

import { ComplianceAlert } from '@/types'
import { AlertTriangle, Clock, ClipboardCheck, Wrench, Target, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react'

interface Props {
  alerts: ComplianceAlert[]
  maxItems?: number
}

const alertIcons: Record<string, React.ElementType> = {
  low_attendance: Clock,
  missing_hours: Clock,
  missing_assessments: ClipboardCheck,
  missing_practicals: Wrench,
  low_readiness: Target,
  graduation_risk: GraduationCap,
  board_eligible: CheckCircle,
  low_grade: AlertCircle,
}

const alertColors: Record<string, string> = {
  low_attendance: 'text-warm-bronze bg-warm-bronze/10 border-warm-bronze/20',
  missing_hours: 'text-silver bg-silver/10 border-silver/20',
  missing_assessments: 'text-silver bg-silver/10 border-silver/20',
  missing_practicals: 'text-warm-bronze bg-warm-bronze/10 border-warm-bronze/20',
  low_readiness: 'text-silver bg-silver/10 border-silver/20',
  graduation_risk: 'text-silver bg-silver/10 border-silver/20',
  board_eligible: 'text-gold bg-gold/10 border-gold/20',
  low_grade: 'text-silver bg-silver/10 border-silver/20',
}

export default function ComplianceAlertsPanel({ alerts, maxItems = 50 }: Props) {
  const display = alerts.slice(0, maxItems)

  return (
    <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
      <div className="p-4 border-b border-graphite flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Compliance Alerts</h2>
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
                </div>
              </div>
            </div>
          )
        })}
        {display.length === 0 && (
          <div className="p-8 text-center text-silver-gray">No compliance alerts.</div>
        )}
      </div>
    </div>
  )
}
