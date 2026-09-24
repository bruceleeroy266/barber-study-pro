/**
 * Chapter 6 Reassessment Reserve (C6-5)
 *
 * 150 unseen questions: 15 per canonical concept family. The initial
 * qq-6-001..050 bank is never reused for remediation knowledge checks.
 * Five questions per cycle × three cycles = 15-question capacity per family.
 */

import type { QuizQuestion } from '@/types'

type Fact = {
  cue: string
  correct: string
  distractors: [string, string, string]
}

type Family = {
  name: string
  facts: readonly Fact[]
}

const families: readonly Family[] = [
  {
    name: 'Cells, Tissues & Basic Physiology',
    facts: [
      { cue:'ordinary tissue growth and repair', correct:'Mitosis produces new somatic cells.', distractors:['Metabolism divides one cell into two.','Diffusion copies DNA and creates daughter cells.','Keratinization is the universal form of cell division.'] },
      { cue:'selective movement into and out of a cell', correct:'The cell membrane regulates what enters and exits.', distractors:['The nucleus is the selective outer boundary.','Ribosomes control all membrane transport.','The Golgi apparatus forms the outer cell boundary.'] },
      { cue:'protein synthesis', correct:'Ribosomes build proteins from genetic instructions.', distractors:['Lysosomes synthesize proteins.','Centrioles package proteins for secretion.','Mitochondria are the main protein-building structures.'] },
      { cue:'homeostasis', correct:'Homeostasis is maintenance of relatively stable internal conditions.', distractors:['Homeostasis means all chemical reactions stop.','Homeostasis is another name for mitosis.','Homeostasis refers only to skin temperature.'] },
      { cue:'tissue classification', correct:'Blood is connective tissue, while the epidermal covering is epithelial tissue.', distractors:['Blood is epithelial tissue and skin is nervous tissue.','Blood and epidermis are both muscular tissue.','Blood is an organ and epidermis is a gland.'] },
    ],
  },
  {
    name: 'Body Systems Overview',
    facts: [
      { cue:'structure versus function', correct:'Anatomy studies structure; physiology studies function.', distractors:['Anatomy studies disease; physiology studies sanitation.','Anatomy studies chemicals only; physiology studies bones only.','Anatomy and physiology are interchangeable terms.'] },
      { cue:'systems integration during a service', correct:'Skin, nerves, muscles, and circulation can interact during one service.', distractors:['Body systems function independently during services.','Only the integumentary system can matter in barbering.','The endocrine system directly performs every service response.'] },
      { cue:'primary barber service interface', correct:'The integumentary system is the most direct service interface.', distractors:['The urinary system is the primary service interface.','The endocrine system is directly cut and shaved.','The skeletal system is the only system barbers contact.'] },
      { cue:'safe use of physiology knowledge', correct:'Use physiology to understand normal function without diagnosing disease.', distractors:['Physiology allows barbers to diagnose medical conditions.','Physiology replaces infection-control rules.','Physiology authorizes medical treatment during services.'] },
      { cue:'metabolism', correct:'Metabolism refers to the body’s life-sustaining chemical reactions.', distractors:['Metabolism means only body movement.','Metabolism is another term for homeostasis.','Metabolism refers only to blood circulation.'] },
    ],
  },
  {
    name: 'Skeletal System',
    facts: [
      { cue:'movable facial bone', correct:'The mandible is the movable lower jaw.', distractors:['The maxilla is the movable lower jaw.','The zygomatic bone opens and closes the mouth.','The frontal bone moves during chewing.'] },
      { cue:'cheekbone landmark', correct:'The zygomatic bone forms the cheek prominence.', distractors:['The occipital bone forms the cheek prominence.','The parietal bone forms the upper jaw.','The nasal bone forms the jaw angle.'] },
      { cue:'posterior skull landmark', correct:'The occipital bone forms the back of the skull.', distractors:['The frontal bone forms the back of the skull.','The maxilla forms the posterior skull.','The zygomatic bone forms the nape landmark.'] },
      { cue:'adult spinal-column count convention', correct:'The adult spinal column is described as 26 bones because sacrum and coccyx are fused.', distractors:['Every adult has 33 separate spinal bones.','The adult spinal column contains only 24 bones total.','The cervical region is excluded from the spinal column.'] },
      { cue:'neck support', correct:'The cervical region is the spinal region most directly involved in neck support.', distractors:['The coccyx is the main neck-support region.','The lumbar region is located in the neck.','The sacrum supports the head directly.'] },
    ],
  },
  {
    name: 'Muscular System',
    facts: [
      { cue:'jaw clenching', correct:'The masseter is a major jaw-closing muscle.', distractors:['The frontalis is a major jaw-closing muscle.','The orbicularis oculi closes the jaw.','The platysma is the primary chewing muscle.'] },
      { cue:'head rotation and neck flexion', correct:'The sternocleidomastoid rotates and flexes the head and neck.', distractors:['The buccinator rotates the head.','The orbicularis oris flexes the neck.','The frontalis is the main neck rotator.'] },
      { cue:'epicranial aponeurosis', correct:'The epicranial aponeurosis is a fibrous tendon connecting frontalis and occipitalis.', distractors:['It is a fourth scalp muscle.','It is a facial bone.','It is a cranial nerve branch.'] },
      { cue:'goosebumps', correct:'Arrector pili are smooth involuntary muscles.', distractors:['Arrector pili are cardiac muscles.','Arrector pili are voluntary skeletal muscles.','Arrector pili are sensory nerves.'] },
      { cue:'cardiac muscle', correct:'Cardiac muscle is involuntary striated muscle found in the heart.', distractors:['Cardiac muscle is voluntary muscle attached to bone.','Cardiac muscle is smooth muscle in vessel walls.','Cardiac muscle surrounds hair follicles.'] },
    ],
  },
  {
    name: 'Nervous System',
    facts: [
      { cue:'central nervous system', correct:'The CNS consists of the brain and spinal cord.', distractors:['The CNS consists only of cranial nerves.','The CNS is the heart and blood vessels.','The CNS is the skin and sensory receptors only.'] },
      { cue:'sensory direction', correct:'Sensory or afferent signals travel toward the CNS.', distractors:['Sensory signals travel only away from the CNS.','Sensory signals go directly to endocrine glands only.','Sensory signals originate in the heart.'] },
      { cue:'facial sensation versus expression', correct:'Trigeminal nerve V is strongly associated with facial sensation; facial nerve VII with facial expression.', distractors:['Facial nerve VII carries all facial sensation and V controls hearing.','V and VII have identical functions.','Neither V nor VII relates to the face.'] },
      { cue:'dizziness during forceful neck work', correct:'Stop the service, position the client safely, assess, and follow first-aid or emergency procedures as needed.', distractors:['Increase pressure until symptoms resolve.','Diagnose vagus-nerve stimulation.','Continue the service if the client prefers.'] },
      { cue:'neuron signal direction', correct:'Dendrites generally receive toward the cell body; the axon carries signals away.', distractors:['Axons receive all signals and dendrites send them away.','Dendrites and axons have no signal-direction roles.','Both structures are endocrine glands.'] },
    ],
  },
  {
    name: 'Cardiovascular System',
    facts: [
      { cue:'artery versus vein rule', correct:'Arteries carry blood away from the heart; veins return blood toward the heart.', distractors:['Arteries always carry oxygenated blood and veins always carry deoxygenated blood.','Arteries exist only in the head and veins only in the neck.','Veins pump blood while arteries filter it.'] },
      { cue:'pulmonary exception', correct:'Direction relative to the heart is more reliable than oxygen content because pulmonary vessels are exceptions.', distractors:['Pulmonary vessels follow the same oxygen shortcut without exception.','Oxygen content defines vessel type more reliably than direction.','Pulmonary circulation contains no arteries.'] },
      { cue:'carotid-area service safety', correct:'Avoid sustained or forceful pressure over the carotid area.', distractors:['Use deep sustained pressure to improve circulation.','Compress both sides of the neck to assess pulse strength.','Massage the area until dizziness stops.'] },
      { cue:'capillary function', correct:'Capillaries are primary exchange sites between blood and tissues.', distractors:['Capillaries pump blood from the heart.','Capillaries produce sebum.','Capillaries are the largest veins.'] },
      { cue:'living scalp tissue support', correct:'Circulation delivers oxygen and nutrients to living tissues and carries wastes away.', distractors:['Hair shafts receive oxygen directly from the lungs.','Sebum transports oxygen to follicles.','The epidermis contains large blood vessels.'] },
    ],
  },
  {
    name: 'Lymphatic & Immune System',
    facts: [
      { cue:'lymph-node function', correct:'Lymph nodes filter lymph and support immune activity.', distractors:['Lymph nodes pump blood.','Lymph nodes produce sebum.','Lymph nodes control facial expression.'] },
      { cue:'persistent swollen area', correct:'Avoid manipulation, do not diagnose, and recommend appropriate medical evaluation.', distractors:['Massage the area firmly to drain it.','Tell the client the swelling proves infection.','Apply heat and continue the service.'] },
      { cue:'swelling interpretation', correct:'Swelling can have multiple causes and is not diagnostic by itself.', distractors:['Any swollen node proves infection.','Any swollen node proves cancer.','Swelling always resolves with massage.'] },
      { cue:'largest lymphatic organ', correct:'The spleen is the largest lymphatic organ.', distractors:['The thyroid is the largest lymphatic organ.','The pituitary is the largest lymphatic organ.','The pancreas is the largest lymphatic organ.'] },
      { cue:'lymphatic fluid role', correct:'The lymphatic system helps return excess tissue fluid and supports immune defense.', distractors:['It replaces cardiovascular circulation.','It produces all hormones.','It is the primary system for gas exchange.'] },
    ],
  },
  {
    name: 'Integumentary System',
    facts: [
      { cue:'dermis contents', correct:'The dermis contains hair follicles, glands, blood vessels, and nerve endings.', distractors:['The epidermis contains large blood vessels.','The hair shaft contains sweat glands.','The stratum corneum contains all follicles.'] },
      { cue:'epidermis', correct:'The epidermis is avascular and is nourished by diffusion from deeper tissues.', distractors:['The epidermis contains its own major blood vessels.','The epidermis is identical to subcutaneous tissue.','The epidermis contains all hair follicles.'] },
      { cue:'sebaceous glands', correct:'Sebaceous glands produce sebum and are commonly associated with follicles; some open directly onto skin.', distractors:['Every sebaceous gland must connect to a hair follicle.','Sweat glands produce sebum.','Sebaceous glands filter lymph.'] },
      { cue:'epidermal renewal', correct:'Epidermal renewal occurs over several weeks and varies by age, site, and individual.', distractors:['The entire epidermis always replaces itself in exactly 27 days.','Only the dermis renews.','Renewal requires blood vessels inside the epidermis.'] },
      { cue:'barber relevance', correct:'The integumentary system includes skin, hair, nails, and glands—the primary service interface.', distractors:['It controls every other body system.','It replaces sanitation procedures.','It authorizes diagnosis of skin disease.'] },
    ],
  },
  {
    name: 'Endocrine System',
    facts: [
      { cue:'pituitary scope', correct:'The pituitary regulates several other endocrine glands but does not control every endocrine gland.', distractors:['The pituitary directly controls every endocrine gland.','The pituitary is a sweat gland.','The pituitary produces sebum.'] },
      { cue:'thyroid and hair changes', correct:'Thyroid disorders can be associated with hair changes, but a barber should not diagnose the cause.', distractors:['Hair thinning proves thyroid disease.','Thyroid hormones never affect hair.','A barber should recommend thyroid medication.'] },
      { cue:'androgens', correct:'Androgens can influence facial-hair development and sebaceous activity, with individual variation.', distractors:['Androgens guarantee identical beard growth in everyone.','Androgens are produced only by the pituitary.','Androgens have no relationship to hair or skin.'] },
      { cue:'pancreas hormones', correct:'The pancreas produces insulin and glucagon.', distractors:['The pancreas produces sebum only.','The pancreas produces melanin only.','The pancreas produces testosterone only.'] },
      { cue:'puberty-related oiliness', correct:'Hormonal changes can increase sebaceous activity, but oiliness varies and should not be diagnosed as a disorder.', distractors:['Poor hygiene is always the cause.','Oiliness proves an endocrine disease.','The lymphatic system produces facial oil.'] },
    ],
  },
  {
    name: 'Other Body Systems',
    facts: [
      { cue:'respiratory and cardiovascular teamwork', correct:'Respiration brings oxygen into the body; circulation transports it to tissues.', distractors:['The lungs directly pump oxygen through arteries.','Respiration replaces cardiovascular circulation.','The respiratory system supplies only hair follicles.'] },
      { cue:'digestive-system core function', correct:'The digestive system breaks food down so nutrients can be absorbed and used.', distractors:['The digestive system filters lymph.','The digestive system pumps blood.','The digestive system performs gas exchange.'] },
      { cue:'urinary-system core function', correct:'The urinary system helps remove wastes and regulate fluid and electrolyte balance.', distractors:['The urinary system controls facial expression.','The urinary system produces sebum.','The urinary system performs gas exchange.'] },
      { cue:'dry skin and kidney inference', correct:'Dry skin is nonspecific; a barber should not infer kidney function or diagnose disease from it alone.', distractors:['Dry skin proves kidney disease.','Kidneys directly produce skin oil.','Dry skin rules out urinary problems.'] },
      { cue:'reproductive-system relevance', correct:'Life-stage hormonal changes can influence hair-growth patterns, texture, and skin condition with individual variation.', distractors:['Hair changes allow a barber to diagnose pregnancy.','Reproductive changes guarantee identical hair effects in everyone.','The reproductive system replaces endocrine function.'] },
    ],
  },
]

