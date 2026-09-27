import type { QuizQuestion } from '@/types'
import type { ConceptId } from './chapter-2-concepts/types'

type Answer = 'a' | 'b' | 'c' | 'd'
type Difficulty = 'easy' | 'medium' | 'hard'
interface Seed {
  conceptId: ConceptId
  sourceBlockIds: readonly string[]
  sourceBasis: string
  items: readonly { question:string; answer_a:string; answer_b:string; answer_c:string; answer_d:string; correct_answer:Answer; explanation:string; difficulty:Difficulty }[]
}
const seeds: readonly Seed[] = [
  {
    conceptId:'C-2-01',
    sourceBlockIds:['why-life-skills','success-separators','clippers-quote'],
    sourceBasis:'ASCYN Chapter 2 lesson: life skills support reliability, money habits, client relationships, and stress management alongside technical skill.',
    items:[
      {question:'Two new barbers have similar cutting ability, but one keeps clients longer because they arrive prepared, communicate clearly, and follow through. What Chapter 2 idea best explains the difference?',answer_a:'Life skills can separate career performance even when technical training is similar.',answer_b:'Technical skill becomes unimportant once a barber starts working with regular clients.',answer_c:'Client retention depends mainly on completing each service faster than nearby competitors.',answer_d:'Professional habits matter only for shop owners who manage other barbers.',correct_answer:'a',explanation:'Chapter 2 treats reliability, communication, money habits, relationships, and stress management as career-building skills that work alongside technical ability.',difficulty:'medium'},
      {question:'A student practices fades constantly but ignores punctuality, budgeting, and client communication. Which improvement would best match the Chapter 2 foundation?',answer_a:'Add more cutting drills and postpone nontechnical habits until after licensure.',answer_b:'Develop professional habits with the same consistency used to develop technical skills.',answer_c:'Focus on social media first because visibility can replace weak professional routines.',answer_d:'Wait for an employer to create all scheduling, communication, and money systems.',correct_answer:'b',explanation:'The chapter distinguishes technical training from the life skills that sustain a career, so both areas require deliberate development.',difficulty:'medium'},
      {question:'Which statement is most consistent with Chapter 2’s view of life skills?',answer_a:'They are optional personality traits that matter mainly in customer-service jobs.',answer_b:'They become relevant only after a barber has mastered every technical service.',answer_c:'They are practical career skills that influence consistency, relationships, money, and resilience.',answer_d:'They are fixed characteristics that cannot be improved through habits and practice.',correct_answer:'c',explanation:'ASCYN presents life skills as practical, trainable career infrastructure that affects how reliably and professionally a barber operates.',difficulty:'medium'},
      {question:'A barber’s technical work is strong, but repeated lateness and poor follow-through are hurting the book. What is the best Chapter 2 response?',answer_a:'Change the haircut menu so clients focus less on appointment timing.',answer_b:'Lower prices until clients become more tolerant of inconsistent reliability.',answer_c:'Add more advanced technical services before addressing professional habits.',answer_d:'Treat reliability and follow-through as skills to practice and measure, not as minor extras.',correct_answer:'d',explanation:'Chapter 2 frames consistent attendance, time management, and professional relationships as skills that can determine whether technical talent becomes a sustainable career.',difficulty:'hard'},
    ],
  },
  {
    conceptId:'C-2-02',
    sourceBlockIds:['mindset-intro','mindset-pillars'],
    sourceBasis:'ASCYN Chapter 2 lesson and instructor notes: success psychology includes constructive mindset, self-esteem building, and action-oriented habits.',
    items:[
      {question:'A student makes one poor cut and immediately decides that one result defines their ability. Which response best reflects Chapter 2 success psychology?',answer_a:'Treat the mistake as specific feedback, identify what to improve, and take the next constructive action.',answer_b:'Avoid that haircut type until confidence returns naturally on its own.',answer_c:'Compare the result with the best barber in class and judge overall talent from the gap.',answer_d:'Ignore the mistake completely so negative thoughts never receive attention.',correct_answer:'a',explanation:'Chapter 2 emphasizes constructive self-management: acknowledge the result, learn from it, and convert the setback into a specific next action.',difficulty:'hard'},
      {question:'Which behavior most strongly supports a healthy success mindset in Chapter 2?',answer_a:'Waiting to feel fully confident before attempting challenging practice.',answer_b:'Using realistic self-talk and consistent action instead of defining yourself by one result.',answer_c:'Avoiding feedback that might temporarily lower self-esteem.',answer_d:'Setting only easy goals so failure is almost impossible.',correct_answer:'b',explanation:'The chapter treats self-esteem and success psychology as compatible with honest feedback, realistic thinking, and continued action rather than avoidance.',difficulty:'medium'},
      {question:'A student’s confidence drops after several difficult days. What approach best matches Chapter 2?',answer_a:'Assume confidence must return before any useful progress can happen.',answer_b:'Replace every challenging task with something already mastered.',answer_c:'Use small achievable actions to rebuild evidence of progress while continuing to learn.',answer_d:'Measure personal value by whether classmates are progressing faster.',correct_answer:'c',explanation:'Small constructive actions can rebuild momentum and confidence while keeping the student engaged with real improvement rather than comparison or avoidance.',difficulty:'medium'},
      {question:'Which statement best distinguishes a useful professional mindset from empty positive thinking?',answer_a:'A useful mindset means telling yourself every result is excellent.',answer_b:'A useful mindset means refusing to notice weaknesses.',answer_c:'A useful mindset depends on praise from other people.',answer_d:'A useful mindset pairs constructive thinking with honest evaluation and action.',correct_answer:'d',explanation:'ASCYN’s success psychology is action-oriented: confidence and positive attitude support growth when paired with honest assessment and deliberate improvement.',difficulty:'medium'},
    ],
  },
]
export const chapter2G5ReassessmentQuestionsP1: QuizQuestion[] = seeds.flatMap((seed, si)=>seed.items.map((item, qi)=>({id:`qq-2-${String(76+si*4+qi).padStart(3,'0')}`,quiz_id:'quiz-2',...item,order_index:76+si*4+qi})))
export const chapter2G5ReassessmentMappingsP1 = chapter2G5ReassessmentQuestionsP1.map((question,index)=>({questionId:question.id as `qq-2-${string}`,conceptId:seeds[Math.floor(index/4)].conceptId}))
export const chapter2G5ReassessmentAuditP1 = chapter2G5ReassessmentQuestionsP1.map((question,index)=>{const seed=seeds[Math.floor(index/4)];return {questionId:question.id,conceptId:seed.conceptId,sourceBlockIds:seed.sourceBlockIds,sourceBasis:seed.sourceBasis}})
