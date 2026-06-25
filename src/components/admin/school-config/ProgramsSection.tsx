import { SchoolConfiguration, AcademicProgram } from '@/types'

interface Props {
  config: SchoolConfiguration
  onChange: (programs: AcademicProgram[]) => void
}

export default function ProgramsSection({ config, onChange }: Props) {
  const { programs } = config

  function toggleActive(programId: string) {
    onChange(
      programs.map((p) => (p.id === programId ? { ...p, active: !p.active } : p))
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Academic Programs</h2>
        <p className="text-sm text-gray-400">Programs offered by the school and their requirements</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-950 text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium">Program</th>
              <th className="px-4 py-3 font-medium">Required Hours</th>
              <th className="px-4 py-3 font-medium">Assessments</th>
              <th className="px-4 py-3 font-medium">Practicals</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {programs.map((program) => (
              <tr key={program.id} className="bg-gray-900/50">
                <td className="px-4 py-3 text-white font-medium">{program.name}</td>
                <td className="px-4 py-3 text-gray-300">{program.requiredHours}</td>
                <td className="px-4 py-3 text-gray-300">{program.requiredAssessments}</td>
                <td className="px-4 py-3 text-gray-300">{program.requiredPracticals}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(program.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      program.active
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    {program.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {programs.length === 0 && (
        <p className="text-sm text-gray-500">No programs configured.</p>
      )}
    </div>
  )
}
