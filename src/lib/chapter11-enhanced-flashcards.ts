/**
 * CHAPTER 11 ENHANCED FLASHCARDS
 * Treatment of the Hair and Scalp
 * Professional service delivery and consultation training
 */

export interface FlashcardData {
  chapterNumber: number
  front: string
  back: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
}

// Shampoo Service & Product Selection (12 cards)
export const chapter11ShampooService: FlashcardData[] = [
  {
    chapterNumber: 11,
    front: "What products should be used for fine hair?",
    back: "Volumizing shampoo, detangling conditioner, protein treatments, fine-hair shampoo. Avoid heavy products that weigh down fine hair. Light formulas that add body without buildup.",
    category: "product-selection",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "What products should be used for coarse hair?",
    back: "Moisturizing shampoo, leave-in conditioner, moisturizing treatments. Coarse hair needs extra moisture and smoothing. Heavier products acceptable - won't weigh down thick strands.",
    category: "product-selection",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "What products should be used for dry and damaged hair?",
    back: "Gentle cleansing shampoo, light leave-in conditioner, protein and moisturizing repair treatments, spray-on thermal protection. Focus on repairing damage and preventing further breakage.",
    category: "product-selection",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "What are the two main draping methods?",
    back: "Reclined method (most common): hydraulic chair reclines, comfortable, faster, efficient. Inclined method: client bends forward over bowl, used when reclined chair unavailable or client cannot recline. Each requires specific draping technique.",
    category: "shampoo-service",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "What are the two types of drapes used in barbershops?",
    back: "Shampoo capes: waterproof, protect from liquids. Haircutting capes: nylon or synthetic, protect from hair clippings. Use appropriate cape for service type. Both provide client protection and professional appearance.",
    category: "shampoo-service",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "Why is proper draping legally required?",
    back: "State law compliance, prevents liquids/chemicals on skin and clothing, maintains infection control standards, ensures client safety and comfort. Improper draping = liability risk and unprofessional service.",
    category: "shampoo-service",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "How should a barber position themselves during shampooing?",
    back: "Stand close to back of client's head, flex knees slightly for good balance, position feet directly beneath body for balance, keep chin parallel to floor (avoid neck strain), chest up, abdomen flat, shoulders relaxed. Proper posture prevents fatigue and injury.",
    category: "shampoo-service",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "What are common faults in shampoo services?",
    back: "Improper shampoo selection, insufficient scalp massage, extreme water temperature (too hot or cold), shampoo/water on face/ears/eyes, wetting/soiling clothing, scraping/scratching scalp with fingernails, improper hair blotting, insufficient cleansing and rinsing.",
    category: "shampoo-service",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "What should be analyzed before shampooing?",
    back: "Scalp condition (dry, oily, normal, abrasions, disorders), hair texture (fine, medium, coarse), hair density (thick, medium, thin), hair porosity (resistant, normal, overporous), hair elasticity (good, poor), presence of abrasions or disorders. Analysis determines product selection and service safety.",
    category: "shampoo-service",
    difficulty: "hard"
  },
  {
    chapterNumber: 11,
    front: "How should water temperature be tested before shampooing?",
    back: "Test on inside of wrist first (sensitive area). Water should be comfortably warm - not too hot or cold. Adjust based on client feedback. Extreme temperatures cause discomfort and scalp damage. Always verify temperature before applying to client.",
    category: "shampoo-service",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "How should shampoo be applied?",
    back: "Dampen hair thoroughly, dispense shampoo into palm, distribute over both palms, spread hair sections apart with free hand, distribute shampoo onto scalp and hair, gradually add warm water to work up lather. Avoid getting shampoo lather on client's face.",
    category: "shampoo-service",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "How should barbers handle clients with special needs during shampooing?",
    back: "Wheelchair-bound: ask how they'd like to be shampooed, some can position at bowl, others need inclined method. Disabled clients: always ask client about comfort and safety first. Never assume - communicate and accommodate individual needs professionally.",
    category: "shampoo-service",
    difficulty: "medium"
  }
]

