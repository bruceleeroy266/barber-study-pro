import Link from 'next/link'

export interface PlatformSchoolOption {
  id: string
  name: string
}

interface PlatformSchoolSelectorProps {
  /** Active, non-deleted schools, fetched server-side. */
  schools: PlatformSchoolOption[]
  /** Currently selected school id, if any. */
  selectedId?: string | null
  /** Base admin path the selector links against, e.g. '/admin/school'. */
  basePath: string
  /** Heading shown above the list. */
  title?: string
  /** Short helper line shown under the heading. */
  description?: string
}

/**
 * Server-rendered school picker for platform administrators
 * (role='admin' AND school_id IS NULL). Lets the platform admin choose which
 * school to administer without being assigned a school_id. School-attached
 * admins never see this component — they remain scoped to their own school.
 */
export default function PlatformSchoolSelector({
  schools,
  selectedId,
  basePath,
  title = 'Select a school',
  description = 'Platform administrators can view and administer any school.',
}: PlatformSchoolSelectorProps) {
  return (
    <div className="bg-charcoal border border-graphite rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-silver text-sm mt-1">{description}</p>
        </div>
        {selectedId && (
          <Link
            href={basePath}
            className="text-sm text-[var(--color-brand-gold)] hover:underline whitespace-nowrap"
          >
            Change school
          </Link>
        )}
      </div>

      {schools.length === 0 ? (
        <p className="text-silver text-sm">No active schools are available.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {schools.map((school) => {
            const isSelected = school.id === selectedId
            return (
              <li key={school.id}>
                <Link
                  href={`${basePath}?school=${school.id}`}
                  aria-current={isSelected ? 'true' : undefined}
                  className={`block rounded-lg border px-4 py-3 transition-colors ${
                    isSelected
                      ? 'border-[var(--color-brand-gold)] bg-black text-white'
                      : 'border-graphite bg-black text-silver hover:text-white hover:border-[var(--color-brand-gold)]'
                  }`}
                >
                  <span className="block font-medium">{school.name}</span>
                  {isSelected && (
                    <span className="block text-xs text-[var(--color-brand-gold)] mt-1">
                      Currently selected
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
