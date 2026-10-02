export type StudySurfaceType =
  | 'lesson'
  | 'flashcards'
  | 'quiz'
  | 'remediation'
  | 'reassessment'

export const STUDY_SURFACE_TYPES = new Set<StudySurfaceType>([
  'lesson',
  'flashcards',
  'quiz',
  'remediation',
  'reassessment',
])
