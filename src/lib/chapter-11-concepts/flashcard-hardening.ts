export type Chapter11FlashcardHardeningDisposition = 'KEEP' | 'REPAIR' | 'REWRITE'

const id = (n: number) => `fc-11-${String(n).padStart(3, '0')}`

export const CHAPTER11_FLASHCARD_KEEP = [
  8,10,13,15,21,22,23,24,25,26,28,31,32,45,48,49,50,52,75,79,
].map(id)

export const CHAPTER11_FLASHCARD_REPAIR = [
  1,5,9,11,12,14,16,17,18,19,27,33,35,36,38,44,46,51,54,72,74,80,
].map(id)

export const CHAPTER11_FLASHCARD_REWRITE = [
  2,3,4,6,7,20,29,30,34,37,39,40,41,42,43,47,53,55,56,57,58,59,60,61,62,
  63,64,65,66,67,68,69,70,71,73,76,77,78,
].map(id)

export const CHAPTER11_FLASHCARD_HARDENING_CLASSIFICATION: Readonly<Record<string, Chapter11FlashcardHardeningDisposition>> =
  Object.freeze(Object.fromEntries([
    ...CHAPTER11_FLASHCARD_KEEP.map((cardId) => [cardId, 'KEEP' as const]),
    ...CHAPTER11_FLASHCARD_REPAIR.map((cardId) => [cardId, 'REPAIR' as const]),
    ...CHAPTER11_FLASHCARD_REWRITE.map((cardId) => [cardId, 'REWRITE' as const]),
  ]))
