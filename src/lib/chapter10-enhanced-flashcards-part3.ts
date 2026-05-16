/**
 * CHAPTER 10 ENHANCED FLASHCARDS - PART 3
 * Alopecia, Infections, Professional Analysis
 */

import { FlashcardData } from './chapter10-enhanced-flashcards'

// Alopecia (6 cards)
export const chapter10Alopecia: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What is alopecia and what is normal vs abnormal hair loss?",
    back: "Alopecia: abnormal hair loss. Normal: 75-100 hairs/day (telogen shedding). Abnormal: excessive shedding, bald patches, thinning, miniaturization. Causes: genetics, autoimmune, hormones, medications, stress, medical conditions. Barbers observe and recommend medical consultation - don't diagnose.",
    category: "alopecia",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is alopecia areata?",
    back: "Autoimmune condition causing sudden circular bald patches. Body attacks own hair follicles. Can progress to alopecia totalis (entire scalp) or universalis (entire body). May regrow spontaneously. Treatments available but not guaranteed. Emotional impact significant - be supportive, never joke about hair loss.",
    category: "alopecia",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is androgenic alopecia (male pattern baldness)?",
    back: "Genetic hair loss from hormone sensitivity (DHT). Begins teens-40s. Follows predictable pattern (crown, temples, top). Progressive miniaturization - terminal hair becomes vellus. Treatments: minoxidil (Rogaine), finasteride (Propecia), transplants. Cannot be reversed, only slowed. Affects styling/cutting approach.",
    category: "alopecia",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What are the stages of male pattern baldness?",
    back: "8 stages from I (minimal recession) to VIII (extensive loss). Pattern: temples recede, crown thins, top loses coverage, sides/back remain (donor area for transplants). Understanding stages helps: recommend appropriate styles, discuss transplant candidacy, realistic expectations. Barbers help clients accept/style changing hair.",
    category: "alopecia",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "What treatments are available for androgenic alopecia?",
    back: "Medical: Minoxidil 2% or 5% (topical, OTC, stimulates growth), Finasteride (oral, prescription, men only, blocks DHT). Surgical: hair transplantation, follicle grafting ($8,000-$20,000+). Non-medical: hairpieces, systems, extensions. Barbers recommend medical consultation, don't sell medical treatments.",
    category: "alopecia",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How should barbers approach clients with hair loss?",
    back: "Be sensitive and supportive - emotionally difficult for clients. Recommend: physician consultation for treatment options, styling techniques for thinning hair, quality products for hair health. Avoid: jokes, insensitive comments, guarantees, medical advice. Focus on solutions and maintaining confidence. Professional empathy important.",
    category: "alopecia",
    difficulty: "medium"
  }
]

// Infections (8 cards)
export const chapter10Infections: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What is tinea and what are the types affecting barbers?",
    back: "Tinea: ringworm, highly contagious fungal infection. Tinea barbae (beard), Tinea capitis (scalp), Tinea favosa (honeycomb, most severe). Symptoms: red papules, hair loss, crusts, itching. REFUSE SERVICE - all types require physician treatment (oral antifungals). Thoroughly disinfect tools if exposed.",
    category: "infections",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is tinea barbae and how do barbers recognize it?",
    back: "Ringworm of beard area. Red papules and pustules, circular patches, hair breaks/falls out, itching. Contagious through direct contact, tools, towels. Client needs oral antifungal medication. REFUSE service, recommend physician immediately. Disinfect all equipment. Protect yourself and other clients.",
    category: "infections",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is tinea favosa and why is it serious?",
    back: "Honeycomb ringworm - most severe tinea type. Dry sulfur-yellow crusts, musty odor, scarring, permanent hair loss. VERY contagious. Requires long-term medical treatment. May never fully resolve. REFUSE service, immediate physician referral. Rare in US but barbers must recognize. Potential for permanent damage.",
    category: "infections",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "What is pediculosis capitis and how should barbers respond?",
    back: "Head lice infestation. Symptoms: intense itching, visible nits (eggs) on hair strands near scalp, lice on scalp. Highly contagious. REFUSE service immediately. Recommend: OTC treatments (permethrin), nit removal, washing all linens/clothing. Disinfect all tools, cape, chair. Check family members. Return after treatment verified.",
    category: "infections",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "What is folliculitis and when is it contagious?",
    back: "Inflamed hair follicles with small pustules. Causes: bacterial (contagious), viral, fungal, ingrown hairs (not contagious), irritation. If bacterial (multiple pustules, spreading): REFUSE service, recommend physician. If ingrown/irritation (isolated, not spreading): gentle service okay. Document and assess carefully.",
    category: "infections",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is pseudofolliculitis barbae (razor bumps)?",
    back: "Chronic inflammation from ingrown hairs, especially in curly-haired clients. Shaved hair curls back, re-enters skin. Creates pustules, hyperpigmentation, scarring. NOT contagious. Solutions: grow beard out, use clippers not razors, exfoliation, proper shaving technique, ingrown hair treatments. Common in Black clients.",
    category: "infections",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is a furuncle vs carbuncle?",
    back: "Furuncle (boil): acute bacterial infection (staph) in hair follicle, red, painful, pus-filled. Carbuncle: multiple connected boils, larger, deeper, more serious. Both: REFUSE service over affected area, recommend physician (may need antibiotics/drainage). Can spread if ruptured. Document location, suggest medical care.",
    category: "infections",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is sycosis vulgaris (barber's itch)?",
    back: "Chronic bacterial folliculitis of beard area. Recurring pustules, crusts, irritation. Caused by Staphylococcus aureus. May result from unsanitary tools/techniques. Treatment: antibiotics, antiseptic care. Can provide service IF under medical treatment and improving. Strict sanitation essential. Historical term from unsanitary barbering practices.",
    category: "infections",
    difficulty: "hard"
  }
]

