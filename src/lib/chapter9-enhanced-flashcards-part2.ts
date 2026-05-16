/**
 * CHAPTER 9 ENHANCED FLASHCARDS - PART 2
 * Disorders, Infections, Professional Protocols
 * INFECTION CONTROL & SAFETY CRITICAL
 */

import { FlashcardData } from './chapter9-enhanced-flashcards'

// Skin Disorders - Acne & Sebaceous Issues (6 cards)
export const chapter9AcneDisorders: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What causes acne vulgaris?",
    back: "Four factors: 1. Excess sebum production (hormones), 2. Dead skin cells clog pores, 3. P. acnes bacteria multiply, 4. Inflammation. Triggers: hormones, stress, diet (dairy, high glycemic), medications, friction, certain products. Most common in puberty.",
    category: "skin-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is a comedone and what are the two types?",
    back: "Clogged hair follicle/pore. Open comedone (blackhead): oxidized sebum and dead cells, appears black. Closed comedone (whitehead): trapped sebum under skin, appears white. Both are non-inflammatory acne. Can progress to inflammatory acne (pustules, cysts).",
    category: "skin-disorders",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What are the four grades of acne severity?",
    back: "Grade I: Comedones only (blackheads/whiteheads), no inflammation. Grade II: Comedones + papules + few pustules. Grade III: Many papules, pustules, some nodules, inflammation. Grade IV: Severe cystic acne, nodules, scarring. Grades III-IV require dermatologist referral.",
    category: "skin-disorders",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "What is milia and how is it different from acne?",
    back: "Small, white, hard bumps (1-2mm) caused by trapped keratin under skin. Common around eyes and cheeks. Not infected or inflamed like acne. Cannot be extracted easily - requires professional extraction or gentle exfoliation over time. Not painful.",
    category: "skin-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is a sebaceous cyst?",
    back: "Large, round, movable lump under skin containing keratin and sebum. Forms when sebaceous gland duct blocks. Usually painless unless infected. Can grow large if not treated. Refer to physician - may require surgical removal. Do not attempt to squeeze or lance.",
    category: "skin-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "How should barbers handle clients with active acne during services?",
    back: "Avoid areas with active pustules/cysts, use gentle touch, sanitize equipment thoroughly, avoid comedone extraction (outside scope), recommend physician for severe acne, adjust shaving technique (light pressure, clean blade), avoid occlusive products that worsen acne.",
    category: "skin-disorders",
    difficulty: "medium"
  }
]

// Sudoriferous Gland Disorders (3 cards)
export const chapter9SweatDisorders: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What is anhidrosis and why is it dangerous?",
    back: "Inability to sweat normally, can be partial or complete. Dangerous because body can't regulate temperature, leading to heat exhaustion or heat stroke. Causes: nerve damage, medications, dehydration, skin conditions. If client mentions anhidrosis, avoid heat-producing services.",
    category: "skin-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is hyperhidrosis?",
    back: "Excessive sweating beyond body's cooling needs. Can affect palms, soles, armpits, face, entire body. Causes: hormones, anxiety, medications, medical conditions. Not contagious. Barbers may notice during scalp services - maintain professionalism, clean equipment after use.",
    category: "skin-disorders",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is bromhidrosis?",
    back: "Foul-smelling perspiration caused by bacterial breakdown of apocrine sweat. Common in armpits, feet, groin. Not contagious, but may indicate poor hygiene or underlying condition. Maintain professionalism, ensure proper ventilation, use fresh capes/towels.",
    category: "skin-disorders",
    difficulty: "easy"
  }
]

// Inflammatory Conditions (6 cards) - INFECTION CONTROL CRITICAL
export const chapter9InflammatoryConditions: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What is dermatitis and what are the main types?",
    back: "General term for skin inflammation (red, swollen, itchy). Types: Irritant contact (chemical exposure), allergic contact (allergen), seborrheic (oily areas, dandruff), atopic (eczema). Not contagious. May contraindicate services if severe, broken skin, or weeping.",
    category: "inflammatory-conditions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is seborrheic dermatitis and where does it appear?",
    back: "Chronic inflammatory condition affecting oily areas: scalp (dandruff), eyebrows, sides of nose, behind ears, chest. Causes: yeast overgrowth, immune response, genetics. Symptoms: greasy yellow/white scales, redness, itching. Not contagious. Can provide services with caution.",
    category: "inflammatory-conditions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is eczema (atopic dermatitis)?",
    back: "Chronic inflammatory skin condition with dry, itchy, red patches. Common in children, often improves with age. Causes: genetics, immune system, environmental triggers. Flare-ups can crack/weep. Not contagious. Avoid services during active flare-ups with broken skin.",
    category: "inflammatory-conditions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is psoriasis and how do barbers recognize it?",
    back: "Chronic autoimmune condition causing rapid skin cell buildup, creating thick, silvery scales on red patches. Common on elbows, knees, scalp. Not contagious. Can be painful and itchy. Scalp psoriasis may contraindicate certain scalp services. Be gentle, avoid trauma.",
    category: "inflammatory-conditions",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "Is psoriasis contagious? Can barbers safely work on clients with psoriasis?",
    back: "NOT contagious - it's an autoimmune condition, not an infection. Safe to provide services if skin is intact and not actively bleeding. Avoid aggressive scrubbing or trauma (can trigger Koebner phenomenon - new lesions). Use gentle techniques, maintain standard sanitation.",
    category: "inflammatory-conditions",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is contact dermatitis and how can barbers prevent it?",
    back: "Skin reaction from direct contact with irritant or allergen. Irritant: chemicals, soaps (anyone can get). Allergic: specific allergen, only sensitized people. Prevention: wear gloves when using chemicals, patch test new products, rinse products thoroughly, use barrier creams.",
    category: "inflammatory-conditions",
    difficulty: "medium"
  }
]

