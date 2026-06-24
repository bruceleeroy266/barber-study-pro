import { GradeCategory } from '@/types'

export function getTotalWeight(categories: GradeCategory[]): number {
  return categories.filter((c) => c.isActive).reduce((sum, c) => sum + c.weight, 0)
}

export function normalizeWeights(categories: GradeCategory[]): GradeCategory[] {
  const active = categories.filter((c) => c.isActive)
  const total = getTotalWeight(active)
  if (total === 0) return active

  return active.map((c) => ({
    ...c,
    weight: Math.round((c.weight / total) * 100) / 100,
  }))
}

export function validateWeights(categories: GradeCategory[]): {
  valid: boolean
  total: number
  difference: number
} {
  const total = getTotalWeight(categories)
  return {
    valid: Math.abs(total - 1) < 0.001,
    total: Math.round(total * 1000) / 1000,
    difference: Math.round((1 - total) * 1000) / 1000,
  }
}

export function distributeRemainingWeight(
  categories: GradeCategory[],
  targetTotal = 1
): GradeCategory[] {
  const active = categories.filter((c) => c.isActive)
  const currentTotal = getTotalWeight(active)
  const remaining = targetTotal - currentTotal

  if (Math.abs(remaining) < 0.001 || active.length === 0) return active

  const perCategory = remaining / active.length
  return active.map((c) => ({
    ...c,
    weight: Math.round((c.weight + perCategory) * 1000) / 1000,
  }))
}

export function getCategoryByType(
  categories: GradeCategory[],
  type: GradeCategory['type']
): GradeCategory | undefined {
  return categories.find((c) => c.type === type && c.isActive)
}

export function getWeightDisplay(weight: number): string {
  return `${Math.round(weight * 100)}%`
}
