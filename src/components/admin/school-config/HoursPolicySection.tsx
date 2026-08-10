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
  return <p className="text-sm text-silver mt-1">{message}</p>
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
        <p className="text-sm text-silver">Required hours and tracked categories</p>
      </div>

      <div className="bg-black border border-graphite rounded-lg p-4">
        <label htmlFor="required-hours" className="block text-sm font-medium text-light-gray mb-2">
          Required Hours
        </label>
        <input
          id="required-hours"
          type="number"
          min={0}
          value={hoursPolicy.requiredHours}
          onChange={(e) => onChange({ ...hoursPolicy, requiredHours: Number(e.target.value) })}
          aria-invalid={!!errors.requiredHours}
          className="w-full md:w-64 bg-charcoal border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] aria-invalid:border-silver"
        />
        <FieldError message={errors.requiredHours} />
      </div>

      <label className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4">
        <div>
          <p className="text-white font-medium">Require Instructor Approval</p>
          <p className="text-sm text-silver">All hour entries must be approved before counting</p>
        </div>
        <input
          type="checkbox"
          checked={hoursPolicy.requireInstructorApproval}
          onChange={(e) => onChange({ ...hoursPolicy, requireInstructorApproval: e.target.checked })}
          className="w-5 h-5 accent-[var(--color-brand-gold)]"
        />
      </label>

      <div className="bg-black border border-graphite rounded-lg p-4">
        <p className="text-sm font-medium text-light-gray mb-3">Tracked Categories</p>
        <div className="flex flex-wrap gap-2">
          {ALL_HOUR_CATEGORIES.map((category) => {
            const active = hoursPolicy.categories.includes(category)
            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  active
                    ? 'bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]/20'
                    : 'bg-charcoal text-silver border-[var(--color-border-secondary)]'
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
