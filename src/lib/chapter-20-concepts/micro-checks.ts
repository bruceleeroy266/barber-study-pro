import type {
  Chapter20ConceptFamilyId,
  Chapter20LearningObjectiveId,
} from './types'
import type { Chapter20Difficulty, Chapter20EvidenceRecord } from './grading'
import { chapter20MicroCheckPlacements } from './mappings'

export type Chapter20MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter20MicroCheckQuestion {
  id: `mcq-20-${string}`
  conceptFamilyId: Chapter20ConceptFamilyId
  learningObjectiveId: Chapter20LearningObjectiveId
  difficulty: Exclude<Chapter20Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter20MicroCheckAnswer
  explanation: string
}

export interface Chapter20MicroCheck {
  id: `mc-20-${string}`
  afterSectionId: 'ch20-lo1' | 'ch20-lo2' | 'ch20-lo3' | 'ch20-lo4' | 'ch20-lo5' | 'ch20-lo6'
  conceptFamilyId: Chapter20ConceptFamilyId
  learningObjectiveId: Chapter20LearningObjectiveId
  title: string
  questions: readonly Chapter20MicroCheckQuestion[]
}

const q = (
  id: Chapter20MicroCheckQuestion['id'],
  conceptFamilyId: Chapter20ConceptFamilyId,
  learningObjectiveId: Chapter20LearningObjectiveId,
  difficulty: Chapter20MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter20MicroCheckAnswer,
  explanation: string,
): Chapter20MicroCheckQuestion => ({
  id, conceptFamilyId, learningObjectiveId, difficulty,
  question, answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter20MicroChecks: readonly Chapter20MicroCheck[] = [
  {
    id: 'mc-20-01',
    afterSectionId: 'ch20-lo1',
    conceptFamilyId: 'ch20-professional-transition-workplace-expectations',
    learningObjectiveId: 'LO-20-01',
    title: 'Professional Transition & Workplace Expectations Check',
    questions: [
      q('mcq-20-001','ch20-professional-transition-workplace-expectations','LO-20-01','application',
        'A barber has a personal event during a scheduled shift with booked clients. What is the strongest professional response?',
        'Miss the shift without notice because personal plans take priority',
        'Follow the shop’s call-off or schedule-change process early and protect client commitments when possible',
        'Ask a coworker to cover without informing management',
        'Wait until the first client arrives to decide',
        'b','Professional reliability means using the shop’s established process, communicating early, and considering the effect on clients and coworkers.'),
      q('mcq-20-002','ch20-professional-transition-workplace-expectations','LO-20-01','scenario',
        'A new barber is unsure whether a cleanup duty belongs to the role. What is the best next step?',
        'Ignore the task because it is not a haircut',
        'Clarify the expectation with the manager and use the job description or written shop policy when available',
        'Refuse all duties not discussed during school',
        'Ask another new barber to decide',
        'b','Clarifying expectations prevents misunderstanding and supports accountability without assuming every task automatically belongs to the role.'),
    ],
  },
  {
    id: 'mc-20-02',
    afterSectionId: 'ch20-lo2',
    conceptFamilyId: 'ch20-teamwork-workplace-relationships',
    learningObjectiveId: 'LO-20-02',
    title: 'Teamwork & Workplace Relationships Check',
    questions: [
      q('mcq-20-003','ch20-teamwork-workplace-relationships','LO-20-02','application',
        'A coworker repeatedly leaves shared tasks unfinished. Which response best supports a professional team?',
        'Complain about the coworker to clients',
        'Address the behavior directly and respectfully, focusing on the work impact',
        'Ignore it indefinitely',
        'Post about the issue in a staff group chat without speaking to the person',
        'b','Constructive conflict resolution addresses the specific behavior directly and respectfully instead of using gossip or avoidance.'),
      q('mcq-20-004','ch20-teamwork-workplace-relationships','LO-20-02','understanding',
        'What does respecting a more experienced coworker require?',
        'Accepting every instruction even when it is inappropriate',
        'Learning from experience while still communicating legitimate concerns professionally',
        'Giving up your own professional judgment permanently',
        'Avoiding questions so you do not appear inexperienced',
        'b','Professional respect includes humility and learning, but it does not require blind obedience or silence about legitimate concerns.'),
    ],
  },
  {
    id: 'mc-20-03',
    afterSectionId: 'ch20-lo3',
    conceptFamilyId: 'ch20-employment-classification-compensation',
    learningObjectiveId: 'LO-20-03',
    title: 'Employment Classification & Compensation Check',
    questions: [
      q('mcq-20-005','ch20-employment-classification-compensation','LO-20-03','application',
        'A shop calls every barber an independent contractor. What should determine whether that classification is accurate?',
        'The label used by the shop',
        'The actual working relationship, including control, financial independence, and the relationship between the parties',
        'Whether the barber is paid weekly',
        'Whether the barber owns clippers',
        'b','Classification depends on the facts and circumstances of the working relationship, not a title or one isolated factor.'),
      q('mcq-20-006','ch20-employment-classification-compensation','LO-20-03','scenario',
        'A booth-rental agreement is vague about pricing, scheduling, client records, and fees. What should the barber do before signing?',
        'Assume the usual industry practice will control',
        'Clarify the written terms and verify applicable legal and tax responsibilities',
        'Sign first and negotiate after opening day',
        'Treat the booth-rental label as proof of every responsibility',
        'b','A booth-rental label does not answer every legal or business question. Important responsibilities should be clarified in the agreement and verified under current rules.'),
    ],
  },
  {
    id: 'mc-20-04',
    afterSectionId: 'ch20-lo4',
    conceptFamilyId: 'ch20-financial-responsibility-income-reporting',
    learningObjectiveId: 'LO-20-04',
    title: 'Financial Responsibility & Income Reporting Check',
    questions: [
      q('mcq-20-007','ch20-financial-responsibility-income-reporting','LO-20-04','application',
        'Which recordkeeping practice best supports accurate income reporting?',
        'Reconcile cash income at the end of each month using deposits and appointment records rather than recording each tip or payment',
        'Track tips and other income consistently and keep supporting records',
        'Record electronic payments in detail and summarize cash tips as a weekly total',
        'Track service revenue consistently but treat small cash tips as optional if they are not deposited',
        'b','Consistent contemporaneous records are more reliable than memory and help support current tax and financial reporting obligations.'),
      q('mcq-20-008','ch20-financial-responsibility-income-reporting','LO-20-04','scenario',
        'A barber wants to raise service prices. Which approach is strongest?',
        'Use a regular annual increase tied to inflation and product costs so clients can anticipate the timing',
        'Review skill level, costs, demand, market conditions, client communication, and shop policy before deciding',
        'Match the local market leader if demand is strong and explain the increase to clients afterward',
        'Raise prices when the schedule stays consistently full, using demand as the primary signal even if costs are stable',
        'b','Pricing decisions should reflect the barber’s real business conditions rather than a universal calendar rule.'),
    ],
  },
  {
    id: 'mc-20-05',
    afterSectionId: 'ch20-lo5',
    conceptFamilyId: 'ch20-ethical-selling-retailing',
    learningObjectiveId: 'LO-20-05',
    title: 'Ethical Selling & Retailing Check',
    questions: [
      q('mcq-20-009','ch20-ethical-selling-retailing','LO-20-05','application',
        'A client says a recommended product is too expensive. What is the best response?',
        'Offer a lower-priced alternative first, then explain the original product if the client asks about the price difference',
        'Acknowledge the concern, explain relevant benefits honestly, and respect the client’s decision',
        'Emphasize the product’s likely results and promise a refund if the client is dissatisfied',
        'Offer a discount immediately rather than discussing whether the product fits the client’s needs',
        'b','Ethical selling is client-centered: clarify needs, explain relevant benefits truthfully, and avoid pressure or unsupported promises.'),
      q('mcq-20-010','ch20-ethical-selling-retailing','LO-20-05','understanding',
        'What should guide a product or service recommendation?',
        'The highest commission available',
        'The client’s identified needs and a truthful explanation of benefits',
        'The most expensive option',
        'A script used identically with every client',
        'b','A professional recommendation starts with the client’s actual need and uses accurate information rather than pressure or commission alone.'),
    ],
  },
  {
    id: 'mc-20-06',
    afterSectionId: 'ch20-lo6',
    conceptFamilyId: 'ch20-client-retention-marketing-consent',
    learningObjectiveId: 'LO-20-06',
    title: 'Client Retention, Marketing & Consent Check',
    questions: [
      q('mcq-20-011','ch20-client-retention-marketing-consent','LO-20-06','application',
        'A barber wants to post a recognizable client photo. What should happen first?',
        'Post it immediately if the haircut looks good',
        'Obtain clear client permission and follow applicable shop, platform, privacy, and advertising rules',
        'Tag the client so permission is unnecessary',
        'Use a filter to avoid consent requirements',
        'b','Identifiable client content should not be used casually. Clear permission and applicable policy or legal requirements should be checked before posting.'),
      q('mcq-20-012','ch20-client-retention-marketing-consent','LO-20-06','scenario',
        'A barber creates a referral promotion. What makes the offer professionally sound?',
        'Hidden restrictions that are explained only after booking',
        'Clear offer terms that follow shop policy and applicable advertising rules',
        'A promise that every referred client will receive the same result',
        'A reward that requires posting client photos without permission',
        'b','Referral programs should use clear, ethical terms and respect shop policy, advertising rules, and client consent.'),
    ],
  },
] as const

export interface Chapter20MicroCheckResponse {
  questionId: Chapter20MicroCheckQuestion['id']
  selectedAnswer: Chapter20MicroCheckAnswer
}

export function buildChapter20MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter20MicroCheckResponse[],
  timestamp: string,
): Chapter20EvidenceRecord[] {
  const questionMap = new Map(
    chapter20MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question] as const),
    ),
  )
  const seen = new Set<string>()
  const records: Chapter20EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-20',
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

export function mergeChapter20EvidenceWithoutContamination(
  existing: readonly Chapter20EvidenceRecord[],
  incoming: readonly Chapter20EvidenceRecord[],
): Chapter20EvidenceRecord[] {
  const merged = [...existing]
  const keys = new Set(existing.map((record) =>
    [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|'),
  ))

  for (const record of incoming) {
    const key = [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|')
    if (keys.has(key)) continue
    keys.add(key)
    merged.push(record)
  }
  return merged
}

export function validateChapter20MicroCheckPlacements(): boolean {
  if (chapter20MicroChecks.length !== chapter20MicroCheckPlacements.length) return false
  return chapter20MicroChecks.every((check) => {
    const placement = chapter20MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
