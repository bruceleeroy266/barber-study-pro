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
      content: 'Every product in your station — shampoo, conditioner, disinfectant, pomade, hair color — is chemistry in action. Understanding the basics of chemistry is not about memorizing periodic tables. It is about knowing WHY products work, HOW they interact with hair and skin, and WHAT happens when you mix them. A barber who understands chemistry makes smarter product choices, prevents damage, and delivers better results. This chapter transforms you from someone who USES products into a barber who UNDERSTANDS them.',
      highlight: 'USE PRODUCTS — UNDERSTAND PRODUCTS — MASTER PRODUCTS',
    },

    // ==========================================
    // SECTION 2: WHY STUDY CHEMISTRY
    // ==========================================
    {
      type: 'contentBlock',
      id: 'why-study-chemistry',
      title: 'WHY STUDY BASICS OF CHEMISTRY?',
      content: 'Chemistry is not just for scientists — it is for every barber who picks up a product bottle. This chapter provides the foundation for understanding and safely using chemical products daily in the barbershop. Chemicals are everywhere: cleaners, disinfectants, hair care, and skin care items. Without chemistry knowledge, you are guessing. With it, you are in control.\n\n• Enables safe and effective use of professional products\n• Helps select the best products for desired results on hair and skin\n• Prevents or solves problems during services\n• Permanent changes to hair structure (coloring, perming, relaxing) require chemical knowledge — without chemicals, permanent change is impossible\n• Reading labels, understanding SDS sheets, and performing patch tests all require chemistry basics',
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
          text: 'Mixing incompatible chemicals causes burns, hair breakage, and allergic reactions. A barber who does not understand pH and reactions is a liability to every client.',
        },
        {
          icon: 'Award',
          title: 'PRODUCT PERFORMANCE',
          text: 'Using alkaline shampoo on chemically treated hair accelerates damage. Using acidic conditioner on oily scalp weighs hair down. Chemistry knowledge lets you match products to needs.',
        },
        {
          icon: 'DollarSign',
          title: 'PROFESSIONAL CREDIBILITY',
          text: 'Clients ask "What shampoo should I use?" and "Why is my hair dry?" A barber who can explain pH, surfactants, and moisture retention earns trust and repeat business.',
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
            { label: 'DEFINITION', description: 'Study of substances containing CARBON — all living things or things that were once alive' },
            { label: 'EXAMPLES', description: 'Gasoline, plastics, pesticides, proteins, oils, and most hair/skin care ingredients' },
            { label: 'BARBER RELEVANCE', description: 'Most shampoos, conditioners, pomades, and styling products are organic compounds' },
            { label: 'BURNS?', description: 'YES — many organic compounds are flammable and can cause chemical burns' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Organic chemistry = carbon-containing substances. If it was alive or came from something alive, it is organic.' },
            { text: 'Hair itself is organic — primarily composed of the protein keratin, which contains carbon.' },
          ],
        },
        {
          id: 'inorganic',
          label: 'INORGANIC',
          title: 'INORGANIC CHEMISTRY',
          bullets: [
            { label: 'DEFINITION', description: 'Study of substances WITHOUT carbon — minerals, metals, water, and simple compounds' },
            { label: 'EXAMPLES', description: 'Water (H₂O), ammonia, metals, minerals, salt, and most disinfectants' },
            { label: 'BARBER RELEVANCE', description: 'Disinfectants, Barbicide solutions, and water are inorganic — essential for sanitation' },
            { label: 'BURNS?', description: 'Generally NO — but strong acids and bases (inorganic) can still cause severe chemical burns' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Inorganic = no carbon. Water is the most important inorganic substance in barbering.' },
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
          description: 'Two or more atoms joined by chemical bonds. Can be elemental (O₂) or compound (H₂O). The smallest unit of a compound.',
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
          description: 'Form changes, but NO new substance forms. Ice melting, temporary hair color, and mixing oil with water are physical changes. Reversible.',
        },
        {
          icon: 'Flame',
          title: 'CHEMICAL CHANGE',
          description: 'New substances form with different properties. Hair color oxidation, permanent waving, and rusting are chemical changes. NOT reversible.',
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
            { label: 'H₂O₂ ROLE', description: 'Hydrogen peroxide loses oxygen during oxidation — H₂O₂ is reduced' },
            { label: 'PERM NEUTRALIZER', description: 'The neutralizer gains hydrogen as it rebuilds disulfide bonds — it is reduced' },
            { label: 'RESULT', description: 'Stabilizes the new hair structure after chemical processing' },
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
            { label: 'EXAMPLES', description: 'Saltwater, Barbicide solution, shampoo base, and many hair tonics' },
            { label: 'STABILITY', description: 'Do NOT separate over time — no shaking required' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Solutions are stable and clear. If you can see particles, it is NOT a solution.' },
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
            { text: 'BOARD EXAM ALERT: Suspensions require shaking. If a product says "shake well," it is a suspension.' },
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
            { text: 'BOARD EXAM ALERT: Most barbering products are oil-in-water emulsions. Water is the continuous phase.' },
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
            { label: 'DEFINITION', description: 'Measures acidity and alkalinity — potential hydrogen concentration' },
            { label: '0–6.9', description: 'ACIDIC — contracts and hardens hair, closes the cuticle' },
            { label: '7.0', description: 'NEUTRAL — pure water, balanced' },
            { label: '7.1–14', description: 'ALKALINE — softens and swells hair, opens the cuticle' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: pH 7 is neutral. Below 7 = acidic. Above 7 = alkaline. Memorize this scale.' },
            { text: 'Hair and skin natural pH is 4.5–5.5 — slightly acidic. Products outside this range cause damage over time.' },
          ],
        },
        {
          id: 'hair-ph',
          label: 'HAIR & pH',
          title: 'pH EFFECTS ON HAIR',
          bullets: [
            { label: 'ACIDIC (pH 0–4.5)', description: 'Shrinks, hardens, improves sheen, removes residue. Too strong dissolves hair.' },
            { label: 'NORMAL (pH 4.5–5.5)', description: 'Healthy hair range. Cuticle lies flat, hair is strong and shiny.' },
            { label: 'MILD ALKALI (pH 5.5–10)', description: 'Swells hair, opens cuticle. Used in tints, bleaches, and cold waves.' },
            { label: 'STRONG ALKALI (pH 10–14)', description: 'Dissolves hair. Used in relaxers and depilatories — AVOID SCALP CONTACT.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Strong alkali (pH 10–14) dissolves hair. Never let relaxers touch the scalp.' },
            { text: 'Pure water can swell hair up to 20%. This is why wet hair is more fragile than dry hair.' },
          ],
        },
        {
          id: 'neutralization',
          label: 'NEUTRALIZATION',
          title: 'ACID-ALKALI NEUTRALIZATION',
          bullets: [
            { label: 'REACTION', description: 'Equal proportions of acid and alkali combine to form WATER + SALT' },
            { label: 'BARBER USE', description: 'Neutralizing shampoo after chemical services restores hair to acidic pH' },
            { label: 'IMPORTANCE', description: 'Failing to neutralize leaves hair in alkaline state — cuticle stays open, causing damage and fading' },
            { label: 'TEST', description: 'Some neutralizers change color to indicate pH balance has been restored' },
          ],
          facts: [
            { text: 'Acid + Alkali = Water + Salt. This is the fundamental neutralization reaction.' },
            { text: 'Always use neutralizing shampoo after perms, relaxers, and color services. Skipping this step causes long-term damage.' },
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
          description: 'Water is purified by boiling, filtration, or distillation. Distilled water is purest — no minerals or contaminants.',
        },
        {
          icon: 'AlertTriangle',
          title: 'BARBER IMPACT',
          description: 'Hard water reduces shampoo effectiveness and leaves hair dull. In hard water areas, use clarifying shampoo weekly to remove mineral buildup.',
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
            { label: 'BALANCING', description: 'For oily scalps. Regulates sebum production without over-drying the hair shaft.' },
            { label: 'CLARIFYING', description: 'Removes buildup, minerals, and residue. Use weekly, not daily — can be drying.' },
            { label: 'COLOR-ENHANCING', description: 'Maintains and extends hair color. Contains color-depositing pigments and UV protection.' },
            { label: 'CONDITIONING / MOISTURIZING', description: 'For dry or damaged hair. Contains oils and proteins to restore moisture.' },
            { label: 'DRY / POWDER', description: 'Waterless cleansing. Absorbs oil and refreshes hair between washes. Popular for busy clients.' },
            { label: 'MEDICATED', description: 'Contains active ingredients for dandruff or scalp conditions. Follow label directions.' },
            { label: 'NEUTRALIZING', description: 'Used after chemical services to restore acidic pH. Essential after perms and relaxers.' },
            { label: 'SULFATE-FREE', description: 'Gentler cleansing for sensitive scalps and color-treated hair. Less lather but less stripping.' },
            { label: 'THERAPEUTIC', description: 'Targets specific scalp conditions like psoriasis or dermatitis. May require medical guidance.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Clarifying shampoo removes buildup but can dry hair if overused. Recommend weekly, not daily.' },
            { text: 'Sulfate-free shampoos produce less lather but are gentler on sensitive scalps and chemically treated hair.' },
          ],
        },
        {
          id: 'conditioner-types',
          label: 'CONDITIONERS',
          title: 'CONDITIONER TYPES & pH',
          bullets: [
            { label: 'FUNCTION', description: 'Restore moisture and protein, close the cuticle, improve manageability and shine' },
            { label: 'IDEAL pH', description: '3.0–5.5 — acidic range that closes the cuticle and smooths the hair surface' },
            { label: 'INSTANT / RINSE-OUT', description: 'Applied after shampooing, left briefly, then rinsed. Daily use.' },
            { label: 'TREATMENT / REPAIR', description: 'Deep conditioning with higher protein/moisture content. Left on longer for damaged hair.' },
            { label: 'LEAVE-IN', description: 'Not rinsed out. Provides ongoing protection and moisture throughout the day.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Conditioner pH is 3.0–5.5. This acidity closes the cuticle and locks in moisture.' },
            { text: 'Leave-in conditioners protect against heat and environmental damage. Recommend for clients who heat-style daily.' },
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
            { label: 'SKIPPING THE PATCH TEST', description: 'New chemical service? Always patch test 24–48 hours before. Allergic reactions can cause burns, blisters, and permanent hair loss.' },
            { label: 'IGNORING pH LEVELS', description: 'Using alkaline products on damaged hair or acidic products on oily scalps creates problems. Match pH to hair condition.' },
            { label: 'NOT READING SDS SHEETS', description: 'Safety Data Sheets tell you hazards, first aid, and handling for every chemical. OSHA requires them. Know where they are in your shop.' },
            { label: 'ASSUMING ALL SHAMPOOS ARE THE SAME', description: 'Clarifying, medicated, neutralizing, and sulfate-free shampoos serve different purposes. Using the wrong type damages hair or wastes money.' },
            { label: 'FORGETTING TO NEUTRALIZE', description: 'After perms, relaxers, and color services, neutralizing shampoo restores acidic pH. Skipping this leaves cuticle open and causes damage.' },
          ],
          facts: [
            { text: 'REMEMBER: A patch test is not optional for chemical services. It is a legal and safety requirement in most states.' },
            { text: 'REMEMBER: SDS sheets must be accessible to all employees. Failing to provide them is an OSHA violation.' },
          ],
        },
        {
          id: 'remember',
          label: 'REMEMBER THIS',
          title: 'KEY FACTS TO LOCK IN',
          bullets: [
            { label: 'ORGANIC = CARBON', description: 'If it was alive or came from something alive, it is organic. Gasoline, plastics, proteins, oils.' },
            { label: 'INORGANIC = NO CARBON', description: 'Water, minerals, metals, ammonia. Most disinfectants are inorganic.' },
            { label: 'PHYSICAL CHANGE = REVERSIBLE', description: 'Ice melts, water freezes. No new substance forms. Temporary hair color is a physical change.' },
            { label: 'CHEMICAL CHANGE = PERMANENT', description: 'Hair color oxidation, perming, rusting. New substances form. Cannot be reversed.' },
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
            { label: 'PERFORM PATCH TESTS', description: 'Apply a small amount behind the ear or on the inner arm. Wait 24–48 hours. No reaction = proceed.' },
            { label: 'MATCH PRODUCTS TO CLIENT', description: 'Consider hair type, condition, chemical history, and scalp sensitivity. One size does not fit all.' },
            { label: 'NEVER MIX UNFAMILIAR CHEMICALS', description: 'When in doubt, do not mix. Incompatible chemicals create toxic fumes, explosions, or severe burns.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: OSHA requires SDS sheets for all hazardous chemicals. You must know where they are and how to read them.' },
            { text: 'BOARD EXAM ALERT: Patch tests are required before chemical services in most states. Skipping them is negligence.' },
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
      content: 'These chemistry concepts appear on EVERY state board exam. Miss them, and you fail.\n\n1. ORGANIC VS INORGANIC: Organic = carbon-containing (living or once-living). Inorganic = no carbon (water, minerals, metals).\n\n2. MATTER: Anything with volume and mass. Exists as solid, liquid, or gas.\n\n3. ELEMENTS: Simplest form of matter. 118 known, 98 natural.\n\n4. ATOMS: Smallest particle retaining chemical identity. Protons (+), neutrons, electrons (–).\n\n5. MOLECULES: Two or more atoms combined in fixed proportions.\n\n6. COMPOUNDS: Different elements chemically united with fixed composition. Oxides, acids, bases, salts.\n\n7. PHYSICAL VS CHEMICAL CHANGE: Physical = form changes, no new substance (ice melting). Chemical = new substance forms (hair color oxidation).\n\n8. PURE SUBSTANCE: Fixed composition (elements or compounds). MIXTURE: Variable composition, no fixed proportions.\n\n9. OXIDATION: Gain of oxygen OR loss of hydrogen. Always paired with reduction.\n\n10. REDUCTION: Loss of oxygen OR gain of hydrogen. Always paired with oxidation.\n\n11. EXOTHERMIC: Releases heat. ENDOTHERMIC: Absorbs heat.\n\n12. SOLUTIONS: Stable, clear, uniform. Do NOT separate.\n\n13. SUSPENSIONS: Unstable, cloudy, particles settle. SHAKE BEFORE USE.\n\n14. EMULSIONS: Oil + water mixed by surfactant. Most barber products are oil-in-water emulsions.\n\n15. SURFACTANTS: Hydrophilic head + lipophilic tail. Reduce surface tension.\n\n16. pH SCALE: 0–6.9 acidic, 7 neutral, 7.1–14 alkaline. Hair natural pH = 4.5–5.5.\n\n17. ACIDS ON HAIR: Close cuticle, harden, improve sheen. pH 0–1 dissolves hair.\n\n18. ALKALIS ON HAIR: Open cuticle, swell, soften. pH 10–14 dissolves hair.\n\n19. NEUTRALIZATION: Acid + Alkali = Water + Salt. Used after chemical services.\n\n20. SOFT WATER: Low minerals, lathers well. HARD WATER: High minerals, poor lather, leaves buildup.\n\n21. SHAMPOO SURFACTANTS: Anionic (cleanse), Cationic (condition), Nonionic (mild), Amphoteric (gentle).\n\n22. CONDITIONER pH: 3.0–5.5 — acidic to close cuticle.\n\n23. HYDROGEN PEROXIDE: 3–5% antiseptic, 20–40 volume for bleaching/color. Primary oxidizing agent.\n\n24. USP: United States Pharmacopeia — sets standards for cosmetic ingredients.\n\n25. SAFETY: Always read labels, follow manufacturer directions, check SDS, perform patch tests, and match products to client hair/skin type.',
      highlight: 'MEMORIZE THESE 25 POINTS',
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