// Scalp Massage (14 cards)
export const chapter11ScalpMassage: FlashcardData[] = [
  {
    chapterNumber: 11,
    front: "What are the three main benefits of scalp massage?",
    back: "1. Hygienic: stimulates scalp, promotes cleanliness. 2. Circulatory: increases blood flow to scalp and hair follicles, nourishes hair papilla. 3. Relaxation: relieves tension, soothes nerves, provides client comfort. Essential component of professional shampoo service.",
    category: "scalp-massage",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "What are the general guidelines for performing scalp massage?",
    back: "Apply firm pressure on upward strokes, rotary movements loosen scalp tissues and improve circulation, manipulations should be slow and rhythmic, avoid pulling hair, place hands under hair with fingertips resting on scalp. Technique creates relaxation and stimulates blood flow.",
    category: "scalp-massage",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "What are the three types of scalp massage manipulations?",
    back: "Rotary: thumbs/fingertips produce overlapping circular movements with moderate to firm pressure. Sliding: thumbs/fingertips produce gliding strokes. Back & forth: thumbs/fingertips produce brisk back/forth movement with moderate to firm pressure. Each serves different therapeutic purposes.",
    category: "scalp-massage",
    difficulty: "hard"
  },
  {
    chapterNumber: 11,
    front: "What physiological effects does scalp massage produce?",
    back: "Increased blood and lymph flow, soothed nerves, stimulated scalp muscles and glands, more flexible scalp. These effects promote healthier hair growth conditions, improve product absorption, and provide relaxation benefits.",
    category: "scalp-massage",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "What scalp section is massaged from sides to top of head?",
    back: "Service: Scalp treatment or shampoo. Movement: Sliding/rotary. Muscles: Auricularis superior, temporalis, frontalis. Nerves: Fifth and seventh cranial nerves. Start at sides, work upward to top.",
    category: "scalp-massage",
    difficulty: "hard"
  },
  {
    chapterNumber: 11,
    front: "What scalp section is massaged from behind ears to crown?",
    back: "Service: Scalp treatment or shampoo. Movement: Rotary and sliding, rotary/back and forth. Muscles: Auricularis posterior, sternocleidomastoideus, occipitalis, aponeurosis, trapezius. Nerves: Eleventh cranial nerve and spinal nerves. Work from neck/ear area upward.",
    category: "scalp-massage",
    difficulty: "hard"
  },
  {
    chapterNumber: 11,
    front: "What scalp section is massaged from forehead to crown?",
    back: "Service: Scalp treatment or shampoo. Movement: Sliding, rotary/back and forth. Muscles: Frontalis, aponeurosis, temporalis. Nerves: Fifth and seventh cranial and spinal nerves. Start at front hairline, work toward crown.",
    category: "scalp-massage",
    difficulty: "hard"
  },
  {
    chapterNumber: 11,
    front: "What scalp section is massaged at front hairline?",
    back: "Service: Scalp treatment or shampoo. Movement: Rotary. Muscles: Frontalis. Nerves: Fifth cranial nerves. Focus on frontal area with circular motions. Relieves tension in forehead region.",
    category: "scalp-massage",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "Where should scalp massage manipulations begin?",
    back: "Start at the hairline. Should be performed with even pressure and continuous synchronized movements to achieve effects: increased blood/lymph flow, soothed nerves, stimulated muscles/glands, flexible scalp. Systematic approach ensures complete coverage.",
    category: "scalp-massage",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "How should hands be positioned during scalp massage?",
    back: "Place hands under hair with fingertips resting on scalp. Fingertips massage scalp, heel of palms and cushions of palms help stimulate muscles/nerves/blood vessels. Pressure creates relaxation. Proper hand placement essential for effective massage.",
    category: "scalp-massage",
    difficulty: "medium"
  },
  {
    chapterNumber: 11,
    front: "What is the purpose of rotary massage movements?",
    back: "Uses thumbs and/or fingertips to produce overlapping circular movements with moderate to firm pressure throughout scalp. Loosens scalp tissue, stimulates circulation, promotes relaxation. One of three primary massage manipulation types.",
    category: "scalp-massage",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "What is the purpose of sliding massage movements?",
    back: "Uses thumbs and/or fingertips to produce gliding strokes, often overlapping as hands meet over a section of head. Provides smooth, flowing massage, helps distribute product, creates relaxation. Gentler than rotary movements.",
    category: "scalp-massage",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "What is the purpose of back and forth massage movements?",
    back: "Uses thumbs and/or fingertips to produce brisk back and forth movement with moderate to firm pressure. More invigorating than other techniques, stimulates blood flow, energizes scalp. Used strategically for stimulation.",
    category: "scalp-massage",
    difficulty: "easy"
  },
  {
    chapterNumber: 11,
    front: "Why is scalp massage important as part of shampoo/treatment service?",
    back: "Provides hygienic benefits (cleanliness), circulatory benefits (blood flow, nourishment), relaxation benefits (stress relief, client satisfaction). Often included with rotary and sliding movements. Professional service component that increases client retention and referrals.",
    category: "scalp-massage",
    difficulty: "medium"
  }
]

// Continue in part 2 due to length...
