import { SchoolConfiguration, AttendancePolicy } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'

interface Props {
  config: SchoolConfiguration
  onChange: (policy: AttendancePolicy) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-400 mt-1">{message}</p>
}

export default function AttendancePolicySection({ config, onChange, errors }: Props) {
  const { attendancePolicy } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Attendance & Hours Policies</h2>
        <p className="text-sm text-gray-400">Rules for tracking attendance and tardiness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="attendance-target" className="block text-sm font-medium text-gray-300 mb-2">
            Target Attendance %
          </label>
          <input
            id="attendance-target"
            type="number"
            min={0}
            max={100}
            value={attendancePolicy.targetAttendancePercentage}
            onChange={(e) =>
              onChange({ ...attendancePolicy, targetAttendancePercentage: Number(e.target.value) })
            }
            aria-invalid={!!errors.attendanceTarget}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.attendanceTarget} />
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="auto-excuse-limit" className="block text-sm font-medium text-gray-300 mb-2">
            Auto-Excuse Limit
          </label>
          <input
            id="auto-excuse-limit"
            type="number"
            min={0}
            value={attendancePolicy.autoExcuseLimit}
            onChange={(e) =>
              onChange({ ...attendancePolicy, autoExcuseLimit: Number(e.target.value) })
            }
            aria-invalid={!!errors.autoExcuseLimit}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <p className="text-xs text-gray-500 mt-1">Per-student automatic excused absences</p>
          <FieldError message={errors.autoExcuseLimit} />
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="tardy-threshold" className="block text-sm font-medium text-gray-300 mb-2">
            Tardy Threshold (minutes)
          </label>
          <input
            id="tardy-threshold"
            type="number"
            min={0}
            value={attendancePolicy.tardyThresholdMinutes}
            onChange={(e) =>
              onChange({ ...attendancePolicy, tardyThresholdMinutes: Number(e.target.value) })
            }
            aria-invalid={!!errors.tardyThreshold}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.tardyThreshold} />
        </div>

        <label className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Track Clock Events</p>
            <p className="text-sm text-gray-400">Record clock-in/clock-out events</p>
          </div>
          <input
            type="checkbox"
            checked={attendancePolicy.trackClockEvents}
            onChange={(e) =>
              onChange({ ...attendancePolicy, trackClockEvents: e.target.checked })
            }
            className="w-5 h-5 accent-[#D4AF37]"
          />
        </label>
      </div>
    </div>
  )
}
