// Chapter 7: Basics of Chemistry — PREMIUM IMMERSIVE EXPERIENCE
// The Barber's Laboratory — precision formulas, molecular mastery, chemical confidence

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ───────────────────────────────────────────────
// LABORATORY THEME
// Deep violet / Neon cyan / Silver flask / Reaction amber
// ───────────────────────────────────────────────

export const chapter7PremiumTheme: ChapterTheme = {
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#6D28D9',
  secondary: '#06B6D4',
  background: 'rgba(20, 15, 35, 0.95)',
  backgroundAlt: 'rgba(30, 25, 50, 0.90)',
  surface: '#140F23',
  border: 'rgba(139, 92, 246, 0.30)',
  text: '#F5F3FF',
  textMuted: '#A5B4FC',
  highlight: '#A78BFA',
  timeline: {
    line: 'rgba(139, 92, 246, 0.4)',
    iconBg: '#1E1B2E',
    iconBorder: '#8B5CF6',
  },
  quote: {
    border: 'rgba(139, 92, 246, 0.45)',
    icon: 'rgba(139, 92, 246, 0.35)',
    bg: 'rgba(20, 15, 35, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(139, 92, 246, 0.18)',
    activeBorder: 'rgba(139, 92, 246, 0.55)',
    activeText: '#A78BFA',
    inactiveBg: 'rgba(20, 15, 35, 0.7)',
    inactiveBorder: 'rgba(139, 92, 246, 0.15)',
    inactiveText: '#A5B4FC',
    panelBg: 'rgba(20, 15, 35, 0.8)',
    panelBorder: 'rgba(139, 92, 246, 0.2)',
  },
  toolCard: {
    headerBg: 'rgba(139, 92, 246, 0.12)',
    headerText: '#A78BFA',
    dot: 'rgba(139, 92, 246, 0.65)',
    line: 'rgba(139, 92, 246, 0.3)',
  },
  featureGrid: {
    iconBg: 'rgba(139, 92, 246, 0.18)',
    iconColor: '#8B5CF6',
    cardBorder: 'rgba(139, 92, 246, 0.22)',
  },
  milestone: {
    yearColor: '#8B5CF6',
    border: 'rgba(139, 92, 246, 0.25)',
  },
  checklist: {
    checkBorder: 'rgba(139, 92, 246, 0.45)',
    checkColor: '#8B5CF6',
    bg: 'rgba(20, 15, 35, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(20, 15, 35, 0.7)',
    border: 'rgba(139, 92, 246, 0.2)',
    highlightColor: '#A78BFA',
  },
  challengeCard: {
    badgeBg: 'rgba(139, 92, 246, 0.2)',
    badgeText: '#A78BFA',
    cardBorder: 'rgba(139, 92, 246, 0.25)',
    completedBg: 'rgba(16, 185, 129, 0.1)',
    completedBorder: 'rgba(16, 185, 129, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(239, 68, 68, 0.08)',
    optionBorder: 'rgba(139, 92, 246, 0.2)',
    correctBg: 'rgba(16, 185, 129, 0.12)',
    incorrectBg: 'rgba(239, 68, 68, 0.1)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(139, 92, 246, 0.2)',
    levelBadgeText: '#A78BFA',
    rewardBg: 'rgba(16, 185, 129, 0.12)',
    rewardText: '#10B981',
  },
  actionPrompt: {
    cardBorder: 'rgba(139, 92, 246, 0.2)',
    completedBorder: 'rgba(16, 185, 129, 0.35)',
    benefitBg: 'rgba(139, 92, 246, 0.1)',
    benefitBorder: 'rgba(139, 92, 246, 0.3)',
  },
}

// ───────────────────────────────────────────────
// PREMIUM IMMERSIVE CHAPTER 7 CONTENT
// ───────────────────────────────────────────────

