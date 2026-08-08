import { SchoolConfiguration, StudentDefaults } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'

interface Props {
  config: SchoolConfiguration
  onChange: (defaults: StudentDefaults) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-400 mt-1">{message}</p>
}

export default function StudentDefaultsSection({ config, onChange, errors }: Props) {
  const { studentDefaults } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Student Defaults</h2>
        <p className="text-sm text-gray-400">Default academic requirements for students</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="student-passing" className="block text-sm font-medium text-gray-300 mb-2">
            Default Passing %
          </label>
          <input
            id="student-passing"
            type="number"
            min={0}
            max={100}
            value={studentDefaults.passingPercentage}
            onChange={(e) =>
              onChange({ ...studentDefaults, passingPercentage: Number(e.target.value) })
            }
            aria-invalid={!!errors.studentPassing}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.studentPassing} />
          <p className="text-xs text-gray-500 mt-2">
            Minimum score required to pass quizzes and exams
          </p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="max-quiz-attempts" className="block text-sm font-medium text-gray-300 mb-2">
            Max Quiz Attempts
          </label>
          <input
            id="max-quiz-attempts"
            type="number"
            min={1}
            value={studentDefaults.maxQuizAttempts}
            onChange={(e) =>
              onChange({ ...studentDefaults, maxQuizAttempts: Number(e.target.value) })
            }
            aria-invalid={!!errors.maxQuizAttempts}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.maxQuizAttempts} />
          <p className="text-xs text-gray-500 mt-2">
            Maximum attempts allowed per quiz
          </p>
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="required-attendance" className="block text-sm font-medium text-gray-300 mb-2">
            Required Attendance %
          </label>
          <input
            id="required-attendance"
            type="number"
            min={0}
            max={100}
            value={studentDefaults.requiredAttendancePercentage}
            onChange={(e) =>
              onChange({ ...studentDefaults, requiredAttendancePercentage: Number(e.target.value) })
            }
            aria-invalid={!!errors.requiredAttendance}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.requiredAttendance} />
          <p className="text-xs text-gray-500 mt-2">
            Minimum attendance required to remain in good standing
          </p>
        </div>
      </div>
    </div>
  )
}
