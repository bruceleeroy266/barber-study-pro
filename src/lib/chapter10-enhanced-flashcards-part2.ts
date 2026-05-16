/**
 * CHAPTER 10 ENHANCED FLASHCARDS - PART 2
 * Porosity, Elasticity, Disorders, Analysis
 */

import { FlashcardData } from './chapter10-enhanced-flashcards'

// Hair Properties - Porosity (7 cards)
export const chapter10Porosity: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What is hair porosity?",
    back: "Hair's ability to absorb moisture, determined by cuticle condition. Low/Resistant (compact cuticle, repels moisture), Normal (average absorption), High/Overporous (damaged cuticle, absorbs too quickly). Critical for chemical services - affects processing time and results.",
    category: "hair-properties",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What causes low porosity (resistant hair)?",
    back: "Tightly packed, healthy cuticle layers. Often virgin hair, never chemically treated. Genetic. Repels water and chemicals. Requires: pre-softening, heat, stronger formulas, longer processing. Difficult to color or perm but very healthy.",
    category: "hair-properties",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What causes high porosity (overporous hair)?",
    back: "Damaged, raised cuticle from: chemical over-processing, heat damage, environmental damage, mechanical damage. Absorbs too quickly, loses moisture quickly, tangles easily, looks dull. Requires: gentle formulas, shorter processing, protein treatments, careful handling.",
    category: "hair-properties",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "How do you test for porosity?",
    back: "Slide several strands between fingers from ends toward scalp. Smooth = low porosity. Slight roughness = normal. Very rough/bumpy = high porosity. Also observe: how fast hair absorbs water, how long it stays wet, product absorption. Test before chemical services.",
    category: "hair-properties",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "Why is porosity the most important property for chemical services?",
    back: "Determines how fast chemicals penetrate (processing time), how much chemical needed, service results (even vs uneven processing), damage risk. Wrong processing = over-processing (high porosity) or under-processing (low porosity). Always assess porosity first for chemicals.",
    category: "hair-properties",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "How should barbers adjust services for high porosity hair?",
    back: "Use: milder formulas, shorter processing time, lower volume developers, protein treatments before services, gentle heat, deep conditioning. Avoid: over-processing, high heat, harsh chemicals. High porosity = pre-damaged, needs extra care to prevent further damage.",
    category: "hair-properties",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "How should barbers adjust services for low porosity hair?",
    back: "Use: pre-softeners, heat (open cuticle), stronger formulas, longer processing time, clarifying before services. May need: alkaline products to swell cuticle, steam, extra time. Resistant hair needs help accepting chemicals. Healthy but challenging to process.",
    category: "hair-properties",
    difficulty: "hard"
  }
]

// Hair Properties - Elasticity (5 cards)
export const chapter10Elasticity: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What is hair elasticity?",
    back: "Hair's ability to stretch and return to original length without breaking. Indicates side bond strength (especially disulfide bonds) and overall health. Normal: stretches up to 50% when wet, returns without breaking. Poor: breaks easily with minimal stretching. Critical test before chemical services.",
    category: "hair-properties",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How do you test elasticity?",
    back: "Take single wet hair strand. Gently stretch. Normal elasticity: stretches up to 50% of original length and returns without breaking. Poor elasticity: breaks immediately with little stretch. Test before perms/relaxers - poor elasticity = contraindication for chemicals.",
    category: "hair-properties",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What causes poor elasticity?",
    back: "Chemical damage (over-processing), heat damage, mechanical damage, environmental damage, protein loss. Broken disulfide bonds = weak hair. Poor elasticity indicates compromised internal structure. Hair cannot handle additional chemical processing safely.",
    category: "hair-properties",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "Why is elasticity important before chemical services?",
    back: "Poor elasticity = damaged internal bonds. Chemical services would cause: severe breakage, excessive damage, hair dissolving, unpredictable results. Elasticity test determines if hair can withstand chemical processing. REFUSE service if elasticity is poor - client safety and professional liability.",
    category: "hair-properties",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "Can elasticity be restored?",
    back: "Partially with protein treatments (temporary strengthening). Cannot fully restore broken disulfide bonds. Prevention better than repair. Treatments help but don't reverse damage. Severely damaged hair with poor elasticity should be cut off, not chemically processed. Manage client expectations realistically.",
    category: "hair-properties",
    difficulty: "medium"
  }
]

// Hair Pigment & Color (4 cards)
export const chapter10Pigment: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What gives hair its natural color?",
    back: "Melanin in the cortex. Two types: Eumelanin (brown/black pigment), Pheomelanin (red/yellow/ginger pigment). Combination and amount determine natural hair color. More melanin = darker hair. Less melanin = lighter hair. Produced by melanocytes in hair bulb during anagen.",
    category: "hair-pigment",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What causes gray hair?",
    back: "Loss of melanin production in hair bulb. Air spaces replace melanin. NOT coarser texture (same texture, just no pigment). Can be: congenital (genetic from birth) or acquired (age, stress, medical conditions). Cannot be reversed. Gray hair same structure as pigmented hair.",
    category: "hair-pigment",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is canities?",
    back: "Technical term for gray/white hair. Congenital canities: genetic lack of pigment from birth (rare). Acquired canities: develops with age, usually starting at temples. Salt-and-pepper effect when mixed with pigmented hair. Natural process, not a disorder. Affects color service formulation.",
    category: "hair-pigment",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How does natural pigment affect hair coloring services?",
    back: "Dark hair (lots of eumelanin): must lift/remove pigment before depositing new color. Light hair (less melanin): easier to deposit color. Gray hair (no melanin): very porous, grabs color quickly, needs careful formulation. Natural pigment determines starting point for color services.",
    category: "hair-pigment",
    difficulty: "hard"
  }
]

