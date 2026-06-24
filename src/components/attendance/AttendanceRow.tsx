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
    <tr className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          disabled={disabled}
          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-gray-900"
        />
      </td>
      <td className="p-4">
        <div className="text-white font-medium">{student?.full_name || 'Unknown'}</div>
        <div className="text-gray-500 text-xs">{student?.email}</div>
      </td>
      <td className="p-4 text-gray-300 text-sm">{record.date}</td>
      <td className="p-4">
        <StatusSelector value={record.status} onChange={onStatusChange} disabled={disabled} size="sm" />
      </td>
      <td className="p-4 text-gray-300 text-sm text-center">{formatClockTime(record.clockedInAt)}</td>
      <td className="p-4 text-gray-300 text-sm text-center">{formatClockTime(record.clockedOutAt)}</td>
      <td className="p-4 text-gray-300 text-sm text-center">{formatDuration(record.minutesPresent)}</td>
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
            className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            placeholder="Add note..."
          />
        ) : (
          <button
            onClick={() => setIsEditingNote(true)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white text-left"
            title="Click to edit note"
          >
            <FileText className="w-3 h-3" />
            <span className={record.note ? 'text-gray-300' : 'text-gray-600 italic'}>
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
            className="p-1.5 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded transition-colors"
            title="Submit correction"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onAuditClick(record)}
            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
            title="View audit history"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
