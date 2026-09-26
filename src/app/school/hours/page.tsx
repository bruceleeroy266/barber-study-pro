import StaffHoursManager from '@/components/hours/StaffHoursManager'

interface PageProps {
  searchParams: Promise<{
    saved?: string
    error?: string
    student?: string
  }>
}

export default async function SchoolHoursPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <StaffHoursManager
      returnTo="/school/hours"
      backHref="/school"
      title="Student Hours"
      saved={params.saved === '1'}
      error={params.error ?? null}
      highlightedStudentId={params.student ?? null}
    />
  )
}
