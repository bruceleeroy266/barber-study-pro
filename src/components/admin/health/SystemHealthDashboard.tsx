'use client'

import { useState, useTransition } from 'react'
import type { DiagnosticReport, DiagnosticCheck, DiagnosticStatus } from '@/lib/diagnostics/diagnostics'

interface SystemHealthDashboardProps {
  initialReport: DiagnosticReport
}

export default function SystemHealthDashboard({ initialReport }: SystemHealthDashboardProps) {
  const [report, setReport] = useState<DiagnosticReport>(initialReport)
  const [isPending, startTransition] = useTransition()

  function runDiagnostics() {
    startTransition(async () => {
      const { refreshDiagnostics } = await import('@/app/admin/health/actions')
      const next = await refreshDiagnostics()
      setReport(next)
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">System Health</h1>
          <p className="text-gray-400 mt-1">
            Generated {new Date(report.generatedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={isPending}
          className="px-4 py-2 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] disabled:opacity-50"
        >
          {isPending ? 'Running...' : 'Run Diagnostics'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HealthCard title="Overall Status" status={report.overallStatus} />
        <MetricCard
          title="Passing"
          value={report.checks.filter((c) => c.status === 'pass').length}
        />
        <MetricCard
          title="Warnings"
          value={report.checks.filter((c) => c.status === 'warning').length}
        />
        <MetricCard
          title="Failures"
          value={report.checks.filter((c) => c.status === 'fail').length}
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Diagnostic Checks</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {report.checks.map((check) => (
            <CheckRow key={check.name} check={check} />
          ))}
          {report.checks.length === 0 && (
            <div className="p-8 text-center text-gray-400">No checks available.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function HealthCard({ title, status }: { title: string; status: DiagnosticStatus }) {
  const classes: Record<DiagnosticStatus, string> = {
    pass: 'bg-green-500/10 border-green-500/20 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    fail: 'bg-red-500/10 border-red-500/20 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  }

  return (
    <div className={`rounded-xl p-6 border ${classes[status]}`}>
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-bold capitalize mt-1">{status}</div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-3xl font-bold text-white mt-1">{value}</div>
    </div>
  )
}

function CheckRow({ check }: { check: DiagnosticCheck }) {
  const dotClasses: Record<DiagnosticStatus, string> = {
    pass: 'bg-green-400',
    warning: 'bg-yellow-400',
    fail: 'bg-red-400',
    info: 'bg-blue-400',
  }

  return (
    <div className="p-4 hover:bg-gray-800/30">
      <div className="flex items-start gap-3">
        <span className={`w-2 h-2 rounded-full mt-2 ${dotClasses[check.status]}`} />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="font-medium text-white">{check.name}</span>
            <span className="text-xs text-gray-500">{check.category}</span>
          </div>
          <p className="text-sm text-gray-400 mt-1">{check.message}</p>
          {check.detail && (
            <p className="text-xs text-gray-500 mt-1">{check.detail}</p>
          )}
        </div>
      </div>
    </div>
  )
}