// Contagious Infections (5 cards) - CRITICAL FOR SAFETY
export const chapter9ContagiousInfections: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What is herpes simplex and when must barbers refuse service?",
    back: "Viral infection causing cold sores/fever blisters (Type 1 - oral, Type 2 - genital). Highly contagious through direct contact with lesion. REFUSE service if active lesions on face/lips - can spread to barber and others. Wait until completely healed and crusted over.",
    category: "contagious-infections",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is impetigo and why is it dangerous in barbershops?",
    back: "Highly contagious bacterial infection (staph/strep) causing honey-colored crusted lesions. Common around nose and mouth. Spreads rapidly through direct contact, equipment, towels. REFUSE SERVICE. Can cause serious complications if untreated. Requires antibiotic treatment.",
    category: "contagious-infections",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is folliculitis and can it be contagious?",
    back: "Inflammation/infection of hair follicles, appears as small red bumps or pustules. Can be bacterial (contagious), fungal, or non-infectious (irritation). If bacterial folliculitis (multiple pustules, spreading), refuse service - risk of spreading through equipment, towels, contact.",
    category: "contagious-infections",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "How can barbers distinguish between contagious and non-contagious skin conditions?",
    back: "Contagious often has: pustules (pus), vesicles (blisters), weeping/oozing, spreading pattern, honey-colored crusts, multiple lesions. When in doubt: refuse service and refer to physician. Better safe than sorry - protects client, barber, and other clients.",
    category: "contagious-infections",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "What is tinea barbae and why is it a barbershop concern?",
    back: "Fungal infection (ringworm) of the beard area, causes red, scaly, inflamed patches with hair loss. Contagious through direct contact and contaminated tools. Can spread barber to client or client to client. REFUSE SERVICE. Requires antifungal medication. Thoroughly disinfect all tools.",
    category: "contagious-infections",
    difficulty: "hard"
  }
]

// Pigment Disorders (5 cards)
export const chapter9PigmentDisorders: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What is vitiligo?",
    back: "Loss of melanocytes causing white patches of depigmented skin. Autoimmune condition. Not contagious. Can affect any body part, often symmetrical. No cure, but treatments available. Safe to provide services. Be sensitive - can affect self-esteem.",
    category: "pigment-disorders",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What is chloasma (melasma)?",
    back: "Brown/tan patches on face, often symmetrical (forehead, cheeks, upper lip). Caused by hormones (pregnancy, birth control), sun exposure. Also called 'mask of pregnancy.' Not contagious. Worsens with UV exposure. Recommend daily SPF. Safe to provide services.",
    category: "pigment-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is albinism?",
    back: "Genetic condition with little or no melanin production, resulting in very pale skin, white/light hair, light eyes. Not contagious. High skin cancer risk from UV sensitivity. Clients need strict sun protection. Use extra caution with UV-producing equipment.",
    category: "pigment-disorders",
    difficulty: "easy"
  },
  {
    chapterNumber: 9,
    front: "What are lentigines and are they concerning?",
    back: "Flat brown spots caused by sun exposure or aging (age spots, liver spots, freckles). Benign, not contagious. Different from melanoma - uniform color, well-defined borders. If lentigines change size, shape, color - refer to dermatologist for evaluation.",
    category: "pigment-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What is a nevus?",
    back: "Medical term for mole or birthmark. Can be pigmented or vascular (blood vessels). Usually benign. Watch for ABCDE changes suggesting melanoma. Safe to work around stable nevi, but avoid trauma. Never shave directly over raised moles - can cause bleeding.",
    category: "pigment-disorders",
    difficulty: "easy"
  }
]