export const chapter7PremiumContent: ChapterContent = {
  chapterNumber: 7,
  title: 'BASICS OF CHEMISTRY',
  subtitle: "The Barber's Laboratory — Master the Formulas Behind Every Product",
  theme: chapter7PremiumTheme,
  sections: [
    // ==========================================
    // SECTION 1: LAB WELCOME
    // ==========================================
    {
      type: 'contentBlock',
      id: 'lab-welcome',
      title: 'THE BARBER\'S LABORATORY',
      content: 'Barbering uses products whose behavior depends on basic chemistry. This chapter focuses on chemical ideas that help you understand product selection, product performance, hair and skin response, and safe service decisions. The goal is to recognize what a product is designed to do, how its chemistry can affect the service, and when a chemical interaction calls for extra caution.',
      highlight: 'USE PRODUCTS — UNDERSTAND PRODUCTS — MASTER PRODUCTS',
    },

    // ==========================================
    // SECTION 2: WHY STUDY CHEMISTRY
    // ==========================================
    {
      type: 'contentBlock',
      id: 'why-study-chemistry',
      title: 'WHY STUDY BASICS OF CHEMISTRY?',
      content: 'Chemistry supports everyday product decisions in the barbershop. A working knowledge of matter, mixtures, pH, reactions, shampoos, conditioners, and cosmetic preparations helps the barber use professional products more safely and select them more intelligently.\n\n• Understand how product chemistry relates to hair and skin\n• Distinguish physical changes from chemical changes\n• Recognize pH and reaction concepts used in professional services\n• Compare shampoos, conditioners, and other preparations by purpose and composition\n• Use labels, manufacturer directions, and safety information when products or chemicals may interact',
      highlight: 'WITHOUT CHEMISTRY KNOWLEDGE, YOU ARE GUESSING',
    },

    // ==========================================
    // SECTION 3: WHY CHEMISTRY MATTERS — STAKES
    // ==========================================
    {
      type: 'infoCards',
      id: 'chemistry-stakes',
      title: 'THE REAL CONSEQUENCES OF CHEMICAL IGNORANCE',
      subtitle: 'What happens when barbers do not understand chemistry',
      cards: [
        {
          icon: 'Shield',
          title: 'CLIENT SAFETY',
          text: 'Some chemical combinations or overexposures can injure hair, skin, eyes, or the respiratory system. Understanding pH, product purpose, and chemical interactions helps the barber recognize when to stop and follow product safety directions.',
        },
        {
          icon: 'Award',
          title: 'PRODUCT PERFORMANCE',
          text: 'Products differ in cleansing strength, pH, ingredients, and intended use. Chemistry knowledge helps the barber match a product to the condition of the hair and scalp instead of treating every shampoo or conditioner as interchangeable.',
        },
        {
          icon: 'DollarSign',
          title: 'PROFESSIONAL CREDIBILITY',
          text: 'A barber who understands product purpose can explain why one cleanser, conditioner, or treatment may fit a client's hair or scalp condition better than another and can stay within the product's labeled directions.',
        },
      ],
    },

    // ==========================================
    // SECTION 3: ORGANIC VS INORGANIC
    // ==========================================
    {
      type: 'tabbed',
      id: 'organic-inorganic',
      title: 'ORGANIC VS INORGANIC CHEMISTRY',
      subtitle: 'The carbon divide — know what you are working with',
      tabs: [
        {
          id: 'organic',
          label: 'ORGANIC',
          title: 'ORGANIC CHEMISTRY',
          bullets: [
            { label: 'DEFINITION', description: 'Organic chemistry focuses on carbon-containing substances and compounds.' },
            { label: 'EXAMPLES', description: 'Proteins, oils, plastics, gasoline, and many ingredients used in hair and skin products contain carbon.' },
            { label: 'BARBER RELEVANCE', description: 'Many professional products contain carbon-based ingredients, so organic chemistry helps explain their composition and behavior.' },
            { label: 'CLASSIFICATION', description: 'Organic versus inorganic describes chemical composition; it does not by itself tell you whether a product is safe, flammable, or irritating.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Connect organic chemistry with carbon-containing substances rather than using a living-versus-nonliving shortcut.' },
            { text: 'Hair itself is organic — primarily composed of the protein keratin, which contains carbon.' },
          ],
        },
        {
          id: 'inorganic',
          label: 'INORGANIC',
          title: 'INORGANIC CHEMISTRY',
          bullets: [
            { label: 'DEFINITION', description: 'Inorganic chemistry focuses on substances generally studied outside carbon-based organic chemistry.' },
            { label: 'EXAMPLES', description: 'Water, ammonia, minerals, metals, and salts are common inorganic examples used to build chemistry concepts in barbering.' },
            { label: 'BARBER RELEVANCE', description: 'Water and other inorganic substances are important in cleansing, product preparation, pH, and chemical-service chemistry.' },
            { label: 'SAFETY', description: 'Do not infer safety from the organic/inorganic label. Product concentration, pH, ingredients, and exposure determine risk.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Water is a central inorganic substance in barbering chemistry because it is used in cleansing, mixtures, and pH concepts.' },
            { text: 'Ammonia (inorganic) is used in hair color to raise pH and open the cuticle for color penetration.' },
          ],
        },
        {
          id: 'matter',
          label: 'MATTER',
          title: 'MATTER & ITS PROPERTIES',
          bullets: [
            { label: 'DEFINITION', description: 'Anything that occupies space (volume) and has mass (weight)' },
            { label: 'STATES', description: 'Solid, liquid, gas — changed by temperature and pressure' },
            { label: 'ELEMENTS', description: 'Simplest form of matter; 118 known elements, 98 occur naturally' },
            { label: 'ATOMS', description: 'Smallest particle retaining chemical identity — protons (+), neutrons, electrons (-)' },
          ],
          facts: [
            { text: 'Water changing to ice (freezing) or steam (boiling) is a PHYSICAL change — no new substance forms.' },
            { text: 'Rusting, burning, and hair color oxidation are CHEMICAL changes — new substances form.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 4: BUILDING BLOCKS OF MATTER
    // ==========================================
    {
      type: 'featureGrid',
      id: 'building-blocks',
      title: 'BUILDING BLOCKS OF MATTER',
      subtitle: 'Elements, atoms, molecules, and compounds — the foundation of everything',
      features: [
        {
          icon: 'Atom',
          title: 'ELEMENTS',
          description: 'The simplest form of matter. One type of atom. 118 known elements, 98 occur naturally. Examples: hydrogen, oxygen, carbon, nitrogen.',
        },
        {
          icon: 'CircleDot',
          title: 'ATOMS',
          description: 'The smallest particle that retains the chemical identity of an element. Contains protons (+), neutrons (neutral), and electrons (–).',
        },
        {
          icon: 'Link',
          title: 'MOLECULES',
          description: 'Two or more atoms chemically joined. A molecule can contain atoms of the same element or atoms of different elements.',
        },
        {
          icon: 'Hexagon',
          title: 'COMPOUNDS',
          description: 'Different elements chemically united in fixed proportions. Examples: water (H₂O), salt (NaCl), carbon dioxide (CO₂). New properties emerge.',
        },
      ],
    },

    // ==========================================
    // SECTION 5: PURE SUBSTANCES VS MIXTURES
    // ==========================================
    {
      type: 'tabbed',
      id: 'pure-vs-mixture',
      title: 'PURE SUBSTANCES VS MIXTURES',
      subtitle: 'Know what you are working with — fixed or variable composition',
      tabs: [
        {
          id: 'pure-substance',
          label: 'PURE SUBSTANCE',
          title: 'PURE SUBSTANCES — FIXED COMPOSITION',
          bullets: [
            { label: 'DEFINITION', description: 'Matter with fixed composition and definite proportions — elements or compounds' },
            { label: 'ELEMENTS', description: 'Pure substances of one type of atom. Cannot be broken down chemically. Gold, oxygen, carbon.' },
            { label: 'COMPOUNDS', description: 'Pure substances of two or more elements chemically united. Water, salt, ammonia. Fixed ratios.' },
            { label: 'PROPERTIES', description: 'Predictable melting/boiling points. Uniform throughout. Same composition every time.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Pure substances have fixed composition. Water is always H₂O — two hydrogen atoms, one oxygen atom.' },
            { text: 'Chemical compounds include oxides, acids, bases, and salts — all with specific chemical formulas and properties.' },
          ],
        },
        {
          id: 'mixture',
          label: 'MIXTURE',
          title: 'PHYSICAL MIXTURES — VARIABLE COMPOSITION',
          bullets: [
            { label: 'DEFINITION', description: 'Two or more substances blended without chemical bonding. No fixed proportions.' },
            { label: 'UNIFORM MIXTURE', description: 'Same composition throughout. Also called homogeneous. Saltwater, air.' },
            { label: 'NONUNIFORM MIXTURE', description: 'Different composition in different areas. Also called heterogeneous. Salad, gravel.' },
            { label: 'SEPARATION', description: 'Mixtures can be separated by physical means — filtering, evaporation, magnetism.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Mixtures have NO fixed composition. You can mix more or less salt in water and it is still saltwater.' },
            { text: 'Most barbering products are mixtures — shampoos, conditioners, and styling products blend multiple ingredients.' },
          ],
        },
        {
          id: 'chemical-compounds',
          label: 'COMPOUNDS',
          title: 'TYPES OF CHEMICAL COMPOUNDS',
          bullets: [
            { label: 'OXIDES', description: 'Compounds containing oxygen combined with another element. Rust (iron oxide), water (hydrogen oxide).' },
            { label: 'ACIDS', description: 'Compounds that release hydrogen ions (H⁺) in solution. pH below 7. Vinegar, citric acid, hydrochloric acid.' },
            { label: 'BASES (ALKALIS)', description: 'Compounds that release hydroxide ions (OH⁻) in solution. pH above 7. Ammonia, lye, baking soda.' },
            { label: 'SALTS', description: 'Formed when an acid and base neutralize each other. Sodium chloride (table salt) is the most common.' },
          ],
          facts: [
            { text: 'Acid + Base = Salt + Water. This neutralization reaction is fundamental to understanding pH balancing in hair care.' },
            { text: 'Barbicide contains quaternary ammonium compounds (quats) — salts that disinfect by disrupting bacterial cell membranes.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 6: PHYSICAL VS CHEMICAL CHANGES
    // ==========================================
    {
      type: 'featureGrid',
      id: 'changes-grid',
      title: 'PHYSICAL VS CHEMICAL CHANGES',
      subtitle: 'Know the difference — it determines product behavior',
      features: [
        {
          icon: 'Droplets',
          title: 'PHYSICAL CHANGE',
          description: 'A physical change alters form, state, or another physical characteristic without producing a new chemical substance. Melting and freezing water are common examples.',
        },
        {
          icon: 'Flame',
          title: 'CHEMICAL CHANGE',
          description: 'A chemical change involves a chemical reaction and produces a substance with different chemical properties. Oxidation in permanent haircolor is one barbering example.',
        },
        {
          icon: 'Recycle',
          title: 'REVERSIBLE?',
          description: 'Physical changes are reversible (ice → water → ice). Chemical changes are permanent (oxidized hair color cannot un-oxidize).',
        },
        {
          icon: 'AlertTriangle',
          title: 'BARBER EXAMPLE',
          description: 'Temporary hair color = physical change (coats the hair). Permanent hair color = chemical change (oxidizes and penetrates the cortex).',
        },
      ],
    },

    // ==========================================
    // SECTION 7: REDOX REACTIONS
    // ==========================================
    {
      type: 'tabbed',
      id: 'redox-reactions',
      title: 'OXIDATION-REDUCTION (REDOX) REACTIONS',
      subtitle: 'The engine behind every chemical service',
      tabs: [
        {
          id: 'oxidation',
          label: 'OXIDATION',
          title: 'OXIDATION — GAINING OXYGEN',
          bullets: [
            { label: 'DEFINITION', description: 'Addition of oxygen OR loss of hydrogen to a substance' },
            { label: 'HAIR COLOR', description: 'Hair dye gains oxygen from hydrogen peroxide (H₂O₂) — the dye is oxidized' },
            { label: 'PERM NEUTRALIZER', description: 'Hair is oxidized by removing hydrogen; the neutralizer is reduced' },
            { label: 'RESULT', description: 'Creates larger color molecules that become trapped in the hair cortex' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Oxidation = gain of oxygen OR loss of hydrogen. Both definitions are correct.' },
            { text: 'Hydrogen peroxide (H₂O₂) is the primary oxidizing agent in barbering — it drives color, bleach, and perm processes.' },
          ],
        },
        {
          id: 'reduction',
          label: 'REDUCTION',
          title: 'REDUCTION — LOSING OXYGEN',
          bullets: [
            { label: 'DEFINITION', description: 'Loss of oxygen OR addition of hydrogen to a substance' },
            { label: 'H₂O₂ ROLE', description: 'In oxidation haircolor, hydrogen peroxide supplies oxygen to the haircolor product and is reduced as it loses oxygen.' },
            { label: 'PERM NEUTRALIZER', description: 'During permanent-wave neutralization, hair is oxidized as hydrogen is removed; the neutralizer is reduced as it loses oxygen.' },
            { label: 'RESULT', description: 'Use redox language to identify which substance is oxidized and which substance is reduced during the reaction.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Reduction = loss of oxygen OR gain of hydrogen. Both definitions are correct.' },
            { text: 'Oxidation and reduction ALWAYS occur together — you cannot have one without the other. This is a redox reaction.' },
          ],
        },
        {
          id: 'heat-reactions',
          label: 'HEAT',
          title: 'HEAT IN CHEMICAL REACTIONS',
          bullets: [
            { label: 'EXOTHERMIC', description: 'Releases heat. Mixing perm activator with waving lotion creates warmth — this is exothermic.' },
            { label: 'ENDOTHERMIC', description: 'Absorbs heat. Some waving lotions need external heat source to activate — this is endothermic.' },
            { label: 'SAFETY', description: 'Exothermic reactions can become dangerously hot. Monitor temperature during chemical services.' },
            { label: 'CLIENT COMFORT', description: 'Warn clients about warmth. Excessive heat signals potential chemical burn — rinse immediately.' },
          ],
          facts: [
            { text: 'Exothermic = heat OUT (exo = exit). Endothermic = heat IN (endo = enter). Mnemonic: EXit = heat exits.' },
            { text: 'If a client feels burning during a chemical service, rinse immediately. Burning is NOT normal warmth.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 8: SOLUTIONS, SUSPENSIONS, EMULSIONS
    // ==========================================
    {
      type: 'tabbed',
      id: 'mixtures',
      title: 'SOLUTIONS, SUSPENSIONS & EMULSIONS',
      subtitle: 'The three mixtures you use every day',
      tabs: [
        {
          id: 'solutions',
          label: 'SOLUTIONS',
          title: 'SOLUTIONS — STABLE & CLEAR',
          bullets: [
            { label: 'DEFINITION', description: 'Stable, uniform mixture where solute is completely dissolved in solvent' },
            { label: 'APPEARANCE', description: 'Clear — light passes through without scattering' },
            { label: 'EXAMPLES', description: 'A solution contains compatible substances distributed uniformly, such as a dissolved solute in a solvent.' },
            { label: 'STABILITY', description: 'Do NOT separate over time — no shaking required' },
          ],
          facts: [
            { text: 'EXAM FOCUS: A true solution is a stable, uniform mixture whose dissolved particles do not settle out.' },
            { text: 'Water is the universal solvent — it dissolves more substances than any other liquid.' },
          ],
        },
        {
          id: 'suspensions',
          label: 'SUSPENSIONS',
          title: 'SUSPENSIONS — UNSTABLE & CLOUDY',
          bullets: [
            { label: 'DEFINITION', description: 'Unstable mixture with visible particles that settle over time' },
            { label: 'APPEARANCE', description: 'Cloudy or opaque — particles are visible' },
            { label: 'EXAMPLES', description: 'Calamine lotion, many hair tonics, and some styling products' },
            { label: 'USE TIP', description: 'SHAKE WELL before use — particles settle and must be redistributed' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Suspensions are less stable than solutions because larger dispersed particles can settle and may need redistribution before use.' },
            { text: 'Using an unshaken suspension means the client gets mostly solvent with almost no active ingredient.' },
          ],
        },
        {
          id: 'emulsions',
          label: 'EMULSIONS',
          title: 'EMULSIONS — OIL + WATER MIXED',
          bullets: [
            { label: 'DEFINITION', description: 'Immiscible liquids (like oil and water) held together by an emulsifier/surfactant' },
            { label: 'APPEARANCE', description: 'Milky or creamy — stable but can separate over time' },
            { label: 'EXAMPLES', description: 'Shampoos, conditioners, mayonnaise, and most hair creams' },
            { label: 'TYPE', description: 'Oil-in-water (O/W) is most common in barbering — water is the main ingredient' },
          ],
          facts: [
            { text: 'EXAM FOCUS: In an oil-in-water emulsion, oil droplets are dispersed in water; in a water-in-oil emulsion, water droplets are dispersed in oil.' },
            { text: 'Surfactants have a hydrophilic (water-loving) head and lipophilic (oil-loving) tail — this dual nature creates emulsions.' },
          ],
        },
        {
          id: 'surfactants',
          label: 'SURFACTANTS',
          title: 'SURFACTANTS — THE MIXING AGENTS',
          bullets: [
            { label: 'FUNCTION', description: 'Reduce surface tension between oil and water, allowing them to mix' },
            { label: 'STRUCTURE', description: 'Hydrophilic head (water-loving) + Lipophilic tail (oil-loving)' },
            { label: 'CLEANSING', description: 'Surfactants in shampoo surround oil and dirt, allowing water to rinse them away' },
            { label: 'TYPES', description: 'Anionic (negative charge, cleansing), Cationic (positive charge, conditioning), Nonionic (no charge, mild), Amphoteric (both charges, gentle)' },
          ],
          facts: [
            { text: 'Anionic surfactants are the primary cleansers in shampoo. They have a negative charge that lifts dirt and oil.' },
            { text: 'Cationic surfactants are used in conditioners. Their positive charge adheres to negatively charged hair, providing smoothness.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 9: pH MASTERY
    // ==========================================
    {
      type: 'tabbed',
      id: 'ph-mastery',
      title: 'pH MASTERY — THE ACID-ALKALI BALANCE',
      subtitle: 'The most important number in product chemistry',
      tabs: [
        {
          id: 'ph-scale',
          label: 'pH SCALE',
          title: 'THE pH SCALE (0–14)',
          bullets: [
            { label: 'DEFINITION', description: 'pH means potential hydrogen and reflects hydrogen-ion concentration in water-based solutions.' },
            { label: '0–6.9', description: 'ACIDIC — contracts and hardens hair, closes the cuticle' },
            { label: '7.0', description: 'NEUTRAL — pure water, balanced' },
            { label: '7.1–14', description: 'ALKALINE — softens and swells hair, opens the cuticle' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: pH 7 is neutral. Below 7 = acidic. Above 7 = alkaline. Memorize this scale.' },
            { text: 'Hair and skin are typically about pH 4.5–5.5. Product effects depend on pH, concentration, ingredients, condition of the hair or skin, and correct use.' },
          ],
        },
        {
          id: 'hair-ph',
          label: 'HAIR & pH',
          title: 'pH EFFECTS ON HAIR',
          bullets: [
            { label: 'ACIDIC RANGE', description: 'Very strong acid can dissolve hair; milder acid ranges contract and harden hair and can help tighten the cuticle.' },
            { label: 'HAIR & SKIN RANGE (about pH 4.5–5.5)', description: 'Hair remains near its normal diameter in this slightly acidic range.' },
            { label: 'MILD ALKALI (about pH 5.5–10)', description: 'Hair swells and becomes more porous as cuticle imbrications open, allowing some chemical services to penetrate more easily.' },
            { label: 'STRONGER ALKALI (about pH 10–14)', description: 'Very strong alkali can dissolve hair and is associated with products such as some relaxers or depilatories; follow the product label exactly.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: As alkalinity increases, hair can swell and become more vulnerable; very strong alkali can dissolve hair.' },
            { text: 'Pure water can swell hair up to 20%. This is why wet hair is more fragile than dry hair.' },
          ],
        },
        {
          id: 'neutralization',
          label: 'NEUTRALIZATION',
          title: 'ACID-ALKALI NEUTRALIZATION',
          bullets: [
            { label: 'REACTION', description: 'Equal proportions of acid and alkali combine to form WATER + SALT' },
            { label: 'BARBER USE', description: 'Acidic rinses or appropriately formulated products can help counter excess alkalinity after certain services; use the product directions for the specific service.' },
            { label: 'IMPORTANT DISTINCTION', description: 'Acid-alkali neutralization is not the same reaction as oxidation neutralization in permanent waving. Identify which process the service actually uses.' },
            { label: 'TEST', description: 'Some neutralizers change color to indicate pH balance has been restored' },
          ],
          facts: [
            { text: 'Acid + Alkali = Water + Salt. This is the fundamental neutralization reaction.' },
            { text: 'Do not apply one neutralizing rule to every chemical service. Follow manufacturer directions and identify whether the step is pH balancing, oxidation neutralization, or another process.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 10: WATER — THE UNIVERSAL SOLVENT
    // ==========================================
    {
      type: 'featureGrid',
      id: 'water-essentials',
      title: 'WATER — THE UNIVERSAL SOLVENT',
      subtitle: 'H₂O is the most important substance in your shop',
      features: [
        {
          icon: 'Droplets',
          title: 'SOFT WATER',
          description: 'Low mineral content. Lathers easily with soap and shampoo. Ideal for hair washing and product mixing.',
        },
        {
          icon: 'Mountain',
          title: 'HARD WATER',
          description: 'High mineral content (calcium, magnesium). Does not lather well. Leaves mineral buildup on hair and tools.',
        },
        {
          icon: 'Filter',
          title: 'PURIFICATION',
          description: 'Common purification methods discussed in this chapter are boiling, filtration, and distillation. Distillation removes many dissolved impurities by vaporizing and condensing water.',
        },
        {
          icon: 'AlertTriangle',
          title: 'BARBER IMPACT',
          description: 'Hard water can reduce lather and contribute mineral deposits. Product choice should follow the hair condition, water quality, and manufacturer directions rather than a fixed weekly schedule.',
        },
      ],
    },

    // ==========================================
    // SECTION 11: SHAMPOOS & CONDITIONERS
    // ==========================================
    {
      type: 'tabbed',
      id: 'shampoo-conditioner',
      title: 'SHAMPOOS & CONDITIONERS',
      subtitle: 'The foundation of every hair service',
      tabs: [
        {
          id: 'shampoo-types',
          label: 'SHAMPOO TYPES',
          title: 'SHAMPOO CLASSIFICATIONS',
          bullets: [
            { label: 'pH-BALANCED / ACID-BALANCED', description: 'General use. Maintains natural hair pH. Safe for most hair types.' },
            { label: 'BALANCING', description: 'Designed for oily hair and scalp to remove excess oil while helping avoid excessive drying.' },
            { label: 'CLARIFYING', description: 'Uses cleansing or chelating action to remove product buildup or certain mineral deposits when that buildup is the problem.' },
            { label: 'COLOR-ENHANCING', description: 'Maintains and extends hair color. Contains color-depositing pigments and UV protection.' },
            { label: 'CONDITIONING / MOISTURIZING', description: 'For dry or damaged hair. Contains oils and proteins to restore moisture.' },
            { label: 'DRY / POWDER', description: 'Waterless cleansing. Absorbs oil and refreshes hair between washes. Popular for busy clients.' },
            { label: 'MEDICATED', description: 'Contains active ingredients for dandruff or scalp conditions. Follow label directions.' },
            { label: 'NEUTRALIZING / BALANCING', description: 'Designed to counter unwanted alkaline residue after specific chemical services where the manufacturer directs its use.' },
            { label: 'SULFATE-FREE', description: 'Formulated with little to no sulfate surfactant; often selected for color-treated or chemically treated hair when a less-stripping cleanser is desired.' },
            { label: 'THERAPEUTIC', description: 'Targets specific scalp conditions like psoriasis or dermatitis. May require medical guidance.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Select a shampoo by the condition of the hair/scalp and the product purpose, not by a fixed schedule that applies to every client.' },
            { text: 'Sulfate-free shampoos produce less lather but are gentler on sensitive scalps and chemically treated hair.' },
          ],
        },
        {
          id: 'conditioner-types',
          label: 'CONDITIONERS',
          title: 'CONDITIONER TYPES & pH',
          bullets: [
            { label: 'FUNCTION', description: 'Deposit conditioning ingredients that can improve feel, manageability, moisture balance, and protection of the hair shaft.' },
            { label: 'IDEAL pH', description: '3.0–5.5 — acidic range that closes the cuticle and smooths the hair surface' },
            { label: 'INSTANT / RINSE-OUT', description: 'Applied after shampooing, left briefly, then rinsed. Daily use.' },
            { label: 'TREATMENT / REPAIR', description: 'Deep conditioning with higher protein/moisture content. Left on longer for damaged hair.' },
            { label: 'LEAVE-IN', description: 'Not rinsed out. Provides ongoing protection and moisture throughout the day.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Conditioner pH is 3.0–5.5. This acidity closes the cuticle and locks in moisture.' },
            { text: 'Leave-in conditioners remain on the hair; some formulas include thermal-protection or other protective ingredients, so selection should follow the label and client need.' },
          ],
        },
        {
          id: 'surfactant-types',
          label: 'SURFACTANTS',
          title: 'SURFACTANT CLASSIFICATIONS',
          bullets: [
            { label: 'ANIONIC', description: 'Negative charge. Strong cleansing. Primary surfactant in most shampoos.' },
            { label: 'CATIONIC', description: 'Positive charge. Conditioning. Adheres to negatively charged hair for smoothness.' },
            { label: 'NONIONIC', description: 'No charge. Mild cleansing. Used in gentle and baby shampoos.' },
            { label: 'AMPHOTERIC', description: 'Both charges. Very gentle. Adjusts behavior based on pH of the product.' },
          ],
          facts: [
            { text: 'Anionic surfactants clean well but can be harsh. Cationic surfactants condition but do not clean effectively alone.' },
            { text: 'Most shampoos combine surfactant types to balance cleansing power with gentleness.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 12: COMMON INGREDIENTS
    // ==========================================
    {
      type: 'featureGrid',
      id: 'common-ingredients',
      title: 'COMMON INGREDIENTS IN BARBERING PRODUCTS',
      subtitle: 'Know what is in the bottle — USP standards apply',
      features: [
        {
          icon: 'FlaskConical',
          title: 'ALCOHOL',
          description: 'Solvent and antiseptic. Isopropyl alcohol 50–60% is effective on skin. Higher concentrations evaporate too quickly to disinfect properly.',
        },
        {
          icon: 'FlaskConical',
          title: 'HYDROGEN PEROXIDE (H₂O₂)',
          description: 'Oxidizing and bleaching agent. 3–5% for antiseptic. 20–40 volume for hair lightening and color development.',
        },
        {
          icon: 'FlaskConical',
          title: 'GLYCERIN',
          description: 'Humectant and moisturizer. Draws moisture from the air into hair and skin. Common in conditioners and lotions.',
        },
        {
          icon: 'FlaskConical',
          title: 'PETROLATUM (VASELINE)',
          description: 'Protective emollient. Creates a barrier on skin. Used to protect hairline during chemical services.',
        },
        {
          icon: 'FlaskConical',
          title: 'AMMONIA',
          description: 'Raises pH for waving, coloring, and lightening. Opens the cuticle so chemicals can penetrate. Strong odor.',
        },
        {
          icon: 'FlaskConical',
          title: 'FORMALDEHYDE',
          description: 'Preservative. Toxic and carcinogenic. Use with extreme caution. Many products now use formaldehyde-free alternatives.',
        },
        {
          icon: 'FlaskConical',
          title: 'SILICONES',
          description: 'Breathable film-formers in conditioners. Add shine, reduce frizz, and protect from heat. Can build up over time.',
        },
        {
          icon: 'FlaskConical',
          title: 'WITCH HAZEL',
          description: 'Natural astringent and freshener. Tightens pores and soothes skin. Common in aftershaves and toners.',
        },
        {
          icon: 'FlaskConical',
          title: 'ALKANOLAMINES',
          description: 'Raise pH and neutralize acids in hair products. Less odor than ammonia. Common in hair color and permanent wave solutions.',
        },
        {
          icon: 'FlaskConical',
          title: 'ALUM',
          description: 'Natural styptic powder. Stops minor bleeding from nicks and cuts. Every barber should have alum in their station.',
        },
        {
          icon: 'FlaskConical',
          title: 'QUATS (QUATERNARY AMMONIUM COMPOUNDS)',
          description: 'Antiseptics and preservatives. The active ingredient in Barbicide and many disinfectants. Effective against bacteria and fungi.',
        },
      ],
    },

    // ==========================================
    // SECTION 13: ADDITIONAL COSMETIC PREPARATIONS
    // ==========================================
    {
      type: 'featureGrid',
      id: 'other-preparations',
      title: 'OTHER COSMETIC PREPARATIONS IN BARBERING',
      subtitle: 'Know the full range of products you will encounter',
      features: [
        {
          icon: 'SprayCan',
          title: 'HAIR SPRAY & STYLING AIDS',
          description: 'Hair spray, gels, mousses, and waxes provide hold and style. Water-based products wash out easily; oil-based need shampoo.',
        },
        {
          icon: 'Droplet',
          title: 'HAIRDRESSINGS & POMADES',
          description: 'Oil-based or water-based products for shine and control. Pomades provide slick looks; water-based versions wash out easier.',
        },
        {
          icon: 'Heart',
          title: 'MASKS & TREATMENTS',
          description: 'Deep conditioning masks and protein treatments repair damaged hair. Left on longer than regular conditioners for intensive care.',
        },
        {
          icon: 'Hand',
          title: 'MASSAGE CREAMS & LOTIONS',
          description: 'Used during facial and scalp massage. Provide slip for hand movement while delivering moisture to skin.',
        },
        {
          icon: 'ShieldCheck',
          title: 'MOISTURIZERS & OINTMENTS',
          description: 'Protect and hydrate skin. Ointments are thicker and more occlusive; creams absorb faster. Essential for dry skin and aftershave care.',
        },
        {
          icon: 'Sparkles',
          title: 'ASTRINGENTS, TONERS & FRESHENERS',
          description: 'Tighten pores and remove residue after cleansing. Witch hazel is a natural astringent. Toners restore pH after washing.',
        },
        {
          icon: 'Sun',
          title: 'SUNTAN LOTIONS & WRINKLE CREAMS',
          description: 'Protect skin from UV damage and reduce signs of aging. Recommend SPF products for clients who work outdoors.',
        },
        {
          icon: 'Scissors',
          title: 'DEPILATORIES & EPILATORS',
          description: 'Chemical hair removers (depilatories) dissolve hair above skin. Wax epilators remove hair from the root. Both require patch tests.',
        },
      ],
    },

    // ==========================================
    // SECTION 14: COMMON MISTAKES & REMEMBER THIS
    // ==========================================
    {
      type: 'tabbed',
      id: 'common-mistakes',
      title: 'COMMON MISTAKES & REMEMBER THIS',
      subtitle: 'Avoid these errors and lock in the key facts',
      tabs: [
        {
          id: 'mistakes',
          label: 'COMMON MISTAKES',
          title: 'MISTAKES THAT COST POINTS ON THE EXAM',
          bullets: [
            { label: 'MIXING INCOMPATIBLE CHEMICALS', description: 'Never mix bleach with ammonia or other cleaners. Toxic fumes result. Read every label before combining products.' },
            { label: 'IGNORING REQUIRED PRE-SERVICE TESTING', description: 'When a product label or governing rule requires a predisposition, strand, or other pre-service test, complete it exactly as directed before proceeding.' },
            { label: 'IGNORING pH LEVELS', description: 'Using alkaline products on damaged hair or acidic products on oily scalps creates problems. Match pH to hair condition.' },
            { label: 'NOT READING SDS SHEETS', description: 'Safety Data Sheets tell you hazards, first aid, and handling for every chemical. OSHA requires them. Know where they are in your shop.' },
            { label: 'ASSUMING ALL SHAMPOOS ARE THE SAME', description: 'Clarifying, medicated, neutralizing, and sulfate-free shampoos serve different purposes. Using the wrong type damages hair or wastes money.' },
            { label: 'CONFUSING NEUTRALIZATION STEPS', description: 'Different services use different reactions. Do not treat acid-alkali balancing, permanent-wave oxidation neutralization, and post-service cleansing as the same step.' },
          ],
          facts: [
            { text: 'REMEMBER: Required pre-service testing depends on the product, service, manufacturer directions, and applicable rules. Verify the requirement instead of using a universal shortcut.' },
            { text: 'REMEMBER: SDS sheets must be accessible to all employees. Failing to provide them is an OSHA violation.' },
          ],
        },
        {
          id: 'remember',
          label: 'REMEMBER THIS',
          title: 'KEY FACTS TO LOCK IN',
          bullets: [
            { label: 'ORGANIC CHEMISTRY', description: 'Focuses on carbon-containing substances and compounds; avoid living-versus-nonliving shortcuts.' },
            { label: 'INORGANIC CHEMISTRY', description: 'Includes water, minerals, metals, ammonia, and other substances generally studied outside organic carbon chemistry.' },
            { label: 'PHYSICAL CHANGE', description: 'Changes physical form or state without forming a new chemical substance.' },
            { label: 'CHEMICAL CHANGE', description: 'Involves a chemical reaction that creates substances with different chemical properties.' },
            { label: 'OXIDATION & REDUCTION TOGETHER', description: 'You cannot have one without the other. Redox reactions always occur as a pair.' },
            { label: 'HAIR pH = 4.5–5.5', description: 'Slightly acidic. Products outside this range damage hair over time. Conditioner pH = 3.0–5.5.' },
          ],
          facts: [
            { text: 'MNEMONIC: EXothermic = heat EXits. ENDOthermic = heat goes IN.' },
            { text: 'MNEMONIC: ACID = A Cuticle In Defense (acids close/defend the cuticle). ALKALI = A Lift (alkalis lift/open the cuticle).' },
          ],
        },
        {
          id: 'safety',
          label: 'SAFETY RULES',
          title: 'NON-NEGOTIABLE SAFETY RULES',
          bullets: [
            { label: 'READ LABELS', description: 'Every product has instructions, warnings, and ingredients. Read them before use. Every time.' },
            { label: 'FOLLOW MANUFACTURER DIRECTIONS', description: 'Mixing ratios, processing times, and application methods are tested for safety. Do not improvise.' },
            { label: 'CHECK SDS SHEETS', description: 'Know the hazards, first aid procedures, and PPE requirements for every chemical in your station.' },
            { label: 'FOLLOW REQUIRED TESTING', description: 'Use the product label and applicable rules to determine whether a predisposition, strand, or other pre-service test is required and how to perform it.' },
            { label: 'MATCH PRODUCTS TO CLIENT', description: 'Consider hair type, condition, chemical history, and scalp sensitivity. One size does not fit all.' },
            { label: 'NEVER MIX UNFAMILIAR CHEMICALS', description: 'When in doubt, do not mix. Incompatible chemicals create toxic fumes, explosions, or severe burns.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: OSHA requires SDS sheets for all hazardous chemicals. You must know where they are and how to read them.' },
            { text: 'EXAM FOCUS: Product safety questions may test labels, interactions, overexposure, and correct response. Follow the specific product and service requirements.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 15: BOARD EXAM CRITICAL ALERTS
    // ==========================================
    {
      type: 'contentBlock',
      id: 'board-exam-chemistry',
      title: 'BOARD EXAM CRITICAL ALERTS',
      content: 'NIC-aligned review:\n\n1. Organic chemistry focuses on carbon-containing substances; inorganic chemistry includes water, minerals, metals, ammonia, and related substances.\n\n2. Matter has mass and occupies space. Solids, liquids, and gases are common physical states.\n\n3. Elements are basic forms of matter; atoms are their smallest chemically identifying units. Molecules contain two or more chemically joined atoms, and compounds contain different elements in definite proportions.\n\n4. Physical changes alter form or state without creating a new chemical substance. Chemical changes involve reactions that change chemical composition.\n\n5. Oxidation can involve gaining oxygen or losing hydrogen; reduction can involve losing oxygen or gaining hydrogen. Redox processes occur together.\n\n6. Solutions, suspensions, and emulsions differ in particle behavior and stability. Surfactants help oil and water interact and support cleansing.\n\n7. pH reflects hydrogen-ion conditions in water-based solutions. Values below 7 are acidic, 7 is neutral, and values above 7 are alkaline.\n\n8. Hair and skin are commonly about pH 4.5–5.5. Acidic and alkaline products can change hair diameter, porosity, cuticle behavior, and service performance.\n\n9. Strong acids and strong alkalis can damage or dissolve hair; concentration and correct use matter.\n\n10. Shampoo and conditioner selection should match hair/scalp condition, product purpose, ingredients, and manufacturer directions.\n\n11. Neutralizing shampoo for alkaline residue is not the same chemistry as oxidation neutralization in permanent waving.\n\n12. Water quality can change lather and product performance; hard water contains more dissolved mineral content than soft water.\n\n13. NIC chemistry emphasis includes pH, product/ingredient purpose and effects, chemical interactions, and reaction/overexposure safety.\n\n14. Read labels and safety information before mixing or applying chemical products, and follow the exact directions for the service being performed.',
      highlight: 'MASTER THE CONCEPTS — DO NOT MEMORIZE UNSUPPORTED SHORTCUTS',
    },

    // ==========================================
    // SECTION 16: CHEMISTRY SAFETY SCENARIO
    // ==========================================
    {
      type: 'scenarioBlock',
      id: 'chemical-safety-scenario',
      title: 'CHEMICAL SAFETY CHALLENGE',
      subtitle: 'Wrong product + wrong client = disaster',
      scenarios: [
        {
          situation: 'A client with chemically relaxed hair asks for a clarifying shampoo recommendation. They wash daily and their hair feels dry and brittle. Which shampoo do you recommend and why?',
          options: [
            { letter: 'A', text: 'Daily clarifying shampoo — it removes all buildup effectively', feedback: 'INCORRECT. Daily clarifying shampoo is too harsh for chemically relaxed hair. It strips natural oils and worsens dryness and breakage.' },
            { letter: 'B', text: 'Weekly clarifying shampoo + moisturizing conditioner, plus a switch to conditioning shampoo for daily use', feedback: 'CORRECT. Weekly clarifying removes mineral buildup without over-drying. Conditioning shampoo for daily use restores moisture. Always follow with conditioner.' },
            { letter: 'C', text: 'Medicated antidandruff shampoo — it is the strongest option', feedback: 'INCORRECT. Medicated shampoo treats scalp conditions, not dryness. Using it on dry, brittle hair causes further damage. Match the product to the problem.' },
            { letter: 'D', text: 'Any shampoo is fine — they all do the same thing', feedback: 'INCORRECT. Shampoos have different pH levels, surfactant types, and purposes. Using the wrong shampoo on compromised hair accelerates damage.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ==========================================
    // SECTION 17: FINAL LAB PLEDGE
    // ==========================================
    {
      type: 'quote',
      id: 'lab-pledge',
      quote: 'I pledge to understand the chemistry behind every product I use. I will read labels, respect pH, and never mix chemicals without knowing their reactions. I understand that knowledge of chemistry is not optional — it is the foundation of safe, effective barbering. A master barber masters the science.',
    },
  ],
}
