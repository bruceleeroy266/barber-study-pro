import type { Chapter8ConceptFamilyId } from './types'
import type { Chapter8Difficulty, Chapter8EvidenceRecord } from './grading'
import { chapter8MicroCheckPlacements } from './mappings'

export type Chapter8MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter8MicroCheckQuestion {
  id: `mcq-8-${string}`
  conceptFamilyId: Chapter8ConceptFamilyId
  difficulty: Exclude<Chapter8Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter8MicroCheckAnswer
  explanation: string
}

export interface Chapter8MicroCheck {
  id: `mc-8-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter8ConceptFamilyId
  title: string
  questions: readonly Chapter8MicroCheckQuestion[]
}

const q = (
  id: Chapter8MicroCheckQuestion['id'],
  conceptFamilyId: Chapter8ConceptFamilyId,
  difficulty: Chapter8MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter8MicroCheckAnswer,
  explanation: string,
): Chapter8MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter8MicroChecks: readonly Chapter8MicroCheck[] = [
  {
    id: 'mc-8-01', afterSectionId: 'conductors-insulators', conceptFamilyId: 'ch8-electricity-circuits', title: 'Circuit Safety Check',
    questions: [
      q('mcq-8-001','ch8-electricity-circuits','application','A powered tool stops when its switch opens the circuit. Why?','The complete path for current has been interrupted.','Voltage automatically becomes zero everywhere.','The tool changes from AC to DC.','Resistance becomes a power source.','a','Current requires a complete path; opening the circuit interrupts that path.'),
      q('mcq-8-002','ch8-electricity-circuits','scenario','Which condition creates the greatest conduction concern at a station?','A metal clip beside a wet towel.','A dry plastic comb.','A dry rubber mat.','A glass jar away from equipment.','a','Metal is conductive and nearby moisture increases the electrical hazard context.')
    ],
  },
  {
    id: 'mc-8-02', afterSectionId: 'current-types', conceptFamilyId: 'ch8-current-conversion', title: 'Current & Conversion Check',
    questions: [
      q('mcq-8-003','ch8-current-conversion','application','A cordless clipper battery stores DC while its charger receives wall AC. What function is required for charging?','AC-to-DC rectification.','DC-to-AC conversion only.','Grounding that stores voltage.','A fuse that creates current.','a','Charging a DC battery from an AC supply requires an AC-to-DC rectifying function.'),
      q('mcq-8-004','ch8-current-conversion','understanding','Which statement correctly distinguishes DC and AC?','DC flows one direction; AC reverses direction periodically.','DC is always safer than AC.','AC is stored directly in batteries.','DC cannot power barber tools.','a','DC and AC are distinguished by current direction, not a universal safety ranking.')
    ],
  },
  {
    id: 'mc-8-03', afterSectionId: 'worked-examples', conceptFamilyId: 'ch8-electrical-measurements', title: 'Electrical Measurements Check',
    questions: [
      q('mcq-8-005','ch8-electrical-measurements','application','A tool is rated 1200 W at 120 V. About how much current does it draw?','10 A.','12 A.','100 A.','144 A.','a','Amps = watts ÷ volts, so 1200 ÷ 120 = 10 A.'),
      q('mcq-8-006','ch8-electrical-measurements','scenario','A barber calculates a dryer draws 15 A. What can be concluded safely from that number alone?','It describes the dryer demand, but not how much additional load a specific circuit can safely carry.','Any 20 A circuit can always support another dryer.','The dryer must use DC.','The outlet is automatically overloaded.','a','Equipment current draw does not by itself establish the safe capacity of a specific loaded circuit.')
    ],
  },
  {
    id: 'mc-8-04', afterSectionId: 'safety-rules', conceptFamilyId: 'ch8-equipment-safety', title: 'Electrical Safety Check',
    questions: [
      q('mcq-8-007','ch8-equipment-safety','scenario','A cord has exposed insulation but the tool still works. What is the best action?','Remove it from service for proper repair or replacement.','Tape it and continue.','Use it only with dry hands.','Lower the tool setting.','a','Visible cord damage is a stop-use condition even when the tool still operates.'),
      q('mcq-8-008','ch8-equipment-safety','scenario','A breaker trips repeatedly while the same tools are running. What is the best response?','Stop and have the load/equipment condition evaluated before continuing.','Reset repeatedly until the service ends.','Install a larger breaker yourself.','Remove grounding pins from high-draw tools.','a','Repeated trips are warning evidence and should not be defeated or ignored.'),
      q('mcq-8-009','ch8-equipment-safety','application','A grounded tool has a three-prong plug but only a two-prong receptacle is available. What should the barber do?','Use a compatible connection that preserves the protective design.','Remove the grounding pin.','Bend the grounding pin flat.','Use the tool only at low power.','a','Never defeat a grounding feature to make equipment fit an incompatible receptacle.')
    ],
  },
  {
    id: 'mc-8-05', afterSectionId: 'polarity', conceptFamilyId: 'ch8-electrotherapy-terminology', title: 'Electrotherapy Terminology Check',
    questions: [
      q('mcq-8-010','ch8-electrotherapy-terminology','understanding','Which source association is correct?','Red is commonly the positive anode; black is commonly the negative cathode.','Red is always the cathode.','Both colors identify AC terminals only.','Color proves a client is safe for treatment.','a','The source commonly associates red with the anode and black with the cathode.'),
      q('mcq-8-011','ch8-electrotherapy-terminology','scenario','A barber knows electrotherapy terminology but has no training on a requested device. What is the best decision?','Do not perform it until scope, training, screening, and device requirements are satisfied.','Proceed at the lowest setting.','Proceed with consent only.','Use the positive pole because it is always safer.','a','Terminology knowledge does not replace scope, training, screening, or device requirements.')
    ],
  },
  {
    id: 'mc-8-06', afterSectionId: 'galvanic-current', conceptFamilyId: 'ch8-galvanic-current', title: 'Galvanic Current Check',
    questions: [
      q('mcq-8-012','ch8-galvanic-current','understanding','Which source-described association is correct?','Cataphoresis is associated with the positive pole/anode.','Cataphoresis uses ultraviolet light.','Cataphoresis is a grounding method.','Cataphoresis guarantees a medical result.','a','The source associates cataphoresis with the positive pole/anode.'),
      q('mcq-8-013','ch8-galvanic-current','application','What should determine electrode/product selection for iontophoresis?','The actual procedure, product directions, device instructions, and training.','A universal acidic-versus-alkaline shortcut for every device.','Whichever pole feels strongest.','The client’s preferred electrode color.','a','Device- and procedure-specific instructions should control electrode/product selection.')
    ],
  },
  {
    id: 'mc-8-07', afterSectionId: 'other-modalities', conceptFamilyId: 'ch8-microcurrent-high-frequency', title: 'Modality Check',
    questions: [
      q('mcq-8-014','ch8-microcurrent-high-frequency','application','Which distinction between microcurrent and Tesla high-frequency is most accurate?','Microcurrent uses very low current levels; Tesla high-frequency uses a high oscillation rate.','Both are identical modalities.','Microcurrent is ultraviolet light.','High-frequency contains no electrical current.','a','The source treats them as different electrical modalities with different current characteristics.'),
      q('mcq-8-015','ch8-microcurrent-high-frequency','scenario','A client reports unexpected burning during a permitted electrical modality. What is the best immediate response?','Stop the service and follow the device safety procedure before any further use.','Lower intensity and continue automatically.','Switch polarity without reassessment.','Continue because heat always proves normal operation.','a','Unexpected burning is a stop-service signal and should not be normalized.')
    ],
  },
  {
    id: 'mc-8-08', afterSectionId: 'light-types', conceptFamilyId: 'ch8-electromagnetic-spectrum', title: 'Spectrum Check',
    questions: [
      q('mcq-8-016','ch8-electromagnetic-spectrum','understanding','What generally happens to frequency as wavelength decreases?','Frequency increases.','Frequency decreases.','Frequency stays identical.','Frequency becomes zero.','a','Wavelength and frequency are inversely related in the electromagnetic spectrum.'),
      q('mcq-8-017','ch8-electromagnetic-spectrum','application','Which UV association is correct for Chapter 8 study?','UVA—photoaging/tanning; UVB—sunburn/skin damage; UVC—germicidal applications.','UVA—germicidal; UVB—visible light; UVC—infrared heat.','All three are identical wavelengths.','Only UVC can affect skin or eyes.','a','The source distinguishes the UV bands by wavelength and associated effects/applications.')
    ],
  },
  {
    id: 'mc-8-09', afterSectionId: 'therapeutic-lamps', conceptFamilyId: 'ch8-light-modalities', title: 'Light Modality Check',
    questions: [
      q('mcq-8-018','ch8-light-modalities','application','How should LED color associations be used professionally?','As device-dependent indications that still require scope, screening, and manufacturer verification.','As guaranteed medical outcomes.','As proof eye protection is unnecessary.','As a substitute for device instructions.','a','Source color associations do not create universal treatment guarantees.'),
      q('mcq-8-019','ch8-light-modalities','scenario','A laser service is requested. Which conclusion is safest?','Do not assume ordinary barber licensure authorizes laser operation; verify current authorization and training requirements.','Any barber may perform it after reading the chapter.','Client consent alone authorizes it.','Using low power removes scope restrictions.','a','Knowing the laser concept does not establish legal or professional authority to operate a laser.')
    ],
  },
  {
    id: 'mc-8-10', afterSectionId: 'light-therapy-safety', conceptFamilyId: 'ch8-light-therapy-safety', title: 'Light Safety Check',
    questions: [
      q('mcq-8-020','ch8-light-therapy-safety','scenario','A client reports a medication that may increase photosensitivity before a light service. What is the best action?','Check device contraindications and do not proceed unless the service is clearly appropriate.','Cut the exposure time in half automatically.','Change LED color without screening.','Proceed with consent.','a','Possible photosensitivity requires device-specific screening rather than improvised dose reduction.'),
      q('mcq-8-021','ch8-light-therapy-safety','scenario','A client reports eye discomfort during a light-based service. What should happen first?','Stop the exposure and follow the device safety procedure.','Continue until the planned time ends.','Move the lamp closer.','Remove eye protection to inspect during exposure.','a','Client eye discomfort is a stop-service signal.'),
      q('mcq-8-022','ch8-light-therapy-safety','application','Two light devices specify different times, distances, and eye protection. Which rule should the barber follow?','Use each device’s specific operating and protection instructions with continuous supervision.','Use one universal five-minute rule.','Use whichever settings feel strongest.','Let the client select the parameters.','a','Light-device operating parameters are device-specific and require continuous client protection.')
    ],
  },
]

export interface Chapter8MicroCheckResponse {
  questionId: Chapter8MicroCheckQuestion['id']
  selectedAnswer: Chapter8MicroCheckAnswer
}

export function buildChapter8MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter8MicroCheckResponse[],
  timestamp: string,
): Chapter8EvidenceRecord[] {
  const questionMap = new Map(
    chapter8MicroChecks.flatMap((check) => check.questions.map((question) => [question.id, question] as const)),
  )
  const seen = new Set<string>()
  const records: Chapter8EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-8',
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

export type Chapter8SafetyEvidenceLevel = 'standard' | 'elevated' | 'critical'

export function classifyChapter8MicroCheckSafetyEvidence(
  question: Chapter8MicroCheckQuestion,
  correct: boolean,
): Chapter8SafetyEvidenceLevel {
  if (correct) return 'standard'
  const criticalConcept =
    question.conceptFamilyId === 'ch8-equipment-safety' ||
    question.conceptFamilyId === 'ch8-light-therapy-safety'
  if (!criticalConcept) return 'standard'
  if (question.difficulty === 'scenario') return 'critical'
  return 'elevated'
}

export function validateChapter8MicroCheckPlacements(): boolean {
  if (chapter8MicroChecks.length !== chapter8MicroCheckPlacements.length) return false
  return chapter8MicroChecks.every((check) => {
    const placement = chapter8MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