// Skin Cancer (5 cards) - LIFE-SAVING KNOWLEDGE
export const chapter9SkinCancer: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "What are the three types of skin cancer and their characteristics?",
    back: "Basal cell: most common (80%), least dangerous, rarely metastasizes, pearly/waxy appearance. Squamous cell: second most common (16%), more aggressive, can metastasize, scaly red patches. Malignant melanoma: least common (4%), most deadly, irregular mole, metastasizes easily.",
    category: "skin-cancer",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "What does the ABCDE rule for melanoma stand for?",
    back: "A - Asymmetry (one half doesn't match other). B - Border irregular (jagged, notched). C - Color varied (multiple colors, uneven). D - Diameter larger than 6mm (pencil eraser). E - Evolving (changing size, shape, color). ANY of these signs = immediate physician referral.",
    category: "skin-cancer",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What should a barber do if they notice a suspicious lesion on a client?",
    back: "Tactfully recommend dermatologist evaluation without diagnosing. Say: 'I noticed this spot/mole - has your doctor seen it? I recommend having it checked just to be safe.' Document the conversation. Early detection saves lives. Never ignore suspicious lesions.",
    category: "skin-cancer",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What are the risk factors for skin cancer barbers should know?",
    back: "UV exposure (sun, tanning beds), fair skin, history of sunburns (especially childhood), family history, many moles, weakened immune system, age over 50, previous skin cancer. Clients with multiple risk factors need extra vigilance and SPF recommendations.",
    category: "skin-cancer",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "Can skin cancer appear on scalp and why does this matter for barbers?",
    back: "YES - scalp is high-risk area due to sun exposure, especially in balding men. Barbers may notice scalp lesions during haircuts clients can't see. Look for: non-healing sores, changing moles, scaly patches, irregular growths. Early detection by barbers can save lives.",
    category: "skin-cancer",
    difficulty: "medium"
  }
]

// Professional Protocols & Contraindications (6 cards) - CRITICAL
export const chapter9ProfessionalProtocols: FlashcardData[] = [
  {
    chapterNumber: 9,
    front: "When should a barber ALWAYS refuse service due to skin conditions?",
    back: "REFUSE when: active herpes lesions, impetigo, open sores/ulcers, weeping/oozing lesions, suspected fungal/bacterial/viral infection, extensive pustules, severe inflammation with broken skin, any condition spreading or contagious. Client safety and public health first.",
    category: "professional-protocols",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "How should a barber professionally refuse service due to a skin condition?",
    back: "Be tactful, private, non-judgmental. Say: 'I notice some irritation/lesions that should be evaluated by a doctor before I can safely provide this service. For your health and safety, I recommend seeing a dermatologist first.' Offer to reschedule after treatment.",
    category: "professional-protocols",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What are contraindications for shaving services?",
    back: "Active acne (cysts, nodules), open wounds/cuts, herpes lesions, severe eczema/psoriasis, recent chemical peels/laser, sunburn, facial warts, impetigo, folliculitis, extremely sensitive skin, blood thinners (bleeding risk), recent Accutane use (thin skin).",
    category: "professional-protocols",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "What skin conditions require physician referral?",
    back: "Suspicious moles (ABCDE), non-healing sores, sudden rashes, severe acne, persistent itching, widespread lesions, signs of infection, pigment changes, unexplained lumps, severe inflammatory conditions, any rapidly changing or worsening condition.",
    category: "professional-protocols",
    difficulty: "medium"
  },
  {
    chapterNumber: 9,
    front: "What questions should barbers ask during skin consultation?",
    back: "Current skin conditions? Allergies to products? Recent treatments (chemical, laser)? Taking medications (Accutane, blood thinners)? History of keloids? Sensitive skin? Previous reactions to shaving/products? Recent sun exposure? Any areas to avoid? Medical conditions affecting skin?",
    category: "professional-protocols",
    difficulty: "hard"
  },
  {
    chapterNumber: 9,
    front: "Why is documentation important when dealing with skin conditions?",
    back: "Legal protection: records what you observed, advised, and actions taken. Shows professional judgment. Documents refusal of service and reasons. Notes client communications about conditions. Helps track changes over time. Essential if client has adverse reaction or claims negligence.",
    category: "professional-protocols",
    difficulty: "medium"
  }
]

// Export all enhanced flashcards
export const chapter9AllEnhancedPart2 = [
  ...chapter9AcneDisorders,
  ...chapter9SweatDisorders,
  ...chapter9InflammatoryConditions,
  ...chapter9ContagiousInfections,
  ...chapter9PigmentDisorders,
  ...chapter9SkinCancer,
  ...chapter9ProfessionalProtocols
]

export const chapter9Part2Stats = {
  acneDisorders: chapter9AcneDisorders.length,
  sweatDisorders: chapter9SweatDisorders.length,
  inflammatoryConditions: chapter9InflammatoryConditions.length,
  contagiousInfections: chapter9ContagiousInfections.length,
  pigmentDisorders: chapter9PigmentDisorders.length,
  skinCancer: chapter9SkinCancer.length,
  professionalProtocols: chapter9ProfessionalProtocols.length,
  total: chapter9AllEnhancedPart2.length
}
