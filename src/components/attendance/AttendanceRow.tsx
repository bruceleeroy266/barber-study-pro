'use client'

import { useState } from 'react'
import { AttendanceRecord, AttendanceStatus, Profile } from '@/types'
import StatusSelector from './StatusSelector'
import { Edit3, History, FileText } from 'lucide-react'

interface AttendanceRowProps {
  record: AttendanceRecord
  student: Profile | undefined
  isSelected: boolean
  onSelect: () => void
  onStatusChange: (status: AttendanceStatus) => void
  onCorrectionClick: (record: AttendanceRecord) => void
  onAuditClick: (record: AttendanceRecord) => void
  onNoteChange: (note: string) => void
  disabled?: boolean
}

function formatClockTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } catch {
    return iso
  }
}

function formatDuration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export default function AttendanceRow({
  record,
  student,
  isSelected,
  onSelect,
  onStatusChange,
  onCorrectionClick,
  onAuditClick,
  onNoteChange,
  disabled = false,
}: AttendanceRowProps) {
  const [note, setNote] = useState(record.note || '')
  const [isEditingNote, setIsEditingNote] = useState(false)

  const handleNoteBlur = () => {
    setIsEditingNote(false)
    if (note !== (record.note || '')) {
      onNoteChange(note)
    }
  }

  return (
    <tr className="border-b border-graphite/50 hover:bg-graphite/30 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          disabled={disabled}
          className="w-4 h-4 rounded border-silver-gray bg-graphite text-[var(--color-brand-gold)] focus:ring-[var(--color-brand-gold)] focus:ring-offset-gray-900"
        />
      </td>
      <td className="p-4">
        <div className="text-white font-medium">{student?.full_name || 'Unknown'}</div>
        <div className="text-silver-gray text-xs">{student?.email}</div>
      </td>
      <td className="p-4 text-light-gray text-sm">{record.date}</td>
      <td className="p-4">
        <StatusSelector value={record.status} onChange={onStatusChange} disabled={disabled} size="sm" />
      </td>
      <td className="p-4 text-light-gray text-sm text-center">{formatClockTime(record.clockedInAt)}</td>
      <td className="p-4 text-light-gray text-sm text-center">{formatClockTime(record.clockedOutAt)}</td>
      <td className="p-4 text-light-gray text-sm text-center">{formatDuration(record.minutesPresent)}</td>
      <td className="p-4 min-w-[180px]">
        {isEditingNote ? (
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleNoteBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNoteBlur()
            }}
            autoFocus
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
            placeholder="Add note..."
          />
        ) : (
          <button
            onClick={() => setIsEditingNote(true)}
            className="flex items-center gap-1 text-xs text-silver hover:text-white text-left"
            title="Click to edit note"
          >
            <FileText className="w-3 h-3" />
            <span className={record.note ? 'text-light-gray' : 'text-silver-gray italic'}>
              {record.note || 'Add note...'}
            </span>
          </button>
        )}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCorrectionClick(record)}
            disabled={disabled}
            className="p-1.5 text-silver hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)]/10 rounded transition-colors"
            title="Submit correction"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAuditClick(record)}
            className="p-1.5 text-silver hover:text-silver hover:bg-silver/10 rounded transition-colors"
            title="View audit history"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
