import { Grade, GradeCategory, GradeBreakdown, StudentGradePerformance, Assessment } from '@/types'

export function calculateCategoryAverage(grades: Grade[]): number {
  if (grades.length === 0) return 0
  const total = grades.reduce((sum, g) => sum + g.percentage, 0)
  return Math.round((total / grades.length) * 10) / 10
}

export function calculateWeightedContribution(
  categoryAverage: number,
  categoryWeight: number
): number {
  return Math.round(categoryAverage * categoryWeight * 10) / 10
}

export function calculateOverallGrade(
  grades: Grade[],
  categories: GradeCategory[]
): number {
  if (grades.length === 0) return 0

  const activeCategories = categories.filter((c) => c.isActive)
  let totalWeighted = 0
  let totalWeightUsed = 0

  for (const category of activeCategories) {
    const categoryGrades = grades.filter((g) => g.categoryId === category.id && !g.isExcused)
    if (categoryGrades.length === 0) continue
    const avg = calculateCategoryAverage(categoryGrades)
    totalWeighted += avg * category.weight
    totalWeightUsed += category.weight
  }

  if (totalWeightUsed === 0) return 0
  return Math.round((totalWeighted / totalWeightUsed) * 10) / 10
}

export function calculateGradeBreakdown(
  grades: Grade[],
  categories: GradeCategory[]
): GradeBreakdown[] {
  return categories
    .filter((c) => c.isActive)
    .map((category) => {
      const categoryGrades = grades.filter((g) => g.categoryId === category.id && !g.isExcused)
      const averagePercentage = calculateCategoryAverage(categoryGrades)
      return {
        categoryId: category.id,
        categoryName: category.name,
        categoryType: category.type,
        weight: category.weight,
        averagePercentage,
        weightedContribution: calculateWeightedContribution(averagePercentage, category.weight),
        gradeCount: categoryGrades.length,
      }
    })
}

export function calculateGradeTrend(grades: Grade[]): 'improving' | 'stable' | 'declining' {
  const sorted = [...grades]
    .filter((g) => !g.isExcused)
    .sort((a, b) => new Date(a.dateEntered).getTime() - new Date(b.dateEntered).getTime())

  if (sorted.length < 3) return 'stable'

  const mid = Math.ceil(sorted.length / 2)
  const firstHalf = sorted.slice(0, mid)
  const secondHalf = sorted.slice(mid)

  const firstAvg = firstHalf.reduce((sum, g) => sum + g.percentage, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, g) => sum + g.percentage, 0) / secondHalf.length

  const diff = secondAvg - firstAvg
  if (diff >= 5) return 'improving'
  if (diff <= -5) return 'declining'
  return 'stable'
}

export function isStudentAtRisk(
  overallGrade: number,
  missingAssignments: number,
  recentAssessments: Assessment[]
): boolean {
  const hasFailingGrade = overallGrade > 0 && overallGrade < 70
  const hasManyMissing = missingAssignments >= 2
  const hasFailedAssessment = recentAssessments.some((a) => !a.isPassed)
  return hasFailingGrade || hasManyMissing || hasFailedAssessment
}

export function calculateStudentGradePerformance(
  studentId: string,
  allGrades: Grade[],
  categories: GradeCategory[],
  allAssessments: Assessment[],
  missingAssignments = 0
): StudentGradePerformance {
  const grades = allGrades.filter((g) => g.studentId === studentId)
  const recentAssessments = allAssessments
    .filter((a) => a.studentId === studentId)
    .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime())
    .slice(0, 5)

  const overallGrade = calculateOverallGrade(grades, categories)
  const gradeBreakdown = calculateGradeBreakdown(grades, categories)
  const trendDirection = calculateGradeTrend(grades)
  const isAtRisk = isStudentAtRisk(overallGrade, missingAssignments, recentAssessments)

  return {
    studentId,
    overallGrade,
    gradeBreakdown,
    trendDirection,
    isAtRisk,
    missingAssignments,
    recentAssessments,
  }
}

export function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

export function getGradeColorClass(percentage: number): string {
  if (percentage >= 90) return 'text-green-400'
  if (percentage >= 80) return 'text-blue-400'
  if (percentage >= 70) return 'text-yellow-400'
  if (percentage >= 60) return 'text-orange-400'
  return 'text-red-400'
}
