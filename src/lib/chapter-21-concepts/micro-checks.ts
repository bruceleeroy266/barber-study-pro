import type {
  Chapter21ConceptFamilyId,
  Chapter21LearningObjectiveId,
} from './types'
import type { Chapter21Difficulty, Chapter21EvidenceRecord } from './grading'
import { chapter21MicroCheckPlacements } from './mappings'

export type Chapter21MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter21MicroCheckQuestion {
  id: `mcq-21-${string}`
  conceptFamilyId: Chapter21ConceptFamilyId
  learningObjectiveId: Chapter21LearningObjectiveId
  difficulty: Exclude<Chapter21Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter21MicroCheckAnswer
  explanation: string
}

export interface Chapter21MicroCheck {
  id: `mc-21-${string}`
  afterSectionId:
    | 'ch21-lo1'
    | 'ch21-lo2'
    | 'ch21-lo3'
    | 'ch21-lo4'
    | 'ch21-lo5'
    | 'ch21-lo6'
    | 'ch21-lo7'
    | 'ch21-lo8'
  conceptFamilyId: Chapter21ConceptFamilyId
  learningObjectiveId: Chapter21LearningObjectiveId
  title: string
  questions: readonly Chapter21MicroCheckQuestion[]
}

const q = (
  id: Chapter21MicroCheckQuestion['id'],
  conceptFamilyId: Chapter21ConceptFamilyId,
  learningObjectiveId: Chapter21LearningObjectiveId,
  difficulty: Chapter21MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter21MicroCheckAnswer,
  explanation: string,
): Chapter21MicroCheckQuestion => ({
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

export const chapter21MicroChecks: readonly Chapter21MicroCheck[] = [
  {
    id: 'mc-21-01',
    afterSectionId: 'ch21-lo1',
    conceptFamilyId: 'ch21-business-entry-paths',
    learningObjectiveId: 'LO-21-01',
    title: 'Business Entry Paths Check',
    questions: [
      q(
        'mcq-21-001',
        'ch21-business-entry-paths',
        'LO-21-01',
        'application',
        'A barber wants more independence but does not want full-shop overhead yet. What is the strongest next step?',
        'Compare an independent-contractor arrangement mainly by whether the barber sets their own schedule',
        'Compare a properly structured rental arrangement with shop ownership using costs, control, agreement terms, and management responsibility',
        'Choose chair rental whenever the weekly rent is lower than projected shop overhead',
        'Choose shop ownership first, then estimate management responsibilities after opening',
        'b',
        'The decision should compare the real costs, control, agreement terms, and responsibilities rather than assume one path or label is automatically correct.',
      ),
      q(
        'mcq-21-002',
        'ch21-business-entry-paths',
        'LO-21-01',
        'scenario',
        'A barber has strong clientele but limited cash reserves. Which factor should be weighed most carefully before opening a shop?',
        'Whether the shop name sounds expensive',
        'Projected fixed costs, revenue ramp, financing, client demand, and management readiness',
        'Whether another barber already owns an LLC',
        'Whether the barber can avoid written agreements',
        'b',
        'Readiness for ownership depends on realistic financial and operational facts, not image or another owner’s entity choice.',
      ),
    ],
  },
  {
    id: 'mc-21-02',
    afterSectionId: 'ch21-lo2',
    conceptFamilyId: 'ch21-shop-opening-planning',
    learningObjectiveId: 'LO-21-02',
    title: 'Shop Opening & Planning Check',
    questions: [
      q(
        'mcq-21-003',
        'ch21-shop-opening-planning',
        'LO-21-02',
        'application',
        'Before signing a lease, what is the strongest due-diligence approach?',
        'Verify zoning and occupancy first, then defer startup-cost and staffing analysis until after signing',
        'Verify location fit, realistic startup costs, zoning/occupancy, required registrations or licenses, insurance, and staffing assumptions',
        'Compare rent and build-out costs, but treat licensing and insurance as post-opening tasks',
        'Prioritize client demand and location fit, while assuming the lease terms can be corrected later',
        'b',
        'Opening decisions should combine market, cash, regulatory, insurance, and staffing facts before a long-term commitment is signed.',
      ),
      q(
        'mcq-21-004',
        'ch21-shop-opening-planning',
        'LO-21-02',
        'scenario',
        'A barber asks how many months of operating cash every new shop must keep. What is the best answer?',
        'Use three months of fixed costs because service businesses usually stabilize within that period',
        'Use six months of expenses because a longer reserve would unnecessarily reduce startup capital',
        'Estimate the reserve from fixed costs, financing, expected revenue ramp, and risk; there is no universal required number of months',
        'Base the reserve mostly on expected walk-in demand and reduce it when projected traffic is strong',
        'c',
        'Operating reserves should be built from the actual business assumptions rather than one universal calendar rule.',
      ),
    ],
  },
  {
    id: 'mc-21-03',
    afterSectionId: 'ch21-lo3',
    conceptFamilyId: 'ch21-ownership-legal-structures',
    learningObjectiveId: 'LO-21-03',
    title: 'Ownership & Legal Structures Check',
    questions: [
      q(
        'mcq-21-005',
        'ch21-ownership-legal-structures',
        'LO-21-03',
        'application',
        'A first-time owner asks which entity is always best for a single-owner shop. What is the strongest response?',
        'Choose an LLC primarily for liability protection, then address tax and financing consequences after formation',
        'Choose a corporation primarily for growth potential, even if the owner has not compared tax or governance requirements',
        'Compare liability, tax treatment, governance, filing, insurance, financing, and current rules before choosing',
        'Remain a sole proprietor unless projected revenue reaches a level that justifies changing the entity',
        'c',
        'No single entity is universally best; the decision depends on the owner’s facts and current legal and tax requirements.',
      ),
      q(
        'mcq-21-006',
        'ch21-ownership-legal-structures',
        'LO-21-03',
        'scenario',
        'An owner believes forming an LLC means personal assets can never be exposed. What should the owner understand?',
        'An LLC usually protects personal assets as long as the business carries adequate insurance',
        'Liability protection can be limited and depends on proper formation, maintenance, conduct, contracts, insurance, and applicable law',
        'An LLC can reduce some liability exposure, so contracts and insurance become less important for routine operations',
        'Proper entity formation protects owners from most contractual risk even when agreements are informal',
        'b',
        'Entity protection is not absolute and does not replace sound contracts, insurance, or compliance.',
      ),
    ],
  },
  {
    id: 'mc-21-04',
    afterSectionId: 'ch21-lo4',
    conceptFamilyId: 'ch21-business-plan-financial-planning',
    learningObjectiveId: 'LO-21-04',
    title: 'Business Plan & Financial Planning Check',
    questions: [
      q(
        'mcq-21-007',
        'ch21-business-plan-financial-planning',
        'LO-21-04',
        'application',
        'What makes a financial projection useful instead of just optimistic?',
        'Using the highest possible revenue estimate',
        'Documenting assumptions, testing realistic ranges, and linking revenue and expenses to actual market and operating facts',
        'Leaving out slow months',
        'Assuming every chair will be full immediately',
        'b',
        'Useful projections are transparent about assumptions and can be tested against realistic market and operating conditions.',
      ),
      q(
        'mcq-21-008',
        'ch21-business-plan-financial-planning',
        'LO-21-04',
        'scenario',
        'A shop forecast shows strong sales but no cash-flow shortages because expenses are recorded only annually. What is the problem?',
        'Annual profitability may be enough if the shop maintains a cash reserve for seasonal timing differences',
        'The forecast may hide timing problems because cash inflows and outflows must be modeled when they actually occur',
        'Cash-flow timing matters mainly during startup; once sales stabilize, annual profit becomes the stronger planning measure',
        'Break-even analysis can substitute for monthly cash-flow modeling when fixed and variable costs are estimated accurately',
        'b',
        'A business can be profitable on paper and still run short of cash if payment timing is not modeled.',
      ),
    ],
  },
  {
    id: 'mc-21-05',
    afterSectionId: 'ch21-lo5',
    conceptFamilyId: 'ch21-recordkeeping-financial-compliance',
    learningObjectiveId: 'LO-21-05',
    title: 'Recordkeeping & Financial Compliance Check',
    questions: [
      q(
        'mcq-21-009',
        'ch21-recordkeeping-financial-compliance',
        'LO-21-05',
        'application',
        'Which recordkeeping practice best supports accurate reporting?',
        'Record income and expenses monthly, but reconstruct missing cash transactions from bank deposits at year-end',
        'Keep consistent income, expense, and supporting records and verify current retention/reporting requirements',
        'Keep digital payment records as the primary source and summarize cash activity separately without transaction-level support',
        'Enter each expense promptly and discard supporting documents once the bookkeeping system shows the total',
        'b',
        'Contemporaneous records are more reliable than estimates and help support current reporting, tax, and business requirements.',
      ),
      q(
        'mcq-21-010',
        'ch21-recordkeeping-financial-compliance',
        'LO-21-05',
        'scenario',
        'A shop wants to collect extensive personal information from every client “just in case.” What is the strongest approach?',
        'Collect a broad client profile to support future marketing, as long as access is limited to staff',
        'Collect only information with a legitimate service or business purpose, protect access, and follow privacy/security requirements',
        'Collect only service-relevant information, but store it in a shared spreadsheet so staff can access it easily',
        'Collect client details for service and referral purposes, then share them with partners unless a client opts out',
        'b',
        'Minimum-necessary collection and appropriate protection reduce privacy risk while preserving useful service records.',
      ),
    ],
  },
  {
    id: 'mc-21-06',
    afterSectionId: 'ch21-lo6',
    conceptFamilyId: 'ch21-booth-rental-independent-business-responsibilities',
    learningObjectiveId: 'LO-21-06',
    title: 'Booth Rental & Independent Business Responsibilities Check',
    questions: [
      q(
        'mcq-21-011',
        'ch21-booth-rental-independent-business-responsibilities',
        'LO-21-06',
        'application',
        'A contract calls a barber a booth renter. What should determine the actual tax and business responsibilities?',
        'The label alone',
        'The actual agreement and working relationship, including control, payments, expenses, insurance, licensing, records, and current rules',
        'Whether rent is paid weekly',
        'Whether the barber owns clippers',
        'b',
        'Worker and business responsibilities depend on the real facts and applicable rules, not one label or isolated factor.',
      ),
      q(
        'mcq-21-012',
        'ch21-booth-rental-independent-business-responsibilities',
        'LO-21-06',
        'scenario',
        'A renter wants to use a fixed 25% savings rule for taxes without reviewing the actual situation. What is the strongest response?',
        'Use a fixed percentage based on last year’s effective tax rate and adjust only if income changes substantially',
        'Use a conservative fixed percentage for savings because over-withholding is preferable to recalculating during the year',
        'Estimate obligations from actual income, deductions, structure, withholding, state rules, and current tax guidance',
        'Base quarterly savings only on gross receipts, without adjusting for deductions or business structure until filing',
        'c',
        'A fixed percentage is not a universal rule; tax planning depends on the facts and current requirements.',
      ),
    ],
  },
  {
    id: 'mc-21-07',
    afterSectionId: 'ch21-lo7',
    conceptFamilyId: 'ch21-shop-operations-management',
    learningObjectiveId: 'LO-21-07',
    title: 'Shop Operations & Management Check',
    questions: [
      q(
        'mcq-21-013',
        'ch21-shop-operations-management',
        'LO-21-07',
        'application',
        'A shop is busy but cash is tight and complaints are increasing. What should management do first?',
        'Add expensive décor immediately',
        'Review scheduling, revenue, expenses, client feedback, staffing, and process data before choosing changes',
        'Assume busy means profitable',
        'Cut all prices permanently',
        'b',
        'Operations decisions should start with evidence so the shop can identify the real source of financial or service problems.',
      ),
      q(
        'mcq-21-014',
        'ch21-shop-operations-management',
        'LO-21-07',
        'scenario',
        'Which statement best describes Chapter 21’s role in cleanliness?',
        'It incorporates cleanliness into daily operations and lets the shop simplify safety procedures when local rules are less specific',
        'It treats cleanliness as an operations responsibility while safety procedures remain governed by the dedicated safety curriculum and current rules',
        'It treats cleanliness as an operations system that each shop may customize as long as the written policy is consistent',
        'It treats cleanliness as a client-experience standard, while infection-control details are handled mainly during inspections',
        'b',
        'Chapter 21 addresses operational responsibility without duplicating or weakening the safety curriculum.',
      ),
    ],
  },
  {
    id: 'mc-21-08',
    afterSectionId: 'ch21-lo8',
    conceptFamilyId: 'ch21-advertising-marketing-client-consent',
    learningObjectiveId: 'LO-21-08',
    title: 'Advertising, Marketing & Client Consent Check',
    questions: [
      q(
        'mcq-21-015',
        'ch21-advertising-marketing-client-consent',
        'LO-21-08',
        'application',
        'A barber wants to use a recognizable client photo in a promotion. What should happen first?',
        'Post it if the client tagged the shop previously',
        'Obtain clear permission and follow applicable privacy, advertising, platform, school, and shop rules',
        'Use the photo because the haircut was paid for',
        'Hide the client name and assume permission is unnecessary',
        'b',
        'Identifiable client content should be used only with appropriate permission and applicable policy/legal requirements.',
      ),
      q(
        'mcq-21-016',
        'ch21-advertising-marketing-client-consent',
        'LO-21-08',
        'scenario',
        'A shop creates a referral promotion. What makes the offer professionally sound?',
        'Use appealing referral language and place material restrictions in the terms page linked from the promotion',
        'Use truthful claims, clear material terms, appropriate disclosures, and applicable advertising/referral rules',
        'Use strong performance claims if prior promotions produced similar booking results and the shop can document them',
        'Offer the referral benefit only when clients agree to create promotional content that the shop can repost',
        'b',
        'Promotions should be transparent, truthful, and compliant rather than relying on hidden terms or guaranteed outcomes.',
      ),
    ],
  },
] as const

export interface Chapter21MicroCheckResponse {
  questionId: Chapter21MicroCheckQuestion['id']
  selectedAnswer: Chapter21MicroCheckAnswer
}

export function buildChapter21MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter21MicroCheckResponse[],
  timestamp: string,
): Chapter21EvidenceRecord[] {
  const questionMap = new Map(
    chapter21MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question] as const),
    ),
  )
  const seen = new Set<string>()
  const records: Chapter21EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-21',
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

export function mergeChapter21EvidenceWithoutContamination(
  existing: readonly Chapter21EvidenceRecord[],
  incoming: readonly Chapter21EvidenceRecord[],
): Chapter21EvidenceRecord[] {
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

export function validateChapter21MicroCheckPlacements(): boolean {
  if (chapter21MicroChecks.length !== chapter21MicroCheckPlacements.length) {
    return false
  }

  return chapter21MicroChecks.every((check) => {
    const placement = chapter21MicroCheckPlacements.find(
      (item) => item.id === check.id,
    )
    return (
      !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
    )
  })
}
