'use client'

import { useState, useTransition, useCallback } from 'react'
import { getLeads, getLeadMetrics, deleteLead, exportLeadsCsv } from '@/app/admin/nabba/leads/actions'
import type { NabbaLead, LeadFilters, LeadTemperature, LeadStatus, LeadRole, LeadInterest } from '@/types/nabba-leads'
import {
  LEAD_TEMPERATURE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  LEAD_ROLE_OPTIONS,
  LEAD_INTEREST_OPTIONS,
  TEMPERATURE_LABELS,
  STATUS_LABELS,
} from '@/types/nabba-leads'
import LeadForm from './LeadForm'
import {
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit3,
  Users,
  Flame,
  Thermometer,
  Snowflake,
  Plane,
  MonitorPlay,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export default function LeadDashboard() {
  const [leads, setLeads] = useState<NabbaLead[]>([])
  const [metrics, setMetrics] = useState({ total: 0, hot: 0, warm: 0, contact: 0, pilotInterest: 0, demoRequests: 0 })
  const [filters, setFilters] = useState<LeadFilters>({})
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<NabbaLead | undefined>()
  const [expandedLead, setExpandedLead] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [loaded, setLoaded] = useState(false)

  const load = useCallback(() => {
    startTransition(async () => {
      const [{ leads: l }, { metrics: m }] = await Promise.all([
        getLeads({ ...filters, search }),
        getLeadMetrics(),
      ])
      setLeads(l)
      if (m) setMetrics(m)
      setLoaded(true)
    })
  }, [filters, search])

  // Load on mount
  useState(() => {
    if (!loaded) load()
  })

  const handleExport = () => {
    startTransition(async () => {
      const { csv, error } = await exportLeadsCsv()
      if (error || !csv) return
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `NABBA-2026-leads-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Delete this lead?')) return
    startTransition(async () => {
      await deleteLead(id)
      load()
    })
  }

  const handleSuccess = (lead: NabbaLead) => {
    if (editingLead) {
      setEditingLead(undefined)
      setShowForm(false)
    }
    load()
  }

  const applyFilter = <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }))
    // Defer load to next render
    setTimeout(load, 0)
  }

  const clearFilters = () => {
    setFilters({})
    setSearch('')
    setTimeout(load, 0)
  }

  if (showForm) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {editingLead ? 'Edit Lead' : 'New Lead'}
          </h2>
          <button
            onClick={() => { setShowForm(false); setEditingLead(undefined) }}
            className="p-2 text-silver hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <LeadForm
          existingLead={editingLead}
          onSuccess={handleSuccess}
          onCancel={() => { setShowForm(false); setEditingLead(undefined) }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard icon={<Users className="w-5 h-5" />} label="Total" value={metrics.total} color="text-white" />
        <MetricCard icon={<Flame className="w-5 h-5" />} label="HOT" value={metrics.hot} color="text-red-400" />
        <MetricCard icon={<Thermometer className="w-5 h-5" />} label="WARM" value={metrics.warm} color="text-amber-400" />
        <MetricCard icon={<Snowflake className="w-5 h-5" />} label="CONTACT" value={metrics.contact} color="text-silver" />
        <MetricCard icon={<Plane className="w-5 h-5" />} label="Pilot Interest" value={metrics.pilotInterest} color="text-emerald-400" />
        <MetricCard icon={<MonitorPlay className="w-5 h-5" />} label="Demo Requests" value={metrics.demoRequests} color="text-blue-400" />
      </div>

      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => { setEditingLead(undefined); setShowForm(true) }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-brand-gold)] text-black font-bold rounded-xl hover:bg-[var(--color-brand-gold-light)] transition-colors"
        >
          <Plus className="w-5 h-5" /> New Lead
        </button>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-colors ${
            showFilters || Object.keys(filters).length > 0
              ? 'border-[var(--color-brand-gold)]/40 text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/10'
              : 'border-white/20 text-white hover:bg-white/5'
          }`}
        >
          <Filter className="w-5 h-5" /> Filters
          {(filters.temperature || filters.status || filters.role || filters.interest) && (
            <span className="w-5 h-5 rounded-full bg-[var(--color-brand-gold)] text-black text-xs font-bold flex items-center justify-center">
              {[filters.temperature, filters.status, filters.role, filters.interest].filter(Boolean).length}
            </span>
          )}
        </button>
        <button
          onClick={handleExport}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" /> Export CSV
        </button>
        <button
          onClick={load}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
        >
          {isPending ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-silver-gray" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Search name, organization, or email..."
          className="w-full pl-10 pr-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors text-base"
        />
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FilterSelect
              label="Temperature"
              value={filters.temperature || 'all'}
              options={['all', ...LEAD_TEMPERATURE_OPTIONS]}
              onChange={(v) => applyFilter('temperature', v as LeadTemperature | 'all')}
            />
            <FilterSelect
              label="Status"
              value={filters.status || 'all'}
              options={['all', ...LEAD_STATUS_OPTIONS]}
              onChange={(v) => applyFilter('status', v as LeadStatus | 'all')}
            />
            <FilterSelect
              label="Role"
              value={filters.role || 'all'}
              options={['all', ...LEAD_ROLE_OPTIONS]}
              onChange={(v) => applyFilter('role', v as LeadRole | 'all')}
            />
            <FilterSelect
              label="Interest"
              value={filters.interest || 'all'}
              options={['all', ...LEAD_INTEREST_OPTIONS]}
              onChange={(v) => applyFilter('interest', v as LeadInterest | 'all')}
            />
          </div>
          <button
            onClick={clearFilters}
            className="text-sm text-silver hover:text-white transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Lead list */}
      <div className="space-y-3">
        {leads.length === 0 ? (
          <div className="text-center py-12 text-silver">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No leads yet</p>
            <p className="text-sm">Tap "New Lead" to capture your first NABBA contact.</p>
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              expanded={expandedLead === lead.id}
              onToggle={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
              onEdit={() => { setEditingLead(lead); setShowForm(true) }}
              onDelete={() => handleDelete(lead.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl p-4 text-center">
      <div className={`${color} mb-1 flex justify-center`}>{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-silver-gray">{label}</div>
    </div>
  )
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-silver-gray mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === 'all' ? 'All' : o}</option>
        ))}
      </select>
    </div>
  )
}

function LeadCard({
  lead,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  lead: NabbaLead
  expanded: boolean
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const tempInfo = TEMPERATURE_LABELS[lead.temperature]
  const statusInfo = STATUS_LABELS[lead.status]

  return (
    <div className="bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-xl overflow-hidden">
      {/* Summary row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex-shrink-0">
          {expanded ? <ChevronUp className="w-5 h-5 text-silver" /> : <ChevronDown className="w-5 h-5 text-silver" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white truncate">{lead.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded border ${tempInfo.color}`}>{tempInfo.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded border ${statusInfo.color}`}>{statusInfo.label}</span>
          </div>
          <div className="text-sm text-silver truncate">{lead.organization} · {lead.role}</div>
        </div>
        <div className="text-xs text-silver-gray whitespace-nowrap">
          {new Date(lead.created_at).toLocaleDateString()}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-[var(--color-border-primary)] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-silver-gray">Email:</span>{' '}
              <a href={`mailto:${lead.email}`} className="text-[var(--color-brand-gold)] hover:underline">{lead.email}</a>
            </div>
            {lead.phone && (
              <div>
                <span className="text-silver-gray">Phone:</span>{' '}
                <a href={`tel:${lead.phone}`} className="text-[var(--color-brand-gold)] hover:underline">{lead.phone}</a>
              </div>
            )}
            {lead.state && (
              <div><span className="text-silver-gray">State:</span> {lead.state}</div>
            )}
            <div><span className="text-silver-gray">Follow-up:</span> {lead.follow_up_action}</div>
            <div><span className="text-silver-gray">Captured by:</span> {lead.captured_by_email || 'Unknown'}</div>
            <div><span className="text-silver-gray">Captured:</span> {new Date(lead.created_at).toLocaleString()}</div>
          </div>

          {lead.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {lead.interests.map((i) => (
                <span key={i} className="text-xs px-2 py-1 rounded bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/20">
                  {i}
                </span>
              ))}
            </div>
          )}

          {lead.notes && (
            <div className="text-sm text-silver bg-black/30 rounded-lg p-3">
              {lead.notes}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-400 bg-red-400/5 border border-red-400/20 rounded-lg hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
