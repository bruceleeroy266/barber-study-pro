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
    // ═══════════════════════════════════════════
    // SECTION 1: WELCOME TO THE TREATMENT SANCTUARY
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'treatment-sanctuary-welcome',
      title: '🌿 WELCOME TO THE TREATMENT SANCTUARY',
      content: 'Every client who sits in your chair carries more than hair — they carry stress, dryness, damage, and the daily wear of life. The Treatment Sanctuary is where science meets soul. Where therapeutic touch transforms not just hair, but how clients feel about themselves.\n\nThis chapter transforms you into a Healing Practitioner. You will learn to diagnose scalp conditions with precision, select treatments with scientific reasoning, perform therapeutic massage with skill, and guide clients toward lasting hair health. The client who trusts you with their scalp is trusting you with their comfort, their confidence, and their self-care ritual.\n\nBOARD EXAM ALERT: Treatment knowledge appears on every state board exam. Understanding when to treat, when to refer, and how to perform services safely separates licensed professionals from amateurs.',
      highlight: 'DIAGNOSE WITH PRECISION — TREAT WITH SCIENCE — HEAL WITH TOUCH',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: WHY TREATMENT MATTERS
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'why-treatment-matters',
      title: 'WHY THE TREATMENT SANCTUARY MATTERS',
      subtitle: 'Four reasons treatment mastery separates healers from haircutters',
      cards: [
        {
          icon: 'Heart',
          title: 'CLIENT HEALTH & COMFORT',
          text: 'Healthy hair begins at the scalp. When clients experience itching, flaking, or irritation, it affects their daily comfort and confidence. As a barber, you provide relief and improve quality of life through proper treatment.',
        },
        {
          icon: 'Sparkles',
          title: 'HAIR APPEARANCE & MANAGEABILITY',
          text: 'Treated hair looks better, feels softer, and styles more easily. Scalp treatments remove buildup that weighs hair down, allowing natural movement and shine to come through.',
        },
        {
          icon: 'DollarSign',
          title: 'PROFESSIONAL REVENUE',
          text: 'Treatment services represent additional income streams. Clients who understand scalp health become repeat customers for maintenance treatments and retail product purchases.',
        },
        {
          icon: 'Search',
          title: 'EARLY PROBLEM DETECTION',
          text: 'Regular scalp examination helps identify conditions before they worsen. Barbers often spot issues clients have not noticed, enabling early intervention and referrals when needed.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: TREATMENT PRACTITIONER LEVELS
    // ═══════════════════════════════════════════
    {
      type: 'levelUp',
      id: 'treatment-certification',
      title: '🌿 TREATMENT PRACTITIONER CERTIFICATION',
      subtitle: 'Progress from Observer to Master Healer — earn your therapeutic credentials',
      levels: [
        {
          level: 'Level 1',
          title: 'Treatment Observer',
          description: 'You know the basics: types of scalp treatments, when to use them, and basic massage techniques. You can perform a standard conditioning treatment.',
          reward: 'Safe Service Badge — Clients trust your careful pre-service checks',
        },
        {
          level: 'Level 2',
          title: 'Scalp Analyst',
          description: 'You can identify dry, oily, and normal scalp conditions. You understand product ingredients and match treatments to client needs. You perform basic scalp massage with confidence.',
          reward: 'Product Matchmaker — Your treatment recommendations are consistently effective',
        },
        {
          level: 'Level 3',
          title: 'Therapeutic Specialist',
          description: 'You recognize scalp disorders that require treatment vs. those requiring referral. You perform advanced massage techniques and understand contraindications.',
          reward: 'Healing Hands — Clients seek you out for therapeutic relief',
        },
        {
          level: 'Level 4',
          title: 'Wellness Counselor',
          description: 'You guide clients through complete hair wellness programs. You understand the connection between lifestyle, nutrition, and scalp health. You retail products with authority.',
          reward: 'Trusted Advisor — Clients follow your home care recommendations religiously',
        },
        {
          level: 'Level 5',
          title: 'Master Healer',
          description: 'You command complete knowledge of therapeutic treatments, scalp health, and client wellness. Other barbers consult you. You elevate the entire profession through healing.',
          reward: 'Sanctuary Master — Your treatment expertise is recognized and respected',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 4: TYPES OF SCALP TREATMENTS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'scalp-treatment-types',
      title: 'SCALP TREATMENT TYPES — THE HEALING ARSENAL',
      subtitle: 'Match the treatment to the condition — precision healing starts here',
      tabs: [
        {
          id: 'moisturizing',
          label: 'MOISTURIZING',
          title: 'MOISTURIZING TREATMENTS — RESTORE HYDRATION',
          bullets: [
            { label: 'PURPOSE', description: 'Restore hydration balance to parched scalp tissue and relieve tightness or itching caused by dryness' },
            { label: 'KEY INGREDIENTS', description: 'Aloe vera, glycerin, hyaluronic acid, natural oils (jojoba, coconut, argan), shea butter' },
            { label: 'APPLICATION', description: 'Apply to clean scalp, massage gently, leave for 10-15 minutes under warm towel or steamer. Rinse thoroughly.' },
            { label: 'CLIENT TYPE', description: 'Clients with dry, tight, or flaky scalps; those in cold climates; frequent heat tool users' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Moisturizing treatments add moisture; conditioning treatments restore pH balance. Know the difference.' },
            { text: 'Dry scalp lacks moisture. Dandruff is caused by fungus. Treating dandruff with moisturizer alone will not solve the problem.' },
          ],
        },
        {
          id: 'clarifying',
          label: 'CLARIFYING',
          title: 'CLARIFYING TREATMENTS — REMOVE BUILDUP',
          bullets: [
            { label: 'PURPOSE', description: 'Remove accumulated product residue, excess oil, hard water minerals, and environmental pollutants from the scalp' },
            { label: 'KEY INGREDIENTS', description: 'Apple cider vinegar, salicylic acid, tea tree oil, citrus extracts, activated charcoal' },
            { label: 'APPLICATION', description: 'Use BEFORE other treatments to ensure maximum penetration. Massage into scalp, leave 3-5 minutes, rinse with warm water.' },
            { label: 'CLIENT TYPE', description: 'Clients with oily scalps, heavy product users, swimmers, those in hard water areas' },
          ],
          facts: [
            { text: 'Always follow clarifying treatments with conditioner on HAIR ONLY — not scalp. The scalp is now clean; adding conditioner there creates new buildup.' },
            { text: 'Over-clarifying strips natural oils. Recommend clarifying no more than once every 1-2 weeks for most clients.' },
          ],
        },
        {
          id: 'stimulating',
          label: 'STIMULATING',
          title: 'STIMULATING TREATMENTS — AWAKEN FOLLICLES',
          bullets: [
            { label: 'PURPOSE', description: 'Increase blood flow to hair follicles, encouraging healthy growth and awakening dormant follicles' },
            { label: 'KEY INGREDIENTS', description: 'Peppermint oil, rosemary extract, biotin, caffeine, niacin (vitamin B3), eucalyptus' },
            { label: 'APPLICATION', description: 'Apply to scalp using fingertips or applicator brush. Massage vigorously for 5-10 minutes to generate heat and tingling.' },
            { label: 'CLIENT TYPE', description: 'Clients with thinning hair, slow growth, or those seeking to maintain healthy growth patterns' },
          ],
          facts: [
            { text: 'The tingling sensation from stimulating treatments is increased blood circulation — a good sign the treatment is working.' },
            { text: 'BOARD EXAM ALERT: Scalp massage during stimulating treatments enhances effectiveness by 40% through increased circulation.' },
          ],
        },
        {
          id: 'dandruff',
          label: 'DANDRUFF CONTROL',
          title: 'DANDRUFF CONTROL TREATMENTS — BALANCE THE SCALP',
          bullets: [
            { label: 'PURPOSE', description: 'Control Malassezia yeast overgrowth, reduce inflammation, and normalize skin cell turnover rate' },
            { label: 'KEY INGREDIENTS', description: 'Pyrithione zinc, ketoconazole, selenium sulfide, coal tar, salicylic acid, sulfur' },
            { label: 'APPLICATION', description: 'Apply to affected areas, massage gently, leave for 3-5 minutes (or as directed). Use 2-3 times weekly until controlled.' },
            { label: 'CLIENT TYPE', description: 'Clients with visible flaking, itching, redness, or diagnosed dandruff/seborrheic dermatitis' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Dandruff is caused by Malassezia fungus — NOT dry scalp. Moisturizers alone will not treat dandruff.' },
            { text: 'After dandruff is controlled, clients should continue weekly maintenance treatments to prevent recurrence.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 5: TYPES OF HAIR TREATMENTS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'hair-treatment-types',
      title: 'HAIR TREATMENT TYPES — RESTORE & PROTECT',
      subtitle: 'Six essential treatments every barber must master',
      features: [
        {
          icon: 'Droplets',
          title: 'DEEP CONDITIONING',
          description: 'Intensive moisture treatment that penetrates the hair shaft to repair damage, improve elasticity, and restore softness. Ideal for dry, brittle, or chemically treated hair.',
        },
        {
          icon: 'Shield',
          title: 'PROTEIN RECONSTRUCTION',
          description: 'Strengthens hair by depositing hydrolyzed proteins that fill gaps in the cuticle layer. Essential for severely damaged, over-processed, or breaking hair. Use sparingly to avoid protein overload.',
        },
        {
          icon: 'Flame',
          title: 'HOT OIL TREATMENTS',
          description: 'Warm oil penetrates the cuticle to lubricate, seal in moisture, and add shine. Excellent for natural hair, protective styles, and preventing breakage. Oils include coconut, olive, and argan.',
        },
        {
          icon: 'Link',
          title: 'BOND BUILDERS',
          description: 'Advanced treatments that repair disulfide bonds broken during chemical services. Can be added to color or lightening formulas or used as standalone treatments to prevent and reverse damage.',
        },
        {
          icon: 'Wind',
          title: 'KERATIN SMOOTHING',
          description: 'Semi-permanent treatment that coats the hair with keratin protein to reduce frizz, increase manageability, and create a smooth, shiny finish. Results last 2-4 months with proper care.',
        },
        {
          icon: 'Sun',
          title: 'COLOR-PROTECTING TREATMENTS',
          description: 'Specially formulated to seal the cuticle after color services, lock in pigment molecules, and prevent fading. Often contain UV filters and antioxidants to maintain vibrancy.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 6: PRODUCT SELECTION SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'product-selection-system',
      title: 'THE ANALYSIS-TO-TREATMENT SYSTEM',
      content: 'Before every treatment, you must become a detective. The client\'s hair and scalp tell a story — of genetics, habits, environment, and history. Your job is to read that story and prescribe the right solution.\n\nTHE FOUR-STEP ANALYSIS:\n1. VISUAL EXAM — Look for shine, damage, breakage patterns, scalp color, and flaking\n2. TOUCH TEST — Feel texture, thickness, elasticity, and porosity\n3. WET ASSESSMENT — Observe how hair behaves when wet: curl pattern, stretch, and strength\n4. SCALP CHECK — Identify oiliness, dryness, lesions, or conditions\n\nBOARD EXAM ALERT: Always perform scalp analysis BEFORE any treatment service. Contagious conditions, open lesions, or severe inflammation are contraindications — refer to a physician.',
      highlight: 'ANALYZE FIRST — TREAT SECOND — ALWAYS PROTECT THE CLIENT',
    },

    // ═══════════════════════════════════════════
    // SECTION 7: TREATMENT MATCHING SCENARIOS
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'treatment-matching-scenarios',
      title: 'TREATMENT MATCHING CHALLENGES',
      subtitle: 'Real shop situations that test your diagnostic instincts',
      scenarios: [
        {
          situation: 'A client sits down and you notice their scalp is visibly flaky with white scales. They mention it has been itchy for weeks. They use a cheap drugstore shampoo daily. This is a common scenario. The client likely has dandruff (pityriasis) caused by Malassezia fungus overgrowth.',
          options: [
            { letter: 'A', text: 'Recommend a moisturizing treatment and tell them to shampoo less often', feedback: '❌ Moisturizing alone will not treat fungal dandruff. Shampooing less could make it worse by allowing oil buildup that feeds the fungus.' },
            { letter: 'B', text: 'Recommend an anti-dandruff treatment with pyrithione zinc or ketoconazole, explain the fungal cause, and suggest 2-3x weekly use', feedback: '✅ Correct! Dandruff is fungal — it requires antifungal ingredients. Education about the cause builds client trust and compliance.' },
            { letter: 'C', text: 'Tell them it is just dry scalp and recommend hot oil treatments', feedback: '❌ Dry scalp and dandruff are different conditions. Misdiagnosis leads to ineffective treatment and frustrated clients.' },
            { letter: 'D', text: 'Perform the service without mentioning it to avoid embarrassment', feedback: '❌ Ignoring a scalp condition is unprofessional and potentially harmful. Clients appreciate honest, caring guidance.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'A client with color-treated hair complains their color fades within two weeks. Their hair feels rough and looks dull. They shampoo daily with hot water. Color fading is often caused by cuticle damage and improper home care. The rough, dull texture confirms cuticle compromise.',
          options: [
            { letter: 'A', text: 'Recommend they color their hair less often', feedback: '❌ While coloring less helps, it does not address the immediate problem of cuticle damage and fading.' },
            { letter: 'B', text: 'Recommend a color-protecting treatment, sulfate-free shampoo, cool water rinses, and UV protection spray', feedback: '✅ Correct! A complete system approach addresses all causes: cuticle sealing, gentle cleansing, temperature, and sun protection.' },
            { letter: 'C', text: 'Tell them fading is normal and unavoidable with color-treated hair', feedback: '❌ While some fading is normal, dramatic fading in two weeks indicates preventable damage. Professionals offer solutions, not excuses.' },
            { letter: 'D', text: 'Sell them the most expensive products without explanation', feedback: '❌ Selling without educating feels pushy. Clients who understand WHY products work become loyal customers.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8: TREATMENT PROCEDURE
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'treatment-procedure',
      title: 'THE FIVE-STEP TREATMENT PROTOCOL',
      subtitle: 'Follow this sequence for every therapeutic service',
      items: [
        { text: 'STEP 1 — CONSULTATION & ANALYSIS: Begin with thorough hair and scalp analysis. Ask about allergies, sensitivities, previous chemical services, and current home care routine. Document findings.' },
        { text: 'STEP 2 — SHAMPOO & PREP: Shampoo with appropriate cleanser for scalp condition. Use clarifying shampoo for buildup, moisturizing for dryness. Rinse thoroughly with warm water. Towel dry before treatment application.' },
        { text: 'STEP 3 — APPLICATION: Section hair into 4-6 parts. Apply treatment product directly to scalp (scalp treatments) or from roots to ends (hair treatments). Use applicator brush or fingertips for even distribution.' },
        { text: 'STEP 4 — PROCESSING: Cover with plastic cap and warm towel, or place under hood dryer/steamer for 10-20 minutes depending on product instructions. Heat opens cuticle and enhances penetration. Monitor for adverse reactions.' },
        { text: 'STEP 5 — RINSE & STYLE: Rinse thoroughly with cool to lukewarm water. Cool water seals the cuticle. Apply conditioner if needed (avoid scalp for oily conditions). Towel dry, detangle gently, and proceed with styling.' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 9: MASSAGE TECHNIQUES
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'massage-techniques',
      title: 'MASSAGE TECHNIQUES — THE HEALING TOUCH',
      subtitle: 'Four essential movements every therapeutic barber must master',
      tabs: [
        {
          id: 'effleurage',
          label: 'EFFLEURAGE',
          title: 'EFFLEURAGE — THE WARM-UP STROKE',
          bullets: [
            { label: 'MOVEMENT', description: 'Long, smooth, gliding movements using palms and fingertips' },
            { label: 'PURPOSE', description: 'To relax the client, spread product evenly, and prepare the scalp for deeper work' },
            { label: 'PRESSURE', description: 'Light to medium — soothing and rhythmic' },
            { label: 'WHEN TO USE', description: 'Always begin with effleurage to warm up the scalp and relax the client' },
          ],
          facts: [
            { text: 'Effleurage increases blood flow gradually without shocking the tissue.' },
            { text: 'This is the "hello" of scalp massage — it sets the tone for the entire service.' },
          ],
        },
        {
          id: 'petrissage',
          label: 'PETRISSAGE',
          title: 'PETRISSAGE — THE DEEP WORK',
          bullets: [
            { label: 'MOVEMENT', description: 'Circular pressure and lifting motions with fingertips and thumb pads' },
            { label: 'PURPOSE', description: 'To stimulate circulation deeply, loosen tension, and enhance product penetration' },
            { label: 'PRESSURE', description: 'Medium to firm — kneading and rhythmic' },
            { label: 'WHEN TO USE', description: 'After effleurage, when the scalp is warmed up and ready for deeper stimulation' },
          ],
          facts: [
            { text: 'Petrissage is the most effective technique for increasing blood flow to follicles.' },
            { text: 'BOARD EXAM ALERT: Petrissage is often tested as the primary stimulating massage movement.' },
          ],
        },
        {
          id: 'friction',
          label: 'FRICTION',
          title: 'FRICTION — THE HEAT GENERATOR',
          bullets: [
            { label: 'MOVEMENT', description: 'Small circular movements using fingertips or pads of fingers' },
            { label: 'PURPOSE', description: 'To create heat, stimulate nerve endings, and awaken dormant follicles' },
            { label: 'PRESSURE', description: 'Firm and focused — concentrated on specific areas' },
            { label: 'WHEN TO USE', description: 'On areas needing extra stimulation, such as thinning spots or tension points' },
          ],
          facts: [
            { text: 'Friction generates heat through rapid movement, which opens pores and enhances absorption.' },
            { text: 'Use caution on sensitive scalps — friction can irritate if too vigorous.' },
          ],
        },
        {
          id: 'tapotement',
          label: 'TAPOTEMENT',
          title: 'TAPOTEMENT — THE AWAKENING',
          bullets: [
            { label: 'MOVEMENT', description: 'Light, rapid tapping with fingertips or cupped hands' },
            { label: 'PURPOSE', description: 'To invigorate the scalp, awaken nerve endings, and create a refreshing finish' },
            { label: 'PRESSURE', description: 'Light and rhythmic — percussive but gentle' },
            { label: 'WHEN TO USE', description: 'At the end of massage to energize the client and signal completion' },
          ],
          facts: [
            { text: 'Tapotement is the "good morning" stroke — it leaves clients feeling alert and refreshed.' },
            { text: 'Never use tapotement on inflamed or irritated scalps. It can worsen inflammation.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 10: MASSAGE BENEFITS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'massage-benefits',
      title: 'BENEFITS OF SCALP MASSAGE',
      subtitle: 'Why therapeutic touch transforms both hair and client experience',
      features: [
        {
          icon: 'Heart',
          title: 'INCREASES CIRCULATION',
          description: 'Blood flow to hair follicles increases by up to 40% during proper scalp massage. More blood means more oxygen, more nutrients, and healthier growth.',
        },
        {
          icon: 'Droplets',
          title: 'DISTRIBUTES NATURAL OILS',
          description: 'Massage spreads sebum from the scalp down the hair shaft, providing natural conditioning and protection. This is especially important for dry or curly hair types.',
        },
        {
          icon: 'Zap',
          title: 'ENHANCES PRODUCT PENETRATION',
          description: 'The warmth and increased circulation from massage open the cuticle and allow treatment products to penetrate deeper into the cortex where they can actually repair damage.',
        },
        {
          icon: 'Smile',
          title: 'RELIEVES TENSION & STRESS',
          description: 'Scalp massage triggers the release of endorphins and serotonin — natural mood boosters. Clients leave feeling not just looking better, but feeling better too.',
        },
        {
          icon: 'Recycle',
          title: 'EXFOLIATES THE SCALP',
          description: 'Gentle massage loosens dead skin cells and buildup, preventing clogged follicles and creating a healthier environment for hair growth.',
        },
        {
          icon: 'Crown',
          title: 'CREATES LUXURY EXPERIENCE',
          description: 'In a world of rushed services, a therapeutic scalp massage sets you apart. Clients remember how you made them feel — and they come back for it.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 11: HOME CARE RECOMMENDATIONS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'home-care-system',
      title: 'THE HOME CARE SYSTEM',
      content: 'Professional treatments deliver immediate results, but home maintenance determines long-term success. Your role as a Healing Practitioner extends beyond the chair — you must educate clients on how to care for their hair between visits.\n\nTHE FOUR PILLARS OF HOME CARE:\n\nCLEANSING ROUTINE: Shampoo frequency based on scalp type. Use lukewarm water, not hot. Focus shampoo on scalp, not ends. Rinse thoroughly to prevent buildup.\n\nCONDITIONING HABITS: Condition after every shampoo. Apply from mid-lengths to ends. Leave in 2-3 minutes minimum. Use deep conditioner weekly for dry or damaged hair.\n\nPROTECTION PRACTICES: Use heat protectant before styling. Wear a hat in direct sun. Rinse hair after swimming. Sleep on silk or satin pillowcase to reduce friction.\n\nMAINTENANCE SCHEDULE: Daily — gentle brushing and scalp massage. Weekly — deep conditioning or clarifying treatment. Monthly — protein treatment and trim. Quarterly — professional salon treatment and product review.\n\nBOARD EXAM ALERT: Client education is part of the barber\'s professional responsibility. Recommending appropriate home care demonstrates competence and builds client trust.',
      highlight: 'EDUCATE — EMPOWER — BUILD LASTING RESULTS',
    },

    // ═══════════════════════════════════════════
    // SECTION 12: RETAIL PRODUCT SALES
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'retail-sales-mastery',
      title: 'RETAIL SALES — THE CONSULTATION CONNECTION',
      subtitle: 'Every service is a sales opportunity when done with integrity',
      cards: [
        {
          icon: 'BookOpen',
          title: 'EDUCATE, DO NOT PUSH',
          text: 'Explain why the product helps their specific concern. Knowledge builds confidence in the purchase. When clients understand the science, they buy with conviction.',
        },
        {
          icon: 'Hand',
          title: 'LET THEM EXPERIENCE IT',
          text: 'Use products during service. When clients feel and smell the difference, they want to take it home. Experience sells better than explanation.',
        },
        {
          icon: 'Target',
          title: 'MAKE SPECIFIC RECOMMENDATIONS',
          text: 'Do not ask "Do you want shampoo?" Say "I am using our moisturizing line on you today — it is perfect for your dry scalp." Specificity shows expertise.',
        },
        {
          icon: 'Package',
          title: 'CREATE SYSTEMS, NOT SINGLE SALES',
          text: 'Recommend complete systems (shampoo + conditioner + treatment) rather than single items. Systems create better results and higher ticket averages.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 13: COMMON CONFUSIONS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'common-confusions',
      title: 'COMMON TREATMENT CONFUSIONS',
      content: 'Even experienced barbers confuse these concepts. Master the distinctions to avoid misdiagnosis and ineffective treatments.\n\nDRY SCALP vs. DANDRUFF: Dry scalp is caused by lack of moisture — flakes are small, white, and dry. Dandruff is caused by Malassezia fungus — flakes are larger, yellowish, and oily. Treat dry scalp with moisturizers; treat dandruff with antifungal ingredients.\n\nMOISTURIZING vs. CONDITIONING: Moisturizing treatments ADD moisture to dry hair and scalp. Conditioning treatments RESTORE pH balance and smooth the cuticle after chemical services. They work together but serve different purposes.\n\nPROTEIN vs. MOISTURE: Protein strengthens hair by filling gaps in the cuticle. Moisture softens hair by hydrating the cortex. Too much protein makes hair stiff and brittle (protein overload). Too much moisture makes hair limp and weak (hygral fatigue). Balance is key.\n\nCLARIFYING vs. REGULAR SHAMPOO: Clarifying shampoo removes buildup, minerals, and residue. Regular shampoo cleanses surface oil and dirt. Clarifying is too strong for daily use — it strips natural oils. Use it only when buildup is present.\n\nBOARD EXAM ALERT: These distinctions appear on nearly every state board exam. Know them cold.',
      highlight: 'DIAGNOSE CORRECTLY — TREAT APPROPRIATELY — NEVER GUESS',
    },

    // ═══════════════════════════════════════════
    // SECTION 14: MEMORY REINFORCEMENT
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'memory-tricks',
      title: 'MEMORY REINFORCEMENT — NEVER FORGET',
      subtitle: 'Quick mental hooks for board exam success',
      features: [
        {
          icon: 'Brain',
          title: 'EFFLEURAGE = EASE IN',
          description: 'Think: "Effleurage EASES you in." It is the gentle, gliding warm-up stroke. Always start with effleurage to relax the client before deeper work.',
        },
        {
          icon: 'Brain',
          title: 'PETRISSAGE = PRESS DEEP',
          description: 'Think: "Petrissage PRESSES deep." It is the kneading, circular pressure stroke. The "P" in both words reminds you it is the primary stimulating technique.',
        },
        {
          icon: 'Brain',
          title: 'FRICTION = FIRE UP',
          description: 'Think: "Friction creates FIRE." The rapid circular movement generates heat. Use it to "fire up" circulation in problem areas.',
        },
        {
          icon: 'Brain',
          title: 'TAPOTEMENT = TAP OUT',
          description: 'Think: "Tapotement TAPS it out." The light tapping finishes the massage and wakes up the client. It is the "tap out" signal that the service is complete.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 15: BOARD EXAM CRITICAL ALERTS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'board-exam-alerts',
      title: 'BOARD EXAM CRITICAL ALERTS',
      content: 'These treatment concepts appear on EVERY state board exam. Miss them, and you fail.\n\n1. Always perform scalp analysis BEFORE treatment services\n2. Contagious conditions are contraindications — refer to physician\n3. Dandruff is fungal (Malassezia), not dry scalp\n4. Moisturizing adds moisture; conditioning restores pH\n5. Protein strengthens; moisture softens — balance both\n6. Clarifying removes buildup; regular shampoo cleanses surface\n7. Cool water seals the cuticle; hot water opens it\n8. Scalp massage increases circulation by up to 40%\n9. Petrissage is the primary stimulating massage movement\n10. Client education is part of professional responsibility\n11. Never diagnose — recognize, treat within scope, refer when needed\n12. Document all treatments and recommendations\n13. Patch test new products 24-48 hours before full application\n14. Heat enhances product penetration during processing\n15. Retail recommendations should be specific, not generic',
      highlight: 'MEMORIZE THESE 15 POINTS',
    },

    // ═══════════════════════════════════════════
    // SECTION 16: ACTION PROMPTS
    // ═══════════════════════════════════════════
    {
      type: 'actionPrompt',
      id: 'treatment-action-items',
      title: 'TREATMENT SANCTUARY ACTION ITEMS',
      subtitle: 'Do these today to level up your therapeutic skills',
      prompts: [
        {
          action: 'Practice the Four Massage Strokes',
          description: 'Perform effleurage, petrissage, friction, and tapotement on a practice mannequin or willing client. Focus on rhythm, pressure, and smooth transitions.',
          benefit: 'Builds muscle memory for therapeutic touch',
          timeframe: '15 minutes',
        },
        {
          action: 'Analyze Five Scalps',
          description: 'Examine 5 clients\' scalps before their next service. Note oiliness, dryness, flaking, or conditions. Practice your diagnostic vocabulary.',
          benefit: 'Develops diagnostic precision',
          timeframe: 'During your next 5 haircuts',
        },
        {
          action: 'Study Product Ingredients',
          description: 'Read the labels on 3 products in your shop. Identify the active ingredients and what conditions they treat.',
          benefit: 'Builds product knowledge for confident recommendations',
          timeframe: '10 minutes',
        },
        {
          action: 'Role-Play a Retail Recommendation',
          description: 'Practice explaining WHY a product helps a specific client concern. Use the "education, not push" approach with a coworker.',
          benefit: 'Builds confidence in ethical retail sales',
          timeframe: '5 minutes',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 17: FINAL TREATMENT SANCTUARY PLEDGE
    // ═══════════════════════════════════════════
    {
      type: 'quote',
      id: 'treatment-sanctuary-pledge',
      quote: 'I pledge to see every client\'s scalp as a unique healing opportunity. I will analyze before I treat, educate before I sell, and touch with intention and skill. I understand that the trust placed in my chair is built on knowledge, care, and results. A master barber does not just cut hair — they heal scalps, restore confidence, and transform how clients feel about themselves.',
    },
  ],
}
