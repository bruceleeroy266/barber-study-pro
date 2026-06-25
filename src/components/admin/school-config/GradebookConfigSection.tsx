import { SchoolConfiguration, GradebookConfig } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'

interface Props {
  config: SchoolConfiguration
  onChange: (config: GradebookConfig) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-400 mt-1">{message}</p>
}

export default function GradebookConfigSection({ config, onChange, errors }: Props) {
  const { gradebookConfig } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Gradebook Configuration</h2>
        <p className="text-sm text-gray-400">Passing thresholds and grade categories</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="gradebook-passing" className="block text-sm font-medium text-gray-300 mb-2">
            Passing %
          </label>
          <input
            id="gradebook-passing"
            type="number"
            min={0}
            max={100}
            value={gradebookConfig.passingPercentage}
            onChange={(e) =>
              onChange({ ...gradebookConfig, passingPercentage: Number(e.target.value) })
            }
            aria-invalid={!!errors.gradebookPassing}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.gradebookPassing} />
        </div>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label htmlFor="grading-scale" className="block text-sm font-medium text-gray-300 mb-2">
            Grading Scale
          </label>
          <select
            id="grading-scale"
            value={gradebookConfig.gradingScale}
            onChange={(e) =>
              onChange({
                ...gradebookConfig,
                gradingScale: e.target.value as GradebookConfig['gradingScale'],
              })
            }
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="percentage">Percentage</option>
            <option value="letter">Letter Grade</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-300 mb-3">Grade Categories</p>
        <div className="space-y-2">
          {gradebookConfig.categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3"
            >
              <div>
                <p className="text-white text-sm font-medium">{category.name}</p>
                <p className="text-xs text-gray-500">Weight: {category.weight}%</p>
              </div>
              <span className="text-xs text-gray-400">ID: {category.id}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Category editing is read-only in this preview.
        </p>
      </div>
    </div>
  )
}