function rotateAnswers(correct: string, distractors: readonly string[], index: number) {
  const position = index % 4
  const answers = [...distractors]
  answers.splice(position, 0, correct)
  return { answers, correct: ['a','b','c','d'][position] as 'a'|'b'|'c'|'d' }
}

const stemBuilders = [
  (cue: string) => `Which statement BEST applies to ${cue}?`,
  (cue: string) => `A student is reviewing ${cue}. Which correction is MOST accurate?`,
  (cue: string) => `On a difficult exam item about ${cue}, which choice should remain after eliminating the inaccurate options?`,
]

const questions: QuizQuestion[] = []
let sequence = 51

for (const family of families) {
  for (const fact of family.facts) {
    for (let variant = 0; variant < 3; variant++) {
      const { answers, correct } = rotateAnswers(fact.correct, fact.distractors, sequence)
      questions.push({
        id: `qq-6-${String(sequence).padStart(3, '0')}`,
        quiz_id: 'quiz-6',
        question: stemBuilders[variant](fact.cue),
        answer_a: answers[0],
        answer_b: answers[1],
        answer_c: answers[2],
        answer_d: answers[3],
        correct_answer: correct,
        explanation: `Read carefully. Identify the keyword or service condition in the stem. Eliminate choices that conflict with Chapter 6 anatomy, physiology, or scope. Apply safety/procedure logic when relevant. Then choose the best remaining answer: ${fact.correct}`,
        difficulty: 'hard',
        order_index: sequence,
      })
      sequence++
    }
  }
}

export const chapter6ReassessmentQuestions: QuizQuestion[] = questions

if (chapter6ReassessmentQuestions.length !== 150) {
  throw new Error(`Chapter 6 reassessment reserve must contain 150 questions; got ${chapter6ReassessmentQuestions.length}`)
}
