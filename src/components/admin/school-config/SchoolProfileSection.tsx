import { SchoolConfiguration } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'

interface Props {
  config: SchoolConfiguration
  onChange: (school: SchoolConfiguration['school']) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-red-400 mt-1">{message}</p>
}

export default function SchoolProfileSection({ config, onChange, errors }: Props) {
  const { school, branding } = config

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">School Profile & Branding</h2>
        <p className="text-sm text-gray-400">Basic school information and brand customization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="school-name" className="block text-sm font-medium text-gray-300 mb-1">
            School Name
          </label>
          <input
            id="school-name"
            type="text"
            value={school.name}
            onChange={(e) => onChange({ ...school, name: e.target.value })}
            aria-invalid={!!errors.schoolName}
            aria-describedby={errors.schoolName ? 'school-name-error' : undefined}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.schoolName} />
        </div>
        <div>
          <label htmlFor="school-email" className="block text-sm font-medium text-gray-300 mb-1">
            Contact Email
          </label>
          <input
            id="school-email"
            type="email"
            value={school.contact_email || ''}
            onChange={(e) => onChange({ ...school, contact_email: e.target.value })}
            aria-invalid={!!errors.schoolEmail}
            aria-describedby={errors.schoolEmail ? 'school-email-error' : undefined}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] aria-invalid:border-red-500"
          />
          <FieldError message={errors.schoolEmail} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="school-address" className="block text-sm font-medium text-gray-300 mb-1">
            Address
          </label>
          <input
            id="school-address"
            type="text"
            value={school.address || ''}
            onChange={(e) => onChange({ ...school, address: e.target.value })}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Primary Brand Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={branding.primaryColor}
              onChange={() => {}}
              disabled
              aria-disabled="true"
              title="Brand color editing is coming soon"
              className="h-10 w-10 rounded bg-transparent cursor-not-allowed"
            />
            <span className="text-sm text-gray-400">{branding.primaryColor}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Brand color editing coming soon.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Subscription Status</label>
          <span className="inline-flex px-3 py-1.5 rounded-lg text-sm bg-gray-800 text-gray-300 capitalize">
            {school.subscription_status}
          </span>
        </div>
      </div>
    </div>
  )
}
