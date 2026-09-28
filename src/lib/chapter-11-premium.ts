// Chapter 11: Treatment of the Hair and Scalp — PREMIUM IMMERSIVE EXPERIENCE
// THE TREATMENT SANCTUARY — Master Therapeutic Care, Scalp Healing & Client Wellness

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// TREATMENT SANCTUARY THEME — Healing & Restoration
// Deep emerald / Warm amber / Healing sage / Soft cream
// Feels like: A premium spa sanctuary where science meets soul
// ═══════════════════════════════════════════════

export const chapter11PremiumTheme: ChapterTheme = {
  primary: '#059669',
  primaryLight: '#34D399',
  primaryDark: '#047857',
  secondary: '#F59E0B',
  background: 'rgba(18, 28, 24, 0.96)',
  backgroundAlt: 'rgba(28, 40, 34, 0.92)',
  surface: '#121C18',
  border: 'rgba(5, 150, 105, 0.25)',
  text: '#ECFDF5',
  textMuted: '#A7F3D0',
  highlight: '#FBBF24',
  timeline: {
    line: 'rgba(5, 150, 105, 0.35)',
    iconBg: '#1C2822',
    iconBorder: '#059669',
  },
  quote: {
    border: 'rgba(5, 150, 105, 0.4)',
    icon: 'rgba(5, 150, 105, 0.3)',
    bg: 'rgba(18, 28, 24, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(5, 150, 105, 0.15)',
    activeBorder: 'rgba(5, 150, 105, 0.5)',
    activeText: '#34D399',
    inactiveBg: 'rgba(18, 28, 24, 0.7)',
    inactiveBorder: 'rgba(5, 150, 105, 0.12)',
    inactiveText: '#A7F3D0',
    panelBg: 'rgba(18, 28, 24, 0.85)',
    panelBorder: 'rgba(5, 150, 105, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(5, 150, 105, 0.1)',
    headerText: '#34D399',
    dot: 'rgba(5, 150, 105, 0.6)',
    line: 'rgba(5, 150, 105, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(5, 150, 105, 0.15)',
    iconColor: '#059669',
    cardBorder: 'rgba(5, 150, 105, 0.2)',
  },
  milestone: {
    yearColor: '#059669',
    border: 'rgba(5, 150, 105, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(5, 150, 105, 0.4)',
    checkColor: '#059669',
    bg: 'rgba(18, 28, 24, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(18, 28, 24, 0.7)',
    border: 'rgba(5, 150, 105, 0.18)',
    highlightColor: '#FBBF24',
  },
  challengeCard: {
    badgeBg: 'rgba(251, 191, 36, 0.15)',
    badgeText: '#FBBF24',
    cardBorder: 'rgba(5, 150, 105, 0.22)',
    completedBg: 'rgba(0, 230, 118, 0.1)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(251, 191, 36, 0.06)',
    optionBorder: 'rgba(5, 150, 105, 0.18)',
    correctBg: 'rgba(0, 230, 118, 0.1)',
    incorrectBg: 'rgba(255, 82, 82, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(5, 150, 105, 0.15)',
    levelBadgeText: '#34D399',
    rewardBg: 'rgba(0, 230, 118, 0.1)',
    rewardText: '#00E676',
  },
  actionPrompt: {
    cardBorder: 'rgba(5, 150, 105, 0.18)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
    benefitBg: 'rgba(5, 150, 105, 0.08)',
    benefitBorder: 'rgba(5, 150, 105, 0.25)',
  },
}

// ═══════════════════════════════════════════════
// PREMIUM IMMERSIVE CHAPTER 11 CONTENT
// ═══════════════════════════════════════════════

