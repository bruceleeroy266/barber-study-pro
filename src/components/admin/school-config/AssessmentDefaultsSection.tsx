import { SchoolConfiguration, AssessmentDefaults, AssessmentType } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'

const ALL_ASSESSMENT_TYPES: AssessmentType[] = [
  'HAIRCUT',
  'COLOR',
  'CHEMICAL',
  'SANITATION',
  'CONSULTATION',
]

interface Props {
  config: SchoolConfiguration
  onChange: (defaults: AssessmentDefaults) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-400 mt-1">{message}</p>
}

export default function AssessmentDefaultsSection({ config, onChange, errors }: Props) {
  const { assessmentDefaults } = config

  function toggleType(type: AssessmentType) {
    const exists = assessmentDefaults.allowedTypes.includes(type)
    const allowedTypes = exists
      ? assessmentDefaults.allowedTypes.filter((t) => t !== type)
      : [...assessmentDefaults.allowedTypes, type]
    onChange({ ...assessmentDefaults, allowedTypes })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Assessment Defaults</h2>
        <p className="text-sm text-gray-400">Default settings for practical assessments</p>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <label htmlFor="assessment-passing" className="block text-sm font-medium text-gray-300 mb-2">
          Passing %
        </label>
        <input
          id="assessment-passing"
          type="number"
          min={0}
          max={100}
          value={assessmentDefaults.passingPercentage}
          onChange={(e) =>
            onChange({ ...assessmentDefaults, passingPercentage: Number(e.target.value) })
          }
          aria-invalid={!!errors.assessmentPassing}
          className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
        />
        <FieldError message={errors.assessmentPassing} />
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-300 mb-3">Allowed Assessment Types</p>
        <div className="flex flex-wrap gap-2">
          {ALL_ASSESSMENT_TYPES.map((type) => {
            const active = assessmentDefaults.allowedTypes.includes(type)
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors capitalize ${
                  active
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/20'
                    : 'bg-gray-900 text-gray-400 border-gray-700'
                }`}
              >
                {type.toLowerCase().replace('_', ' ')}
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <label htmlFor="default-rubric" className="block text-sm font-medium text-gray-300 mb-2">
          Default Rubric
        </label>
        <input
          id="default-rubric"
          type="text"
          value={assessmentDefaults.defaultRubricId || ''}
          readOnly
          disabled
          aria-disabled="true"
          title="Default rubric selection will be available when rubric management is added"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          Default rubric selection will be available when rubric management is added.
        </p>
      </div>
    </div>
  )
}
