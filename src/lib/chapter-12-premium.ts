// Chapter 12: Men's Facial Massage and Treatments — PREMIUM IMMERSIVE EXPERIENCE
// THE GENTLEMAN'S ATELIER — Master Facial Massage, Skin Science & Grooming Rituals

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// GENTLEMAN'S ATELIER THEME — Refined Masculine Elegance
// Deep navy / Warm brass / Cognac amber / Ivory cream
// Feels like: A private gentlemen's club where grooming is an art form
// ═══════════════════════════════════════════════

export const chapter12PremiumTheme: ChapterTheme = {
  primary: '#1E3A5F',
  primaryLight: '#4A6FA5',
  primaryDark: '#0F1F33',
  secondary: '#C9A84C',
  background: 'rgba(18, 24, 32, 0.96)',
  backgroundAlt: 'rgba(28, 36, 48, 0.92)',
  surface: '#121820',
  border: 'rgba(30, 58, 95, 0.25)',
  text: '#F0F4F8',
  textMuted: '#8A9BB8',
  highlight: '#C9A84C',
  timeline: {
    line: 'rgba(30, 58, 95, 0.35)',
    iconBg: '#1C2430',
    iconBorder: '#1E3A5F',
  },
  quote: {
    border: 'rgba(30, 58, 95, 0.4)',
    icon: 'rgba(30, 58, 95, 0.3)',
    bg: 'rgba(18, 24, 32, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(30, 58, 95, 0.15)',
    activeBorder: 'rgba(30, 58, 95, 0.5)',
    activeText: '#4A6FA5',
    inactiveBg: 'rgba(18, 24, 32, 0.7)',
    inactiveBorder: 'rgba(30, 58, 95, 0.12)',
    inactiveText: '#8A9BB8',
    panelBg: 'rgba(18, 24, 32, 0.85)',
    panelBorder: 'rgba(30, 58, 95, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(30, 58, 95, 0.1)',
    headerText: '#4A6FA5',
    dot: 'rgba(30, 58, 95, 0.6)',
    line: 'rgba(30, 58, 95, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(30, 58, 95, 0.15)',
    iconColor: '#1E3A5F',
    cardBorder: 'rgba(30, 58, 95, 0.2)',
  },
  milestone: {
    yearColor: '#1E3A5F',
    border: 'rgba(30, 58, 95, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(30, 58, 95, 0.4)',
    checkColor: '#1E3A5F',
    bg: 'rgba(18, 24, 32, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(18, 24, 32, 0.7)',
    border: 'rgba(30, 58, 95, 0.18)',
    highlightColor: '#C9A84C',
  },
  challengeCard: {
    badgeBg: 'rgba(201, 168, 76, 0.15)',
    badgeText: '#C9A84C',
    cardBorder: 'rgba(30, 58, 95, 0.22)',
    completedBg: 'rgba(0, 230, 118, 0.1)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(201, 168, 76, 0.06)',
    optionBorder: 'rgba(30, 58, 95, 0.18)',
    correctBg: 'rgba(0, 230, 118, 0.1)',
    incorrectBg: 'rgba(255, 82, 82, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(30, 58, 95, 0.15)',
    levelBadgeText: '#4A6FA5',
    rewardBg: 'rgba(0, 230, 118, 0.1)',
    rewardText: '#00E676',
  },
  actionPrompt: {
    cardBorder: 'rgba(30, 58, 95, 0.18)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
    benefitBg: 'rgba(30, 58, 95, 0.08)',
    benefitBorder: 'rgba(30, 58, 95, 0.25)',
  },
}

// ═══════════════════════════════════════════════
// PREMIUM IMMERSIVE CHAPTER 12 CONTENT
// ═══════════════════════════════════════════════

