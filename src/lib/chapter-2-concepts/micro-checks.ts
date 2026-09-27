import type { ConceptId } from './types'
import type { Chapter2Difficulty, Chapter2EvidenceRecord } from './grading'

export type Chapter2MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter2MicroCheckQuestion {
  id: `mcq-2-${string}`
  conceptId: ConceptId
  difficulty: Exclude<Chapter2Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter2MicroCheckAnswer
  explanation: string
}

export interface Chapter2MicroCheck {
  id: `mc-2-${string}`
  afterSectionId: string
  conceptId: ConceptId
  title: string
  questions: readonly Chapter2MicroCheckQuestion[]
}

const q = (
  id: Chapter2MicroCheckQuestion['id'],
  conceptId: ConceptId,
  difficulty: Chapter2MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter2MicroCheckAnswer,
  explanation: string,
): Chapter2MicroCheckQuestion => ({
  id,
  conceptId,
  difficulty,
  question,
  answer_a,
  answer_b,
  answer_c,
  answer_d,
  correctAnswer,
  explanation,
})

export const chapter2MicroChecks: readonly Chapter2MicroCheck[] = [
  {
    id: 'mc-2-01',
    afterSectionId: 'success-separators',
    conceptId: 'C-2-01',
    title: 'Life Skills Foundations Check',
    questions: [
      q('mcq-2-001','C-2-01','understanding','A barber has strong technical skills but repeatedly arrives late and communicates poorly. What does this best demonstrate?','Technical ability alone does not replace professional life skills.','Technical skill automatically compensates for poor reliability.','Life skills matter only after a barber becomes an owner.','Communication does not affect professional success.','a','Professional success depends on technical ability plus reliability, communication, self-management, and other life skills.'),
      q('mcq-2-002','C-2-01','application','Which action best reflects a strong professional life-skill habit?','Preparing early, communicating clearly, and following through on commitments.','Waiting for problems before planning the day.','Avoiding feedback to protect confidence.','Changing standards based on how busy the shop is.','a','Professional life skills show up through preparation, communication, reliability, and consistent follow-through.'),
    ],
  },
  {
    id: 'mc-2-02',
    afterSectionId: 'track-progress',
    conceptId: 'C-2-07',
    title: 'Goal Tracking Check',
    questions: [
      q('mcq-2-003','C-2-07','understanding','Why should a long-term goal be reviewed at regular intervals?','To compare progress with the plan and adjust actions when needed.','To replace the goal every week.','To avoid setting deadlines.','To focus only on the final result.','a','Tracking lets the learner compare actual progress with planned milestones and make adjustments.'),
      q('mcq-2-004','C-2-07','application','A student wants to finish required training hours by a target month. Which approach best supports that goal?','Break the total into smaller milestones and review actual progress against them.','Wait until the final month to calculate the remaining hours.','Use only a vague intention with no dates.','Change the target whenever a week is difficult.','a','Milestones and regular progress reviews turn a large goal into measurable actions.'),
    ],
  },
  {
    id: 'mc-2-03',
    afterSectionId: 'time-tools',
    conceptId: 'C-2-08',
    title: 'Time Management Check',
    questions: [
      q('mcq-2-005','C-2-08','understanding','What is the main purpose of a time-management system?','To direct limited time toward priorities instead of reacting to everything equally.','To keep every minute occupied.','To eliminate all breaks.','To guarantee that every task takes the same amount of time.','a','Time management is about prioritizing and planning limited time, not filling every minute.'),
      q('mcq-2-006','C-2-08','scenario','A barber is running behind and a walk-in requests immediate service. What is the most professional response?','Give an honest wait estimate and offer a realistic service time or booking option.','Rush the current client to create space.','Promise immediate service even if the estimate is unrealistic.','Ignore the walk-in until the schedule clears.','a','Clear expectations and realistic scheduling protect both service quality and client trust.'),
    ],
  },
  {
    id: 'mc-2-04',
    afterSectionId: 'study-system',
    conceptId: 'C-2-10',
    title: 'Study Habits Check',
    questions: [
      q('mcq-2-007','C-2-10','understanding','Which study approach is most likely to support durable learning?','Short focused sessions with planned review over time.','One long review immediately before every exam.','Reading notes once without retrieval practice.','Studying only the topics that already feel easy.','a','Focused sessions plus spaced review and active recall are stronger than one-time passive review.'),
      q('mcq-2-008','C-2-10','application','A student keeps forgetting material a week after studying it. What is the best adjustment?','Schedule repeated retrieval and review across several days.','Study the same material only once for a longer period.','Stop using practice questions.','Wait until the final exam to review again.','a','Repeated retrieval over time helps reinforce memory and exposes what still needs work.'),
    ],
  },
  {
    id: 'mc-2-05',
    afterSectionId: 'burnout-signs',
    conceptId: 'C-2-15',
    title: 'Stress & Burnout Check',
    questions: [
      q('mcq-2-009','C-2-15','understanding','Which pattern is most consistent with burnout risk?','Persistent exhaustion, irritability, disengagement, and declining performance.','Feeling tired after one unusually busy day.','Enjoying a planned day off.','Taking a normal meal break.','a','Burnout is a sustained pattern affecting energy, attitude, and performance rather than one temporary tired day.'),
      q('mcq-2-010','C-2-15','application','A student notices ongoing exhaustion and repeated mistakes. What is the most constructive response?','Adjust workload and recovery habits and seek appropriate support before performance worsens.','Ignore the pattern until graduation.','Add more hours without rest to catch up.','Stop communicating with instructors.','a','Early workload adjustment, recovery, and appropriate support can reduce the risk of worsening burnout.'),
    ],
  },
  {
    id: 'mc-2-06',
    afterSectionId: 'consultation-skills',
    conceptId: 'C-2-18',
    title: 'Active Listening & Consultation Check',
    questions: [
      q('mcq-2-011','C-2-18','understanding','What best confirms that the barber understood a client request?','Restating the request in clear terms and getting confirmation before beginning.','Assuming the request based on the client’s usual service.','Starting the service and asking questions later.','Repeating only the haircut name without details.','a','Restating and confirming key details reduces misunderstanding before the service begins.'),
      q('mcq-2-012','C-2-18','scenario','A client uses a vague phrase such as “clean it up.” What is the best next step?','Ask specific follow-up questions and confirm the desired result.','Choose the barber’s preferred interpretation.','Begin with the shortest option to save time.','Avoid clarification so the consultation stays brief.','a','Specific questions and confirmation are essential when the request is ambiguous.'),
    ],
  },
  {
    id: 'mc-2-07',
    afterSectionId: 'ethical-checklist',
    conceptId: 'C-2-12',
    title: 'Professional Ethics Check',
    questions: [
      q('mcq-2-013','C-2-12','understanding','Which behavior best reflects professional ethics?','Being truthful about skill limits and recommending only what serves the client appropriately.','Promising results that are uncertain to secure the sale.','Hiding mistakes when the client is unlikely to notice.','Recommending products mainly because they have the highest price.','a','Professional ethics includes honesty, accountability, and recommendations based on the client’s legitimate needs.'),
      q('mcq-2-014','C-2-12','scenario','A client requests a service the barber is not confident performing. What is the most ethical response?','Explain the limitation honestly and offer an appropriate referral or alternative.','Attempt it without telling the client.','Guarantee the result to maintain confidence.','Ask another student to complete it without explanation.','a','Honesty about competence protects the client and supports professional trust.'),
    ],
  },
  {
    id: 'mc-2-08',
    afterSectionId: 'conflict-resolution',
    conceptId: 'C-2-14',
    title: 'Service Recovery Check',
    questions: [
      q('mcq-2-015','C-2-14','understanding','What should happen before proposing a solution to a client complaint?','Listen fully and make sure the concern is understood.','Immediately defend the original service.','Explain why the client is mistaken.','Offer the same solution to every complaint.','a','Effective recovery starts by understanding the concern before choosing a solution.'),
      q('mcq-2-016','C-2-14','scenario','A client says the finished service does not match the consultation. What is the best first response?','Listen, acknowledge the concern, and clarify what outcome the client expected.','Tell the client the service is technically correct.','End the conversation because the service is complete.','Offer a discount before hearing the concern.','a','Listening and clarifying the expected result creates the basis for an appropriate recovery plan.'),
    ],
  },
  {
    id: 'mc-2-09',
    afterSectionId: 'cultural-scenarios',
    conceptId: 'C-2-23',
    title: 'Inclusive Service Check',
    questions: [
      q('mcq-2-017','C-2-23','understanding','What is the strongest foundation for culturally competent client service?','Ask respectful questions, avoid assumptions, and adapt communication to the individual client.','Use the same assumptions for everyone to stay consistent.','Avoid discussing preferences that may differ from the barber’s own.','Rely on appearance to predict what a client wants.','a','Inclusive service is individualized and respectful rather than assumption-based.'),
      q('mcq-2-018','C-2-23','scenario','A client’s preference differs from what the barber expected based on appearance. What should the barber do?','Follow the client’s stated preference after clarifying the service details.','Use the expected style instead.','Question whether the client understands their own preference.','Skip the consultation to avoid discomfort.','a','The client’s stated goals, clarified through respectful consultation, should guide the service.'),
    ],
  },
  {
    id: 'mc-2-10',
    afterSectionId: 'professional-daily',
    conceptId: 'C-2-26',
    title: 'Workplace Professionalism Check',
    questions: [
      q('mcq-2-019','C-2-26','understanding','Which behavior best supports a professional shop environment?','Respecting shared space, communicating clearly, and following agreed shop standards.','Using another barber’s station without permission when busy.','Discussing private client information with coworkers for entertainment.','Changing shop expectations based on personal preference each day.','a','Professional shop conduct depends on respect, consistency, communication, and agreed workplace standards.'),
      q('mcq-2-020','C-2-26','scenario','The shop is very busy and a coworker needs brief help resetting a shared area. What is the most professional response?','Coordinate the help without neglecting current client responsibilities.','Ignore the shared area because it is not assigned to you.','Leave your current client without explanation.','Criticize the coworker in front of clients.','a','Professional teamwork balances shared responsibilities with direct obligations to clients.'),
    ],
  },
]

export interface Chapter2MicroCheckResponse {
  questionId: Chapter2MicroCheckQuestion['id']
  selectedAnswer: Chapter2MicroCheckAnswer
}

export function buildChapter2MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter2MicroCheckResponse[],
  timestamp: string,
): Chapter2EvidenceRecord[] {
  const questionMap = new Map(
    chapter2MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question] as const),
    ),
  )
  const seen = new Set<string>()
  const records: Chapter2EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-2',
      conceptId: question.conceptId,
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
