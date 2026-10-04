import type { Chapter5ConceptFamilyId } from './types'
import type { Chapter5Difficulty, Chapter5EvidenceRecord } from './grading'

export type Chapter5MicroCheckAnswer = 'a'|'b'|'c'|'d'

export interface Chapter5MicroCheckQuestion {
  id: `mcq-5-${string}`
  conceptFamilyId: Chapter5ConceptFamilyId
  difficulty: Exclude<Chapter5Difficulty,'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter5MicroCheckAnswer
  explanation: string
}
export interface Chapter5MicroCheck {
  id: `mc-5-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter5ConceptFamilyId
  title: string
  questions: readonly Chapter5MicroCheckQuestion[]
}
const q=(id:Chapter5MicroCheckQuestion['id'],conceptFamilyId:Chapter5ConceptFamilyId,difficulty:Chapter5MicroCheckQuestion['difficulty'],question:string,answer_a:string,answer_b:string,answer_c:string,answer_d:string,correctAnswer:Chapter5MicroCheckAnswer,explanation:string):Chapter5MicroCheckQuestion=>({id,conceptFamilyId,difficulty,question,answer_a,answer_b,answer_c,answer_d,correctAnswer,explanation})

export const chapter5MicroChecks: readonly Chapter5MicroCheck[] = [
  {
    id:'mc-5-01',afterSectionId:'comb-mastery',conceptFamilyId:'ch5-combs-brushes',title:'Combs & Brushes Check',
    questions:[
      q('mcq-5-001','ch5-combs-brushes','understanding','Which tool choice best fits sectioning and parting?','A tail comb.','A pressing comb.','A razor shaper.','A clipper guard.','a','Chapter 5 identifies the tail comb as a sectioning and parting tool.'),
      q('mcq-5-002','ch5-combs-brushes','scenario','A comb has a rough, damaged tooth that could catch hair or scratch the client. What is the best response?','Reserve it for services with minimal scalp contact.','Remove it from service and replace it.','Use it for clipper-over-comb because the clipper limits direct contact.','Smooth the rough edge and keep using it if it no longer catches.','b','Damaged combs should be removed from service rather than used around the client.')
    ]
  },
  {
    id:'mc-5-02',afterSectionId:'shear-anatomy',conceptFamilyId:'ch5-shears-cutting',title:'Shears & Cutting Implements Check',
    questions:[
      q('mcq-5-003','ch5-shears-cutting','application','What is the purpose of palming the shears during comb work?','To keep the shears controlled while freeing the fingers to manipulate the comb.','To keep the comb stable while the thumb and ring finger maintain shear tension.','To reposition the shears so the blades remain partly open during sectioning.','To protect the cutting edge from contacting the comb during clipper-over-comb work.','a','Palming is a handling skill that secures the shears while allowing the hand to work with the comb.'),
      q('mcq-5-004','ch5-shears-cutting','scenario','A shear is pulling hair instead of cutting smoothly. What should be checked before continuing?','Finger-rest position, because poor hand angle is the most common cause of pulling.','Blade condition, cleanliness, tension, alignment, and maintenance needs.','Check blade tension and lubrication first, since alignment is unlikely to cause pulling.','Whether the shear is designed for wet or dry cutting before checking the blade condition.','b','Poor cutting performance should prompt inspection and maintenance rather than increased pressure.')
    ]
  },
  {
    id:'mc-5-03',afterSectionId:'clipper-mastery',conceptFamilyId:'ch5-clippers-trimmers',title:'Clippers & Trimmers Check',
    questions:[
      q('mcq-5-005','ch5-clippers-trimmers','understanding','What distinguishes an adjustable-blade clipper from a detachable-blade clipper?','An adjustable model changes cutting position with a lever; a detachable model changes blade units.','An adjustable model changes blade tension with a lever; a detachable model changes the clipper’s cutting system.','An adjustable model is intended for close taper work; a detachable model is mainly for bulk removal.','Both systems change cutting length, but they use different blade-mounting designs with the same practical effect.','a','Chapter 5 distinguishes adjustable and detachable systems by how the cutting blade setup changes.'),
      q('mcq-5-006','ch5-clippers-trimmers','scenario','A clipper begins pulling and snagging hair. What is the strongest first response?','Press harder so the teeth continue cutting.','Stop and inspect cleanliness, lubrication, alignment, and blade condition.','Increase motor speed regardless of blade condition.','Keep cutting until the service is complete, then inspect it.','b','Pulling or snagging is a signal to stop and inspect the blade and maintenance condition before continuing.')
    ]
  },
  {
    id:'mc-5-04',afterSectionId:'razor-anatomy-source-detail',conceptFamilyId:'ch5-razors',title:'Razors, Honing & Stropping Check',
    questions:[
      q('mcq-5-007','ch5-razors','application','Why is a conventional straight razor controlled from the shank during honing or stropping?','It helps the blade lie correctly and travel in a controlled way on the hone or strop.','It keeps the blade angle consistent by allowing the spine to stay slightly lifted from the hone or strop.','It concentrates pressure near the heel so the full cutting edge contacts the surface evenly.','It lets the barber reverse direction without changing the blade’s relationship to the hone or strop.','a','The taught hold supports controlled blade position and balanced work on both sides.'),
      q('mcq-5-008','ch5-razors','scenario','During stropping, how should the razor change direction?','Roll it over the cutting edge.','Roll it on its back before continuing on the opposite side.','Lift and strike the strop vertically.','Keep the same side against the strop for every pass.','b','The edge should not be rolled over; stropping reverses direction by rolling the razor on its back.')
    ]
  },
  {
    id:'mc-5-05',afterSectionId:'heat-station',conceptFamilyId:'ch5-thermal-electrical',title:'Thermal & Electrical Tools Check',
    questions:[
      q('mcq-5-009','ch5-thermal-electrical','application','Before a heated tool contacts the client, what should the barber verify?','That the tool is at a safe working temperature for the service and hair condition.','That the tool is at its maximum available setting.','That heat protectant makes temperature testing unnecessary.','That the client has used the same tool before.','a','Thermal safety requires deliberate heat control and verification before client contact.'),
      q('mcq-5-010','ch5-thermal-electrical','scenario','A blowdryer is being used near a wet sink area. What is the safest action?','Continue if the dryer, plug, and cord are dry and no water is touching the tool.','Move away from the water hazard and correct the unsafe setup before continuing.','Cover the wet area and keep the dryer farther from the sink while finishing the service.','Reduce heat and airflow while keeping the same setup so the electrical load is lower.','b','Water and electrical tools create a serious hazard; the unsafe environment must be corrected.')
    ]
  },
  {
    id:'mc-5-06',afterSectionId:'station-setup',conceptFamilyId:'ch5-equipment-safety',title:'Equipment & Tool Safety Check',
    questions:[
      q('mcq-5-011','ch5-equipment-safety','understanding','What is the primary purpose of a neck strip during a haircut service?','To create a barrier between the cape and the client’s skin.','To sharpen shears between sections.','To measure hair length around the neckline.','To hold clipper guards in place.','a','The neck strip functions as a clean barrier between the cape and the client.'),
      q('mcq-5-012','ch5-equipment-safety','scenario','A workstation has damaged electrical equipment mixed with clean service supplies. What is the strongest response?','Separate the damaged equipment from clean supplies and use it cautiously until the current client is finished.','Remove damaged equipment from service and restore a clean, organized, safe station before proceeding.','Keep the damaged equipment isolated and use it when necessary.','Explain the condition and use it if the client accepts the risk.','b','Professional tool safety includes equipment condition, clean organization, and removing unsafe tools from service.')
    ]
  },
]

export interface Chapter5MicroCheckResponse {questionId:Chapter5MicroCheckQuestion['id'];selectedAnswer:Chapter5MicroCheckAnswer}
export function buildChapter5MicroCheckEvidence(studentId:string,responses:readonly Chapter5MicroCheckResponse[],timestamp:string):Chapter5EvidenceRecord[]{
  const map=new Map(chapter5MicroChecks.flatMap(check=>check.questions.map(question=>[question.id,question] as const)))
  const seen=new Set<string>()
  const records:Chapter5EvidenceRecord[]=[]
  for(const response of responses){
    if(seen.has(response.questionId)) continue
    const question=map.get(response.questionId)
    if(!question) continue
    seen.add(response.questionId)
    records.push({studentId,chapterId:'ch-5',conceptFamilyId:question.conceptFamilyId,source:'micro_check',itemId:question.id,difficulty:question.difficulty,correct:response.selectedAnswer===question.correctAnswer,attemptPhase:'initial',timestamp})
  }
  return records
}
