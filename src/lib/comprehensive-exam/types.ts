export type ExamOption = 'a' | 'b' | 'c' | 'd'

export type ExamConfig = {
  configId: string
  slug: string
  version: number
  title: string
  timeLimitSeconds: number
  passingPercentage: number
  scoredQuestionCount: number
  unscoredQuestionCount: number
  blueprintVersion: string
}

export type ExamItem = {
  position: number
  prompt: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  selectedOption: ExamOption | null
  answeredAt: string | null
  flagged: boolean
}

export type DomainResult = {
  correct: number
  total: number
  percentage: number
}

export type ExamResult = {
  scoredCorrect: number
  scoredTotal: number
  percentage: number
  passed: boolean
  domainBreakdown: Record<string, DomainResult>
  elapsedSeconds: number
  flaggedAtSubmit: number
  unansweredAtSubmit: number
}

export type ExamAttempt = {
  attemptId: string
  configId: string
  configVersion: number
  status: 'active' | 'completed' | 'expired' | 'recovered_finalized' | 'voided'
  startedAt: string
  expiresAt: string
  completedAt: string | null
  completionReason: string | null
  attemptNumber: number
  timeLimitSeconds: number
  passingPercentage: number
  remainingSeconds: number
  answeredCount: number
  flaggedCount: number
  items: ExamItem[]
  result: ExamResult | null
}

export type ExamHistoryItem = {
  attemptId: string
  configId: string
  attemptNumber: number
  status: string
  startedAt: string
  completedAt: string | null
  completionReason: string | null
  scoredCorrect: number | null
  scoredTotal: number | null
  percentage: number | null
  passed: boolean | null
  domainBreakdown: Record<string, DomainResult> | null
  elapsedSeconds: number | null
  flaggedAtSubmit: number | null
  unansweredAtSubmit: number | null
  activeSeconds: number | null
}
