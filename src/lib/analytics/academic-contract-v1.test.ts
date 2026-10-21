import { describe, expect, it } from 'vitest'
import { buildAcademicSnapshot, type AnswerEvidence } from './academic-contract-v1'

function evidence(
  source: AnswerEvidence['source'],
  correct: boolean,
  n: number,
  conceptId = 'infection-control',
  attemptId = source === 'chapter_quiz' ? 'quiz-1' : 'micro-1',
): AnswerEvidence {
  return { source, correct, questionId: source + '-' + n, conceptId,
    attemptId, answeredAt: '2026-10-20T12:00:00Z' }
}

describe('academic-v1 evidence contract', () => {
  it('keeps pass and completion separate from measured accuracy', () => {
    const rows = Array.from({length:30}, (_,i)=> evidence('chapter_quiz', i < 27, i))
    const snapshot = buildAcademicSnapshot({evidence:rows, passThreshold:80, completed:true})
    expect(snapshot.quiz).toMatchObject({correct:27, incorrect:3, answered:30, percent:90})
    expect(snapshot.completed).toBe(true)
    expect(snapshot.passed).toBe(true)
    expect(snapshot.quiz.percent).not.toBe(100)
  })
  it('combines quiz and micro evidence by counts without laundering 100% completion', () => {
    const rows = [
      ...Array.from({length:20},(_,i)=>evidence('chapter_quiz',i<17,i)),
      ...Array.from({length:10},(_,i)=>evidence('micro_check',i<7,i)),
    ]
    const snapshot = buildAcademicSnapshot({evidence:rows,passThreshold:80,completed:true})
    expect(snapshot.quiz.percent).toBe(85)
    expect(snapshot.micro.percent).toBe(70)
    expect(snapshot.combinedAccuracy.percent).toBe(80)
    expect(snapshot.concepts[0].incorrect).toBe(6)
    expect(snapshot.passed).toBe(true)
  })
  it('never fabricates an academic score from missing evidence', () => {
    const snapshot = buildAcademicSnapshot({evidence:[],passThreshold:80,completed:true})
    expect(snapshot.quiz.percent).toBeNull()
    expect(snapshot.micro.percent).toBeNull()
    expect(snapshot.passed).toBeNull()
    expect(snapshot.completed).toBe(true)
  })
  it('reports limited evidence without declaring proven weakness', () => {
    const snapshot = buildAcademicSnapshot({evidence:[evidence('micro_check',false,0)],passThreshold:80,completed:false})
    expect(snapshot.concepts[0]).toMatchObject({percent:0, evidenceStatus:'limited'})
  })
  it('rejects repeated answers to the same question in one attempt', () => {
    const a = evidence('micro_check',false,1)
    expect(() => buildAcademicSnapshot({evidence:[a,{...a,correct:true}],passThreshold:80,completed:false})).toThrow(/Duplicate/)
  })
  it('does not promote a borderline rounded score into a passing attempt', () => {
    const rows = Array.from({length:6},(_,i)=>evidence('chapter_quiz',i<5,i))
    const snapshot = buildAcademicSnapshot({evidence:rows,passThreshold:83.34,completed:false})
    expect(snapshot.quiz.percent).toBe(83.33)
    expect(snapshot.passed).toBe(false)
  })
  it('produces identical student and instructor outputs for identical evidence', () => {
    const rows = [evidence('chapter_quiz',true,1),evidence('micro_check',false,2)]
    const student = buildAcademicSnapshot({evidence:rows,passThreshold:80,completed:false})
    const instructor = buildAcademicSnapshot({evidence:[...rows],passThreshold:80,completed:false})
    expect(instructor).toEqual(student)
  })
})
