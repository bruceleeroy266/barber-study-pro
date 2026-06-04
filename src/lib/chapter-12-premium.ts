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
      content: 'Facial massage is not just a luxury — it is an essential service that sets professional barbers apart. In today\'s grooming landscape, clients expect more than just a haircut; they want a complete experience that leaves them looking and feeling refreshed.\n\nFor men, facial massage addresses unique concerns: thicker skin, coarser hair, and often neglected skincare routines. A proper facial treatment can transform a client\'s appearance, reduce signs of aging, and provide much-needed stress relief.\n\nMen\'s skin is approximately 25% thicker than women\'s and produces more sebum. This means facial massage techniques must be adapted for deeper pressure and oil control. Mastering these skills elevates you from a barber to a grooming specialist.\n\nTHE SCIENCE OF TOUCH: Massage movements stimulate blood circulation, which brings oxygen and nutrients to skin cells. Lymphatic drainage reduces puffiness and removes toxins. Muscle tension release smooths expression lines and relieves jaw clenching. These are not just feel-good effects — they are measurable physiological changes.\n\nBOARD EXAM ALERT: Facial massage movements, contraindications, and skin type analysis appear on every state board exam. Know them cold.',
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
          text: 'Increased blood circulation, lymphatic drainage, muscle tension release, improved skin elasticity, and reduced puffiness. The physical touch of massage creates measurable improvements in skin health.',
        },
        {
          icon: 'Leaf',
          title: 'SKIN HEALTH',
          text: 'Enhanced product absorption, exfoliation of dead skin cells, unclogged pores, reduced acne breakouts, and brighter complexion. Massage helps products penetrate deeper where they can actually work.',
        },
        {
          icon: 'Brain',
          title: 'MENTAL WELLNESS',
          text: 'Stress reduction, improved relaxation, better sleep quality, reduced anxiety, and enhanced mood. In a world of constant pressure, 15 minutes of facial massage is therapy your clients will pay for.',
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
            { text: 'BOARD EXAM ALERT: Effleurage is often tested as the primary opening and closing movement.' },
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
            { text: 'Friction generates heat through rapid movement, which opens pores and enhances product absorption.' },
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
        { text: 'STEP 2 — CLEANSING: Use the double cleanse method. First cleanse with oil-based cleanser to remove sunscreen, excess oil, and environmental pollutants. Second cleanse with water-based cleanser to deep clean pores. Use warm — not hot — water to avoid stripping natural oils.' },
        { text: 'STEP 3 — MASSAGE: Apply appropriate massage medium based on skin type. Begin with effleurage at the neck, work up to the forehead. Use petrissage on jawline, friction on temples, tapotement on cheeks. Continue for 10-15 minutes maintaining consistent pressure and rhythm. Work upward and outward to support lymphatic drainage.' },
        { text: 'STEP 4 — FINISHING: Remove excess product with warm towel. Apply cool toner to close pores. Use feathering strokes to finish. Apply moisturizer appropriate to skin type. Recommend SPF for daytime. Provide home care advice.' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 5A: SANITATION & INFECTION CONTROL
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'sanitation-infection-control',
      title: 'SANITATION & INFECTION CONTROL',
      content: 'Infection control is the foundation of every facial service. Without proper sanitation, even the most skilled massage becomes a health hazard.\n\nBEFORE EVERY SERVICE:\n• Wash hands thoroughly with antibacterial soap for at least 20 seconds\n• Sanitize all tools: brushes, combs, tweezers, and extraction tools\n• Disinfect the work surface with EPA-registered hospital-grade disinfectant\n• Use clean, fresh linens and towels for each client\n• Set up a clean barrier on the headrest and armrests\n\nDURING THE SERVICE:\n• Never double-dip into product jars — use a clean spatula or pump dispenser\n• If skin breaks during extraction, stop and apply antiseptic immediately\n• Keep your hands clean — avoid touching your face, phone, or non-sanitized surfaces\n• Use disposable gloves when dealing with acne, open skin, or any bodily fluids\n\nAFTER THE SERVICE:\n• Remove and dispose of all single-use items properly\n• Sanitize all reusable tools and place them in a clean, covered container\n• Wipe down all surfaces, including the chair, headrest, and product bottles\n• Wash hands again before greeting your next client\n\nBOARD EXAM ALERT: Sanitation violations are the fastest way to fail a state board practical exam. Know your disinfectants, contact times, and proper tool handling procedures.',
      highlight: 'SANITATION IS NOT OPTIONAL — IT IS THE FOUNDATION OF PROFESSIONAL TRUST',
    },

    // ═══════════════════════════════════════════
    // SECTION 5B: CLIENT CONSULTATION
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'client-consultation',
      title: 'THE CLIENT CONSULTATION',
      content: 'Every professional facial service begins with a thorough consultation. This is your opportunity to build trust, gather critical information, and set realistic expectations.\n\nTHE CONSULTATION CHECKLIST:\n• Ask about skin concerns: acne, dryness, sensitivity, aging, or oiliness\n• Inquire about allergies to common ingredients: fragrances, nuts, essential oils\n• Review current skincare routine and products used\n• Ask about medications: Accutane, Retin-A, blood thinners, or antibiotics\n• Check for recent procedures: chemical peels, laser treatments, or facial surgery\n• Identify lifestyle factors: sun exposure, smoking, stress levels, hydration habits\n• Discuss desired outcomes and set realistic expectations\n• Explain the procedure, products, and aftercare before beginning\n\nRED FLAGS DURING CONSULTATION:\n• Active cold sores or skin infections — reschedule\n• Severe sunburn or windburn — wait for healing\n• Undiagnosed lumps or changing moles — refer to dermatologist\n• Client on Accutane — modify treatment significantly or refer\n• Recent facial surgery — require doctor clearance\n\nDOCUMENTATION: Keep written records of client consultations, skin assessments, products used, and any reactions. This protects both you and the client.',
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
          description: 'Absorb excess oil and draw out impurities. Kaolin for sensitive skin, bentonite for powerful detox, rhassoul for mineral-rich treatment. Perfect for oily and combination skin.',
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
          description: 'Classic barber tradition. Steaming towels open pores, soften beard hair, and prepare skin for shaving. Heat to 120-140°F, apply essential oils optionally, wrap face for 3-5 minutes.',
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
            { label: 'EXFOLIATING TONERS', description: 'Contain AHAs or BHAs to gently dissolve dead skin cells. Improve texture and prevent clogged pores. Use with caution on sensitive skin.' },
            { label: 'BALANCING TONERS', description: 'Restore skin\'s natural pH after cleansing. Prepare skin to absorb serums and moisturizers more effectively.' },
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
            { label: 'ALCOHOL-BASED ASTRINGENTS', description: 'High alcohol content tightens pores and removes oil. Effective for very oily skin but can over-dry and irritate sensitive skin.' },
            { label: 'WITCH HAZEL', description: 'Natural astringent from the witch hazel plant. Gentler than alcohol-based options. Reduces inflammation and controls oil.' },
            { label: 'SALICYLIC ACID ASTRINGENTS', description: 'Beta-hydroxy acid penetrates oil to clean pores from within. Excellent for acne-prone and oily skin types.' },
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
            { text: 'Salicylic acid penetrates oil to clean pores from within.' },
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
