'use client'

import { useMemo } from 'react'
import { calculateAttendedMinutes } from '@/lib/schedules/attendance-time'

interface Props {
  arrival: string
  departure: string
  breakMinutes: number
  disabled?: boolean
  onChange: (next: {
    arrival: string
    departure: string
    breakMinutes: number
  }) => void
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

export default function DailyAttendanceTimeEditor({
  arrival,
  departure,
  breakMinutes,
  disabled = false,
  onChange,
}: Props) {
  const attendedMinutes = useMemo(
    () => calculateAttendedMinutes(arrival, departure, breakMinutes),
    [arrival, departure, breakMinutes],
  )

  return (
    <div className="mt-4 rounded-lg border border-graphite bg-charcoal p-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Actual attendance time</div>
          <div className="text-xs text-silver">
            Adjust only what changed. These edits stay in the daily draft until Submit Day is pressed.
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
            onChange={(event) =>
              onChange({ arrival: event.target.value, departure, breakMinutes })
            }
            disabled={disabled}
            className="w-full rounded-lg border border-graphite bg-black px-3 py-2 text-white [color-scheme:dark] disabled:opacity-50"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-silver">Departure</span>
          <input
            type="time"
            value={departure}
            onChange={(event) =>
              onChange({ arrival, departure: event.target.value, breakMinutes })
            }
            disabled={disabled}
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
              onChange({
                arrival,
                departure,
                breakMinutes: Number.isFinite(value) ? Math.max(0, Math.min(480, value)) : 0,
              })
            }}
            disabled={disabled}
            className="w-full rounded-lg border border-graphite bg-black px-3 py-2 text-white disabled:opacity-50"
          />
        </label>
      </div>
    </div>
  )
}
