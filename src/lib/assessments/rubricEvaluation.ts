import { AssessmentRubric, RubricCriterion, AssessmentType } from '@/types'

export interface CriterionScore {
  criterionId: string
  score: number
  maxScore: number
}

export function calculateRubricMaxScore(rubric: AssessmentRubric): number {
  return rubric.criteria.reduce((sum, c) => sum + c.maxScore, 0)
}

export function calculateRubricScore(
  rubric: AssessmentRubric,
  criterionScores: CriterionScore[]
): number {
  const max = calculateRubricMaxScore(rubric)
  if (max === 0) return 0
  const earned = criterionScores.reduce((sum, cs) => sum + cs.score, 0)
  return Math.round((earned / max) * 1000) / 10
}

export function calculateCriterionPercentage(
  score: number,
  maxScore: number
): number {
  if (maxScore === 0) return 0
  return Math.round((score / maxScore) * 1000) / 10
}

export function getDefaultCriterionScores(rubric: AssessmentRubric): CriterionScore[] {
  return rubric.criteria.map((c) => ({
    criterionId: c.id,
    score: 0,
    maxScore: c.maxScore,
  }))
}

export function findRubricByType(
  rubrics: AssessmentRubric[],
  type: AssessmentType
): AssessmentRubric | undefined {
  return rubrics.find((r) => r.assessmentType === type && r.isActive)
}

export function buildCriterionFeedback(
  criterion: RubricCriterion,
  score: number
): string {
  const percentage = calculateCriterionPercentage(score, criterion.maxScore)
  if (percentage >= 90) return `${criterion.name}: Excellent work.`
  if (percentage >= 70) return `${criterion.name}: Proficient, minor refinement needed.`
  if (percentage >= 60) return `${criterion.name}: Developing — review expectations.`
  return `${criterion.name}: Needs significant improvement.`
}
