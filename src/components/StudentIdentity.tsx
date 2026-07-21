import { Profile } from '@/types'

interface StudentIdentityProps {
  student: Profile
  variant?: 'dark' | 'light'
  showRole?: boolean
}

/**
 * Canonical student identity display.
 *
 * Always renders the name and email from the profile record — the app's
 * source of truth for student identity inside the instructor portal.
 */
export default function StudentIdentity({
  student,
  variant = 'dark',
  showRole = false,
}: StudentIdentityProps) {
  const nameClass = variant === 'dark' ? 'text-white' : 'text-gray-900'
  const emailClass = variant === 'dark' ? 'text-gray-500' : 'text-gray-600'
  const roleClass = variant === 'dark' ? 'text-gray-500' : 'text-gray-600'

  return (
    <div>
      <div className={`font-medium ${nameClass}`}>{student.full_name}</div>
      <div className={`text-xs ${emailClass}`}>{student.email}</div>
      {showRole && (
        <div className={`text-xs capitalize mt-0.5 ${roleClass}`}>
          Role: {student.role}
        </div>
      )}
    </div>
  )
}
