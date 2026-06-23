'use client'

import { AreaPerformance } from '@/types'

interface AnalyticsChartsProps {
  readinessScore: number
  categoryPerformance: AreaPerformance[]
  chapterPerformance: AreaPerformance[]
  missedQuestionTrend: { date: string; count: number }[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(1, ...data.map((d) => d.value))

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400 truncate mr-2">{item.label}</span>
            <span className="text-white font-medium">{item.value}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full`}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function LineChart({ data }: { data: { date: string; count: number }[] }) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-sm">No data available.</p>
  }

  const max = Math.max(1, ...data.map((d) => d.count))
  const width = 100
  const height = 40
  const padding = 2

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - (d.count / max) * (height - padding * 2)
    return `${x},${y}`
  })

  const areaPoints = `${points[0]} ${points.join(' ')} ${width - padding},${height - padding} ${padding},${height - padding}`

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
        <polygon points={areaPoints} className="fill-red-500/10" />
        <polyline
          points={points.join(' ')}
          fill="none"
          className="stroke-red-400"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => {
          const [x, y] = p.split(',').map(Number)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1"
              className="fill-red-400"
            />
          )
        })}
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, i) => (
          <span key={i}>{formatDate(d.date)}</span>
        ))}
      </div>
    </div>
  )
}

function ReadinessGauge({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 relative">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-gray-800"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className={
              score >= 90 ? 'text-green-400' :
              score >= 80 ? 'text-yellow-400' :
              score >= 70 ? 'text-orange-400' : 'text-red-400'
            }
            strokeDasharray={`${score}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-2">Current Readiness</p>
    </div>
  )
}

export default function AnalyticsCharts({
  readinessScore,
  categoryPerformance,
  chapterPerformance,
  missedQuestionTrend,
}: AnalyticsChartsProps) {
  const categories = categoryPerformance
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((c) => ({ label: c.name, value: c.score }))

  const chapters = chapterPerformance
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((c) => ({ label: c.name, value: c.score }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Readiness Score</h3>
        <ReadinessGauge score={readinessScore} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Missed Question Trend</h3>
        <LineChart data={missedQuestionTrend} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Category Performance</h3>
        {categories.length > 0 ? (
          <BarChart data={categories} color="bg-blue-500" />
        ) : (
          <p className="text-gray-500 text-sm">Complete quizzes to see category performance.</p>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Chapter Performance</h3>
        {chapters.length > 0 ? (
          <BarChart data={chapters} color="bg-[#D4AF37]" />
        ) : (
          <p className="text-gray-500 text-sm">Complete quizzes to see chapter performance.</p>
        )}
      </div>
    </div>
  )
}
