import { SchoolConfiguration } from '@/types'
import { Mail } from 'lucide-react'

interface Props {
  config: SchoolConfiguration
}

export default function InstructorsSection({ config }: Props) {
  const { instructors } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Instructor Management</h2>
        <p className="text-sm text-gray-400">Instructors assigned to this school</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] font-bold text-lg">
              {instructor.full_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{instructor.full_name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {instructor.email}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 capitalize">
              {instructor.role}
            </span>
          </div>
        ))}
      </div>

      {instructors.length === 0 && (
        <p className="text-sm text-gray-500">No instructors assigned.</p>
      )}

      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-400">
          Full instructor onboarding and role assignment will be available in Phase 12B.
        </p>
      </div>
    </div>
  )
}