// Professional Analysis (10 cards)
export const chapter10Analysis: FlashcardData[] = [
  {
    chapterNumber: 10,
    front: "What is the correct order for hair and scalp analysis?",
    back: "1. Scalp analysis FIRST (check for infections/contraindications). 2. Hair analysis (texture, density, porosity, elasticity, condition). 3. Growth patterns (whorls, cowlicks, streams). 4. Client consultation (health, medications, previous services). Document findings. Analysis determines service safety and approach.",
    category: "professional-analysis",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "What should barbers look for during scalp analysis?",
    back: "Inspect for: inflammation, lesions, parasites (lice), fungal infections (tinea), irritation, dryness/oiliness, flaking (dandruff), abrasions, sores. Use sight, touch (gently), smell. If infection/parasites found: STOP immediately, refuse service, recommend physician. Scalp must be healthy for services.",
    category: "professional-analysis",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What questions should barbers ask during hair consultation?",
    back: "Current concerns/goals? Previous chemical services (what/when)? Allergies? Medications? Medical conditions affecting hair? Home care routine? Heat styling frequency? Realistic expectations? Budget? How often can you maintain style? Documentation protects barber and ensures appropriate service.",
    category: "professional-analysis",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How do you assess hair texture professionally?",
    back: "Take single strand between fingers. Feel thickness. Coarse: thick, easily felt. Medium: average, smooth. Fine: thin, barely felt. Compare multiple areas (texture can vary). Test dry AND wet. Observe microscopic appearance if available. Document: affects all service decisions.",
    category: "professional-analysis",
    difficulty: "easy"
  },
  {
    chapterNumber: 10,
    front: "How do you assess hair density professionally?",
    back: "Part hair in multiple areas. Observe scalp visibility. High density: minimal scalp visible. Normal: some scalp shows. Low density: significant scalp visible. Count strands per square inch if needed (tool available). Compare crown, sides, temples. Document: affects cutting, chemical, and product recommendations.",
    category: "professional-analysis",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is the professional procedure for porosity testing?",
    back: "Select strands from different areas (crown, nape, sides). Slide fingers from ends toward scalp. Smooth = low/resistant. Slight roughness = normal. Very rough = high/damaged. Test wet AND dry. Also observe: water absorption speed, how long stays wet. Document: CRITICAL for chemical services.",
    category: "professional-analysis",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "What is the professional procedure for elasticity testing?",
    back: "Take SINGLE WET strand. Hold both ends. Gently stretch. Normal: stretches 50%, returns without breaking. Poor: breaks with minimal stretch. Test multiple areas. Document results. Poor elasticity = CONTRAINDICATION for chemicals. Essential test before perms/relaxers. Client safety depends on this test.",
    category: "professional-analysis",
    difficulty: "hard"
  },
  {
    chapterNumber: 10,
    front: "How do you assess hair condition during analysis?",
    back: "Look for: split ends, breakage, dullness, tangles, dryness, excessive oiliness, elasticity, porosity, previous chemical damage. Feel texture when dry and wet. Observe: shine, smoothness, strength. Smell: burnt odor indicates heat damage. Document condition: determines service modifications needed.",
    category: "professional-analysis",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "Why is documentation important during hair analysis?",
    back: "Legal protection: proves proper assessment done. Tracks changes over time. Supports service refusal decisions. Records client statements about health/previous services. Shows professional standards maintained. Helps remember client specifics for future visits. Essential for liability protection and quality service.",
    category: "professional-analysis",
    difficulty: "medium"
  },
  {
    chapterNumber: 10,
    front: "How does hair analysis determine service modifications?",
    back: "Texture + density = cutting approach, product amount. Porosity = chemical processing time. Elasticity = whether chemicals safe. Condition = what treatments needed. Growth patterns = cutting/styling approach. Analysis creates customized service plan for each client. Science-based professional decision-making, not guessing.",
    category: "professional-analysis",
    difficulty: "hard"
  }
]

// Export all
export const chapter10AllPart3 = [
  ...chapter10Alopecia,
  ...chapter10Infections,
  ...chapter10Analysis
]
