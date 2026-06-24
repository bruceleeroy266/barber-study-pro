'use client'

import { SchoolAnalyticsSnapshot } from '@/types'

interface Props {
  snapshot: SchoolAnalyticsSnapshot
}

function BarChart({ data }: { data: { label: string; count: number; colorClass: string }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 truncate mr-2">{item.label}</span>
            <span className="text-white font-medium">{item.count}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full ${item.colorClass} rounded-full`} style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function LineChart({ data, colorClass }: { data: { date: string; value: number }[]; colorClass: string }) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-sm">No data available.</p>
  }
  const max = Math.max(1, ...data.map((d) => d.value))
  const width = 100
  const height = 40
  const padding = 2
  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - (d.value / max) * (height - padding * 2)
    return `${x},${y}`
  })
  const areaPoints = `${points[0]} ${points.join(' ')} ${width - padding},${height - padding} ${padding},${height - padding}`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32" preserveAspectRatio="none">
        <polygon points={areaPoints} className={`${colorClass} opacity-10`} />
        <polyline
          points={points.join(' ')}
          fill="none"
          className={colorClass}
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => {
          const [x, y] = p.split(',').map(Number)
          return <circle key={i} cx={x} cy={y} r="1" className={colorClass} />
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{d.date.slice(5)}</span>
        ))}
      </div>
    </div>
  )
}

export default function SchoolAnalyticsCharts({ snapshot }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Grade Distribution</h3>
        <BarChart data={snapshot.gradeDistribution} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Student Risk Distribution</h3>
        <BarChart data={snapshot.riskDistribution} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Attendance Trend</h3>
        <LineChart data={snapshot.attendanceTrend} colorClass="stroke-green-400" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Readiness Trend</h3>
        <LineChart data={snapshot.readinessTrend} colorClass="stroke-[#D4AF37]" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Assessment Completion Trend</h3>
        <LineChart data={snapshot.assessmentCompletionTrend} colorClass="stroke-blue-400" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Hours Completion Trend</h3>
        <LineChart data={snapshot.hoursCompletionTrend} colorClass="stroke-purple-400" />
      </div>
    </div>
  )
}
