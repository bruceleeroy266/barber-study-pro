/**
 * ANALYTICS UTILITIES
 * ASCYN PRO / Barber Study Pro V2
 */

export function getCategoryForChapter(chapterNumber: number): string {
  const categories: Record<number, string> = {
    1: 'History & Professionalism',
    2: 'Life Skills',
    3: 'Professional Image',
    4: 'Infection Control',
    5: 'Tools & Equipment',
    6: 'Anatomy & Physiology',
    7: 'Chemistry',
    8: 'Electricity',
    9: 'Skin',
    10: 'Hair & Scalp',
    11: 'Hair Treatments',
    12: 'Facial Massage',
    13: 'Shaving',
    14: 'Haircutting',
    15: 'Hair Replacement',
    16: 'State Board Prep',
    17: 'Barbershop Management',
    18: 'Advanced Cutting',
    19: 'Hair Replacement Systems',
    20: 'Color Theory',
    21: 'Final Exam Prep',
  }
  return categories[chapterNumber] || 'General'
}

export function trendDirection(scores: number[]): 'improving' | 'stable' | 'declining' {
  if (scores.length < 2) return 'stable'
  const mid = Math.floor(scores.length / 2)
  const first = scores.slice(0, mid)
  const second = scores.slice(mid)
  const firstAvg = first.reduce((a, b) => a + b, 0) / first.length
  const secondAvg = second.reduce((a, b) => a + b, 0) / second.length
  const diff = secondAvg - firstAvg
  if (diff >= 5) return 'improving'
  if (diff <= -5) return 'declining'
  return 'stable'
}

export function scoreToColor(score: number): string {
  if (score >= 80) return 'text-green-400'
  if (score >= 70) return 'text-yellow-400'
  if (score >= 60) return 'text-orange-400'
  return 'text-red-400'
}

export function chapterIdToNumber(chapterId: string): number {
  const match = chapterId.match(/ch-(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}

export function quizIdToChapterId(quizId: string): string {
  const match = quizId.match(/quiz-(\d+)/)
  return match ? `ch-${match[1]}` : ''
}
