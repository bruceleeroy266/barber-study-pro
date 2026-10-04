import type { Chapter4ConceptFamilyId } from './types'
import type { Chapter4Difficulty, Chapter4EvidenceRecord } from './grading'

export type Chapter4MicroCheckAnswer = 'a'|'b'|'c'|'d'

export interface Chapter4MicroCheckQuestion {
  id: `mcq-4-${string}`
  conceptFamilyId: Chapter4ConceptFamilyId
  difficulty: Exclude<Chapter4Difficulty,'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter4MicroCheckAnswer
  explanation: string
}

export interface Chapter4MicroCheck {
  id: `mc-4-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter4ConceptFamilyId
  title: string
  questions: readonly Chapter4MicroCheckQuestion[]
}

const q=(id:Chapter4MicroCheckQuestion['id'],conceptFamilyId:Chapter4ConceptFamilyId,difficulty:Chapter4MicroCheckQuestion['difficulty'],question:string,answer_a:string,answer_b:string,answer_c:string,answer_d:string,correctAnswer:Chapter4MicroCheckAnswer,explanation:string):Chapter4MicroCheckQuestion=>({id,conceptFamilyId,difficulty,question,answer_a,answer_b,answer_c,answer_d,correctAnswer,explanation})

export const chapter4MicroChecks: readonly Chapter4MicroCheck[] = [
  {
    id:'mc-4-01', afterSectionId:'infection-principles-source-detail', conceptFamilyId:'ch4-pathogens-transmission', title:'Pathogens & Transmission Check',
    questions:[
      q('mcq-4-001','ch4-pathogens-transmission','understanding','A contaminated comb carries microorganisms from one client to another. What transmission route is this?','Indirect transmission through a contaminated object.','Direct transmission because a barber was involved.','Systemic transmission because more than one person is involved.','No transmission risk exists unless symptoms are visible.','a','Chapter 4 distinguishes indirect transmission as transfer through an intermediate contaminated object or surface.'),
      q('mcq-4-002','ch4-pathogens-transmission','scenario','A client appears healthy, but a blood exposure occurs during a service. Which principle should guide the response?','Use standard precautions after confirming the client reports an infection risk.','Treat the exposure using appropriate precautions because infection status cannot be determined reliably from appearance alone.','Pause the service, ask about known bloodborne conditions, and choose precautions based on the answer.','Use enhanced precautions when the exposure involves visible symptoms or known infectious disease.','b','Infection-control decisions do not rely on appearance alone; appropriate precautions apply when blood exposure occurs.')
    ]
  },
  {
    id:'mc-4-02', afterSectionId:'processing-source-detail', conceptFamilyId:'ch4-disinfection-sterilization', title:'Processing & Disinfection Check',
    questions:[
      q('mcq-4-003','ch4-disinfection-sterilization','application','A reusable nonporous implement has visible residue. What sequence best protects the next client?','Clean away debris, disinfect according to the product label, then store the item to prevent recontamination.','Disinfect first to kill microorganisms, then remove remaining residue before storage.','Clean the visible residue, rinse thoroughly, and store it if no contamination remains.','Clean and disinfect the implement just before the next client rather than after the current service.','a','Cleaning must precede disinfection so debris does not interfere with contact, followed by protected storage.'),
      q('mcq-4-004','ch4-disinfection-sterilization','scenario','A disinfectant label lists a specific dilution and wet contact time for the intended surface. What should the barber do?','Increase concentration slightly while keeping the labeled contact time the same.','Follow the labeled dilution and full required contact time for that intended use.','Use the shortest listed contact time if the surface has already been cleaned first.','Remove the disinfectant once the surface appears visibly clean, even if the contact time is not complete.','b','Disinfectant effectiveness and safe use depend on following the product label for the intended application.')
    ]
  },
  {
    id:'mc-4-03', afterSectionId:'contamination-sim-1', conceptFamilyId:'ch4-cross-contamination', title:'Cross-Contamination Check',
    questions:[
      q('mcq-4-005','ch4-cross-contamination','application','A barber touches a phone with contaminated gloves and then adjusts a clean clipper guard. What is the main problem?','A contamination pathway was created between the phone, gloves, and clean guard.','The guard becomes a concern mainly when visible soil or body fluid is transferred to it.','The phone should be disinfected before reuse, but the guard can remain clean if no visible residue transferred.','The gloves protected both surfaces, so cross-contamination is unlikely unless the gloves were torn.','a','Gloves do not prevent cross-contamination when contaminated gloves touch clean equipment or surfaces.'),
      q('mcq-4-006','ch4-cross-contamination','scenario','Clean, used, and disinfected implements are stored together in one open tray. What is the safest conclusion?','The disinfected implements remain safe if they are dry and do not visibly touch the used items.','The arrangement creates recontamination risk because processed items are not protected from contaminated items.','The tray is acceptable if disinfected implements are placed above the used implements.','Recontamination risk is limited if the tray itself was disinfected before the tools were placed together.','b','Processed implements must be separated and protected so they are not recontaminated before use.')
    ]
  },
  {
    id:'mc-4-04', afterSectionId:'standard-precautions-source-detail', conceptFamilyId:'ch4-blood-exposure-ppe', title:'Blood Exposure & PPE Check',
    questions:[
      q('mcq-4-007','ch4-blood-exposure-ppe','application','A client is accidentally nicked and begins bleeding. What should happen first?','Pause the service and begin the required blood-exposure procedure using appropriate precautions.','Complete the current cutting section before beginning the exposure procedure so the service area stays controlled.','Clarify the client’s health history first so the barber knows which exposure precautions are required.','Control the bleeding while continuing if the nick is minor and the client is comfortable.','a','Blood exposure requires the service to pause so the required exposure procedure and protective measures can begin.'),
      q('mcq-4-008','ch4-blood-exposure-ppe','scenario','After handling a blood exposure, a barber removes gloves and reaches for a clean drawer handle. What should happen before touching it?','Use the removed gloves again if the clean side is handled carefully.','Perform required hand hygiene before touching clean surfaces or continuing service.','Use a clean towel as a barrier so hand hygiene can be delayed until the service is complete.','Hand hygiene can be deferred if the gloves were intact and no visible contamination reached the skin.','b','Gloves do not replace hand hygiene; clean surfaces should be protected from contamination after glove removal.')
    ]
  },
  {
    id:'mc-4-05', afterSectionId:'regulatory-source-detail', conceptFamilyId:'ch4-regulatory-chemical-safety', title:'Regulatory & Chemical Safety Check',
    questions:[
      q('mcq-4-009','ch4-regulatory-chemical-safety','understanding','Which pairing is most accurate?','OSHA—workplace safety; EPA—disinfectant registration and label claims; state authority—licensing and state practice rules.','EPA—state licensing; OSHA—disinfectant registration; state authority—federal workplace safety.','OSHA—product marketing; EPA—employee scheduling; state authority—chemical manufacturing.','All three perform the same regulatory function.','a','Chapter 4 separates workplace-safety, disinfectant-regulation, and state licensing/practice responsibilities.'),
      q('mcq-4-010','ch4-regulatory-chemical-safety','scenario','A chemical splash occurs and the barber needs hazard, first-aid, storage, and PPE information. Where should the barber look?','A coworker’s memory of the product.','The product Safety Data Sheet and label.','The shop price list.','The client consultation card.','b','The SDS provides standardized hazard and response information, while the label provides use directions.')
    ]
  },
  {
    id:'mc-4-06', afterSectionId:'safe-work-practices-source-detail', conceptFamilyId:'ch4-safe-practice-compliance', title:'Safe Practice Check',
    questions:[
      q('mcq-4-011','ch4-safe-practice-compliance','application','A clipper has a frayed power cord and the station area is damp. What is the safest response?','Remove the damaged equipment from service and correct the moisture/electrical hazard before continuing.','Dry the station fully and use the clipper at a lower setting until the cord can be repaired.','Cover the damaged section with approved electrical tape and continue after drying the area.','Move to a dry station and continue using the clipper if the exposed area does not flex during use.','a','Damaged electrical equipment and moisture create avoidable hazards; both conditions should be corrected before service continues.'),
      q('mcq-4-012','ch4-safe-practice-compliance','scenario','A client has a visibly inflamed, draining area where the service would occur. What is the best professional response?','Identify whether the drainage appears infectious, then decide whether the service can be modified safely.','Avoid service on the affected area and follow applicable infection-control requirements without diagnosing.','Continue with gloves while avoiding direct contact with the draining area.','Explain the risk, document the client’s consent, and continue around the affected area.','b','Safe professional practice means avoiding an unsafe service situation while staying within the barber’s scope and not diagnosing.')
    ]
  },
]

export interface Chapter4MicroCheckResponse {questionId:Chapter4MicroCheckQuestion['id'];selectedAnswer:Chapter4MicroCheckAnswer}
export function buildChapter4MicroCheckEvidence(studentId:string,responses:readonly Chapter4MicroCheckResponse[],timestamp:string):Chapter4EvidenceRecord[]{
  const map=new Map(chapter4MicroChecks.flatMap(check=>check.questions.map(question=>[question.id,question] as const)))
  const seen=new Set<string>()
  const records:Chapter4EvidenceRecord[]=[]
  for(const response of responses){
    if(seen.has(response.questionId)) continue
    const question=map.get(response.questionId)
    if(!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId:'ch-4',
      conceptFamilyId:question.conceptFamilyId,
      source:'micro_check',
      itemId:question.id,
      difficulty:question.difficulty,
      correct:response.selectedAnswer===question.correctAnswer,
      attemptPhase:'initial',
      timestamp,
    })
  }
  return records
}
