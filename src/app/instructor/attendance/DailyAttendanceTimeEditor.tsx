'use client'

import { useMemo, useState } from 'react'
import type { AttendanceRecord, AttendanceStatus } from '@/types'
import type { DailyScheduleExpectation } from '@/lib/schedules/daily-expectations'
import { calculateAttendedMinutes, isoToLocalTime } from '@/lib/schedules/attendance-time'

interface Props {
  record: AttendanceRecord | undefined
  expectation: DailyScheduleExpectation | undefined
  schoolTimeZone: string
  disabled?: boolean
  onSave: (arrival: string, departure: string, breakMinutes: number) => Promise<void>
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

export default function DailyAttendanceTimeEditor({
  record,
  expectation,
  schoolTimeZone,
  disabled = false,
  onSave,
}: Props) {
  const [arrival, setArrival] = useState(() =>
    record?.clockedInAt
      ? isoToLocalTime(record.clockedInAt, schoolTimeZone)
      : expectation?.startTime?.slice(0, 5) || '',
  )
  const [departure, setDeparture] = useState(() =>
    record?.clockedOutAt
      ? isoToLocalTime(record.clockedOutAt, schoolTimeZone)
      : expectation?.endTime?.slice(0, 5) || '',
  )
  const [breakMinutes, setBreakMinutes] = useState(() => expectation?.breakMinutes ?? 0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const attendedMinutes = useMemo(
    () => calculateAttendedMinutes(arrival, departure, breakMinutes),
    [arrival, departure, breakMinutes],
  )

  const handleSave = async () => {
    if (!arrival || !departure || attendedMinutes <= 0) {
      setLocalError('Enter an arrival time earlier than the departure time.')
      return
    }

    setSaving(true)
    setSaved(false)
    setLocalError(null)
    try {
      await onSave(arrival, departure, breakMinutes)
      setSaved(true)
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Could not save actual times.')
    } finally {
      setSaving(false)
    }
  }

  const statusHint: AttendanceStatus =
    expectation?.startTime && arrival > expectation.startTime.slice(0, 5) ? 'Tardy' : 'Present'

  return (
    <div className="mt-4 rounded-lg border border-graphite bg-charcoal p-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Actual attendance time</div>
          <div className="text-xs text-silver">
            Adjust only what changed. Saving these times records attended minutes but does not create an hour log yet.
          </div>
        </div>
        {arrival && departure && attendedMinutes > 0 && (
          <div className="text-sm font-semibold text-gold">
            {formatMinutes(attendedMinutes)} attended
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="space-y-1">
          <span className="text-xs text-silver">Arrival</span>
          <input
            type="time"
            value={arrival}
            onChange={(event) => {
              setArrival(event.target.value)
              setSaved(false)
            }}
            disabled={disabled || saving}
            className="w-full rounded-lg border border-graphite bg-black px-3 py-2 text-white [color-scheme:dark] disabled:opacity-50"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-silver">Departure</span>
          <input
            type="time"
            value={departure}
            onChange={(event) => {
              setDeparture(event.target.value)
              setSaved(false)
            }}
            disabled={disabled || saving}
            className="w-full rounded-lg border border-graphite bg-black px-3 py-2 text-white [color-scheme:dark] disabled:opacity-50"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-silver">Break (min)</span>
          <input
            type="number"
            min="0"
            max="480"
            step="5"
            value={breakMinutes}
            onChange={(event) => {
              const value = Number(event.target.value)
              setBreakMinutes(Number.isFinite(value) ? Math.max(0, Math.min(480, value)) : 0)
              setSaved(false)
            }}
            disabled={disabled || saving}
            className="w-full rounded-lg border border-graphite bg-black px-3 py-2 text-white disabled:opacity-50"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-silver">
          Saving will mark this record <span className="font-semibold text-white">{statusHint}</span> based on the expected start time.
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled || saving || !arrival || !departure || attendedMinutes <= 0}
          className="min-h-11 rounded-lg bg-gold px-4 py-2 font-semibold text-black disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Actual Times'}
        </button>
      </div>

      {saved && <div className="mt-2 text-xs font-medium text-gold">Actual attendance time saved.</div>}
      {localError && <div className="mt-2 text-xs text-red-300">{localError}</div>}
    </div>
  )
}
