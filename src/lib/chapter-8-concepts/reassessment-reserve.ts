import type { Chapter8ConceptFamilyId } from './types'
import type { Chapter8Difficulty } from './grading'

export type Chapter8ReassessmentAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter8ReassessmentQuestion {
  id: `r8-${string}`
  conceptFamilyId: Chapter8ConceptFamilyId
  difficulty: Exclude<Chapter8Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter8ReassessmentAnswer
  explanation: string
}

const q = (
  id: Chapter8ReassessmentQuestion['id'],
  conceptFamilyId: Chapter8ConceptFamilyId,
  difficulty: Chapter8ReassessmentQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter8ReassessmentAnswer,
  explanation: string,
): Chapter8ReassessmentQuestion => ({
  id,
  conceptFamilyId,
  difficulty,
  question,
  answer_a,
  answer_b,
  answer_c,
  answer_d,
  correctAnswer,
  explanation,
})

export const chapter8SafetyReassessmentReserve: readonly Chapter8ReassessmentQuestion[] = [
  q(
    'r8-equipment-safety-001',
    'ch8-equipment-safety',
    'scenario',
    'A dryer cord feels unusually hot near a damaged section of insulation. What is the best action?',
    'Finish the service at a lower heat setting.',
    'Remove the dryer from service and have it properly evaluated or replaced.',
    'Wrap the area with tape and continue only on dry hair.',
    'Move the cord farther from the client and keep using it.',
    'b',
    'Damaged or overheating electrical equipment should be removed from service rather than improvised around.',
  ),
  q(
    'r8-equipment-safety-002',
    'ch8-equipment-safety',
    'scenario',
    'A breaker trips again immediately after being reset with the same tools connected. What should happen next?',
    'Reset it until the haircut is finished.',
    'Replace it with a higher-rated breaker.',
    'Stop using the same setup and have the load or equipment condition evaluated.',
    'Remove a grounding pin from one tool.',
    'c',
    'Repeated tripping is a warning condition; protective devices should not be defeated or repeatedly reset without addressing the cause.',
  ),
  q(
    'r8-equipment-safety-003',
    'ch8-equipment-safety',
    'application',
    'A three-prong tool will not fit the available two-prong receptacle. Which decision preserves the intended safety design?',
    'Remove the grounding prong.',
    'Use an approved compatible connection or another properly configured receptacle.',
    'Bend the grounding prong flat.',
    'Use the tool only on its lowest setting.',
    'b',
    'Grounding features should not be altered to force compatibility.',
  ),
  q(
    'r8-equipment-safety-004',
    'ch8-equipment-safety',
    'application',
    'A barber calculates that a dryer draws 15 amps. What can that number establish by itself?',
    'The dryer current demand, but not the safe remaining capacity of the actual circuit.',
    'That any 20-amp circuit can safely run a second dryer.',
    'That the outlet is already overloaded.',
    'That the dryer must be direct current.',
    'a',
    'Current draw describes equipment demand; total safe loading depends on the actual circuit and connected equipment.',
  ),
  q(
    'r8-equipment-safety-005',
    'ch8-equipment-safety',
    'scenario',
    'A powered tool is being set up where water exposure may occur. Which approach is most appropriate?',
    'Rely on a plastic handle instead of protective electrical measures.',
    'Use the protection required by the location, facility, applicable code, and equipment instructions.',
    'Use an extension cord to move the plug closer to the sink.',
    'Remove the grounding feature if the outlet is inconvenient.',
    'b',
    'Electrical protection near water should follow the applicable location and equipment requirements rather than improvised shortcuts.',
  ),
  q(
    'r8-light-therapy-safety-001',
    'ch8-light-therapy-safety',
    'scenario',
    'Before a permitted light-based service, a client reports taking a medication associated with photosensitivity. What is the best next step?',
    'Automatically cut the treatment time in half.',
    'Proceed if the client signs consent.',
    'Check the device contraindications and do not proceed unless the service is clearly appropriate.',
    'Change the light color without further screening.',
    'c',
    'Possible photosensitivity requires device-specific screening rather than an improvised dose adjustment.',
  ),
  q(
    'r8-light-therapy-safety-002',
    'ch8-light-therapy-safety',
    'scenario',
    'A client reports eye discomfort during a light-based service. What should happen first?',
    'Continue until the planned time ends.',
    'Stop the exposure and follow the device safety procedure.',
    'Move the device farther away but keep the timer running.',
    'Remove eye protection during active exposure to inspect the eye.',
    'b',
    'Eye discomfort is a stop-service signal requiring immediate protection and device-safety steps.',
  ),
  q(
    'r8-light-therapy-safety-003',
    'ch8-light-therapy-safety',
    'application',
    'Two professional light devices specify different exposure times and eye-protection requirements. Which rule should control?',
    'Use one universal timing rule for both.',
    'Use the stronger settings because they are more effective.',
    'Follow each device\'s own operating and protection instructions.',
    'Let the client choose whichever settings feel comfortable.',
    'c',
    'Operating parameters and protection requirements are device-specific.',
  ),
  q(
    'r8-light-therapy-safety-004',
    'ch8-light-therapy-safety',
    'scenario',
    'A requested light-based service is outside the barber\'s verified authorization or training. What is the best decision?',
    'Perform it at the lowest setting.',
    'Proceed if another student has done it before.',
    'Do not perform it until scope, training, and device requirements are satisfied.',
    'Proceed if the client signs a waiver.',
    'c',
    'Client consent does not replace scope-of-practice, training, or device-use requirements.',
  ),
  q(
    'r8-light-therapy-safety-005',
    'ch8-light-therapy-safety',
    'scenario',
    'During a permitted light service, the device produces an unexpected condition not described as normal in its instructions. What should the barber do?',
    'Continue and observe whether it resolves.',
    'Stop the service and follow the manufacturer safety procedure before reuse.',
    'Increase distance while keeping the device active.',
    'Change the light color and continue.',
    'b',
    'Unexpected device or client safety signals should trigger a stop-and-evaluate response rather than improvisation.',
  ),
]


