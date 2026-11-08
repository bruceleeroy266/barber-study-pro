/**
 * CATEGORY PERFORMANCE ANALYTICS
 * ASCYN PRO / ASCYN PRO V2
 */

import { AreaPerformance, ScoredAreaPerformance } from '@/types'
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
    const scored = areas.filter((a): a is ScoredAreaPerformance => a.score !== null)
    const totalAttempts = areas.reduce((sum, a) => sum + a.attempts, 0)
    const trendScores = scored.map((a) => a.score)

    categoryPerformance.push({
      id: `category-${category}`,
      name: category,
      chapterNumber: null,
      category,
      // Null when no chapter in the category has a completed assessment —
      // never substitute chapter learning progress for a quiz score.
      score: scored.length > 0
        ? Math.round(scored.reduce((sum, a) => sum + a.score, 0) / scored.length)
        : null,
      attempts: totalAttempts,
      trend: trendDirection(trendScores),
      lastAttemptAt: null,
    })
  }

  return categoryPerformance.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
}
