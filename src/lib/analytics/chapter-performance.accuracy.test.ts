import { describe, it, expect } from 'vitest'
import { calculateChapterPerformance } from './chapter-performance'

describe('chapter performance data integrity', () => {
  it('never turns a completed chapter into a fabricated quiz score', () => {
    type Args = Parameters<typeof calculateChapterPerformance>
    const chapters = [{id:'ch-4',chapter_number:4,title:'Infection Control'}] as Args[0]
    const progress = [{chapter_id:'ch-4',progress_percentage:100,quiz_completed:true}] as Args[2]
    const performance = calculateChapterPerformance(chapters, [], progress)
    expect(performance[0].score).toBe(0)
    expect(performance[0].attempts).toBe(0)
  })
  it('uses measured quiz percentage even when completion equals 100%', () => {
    type Args = Parameters<typeof calculateChapterPerformance>
    const chapters = [{id:'ch-4',chapter_number:4,title:'Infection Control'}] as Args[0]
    const progress = [{chapter_id:'ch-4',progress_percentage:100,quiz_completed:true}] as Args[2]
    const attempts = [{id:'attempt-1',quiz_id:'quiz-4',percentage:80,score:24,total_questions:30,completed_at:'2026-10-20T12:00:00Z'}] as Args[1]
    const performance = calculateChapterPerformance(chapters,attempts,progress)
    expect(performance[0].score).toBe(80)
  })
})
