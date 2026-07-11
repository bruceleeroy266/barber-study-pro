import { chapter17PremiumContent } from '@/lib/chapter-17-premium'
import { chapter17PremiumFlashcards } from '@/lib/chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '@/lib/chapter-17-premium-quiz'

interface ValidationError {
  type: string
  message: string
}

const errors: ValidationError[] = []
const warnings: ValidationError[] = []

// Collect all standard IDs and check uniqueness
const standardIds = new Map<string, string>()

function checkUnique(type: string, id: string, context: string) {
  if (!id) {
    errors.push({ type: 'missing-standard-id', message: `${type} missing standardId in ${context}` })
    return
  }
  if (standardIds.has(id)) {
    errors.push({ type: 'duplicate-standard-id', message: `Duplicate standardId ${id} in ${type} (${context}) — first seen in ${standardIds.get(id)}` })
  } else {
    standardIds.set(id, `${type} (${context})`)
  }
}

// Competencies
const competencies = chapter17PremiumContent.competencies || []
competencies.forEach((c) => {
  checkUnique('competency', c.standardId, `id=${c.id}`)
})

const competencyIds = new Set(competencies.map((c) => c.id))

// Learning Objectives
const objectives = chapter17PremiumContent.learningObjectives || []
objectives.forEach((lo) => {
  checkUnique('learning-objective', lo.standardId, `id=${lo.id}`)
  lo.competencyIds.forEach((cid) => {
    if (!competencyIds.has(cid)) {
      errors.push({ type: 'broken-traceability', message: `Learning objective ${lo.id} references unknown competency ${cid}` })
    }
  })
})

// Sections / Lessons
const sections = chapter17PremiumContent.sections || []
sections.forEach((s) => {
  checkUnique('lesson', s.standardId || '', `id=${s.id}`)
  ;(s.competencyIds || []).forEach((cid) => {
    if (!competencyIds.has(cid)) {
      errors.push({ type: 'broken-traceability', message: `Section ${s.id} references unknown competency ${cid}` })
    }
  })
})

// Flashcards
chapter17PremiumFlashcards.forEach((fc) => {
  checkUnique('flashcard', fc.standardId || '', `id=${fc.id}`)
  if (fc.competency_id && !competencyIds.has(fc.competency_id)) {
    errors.push({ type: 'broken-traceability', message: `Flashcard ${fc.id} references unknown competency ${fc.competency_id}` })
  }
})

// Quiz Questions
const allQuizQuestions = [...chapter17PremiumQuizQuestions, ...chapter17LearningQuestions]
allQuizQuestions.forEach((q) => {
  checkUnique('quiz-question', q.standardId || '', `id=${q.id}`)
  if (q.competency_id && !competencyIds.has(q.competency_id)) {
    errors.push({ type: 'broken-traceability', message: `Quiz question ${q.id} references unknown competency ${q.competency_id}` })
  }
})

// Remediation
const remediation = chapter17PremiumContent.remediation || []
remediation.forEach((r) => {
  checkUnique('remediation', r.standardId, `id=${r.id}`)
  if (!competencyIds.has(r.competencyId)) {
    errors.push({ type: 'broken-traceability', message: `Remediation ${r.id} references unknown competency ${r.competencyId}` })
  }
})

// Coverage: every competency must have at least one section, flashcard, quiz question, and remediation
competencies.forEach((c) => {
  const sectionCount = sections.filter((s) => (s.competencyIds || []).includes(c.id)).length
  const flashcardCount = chapter17PremiumFlashcards.filter((f) => f.competency_id === c.id).length
  const quizCount = allQuizQuestions.filter((q) => q.competency_id === c.id).length
  const remCount = remediation.filter((r) => r.competencyId === c.id).length

  if (sectionCount === 0) errors.push({ type: 'unmapped-competency', message: `Competency ${c.id} has no mapped lesson sections` })
  if (flashcardCount === 0) errors.push({ type: 'unmapped-competency', message: `Competency ${c.id} has no mapped flashcards` })
  if (quizCount === 0) errors.push({ type: 'unmapped-competency', message: `Competency ${c.id} has no mapped quiz questions` })
  if (remCount === 0) errors.push({ type: 'unmapped-competency', message: `Competency ${c.id} has no remediation path` })
})

// Coverage: every learning objective must have at least one lesson, flashcard, quiz
objectives.forEach((lo) => {
  if (lo.lessonIds.length === 0) errors.push({ type: 'uncovered-objective', message: `Learning objective ${lo.id} has no lessonIds` })
  if (lo.flashcardIds.length === 0) errors.push({ type: 'uncovered-objective', message: `Learning objective ${lo.id} has no flashcardIds` })
  if (lo.quizQuestionIds.length === 0) errors.push({ type: 'uncovered-objective', message: `Learning objective ${lo.id} has no quizQuestionIds` })
})

// Summary
console.log('=== Chapter 17 Traceability Validation ===')
console.log(`Competencies: ${competencies.length}`)
console.log(`Learning Objectives: ${objectives.length}`)
console.log(`Lessons (sections): ${sections.length}`)
console.log(`Flashcards: ${chapter17PremiumFlashcards.length}`)
console.log(`Quiz Questions: ${allQuizQuestions.length}`)
console.log(`Remediation Paths: ${remediation.length}`)
console.log(`Unique Standard IDs: ${standardIds.size}`)
console.log('')

if (errors.length === 0) {
  console.log('✅ All traceability validations passed.')
  process.exit(0)
} else {
  console.error(`❌ ${errors.length} validation error(s):`)
  errors.forEach((e) => console.error(`  [${e.type}] ${e.message}`))
  if (warnings.length > 0) {
    console.warn(`⚠️ ${warnings.length} warning(s):`)
    warnings.forEach((w) => console.warn(`  [${w.type}] ${w.message}`))
  }
  process.exit(1)
}
