import { Assessment, QualitativeResult } from '@/types'

export function percentageToLetter(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

export function qualitativeToNumeric(result: QualitativeResult): number {
  switch (result) {
    case 'PASS':
      return 100
    case 'NEEDS_IMPROVEMENT':
      return 70
    case 'FAIL':
      return 50
    default:
      return 0
  }
}

export function numericToQualitative(percentage: number): QualitativeResult {
  if (percentage >= 80) return 'PASS'
  if (percentage >= 60) return 'NEEDS_IMPROVEMENT'
  return 'FAIL'
}

export function calculatePassFail(score: number, maxScore: number, passingPercentage = 70): boolean {
  if (maxScore === 0) return false
  return (score / maxScore) * 100 >= passingPercentage
}

export function formatScore(
  assessment: Pick<Assessment, 'score' | 'scoringType' | 'qualitativeResult'>
): string {
  if (assessment.scoringType === 'QUALITATIVE') {
    return assessment.qualitativeResult || '—'
  }
  return `${assessment.score}`
}

export function getQualitativeColorClass(result: QualitativeResult | null | undefined): string {
  switch (result) {
    case 'PASS':
      return 'text-green-400'
    case 'NEEDS_IMPROVEMENT':
      return 'text-yellow-400'
    case 'FAIL':
      return 'text-red-400'
    default:
      return 'text-gray-400'
  }
}

export function getPassFailColorClass(isPassed: boolean): string {
  return isPassed ? 'text-green-400' : 'text-red-400'
}
