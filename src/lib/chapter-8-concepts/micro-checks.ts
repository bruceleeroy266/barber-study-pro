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
      q('mcq-8-001','ch8-electricity-circuits','application','A powered tool stops when its switch opens the circuit. Why?','The complete path for current has been interrupted.','The open switch removes voltage from the tool by redirecting it back toward the source.','Opening the switch changes how current is supplied, temporarily shifting the circuit away from normal operation.','Opening the circuit raises resistance enough that the tool can no longer draw usable current.','a','Current requires a complete path; opening the circuit interrupts that path.'),
      q('mcq-8-002','ch8-electricity-circuits','scenario','Which condition creates the greatest conduction concern at a station?','A metal clip beside a wet towel.','A dry plastic comb.','A dry rubber mat.','A glass jar away from equipment.','a','Metal is conductive and nearby moisture increases the electrical hazard context.')
    ],
  },
  {
    id: 'mc-8-02', afterSectionId: 'current-types', conceptFamilyId: 'ch8-current-conversion', title: 'Current & Conversion Check',
    questions: [
      q('mcq-8-003','ch8-current-conversion','application','A cordless clipper battery stores DC while its charger receives wall AC. What function is required for charging?','AC-to-DC rectification.','The charger must convert stored DC into AC before current can enter the battery.','The grounding path must hold part of the incoming voltage before it reaches the battery.','The charger uses a fuse to regulate and supply the current needed by the battery.','a','Charging a DC battery from an AC supply requires an AC-to-DC rectifying function.'),
      q('mcq-8-004','ch8-current-conversion','understanding','Which statement correctly distinguishes DC and AC?','DC flows one direction; AC reverses direction periodically.','DC is considered direct current only when its voltage remains constant without pulsing.','AC and DC are distinguished mainly by their typical voltage level rather than current direction.','AC reverses direction only after current passes through the connected load.','a','DC and AC are distinguished by current direction, not a universal safety ranking.')
    ],
  },
  {
    id: 'mc-8-03', afterSectionId: 'worked-examples', conceptFamilyId: 'ch8-electrical-measurements', title: 'Electrical Measurements Check',
    questions: [
      q('mcq-8-005','ch8-electrical-measurements','application','A tool is rated 1200 W at 120 V. About how much current does it draw?','10 A.','12 A.','100 A.','144 A.','a','Amps = watts ÷ volts, so 1200 ÷ 120 = 10 A.'),
      q('mcq-8-006','ch8-electrical-measurements','scenario','A barber calculates a dryer draws 15 A. What can be concluded safely from that number alone?','It describes the dryer demand, but not how much additional load a specific circuit can safely carry.','A 15 A dryer leaves about 5 A available on any 20 A circuit, regardless of other connected loads.','A 15 A draw means the dryer should be placed on a dedicated 20 A circuit in every installation.','A 15 A draw proves the receptacle and branch wiring are overloaded if the breaker is rated 20 A.','a','Equipment current draw does not by itself establish the safe capacity of a specific loaded circuit.')
    ],
  },
  {
    id: 'mc-8-04', afterSectionId: 'safety-rules', conceptFamilyId: 'ch8-equipment-safety', title: 'Electrical Safety Check',
    questions: [
      q('mcq-8-007','ch8-equipment-safety','scenario','A cord has exposed insulation but the tool still works. What is the best action?','Remove it from service for proper repair or replacement.','Wrap the exposed area with electrical tape and schedule replacement after the current service.','Use the tool only on a GFCI-protected outlet until the cord can be replaced.','Reduce the tool’s heat or speed setting to lower current draw until the damaged cord is repaired.','a','Visible cord damage is a stop-use condition even when the tool still operates.'),
      q('mcq-8-008','ch8-equipment-safety','scenario','A breaker trips repeatedly while the same tools are running. What is the best response?','Stop and have the load/equipment condition evaluated before continuing.','Reset the breaker once and continue while reducing tool use if it trips again.','Use a higher-capacity breaker so the circuit can support the same equipment load.','Reduce the load by using adapters that bypass grounding on the highest-draw tools.','a','Repeated trips are warning evidence and should not be defeated or ignored.'),
      q('mcq-8-009','ch8-equipment-safety','application','A grounded tool has a three-prong plug but only a two-prong receptacle is available. What should the barber do?','Use a compatible connection that preserves the protective design.','Use a three-to-two-prong adapter if the tool’s wattage is below the receptacle rating.','Connect the tool through a grounded extension cord even though the wall receptacle has only two slots.','Use the tool at a lower setting so the grounding path is less important.','a','Never defeat a grounding feature to make equipment fit an incompatible receptacle.')
    ],
  },
  {
    id: 'mc-8-05', afterSectionId: 'polarity', conceptFamilyId: 'ch8-electrotherapy-terminology', title: 'Electrotherapy Terminology Check',
    questions: [
      q('mcq-8-010','ch8-electrotherapy-terminology','understanding','Which source association is correct?','Red is commonly the positive anode; black is commonly the negative cathode.','Red commonly identifies the negative cathode while black identifies the positive anode.','Red and black primarily indicate current intensity rather than electrode polarity.','Electrode color can be used to select polarity without confirming the device manual or treatment procedure.','a','The source commonly associates red with the anode and black with the cathode.'),
      q('mcq-8-011','ch8-electrotherapy-terminology','scenario','A barber knows electrotherapy terminology but has no training on a requested device. What is the best decision?','Do not perform it until scope, training, screening, and device requirements are satisfied.','Proceed at the device’s lowest preset if screening shows no obvious contraindication.','Proceed if the client signs informed consent and the device includes an automatic shutoff.','Have a trained coworker choose the settings, then operate the device under their verbal direction.','a','Terminology knowledge does not replace scope, training, screening, or device requirements.')
    ],
  },
  {
    id: 'mc-8-06', afterSectionId: 'galvanic-current', conceptFamilyId: 'ch8-galvanic-current', title: 'Galvanic Current Check',
    questions: [
      q('mcq-8-012','ch8-galvanic-current','understanding','Which source-described association is correct?','Cataphoresis is associated with the positive pole/anode.','Cataphoresis uses alternating current to drive product movement at the skin surface.','Cataphoresis is a polarity-balancing technique used to neutralize electrical charge.','Cataphoresis is used primarily to produce a predictable therapeutic tissue response.','a','The source associates cataphoresis with the positive pole/anode.'),
      q('mcq-8-013','ch8-galvanic-current','application','What should determine electrode/product selection for iontophoresis?','The actual procedure, product directions, device instructions, and training.','Use the product’s pH as the main guide, then choose the pole that matches the charge pattern.','Select the pole that produces the clearest sensation at a comfortable setting.','Use the electrode color convention the client recognizes from prior treatments.','a','Device- and procedure-specific instructions should control electrode/product selection.')
    ],
  },
  {
    id: 'mc-8-07', afterSectionId: 'other-modalities', conceptFamilyId: 'ch8-microcurrent-high-frequency', title: 'Modality Check',
    questions: [
      q('mcq-8-014','ch8-microcurrent-high-frequency','application','Which distinction between microcurrent and Tesla high-frequency is most accurate?','Microcurrent uses very low current levels; Tesla high-frequency uses a high oscillation rate.','Both use low electrical current, but differ mainly in electrode shape and treatment duration.','Microcurrent uses low-energy light combined with a very weak current.','High-frequency relies mainly on oscillation in the electrode rather than measurable current through the circuit.','a','The source treats them as different electrical modalities with different current characteristics.'),
      q('mcq-8-015','ch8-microcurrent-high-frequency','scenario','A client reports unexpected burning during a permitted electrical modality. What is the best immediate response?','Stop the service and follow the device safety procedure before any further use.','Reduce intensity one level and continue if the burning sensation stops quickly.','Pause the service, switch polarity or electrode placement, and resume if the skin appears normal.','Shorten the remaining exposure time and continue while monitoring the client’s sensation closely.','a','Unexpected burning is a stop-service signal and should not be normalized.')
    ],
  },
  {
    id: 'mc-8-08', afterSectionId: 'light-types', conceptFamilyId: 'ch8-electromagnetic-spectrum', title: 'Spectrum Check',
    questions: [
      q('mcq-8-016','ch8-electromagnetic-spectrum','understanding','What generally happens to frequency as wavelength decreases?','Frequency increases.','Frequency decreases.','Frequency stays identical.','Frequency becomes zero.','a','Wavelength and frequency are inversely related in the electromagnetic spectrum.'),
      q('mcq-8-017','ch8-electromagnetic-spectrum','application','Which UV association is correct for Chapter 8 study?','UVA—photoaging/tanning; UVB—sunburn/skin damage; UVC—germicidal applications.','UVA—sunburn; UVB—photoaging/tanning; UVC—germicidal applications.','UVA—photoaging/tanning; UVB—germicidal applications; UVC—sunburn/skin damage.','UVA—germicidal applications; UVB—sunburn/skin damage; UVC—photoaging/tanning.','a','The source distinguishes the UV bands by wavelength and associated effects/applications.')
    ],
  },
  {
    id: 'mc-8-09', afterSectionId: 'therapeutic-lamps', conceptFamilyId: 'ch8-light-modalities', title: 'Light Modality Check',
    questions: [
      q('mcq-8-018','ch8-light-modalities','application','How should LED color associations be used professionally?','As device-dependent indications that still require scope, screening, and manufacturer verification.','Use common LED color charts as standardized treatment claims when the listed color matches the device.','Use the color association to choose exposure time even when the device instructions recommend a different protocol.','Treat the same LED color as equivalent across different devices when client screening is unchanged.','a','Source color associations do not create universal treatment guarantees.'),
      q('mcq-8-019','ch8-light-modalities','scenario','A laser service is requested. Which conclusion is safest?','Do not assume ordinary barber licensure authorizes laser operation; verify current authorization and training requirements.','A barber may perform it after completing device training if the client provides informed consent.','Client consent can permit the service when the device is low powered and intended for cosmetic use.','Low-power settings can place the service within ordinary cosmetic scope even when higher settings require separate authorization.','a','Knowing the laser concept does not establish legal or professional authority to operate a laser.')
    ],
  },
  {
    id: 'mc-8-10', afterSectionId: 'light-therapy-safety', conceptFamilyId: 'ch8-light-therapy-safety', title: 'Light Safety Check',
    questions: [
      q('mcq-8-020','ch8-light-therapy-safety','scenario','A client reports a medication that may increase photosensitivity before a light service. What is the best action?','Check device contraindications and do not proceed unless the service is clearly appropriate.','Reduce exposure time by half and proceed if the client reports no prior light reaction.','Switch to a lower-intensity color and proceed after confirming the client is comfortable.','Proceed later in the visit if enough time has passed since the medication dose and the client agrees.','a','Possible photosensitivity requires device-specific screening rather than improvised dose reduction.'),
      q('mcq-8-021','ch8-light-therapy-safety','scenario','A client reports eye discomfort during a light-based service. What should happen first?','Stop the exposure and follow the device safety procedure.','Continue until the planned time ends.','Move the lamp closer.','Remove eye protection to inspect during exposure.','a','Client eye discomfort is a stop-service signal.'),
      q('mcq-8-022','ch8-light-therapy-safety','application','Two light devices specify different times, distances, and eye protection. Which rule should the barber follow?','Use each device’s specific operating and protection instructions with continuous supervision.','Use the same conservative time for both devices while adjusting only distance and eye protection.','Choose the strongest comfortable setting, then reduce time or distance if the client reacts.','Explain the options and let the client choose the settings that feel safest and most comfortable.','a','Light-device operating parameters are device-specific and require continuous client protection.')
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
