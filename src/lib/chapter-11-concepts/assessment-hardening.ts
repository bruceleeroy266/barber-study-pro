export type Chapter11AssessmentHardeningDisposition = 'KEEP' | 'REPAIR' | 'REWRITE'

const id = (n: number) => `qq-11-${String(n).padStart(3, '0')}`

export const CHAPTER11_ASSESSMENT_KEEP = [
  1,5,7,13,18,19,20,21,22,23,25,26,32,33,34,35,37,50,
].map(id)

export const CHAPTER11_ASSESSMENT_REPAIR = [
  8,9,10,11,14,15,16,24,27,29,36,38,39,40,
].map(id)

export const CHAPTER11_ASSESSMENT_REWRITE = [
  2,3,4,6,12,17,28,30,31,41,42,43,44,45,46,47,48,49,
].map(id)

export const CHAPTER11_ASSESSMENT_HARDENING_CLASSIFICATION: Readonly<Record<string, Chapter11AssessmentHardeningDisposition>> =
  Object.freeze(Object.fromEntries([
    ...CHAPTER11_ASSESSMENT_KEEP.map((questionId) => [questionId, 'KEEP' as const]),
    ...CHAPTER11_ASSESSMENT_REPAIR.map((questionId) => [questionId, 'REPAIR' as const]),
    ...CHAPTER11_ASSESSMENT_REWRITE.map((questionId) => [questionId, 'REWRITE' as const]),
  ]))

export const CHAPTER11_EXPECTED_ANSWER_KEYS: Readonly<Record<string, 'a' | 'b' | 'c' | 'd'>> = Object.freeze({
  'qq-11-001':'b','qq-11-002':'c','qq-11-003':'a','qq-11-004':'d','qq-11-005':'a',
  'qq-11-006':'c','qq-11-007':'b','qq-11-008':'d','qq-11-009':'c','qq-11-010':'b',
  'qq-11-011':'a','qq-11-012':'d','qq-11-013':'b','qq-11-014':'c','qq-11-015':'a',
  'qq-11-016':'d','qq-11-017':'b','qq-11-018':'c','qq-11-019':'d','qq-11-020':'b',
  'qq-11-021':'a','qq-11-022':'c','qq-11-023':'b','qq-11-024':'d','qq-11-025':'a',
  'qq-11-026':'c','qq-11-027':'b','qq-11-028':'d','qq-11-029':'a','qq-11-030':'c',
  'qq-11-031':'b','qq-11-032':'d','qq-11-033':'c','qq-11-034':'a','qq-11-035':'b',
  'qq-11-036':'d','qq-11-037':'c','qq-11-038':'b','qq-11-039':'a','qq-11-040':'d',
  'qq-11-041':'c','qq-11-042':'b','qq-11-043':'d','qq-11-044':'a','qq-11-045':'c',
  'qq-11-046':'a','qq-11-047':'d','qq-11-048':'b','qq-11-049':'c','qq-11-050':'a',
})
