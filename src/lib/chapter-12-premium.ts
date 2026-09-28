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
      content: "Beard and mustache grooming can include cleansing, comfortable warm-towel service, application of cosmetic beard products, combing, trimming, and styling. Select products according to the client's skin and hair observations and the manufacturer directions.\n\nDo not present beard products as treatments for medical skin conditions or guarantee prevention of ingrown hairs, irritation, or other disorders. If the skin beneath the beard shows a condition that makes service unsafe or appears outside cosmetic-service scope, defer that part of the service and recommend appropriate evaluation.\n\nSTUDY FOCUS: Know safe product handling, client consultation, grooming sequence, and the difference between cosmetic maintenance and medical treatment.",
      highlight: "COSMETIC GROOMING — CLIENT COMFORT — SAFE PRODUCT USE",
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
            { letter: 'A', text: 'Proceed with the service but avoid the mouth area', feedback: '❌ An active or potentially contagious facial condition is a service-safety concern; working around one area does not resolve the broader contact risk.' },
            { letter: 'B', text: 'Explain that the visible active condition makes the facial service inappropriate today and defer the service', feedback: '✅ Correct. Defer a facial service when an active or potentially contagious condition makes contact unsafe, without diagnosing or prescribing.' },
            { letter: 'C', text: 'Perform the service but wear gloves', feedback: '❌ Protective equipment does not make an otherwise inappropriate facial service automatically safe.' },
            { letter: 'D', text: 'Treat the rest of the face and use extra disinfectant after', feedback: '❌ Cleaning and disinfection after service do not replace the decision to avoid an unsafe service in the first place.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'During consultation, a client reports a health condition and recent medication change that may affect skin sensitivity. The barber cannot determine from the consultation whether the planned facial service is appropriate.',
          options: [
            { letter: 'A', text: 'Proceed normally because the client requested the service', feedback: '❌ Client preference does not remove the barber\'s responsibility to make a safe service decision within scope.' },
            { letter: 'B', text: 'Diagnose the condition and choose a treatment based on the diagnosis', feedback: '❌ Medical diagnosis and treatment selection are outside barbering scope.' },
            { letter: 'C', text: 'Defer or modify the service only when safe guidance is clear, and recommend appropriate professional evaluation when safety is uncertain', feedback: '✅ Correct. The barber should stay within cosmetic-service scope, use available product/device guidance, and defer when safety cannot be established.' },
            { letter: 'D', text: 'Use deeper pressure to test how the skin responds', feedback: '❌ Testing a questionable condition with more aggressive service increases risk and is not an appropriate safety strategy.' },
          ],
          correctAnswer: 'C',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 10: ABSOLUTE CONTRAINDICATIONS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'absolute-contraindications',
      title: 'SERVICE CONTRAINDICATIONS & REFERRAL BOUNDARIES',
      content: "Contraindications are conditions or findings that can make a planned facial service inappropriate, require modification, or require the barber to defer service. The Chapter 12 repository source emphasizes consultation, active or contagious conditions, open wounds or abrasions, recent procedures, client discomfort, equipment safety, and referral boundaries.\n\nDO NOT DIAGNOSE: A barber may describe observable findings and make a cosmetic service-safety decision, but should not diagnose disease, prescribe treatment, or interpret a medication or medical condition.\n\nDEFER OR MODIFY THE SERVICE WHEN:\n• The skin has an active or potentially contagious condition, open wound, significant irritation, or other finding that makes contact unsafe\n• A recent procedure, health condition, medication, or provider instruction creates uncertainty about whether the planned service is appropriate\n• A product or device label lists a contraindication that applies to the client\n• The client reports pain, burning, dizziness, discomfort, or asks to stop\n\nWhen a concern is outside routine cosmetic service or the barber cannot determine safe service within scope, defer and recommend appropriate professional evaluation. Follow manufacturer directions and applicable state/local rules rather than memorizing a universal medical-condition list.\n\nSTUDY FOCUS: Know the difference between observing a contraindication, modifying or stopping a cosmetic service, and making a medical diagnosis.",
      highlight: "OBSERVE — STOP OR MODIFY WHEN UNSAFE — REFER WITHOUT DIAGNOSING",
    },

    // ═══════════════════════════════════════════
    // SECTION 10A: HOT TOWEL SAFETY
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'hot-towel-safety',
      title: 'HOT TOWEL SAFETY PROTOCOLS',
      content: "Hot towels are a traditional barbering service step, but excessive heat can injure a client. Use clean towels, follow applicable shop/equipment guidance, and verify comfort before and during application.\n\nTEMPERATURE & APPLICATION:\n• Use a comfortably warm towel rather than relying on a universal temperature number\n• Check the towel safely before facial application and never apply a towel that feels scalding\n• Keep the nose and mouth unobstructed\n• Use light placement rather than pressure\n• Monitor the client continuously and remove the towel immediately if discomfort occurs\n\nSERVICE SAFETY:\n• Do not use heat on skin that is irritated, injured, or otherwise unsuitable for the planned service\n• Do not leave the client unattended while heat is applied\n• Follow manufacturer directions and applicable rules for towel-heating equipment\n\nSANITATION:\n• Use clean towels for each client\n• Handle used linens separately from clean supplies\n• Launder and store towels according to shop procedures and applicable rules\n\nSTUDY FOCUS: Heat safety depends on client comfort, clean handling, manufacturer directions, and stopping immediately when the service becomes unsafe.",
      highlight: "COMFORTABLE WARMTH — CLEAR AIRWAY — CONTINUOUS MONITORING",
    },

    // ═══════════════════════════════════════════
    // SECTION 11: MEMORY REINFORCEMENT
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'memory-tricks',
      title: 'MEMORY REINFORCEMENT — NEVER FORGET',
      subtitle: 'Quick mental hooks for Chapter 12 review',
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
      title: 'CORE CHAPTER 12 REVIEW',
      content: "Use this section as a chapter review, not as a prediction of any specific licensing exam. Exam content varies by jurisdiction and provider.\n\n1. Identify facial muscles, nerves, arteries, and veins relevant to service\n2. Differentiate effleurage, petrissage, friction, tapotement, vibration, and feathering\n3. Apply controlled pressure, rhythm, direction, and client-comfort checks\n4. Use consultation and observation before selecting a cosmetic facial service\n5. Match cosmetic products to observable skin needs and manufacturer directions\n6. Keep sanitation and contamination prevention active throughout the service\n7. Recognize findings that make a service unsafe or require modification\n8. Stop or defer service when a contraindication is present\n9. Keep diagnosis, prescribing, and medical treatment outside barbering scope\n10. Follow device and product instructions instead of assuming universal settings\n11. Use steam, heat, towels, electrical devices, and other modalities only within safe operating guidance\n12. Document relevant consultation findings, products, service decisions, and reactions\n13. Maintain client comfort, communication, and professional boundaries\n14. Distinguish cosmetic maintenance from medical care\n15. Refer appropriately when a concern is outside routine cosmetic service\n\nThe Chapter 12 repository source supports these subject areas. C12-2 does not claim that every item appears on every state board exam or independently verify a current licensing blueprint.",
      highlight: "SOURCE-COVERED CONCEPTS — NO UNIVERSAL EXAM CLAIMS",
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
          benefit: 'Builds consistency in cosmetic massage technique',
          timeframe: '15 minutes',
        },
        {
          action: 'Analyze Five Clients\' Skin Types',
          description: 'Observe 5 clients\' skin before their next service. Note cosmetic patterns such as oiliness, dryness, sensitivity, or combination areas. Practice clear observation vocabulary without diagnosing.',
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
      quote: 'I will approach every facial service with careful observation, client communication, sanitation, controlled technique, and respect for contraindications. I will keep cosmetic service separate from medical diagnosis or treatment and will defer or refer when a concern is outside my scope. Professional trust is built through safe decisions, clear boundaries, and consistent care.',
    },
  ],
}

export default chapter12PremiumContent
