import { SchoolConfiguration, HoursPolicy, HourCategory } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'

const ALL_HOUR_CATEGORIES: HourCategory[] = [
  'Theory',
  'Practical',
  'Clinic',
  'Sanitation',
  'Makeup Hours',
  'Other',
]

interface Props {
  config: SchoolConfiguration
  onChange: (policy: HoursPolicy) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-400 mt-1">{message}</p>
}

export default function HoursPolicySection({ config, onChange, errors }: Props) {
  const { hoursPolicy } = config

  function toggleCategory(category: HourCategory) {
    const exists = hoursPolicy.categories.includes(category)
    const categories = exists
      ? hoursPolicy.categories.filter((c) => c !== category)
      : [...hoursPolicy.categories, category]
    onChange({ ...hoursPolicy, categories })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Hours Policy</h2>
        <p className="text-sm text-gray-400">Required hours and tracked categories</p>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <label htmlFor="required-hours" className="block text-sm font-medium text-gray-300 mb-2">
          Required Hours
        </label>
        <input
          id="required-hours"
          type="number"
          min={0}
          value={hoursPolicy.requiredHours}
          onChange={(e) => onChange({ ...hoursPolicy, requiredHours: Number(e.target.value) })}
          aria-invalid={!!errors.requiredHours}
          className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
        />
        <FieldError message={errors.requiredHours} />
      </div>

      <label className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-4">
        <div>
          <p className="text-white font-medium">Require Instructor Approval</p>
          <p className="text-sm text-gray-400">All hour entries must be approved before counting</p>
        </div>
        <input
          type="checkbox"
          checked={hoursPolicy.requireInstructorApproval}
          onChange={(e) => onChange({ ...hoursPolicy, requireInstructorApproval: e.target.checked })}
          className="w-5 h-5 accent-[#D4AF37]"
        />
      </label>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-300 mb-3">Tracked Categories</p>
        <div className="flex flex-wrap gap-2">
          {ALL_HOUR_CATEGORIES.map((category) => {
            const active = hoursPolicy.categories.includes(category)
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  active
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'
                    : 'bg-gray-900 text-gray-400 border-gray-700'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
