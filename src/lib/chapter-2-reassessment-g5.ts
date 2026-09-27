import { hardenChapter2G5Question } from './chapter-2-reassessment-g5-hardening'
import { chapter2G5ReassessmentQuestionsP1, chapter2G5ReassessmentMappingsP1, chapter2G5ReassessmentAuditP1 } from './chapter-2-reassessment-g5-p1'
import { chapter2G5ReassessmentQuestionsP2, chapter2G5ReassessmentMappingsP2, chapter2G5ReassessmentAuditP2 } from './chapter-2-reassessment-g5-p2'
import { chapter2G5ReassessmentQuestionsP3, chapter2G5ReassessmentMappingsP3, chapter2G5ReassessmentAuditP3 } from './chapter-2-reassessment-g5-p3'
import { chapter2G5ReassessmentQuestionsP4, chapter2G5ReassessmentMappingsP4, chapter2G5ReassessmentAuditP4 } from './chapter-2-reassessment-g5-p4'
import { chapter2G5ReassessmentQuestionsP5, chapter2G5ReassessmentMappingsP5, chapter2G5ReassessmentAuditP5 } from './chapter-2-reassessment-g5-p5'
import { chapter2G5ReassessmentQuestionsP6, chapter2G5ReassessmentMappingsP6, chapter2G5ReassessmentAuditP6 } from './chapter-2-reassessment-g5-p6'

const rawChapter2G5ReassessmentQuestions = [
  ...chapter2G5ReassessmentQuestionsP1,
  ...chapter2G5ReassessmentQuestionsP2,
  ...chapter2G5ReassessmentQuestionsP3,
  ...chapter2G5ReassessmentQuestionsP4,
  ...chapter2G5ReassessmentQuestionsP5,
  ...chapter2G5ReassessmentQuestionsP6,
]

export const chapter2G5ReassessmentQuestions = rawChapter2G5ReassessmentQuestions.map(
  hardenChapter2G5Question,
)

export const chapter2G5ReassessmentMappings = [
  ...chapter2G5ReassessmentMappingsP1,
  ...chapter2G5ReassessmentMappingsP2,
  ...chapter2G5ReassessmentMappingsP3,
  ...chapter2G5ReassessmentMappingsP4,
  ...chapter2G5ReassessmentMappingsP5,
  ...chapter2G5ReassessmentMappingsP6,
]

export const chapter2G5ReassessmentSourceAudit = [
  ...chapter2G5ReassessmentAuditP1,
  ...chapter2G5ReassessmentAuditP2,
  ...chapter2G5ReassessmentAuditP3,
  ...chapter2G5ReassessmentAuditP4,
  ...chapter2G5ReassessmentAuditP5,
  ...chapter2G5ReassessmentAuditP6,
]
