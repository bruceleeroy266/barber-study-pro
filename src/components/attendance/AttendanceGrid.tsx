'use client'

import { AttendanceRecord, Profile } from '@/types'
import AttendanceRow from './AttendanceRow'
import BulkActions from './BulkActions'

interface AttendanceGridProps {
  records: AttendanceRecord[]
  students: Profile[]
  selectedIds: Set<string>
  isAllSelected: boolean
  loading: boolean
  onToggleSelection: (id: string) => void
  onToggleAll: () => void
  onStatusChange: (id: string, status: import('@/types').AttendanceStatus) => void
  onCorrectionClick: (record: AttendanceRecord) => void
  onAuditClick: (record: AttendanceRecord) => void
  onNoteChange: (id: string, note: string) => void
  onBulkMarkStatus: (status: import('@/types').AttendanceStatus) => void
  onClearSelection: () => void
}

export default function AttendanceGrid({
  records,
  students,
  selectedIds,
  isAllSelected,
  loading,
  onToggleSelection,
  onToggleAll,
  onStatusChange,
  onCorrectionClick,
  onAuditClick,
  onNoteChange,
  onBulkMarkStatus,
  onClearSelection,
}: AttendanceGridProps) {
  const studentMap = new Map(students.map((s) => [s.id, s]))

  return (
    <div className="space-y-3">
      <BulkActions
        selectedCount={selectedIds.size}
        onMarkStatus={onBulkMarkStatus}
        onClear={onClearSelection}
        disabled={loading}
      />

      <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleAll}
                  disabled={loading || records.length === 0}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-gray-900"
                />
              </th>
              <th className="p-4">Student</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Clock In</th>
              <th className="p-4 text-center">Clock Out</th>
              <th className="p-4 text-center">Duration</th>
              <th className="p-4">Note</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {records.length > 0 ? (
              records.map((record) => (
                <AttendanceRow
                  key={record.id}
                  record={record}
                  student={studentMap.get(record.userId)}
                  isSelected={selectedIds.has(record.id)}
                  onSelect={() => onToggleSelection(record.id)}
                  onStatusChange={(status) => onStatusChange(record.id, status)}
                  onCorrectionClick={() => onCorrectionClick(record)}
                  onAuditClick={() => onAuditClick(record)}
                  onNoteChange={(note) => onNoteChange(record.id, note)}
                  disabled={loading}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400">
                  No attendance records match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
