import type {
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId,
} from './types'
import type { Chapter19Difficulty, Chapter19EvidenceRecord } from './grading'
import { chapter19MicroCheckPlacements } from './mappings'

export type Chapter19MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter19MicroCheckQuestion {
  id: `mcq-19-${string}`
  conceptFamilyId: Chapter19ConceptFamilyId
  learningObjectiveId: Chapter19LearningObjectiveId
  difficulty: Exclude<Chapter19Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter19MicroCheckAnswer
  explanation: string
}

export interface Chapter19MicroCheck {
  id: `mc-19-${string}`
  afterSectionId: 'chapter-19-lesson'
  conceptFamilyId: Chapter19ConceptFamilyId
  learningObjectiveId: Chapter19LearningObjectiveId
  title: string
  questions: readonly Chapter19MicroCheckQuestion[]
}

const q = (
  id: Chapter19MicroCheckQuestion['id'],
  conceptFamilyId: Chapter19ConceptFamilyId,
  learningObjectiveId: Chapter19LearningObjectiveId,
  difficulty: Chapter19MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter19MicroCheckAnswer,
  explanation: string,
): Chapter19MicroCheckQuestion => ({
  id,
  conceptFamilyId,
  learningObjectiveId,
  difficulty,
  question,
  answer_a,
  answer_b,
  answer_c,
  answer_d,
  correctAnswer,
  explanation,
})

