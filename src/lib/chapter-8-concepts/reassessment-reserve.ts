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

export function getChapter8ReassessmentReserve(
  conceptFamilyId: Chapter8ConceptFamilyId,
): readonly Chapter8ReassessmentQuestion[] {
  return chapter8SafetyReassessmentReserve.filter(
    (question) => question.conceptFamilyId === conceptFamilyId,
  )
}
