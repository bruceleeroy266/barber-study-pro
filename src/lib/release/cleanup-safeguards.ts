export interface CleanupPreviewAccount {
  id: string
  email: string
  role: string | null
  schoolId: string | null
  isDesignated: boolean
}

export interface CleanupPreviewResult {
  dryRun: boolean
  totalMatched: number
  protectedCount: number
  deletableCount: number
  protectedAccounts: CleanupPreviewAccount[]
  deletableAccounts: CleanupPreviewAccount[]
}

export function buildCleanupPreview(accounts: CleanupPreviewAccount[], dryRun = true): CleanupPreviewResult {
  const protectedAccounts = accounts.filter((account) => account.isDesignated)
  const deletableAccounts = accounts.filter((account) => !account.isDesignated)

  return {
    dryRun,
    totalMatched: accounts.length,
    protectedCount: protectedAccounts.length,
    deletableCount: deletableAccounts.length,
    protectedAccounts,
    deletableAccounts,
  }
}
