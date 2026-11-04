/** Isolated Exam Ready bank. Not connected to student-facing routes or database. */
import { infectionControlQuestions } from './upstream/infection-control-bank'
import { anatomyPhysiologyQuestions } from './upstream/anatomy-physiology'
import { scientificConceptGapQuestions } from './upstream/scientific-concepts-gap'
import { hairScalpDisorderQuestionBank } from './upstream/hair-scalp-disorders-bank'
import { hairStructurePropertyQuestionBank } from './upstream/hair-structure-properties-bank'
import { implementsEquipmentQuestions } from './upstream/implements-equipment'
import { hairCareQuestionBank } from './upstream/hair-care-services-bank'
import { facialHairSkinQuestions } from './upstream/facial-hair-skin-care'
import { validateExamReadyBank, type ExamReadySourceQuestion } from './source-bank'

export const examReadyQuestions: ExamReadySourceQuestion[] = [
  ...infectionControlQuestions,
  ...anatomyPhysiologyQuestions,
  ...scientificConceptGapQuestions,
  ...hairScalpDisorderQuestionBank,
  ...hairStructurePropertyQuestionBank,
  ...implementsEquipmentQuestions,
  ...hairCareQuestionBank,
  ...facialHairSkinQuestions,
]
export const EXAM_READY_EXPECTED_COUNT = 573

export function findExamReadyIdCollisions(existingIds: Iterable<string>): string[] {
  const ids = new Set(existingIds)
  return examReadyQuestions.filter(q => ids.has(q.id)).map(q => q.id)
}

export function assertExamReadyBankIntegrity(existingIds: Iterable<string> = []): void {
  if (examReadyQuestions.length !== EXAM_READY_EXPECTED_COUNT) {
    throw new Error(`Exam Ready question count mismatch: ${examReadyQuestions.length}`)
  }
  const issues = validateExamReadyBank(examReadyQuestions)
  if (issues.length) throw new Error(`Exam Ready bank integrity failure: ${JSON.stringify(issues.slice(0,20))}`)
  const collisions = findExamReadyIdCollisions(existingIds)
  if (collisions.length) throw new Error(`Exam Ready question ID collisions: ${collisions.slice(0,20).join(', ')}`)
}
