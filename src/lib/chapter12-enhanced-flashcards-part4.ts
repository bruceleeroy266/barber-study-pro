/**
 * CHAPTER 12 ENHANCED FLASHCARDS - PART 4
 * Modalities, Equipment & Treatment Protocols
 */

import { FlashcardData } from './chapter12-enhanced-flashcards-part1'

// Modalities & Equipment (12 cards)
export const chapter12Modalities: FlashcardData[] = [
  {
    chapterNumber: 12,
    front: "What are the three types of electric currents used in facial treatments?",
    back: "Faradic (muscle stimulation), Galvanic (product penetration), High-frequency/Tesla (germicidal/healing). Each serves different purpose. Never use without proper training.",
    category: "modalities-equipment",
    difficulty: "hard",
    weakAreaTags: ["electrical-modalities", "state-board-critical", "advanced-terminology"]
  },
  {
    chapterNumber: 12,
    front: "What is faradic current used for?",
    back: "Muscle stimulation and toning. Causes muscles to contract and relax, improving tone. Similar to workout for facial muscles. Requires special training and manufacturer guidelines.",
    category: "modalities-equipment",
    difficulty: "medium",
    weakAreaTags: ["electrical-modalities", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "What is galvanic current used for?",
    back: "Deep product penetration (iontophoresis). Uses positive and negative poles to drive water-soluble products into deeper skin layers. Improves product effectiveness.",
    category: "modalities-equipment",
    difficulty: "hard",
    weakAreaTags: ["electrical-modalities", "advanced-terminology", "commonly-missed"]
  },
  {
    chapterNumber: 12,
    front: "What is high-frequency (Tesla) current used for?",
    back: "Germicidal effects, promotes healing, stimulates circulation. Creates ozone that kills bacteria. Often used on acne-prone skin. Produces characteristic buzzing sound and slight warming.",
    category: "modalities-equipment",
    difficulty: "hard",
    weakAreaTags: ["electrical-modalities", "practical-application", "commonly-missed"]
  },
  {
    chapterNumber: 12,
    front: "What does infrared light therapy do?",
    back: "Produces heat that increases circulation, relaxes muscles, opens pores, promotes sweating. Warmth is soothing and prepares skin for deeper treatments. Must monitor temperature carefully.",
    category: "modalities-equipment",
    difficulty: "medium",
    weakAreaTags: ["light-heat-therapy", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "What is ultraviolet light used for and what are its risks?",
    back: "Germicidal properties - kills bacteria. However, UV exposure must be very limited due to skin damage and cancer risk. Rarely used today. Protective eyewear required.",
    category: "modalities-equipment",
    difficulty: "hard",
    weakAreaTags: ["light-heat-therapy", "safety-critical", "contraindications"]
  },
  {
    chapterNumber: 12,
    front: "What is the purpose of using hot towels during facial treatments?",
    back: "Opens pores, softens tissues, relaxes muscles, prepares skin for extraction or product penetration. Moist heat is more effective than dry heat. Test temperature before applying to client.",
    category: "modalities-equipment",
    difficulty: "easy",
    weakAreaTags: ["light-heat-therapy", "professional-procedure"]
  },
  {
    chapterNumber: 12,
    front: "What does a facial steamer do?",
    back: "Produces warm, moist steam that hydrates skin, opens pores, softens tissues. Helps with deep cleansing and product penetration. Keep appropriate distance from face to avoid burns.",
    category: "modalities-equipment",
    difficulty: "easy",
    weakAreaTags: ["light-heat-therapy", "professional-procedure", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "Why is moist heat more effective than dry heat?",
    back: "Moisture allows heat to penetrate deeper into tissues. Hydrates skin while heating. Opens pores more effectively. Prevents skin from drying out during heating process.",
    category: "modalities-equipment",
    difficulty: "medium",
    weakAreaTags: ["light-heat-therapy", "commonly-missed"]
  },
  {
    chapterNumber: 12,
    front: "What safety rules apply to ALL electrical equipment?",
    back: "Never use without proper training, follow manufacturer guidelines exactly, check for damaged cords, keep away from water, never force settings, always test on self first, document all usage.",
    category: "modalities-equipment",
    difficulty: "hard",
    weakAreaTags: ["electrical-modalities", "safety-critical", "state-board-critical", "professional-procedure"]
  },
  {
    chapterNumber: 12,
    front: "When should electrical modalities NOT be used?",
    back: "Never use on: pregnant clients, clients with pacemakers/metal implants, epilepsy, heart conditions, broken skin, recent surgery, infection. Always check contraindications and get physician approval when uncertain.",
    category: "modalities-equipment",
    difficulty: "hard",
    weakAreaTags: ["electrical-modalities", "contraindications", "safety-critical", "state-board-critical"]
  },
  {
    chapterNumber: 12,
    front: "Why must equipment distance from face be carefully controlled?",
    back: "Too close causes burns, discomfort, or skin damage. Too far reduces effectiveness. Each device has recommended distance - follow manufacturer guidelines. Always monitor client comfort.",
    category: "modalities-equipment",
    difficulty: "medium",
    weakAreaTags: ["light-heat-therapy", "safety-critical", "professional-procedure"]
  }
]

// Treatment Protocols & Professionalism (13 cards)
export const chapter12TreatmentProtocols: FlashcardData[] = [
  {
    chapterNumber: 12,
    front: "What is the correct order of a standard facial treatment?",
    back: "Cleanse → Steam → Massage → Mask → Tone → Moisturize. This sequence prepares skin progressively deeper, then seals and protects. Never skip consultation at beginning.",
    category: "treatment-protocols",
    difficulty: "hard",
    weakAreaTags: ["professional-procedure", "state-board-critical", "sequence-heavy"]
  },
  {
    chapterNumber: 12,
    front: "Why is consultation essential BEFORE every facial treatment?",
    back: "Identifies contraindications, assesses skin type/condition, determines product selection, sets realistic expectations, documents medical history, builds client trust, protects barber from liability.",
    category: "treatment-protocols",
    difficulty: "medium",
    weakAreaTags: ["professional-procedure", "safety-critical", "state-board-critical"]
  },
  {
    chapterNumber: 12,
    front: "What must be done BEFORE beginning any facial treatment?",
    back: "Wash hands, disinfect all tools, use clean linens, drape client professionally, complete consultation, check for contraindications. Sanitation is never optional.",
    category: "treatment-protocols",
    difficulty: "easy",
    weakAreaTags: ["safety-sanitation", "professional-procedure", "state-board-critical"]
  },
  {
    chapterNumber: 12,
    front: "When must you refuse to perform a facial treatment?",
    back: "Active acne/severe inflammation, open wounds, contagious conditions, severe sunburn, recent surgery, uncontrolled health conditions, client discomfort, any situation where safety is compromised. Always refer to physician when uncertain.",
    category: "treatment-protocols",
    difficulty: "hard",
    weakAreaTags: ["contraindications", "safety-critical", "state-board-critical", "professional-procedure"]
  },
  {
    chapterNumber: 12,
    front: "What is a contraindication?",
    back: "Any condition that makes a service unsafe or inappropriate. Examples: infection, inflammation, recent surgery, certain medications, medical conditions. Always check before proceeding. When in doubt, don't do it.",
    category: "treatment-protocols",
    difficulty: "easy",
    weakAreaTags: ["contraindications", "safety-critical", "state-board-critical"]
  },
  {
    chapterNumber: 12,
    front: "Why can't barbers diagnose or treat skin diseases?",
    back: "Barbers are not physicians. Diagnosing is practicing medicine without a license (illegal). Treating infections spreads disease. Always refer suspicious conditions to dermatologist. Know your scope of practice.",
    category: "treatment-protocols",
    difficulty: "medium",
    weakAreaTags: ["professional-procedure", "safety-critical", "state-board-critical"]
  },
  {
    chapterNumber: 12,
    front: "What should you do if you see suspicious lesions during consultation?",
    back: "DO NOT proceed with service. Professionally recommend client see a dermatologist. Do not alarm client, but do not ignore. Document what you saw and your referral. Potential skin cancer must be evaluated by physician.",
    category: "treatment-protocols",
    difficulty: "hard",
    weakAreaTags: ["contraindications", "safety-critical", "professional-procedure", "state-board-critical"]
  },
  {
    chapterNumber: 12,
    front: "How do you determine the correct products for each client?",
    back: "Based on skin type assessment: dry (moisturizing products), oily (oil-controlling products), combination (targeted products), sensitive (gentle, fragrance-free), normal (balanced products). Always consider contraindications and allergies.",
    category: "treatment-protocols",
    difficulty: "medium",
    weakAreaTags: ["professional-procedure", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "Why must you document every service performed?",
    back: "Legal protection, tracks client history/preferences, identifies patterns or reactions, supports continuity of care, required by law in most states, professional standard. Always document products, techniques, and client responses.",
    category: "treatment-protocols",
    difficulty: "medium",
    weakAreaTags: ["professional-procedure", "state-board-critical"]
  },
  {
    chapterNumber: 12,
    front: "What must you explain to clients during treatment?",
    back: "Each step before performing it, expected sensations (warmth, tingling), purpose of each product/technique, what they should feel, what is NOT normal. Never surprise client. Communication builds trust and prevents lawsuits.",
    category: "treatment-protocols",
    difficulty: "easy",
    weakAreaTags: ["professional-procedure", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "When should you stop a treatment?",
    back: "Immediately if: client expresses discomfort/pain, skin shows adverse reaction (excessive redness, swelling, irritation), equipment malfunctions, you notice contraindication you missed, client requests to stop. Client safety always comes first.",
    category: "treatment-protocols",
    difficulty: "medium",
    weakAreaTags: ["safety-critical", "professional-procedure", "state-board-critical"]
  },
  {
    chapterNumber: 12,
    front: "What home care should you recommend after facial treatment?",
    back: "Avoid sun exposure, no makeup for several hours, gentle cleansing only, use recommended products, avoid touching face, stay hydrated, follow specific post-treatment instructions. Proper home care extends treatment benefits.",
    category: "treatment-protocols",
    difficulty: "easy",
    weakAreaTags: ["professional-procedure", "practical-application"]
  },
  {
    chapterNumber: 12,
    front: "What is the barber's professional responsibility during facial treatments?",
    back: "Maintain highest sanitation standards, know contraindications, stay within scope of practice, continue education, follow state regulations, prioritize client safety, maintain professional boundaries, provide quality service.",
    category: "treatment-protocols",
    difficulty: "medium",
    weakAreaTags: ["professional-procedure", "state-board-critical"]
  }
]

export const chapter12Part4All = [
  ...chapter12Modalities,
  ...chapter12TreatmentProtocols
]
