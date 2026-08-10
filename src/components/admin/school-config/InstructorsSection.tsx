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
        <p className="text-sm text-silver">Instructors assigned to this school</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {instructors.map((instructor) => (
          <div
            key={instructor.id}
            className="bg-black border border-graphite rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--color-brand-gold)]/10 flex items-center justify-center text-[var(--color-brand-gold)] font-bold text-lg">
              {instructor.full_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{instructor.full_name}</h3>
              <div className="flex items-center gap-4 text-sm text-silver mt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {instructor.email}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-silver/10 text-silver border border-silver/20 capitalize">
              {instructor.role}
            </span>
          </div>
        ))}
      </div>

      {instructors.length === 0 && (
        <p className="text-sm text-silver-gray">No instructors assigned.</p>
      )}

      <div className="bg-black border border-graphite rounded-lg p-4">
        <p className="text-sm text-silver">
          Full instructor onboarding and role assignment will be available in Phase 12B.
        </p>
      </div>
    </div>
  )
}
