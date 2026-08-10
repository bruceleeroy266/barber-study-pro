import { SchoolConfiguration, InstructorDefaults } from '@/types'

interface Props {
  config: SchoolConfiguration
  onChange: (defaults: InstructorDefaults) => void
}

export default function InstructorDefaultsSection({ config, onChange }: Props) {
  const { instructorDefaults } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">Instructor Defaults</h2>
        <p className="text-sm text-silver">Default permissions and settings for instructors</p>
      </div>

      <div className="space-y-4">
        <label className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Can Approve Hours</p>
            <p className="text-sm text-silver">Instructors can approve student hour logs</p>
          </div>
          <input
            type="checkbox"
            checked={instructorDefaults.canApproveHours}
            onChange={(e) =>
              onChange({ ...instructorDefaults, canApproveHours: e.target.checked })
            }
            className="w-5 h-5 accent-[var(--color-brand-gold)]"
          />
        </label>

        <label className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Can Manage Students</p>
            <p className="text-sm text-silver">Instructors can view and manage student records</p>
          </div>
          <input
            type="checkbox"
            checked={instructorDefaults.canManageStudents}
            onChange={(e) =>
              onChange({ ...instructorDefaults, canManageStudents: e.target.checked })
            }
            className="w-5 h-5 accent-[var(--color-brand-gold)]"
          />
        </label>

        <label className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Can View Reports</p>
            <p className="text-sm text-silver">Instructors can access analytics and reports</p>
          </div>
          <input
            type="checkbox"
            checked={instructorDefaults.canViewReports}
            onChange={(e) =>
              onChange({ ...instructorDefaults, canViewReports: e.target.checked })
            }
            className="w-5 h-5 accent-[var(--color-brand-gold)]"
          />
        </label>

        <label className="flex items-center justify-between bg-black border border-graphite rounded-lg p-4">
          <div>
            <p className="text-white font-medium">Require Approval for Grades</p>
            <p className="text-sm text-silver">Grades entered by instructors require admin approval</p>
          </div>
          <input
            type="checkbox"
            checked={instructorDefaults.requireApprovalForGrades}
            onChange={(e) =>
              onChange({ ...instructorDefaults, requireApprovalForGrades: e.target.checked })
            }
            className="w-5 h-5 accent-[var(--color-brand-gold)]"
          />
        </label>
      </div>
    </div>
  )
}
