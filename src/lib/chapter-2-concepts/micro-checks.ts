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
      q('mcq-2-001','C-2-01','understanding','A barber has strong technical skills but repeatedly arrives late and communicates poorly. What does this best demonstrate?','Technical ability alone does not replace professional life skills.','Strong technical performance can offset occasional reliability problems if client results remain high.','Life skills matter most in leadership roles, while technical skill is the main requirement for employed barbers.','Communication matters mainly during consultations; reliability and self-management are separate from professional success.','a','Professional success depends on technical ability plus reliability, communication, self-management, and other life skills.'),
      q('mcq-2-002','C-2-01','application','Which action best reflects a strong professional life-skill habit?','Preparing early, communicating clearly, and following through on commitments.','Reviewing priorities at the start of the day but adjusting only after delays appear.','Using feedback only when performance drops instead of building it into a regular routine.','Maintaining the same goals but relaxing communication and preparation standards on unusually busy days.','a','Professional life skills show up through preparation, communication, reliability, and consistent follow-through.'),
    ],
  },
  {
    id: 'mc-2-02',
    afterSectionId: 'track-progress',
    conceptId: 'C-2-07',
    title: 'Goal Tracking Check',
    questions: [
      q('mcq-2-003','C-2-07','understanding','Why should a long-term goal be reviewed at regular intervals?','To compare progress with the plan and adjust actions when needed.','To reset milestones whenever progress falls behind the original schedule.','To confirm whether the deadline should be extended before comparing current progress.','To measure the final result while leaving the original action plan unchanged.','a','Tracking lets the learner compare actual progress with planned milestones and make adjustments.'),
      q('mcq-2-004','C-2-07','application','A student wants to finish required training hours by a target month. Which approach best supports that goal?','Break the total into smaller milestones and review actual progress against them.','Set a final deadline and review progress only at major checkpoints to avoid overreacting to weekly variation.','Set a target month but avoid smaller milestones so the student can adjust freely as circumstances change.','Adjust the target after each difficult week instead of comparing actual progress against the original milestones.','a','Milestones and regular progress reviews turn a large goal into measurable actions.'),
    ],
  },
  {
    id: 'mc-2-03',
    afterSectionId: 'time-tools',
    conceptId: 'C-2-08',
    title: 'Time Management Check',
    questions: [
      q('mcq-2-005','C-2-08','understanding','What is the main purpose of a time-management system?','To direct limited time toward priorities instead of reacting to everything equally.','To schedule as many tasks as possible so unplanned time is minimized.','To reserve equal blocks of time for each responsibility regardless of priority.','To create a fixed daily schedule that should be followed unless an emergency occurs.','a','Time management is about prioritizing and planning limited time, not filling every minute.'),
      q('mcq-2-006','C-2-08','scenario','A barber is running behind and a walk-in requests immediate service. What is the most professional response?','Give an honest wait estimate and offer a realistic service time or booking option.','Shorten nonessential parts of the current service so the walk-in can be accommodated sooner.','Give the walk-in an optimistic estimate to keep the client from leaving, then update the estimate if needed.','Ask the walk-in to wait without an estimate so the current client receives full attention.','a','Clear expectations and realistic scheduling protect both service quality and client trust.'),
    ],
  },
  {
    id: 'mc-2-04',
    afterSectionId: 'study-system',
    conceptId: 'C-2-10',
    title: 'Study Habits Check',
    questions: [
      q('mcq-2-007','C-2-10','understanding','Which study approach is most likely to support durable learning?','Short focused sessions with planned review over time.','Use one long review session several days before the exam so material is consolidated without frequent repetition.','Review notes repeatedly without self-testing so the material becomes more familiar before practice questions are added.','Spend most study time on familiar topics to build confidence, then address weaker areas near the exam.','a','Focused sessions plus spaced review and active recall are stronger than one-time passive review.'),
      q('mcq-2-008','C-2-10','application','A student keeps forgetting material a week after studying it. What is the best adjustment?','Schedule repeated retrieval and review across several days.','Increase the length of each study session so the material receives deeper attention even if review is less frequent.','Replace practice questions with rereading until the material feels familiar, then return to testing later.','Delay review until the week of the exam so the material is fresher when it is needed.','a','Repeated retrieval over time helps reinforce memory and exposes what still needs work.'),
    ],
  },
  {
    id: 'mc-2-05',
    afterSectionId: 'burnout-signs',
    conceptId: 'C-2-15',
    title: 'Stress & Burnout Check',
    questions: [
      q('mcq-2-009','C-2-15','understanding','Which pattern is most consistent with burnout risk?','Persistent exhaustion, irritability, disengagement, and declining performance.','Repeated fatigue after several demanding days that improves fully with one normal night of rest.','Wanting more time away from work after a stressful week while performance and engagement remain stable.','Needing regular meal and rest breaks during a busy schedule while motivation and accuracy remain unchanged.','a','Burnout is a sustained pattern affecting energy, attitude, and performance rather than one temporary tired day.'),
      q('mcq-2-010','C-2-15','application','A student notices ongoing exhaustion and repeated mistakes. What is the most constructive response?','Adjust workload and recovery habits and seek appropriate support before performance worsens.','Continue the current schedule for another week to see whether the pattern resolves on its own before making changes.','Temporarily add study or work hours while reducing nonessential activities, then reassess after the backlog is cleared.','Limit discussions to required check-ins until the workload stabilizes so extra conversations do not add stress.','a','Early workload adjustment, recovery, and appropriate support can reduce the risk of worsening burnout.'),
    ],
  },
  {
    id: 'mc-2-06',
    afterSectionId: 'consultation-skills',
    conceptId: 'C-2-18',
    title: 'Active Listening & Consultation Check',
    questions: [
      q('mcq-2-011','C-2-18','understanding','What best confirms that the barber understood a client request?','Restating the request in clear terms and getting confirmation before beginning.','Use the client’s usual service as the starting assumption, then confirm only any details that appear different today.','Begin the preparation step while continuing to clarify details so service time is not lost.','Repeat the named service and one key detail, relying on the client to correct anything else that was misunderstood.','a','Restating and confirming key details reduces misunderstanding before the service begins.'),
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
      q('mcq-2-014','C-2-12','scenario','A client requests a service the barber is not confident performing. What is the most ethical response?','Explain the limitation honestly and offer an appropriate referral or alternative.','Explain that the service is unfamiliar, but perform it if the client accepts the risk.','Ask a more experienced coworker to supervise while completing the service yourself.','Offer a modified version of the service that stays within your current skill limits without discussing the limitation.','a','Honesty about competence protects the client and supports professional trust.'),
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
      q('mcq-2-018','C-2-23','scenario','A client’s preference differs from what the barber expected based on appearance. What should the barber do?','Follow the client’s stated preference after clarifying the service details.','Recommend the style that best matches the barber’s initial assessment and follow it unless the client strongly objects.','Clarify whether the client has considered how the requested style will work with their features before accepting the preference.','Keep the consultation brief and focus only on technical details so personal assumptions do not become part of the discussion.','a','The client’s stated goals, clarified through respectful consultation, should guide the service.'),
    ],
  },
  {
    id: 'mc-2-10',
    afterSectionId: 'professional-daily',
    conceptId: 'C-2-26',
    title: 'Workplace Professionalism Check',
    questions: [
      q('mcq-2-019','C-2-26','understanding','Which behavior best supports a professional shop environment?','Respecting shared space, communicating clearly, and following agreed shop standards.','Use another station briefly when the owner is absent, then return everything to its original place.','Discuss client details with coworkers only when the information seems harmless and no client names are used.','Adjust minor shop standards to personal workflow as long as the main service and sanitation rules are followed.','a','Professional shop conduct depends on respect, consistency, communication, and agreed workplace standards.'),
      q('mcq-2-020','C-2-26','scenario','The shop is very busy and a coworker needs brief help resetting a shared area. What is the most professional response?','Coordinate the help without neglecting current client responsibilities.','Finish the current client first, then help reset the shared area even if the coworker needs it before then.','Pause the current service briefly to help, assuming the client will understand the delay.','Tell the coworker to handle the reset alone so responsibility stays clearly assigned.','a','Professional teamwork balances shared responsibilities with direct obligations to clients.'),
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