// Hair Disorders (8 cards)
export const chapter10Disorders: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What is trichoptilosis and how do barbers address it?",
    back: "Split ends. Hair shaft splits longitudinally (lengthwise). Caused by: mechanical damage, chemical damage, heat, dryness. Cannot be repaired - only solution is cutting off split portions. Prevention: gentle handling, conditioning, minimal heat, regular trims. Educate clients on prevention.",
    category: "hair-disorders",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is trichorrhexis nodosa?",
    back: "Knotted hair with brittle nodular swellings along shaft. Hair breaks easily at nodes. Caused by: harsh chemical treatments, excessive heat, rough handling. Appears as white dots on dark hair. Treatment: trim damaged areas, deep conditioning, gentle handling, protein treatments.",
    category: "hair-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is monilethrix (beaded hair)?",
    back: "Rare genetic condition where hair has bead-like nodes along shaft. Hair breaks easily at constrictions. Brittle, sparse hair. Genetic, no cure. Requires: gentle handling, moisturizing, avoiding chemicals and heat. Barbers provide supportive services only - cannot correct condition.",
    category: "hair-disorders",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "What is ringed hair?",
    back: "Alternating bands of gray and pigmented hair along shaft. Creates striped appearance. Rare. Genetic or acquired. Not harmful, purely cosmetic. No treatment needed unless client desires. Can provide normal services. Document for client records.",
    category: "hair-disorders",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is hypertrichosis?",
    back: "Abnormal growth of terminal hair in unusual locations or excessive growth. Can be congenital or acquired (medications, hormones, medical conditions). Not a barbershop issue - refer to physician for underlying cause. Barbers can provide hair removal services if medically cleared.",
    category: "hair-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How can barbers identify chemically damaged hair?",
    back: "Signs: high porosity, poor elasticity, excessive breakage, split ends, dull appearance, tangles easily, spongy/gummy texture when wet, uneven color, hair stretches and doesn't return. Assess before services - document condition, refuse additional chemicals if severely damaged.",
    category: "hair-disorders",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What causes hair breakage and how can barbers prevent it?",
    back: "Causes: chemical over-processing, excessive heat, rough handling, tight hairstyles, lack of moisture/protein. Prevention: gentle techniques, quality products, regular conditioning, proper chemical processing, client education. If breakage widespread, recommend medical consultation (may indicate health issue).",
    category: "hair-disorders",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "When should barbers refuse service due to hair condition?",
    back: "Refuse when: poor elasticity (breaks easily), extreme porosity (gummy/dissolving), active scalp infection, severe chemical damage, hair cannot withstand service safely. Document refusal, explain professionally, recommend treatments/physician, offer to reassess after hair improves. Client safety and liability protection.",
    category: "hair-disorders",
    difficulty: "hard"
  }
]

// Scalp Conditions (6 cards)
export const chapter10ScalpConditions: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What is pityriasis (dandruff) and what causes it?",
    back: "Excessive shedding of dead skin cells from scalp. Two types: Pityriasis capitis simplex (classic dry dandruff, white flakes). Pityriasis steatoides (severe oily/waxy scales). Caused by: Malassezia fungus overgrowth, seborrhea, dry scalp, sensitivity. Recommend anti-dandruff products, medical referral if severe.",
    category: "scalp-conditions",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is the difference between dry dandruff and oily dandruff?",
    back: "Dry (pityriasis capitis simplex): small white flakes, dry scalp, itchy. Oily (pityriasis steatoides): large greasy yellow scales, mixed with sebum, severe itching. Oily type more difficult to treat. Treatment differs - dry needs moisture, oily needs sebum control. Assess correctly for proper recommendations.",
    category: "scalp-conditions",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What role does Malassezia fungus play in dandruff?",
    back: "Natural fungus on all scalps. Overgrowth causes dandruff by: irritating scalp, speeding cell turnover, creating inflammation. Feeds on sebum (why oilier scalps more prone). Anti-dandruff shampoos contain antifungal ingredients (zinc pyrithione, selenium sulfide, ketoconazole) to control fungus.",
    category: "scalp-conditions",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "What is seborrhea and how does it affect services?",
    back: "Excessive sebum production creating oily scalp/hair. Can contribute to dandruff, folliculitis. Requires: frequent shampooing, oil-control products, avoiding heavy products. May need to adjust service frequency (more frequent cuts/shampoos). Not contagious. Medical referral if severe (may indicate hormonal issue).",
    category: "scalp-conditions",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is dry scalp and how is it different from dandruff?",
    back: "Dry scalp: lack of moisture, small white flakes, tight feeling, no inflammation. Dandruff: fungal, larger flakes, inflammation, itching. Dry scalp needs: moisturizing treatments, gentle cleansing, avoiding harsh products. Different treatment than dandruff. Wrong treatment makes worse. Assess correctly.",
    category: "scalp-conditions",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "When should barbers refer scalp conditions to a physician?",
    back: "Refer when: severe inflammation, open sores/lesions, signs of infection, hair loss with scalp changes, conditions not improving with OTC treatments, suspected medical condition, client in pain. Document observations, provide professional referral, don't diagnose. Medical conditions outside barber scope.",
    category: "scalp-conditions",
    difficulty: "medium"
  }
]

// Export all
export const chapter10AllPart2 = [
  ...chapter10Porosity,
  ...chapter10Elasticity,
  ...chapter10Pigment,
  ...chapter10Disorders,
  ...chapter10ScalpConditions
]