export const chapter12PremiumContent: ChapterContent = {
  chapterNumber: 12,
  title: "MEN'S FACIAL MASSAGE AND TREATMENTS",
  subtitle: "Enter the Gentleman's Atelier — Master the Art of Facial Massage, Skin Science & Grooming Rituals",
  theme: chapter12PremiumTheme,
  sections: [
    // ═══════════════════════════════════════════
    // SECTION 1: WELCOME TO THE GENTLEMAN'S ATELIER
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'gentlemans-atelier-welcome',
      title: '🎩 WELCOME TO THE GENTLEMAN\'S ATELIER',
      content: 'Facial massage and facial treatments are professional grooming services that require consultation, client comfort, controlled technique, sanitation, and clear scope boundaries.\n\nSkin and hair characteristics vary from client to client. Use observation and consultation rather than assumptions about sex, age, or a single skin characteristic when selecting cosmetic products or pressure.\n\nCHAPTER FOCUS: Know the source-covered massage manipulations, facial anatomy relevant to service, skin analysis, sanitation, contraindications, equipment safety, treatment sequence, and referral boundaries. Massage is a cosmetic service; do not present it as medical treatment or promise physiological or therapeutic outcomes.',
      highlight: 'MASSAGE WITH PURPOSE — TREAT WITH SCIENCE — ELEVATE THE EXPERIENCE',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: WHY FACIAL MASSAGE MATTERS
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'why-facial-massage-matters',
      title: 'WHY FACIAL MASSAGE MATTERS',
      subtitle: 'Three pillars of benefit that keep clients coming back',
      cards: [
        {
          icon: 'Heart',
          title: 'PHYSICAL BENEFITS',
          text: 'Use controlled, comfortable massage movements as part of a cosmetic facial service. Technique, pressure, rhythm, and client response guide the service; avoid promising medical or physiological outcomes.',
        },
        {
          icon: 'Leaf',
          title: 'SKIN HEALTH',
          text: 'Select and apply cosmetic products according to observable skin needs, product directions, and the planned service. Do not claim that massage opens pores, treats acne, or drives products deeper into the skin.',
        },
        {
          icon: 'Brain',
          title: 'MENTAL WELLNESS',
          text: 'A calm environment and comfortable touch can support a relaxing grooming experience. Keep the service framed as cosmetic care rather than therapy or treatment of anxiety, sleep problems, or other health conditions.',
        },
        {
          icon: 'DollarSign',
          title: 'PROFESSIONAL REVENUE',
          text: 'Facial treatments represent premium add-on services. Clients who experience professional facial massage become repeat customers and refer friends. This is where barbers build loyal clientele.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: MASSAGE PRACTITIONER LEVELS
    // ═══════════════════════════════════════════
    {
      type: 'levelUp',
      id: 'massage-certification',
      title: '🎩 FACIAL MASSAGE CERTIFICATION',
      subtitle: 'Progress from Observer to Master Therapist — earn your grooming credentials',
      levels: [
        {
          level: 'Level 1',
          title: 'Massage Observer',
          description: 'You know the basic movements: effleurage, petrissage, tapotement, friction, vibration, and feathering. You can perform a basic facial massage with guidance.',
          reward: 'Safe Touch Badge — Clients trust your careful, intentional movements',
        },
        {
          level: 'Level 2',
          title: 'Technique Specialist',
          description: 'You perform each movement with proper pressure and rhythm. You understand when to use each technique and can adapt to different skin types. You perform consistent 10-15 minute massages.',
          reward: 'Rhythm Master — Your massages flow seamlessly from start to finish',
        },
        {
          level: 'Level 3',
          title: 'Skin Analyst',
          description: 'You identify skin types accurately and select appropriate products. You recognize contraindications and know when to refer. You customize treatments for individual client needs.',
          reward: 'Skin Whisperer — Your recommendations consistently improve client skin',
        },
        {
          level: 'Level 4',
          title: 'Treatment Designer',
          description: 'You create complete facial experiences combining massage, masks, and hot towel treatments. You understand product ingredients and their effects. You retail products with authority.',
          reward: 'Experience Architect — Clients book specifically for your treatments',
        },
        {
          level: 'Level 5',
          title: 'Master Therapist',
          description: 'You command complete knowledge of facial massage, skin science, and grooming rituals. Other barbers consult you. You elevate the entire profession through expertise and care.',
          reward: 'Atelier Master — Your facial treatments are legendary',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 4: TYPES OF MASSAGE MOVEMENTS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'massage-movements',
      title: 'MASSAGE MOVEMENTS — THE THERAPIST\'S TOOLKIT',
      subtitle: 'Master these six fundamental techniques',
      tabs: [
        {
          id: 'effleurage',
          label: 'EFFLEURAGE',
          title: 'EFFLEURAGE — THE FOUNDATION STROKE',
          bullets: [
            { label: 'MOVEMENT', description: 'Long, smooth, gliding strokes that follow the natural contours of the face' },
            { label: 'PRESSURE', description: 'Light to medium — soothing and continuous' },
            { label: 'PURPOSE', description: 'Opening and closing the massage, product distribution, relaxation' },
            { label: 'WHEN TO USE', description: 'Always begin and end with effleurage to relax the client and spread product evenly' },
          ],
          facts: [
            { text: 'Effleurage is the foundation of all facial massage — it sets the tone for the entire service.' },
            { text: 'STUDY FOCUS: Know the source-covered role of effleurage in the massage sequence and how it differs from the other manipulations.' },
          ],
        },
        {
          id: 'petrissage',
          label: 'PETRISSAGE',
          title: 'PETRISSAGE — THE DEEP WORK',
          bullets: [
            { label: 'MOVEMENT', description: 'Kneading and lifting movements using the fingertips' },
            { label: 'PRESSURE', description: 'Medium to firm — works deeper into muscle tissue' },
            { label: 'PURPOSE', description: 'Stimulating circulation, relieving muscle tension, jawline work' },
            { label: 'WHEN TO USE', description: 'After effleurage, when the skin is warmed up and ready for deeper stimulation' },
          ],
          facts: [
            { text: 'Petrissage is especially effective on the jawline where men carry tension from chewing and stress.' },
            { text: 'Use caution around the eye area — petrissage is too intense for delicate orbital skin.' },
          ],
        },
        {
          id: 'tapotement',
          label: 'TAPOTEMENT',
          title: 'TAPOTEMENT — THE AWAKENING',
          bullets: [
            { label: 'MOVEMENT', description: 'Light, rhythmic tapping or percussion movements using fingertips' },
            { label: 'PRESSURE', description: 'Light and brisk — invigorating and stimulating' },
            { label: 'PURPOSE', description: 'Stimulating tired skin, improving tone, finishing touches' },
            { label: 'WHEN TO USE', description: 'Toward the end of massage to energize the skin and signal completion' },
          ],
          facts: [
            { text: 'Tapotement increases blood flow to the surface, creating a healthy, flushed appearance.' },
            { text: 'Never use tapotement on inflamed or irritated skin — it can worsen inflammation.' },
          ],
        },
        {
          id: 'friction',
          label: 'FRICTION',
          title: 'FRICTION — THE HEAT GENERATOR',
          bullets: [
            { label: 'MOVEMENT', description: 'Small, circular movements using the pads of the fingers' },
            { label: 'PRESSURE', description: 'Firm and focused — concentrated on specific areas' },
            { label: 'PURPOSE', description: 'Breaking down tension, working on specific problem areas' },
            { label: 'WHEN TO USE', description: 'On areas of tension such as temples, forehead, and between the eyebrows' },
          ],
          facts: [
            { text: 'Friction is a focused rubbing movement. Use controlled pressure and client comfort; do not describe the skin as literally opening pores or guarantee deeper product absorption.' },
            { text: 'Use friction sparingly on sensitive skin — the heat can cause redness.' },
          ],
        },
        {
          id: 'vibration',
          label: 'VIBRATION',
          title: 'VIBRATION — THE NERVE STIMULATOR',
          bullets: [
            { label: 'MOVEMENT', description: 'Rapid, trembling movements that create a vibrating sensation' },
            { label: 'PRESSURE', description: 'Very light — requires steady hands and controlled movement' },
            { label: 'PURPOSE', description: 'Nerve stimulation, sinus relief, energizing the skin' },
            { label: 'WHEN TO USE', description: 'Briefly on the forehead and cheeks to stimulate nerve endings' },
          ],
          facts: [
            { text: 'Vibration is advanced technique — practice on your own face before performing on clients.' },
            { text: 'This movement is particularly effective for clients with sinus congestion.' },
          ],
        },
        {
          id: 'feathering',
          label: 'FEATHERING',
          title: 'FEATHERING — THE GENTLE FINISH',
          bullets: [
            { label: 'MOVEMENT', description: 'Ultra-light, barely-there strokes using just the fingertips' },
            { label: 'PRESSURE', description: 'Feather-light — the gentlest of all movements' },
            { label: 'PURPOSE', description: 'Sensitive skin, ending the massage, calming the nervous system' },
            { label: 'WHEN TO USE', description: 'As the final movement to signal completion and leave the client in a relaxed state' },
          ],
          facts: [
            { text: 'Feathering is the signature of a master therapist — it leaves clients feeling pampered and valued.' },
            { text: 'Always end every facial massage with feathering strokes, regardless of skin type.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 5: FACIAL MASSAGE PROCEDURE
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'facial-massage-procedure',
      title: 'THE FOUR-STEP FACIAL PROTOCOL',
      subtitle: 'Follow this sequence for every professional facial treatment',
      items: [
        { text: 'STEP 1 — PREPARATION: Assess skin type and condition. Discuss allergies or sensitivities. Identify contraindications. Explain the procedure. Sanitize all tools and surfaces. Prepare warm towels. Arrange products within reach. Ensure proper lighting.' },
        { text: 'STEP 2 — CLEANSING: Cleanse the skin with a cosmetic product appropriate to the client and the planned service. Follow the product label and use comfortable water temperature.' },
        { text: 'STEP 3 — MASSAGE: Apply an appropriate massage medium and use the source-covered manipulations with controlled pressure, steady rhythm, and continuous client-comfort checks. Follow the chapter sequence and adapt the service when a contraindication or safety concern is present.' },
        { text: 'STEP 4 — FINISHING: Remove excess product safely, complete the finishing steps appropriate to the service, and apply cosmetic products according to the client analysis and manufacturer directions. Provide home-care guidance within barbering scope.' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 5A: SANITATION & INFECTION CONTROL
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'sanitation-infection-control',
      title: 'SANITATION & INFECTION CONTROL',
      content: 'Infection control is the foundation of every facial service. Follow current applicable rules, product labels, and shop procedures for hand hygiene, cleaning, disinfection, linens, single-use items, and contaminated materials.\n\nBEFORE EVERY SERVICE:\n• Perform hand hygiene and prepare a clean service area\n• Clean and disinfect reusable tools and surfaces as required by the applicable product label and rules\n• Use clean linens and protect clean supplies from contamination\n\nDURING THE SERVICE:\n• Prevent product contamination by using clean dispensing methods\n• If blood or other body-fluid exposure occurs, stop the service and follow the applicable exposure-control procedure\n• Avoid touching non-service surfaces and then returning to the client without re-establishing clean technique\n• Use appropriate protective equipment when exposure risk or applicable rules require it\n\nAFTER THE SERVICE:\n• Discard single-use items appropriately\n• Clean and disinfect reusable items and service surfaces before the next client\n• Store clean items so they are protected from recontamination\n\nSTUDY FOCUS: Know cleaning-versus-disinfection sequence, label directions, contamination prevention, and safe tool handling.',
      highlight: 'SANITATION IS NOT OPTIONAL — IT IS THE FOUNDATION OF PROFESSIONAL TRUST',
    },

    // ═══════════════════════════════════════════
    // SECTION 5B: CLIENT CONSULTATION
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'client-consultation',
      title: 'THE CLIENT CONSULTATION',
      content: 'Every professional facial service begins with consultation and observation. Gather information needed to decide whether the planned cosmetic service is appropriate and comfortable without diagnosing medical conditions.\n\nTHE CONSULTATION CHECKLIST:\n• Ask about the client\'s cosmetic skin concerns, sensitivities, allergies, and current products\n• Ask whether a health condition, medication, recent procedure, or provider instruction may affect service safety\n• Discuss the desired cosmetic outcome and explain the planned procedure and products\n• Check client comfort with pressure, temperature, fragrance, and positioning\n\nSERVICE-SAFETY RED FLAGS:\n• Active or potentially contagious conditions, open wounds, significant irritation, or other findings that make the service unsafe\n• A recent procedure or medical concern for which the barber cannot determine safe service within scope\n• Any client response that makes continued service uncomfortable or unsafe\n\nWhen safety is uncertain, defer the service and recommend appropriate professional evaluation rather than diagnosing or prescribing. Document consultation findings, products used, service decisions, and client reactions according to shop policy.',
      highlight: 'A THOROUGH CONSULTATION PREVENTS PROBLEMS BEFORE THEY START',
    },

    // ═══════════════════════════════════════════
    // SECTION 6: FACIAL TREATMENTS & MASKS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'facial-treatments-masks',
      title: 'FACIAL TREATMENTS & MASKS',
      subtitle: 'Four essential treatments every barber must master',
      features: [
        {
          icon: 'Mountain',
          title: 'CLAY MASKS',
          description: 'Masks are cosmetic products selected according to observable skin needs and manufacturer directions. Avoid detoxification or medical-treatment claims unless the product labeling specifically supports them.',
        },
        {
          icon: 'FileText',
          title: 'SHEET MASKS',
          description: 'Pre-soaked fabric masks deliver concentrated serums. Hyaluronic acid for deep hydration, vitamin C for brightening, peptides for anti-aging. Ideal for dry and aging skin.',
        },
        {
          icon: 'Recycle',
          title: 'EXFOLIATING TREATMENTS',
          description: 'Remove dead skin cells to reveal fresh skin. Physical scrubs with fine particles, chemical AHA/BHA acids, enzymatic natural fruit enzymes. Essential for preventing ingrown hairs.',
        },
        {
          icon: 'Flame',
          title: 'HOT TOWEL TREATMENT',
          description: 'Hot towels are a traditional barbering service step. Use a comfortably warm towel, follow shop and manufacturer safety guidance, protect the airway, and monitor client comfort continuously. Do not rely on a universal temperature or timing rule.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 6A: CLEANSERS, TONERS & ASTRINGENTS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'cleansers-toners-astringents',
      title: 'CLEANSERS, TONERS & ASTRINGENTS',
      subtitle: 'Know your products — the backbone of every facial service',
      tabs: [
        {
          id: 'cleansers',
          label: 'CLEANSERS',
          title: 'CLEANSERS — THE FIRST STEP',
          bullets: [
            { label: 'OIL-BASED CLEANSERS', description: 'Dissolve oil-based impurities like sunscreen, makeup residue, and excess sebum. Essential for the first step of double cleansing.' },
            { label: 'WATER-BASED CLEANSERS', description: 'Remove water-soluble debris like sweat and dirt. Gel cleansers for oily skin, cream cleansers for dry skin.' },
            { label: 'FOAMING CLEANSERS', description: 'Create lather that lifts oil and debris. Best for oily and combination skin types. Can be drying for sensitive skin.' },
            { label: 'MICELLAR WATER', description: 'Gentle, no-rinse cleanser with tiny oil molecules suspended in water. Ideal for sensitive skin and quick cleanses.' },
          ],
          facts: [
            { text: 'The double cleanse method — oil first, then water-based — is the gold standard for professional facial preparation.' },
            { text: 'Always match cleanser pH to skin type. Harsh alkaline cleansers strip the acid mantle and cause irritation.' },
          ],
        },
        {
          id: 'toners',
          label: 'TONERS',
          title: 'TONERS — THE BALANCING ACT',
          bullets: [
            { label: 'HYDRATING TONERS', description: 'Contain humectants like glycerin and hyaluronic acid. Restore moisture after cleansing. Ideal for dry and sensitive skin.' },
            { label: 'EXFOLIATING TONERS', description: 'Some cosmetic toners contain exfoliating ingredients. Follow the product label, avoid irritated or compromised skin, and do not make medical treatment claims.' },
            { label: 'BALANCING TONERS', description: 'Use a toner only when it fits the client\'s cosmetic service plan and the product directions. Avoid promising deeper absorption or a universal pH effect.' },
            { label: 'SOOTHING TONERS', description: 'Contain botanicals like chamomile, aloe, and green tea. Calm redness and reduce inflammation after shaving or exfoliation.' },
          ],
          facts: [
            { text: 'Modern toners are not the harsh, alcohol-heavy astringents of the past. They are treatment products, not just "extra cleansing."' },
            { text: 'Apply toner immediately after cleansing while skin is still slightly damp for maximum absorption.' },
          ],
        },
        {
          id: 'astringents',
          label: 'ASTRINGENTS',
          title: 'ASTRINGENTS — THE OIL CONTROLLERS',
          bullets: [
            { label: 'ALCOHOL-BASED ASTRINGENTS', description: 'Some astringent products use alcohol and may feel drying or irritating. Select products according to the client analysis and label directions rather than claiming that pores tighten or close.' },
            { label: 'WITCH HAZEL', description: 'Natural astringent from the witch hazel plant. Gentler than alcohol-based options. Reduces inflammation and controls oil.' },
            { label: 'SALICYLIC ACID ASTRINGENTS', description: 'Some cosmetic astringent products contain salicylic acid. Use only as directed by the product label and keep recommendations within cosmetic-service scope.' },
            { label: 'WHEN TO USE', description: 'After cleansing and before moisturizing. Use only on oily areas if combination skin. Avoid eye area completely.' },
          ],
          facts: [
            { text: 'Astringents are stronger than toners. They are designed specifically for oil control and pore tightening, not hydration.' },
            { text: 'Overuse of astringents can strip the skin\'s protective barrier, causing rebound oil production and irritation.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 7: PRODUCT SELECTION BY SKIN TYPE
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'product-selection-skin-type',
      title: 'PRODUCT SELECTION BY SKIN TYPE',
      subtitle: 'Match the product to the skin — precision treatment starts here',
      tabs: [
        {
          id: 'normal-skin',
          label: 'NORMAL',
          title: 'NORMAL SKIN — BALANCED CARE',
          bullets: [
            { label: 'CLEANSER', description: 'Gel or cream-based cleansers with balanced pH' },
            { label: 'MASSAGE MEDIUM', description: 'Light facial oils or water-based lotions' },
            { label: 'MASK', description: 'Hydrating or brightening sheet masks' },
            { label: 'MOISTURIZER', description: 'Lightweight, balanced hydration' },
          ],
          facts: [
            { text: 'Normal skin is the easiest to treat but still requires consistent care to maintain balance.' },
            { text: 'Avoid heavy products that could tip the balance toward oiliness or dryness.' },
          ],
        },
        {
          id: 'oily-skin',
          label: 'OILY',
          title: 'OILY SKIN — OIL CONTROL',
          bullets: [
            { label: 'CLEANSER', description: 'Foaming cleansers with salicylic acid' },
            { label: 'MASSAGE MEDIUM', description: 'Oil-free gels or mattifying lotions' },
            { label: 'MASK', description: 'Clay masks with charcoal or bentonite' },
            { label: 'MOISTURIZER', description: 'Lightweight, oil-free, non-comedogenic' },
          ],
          facts: [
            { text: 'Oily skin still needs moisture — skipping moisturizer can cause skin to produce even more oil.' },
            { text: 'For ingredient-specific products, follow the label and avoid claims that go beyond the product directions or barbering scope.' },
          ],
        },
        {
          id: 'dry-skin',
          label: 'DRY',
          title: 'DRY SKIN — DEEP HYDRATION',
          bullets: [
            { label: 'CLEANSER', description: 'Cream or oil-based cleansers, avoid foaming' },
            { label: 'MASSAGE MEDIUM', description: 'Rich facial oils: jojoba, argan, rosehip' },
            { label: 'MASK', description: 'Hydrating sheet masks with hyaluronic acid' },
            { label: 'MOISTURIZER', description: 'Rich, emollient creams with ceramides' },
          ],
          facts: [
            { text: 'Dry skin lacks oil; dehydrated skin lacks water. Treat accordingly.' },
            { text: 'Avoid alcohol-based products and harsh exfoliants on dry skin.' },
          ],
        },
        {
          id: 'sensitive-skin',
          label: 'SENSITIVE',
          title: 'SENSITIVE SKIN — GENTLE CARE',
          bullets: [
            { label: 'CLEANSER', description: 'Fragrance-free, hypoallergenic cleansers' },
            { label: 'MASSAGE MEDIUM', description: 'Gentle oils: squalane, chamomile-based' },
            { label: 'MASK', description: 'Aloe vera or oatmeal-based soothing masks' },
            { label: 'MOISTURIZER', description: 'Minimal ingredient lists, soothing botanicals' },
          ],
          facts: [
            { text: 'Always perform patch tests with new products on sensitive skin clients.' },
            { text: 'Avoid essential oils, fragrances, and harsh active ingredients on sensitive skin.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8: BEARD & MUSTACHE TREATMENTS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'beard-mustache-treatments',
      title: 'BEARD & MUSTACHE TREATMENTS',
      content: 'Beard care is a cornerstone of modern barbering. The beard facial treatment follows a specific protocol:\n\n1. CLEANSE beard with specialized beard wash — regular shampoo strips natural oils\n2. APPLY hot towel to soften hair and open pores beneath the beard\n3. MASSAGE beard oil into the skin beneath — this prevents beardruff and itchiness\n4. COMB through to distribute product evenly from roots to tips\n5. STYLE and shape with balm or wax for hold and definition\n\nMUSTACHE GROOMING requires precision: trim with small sharp scissors when dry, apply warmed wax for hold, and condition regularly with oil to prevent skin irritation underneath.\n\nCOMMON BEARD ISSUES:\n• Beard Dandruff (Beardruff): Caused by dry skin underneath. Solution: Regular exfoliation and moisturizing with beard oil.\n• Ingrown Hairs: Hairs growing back into skin. Solution: Proper exfoliation and growth direction awareness.\n• Itchy Beard: Common in early growth stages. Solution: Keep clean, moisturize, resist scratching.\n• Patchy Growth: Uneven hair density. Solution: Proper nutrition, patience, strategic trimming to blend.\n\nBOARD EXAM ALERT: Beard care product knowledge and common issue identification appear on state board exams.',
      highlight: 'A WELL-GROOMED BEARD IS A REFLECTION OF THE BARBER WHO MAINTAINS IT',
    },

    // ═══════════════════════════════════════════
    // SECTION 9: CONTRAINDICATIONS & SAFETY
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'contraindications-safety',
      title: 'CONTRAINDICATIONS & SAFETY PROTOCOLS',
      subtitle: 'Know when to treat and when to refer',
      scenarios: [
        {
          situation: 'A client arrives for a facial massage. During consultation, you notice active cold sores (herpes simplex) around their mouth. The client says they are "just about healed" and insists on proceeding with the service.',
          options: [
            { letter: 'A', text: 'Proceed with the service but avoid the mouth area', feedback: '❌ Herpes simplex is highly contagious even in healing stages. Performing facial massage can spread the virus to other areas of the face and to you.' },
            { letter: 'B', text: 'Explain that active cold sores are a contraindication and reschedule when fully healed', feedback: '✅ Correct! Active infections including herpes simplex are absolute contraindications. Professional explanation protects both client and barber.' },
            { letter: 'C', text: 'Perform the service but wear gloves', feedback: '❌ Gloves do not prevent transmission of the herpes virus through airborne particles or contact with other facial areas.' },
            { letter: 'D', text: 'Treat the rest of the face and use extra disinfectant after', feedback: '❌ Extra disinfectant does not eliminate the risk of spreading active viral infections during the service.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'A client with diabetes requests a facial massage. They mention their doctor said massage is fine. During the service, you notice their skin seems thin and bruises easily with light pressure.',
          options: [
            { letter: 'A', text: 'Continue with normal pressure — the doctor said it was fine', feedback: '❌ Doctors may not understand the specific pressure used in facial massage. Diabetic skin often has reduced healing and increased fragility.' },
            { letter: 'B', text: 'Use extremely light pressure, avoid vigorous movements, and monitor for reactions', feedback: '✅ Correct! Diabetes is a relative contraindication. Use gentle pressure, avoid vigorous massage, and watch for adverse skin reactions.' },
            { letter: 'C', text: 'Stop the service immediately and refuse all future services', feedback: '❌ Diabetes does not prohibit all facial services — it requires modification and caution, not complete refusal.' },
            { letter: 'D', text: 'Use deeper pressure to stimulate circulation since diabetics have poor blood flow', feedback: '❌ Deeper pressure on fragile diabetic skin can cause bruising, tissue damage, and delayed healing.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 10: ABSOLUTE CONTRAINDICATIONS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'absolute-contraindications',
      title: 'ABSOLUTE CONTRAINDICATIONS — DO NOT TREAT',
      content: 'These conditions prohibit facial massage and treatment services. When in doubt, refer to a dermatologist or healthcare provider.\n\nACTIVE INFECTIONS:\n• Impetigo — highly contagious bacterial skin infection\n• Herpes simplex (cold sores) — viral, spreads through contact\n• Fungal infections (ringworm/tinea) — contagious, requires medical treatment\n• Active acne with open lesions — risk of spreading bacteria\n• Conjunctivitis (pink eye) — highly contagious, avoid entire face\n\nSKIN CONDITIONS:\n• Severe eczema or psoriasis flare-ups — skin barrier compromised\n• Sunburn or windburn — damaged skin cannot tolerate massage\n• Open wounds or cuts — risk of infection and delayed healing\n• Severe rosacea — massage can worsen inflammation\n• Dermatitis with weeping or oozing — barrier compromised\n\nMEDICAL CONDITIONS & MEDICATIONS:\n• Contagious diseases (flu, COVID-19) — protect other clients and staff\n• Undiagnosed lumps or moles — require medical evaluation first\n• Recent facial surgery — healing tissue is fragile\n• Accutane (isotretinoin) — skin is extremely thin and sensitive\n• Recent chemical peels — skin is healing and vulnerable\n• Blood thinners — increased bruising risk\n• Cancer treatment (chemotherapy/radiation) — skin is fragile and immunocompromised\n• Uncontrolled high blood pressure — massage can elevate it further\n\nRELATIVE CONTRAINDICATIONS — PROCEED WITH CAUTION:\n• Pregnancy — avoid certain essential oils and deep pressure\n• Diabetes — use gentle pressure, monitor for skin reactions\n• Epilepsy — avoid strobe lighting and strong fragrances\n• Asthma — avoid strong scents and aerosol products\n• Allergies — perform patch test before full treatment\n\nBOARD EXAM ALERT: Contraindications appear on every state board exam. Know the difference between absolute (do not treat) and relative (proceed with caution) contraindications.',
      highlight: 'WHEN IN DOUBT, REFER OUT — PROTECT THE CLIENT, PROTECT YOUR LICENSE',
    },

    // ═══════════════════════════════════════════
    // SECTION 10A: HOT TOWEL SAFETY
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'hot-towel-safety',
      title: 'HOT TOWEL SAFETY PROTOCOLS',
      content: 'Hot towels are a signature of professional barbering, but improper use can cause serious burns and liability issues. Follow these safety protocols every time.\n\nTEMPERATURE CONTROL:\n• Ideal temperature: 120-140°F (49-60°C)\n• Always test on your own wrist before applying to client\n• Use a thermometer — never guess by touch alone\n• Towels should feel hot but not scalding\n\nAPPLICATION TECHNIQUE:\n• Wring out excess water — dripping towels cause burns and mess\n• Fold towels neatly for even heat distribution\n• Apply to face gently — do not press hard\n• Check client comfort every 30 seconds\n• Remove immediately if client shows discomfort\n\nSAFETY WARNINGS:\n• Never leave a client unattended with hot towels applied\n• Do not use on clients with sensitive skin, rosacea, or sunburn\n• Avoid covering nose and mouth completely\n• Have cool water ready in case of overheating\n• Replace towels that have cooled below body temperature\n\nSANITATION:\n• Use clean, freshly laundered towels for each client\n• Do not reuse towels between clients without washing and sanitizing\n• Store clean towels in a covered, sanitized container\n\nBOARD EXAM ALERT: Hot towel safety is tested on practical exams. Know proper temperature ranges and burn prevention protocols.',
      highlight: 'A BURNED CLIENT IS A LOST CLIENT — TEMPERATURE CONTROL IS NON-NEGOTIABLE',
    },

    // ═══════════════════════════════════════════
    // SECTION 11: MEMORY REINFORCEMENT
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'memory-tricks',
      title: 'MEMORY REINFORCEMENT — NEVER FORGET',
      subtitle: 'Quick mental hooks for board exam success',
      features: [
        {
          icon: 'Brain',
          title: 'EFFLEURAGE = EASE IN, EASE OUT',
          description: 'Think: "Effleurage EASES you in and EASES you out." It is the gentle opening and closing stroke. Always start and finish with effleurage.',
        },
        {
          icon: 'Brain',
          title: 'PETRISSAGE = PRESS & KNEAD',
          description: 'Think: "Petrissage PRESSES and KNEADS like dough." It is the deep, kneading movement. The "P" reminds you of pressure and petrissage.',
        },
        {
          icon: 'Brain',
          title: 'TAPOTEMENT = TAP & PERCUSS',
          description: 'Think: "Tapotement TAPS the skin awake." The light, rhythmic tapping finishes the massage and energizes the client.',
        },
        {
          icon: 'Brain',
          title: 'FEATHERING = FINISH LIGHT',
          description: 'Think: "Feathering FINISHES LIGHT." The final, barely-there strokes leave clients feeling pampered. Always end with feathering.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 12: BOARD EXAM CRITICAL ALERTS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'board-exam-alerts',
      title: 'BOARD EXAM CRITICAL ALERTS',
      content: "These facial massage concepts appear on EVERY state board exam. Miss them, and you fail.\n\n1. Men's skin is approximately 25% thicker than women's\n2. Men produce more sebum than women\n3. Effleurage is the foundation stroke — begin and end with it\n4. Petrissage is kneading; use on jawline, avoid eye area\n5. Tapotement is tapping; invigorates but avoid inflamed skin\n6. Friction generates heat; opens pores and enhances absorption\n7. Feathering is the gentlest stroke; always end with it\n8. Double cleanse: oil-based first, water-based second\n9. Hot towels should be 120-140°F for facial treatments\n10. Clay masks absorb oil; sheet masks deliver hydration\n11. Kaolin clay is gentlest; bentonite is strongest detox\n12. Always perform patch test for sensitive skin clients\n13. Active infections are absolute contraindications — refer out\n14. Diabetes requires gentle pressure and monitoring\n15. Accutane users have extremely sensitive skin — modify treatment\n16. Know your scope — barbers do not diagnose or treat medical conditions\n17. Sanitize all tools between clients without exception\n18. Facial massage duration: 10-15 minutes for standard treatment\n19. Work from neck upward toward forehead for lymphatic drainage\n20. Beard oil goes on the SKIN beneath the beard, not just the hair\n21. Contraindications: absolute = do not treat; relative = modify and proceed with caution\n22. pH-balanced cleansers maintain the skin's acid mantle at 4.5-5.5\n23. Astringents control oil; toners balance and hydrate — know the difference\n24. Micellar water is a gentle no-rinse cleanser ideal for sensitive skin\n25. Exfoliation removes dead skin cells and prevents ingrown hairs\n26. Hyaluronic acid holds 1000x its weight in water — ultimate hydrator\n27. Salicylic acid is oil-soluble and penetrates pores for deep cleaning\n28. Vitamin C brightens skin and protects against environmental damage\n29. Ceramides restore the skin barrier and lock in moisture\n30. SPF is essential daily — UV damage is the primary cause of premature aging",
      highlight: 'MEMORIZE THESE 30 POINTS',
    },

    // ═══════════════════════════════════════════
    // SECTION 13: ACTION PROMPTS
    // ═══════════════════════════════════════════
    {
      type: 'actionPrompt',
      id: 'facial-action-items',
      title: 'GENTLEMAN\'S ATELIER ACTION ITEMS',
      subtitle: 'Do these today to level up your facial massage skills',
      prompts: [
        {
          action: 'Practice the Six Massage Movements',
          description: 'Perform effleurage, petrissage, tapotement, friction, vibration, and feathering on a practice mannequin or willing client. Focus on rhythm, pressure, and smooth transitions.',
          benefit: 'Builds muscle memory for therapeutic touch',
          timeframe: '15 minutes',
        },
        {
          action: 'Analyze Five Clients\' Skin Types',
          description: 'Examine 5 clients\' skin before their next service. Note oiliness, dryness, sensitivity, or combination patterns. Practice your diagnostic vocabulary.',
          benefit: 'Develops skin analysis precision',
          timeframe: 'During your next 5 services',
        },
        {
          action: 'Study Product Ingredients',
          description: 'Read the labels on 3 facial products in your shop. Identify the active ingredients and what skin types they benefit.',
          benefit: 'Builds product knowledge for confident recommendations',
          timeframe: '10 minutes',
        },
        {
          action: 'Perform a Complete Beard Treatment',
          description: 'Walk through the full beard protocol: cleanse, hot towel, oil massage, comb, style. Time yourself and refine your technique.',
          benefit: 'Prepares you for premium beard service pricing',
          timeframe: '20 minutes',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 14: FINAL ATELIER PLEDGE
    // ═══════════════════════════════════════════
    {
      type: 'quote',
      id: 'gentlemans-atelier-pledge',
      quote: 'I pledge to see every client\'s face as a canvas for transformation. I will analyze before I treat, respect contraindications without exception, and touch with intention and skill. I understand that the trust placed in my chair is built on knowledge, care, and results. A master barber does not just cut hair — they rejuvenate skin, restore confidence, and elevate the grooming ritual into an art form.',
    },
  ],
}

export default chapter12PremiumContent
