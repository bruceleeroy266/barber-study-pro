import StaffHoursManager from '@/components/hours/StaffHoursManager'

interface PageProps {
  searchParams: Promise<{
    saved?: string
    error?: string
    student?: string
    reviewed?: string
    alreadyReviewed?: string
    bulkApproved?: string
    queueStudent?: string
    queueDate?: string
    queueSource?: string
    queueCategory?: string
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
      reviewedStatus={params.reviewed ?? null}
      alreadyReviewedStatus={params.alreadyReviewed ?? null}
      bulkApprovedCount={params.bulkApproved !== undefined && /^\d+$/.test(params.bulkApproved)
        ? Number(params.bulkApproved)
        : null}
      queueStudentFilter={params.queueStudent ?? ''}
      queueDateFilter={params.queueDate ?? ''}
      queueSourceFilter={params.queueSource ?? ''}
      queueCategoryFilter={params.queueCategory ?? ''}
    />
  )
}
