'use client'

import { SchoolOverviewMetrics as Metrics } from '@/types'
import { Users, UserCheck, GraduationCap, AlertTriangle, CalendarCheck, Target, Calculator, Clock, Hourglass, ClipboardCheck } from 'lucide-react'

interface Props {
  metrics: Metrics
}

function MetricCard({ label, value, subtext, icon: Icon, colorClass }: {
  label: string
  value: string | number
  subtext?: string
  icon: React.ElementType
  colorClass: string
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/20 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
      </div>
    </div>
  )
}

export default function SchoolOverviewMetrics({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <MetricCard
        label="Total Students"
        value={metrics.totalStudents}
        subtext={`${metrics.activeStudents} active`}
        icon={Users}
        colorClass="text-blue-400"
      />
      <MetricCard
        label="At-Risk Students"
        value={metrics.atRiskStudents}
        subtext={`${metrics.graduatedStudents} graduated`}
        icon={AlertTriangle}
        colorClass="text-red-400"
      />
      <MetricCard
        label="Avg Attendance"
        value={`${metrics.averageAttendance}%`}
        icon={CalendarCheck}
        colorClass="text-green-400"
      />
      <MetricCard
        label="Avg Readiness"
        value={metrics.averageReadiness}
        icon={Target}
        colorClass="text-[#D4AF37]"
      />
      <MetricCard
        label="Avg Grade"
        value={`${metrics.averageGrade}%`}
        icon={Calculator}
        colorClass="text-purple-400"
      />
      <MetricCard
        label="Completed Hours"
        value={metrics.completedHours}
        icon={Clock}
        colorClass="text-cyan-400"
      />
      <MetricCard
        label="Remaining Hours"
        value={metrics.remainingHours}
        icon={Hourglass}
        colorClass="text-orange-400"
      />
      <MetricCard
        label="Assessment Completion"
        value={`${metrics.assessmentCompletionRate}%`}
        icon={ClipboardCheck}
        colorClass="text-pink-400"
      />
      <MetricCard
        label="Active Students"
        value={metrics.activeStudents}
        icon={UserCheck}
        colorClass="text-emerald-400"
      />
      <MetricCard
        label="Graduated"
        value={metrics.graduatedStudents}
        icon={GraduationCap}
        colorClass="text-indigo-400"
      />
    </div>
  )
}
