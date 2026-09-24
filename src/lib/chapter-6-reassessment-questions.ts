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
      { cue:'upper-arm bone', correct:'The humerus extends from the shoulder to the elbow.', distractors:['The radius is the upper-arm bone.','The ulna forms the upper arm from shoulder to elbow.','The metacarpals form the upper arm.'] },
      { cue:'forearm bone orientation', correct:'The radius is on the thumb side and the ulna is on the little-finger side.', distractors:['The ulna is on the thumb side and radius is on the little-finger side.','Both radius and ulna are wrist bones.','The radius and ulna are facial bones.'] },
      { cue:'wrist-palm-finger sequence', correct:'Carpals form the wrist, metacarpals form the palm, and phalanges form the fingers.', distractors:['Metacarpals form the wrist and carpals form the fingers.','Phalanges form the palm and humerus forms the wrist.','Ulna forms the palm and radius forms the fingers.'] },
      { cue:'hyoid location', correct:'The hyoid is a U-shaped bone at the base of the tongue.', distractors:['The hyoid is the movable lower jaw.','The hyoid forms the forehead.','The hyoid is one of the wrist bones.'] },
      { cue:'adult spinal-column count convention', correct:'The adult spinal column is described as 26 bones because sacrum and coccyx are fused.', distractors:['Every adult has 33 separate spinal bones.','The adult spinal column contains only 24 bones total.','The cervical region is excluded from the spinal column.'] },
    ],
  },
  {
    name: 'Muscular System',
    facts: [
      { cue:'muscle origin and insertion', correct:'The origin is relatively fixed while the insertion moves during contraction.', distractors:['The insertion is always fixed while the origin moves.','Origin and insertion are names for two muscle types.','The belly is the only attachment point of a muscle.'] },
      { cue:'biceps and triceps', correct:'Biceps helps flex the elbow while triceps extends the forearm.', distractors:['Biceps extends the forearm and triceps flexes the jaw.','Both biceps and triceps are facial muscles.','Triceps pronates the palm while biceps closes the eyelid.'] },
      { cue:'pronation and supination', correct:'Pronators turn the palm inward/downward; supinators turn it upward/outward.', distractors:['Pronators raise the eyebrow; supinators close the jaw.','Pronation and supination are types of cardiac contraction.','Supinators turn the palm down while pronators turn it up.'] },
      { cue:'deltoid function', correct:'The deltoid covers the shoulder joint and helps move the arm outward from the body.', distractors:['The deltoid is the major jaw-closing muscle.','The deltoid surrounds the eye.','The deltoid is a smooth muscle of the digestive tract.'] },
      { cue:'three muscle types', correct:'Skeletal/striated, smooth/nonstriated, and cardiac are the three major muscle types.', distractors:['Epithelial, connective, and nervous are the three muscle types.','Voluntary, endocrine, and cardiac are the three muscle types.','Facial, cervical, and cardiac are the three muscle types.'] },
    ],
  },
  {
    name: 'Nervous System',
    facts: [
      { cue:'facial sensation versus expression', correct:'Trigeminal nerve V is strongly associated with facial sensation; facial nerve VII with facial expression.', distractors:['Facial nerve VII carries all facial sensation and V controls hearing.','V and VII have identical functions.','Neither V nor VII relates to the face.'] },
      { cue:'facial nerve temporal branch', correct:'The temporal branch of the facial nerve serves muscles in the temple and forehead region.', distractors:['The temporal branch is a vein that drains the neck.','The temporal branch is the main sensory nerve of the fingers.','The temporal branch supplies only the lower leg.'] },
      { cue:'facial nerve buccal branch', correct:'The buccal branch of the facial nerve serves muscles around the mouth and cheek.', distractors:['The buccal branch supplies the posterior scalp.','The buccal branch is a branch of the carotid artery.','The buccal branch controls the shoulder joint.'] },
      { cue:'greater occipital nerve', correct:'The greater occipital nerve supplies much of the posterior scalp and reaches toward the top of the head.', distractors:['The greater occipital nerve supplies only the lower lip.','The greater occipital nerve is an endocrine gland.','The greater occipital nerve is the main motor nerve of the forearm.'] },
      { cue:'sensory and motor direction', correct:'Sensory signals travel toward the CNS while motor signals travel outward toward muscles or glands.', distractors:['Sensory and motor signals both travel only toward the heart.','Motor signals travel toward the CNS while sensory signals always travel away.','Both pathways are part of the endocrine system.'] },
    ],
  },
  {
    name: 'Cardiovascular System',
    facts: [
      { cue:'artery versus vein rule', correct:'Arteries carry blood away from the heart; veins return blood toward the heart.', distractors:['Arteries always carry oxygenated blood and veins always carry deoxygenated blood.','Arteries exist only in the head and veins only in the neck.','Veins pump blood while arteries filter it.'] },
      { cue:'blood functions', correct:'Blood transports materials, helps regulate temperature, supports defense, and participates in clotting.', distractors:['Blood only carries oxygen and has no other major functions.','Blood produces sebum and hair pigment.','Blood is part of the skeletal system.'] },
      { cue:'submental artery territory', correct:'The submental artery supplies the chin and lower-lip region.', distractors:['The submental artery supplies only the forehead.','The submental artery supplies the crown of the scalp.','The submental artery is a jugular vein.'] },
      { cue:'labial artery territories', correct:'Superior labial supplies the upper lip; inferior labial supplies the lower lip.', distractors:['Superior labial supplies the lower lip while inferior labial supplies the forehead.','Both labial arteries supply only the ear.','Labial arteries are veins that drain the scalp.'] },
      { cue:'jugular vein distinction', correct:'Internal jugular drains deeper brain/face/neck regions while external jugular drains more superficial head/face/neck regions.', distractors:['Internal and external jugular veins are arteries.','Both jugular veins carry blood away from the heart.','The external jugular drains only the lower leg.'] },
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
      { cue:'endocrine versus exocrine glands', correct:'Endocrine glands are ductless and release hormones into blood; exocrine glands use ducts to deliver products.', distractors:['Endocrine glands use ducts while exocrine glands release hormones into blood.','Both gland types are identical except for size.','Sweat glands are endocrine because they affect skin.'] },
      { cue:'hormone definition', correct:'Hormones are chemical secretions that influence activity in target tissues or organs.', distractors:['Hormones are bones that support glands.','Hormones are only skin oils.','Hormones are another name for lymph nodes.'] },
      { cue:'pituitary scope', correct:'The pituitary regulates several other endocrine glands but does not control every endocrine gland.', distractors:['The pituitary directly controls every endocrine gland.','The pituitary is a sweat gland.','The pituitary produces sebum.'] },
      { cue:'thyroid and hair changes', correct:'Thyroid disorders can be associated with hair changes, but a barber should not diagnose the cause.', distractors:['Hair thinning proves thyroid disease.','Thyroid hormones never affect hair.','A barber should recommend thyroid medication.'] },
      { cue:'exocrine barber examples', correct:'Sweat and sebaceous glands are exocrine because their products travel through ducts.', distractors:['Sweat and sebaceous glands are endocrine because they are in skin.','The pituitary and thyroid are exocrine skin glands.','Only the pancreas is an exocrine gland.'] },
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
  // Cycle-major ordering: each contiguous five-question knowledge check gets
  // one question from each of the family's five factual targets. The next
  // cycle revisits those five targets with a different hard stem instead of
  // repeating one fact three times in the same check.
  for (let variant = 0; variant < 3; variant++) {
    for (const fact of family.facts) {
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
