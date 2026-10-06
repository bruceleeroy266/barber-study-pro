import StaffHoursManager from '@/components/hours/StaffHoursManager'

interface PageProps {
  searchParams: Promise<{
    saved?: string
    error?: string
    student?: string
    reviewed?: string
    alreadyReviewed?: string
    bulkApproved?: string
    adjusted?: string
    contractSaved?: string
    queueStudent?: string
    queueDate?: string
    queueSource?: string
    queueCategory?: string
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
      reviewedStatus={params.reviewed ?? null}
      alreadyReviewedStatus={params.alreadyReviewed ?? null}
      bulkApprovedCount={params.bulkApproved !== undefined && /^\d+$/.test(params.bulkApproved)
        ? Number(params.bulkApproved)
        : null}
      adjusted={params.adjusted === '1'}
      contractSaved={params.contractSaved === '1'}
      queueStudentFilter={params.queueStudent ?? ''}
      queueDateFilter={params.queueDate ?? ''}
      queueSourceFilter={params.queueSource ?? ''}
      queueCategoryFilter={params.queueCategory ?? ''}
    />
  )
}
