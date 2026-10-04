import type { Chapter3ConceptFamilyId } from './types'
import type { Chapter3Difficulty, Chapter3EvidenceRecord } from './grading'

export type Chapter3MicroCheckAnswer = 'a'|'b'|'c'|'d'

export interface Chapter3MicroCheckQuestion {
  id: `mcq-3-${string}`
  conceptFamilyId: Chapter3ConceptFamilyId
  difficulty: Exclude<Chapter3Difficulty,'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter3MicroCheckAnswer
  explanation: string
}
export interface Chapter3MicroCheck {
  id: `mc-3-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter3ConceptFamilyId
  title: string
  questions: readonly Chapter3MicroCheckQuestion[]
}
const q=(id:Chapter3MicroCheckQuestion['id'],conceptFamilyId:Chapter3ConceptFamilyId,difficulty:Chapter3MicroCheckQuestion['difficulty'],question:string,answer_a:string,answer_b:string,answer_c:string,answer_d:string,correctAnswer:Chapter3MicroCheckAnswer,explanation:string):Chapter3MicroCheckQuestion=>({id,conceptFamilyId,difficulty,question,answer_a,answer_b,answer_c,answer_d,correctAnswer,explanation})

export const chapter3MicroChecks: readonly Chapter3MicroCheck[] = [
  {
    id:'mc-3-01', afterSectionId:'healthful-habits', conceptFamilyId:'ch3-healthful-habits', title:'Healthful Habits Check',
    questions:[
      q('mcq-3-001','ch3-healthful-habits','understanding','Which routine best supports a barber through a long workday?','Consistent hygiene, adequate rest, balanced food, water, exercise, and recovery habits.','Skipping meals and relying on caffeine when energy drops.','Sleeping less during busy weeks to create more appointment time.','Using fragrance to cover signs of poor hygiene.','a','Chapter 3 treats daily hygiene and sustainable health habits as professional preparation, not optional extras.'),
      q('mcq-3-002','ch3-healthful-habits','scenario','A barber feels worn down after several short nights and rushed meals. Which change best addresses the pattern?','Add another stimulant and keep the same schedule.','Restore consistent sleep, hydration, meals, activity, and recovery instead of relying on short-term fixes.','Cancel all clients until the barber feels fully rested.','Ignore the pattern because fatigue is unavoidable in the profession.','b','The healthful-habits model emphasizes recovery, nutrition, hydration, exercise, and stress management rather than temporary stimulant-based compensation.')
    ]
  },
  {
    id:'mc-3-02', afterSectionId:'dress-standards', conceptFamilyId:'ch3-professional-image', title:'Professional Image Check',
    questions:[
      q('mcq-3-003','ch3-professional-image','understanding','Which choice best supports a professional image in the shop?','Clean, functional attire and grooming that fit shop expectations and safe work.','The most fashionable outfit even when it conflicts with shop policy.','Strong fragrance so clients notice personal style.','Accessories that hang near the client because they look professional.','a','Chapter 3 connects professional image with cleanliness, grooming, functionality, safety, and the standards of the workplace.'),
      q('mcq-3-004','ch3-professional-image','scenario','A shop has a written dress code and no-fragrance policy. What is the strongest response?','Follow the dress standards but treat the fragrance rule as optional if clients have not complained.','Follow the written standards, including clean attire, appropriate footwear, restrained accessories, and no fragrance.','Follow the no-fragrance rule but adjust attire based on personal style if it remains neat.','Follow the policy during client services but use looser standards during setup and cleanup.','b','Dressing for success includes adapting personal presentation to legitimate workplace standards and client comfort.')
    ]
  },
  {
    id:'mc-3-03', afterSectionId:'posture-guidelines', conceptFamilyId:'ch3-ergonomics', title:'Ergonomics Check',
    questions:[
      q('mcq-3-005','ch3-ergonomics','application','A barber keeps bending the back to reach the client. What is the better ergonomic correction?','Raise or reposition the client and adjust the workstation so the barber can stay more neutral.','Keep bending but work faster.','Lock the knees to create a stable base.','Lift the shoulders higher to reach the cutting area.','a','Ergonomics favors adjusting client and workstation position so the barber can work with safer body alignment and less strain.'),
      q('mcq-3-006','ch3-ergonomics','scenario','A barber notices wrist and shoulder fatigue during repeated clipper work. Which response best follows Chapter 3?','Grip harder so the tool feels more secure.','Review wrist position, grip, arm height, client position, and repetitive movement instead of simply pushing through.','Hold the arm higher to keep the tool away from the body.','Ignore the fatigue until pain becomes severe.','b','The ergonomics family focuses on neutral positioning, efficient movement, and reducing repetitive strain before it becomes a chronic problem.')
    ]
  },
  {
    id:'mc-3-04', afterSectionId:'communication-steps', conceptFamilyId:'ch3-human-relations', title:'Human Relations Check',
    questions:[
      q('mcq-3-007','ch3-human-relations','application','A client gives a vague description of the desired haircut. What is the strongest communication response?','Organize the request, ask clarifying questions, and repeat the agreed plan before starting.','Start with the barber’s usual interpretation and adjust later.','Use more technical terms so the client trusts the barber.','Avoid asking questions so the consultation feels efficient.','a','Chapter 3 emphasizes clear professional communication, identifying client needs, and confirming understanding before service.'),
      q('mcq-3-008','ch3-human-relations','scenario','A client is frustrated and speaking sharply. What response best supports rapport?','Match the client’s tone so the concern is taken seriously.','Control your reaction, listen for the actual concern, and answer with tact and professionalism.','End the conversation immediately to avoid conflict.','Ask another client for an opinion.','b','Human relations requires emotional control, active listening, tact, and professional behavior even when the interaction is uncomfortable.')
    ]
  },
]

export interface Chapter3MicroCheckResponse {questionId:Chapter3MicroCheckQuestion['id'];selectedAnswer:Chapter3MicroCheckAnswer}
export function buildChapter3MicroCheckEvidence(studentId:string,responses:readonly Chapter3MicroCheckResponse[],timestamp:string):Chapter3EvidenceRecord[]{
 const map=new Map(chapter3MicroChecks.flatMap(check=>check.questions.map(question=>[question.id,question] as const)))
 const seen=new Set<string>(); const records:Chapter3EvidenceRecord[]=[]
 for(const response of responses){if(seen.has(response.questionId))continue; const question=map.get(response.questionId); if(!question)continue; seen.add(response.questionId); records.push({studentId,chapterId:'ch-3',conceptFamilyId:question.conceptFamilyId,source:'micro_check',itemId:question.id,difficulty:question.difficulty,correct:response.selectedAnswer===question.correctAnswer,attemptPhase:'initial',timestamp})}
 return records
}
