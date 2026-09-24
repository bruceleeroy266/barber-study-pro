/**
 * CHAPTER 6 DIAGNOSTIC FLASHCARDS — C6-4 HARDENED
 * 105 cards aligned to the hardened lesson and 10-family concept architecture.
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const chapter6CellBiologyEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "Which process BEST explains how ordinary body tissues produce new cells for growth and repair?", back: "Mitosis: somatic cells divide to produce new cells for growth and tissue renewal.", category: "cell-biology", difficulty: "hard" },
  { chapterNumber: 6, front: "A student confuses anatomy with physiology. Which description BEST fits physiology at the cellular level?", back: "Physiology focuses on function—how cells and tissues carry out life processes.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "Which cell structure should you associate MOST directly with DNA and control of reproduction?", back: "The nucleus.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "Which cell boundary BEST explains selective movement of substances into and out of a cell?", back: "The cell membrane.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "Which description BEST distinguishes cytoplasm from the nucleus?", back: "Cytoplasm is the fluid region around the nucleus where many cellular processes occur.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "A question asks which organelle produces ATP. Which choice is BEST?", back: "Mitochondria.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "Which organelle is MOST directly responsible for protein synthesis?", back: "Ribosomes.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "Which pairing is CORRECT: rough ER or smooth ER?", back: "Rough ER is associated with ribosomes/protein processing; smooth ER is associated with lipids and detoxification.", category: "cell-biology", difficulty: "hard" },
  { chapterNumber: 6, front: "Which organelle BEST matches packaging and shipping proteins and lipids?", back: "Golgi apparatus.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "Which organelle BEST matches digestion of cellular waste and debris?", back: "Lysosomes.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "Which tissue type BEST matches the protective covering role of skin?", back: "Epithelial tissue.", category: "cell-biology", difficulty: "medium" },
  { chapterNumber: 6, front: "Which statement BEST describes connective tissue in this chapter?", back: "It supports, protects, and binds; examples include bone, cartilage, fat, and blood.", category: "cell-biology", difficulty: "medium" },
]

export const chapter6BodySystemsEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "A barber is working directly with skin, hair, nails, and glands. Which system is PRIMARY?", back: "The integumentary system.", category: "body-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Which pair BEST distinguishes anatomy from physiology?", back: "Anatomy = structure; physiology = function.", category: "body-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Which concept BEST describes the body maintaining stable internal conditions?", back: "Homeostasis.", category: "body-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Which concept BEST describes the body’s life-sustaining chemical reactions?", back: "Metabolism.", category: "body-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "A service involves skin sensation, facial movement, and blood flow. What is the BEST systems-level conclusion?", back: "Body systems are integrated and can act together during one service.", category: "body-systems", difficulty: "hard" },
  { chapterNumber: 6, front: "Which system BEST matches body structure and protection through bones?", back: "Skeletal system.", category: "body-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Which system BEST matches movement, posture, and heat production?", back: "Muscular system.", category: "body-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Which system BEST matches sensation and communication through nerves?", back: "Nervous system.", category: "body-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Which system BEST matches hormones and gland signaling?", back: "Endocrine system.", category: "body-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Why is body-systems knowledge useful to barbers WITHOUT crossing scope?", back: "It supports safer service decisions and recognition of when to stop or refer—not diagnosis.", category: "body-systems", difficulty: "hard" },
]

export const chapter6SkeletalEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "A client opens the mouth during beard detailing. Which facial bone is moving?", back: "The mandible.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which landmark BEST matches the cheekbone used in facial design?", back: "Zygomatic bone.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which skull region is MOST relevant as a posterior head landmark?", back: "Occipital bone.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which bone forms the forehead and upper eye-socket region?", back: "Frontal bone.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which paired bones form much of the sides and roof of the cranium?", back: "Parietal bones.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which paired bones are located around the ear region?", back: "Temporal bones.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which bones form the upper jaw?", back: "The paired maxillae.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which bones form the bridge of the nose?", back: "The paired nasal bones.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which statement about the adult skull is BEST?", back: "It has 22 bones: 8 cranial and 14 facial bones.", category: "skeletal", difficulty: "hard" },
  { chapterNumber: 6, front: "Which structure is UNIQUE because it does not articulate directly with another bone?", back: "The hyoid bone.", category: "skeletal", difficulty: "hard" },
  { chapterNumber: 6, front: "Which spinal region should receive the MOST direct neck-support awareness during shampooing?", back: "The cervical region, with 7 cervical vertebrae.", category: "skeletal", difficulty: "medium" },
  { chapterNumber: 6, front: "Which statement BEST matches the adult spinal column wording used in the lesson?", back: "It is described as 26 bones because the sacrum and coccyx are fused in adults.", category: "skeletal", difficulty: "hard" },
]

export const chapter6MuscularEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "A client clenches the jaw and the jaw angle becomes prominent. Which muscle is MOST responsible?", back: "Masseter.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which muscle BEST matches elevation and retraction of the mandible?", back: "Temporalis.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which muscle BEST matches head rotation and neck flexion?", back: "Sternocleidomastoid.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which broad superficial neck muscle is relevant during neck shaving?", back: "Platysma.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which facial muscle closes the eyelid?", back: "Orbicularis oculi.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which facial muscle surrounds and moves the lips?", back: "Orbicularis oris.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which cheek muscle compresses the cheek?", back: "Buccinator.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which forehead muscle raises the eyebrows?", back: "Frontalis.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which posterior scalp muscle draws the scalp backward?", back: "Occipitalis.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "What is the epicranial aponeurosis MOST accurately classified as?", back: "A tough fibrous tendon connecting frontalis and occipitalis—not a muscle.", category: "muscular", difficulty: "hard" },
  { chapterNumber: 6, front: "Which three muscle types should a student distinguish?", back: "Skeletal/striated, smooth/nonstriated, and cardiac.", category: "muscular", difficulty: "medium" },
  { chapterNumber: 6, front: "Which muscle type BEST explains arrector pili and goosebumps?", back: "Smooth involuntary muscle.", category: "muscular", difficulty: "hard" },
]

export const chapter6NervousEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "Which structures make up the CENTRAL nervous system?", back: "Brain and spinal cord.", category: "nervous", difficulty: "medium" },
  { chapterNumber: 6, front: "Which division includes nerves outside the brain and spinal cord?", back: "Peripheral nervous system.", category: "nervous", difficulty: "medium" },
  { chapterNumber: 6, front: "Which direction BEST describes sensory/afferent nerve signals?", back: "Toward the CNS from sensory receptors.", category: "nervous", difficulty: "hard" },
  { chapterNumber: 6, front: "Which direction BEST describes motor/efferent nerve signals?", back: "Away from the CNS toward muscles or glands.", category: "nervous", difficulty: "hard" },
  { chapterNumber: 6, front: "Which neuron part receives signals toward the cell body?", back: "Dendrites.", category: "nervous", difficulty: "medium" },
  { chapterNumber: 6, front: "Which neuron part carries signals away from the cell body?", back: "Axon.", category: "nervous", difficulty: "medium" },
  { chapterNumber: 6, front: "Which cranial nerve is MOST associated with facial sensation and chewing?", back: "Trigeminal nerve (V).", category: "nervous", difficulty: "medium" },
  { chapterNumber: 6, front: "Which three branches belong to the trigeminal nerve?", back: "Ophthalmic, maxillary, and mandibular.", category: "nervous", difficulty: "hard" },
  { chapterNumber: 6, front: "Which cranial nerve is MOST associated with facial expression?", back: "Facial nerve (VII).", category: "nervous", difficulty: "medium" },
  { chapterNumber: 6, front: "A client becomes dizzy during forceful neck work. What is the BEST immediate response?", back: "Stop the service, keep the client safely positioned, assess, and follow first-aid/emergency procedures as needed.", category: "nervous", difficulty: "hard" },
  { chapterNumber: 6, front: "Which statement BEST describes a reflex?", back: "An automatic response to a stimulus that does not require conscious thought.", category: "nervous", difficulty: "medium" },
  { chapterNumber: 6, front: "What should nerve knowledge help a barber do WITHOUT diagnosing?", back: "Use safer technique, recognize concerning responses, stop when needed, and refer appropriately.", category: "nervous", difficulty: "hard" },
]

export const chapter6CirculatoryEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "Which rule is MOST reliable for distinguishing arteries from veins?", back: "Arteries carry blood away from the heart; veins return blood toward the heart.", category: "circulatory", difficulty: "hard" },
  { chapterNumber: 6, front: "Why is oxygen content a weaker artery/vein rule than direction?", back: "Pulmonary circulation is an exception; direction relative to the heart is the reliable rule.", category: "circulatory", difficulty: "hard" },
  { chapterNumber: 6, front: "Which vessels are the smallest exchange sites between arterial and venous circulation?", back: "Capillaries.", category: "circulatory", difficulty: "medium" },
  { chapterNumber: 6, front: "Which vessel is the body’s largest artery?", back: "Aorta.", category: "circulatory", difficulty: "medium" },
  { chapterNumber: 6, front: "Which artery region requires avoiding sustained or forceful pressure during neck work?", back: "The carotid area.", category: "circulatory", difficulty: "hard" },
  { chapterNumber: 6, front: "Which artery BEST matches the temple/front-of-ear landmark?", back: "Superficial temporal artery.", category: "circulatory", difficulty: "medium" },
  { chapterNumber: 6, front: "Which artery supplies much of the face and crosses the jaw region?", back: "Facial artery.", category: "circulatory", difficulty: "medium" },
  { chapterNumber: 6, front: "Which vein returns blood from the brain and deep face/neck structures?", back: "Internal jugular vein.", category: "circulatory", difficulty: "medium" },
  { chapterNumber: 6, front: "What is the heart’s PRIMARY cardiovascular function?", back: "Pump blood through the circulation.", category: "circulatory", difficulty: "medium" },
  { chapterNumber: 6, front: "Why does circulation matter to living scalp tissues?", back: "It delivers oxygen and nutrients and carries wastes away.", category: "circulatory", difficulty: "medium" },
  { chapterNumber: 6, front: "Which statement BEST distinguishes pulmonary from systemic circulation?", back: "Pulmonary circulation exchanges gases with the lungs; systemic circulation supplies the body’s tissues.", category: "circulatory", difficulty: "hard" },
  { chapterNumber: 6, front: "What should vascular knowledge change about barber technique?", back: "It should reinforce safe pressure, awareness of head/neck vessels, and stopping if symptoms occur.", category: "circulatory", difficulty: "hard" },
]

export const chapter6LymphaticEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "Which statement BEST describes lymph nodes?", back: "They filter lymph and support immune activity.", category: "lymphatic", difficulty: "medium" },
  { chapterNumber: 6, front: "A persistent swollen area may involve a lymph node. What is the BEST barber response?", back: "Avoid manipulation, do not diagnose, and recommend appropriate medical evaluation.", category: "lymphatic", difficulty: "hard" },
  { chapterNumber: 6, front: "Why is 'swollen node = infection' an unsafe conclusion?", back: "Swelling can have multiple causes; barbers should not diagnose from the sign alone.", category: "lymphatic", difficulty: "hard" },
  { chapterNumber: 6, front: "Which organ is the largest lymphatic organ?", back: "Spleen.", category: "lymphatic", difficulty: "medium" },
  { chapterNumber: 6, front: "Which organ supports T-cell development and is most active in childhood?", back: "Thymus.", category: "lymphatic", difficulty: "medium" },
  { chapterNumber: 6, front: "What is lymph?", back: "A clear fluid that circulates through lymphatic vessels and eventually returns to the bloodstream.", category: "lymphatic", difficulty: "medium" },
  { chapterNumber: 6, front: "Which function BEST belongs to the lymphatic/immune system?", back: "Fluid return, filtration, and immune defense.", category: "lymphatic", difficulty: "medium" },
  { chapterNumber: 6, front: "Which service rule should apply to a tender or abnormal lymph-node area?", back: "Do not massage or manipulate the area.", category: "lymphatic", difficulty: "hard" },
  { chapterNumber: 6, front: "How should a barber discuss a concerning swollen area?", back: "Describe what was observed without naming a disease and suggest appropriate evaluation.", category: "lymphatic", difficulty: "hard" },
  { chapterNumber: 6, front: "Which system works closely with circulation to return excess tissue fluid?", back: "The lymphatic system.", category: "lymphatic", difficulty: "medium" },
]

export const chapter6IntegumentaryEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "Which skin layer contains hair follicles, glands, vessels, and nerve endings?", back: "Dermis.", category: "integumentary", difficulty: "medium" },
  { chapterNumber: 6, front: "Which statement about the epidermis is MOST accurate?", back: "It is avascular and is nourished by diffusion from deeper vascular tissues.", category: "integumentary", difficulty: "hard" },
  { chapterNumber: 6, front: "Which structure produces sebum?", back: "Sebaceous glands.", category: "integumentary", difficulty: "medium" },
  { chapterNumber: 6, front: "Which statement BEST avoids the old sebaceous-gland absolute?", back: "Sebaceous glands are commonly associated with hair follicles; some open directly onto the skin.", category: "integumentary", difficulty: "hard" },
  { chapterNumber: 6, front: "Which glands produce perspiration?", back: "Sudoriferous (sweat) glands.", category: "integumentary", difficulty: "medium" },
  { chapterNumber: 6, front: "Which glands produce cerumen in the ear canal?", back: "Ceruminous glands.", category: "integumentary", difficulty: "medium" },
  { chapterNumber: 6, front: "Which protein is a major structural component of hair, nails, and the outer skin layer?", back: "Keratin.", category: "integumentary", difficulty: "medium" },
  { chapterNumber: 6, front: "Which cells produce melanin?", back: "Melanocytes.", category: "integumentary", difficulty: "medium" },
  { chapterNumber: 6, front: "How should epidermal renewal be described MOST accurately?", back: "New cells move toward the surface over several weeks, with timing varying by age, site, and individual.", category: "integumentary", difficulty: "hard" },
  { chapterNumber: 6, front: "Why is the integumentary system the barber’s PRIMARY workspace?", back: "It includes the skin, hair, nails, and glands worked with most directly.", category: "integumentary", difficulty: "medium" },
]

export const chapter6EndocrineEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "Why is the pituitary often called the 'master gland' WITHOUT using an absolute?", back: "Its hormones regulate several other endocrine glands, but not every endocrine gland.", category: "endocrine", difficulty: "hard" },
  { chapterNumber: 6, front: "Which gland is butterfly-shaped in the neck and helps regulate metabolism and body heat?", back: "Thyroid gland.", category: "endocrine", difficulty: "medium" },
  { chapterNumber: 6, front: "Which glands are located behind the thyroid and help regulate calcium/phosphorus balance?", back: "Parathyroid glands.", category: "endocrine", difficulty: "medium" },
  { chapterNumber: 6, front: "Which glands sit atop the kidneys and produce hormones including adrenaline and cortisol?", back: "Adrenal glands.", category: "endocrine", difficulty: "medium" },
  { chapterNumber: 6, front: "Which gland produces insulin and glucagon?", back: "Pancreas.", category: "endocrine", difficulty: "medium" },
  { chapterNumber: 6, front: "Which statement BEST describes androgen effects?", back: "Androgens can influence facial-hair development and sebaceous activity, with individual variation.", category: "endocrine", difficulty: "hard" },
  { chapterNumber: 6, front: "A client asks whether thinning proves a thyroid disorder. What is the BEST barber response?", back: "Hair changes have many causes; avoid diagnosis and recommend evaluation if persistent or concerning.", category: "endocrine", difficulty: "hard" },
  { chapterNumber: 6, front: "What is the BEST scope-safe way to discuss puberty-related oiliness?", back: "Hormonal changes can influence sebaceous activity, but oiliness varies and should not be diagnosed as a disorder.", category: "endocrine", difficulty: "hard" },
]

export const chapter6OtherSystemsEnhanced: FlashcardData[] = [
  { chapterNumber: 6, front: "Which system brings oxygen into the body and removes carbon dioxide?", back: "Respiratory system.", category: "other-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "How do respiratory and cardiovascular systems work together for tissue oxygen supply?", back: "Respiration brings oxygen in; circulation transports it to tissues.", category: "other-systems", difficulty: "hard" },
  { chapterNumber: 6, front: "Which system breaks food down so nutrients can be absorbed?", back: "Digestive system.", category: "other-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Which system helps remove wastes and regulate fluid/electrolyte balance?", back: "Urinary system.", category: "other-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Why should dry skin NOT be used to infer kidney disease?", back: "Dry skin is nonspecific; barbers should not diagnose kidney function from a visible sign alone.", category: "other-systems", difficulty: "hard" },
  { chapterNumber: 6, front: "Why is the reproductive system included in this chapter?", back: "Life-stage hormonal changes can influence hair-growth patterns, texture, and skin condition.", category: "other-systems", difficulty: "medium" },
  { chapterNumber: 6, front: "Which rule BEST applies to hair/skin changes linked to other body systems?", back: "Recognize general relationships, avoid diagnosis, and refer persistent or concerning changes.", category: "other-systems", difficulty: "hard" },
]

export const chapter6AllEnhanced = [
  ...chapter6CellBiologyEnhanced,
  ...chapter6BodySystemsEnhanced,
  ...chapter6SkeletalEnhanced,
  ...chapter6MuscularEnhanced,
  ...chapter6NervousEnhanced,
  ...chapter6CirculatoryEnhanced,
  ...chapter6LymphaticEnhanced,
  ...chapter6IntegumentaryEnhanced,
  ...chapter6EndocrineEnhanced,
  ...chapter6OtherSystemsEnhanced,
]

export const chapter6EnhancedStats = {
  cell_biology: chapter6CellBiologyEnhanced.length,
  body_systems: chapter6BodySystemsEnhanced.length,
  skeletal: chapter6SkeletalEnhanced.length,
  muscular: chapter6MuscularEnhanced.length,
  nervous: chapter6NervousEnhanced.length,
  circulatory: chapter6CirculatoryEnhanced.length,
  lymphatic: chapter6LymphaticEnhanced.length,
  integumentary: chapter6IntegumentaryEnhanced.length,
  endocrine: chapter6EndocrineEnhanced.length,
  other_systems: chapter6OtherSystemsEnhanced.length,
  total: chapter6AllEnhanced.length
}