export const chapter19MicroChecks: readonly Chapter19MicroCheck[] = [
  {
    id: 'mc-19-01',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-licensing-requirements-verification',
    learningObjectiveId: 'LO-19-01',
    title: 'Licensing Requirements & Official Verification Check',
    questions: [
      q(
        'mcq-19-001',
        'ch19-licensing-requirements-verification',
        'LO-19-01',
        'application',
        'A classmate says the barber licensing process is the same in every state because the profession is the same. What is the best response?',
        'Use the classmate’s state requirements because they are recent',
        'Verify the current requirements for the specific jurisdiction with the official licensing agency and authorized exam provider',
        'Use a social-media checklist if several people agree with it',
        'Wait until after beginning paid services to confirm the license path',
        'b',
        'Licensing requirements can differ by jurisdiction and change over time. Official licensing and authorized exam-provider sources control the current path for that jurisdiction.',
      ),
      q(
        'mcq-19-002',
        'ch19-licensing-requirements-verification',
        'LO-19-01',
        'scenario',
        'A student has an old candidate bulletin that lists identification and testing-site rules. What should the student do before exam day?',
        'Use the older bulletin if its publication date is within the same licensing cycle',
        'Compare the bulletin with a current school checklist and use whichever source is more detailed',
        'Verify the current bulletin or instructions from the applicable agency or authorized provider',
        'Use the old identification rules unless the testing vendor sends a separate reminder',
        'c',
        'Candidate instructions can change. Current official instructions should be verified before relying on older requirements for identification, supplies, arrival, or testing-site rules.',
      ),
    ],
  },
  {
    id: 'mc-19-02',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-exam-preparation-test-reasoning',
    learningObjectiveId: 'LO-19-02',
    title: 'Exam Preparation & Test Reasoning Check',
    questions: [
      q(
        'mcq-19-003',
        'ch19-exam-preparation-test-reasoning',
        'LO-19-02',
        'application',
        'A student keeps missing questions about the same topic but memorizes the answer letters afterward. What is the stronger study response?',
        'Keep memorizing answer letters from the practice set',
        'Return to the underlying concept and explain why the correct answer is correct',
        'Stop using practice questions entirely',
        'Choose the longest answer next time',
        'b',
        'Practice questions are most useful when they reveal a knowledge gap. Reviewing the underlying concept builds transferable understanding instead of memorizing one item.',
      ),
      q(
        'mcq-19-004',
        'ch19-exam-preparation-test-reasoning',
        'LO-19-02',
        'understanding',
        'Why should words such as “best,” “first,” “except,” or “not” receive special attention in a test question?',
        'They make the longest answer correct',
        'They can change what the question is actually asking',
        'They mean the question should always be skipped',
        'They prove one answer is false without reading the choices',
        'b',
        'Qualifiers can change the task in the stem. Reading the complete question carefully is more reliable than applying a shortcut.',
      ),
    ],
  },
  {
    id: 'mc-19-03',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-practical-exam-safety-readiness',
    learningObjectiveId: 'LO-19-03',
    title: 'Practical Exam, Infection Control & Safety Readiness Check',
    questions: [
      q(
        'mcq-19-005',
        'ch19-practical-exam-safety-readiness',
        'LO-19-03',
        'scenario',
        'A student practiced a practical-exam kit based on another state’s video. What should happen before using that setup for the actual exam?',
        'Use it unchanged because barber practical exams are standardized everywhere',
        'Verify the current permitted or required kit, labeling, setup, procedures, and timing from the applicable official instructions',
        'Add extra tools in case the provider forgot to list them',
        'Remove infection-control supplies to save space',
        'b',
        'Practical-exam formats and supply rules are jurisdiction/provider specific. Current official instructions must control the setup and procedure plan.',
      ),
      q(
        'mcq-19-006',
        'ch19-practical-exam-safety-readiness',
        'LO-19-03',
        'application',
        'During a practical rehearsal, the student completes the technique but repeatedly skips a required infection-control step. What is the best response?',
        'Ignore the step because the haircut result is correct',
        'Increase speed so the missed step matters less',
        'Correct the safety process before focusing on speed',
        'Wait until exam day to see whether the evaluator notices',
        'c',
        'When infection-control or service-safety steps are required, they are part of the performance. Process errors should be corrected before increasing speed.',
      ),
    ],
  },
  {
    id: 'mc-19-04',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-employment-readiness-professionalism',
    learningObjectiveId: 'LO-19-04',
    title: 'Employment Readiness & Professionalism Check',
    questions: [
      q(
        'mcq-19-007',
        'ch19-employment-readiness-professionalism',
        'LO-19-04',
        'application',
        'A student has not yet earned a barber license but wants the résumé to look stronger. What is the professional approach?',
        'List the license as completed because graduation is close',
        'Describe current training accurately and list only credentials actually earned',
        'Leave all education off the résumé',
        'Ask a friend to confirm the license if questioned',
        'b',
        'Professional integrity requires accurate representation of current training, abilities, and credentials. Planned credentials should not be presented as already earned.',
      ),
      q(
        'mcq-19-008',
        'ch19-employment-readiness-professionalism',
        'LO-19-04',
        'understanding',
        'Which behavior best reflects a strong work ethic?',
        'Working the most hours regardless of quality',
        'Being dependable, prepared, respectful, consistent, and accountable',
        'Accepting every service regardless of competence or scope',
        'Avoiding feedback so confidence remains high',
        'b',
        'Work ethic is demonstrated through dependable and accountable professional behavior, not simply hours worked or willingness to accept every task.',
      ),
    ],
  },
  {
    id: 'mc-19-05',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-resume-portfolio-application-materials',
    learningObjectiveId: 'LO-19-05',
    title: 'Résumé, Portfolio & Application Materials Check',
    questions: [
      q(
        'mcq-19-009',
        'ch19-resume-portfolio-application-materials',
        'LO-19-05',
        'application',
        'Which résumé entry is strongest for a new barbering applicant?',
        'A credential that is expected next month but has not been earned',
        'An accurate description of relevant education, experience, skills, and accomplishments',
        'A long list of unrelated personal details',
        'A claim that cannot be verified but sounds impressive',
        'b',
        'Application materials should be accurate, relevant, and easy to understand. Current qualifications and accomplishments are stronger than exaggerated or premature claims.',
      ),
      q(
        'mcq-19-010',
        'ch19-resume-portfolio-application-materials',
        'LO-19-05',
        'scenario',
        'A student wants to add a strong before-and-after client photo to a portfolio. What should be checked first?',
        'Whether the image has enough social-media likes',
        'Whether the student has permission to use the client image and is following applicable school or shop policy',
        'Whether the client knows the employer personally',
        'Whether the image can be edited to hide the service result',
        'b',
        'Client images should be used only with appropriate permission and in accordance with applicable school or shop policies.',
      ),
    ],
  },
  {
    id: 'mc-19-06',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-job-search-shop-research-interview',
    learningObjectiveId: 'LO-19-06',
    title: 'Job Search, Shop Research & Interview Practice Check',
    questions: [
      q(
        'mcq-19-011',
        'ch19-job-search-shop-research-interview',
        'LO-19-06',
        'application',
        'A shop’s social-media page describes its culture and compensation, but the job offer uses different wording. What should the applicant do?',
        'Assume the social-media page overrides the offer',
        'Confirm important terms directly with the employer before deciding',
        'Ignore compensation details until after starting',
        'Assume every shop uses the same arrangement',
        'b',
        'Public-facing information can be incomplete. Important expectations, schedule, compensation structure, and working terms should be confirmed directly.',
      ),
      q(
        'mcq-19-012',
        'ch19-job-search-shop-research-interview',
        'LO-19-06',
        'scenario',
        'An employer says, “We will contact you by Friday; please do not call before then.” What is the strongest follow-up approach?',
        'Call every day to show enthusiasm',
        'Respect the stated communication timeline and follow up professionally if needed afterward',
        'Post publicly asking why the employer has not replied',
        'Visit the shop unannounced the next morning',
        'b',
        'Professional follow-up should respect the employer’s stated communication instructions rather than rely on one universal follow-up schedule.',
      ),
    ],
  },
  {
    id: 'mc-19-07',
    afterSectionId: 'chapter-19-lesson',
    conceptFamilyId: 'ch19-employment-law-contracts-compliance',
    learningObjectiveId: 'LO-19-07',
    title: 'Employment Law, Contracts & Professional Compliance Check',
    questions: [
      q(
        'mcq-19-013',
        'ch19-employment-law-contracts-compliance',
        'LO-19-07',
        'application',
        'An interview question raises a concern about a protected characteristic. What is the strongest general response?',
        'Assume the question is illegal everywhere based on a generic online list',
        'Stay professional and verify the applicable rule through an appropriate official, workforce, or qualified legal resource',
        'Assume employers may ask anything during an interview',
        'Treat the issue as a bodily-safety emergency',
        'b',
        'Interview-law boundaries can vary by jurisdiction and situation. Legal/compliance concerns should be verified through an appropriate source and remain distinct from urgent bodily-safety escalation.',
      ),
      q(
        'mcq-19-014',
        'ch19-employment-law-contracts-compliance',
        'LO-19-07',
        'scenario',
        'A proposed agreement contains a noncompete clause the applicant does not understand. What is the most prudent action?',
        'Sign immediately because every written clause is enforceable',
        'Assume the clause is invalid everywhere and ignore it',
        'Read the full agreement, ask about unclear terms, keep a copy, and seek qualified legal advice when the consequences are significant',
        'Ask a coworker to decide whether the clause is legal',
        'c',
        'Agreement meaning and enforceability depend on the wording, facts, and applicable law. The student should not assume a clause is always valid or always invalid.',
      ),
    ],
  },
]

