import { SchoolConfiguration } from '@/types'

interface Props {
  config: SchoolConfiguration
  onChange: (enrollment: SchoolConfiguration['enrollment']) => void
}

export default function EnrollmentSection({ config, onChange }: Props) {
  const { enrollment, programs } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Student Enrollment Settings</h2>
        <p className="text-sm text-gray-400">Control how students join and get assigned</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Open Enrollment</p>
            <p className="text-sm text-gray-400">Allow new students to be enrolled</p>
          </div>
          <input
            type="checkbox"
            checked={enrollment.openEnrollment}
            onChange={(e) => onChange({ ...enrollment, openEnrollment: e.target.checked })}
            className="w-5 h-5 accent-[#D4AF37]"
          />
        </label>

        <label className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Allow Self-Registration</p>
            <p className="text-sm text-gray-400">Students can create accounts without an invite</p>
          </div>
          <input
            type="checkbox"
            checked={enrollment.allowSelfRegistration}
            onChange={(e) => onChange({ ...enrollment, allowSelfRegistration: e.target.checked })}
            className="w-5 h-5 accent-[#D4AF37]"
          />
        </label>

        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">Default Program</label>
          <select
            value={enrollment.defaultProgramId || ''}
            onChange={(e) => onChange({ ...enrollment, defaultProgramId: e.target.value || null })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="">None</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
