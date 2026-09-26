import StaffHoursManager from '@/components/hours/StaffHoursManager'

interface PageProps {
  searchParams: Promise<{
    saved?: string
    error?: string
    student?: string
  }>
}

export default async function InstructorHoursPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <StaffHoursManager
      returnTo="/instructor/hours"
      backHref="/instructor"
      saved={params.saved === '1'}
      error={params.error ?? null}
      highlightedStudentId={params.student ?? null}
    />
  )
}
