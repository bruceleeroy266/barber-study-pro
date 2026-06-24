/**
 * CATEGORY PERFORMANCE ANALYTICS
 * ASCYN PRO / Barber Study Pro V2
 */

import { AreaPerformance } from '@/types'
import { trendDirection } from './utils'

export function calculateCategoryPerformance(
  chapterPerformance: AreaPerformance[]
): AreaPerformance[] {
  const groups = new Map<string, AreaPerformance[]>()

  for (const area of chapterPerformance) {
    const category = area.category
    if (!groups.has(category)) {
      groups.set(category, [])
    }
    groups.get(category)!.push(area)
  }

  const categoryPerformance: AreaPerformance[] = []
  for (const [category, areas] of groups.entries()) {
    const scored = areas.filter((a) => a.score > 0)
    const avgScore = scored.length > 0
      ? Math.round(scored.reduce((sum, a) => sum + a.score, 0) / scored.length)
      : 0
    const totalAttempts = areas.reduce((sum, a) => sum + a.attempts, 0)
    const trendScores = areas.map((a) => a.score)

    categoryPerformance.push({
      id: `category-${category}`,
      name: category,
      chapterNumber: null,
      category,
      score: avgScore,
      attempts: totalAttempts,
      trend: trendDirection(trendScores),
      lastAttemptAt: null,
    })
  }

  return categoryPerformance.sort((a, b) => b.score - a.score)
}
