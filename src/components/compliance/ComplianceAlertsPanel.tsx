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
  low_attendance: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  missing_hours: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  missing_assessments: 'text-red-400 bg-red-500/10 border-red-500/20',
  missing_practicals: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  low_readiness: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  graduation_risk: 'text-red-400 bg-red-500/10 border-red-500/20',
  board_eligible: 'text-green-400 bg-green-500/10 border-green-500/20',
  low_grade: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
}

export default function ComplianceAlertsPanel({ alerts, maxItems = 50 }: Props) {
  const display = alerts.slice(0, maxItems)

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Compliance Alerts</h2>
        <span className="text-xs text-gray-500">{alerts.length} total</span>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {display.map((alert) => {
          const Icon = alertIcons[alert.type] || AlertTriangle
          return (
            <div
              key={alert.id}
              className="p-4 border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
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
                          ? 'bg-red-500/20 text-red-400'
                          : alert.priority === 'high'
                          ? 'bg-orange-500/20 text-orange-400'
                          : alert.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{alert.description}</p>
                </div>
              </div>
            </div>
          )
        })}
        {display.length === 0 && (
          <div className="p-8 text-center text-gray-500">No compliance alerts.</div>
        )}
      </div>
    </div>
  )
}