export interface Chapter19MicroCheckResponse {
  questionId: Chapter19MicroCheckQuestion['id']
  selectedAnswer: Chapter19MicroCheckAnswer
}

export function buildChapter19MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter19MicroCheckResponse[],
  timestamp: string,
): Chapter19EvidenceRecord[] {
  const questionMap = new Map(
    chapter19MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question] as const),
    ),
  )
  const seen = new Set<string>()
  const records: Chapter19EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-19',
      conceptFamilyId: question.conceptFamilyId,
      source: 'micro_check',
      itemId: question.id,
      difficulty: question.difficulty,
      correct: response.selectedAnswer === question.correctAnswer,
      attemptPhase: 'initial',
      timestamp,
    })
  }

  return records
}

export function mergeChapter19EvidenceWithoutContamination(
  existing: readonly Chapter19EvidenceRecord[],
  incoming: readonly Chapter19EvidenceRecord[],
): Chapter19EvidenceRecord[] {
  const merged = [...existing]
  const keys = new Set(
    existing.map((record) =>
      [
        record.studentId,
        record.chapterId,
        record.source,
        record.attemptPhase,
        record.itemId,
      ].join('|'),
    ),
  )

  for (const record of incoming) {
    const key = [
      record.studentId,
      record.chapterId,
      record.source,
      record.attemptPhase,
      record.itemId,
    ].join('|')
    if (keys.has(key)) continue
    keys.add(key)
    merged.push(record)
  }

  return merged
}

export function validateChapter19MicroCheckPlacements(): boolean {
  if (chapter19MicroChecks.length !== chapter19MicroCheckPlacements.length) return false
  return chapter19MicroChecks.every((check) => {
    const placement = chapter19MicroCheckPlacements.find((item) => item.id === check.id)
    return (
      !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
    )
  })
}
