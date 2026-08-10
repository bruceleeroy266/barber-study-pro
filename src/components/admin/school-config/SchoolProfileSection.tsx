import { SchoolConfiguration } from '@/types'
import { ValidationErrors } from '@/lib/school-config/validation'

interface Props {
  config: SchoolConfiguration
  onChange: (school: SchoolConfiguration['school']) => void
  errors: ValidationErrors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-sm text-silver mt-1">{message}</p>
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
]

const SCHOOL_TYPES = [
  { value: 'barber', label: 'Barber School' },
  { value: 'cosmetology', label: 'Cosmetology School' },
  { value: 'esthetics', label: 'Esthetics School' },
  { value: 'nail_technology', label: 'Nail Technology School' },
  { value: 'instructor', label: 'Instructor Training' },
  { value: 'multi_program', label: 'Multi-Program School' },
]

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
]

export default function SchoolProfileSection({ config, onChange, errors }: Props) {
  const { school } = config

  return (
    <div className="space-y-8">
      {/* General Information */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-1">General Information</h2>
        <p className="text-sm text-silver">Basic school identity and contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="school-name" className="block text-sm font-medium text-light-gray mb-1">
            School Name <span className="text-silver">*</span>
          </label>
          <input
            id="school-name"
            type="text"
            value={school.name}
            onChange={(e) => onChange({ ...school, name: e.target.value })}
            aria-invalid={!!errors.schoolName}
            aria-describedby={errors.schoolName ? 'school-name-error' : undefined}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] aria-invalid:border-silver"
            placeholder="Enter school name"
          />
          <FieldError message={errors.schoolName} />
        </div>

        <div>
          <label htmlFor="school-email" className="block text-sm font-medium text-light-gray mb-1">
            Contact Email
          </label>
          <input
            id="school-email"
            type="email"
            value={school.contact_email || ''}
            onChange={(e) => onChange({ ...school, contact_email: e.target.value })}
            aria-invalid={!!errors.schoolEmail}
            aria-describedby={errors.schoolEmail ? 'school-email-error' : undefined}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] aria-invalid:border-silver"
            placeholder="admin@school.edu"
          />
          <FieldError message={errors.schoolEmail} />
        </div>

        <div>
          <label htmlFor="school-phone" className="block text-sm font-medium text-light-gray mb-1">
            Phone Number
          </label>
          <input
            id="school-phone"
            type="tel"
            value={school.contact_phone || ''}
            onChange={(e) => onChange({ ...school, contact_phone: e.target.value })}
            aria-invalid={!!errors.schoolPhone}
            aria-describedby={errors.schoolPhone ? 'school-phone-error' : undefined}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] aria-invalid:border-silver"
            placeholder="(405) 555-0123"
          />
          <FieldError message={errors.schoolPhone} />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="school-website" className="block text-sm font-medium text-light-gray mb-1">
            Website
          </label>
          <input
            id="school-website"
            type="url"
            value={school.website || ''}
            onChange={(e) => onChange({ ...school, website: e.target.value })}
            aria-invalid={!!errors.schoolWebsite}
            aria-describedby={errors.schoolWebsite ? 'school-website-error' : undefined}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] aria-invalid:border-silver"
            placeholder="https://www.school.edu"
          />
          <FieldError message={errors.schoolWebsite} />
        </div>
      </div>

      {/* Address */}
      <div className="pt-6 border-t border-graphite">
        <h3 className="text-lg font-semibold text-white mb-1">Address</h3>
        <p className="text-sm text-silver">Physical location of the school</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="school-address" className="block text-sm font-medium text-light-gray mb-1">
            Street Address
          </label>
          <input
            id="school-address"
            type="text"
            value={school.address || ''}
            onChange={(e) => onChange({ ...school, address: e.target.value })}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <label htmlFor="school-city" className="block text-sm font-medium text-light-gray mb-1">
            City
          </label>
          <input
            id="school-city"
            type="text"
            value={school.city || ''}
            onChange={(e) => onChange({ ...school, city: e.target.value })}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
            placeholder="Oklahoma City"
          />
        </div>

        <div>
          <label htmlFor="school-state" className="block text-sm font-medium text-light-gray mb-1">
            State
          </label>
          <select
            id="school-state"
            value={school.state || ''}
            onChange={(e) => onChange({ ...school, state: e.target.value })}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
          >
            <option value="">Select State</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="school-zip" className="block text-sm font-medium text-light-gray mb-1">
            ZIP Code
          </label>
          <input
            id="school-zip"
            type="text"
            value={school.postal_code || ''}
            onChange={(e) => onChange({ ...school, postal_code: e.target.value })}
            aria-invalid={!!errors.schoolZip}
            aria-describedby={errors.schoolZip ? 'school-zip-error' : undefined}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] aria-invalid:border-silver"
            placeholder="73102"
          />
          <FieldError message={errors.schoolZip} />
        </div>
      </div>

      {/* School Information */}
      <div className="pt-6 border-t border-graphite">
        <h3 className="text-lg font-semibold text-white mb-1">School Information</h3>
        <p className="text-sm text-silver">Licensing, accreditation, and classification</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="school-license" className="block text-sm font-medium text-light-gray mb-1">
            License Number
          </label>
          <input
            id="school-license"
            type="text"
            value={school.license_number || ''}
            onChange={(e) => onChange({ ...school, license_number: e.target.value })}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
            placeholder="OK-BARBER-2026-001"
          />
        </div>

        <div>
          <label htmlFor="school-accreditation" className="block text-sm font-medium text-light-gray mb-1">
            Accreditation
          </label>
          <input
            id="school-accreditation"
            type="text"
            value={school.accreditation || ''}
            onChange={(e) => onChange({ ...school, accreditation: e.target.value })}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
            placeholder="NACCAS"
          />
        </div>

        <div>
          <label htmlFor="school-type" className="block text-sm font-medium text-light-gray mb-1">
            School Type
          </label>
          <select
            id="school-type"
            value={school.school_type || 'barber'}
            onChange={(e) => onChange({ ...school, school_type: e.target.value as SchoolConfiguration['school']['school_type'] })}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
          >
            {SCHOOL_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="school-timezone" className="block text-sm font-medium text-light-gray mb-1">
            Time Zone
          </label>
          <select
            id="school-timezone"
            value={school.timezone || 'America/Chicago'}
            onChange={(e) => onChange({ ...school, timezone: e.target.value })}
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-light-gray mb-1">Subscription Status</label>
          <span className="inline-flex px-3 py-1.5 rounded-lg text-sm bg-graphite text-light-gray capitalize">
            {school.subscription_status}
          </span>
        </div>
      </div>
    </div>
  )
}