export const chapter8OrdinaryReassessmentReserve: readonly Chapter8ReassessmentQuestion[] = [
  q('r8-electricity-circuits-001','ch8-electricity-circuits','application','A powered tool stops when a switch opens its circuit. Which explanation best fits?','The open switch breaks the complete path needed for current flow.','The switch changes AC into DC.','The switch creates more voltage.','The switch turns an insulator into a conductor.','a','Current needs a complete path; opening the circuit interrupts that path.'),
  q('r8-electricity-circuits-002','ch8-electricity-circuits','scenario','A dry plastic comb and a metal clip are near a powered tool. Which object should receive greater electrical-conduction caution?','The dry plastic comb.','The metal clip.','Both are equally conductive.','Neither can conduct electricity.','b','Metal is the stronger conductor in the stated comparison, while dry plastic is an insulator.'),
  q('r8-electricity-circuits-003','ch8-electricity-circuits','application','Which condition is necessary for intended current flow through a simple circuit?','A complete conductive path.','An open switch.','A broken conductor.','A disconnected source.','a','A functioning circuit requires a complete path for current.'),
  q('r8-electricity-circuits-004','ch8-electricity-circuits','scenario','A cord conductor is broken inside its insulation. What circuit effect is most likely?','The path is interrupted and current cannot continue normally.','Resistance becomes a power source.','The circuit automatically becomes DC.','Voltage doubles throughout the tool.','a','A broken conductor interrupts the intended electrical path.'),
  q('r8-electricity-circuits-005','ch8-electricity-circuits','application','Why are insulators useful around electrical conductors?','They help resist unintended current flow to surrounding surfaces or people.','They increase wattage.','They convert current direction.','They replace grounding systems.','a','Insulators resist current flow and help separate conductive parts from unintended contact.'),

  q('r8-current-conversion-001','ch8-current-conversion','application','A battery-powered tool requires current that flows in one direction. Which current type is that?','Alternating current.','Direct current.','Static current.','Ground-fault current.','b','Direct current flows in one direction.'),
  q('r8-current-conversion-002','ch8-current-conversion','scenario','A charger plugs into an AC wall supply but charges a DC battery. What function is required?','AC-to-DC rectifying conversion.','DC-to-AC inversion inside the battery.','A fuse that stores current.','A resistor that becomes a generator.','a','Charging a DC battery from an AC source requires AC-to-DC conversion.'),
  q('r8-current-conversion-003','ch8-current-conversion','application','Which statement best distinguishes AC from DC?','AC changes direction periodically, while DC flows in one direction.','AC has no voltage, while DC always has voltage.','DC can only come from wall outlets.','AC can never power barber equipment.','a','The key distinction is current direction.'),
  q('r8-current-conversion-004','ch8-current-conversion','scenario','A device label specifies DC input, but the available source is AC. What must happen before the device can use the supply as intended?','The current must be converted to the form required by the device.','The grounding pin must be removed.','The voltage must always be doubled.','The circuit must be opened.','a','Equipment should receive the form of current it is designed to use.'),
  q('r8-current-conversion-005','ch8-current-conversion','application','What is the safest reasoning when a professional device uses internal current conversion?','Follow the device design and manufacturer instructions rather than improvising electrical changes.','Modify the wiring until the device starts.','Assume all converters perform the same function.','Bypass protective components to reduce resistance.','a','Current-conversion details are device-specific and should not be improvised.'),

  q('r8-electrical-measurements-001','ch8-electrical-measurements','application','A tool is rated 1200 watts at 120 volts. Approximately how much current does it draw?','5 amps.','10 amps.','12 amps.','100 amps.','b','Amps = watts ÷ volts, so 1200 ÷ 120 = 10 amps.'),
  q('r8-electrical-measurements-002','ch8-electrical-measurements','application','Which quantity describes electrical pressure or potential?','Volts.','Amperes.','Ohms.','Watts.','a','Voltage represents electrical potential or pressure.'),
  q('r8-electrical-measurements-003','ch8-electrical-measurements','application','Which quantity describes resistance to electrical flow?','Volts.','Amperes.','Ohms.','Watts.','c','Resistance is measured in ohms.'),
  q('r8-electrical-measurements-004','ch8-electrical-measurements','scenario','A barber calculates a dryer draws 15 amps. Which conclusion is justified?','The dryer current demand is about 15 amps, but total safe circuit loading still depends on the actual circuit and other loads.','Any 20-amp circuit can always run another dryer.','The outlet is definitely unsafe.','The dryer must use DC.','a','The calculation gives equipment current demand, not universal remaining circuit capacity.'),
  q('r8-electrical-measurements-005','ch8-electrical-measurements','application','Which formula correctly expresses electrical power?','Watts = volts × amps.','Watts = volts ÷ amps.','Watts = ohms ÷ volts.','Watts = amps ÷ volts.','a','Electrical power in watts can be calculated from volts multiplied by amps.'),

  q('r8-electrotherapy-terminology-001','ch8-electrotherapy-terminology','application','In common electrotherapy terminology, which terminal is generally identified as the anode?','The positive terminal.','The negative terminal.','The neutral terminal only.','The grounding conductor.','a','The anode is generally associated with the positive pole in the source terminology.'),
  q('r8-electrotherapy-terminology-002','ch8-electrotherapy-terminology','application','What is the best role of an electrode in an electrotherapy setup?','It provides a controlled contact point through which the intended electrical modality is applied.','It converts every current to AC.','It replaces client screening.','It proves the service is within scope.','a','Electrodes are application/contact components; they do not replace authorization or safety screening.'),
  q('r8-electrotherapy-terminology-003','ch8-electrotherapy-terminology','scenario','A barber recognizes the red and black terminals on a device but has not been trained on the service. What should happen?','Proceed because terminal colors are understood.','Do not perform the service until training, scope, and device requirements are satisfied.','Use the lowest setting and experiment.','Ask the client to choose the polarity.','b','Terminology knowledge does not replace training, scope, or manufacturer requirements.'),
  q('r8-electrotherapy-terminology-004','ch8-electrotherapy-terminology','application','Why is polarity important in electrotherapy terminology?','Different poles can be associated with different effects and procedures, so device-specific instructions matter.','Polarity proves every service is safe.','Polarity only affects battery life.','Polarity eliminates the need for electrodes.','a','Polarity is part of how electrotherapy modalities are described and applied.'),
  q('r8-electrotherapy-terminology-005','ch8-electrotherapy-terminology','scenario','A device uses terminology the barber recognizes, but its instructions differ from another machine. Which source should control operation?','The specific device instructions.','The older machine instructions.','A universal electrotherapy timing rule.','The client preference.','a','Operation should follow the actual device instructions rather than assumed universal rules.'),

  q('r8-galvanic-current-001','ch8-galvanic-current','application','Which description best fits galvanic current in the Chapter 8 source framework?','A direct-current modality with positive and negative poles used for specific professional procedures.','A light-only modality with no polarity.','An alternating-current household supply.','A grounding device used to reset breakers.','a','Galvanic current is treated as a direct-current modality with polarity.'),
  q('r8-galvanic-current-002','ch8-galvanic-current','scenario','A student memorizes one galvanic example and treats it as a universal treatment rule. What is the problem?','Procedure details depend on the intended service, device, training, and instructions.','Galvanic current never uses polarity.','All professional devices use identical settings.','Universal timing rules are always safer.','a','Chapter 8 avoids turning source examples into universal device or treatment rules.'),
  q('r8-galvanic-current-003','ch8-galvanic-current','application','Why must a barber distinguish the positive and negative poles during a permitted galvanic procedure?','Because polarity is part of the intended current effects and application method.','Because either pole can be removed without effect.','Because polarity changes wattage into voltage.','Because polarity proves client eligibility.','a','Galvanic procedures rely on correct polarity identification.'),
  q('r8-galvanic-current-004','ch8-galvanic-current','scenario','A device manual specifies a particular galvanic setup that differs from a class example. What should the barber follow?','The device manual within scope and training.','The class example regardless of the device.','Whichever setting is stronger.','A fixed universal timing rule.','a','Device-specific instructions control operation when the service is permitted and the user is trained.'),
  q('r8-galvanic-current-005','ch8-galvanic-current','application','What is the safest interpretation of galvanic-current effects?','Use source concepts to understand the modality, but apply only device- and scope-appropriate procedures.','Assume every client receives the same effect from the same timing.','Treat polarity as optional.','Ignore manufacturer instructions if the concept is understood.','a','Concept knowledge supports reasoning but does not replace device-specific procedure rules.'),

  q('r8-microcurrent-high-frequency-001','ch8-microcurrent-high-frequency','application','What is the best reason to distinguish microcurrent from high-frequency modalities?','They are different electrotherapy modalities with different characteristics and professional-use considerations.','They are identical except for color.','Both are simply forms of visible light.','Neither requires device instructions.','a','They are distinct modalities and should not be treated as interchangeable.'),
  q('r8-microcurrent-high-frequency-002','ch8-microcurrent-high-frequency','scenario','A barber is trained on one electrotherapy device but not another high-frequency device. What is the correct decision?','Assume the controls are equivalent.','Do not perform the untrained service until scope, training, and device requirements are satisfied.','Use the same settings as the first device.','Let the client select the intensity.','b','Different modalities and devices require appropriate training and authorized use.'),
  q('r8-microcurrent-high-frequency-003','ch8-microcurrent-high-frequency','application','Which statement best supports safe modality selection?','Identify the modality correctly before applying device-specific procedures.','Choose whichever device has the highest setting.','Treat microcurrent and high frequency as interchangeable.','Use one universal contraindication list for all devices.','a','Correct modality identification comes before device-specific application decisions.'),
  q('r8-microcurrent-high-frequency-004','ch8-microcurrent-high-frequency','scenario','A student remembers a benefit associated with a modality and assumes it guarantees the same outcome for every client. What is the better reasoning?','Treat the concept as educational context, not a guaranteed outcome, and follow device/scope requirements.','Guarantee the outcome if the device is professional.','Increase intensity until the expected result appears.','Ignore client-specific screening.','a','Chapter 8 avoids guaranteed treatment claims and emphasizes professional-use boundaries.'),
  q('r8-microcurrent-high-frequency-005','ch8-microcurrent-high-frequency','application','What should guide settings on a permitted microcurrent or high-frequency device?','The actual device instructions, training, client screening, and scope.','A universal intensity rule.','Whichever setting feels strongest.','A different device manual.','a','Settings and procedures are device-specific and bounded by training and scope.'),

  q('r8-electromagnetic-spectrum-001','ch8-electromagnetic-spectrum','application','How are wavelength and frequency related in electromagnetic energy?','As wavelength decreases, frequency increases.','They always increase together.','Frequency exists only in visible light.','Wavelength applies only to electricity in wires.','a','Wavelength and frequency are inversely related.'),
  q('r8-electromagnetic-spectrum-002','ch8-electromagnetic-spectrum','application','Which statement best distinguishes visible from invisible electromagnetic energy?','Some wavelengths are detectable by the human eye while others are outside the visible range.','Invisible energy has no wavelength.','Visible light has no frequency.','All electromagnetic energy is visible.','a','Visibility depends on where the wavelength falls within the electromagnetic spectrum.'),
  q('r8-electromagnetic-spectrum-003','ch8-electromagnetic-spectrum','scenario','A student assumes all shorter wavelengths produce the same professional effect. What is wrong with that reasoning?','Position on the spectrum does not create one universal treatment effect across devices or services.','Shorter wavelengths have no frequency.','All shorter wavelengths are visible.','Wavelength never matters.','a','Spectrum relationships should not be converted into universal treatment claims.'),
  q('r8-electromagnetic-spectrum-004','ch8-electromagnetic-spectrum','application','Ultraviolet and infrared are best understood as what?','Different regions of the electromagnetic spectrum outside the visible range.','Two names for direct current.','Electrical resistance units.','Types of grounding devices.','a','UV and infrared are distinct electromagnetic regions beyond visible light.'),
  q('r8-electromagnetic-spectrum-005','ch8-electromagnetic-spectrum','scenario','A light device uses a particular wavelength. What should determine how it is operated professionally?','Its actual manufacturer instructions, permitted use, and client-protection requirements.','A universal rule based only on wavelength.','The brightest visible color.','The highest available power setting.','a','Spectrum knowledge informs understanding, while device use remains device- and scope-specific.'),

  q('r8-light-modalities-001','ch8-light-modalities','application','What is the best way to compare two professional light-therapy devices?','Identify the specific modality and intended professional purpose of each device before applying its instructions.','Assume all light devices work the same way.','Use the same time and distance for both.','Choose whichever appears brighter.','a','Different light modalities and devices have different intended uses and operating requirements.'),
  q('r8-light-modalities-002','ch8-light-modalities','scenario','A therapeutic lamp and another light-based device specify different procedures. Which approach is correct?','Follow each device-specific procedure within scope and training.','Use one universal procedure for all lamps.','Use the longer time for both devices.','Ignore differences because both emit light.','a','Device-specific procedures matter even when both devices are light based.'),
  q('r8-light-modalities-003','ch8-light-modalities','application','Why should a barber identify the device category before use?','The device category helps determine its intended purpose, operating method, and protection requirements.','The category guarantees a treatment result.','The category eliminates client screening.','The category proves legal authorization.','a','Correct identification supports appropriate professional reasoning without replacing other requirements.'),
  q('r8-light-modalities-004','ch8-light-modalities','scenario','A client asks for a result that the device literature does not promise. What is the best response?','Avoid guaranteeing the result and use the device only for its supported professional purpose.','Promise the result if the client consents.','Increase exposure until the result occurs.','Switch devices without screening.','a','Chapter 8 avoids guaranteed treatment outcomes and keeps device claims bounded.'),
  q('r8-light-modalities-005','ch8-light-modalities','application','What is the safest rule when two light modalities have different operating limits?','Treat the limits as device-specific rather than universal.','Average the two limits.','Always use the stronger device settings.','Let the client select the exposure.','a','Operating limits should come from the actual device and applicable professional requirements.'),
]

export const chapter8ReassessmentReserve: readonly Chapter8ReassessmentQuestion[] = [
  ...chapter8OrdinaryReassessmentReserve,
  ...chapter8SafetyReassessmentReserve,
]

export function getChapter8ReassessmentReserve(
  conceptFamilyId: Chapter8ConceptFamilyId,
): readonly Chapter8ReassessmentQuestion[] {
  return chapter8ReassessmentReserve.filter(
    (question) => question.conceptFamilyId === conceptFamilyId,
  )
}