export const chapter11PremiumContent: ChapterContent = {
  chapterNumber: 11,
  title: 'TREATMENT OF THE HAIR AND SCALP',
  subtitle: 'Enter the Treatment Sanctuary — Master Healing, Restoration & Client Wellness',
  theme: chapter11PremiumTheme,
  sections: [
    {
      type: 'contentBlock',
      id: 'treatment-sanctuary-welcome',
      title: 'CHAPTER 11 — TREATMENT OF THE HAIR AND SCALP',
      content: 'Chapter 11 focuses on safe shampooing, draping, hair and scalp analysis, scalp massage, treatment procedures, treatment equipment, and professional service boundaries. The barber observes service-relevant hair and scalp conditions, selects appropriate products and procedures, and refers conditions that are outside barbering scope rather than diagnosing or medically treating them.',
      highlight: 'ANALYZE — SELECT — PERFORM SAFELY — REFER WHEN NEEDED',
    },
    {
      type: 'infoCards',
      id: 'why-treatment-matters',
      title: 'WHY HAIR & SCALP TREATMENT SKILLS MATTER',
      subtitle: 'Use Chapter 11 procedures to support safe, appropriate client care',
      cards: [
        { icon: 'Search', title: 'ANALYSIS FIRST', text: 'Consultation and hair/scalp analysis guide product and treatment selection before the service begins.' },
        { icon: 'Shield', title: 'SAFE SERVICE', text: 'Draping, water-temperature checks, scalp observation, and contraindication awareness protect the client during service.' },
        { icon: 'Hand', title: 'PROPER TECHNIQUE', text: 'Shampooing, massage, steam, hot towels, and treatment procedures should follow the source-supported sequence and pressure guidelines.' },
        { icon: 'BookOpen', title: 'PROFESSIONAL BOUNDARIES', text: 'Barbers provide cosmetic hair/scalp services within scope and refer parasitic, staphylococcal, or other medical concerns appropriately.' },
      ],
    },
    {
      type: 'levelUp',
      id: 'treatment-certification',
      title: 'CHAPTER 11 SKILLS PROGRESSION',
      subtitle: 'Build from observation to safe, independent service decisions',
      levels: [
        { level: 'Level 1', title: 'Service Preparation', description: 'Identify proper draping, setup, client positioning, and water-temperature checks.', reward: 'Preparation Check' },
        { level: 'Level 2', title: 'Hair & Scalp Analysis', description: 'Observe condition, texture, density, porosity, elasticity, and contraindications before product selection.', reward: 'Analysis Check' },
        { level: 'Level 3', title: 'Massage & Treatment Procedure', description: 'Apply the Chapter 11 massage manipulations and treatment sequence using controlled pressure and continuous movements.', reward: 'Technique Check' },
        { level: 'Level 4', title: 'Equipment & Adjuncts', description: 'Use scalp steam, hot towels, and electric massage devices according to the source-supported procedure.', reward: 'Equipment Check' },
        { level: 'Level 5', title: 'Safe Professional Judgment', description: 'Recognize when a service is appropriate, when it should stop, and when referral is required.', reward: 'Safety Check' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'draping-shampoo-service',
      title: 'DRAPING & SHAMPOO SERVICE',
      content: 'Chapter 11 describes waterproof shampoo capes and nylon or synthetic haircutting capes, with draping methods selected for wet services, chemical services, haircutting, and mustache or beard trimming. Draping protects the client\'s skin and clothing from water and service products.\n\nSHAMPOO METHODS: The reclined method is the most common and uses a shampoo bowl with a reclining or hydraulic chair. The inclined method positions the client forward over the bowl. For wheelchair-bound or disabled clients, ask how they can be positioned safely and comfortably.\n\nSUPERIOR SHAMPOO SERVICE: Give individual attention, choose appropriate products, use proper technique, test water temperature, massage the scalp appropriately, and avoid common faults such as extreme water temperature, wetting the face, scraping the scalp, insufficient massage, or improper blotting.\n\nBARBER POSITIONING: Use balanced posture with parallel feet and stable body position while performing the service.',
      highlight: 'DRAPE CORRECTLY — TEST WATER — PROTECT THE CLIENT',
    },
    {
      type: 'tabbed',
      id: 'scalp-treatment-types',
      title: 'SCALP TREATMENT NEEDS',
      subtitle: 'Match cosmetic treatment decisions to the observed hair and scalp condition',
      tabs: [
        {
          id: 'moisturizing',
          label: 'DRY',
          title: 'DRY HAIR & SCALP',
          bullets: [
            { label: 'SOURCE FOCUS', description: 'Chapter 11 identifies dry hair/scalp as a common treatment concern.' },
            { label: 'PRODUCT DIRECTION', description: 'Use gentle cleansing and moisturizing products appropriate to the client\'s hair and scalp needs.' },
            { label: 'SERVICE DECISION', description: 'Base the service on consultation and observable hair/scalp analysis rather than medical diagnosis.' },
          ],
          facts: [{ text: 'The material summary associates dry scalp with reduced oil-gland activity and emphasizes cleanliness plus stimulation as core treatment principles.' }],
        },
        {
          id: 'clarifying',
          label: 'OILY',
          title: 'OILY HAIR & SCALP',
          bullets: [
            { label: 'SOURCE FOCUS', description: 'Chapter 11 identifies oily hair/scalp as a common treatment concern.' },
            { label: 'PRODUCT DIRECTION', description: 'Choose cleansing products that match the observed hair/scalp condition and follow manufacturer directions.' },
            { label: 'SERVICE DECISION', description: 'Regular shampooing may be part of cosmetic maintenance when appropriate for the client.' },
          ],
          facts: [{ text: 'The material summary associates oily scalp with overactive sebaceous glands.' }],
        },
        {
          id: 'stimulating',
          label: 'STIMULATION',
          title: 'SCALP STIMULATION',
          bullets: [
            { label: 'SOURCE FOCUS', description: 'Chapter 11 describes stimulation as one of the essential principles of scalp treatment.' },
            { label: 'METHOD', description: 'Use the source-supported massage manipulations with controlled pressure and rhythmic movement.' },
            { label: 'BOUNDARY', description: 'Do not promise hair regrowth or other medical outcomes from massage.' },
          ],
          facts: [{ text: 'The source describes increased blood and lymph flow, soothed nerves, stimulated muscles and glands, and greater scalp flexibility as massage effects.' }],
        },
        {
          id: 'dandruff',
          label: 'DANDRUFF',
          title: 'DANDRUFF / PITYRIASIS',
          bullets: [
            { label: 'SOURCE FOCUS', description: 'Chapter 11 identifies dandruff as a common scalp concern and associates it with Malassezia.' },
            { label: 'SERVICE APPROACH', description: 'Use source-supported dandruff-control products and procedures within barbering scope.' },
            { label: 'BOUNDARY', description: 'If the observed condition is outside cosmetic-service scope or suggests an infectious/medical concern, stop or modify service and refer appropriately.' },
          ],
          facts: [{ text: 'Do not convert visual observation into a medical diagnosis.' }],
        },
      ],
    },
    {
      type: 'featureGrid',
      id: 'hair-treatment-types',
      title: 'HAIR TREATMENT SELECTION',
      subtitle: 'Use the Chapter 11 product-matching table and analysis findings',
      features: [
        { icon: 'Droplets', title: 'FINE HAIR', description: 'The Chapter 11 table pairs fine hair with volumizing shampoo, detangling conditioner, and protein treatments.' },
        { icon: 'Shield', title: 'MEDIUM HAIR', description: 'The Chapter 11 table pairs medium hair with pH-balanced products.' },
        { icon: 'Flame', title: 'COARSE HAIR', description: 'The Chapter 11 table pairs coarse hair with moisturizing products and leave-in conditioners.' },
        { icon: 'Link', title: 'WAVY / CURLY HAIR', description: 'The Chapter 11 table pairs wavy or curly hair with light leave-in products and protein treatments.' },
        { icon: 'Sparkles', title: 'DRY / DAMAGED HAIR', description: 'The Chapter 11 table pairs dry or damaged hair with gentle cleansing and deep moisturizing plus protein/moisturizing repair treatments.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'product-selection-system',
      title: 'CONSULTATION, ANALYSIS & PRODUCT SELECTION',
      content: 'Begin with consultation and hair/scalp analysis. Chapter 11 directs the barber to consider hair/scalp condition, texture, density, porosity, elasticity, and the presence of abrasions or disorders before selecting products or beginning a service.\n\nUse the Chapter 11 product-matching guidance and follow product labels and manufacturer directions. Observable findings guide cosmetic service decisions; they do not authorize medical diagnosis.',
      highlight: 'CONSULT — ANALYZE — MATCH — FOLLOW DIRECTIONS',
    },
    {
      type: 'scenarioBlock',
      id: 'treatment-matching-scenarios',
      title: 'TREATMENT-MATCHING PRACTICE',
      subtitle: 'Apply Chapter 11 analysis and scope boundaries',
      scenarios: [
        {
          situation: 'A client has dry, damaged hair. Which Chapter 11 product direction best matches the source table?',
          options: [
            { letter: 'A', text: 'Use only strong clarifying products', feedback: '❌ The source does not pair dry/damaged hair with strong clarifying-only care.' },
            { letter: 'B', text: 'Use gentle cleansing with deep moisturizing and protein/moisturizing repair options', feedback: '✅ This matches the Chapter 11 product table.' },
            { letter: 'C', text: 'Skip analysis and use the same shampoo for every client', feedback: '❌ Chapter 11 requires consultation and analysis before selection.' },
            { letter: 'D', text: 'Diagnose a medical cause before choosing products', feedback: '❌ Medical diagnosis is outside the barber\'s role.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'During scalp analysis you observe a condition that appears outside routine cosmetic maintenance. What is the safest Chapter 11 response?',
          options: [
            { letter: 'A', text: 'Continue the service and treat the condition medically', feedback: '❌ Medical treatment is outside barbering scope.' },
            { letter: 'B', text: 'Use professional judgment to pause or avoid the service and refer appropriately', feedback: '✅ This preserves Chapter 11 service-safety and referral boundaries.' },
            { letter: 'C', text: 'Ignore the finding if the client requests service', feedback: '❌ Client preference does not remove service-safety responsibilities.' },
            { letter: 'D', text: 'Promise the condition will improve after massage', feedback: '❌ Chapter 11 does not support medical outcome promises.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },
    {
      type: 'checklist',
      id: 'treatment-procedure',
      title: 'SOURCE-GROUNDED TREATMENT PROCEDURE',
      subtitle: 'Use the Chapter 11 sequence and manufacturer directions',
      items: [
        { text: 'STEP 1 — CONSULTATION & ANALYSIS: Evaluate the observable hair/scalp condition, texture, density, porosity, elasticity, and contraindications.' },
        { text: 'STEP 2 — CLEANSE: Use a suitable shampoo for the client\'s hair and scalp condition.' },
        { text: 'STEP 3 — TREATMENT: Apply the appropriate cosmetic hair/scalp treatment according to product directions and the planned service.' },
        { text: 'STEP 4 — ADJUNCTS AS APPROPRIATE: Chapter 11 permits scalp steam, massage by hand or electrical appliance, and other source-listed treatment equipment when appropriate.' },
        { text: 'STEP 5 — COMPLETE SERVICE: Finish the treatment safely, then comb or style as appropriate to the procedure.' },
      ],
    },
    {
      type: 'tabbed',
      id: 'massage-techniques',
      title: 'SCALP MASSAGE MANIPULATIONS',
      subtitle: 'Chapter 11 identifies three primary manipulation patterns',
      tabs: [
        {
          id: 'effleurage',
          label: 'SLIDING',
          title: 'SLIDING MOVEMENTS',
          bullets: [
            { label: 'MOVEMENT', description: 'Thumbs and fingertips move in gliding strokes.' },
            { label: 'GUIDELINE', description: 'Use slow, rhythmic, continuous motion with even pressure.' },
            { label: 'APPLICATION', description: 'Chapter 11 uses sliding movements in multiple scalp areas, including sides-to-top and forehead-to-crown.' },
          ],
          facts: [{ text: 'Keep the hands under the hair and avoid pulling.' }],
        },
        {
          id: 'petrissage',
          label: 'ROTARY',
          title: 'ROTARY MOVEMENTS',
          bullets: [
            { label: 'MOVEMENT', description: 'Thumbs and fingertips use overlapping circular movements.' },
            { label: 'GUIDELINE', description: 'Firm upward pressure and rotary movement help loosen scalp tissues.' },
            { label: 'APPLICATION', description: 'Chapter 11 uses rotary movement behind the ears to crown and along the front hairline.' },
          ],
          facts: [{ text: 'Begin at the hairline and maintain synchronized, controlled movement.' }],
        },
        {
          id: 'friction',
          label: 'BACK & FORTH',
          title: 'BACK-AND-FORTH MOVEMENTS',
          bullets: [
            { label: 'MOVEMENT', description: 'Thumbs and fingertips use brisk back-and-forth movement.' },
            { label: 'PRESSURE', description: 'Use moderate to firm pressure without pulling the hair.' },
            { label: 'APPLICATION', description: 'This is one of the three Chapter 11 massage manipulations.' },
          ],
          facts: [{ text: 'Pressure and rhythm should remain controlled and comfortable.' }],
        },
        {
          id: 'tapotement',
          label: 'SEQUENCE',
          title: 'MASSAGE SEQUENCE & CONTROL',
          bullets: [
            { label: 'START', description: 'Begin at the hairline.' },
            { label: 'CONTROL', description: 'Use even pressure with continuous, synchronized movements.' },
            { label: 'SAFETY', description: 'Avoid pulling the hair and adapt the service to the client\'s comfort and observed scalp condition.' },
          ],
          facts: [{ text: 'Chapter 11 distinguishes rotary, sliding, and back-and-forth manipulations; it does not require the unrelated four-stroke massage framework.' }],
        },
      ],
    },
    {
      type: 'featureGrid',
      id: 'massage-benefits',
      title: 'SOURCE-SUPPORTED EFFECTS OF SCALP MASSAGE',
      subtitle: 'Keep claims within the Chapter 11 source record',
      features: [
        { icon: 'Heart', title: 'CIRCULATION', description: 'Chapter 11 states that scalp massage increases blood and lymph flow.' },
        { icon: 'Smile', title: 'NERVES', description: 'The source describes massage as soothing nerves.' },
        { icon: 'Zap', title: 'MUSCLES & GLANDS', description: 'The source states that massage stimulates muscles and glands.' },
        { icon: 'Recycle', title: 'SCALP FLEXIBILITY', description: 'The source identifies increased scalp flexibility as an effect of massage.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'treatment-equipment-steam-hot-towels',
      title: 'STEAM, HOT TOWELS & ELECTRIC MASSAGE',
      content: 'SCALP STEAM: Chapter 11 describes steam as preparation for massage and treatment. It softens the scalp and hair, relaxes pores, and increases circulation. Follow equipment directions: fill the container with water, fit the hood over the client\'s head, and operate the unit as designed. Some hood models have side openings that allow scalp massage during steam.\n\nHOT TOWELS: Hot towels may substitute for a scalp steamer. Prepare them in a hot-towel cabinet or hot water and use one towel or a series of applications as appropriate.\n\nELECTRIC MASSAGER: A vibrator/hand massager can provide stimulating scalp massage using the same general movement patterns as hand massage. Adjust it on the back of the hand so the thumb and fingers remain free. Regulate intensity and duration and avoid excessive pressure.\n\nTREATMENT SERIES: Chapter 11 describes scalp treatments as a series, commonly once a week for several weeks, with more frequent schedules only under dermatologist direction.',
      highlight: 'CONTROL INTENSITY — AVOID EXCESSIVE PRESSURE — FOLLOW EQUIPMENT DIRECTIONS',
    },
    {
      type: 'contentBlock',
      id: 'home-care-system',
      title: 'CLIENT HOME-CARE GUIDANCE',
      content: 'Keep home-care guidance tied to the client\'s analyzed hair/scalp condition and to product labels or manufacturer directions. Explain the selected shampoo, conditioner, or treatment in clear language and avoid making medical promises. When the client\'s condition is outside routine cosmetic maintenance, referral is more appropriate than a home-treatment recommendation.',
      highlight: 'EDUCATE WITHIN SCOPE',
    },
    {
      type: 'infoCards',
      id: 'retail-sales-mastery',
      title: 'PROFESSIONAL PRODUCT RECOMMENDATIONS',
      subtitle: 'Connect recommendations to analysis rather than sales pressure',
      cards: [
        { icon: 'BookOpen', title: 'EXPLAIN THE MATCH', text: 'Connect the recommendation to the client\'s observed hair/scalp characteristics and Chapter 11 product-matching guidance.' },
        { icon: 'Hand', title: 'FOLLOW LABELS', text: 'Use product labels and manufacturer directions when explaining use.' },
        { icon: 'Target', title: 'STAY SPECIFIC', text: 'Recommend only what fits the client\'s analyzed cosmetic needs.' },
        { icon: 'Shield', title: 'STAY WITHIN SCOPE', text: 'Do not sell a cosmetic product as a substitute for medical evaluation when referral is indicated.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'common-confusions',
      title: 'COMMON CHAPTER 11 DISTINCTIONS',
      content: 'DRY vs. OILY: Chapter 11 treats dry and oily hair/scalp as different cosmetic concerns requiring different product choices.\n\nDANDRUFF vs. ROUTINE DRYNESS: The source associates dandruff with Malassezia; use observation and source-supported cosmetic care without making a medical diagnosis.\n\nSHAMPOO vs. TREATMENT: Shampoo cleanses; treatment selection follows consultation, analysis, and the client\'s hair/scalp needs.\n\nHAND MASSAGE vs. ELECTRIC MASSAGE: Chapter 11 permits both; electric massage requires control of intensity, duration, and pressure.\n\nCOSMETIC CARE vs. MEDICAL CARE: Barbers provide cosmetic maintenance within scope and refer parasitic, staphylococcal, or other medical conditions appropriately.',
      highlight: 'OBSERVE — DIFFERENTIATE — STAY WITHIN SCOPE',
    },
    {
      type: 'featureGrid',
      id: 'memory-tricks',
      title: 'MEMORY REINFORCEMENT',
      subtitle: 'Quick Chapter 11 retrieval cues',
      features: [
        { icon: 'Brain', title: 'ANALYSIS BEFORE SELECTION', description: 'Condition, texture, density, porosity, elasticity, and contraindications guide the service.' },
        { icon: 'Brain', title: 'THREE MASSAGE PATTERNS', description: 'Rotary, sliding, and back-and-forth.' },
        { icon: 'Brain', title: 'STEAM OR HOT TOWEL', description: 'Hot towels can substitute for a scalp steamer.' },
        { icon: 'Brain', title: 'REFER OUT-OF-SCOPE CONDITIONS', description: 'Do not treat parasitic or staphylococcal scalp disorders.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'board-exam-alerts',
      title: 'CHAPTER 11 SAFETY & SERVICE CHECKPOINTS',
      content: '1. Consult and analyze before product or treatment selection.\n2. Use the drape appropriate to the service.\n3. Test water temperature before shampooing.\n4. Use proper client and barber positioning.\n5. Match products to hair/scalp characteristics and follow manufacturer directions.\n6. Use rotary, sliding, and back-and-forth scalp massage movements as described in Chapter 11.\n7. Control pressure, intensity, and duration during massage.\n8. Scalp steam and hot towels can support treatment preparation.\n9. Electric massage requires controlled intensity and pressure.\n10. Do not perform cosmetic treatment on conditions that Chapter 11 identifies as outside barbering scope; refer appropriately.\n11. Do not diagnose medical conditions or promise medical outcomes.',
      highlight: 'SAFE SERVICE DECISIONS MATTER MORE THAN MEMORIZING UNSUPPORTED CLAIMS',
    },
    {
      type: 'actionPrompt',
      id: 'treatment-action-items',
      title: 'CHAPTER 11 PRACTICE',
      subtitle: 'Build source-supported service skill',
      prompts: [
        { action: 'Practice Draping', description: 'Practice selecting and applying the appropriate drape for wet, chemical, haircut, and facial-hair services.', benefit: 'Builds safe service preparation', timeframe: '10 minutes' },
        { action: 'Practice the Three Massage Manipulations', description: 'Practice rotary, sliding, and back-and-forth movements with controlled pressure and rhythm.', benefit: 'Builds Chapter 11 technique recall', timeframe: '15 minutes' },
        { action: 'Run a Product-Matching Drill', description: 'Match fine, medium, coarse, wavy/curly, and dry/damaged hair to the Chapter 11 product table.', benefit: 'Builds analysis-to-selection reasoning', timeframe: '10 minutes' },
        { action: 'Practice Service-Stop Decisions', description: 'Review when a scalp finding calls for a routine cosmetic service, a modified service, or referral.', benefit: 'Builds scope and safety judgment', timeframe: '10 minutes' },
      ],
    },
    {
      type: 'quote',
      id: 'treatment-sanctuary-pledge',
      quote: 'I will analyze before I select products, protect the client through proper preparation and technique, stay within barbering scope, and refer conditions that require medical care.',
    },
  ],
}
