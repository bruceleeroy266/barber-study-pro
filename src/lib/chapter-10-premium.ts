// Chapter 10: Properties and Disorders of the Hair and Scalp — PREMIUM IMMERSIVE EXPERIENCE
// THE HAIR LAB — Hair Science, Analysis & Client Care

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// HAIR LAB THEME — Scientific Precision
// Deep amethyst / Clinical teal / Study gold / Clean white
// Feels like: A modern hair-and-scalp analysis lab behind the barbershop
// ═══════════════════════════════════════════════

export const chapter10PremiumTheme: ChapterTheme = {
  primary: '#9D4EDD',
  primaryLight: '#C77DFF',
  primaryDark: '#7B2CBF',
  secondary: '#00B4D8',
  background: 'rgba(22, 20, 28, 0.96)',
  backgroundAlt: 'rgba(32, 30, 40, 0.92)',
  surface: '#16141C',
  border: 'rgba(157, 78, 221, 0.25)',
  text: '#F0E6FF',
  textMuted: '#A89BB8',
  highlight: '#FFB703',
  timeline: {
    line: 'rgba(157, 78, 221, 0.35)',
    iconBg: '#201E28',
    iconBorder: '#9D4EDD',
  },
  quote: {
    border: 'rgba(157, 78, 221, 0.4)',
    icon: 'rgba(157, 78, 221, 0.3)',
    bg: 'rgba(22, 20, 28, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(157, 78, 221, 0.15)',
    activeBorder: 'rgba(157, 78, 221, 0.5)',
    activeText: '#C77DFF',
    inactiveBg: 'rgba(22, 20, 28, 0.7)',
    inactiveBorder: 'rgba(157, 78, 221, 0.12)',
    inactiveText: '#A89BB8',
    panelBg: 'rgba(22, 20, 28, 0.85)',
    panelBorder: 'rgba(157, 78, 221, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(157, 78, 221, 0.1)',
    headerText: '#C77DFF',
    dot: 'rgba(157, 78, 221, 0.6)',
    line: 'rgba(157, 78, 221, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(157, 78, 221, 0.15)',
    iconColor: '#9D4EDD',
    cardBorder: 'rgba(157, 78, 221, 0.2)',
  },
  milestone: {
    yearColor: '#9D4EDD',
    border: 'rgba(157, 78, 221, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(157, 78, 221, 0.4)',
    checkColor: '#9D4EDD',
    bg: 'rgba(22, 20, 28, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(22, 20, 28, 0.7)',
    border: 'rgba(157, 78, 221, 0.18)',
    highlightColor: '#FFB703',
  },
  challengeCard: {
    badgeBg: 'rgba(255, 183, 3, 0.15)',
    badgeText: '#FFB703',
    cardBorder: 'rgba(157, 78, 221, 0.22)',
    completedBg: 'rgba(0, 230, 118, 0.1)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(255, 183, 3, 0.06)',
    optionBorder: 'rgba(157, 78, 221, 0.18)',
    correctBg: 'rgba(0, 230, 118, 0.1)',
    incorrectBg: 'rgba(255, 82, 82, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(157, 78, 221, 0.15)',
    levelBadgeText: '#C77DFF',
    rewardBg: 'rgba(0, 230, 118, 0.1)',
    rewardText: '#00E676',
  },
  actionPrompt: {
    cardBorder: 'rgba(157, 78, 221, 0.18)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
    benefitBg: 'rgba(157, 78, 221, 0.08)',
    benefitBorder: 'rgba(157, 78, 221, 0.25)',
  },
}

// ═══════════════════════════════════════════════
// PREMIUM IMMERSIVE CHAPTER 10 CONTENT
// ═══════════════════════════════════════════════

export const chapter10PremiumContent: ChapterContent = {
  chapterNumber: 10,
  title: 'PROPERTIES AND DISORDERS OF THE HAIR AND SCALP',
  subtitle: 'Enter the Hair Lab — Master Hair Science, Analysis & Client Care',
  theme: chapter10PremiumTheme,
  sections: [
    // ═══════════════════════════════════════════
    // SECTION 1: WELCOME TO THE HAIR LAB
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'hair-lab-welcome',
      title: '🔬 WELCOME TO THE HAIR LAB',
      content: 'Every client brings different hair and scalp characteristics to the chair. The scientific study of hair, its disorders, and care is called TRICHOLOGY. For a barber, the practical goal is to understand hair structure, observe hair and scalp condition, choose services carefully, and recognize when a concern is outside barbering scope.\n\nThis chapter builds hair-analysis skills: understanding structure, anticipating how hair may respond to services, recognizing observable warning signs, and knowing when a service should be modified, paused, or referred. The client who trusts you with their hair deserves careful observation and sound professional boundaries.',
      highlight: 'READ THE HAIR — ANALYZE THE SCALP — PROTECT THE CLIENT',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: WHY TRICHOLOGY MATTERS
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'why-trichology-matters',
      title: 'WHY THE HAIR LAB MATTERS',
      subtitle: 'Three reasons hair-and-scalp knowledge improves service decisions',
      cards: [
        {
          icon: 'Microscope',
          title: 'ANALYSIS PRECISION',
          text: 'Hair and scalp analysis supports safer service decisions. Texture, density, porosity, elasticity, and scalp condition can affect technique and chemical-service planning.',
        },
        {
          icon: 'ShieldAlert',
          title: 'CLIENT SAFETY',
          text: 'Observable scalp conditions, parasites, irritation, or compromised hair can change whether and how a service should proceed. Hair-and-scalp knowledge helps the barber identify service-safety concerns without making a medical diagnosis.',
        },
        {
          icon: 'Award',
          title: 'PROFESSIONAL COMMUNICATION',
          text: 'When you can explain hair structure and behavior, analyze service-relevant properties, and recognize concerns that may require referral, you can communicate more clearly and make more informed service decisions.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: TRICHOLOGY SKILL PROGRESSION
    // ═══════════════════════════════════════════
    {
      type: 'levelUp',
      id: 'trichology-certification',
      title: '🔬 TRICHOLOGY SKILL PROGRESSION',
      subtitle: 'Progress from foundational observation to stronger hair-and-scalp analysis',
      levels: [
        {
          level: 'Level 1',
          title: 'Hair Observer',
          description: 'You know the basics: hair structure, growth cycles, and common textures. You can perform a basic scalp analysis before services.',
          reward: 'Safe Service Badge — Clients trust your careful pre-service checks',
        },
        {
          level: 'Level 2',
          title: 'Structure Analyst',
          description: 'You understand the cortex, cuticle, and medulla. You know how chemical services affect hair bonds. You can assess porosity and elasticity with confidence.',
          reward: 'Chemical Service Guardian — Your color and chemical work is consistently safe',
        },
        {
          level: 'Level 3',
          title: 'Scalp Detective',
          description: 'You recognize normal vs. abnormal scalp conditions. You know contagious vs. non-contagious disorders. You refer appropriately and protect your station.',
          reward: 'Health Protector — Clients and coworkers look to you for scalp safety guidance',
        },
        {
          level: 'Level 4',
          title: 'Growth Specialist',
          description: 'You understand hair-loss patterns and growth phases and can discuss observable changes with empathy while keeping medical treatment decisions outside barbering scope.',
          reward: 'Trusted Advisor — Clients confide in you about sensitive hair concerns',
        },
        {
          level: 'Level 5',
          title: 'Hair & Scalp Analysis Leader',
          description: 'You connect hair structure, growth, analysis, disorders, and service-safety concepts and can explain the professional boundary between observation and medical diagnosis.',
          reward: 'Analysis Leader — You apply Chapter 10 concepts consistently and within scope',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 4: HAIR STRUCTURE — ROOT & SHAFT
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'hair-structure-intro',
      title: 'THE ANATOMY OF HAIR',
      content: 'Hair is a KERATINIZED appendage of the skin — meaning it is made of dead protein cells pushed upward from living roots. Every strand has two main parts: the ROOT (below the skin surface) and the SHAFT (the visible portion).\n\nUnderstanding hair structure is not academic trivia — it is the foundation of every service you perform. Chemical services target specific layers. Cutting techniques interact with the cuticle. Product absorption depends on porosity, which is determined by cuticle condition.\n\nKEY STUDY POINT: Hair is made primarily of keratin protein. The cortex contains pigment and side bonds that are directly involved in many chemical-service effects.',
      highlight: 'ROOT = LIVING GROWTH | SHAFT = VISIBLE DEAD PROTEIN',
    },

    // ═══════════════════════════════════════════
    // SECTION 5: ROOT STRUCTURES
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'root-structures',
      title: 'ROOT STRUCTURES — THE FOUNDATION BELOW',
      subtitle: 'What lives beneath the scalp determines what grows above it',
      tabs: [
        {
          id: 'follicle',
          label: 'FOLLICLE',
          title: 'HAIR FOLLICLE — THE GROWTH TUBE',
          bullets: [
            { label: 'DEFINITION', description: 'A tubelike depression in the skin containing the hair root' },
            { label: 'FUNCTION', description: 'Houses and protects the growing hair root; provides structural support for emerging hair' },
            { label: 'BARBER RELEVANCE', description: 'Healthy follicles = healthy hair growth. Damaged follicles may produce weak or no hair. Inflammation around follicles signals infection.' },
          ],
          facts: [
            { text: 'KEY REVIEW: The follicle is the living portion of hair. The shaft is dead keratin.' },
            { text: 'Folliculitis refers to inflammation of hair follicles. Avoid working directly over inflamed or compromised areas and keep the service decision within barbering scope.' },
          ],
        },
        {
          id: 'bulb',
          label: 'BULB',
          title: 'HAIR BULB — THE GROWTH ENGINE',
          bullets: [
            { label: 'DEFINITION', description: 'The club-shaped base of the hair root covering the dermal papilla' },
            { label: 'FUNCTION', description: 'Contains living cells that divide and push upward, forming the hair shaft' },
            { label: 'BARBER RELEVANCE', description: 'A healthy bulb means active growth. A damaged or miniaturized bulb means thinning or hair loss.' },
          ],
          facts: [
            { text: 'The bulb is the only truly "living" part of the hair. Everything above it is dead protein.' },
            { text: 'In androgenic alopecia, the bulb miniaturizes over time, producing progressively thinner hair.' },
          ],
        },
        {
          id: 'papilla',
          label: 'PAPILLA',
          title: 'DERMAL PAPILLA — THE MOTHER OF HAIR',
          bullets: [
            { label: 'DEFINITION', description: 'A small, cone-shaped elevation at the base of the hair bulb containing blood vessels and nerves' },
            { label: 'FUNCTION', description: 'Supplies oxygen, nutrients, and nerve signals essential for hair growth' },
            { label: 'BARBER RELEVANCE', description: 'Without blood supply from the papilla, hair cannot grow. Scalp massage stimulates circulation to papillae.' },
          ],
          facts: [
            { text: 'KEY REVIEW: The dermal papilla is called "the mother of the hair" because it nourishes growth.' },
            { text: 'Poor circulation = undernourished papillae = weaker hair growth.' },
          ],
        },
        {
          id: 'arrector',
          label: 'ARRECTOR PILI',
          title: 'ARRECTOR PILI — THE GOOSE BUMP MUSCLE',
          bullets: [
            { label: 'DEFINITION', description: 'A small involuntary muscle attached to the hair follicle' },
            { label: 'FUNCTION', description: 'Contracts to make hair stand upright — causing "goose bumps"' },
            { label: 'BARBER RELEVANCE', description: 'When cold or frightened, arrector pili muscles contract. This is why hair "stands up" during certain services or emotions.' },
          ],
          facts: [
            { text: 'Arrector pili muscles are controlled by motor nerve fibers.' },
            { text: 'When the muscle contracts, it also squeezes the sebaceous gland, releasing sebum onto the hair.' },
          ],
        },
        {
          id: 'sebaceous',
          label: 'SEBACEOUS GLAND',
          title: 'SEBACEOUS GLAND — THE NATURAL OIL FACTORY',
          bullets: [
            { label: 'DEFINITION', description: 'An oil-producing gland associated with the hair follicle' },
            { label: 'FUNCTION', description: 'Produces sebum — a natural oil that lubricates the hair and skin, keeping both soft and pliable' },
            { label: 'BARBER RELEVANCE', description: 'Sebum production affects hair condition. Overproduction = oily scalp and hair. Underproduction = dryness and brittleness. Proper cleansing and conditioning balance sebum levels.' },
          ],
          facts: [
            { text: 'KEY STUDY POINT: Sebaceous glands are associated with hair follicles and secrete sebum that lubricates the hair and skin.' },
            { text: 'Hormonal changes (especially during puberty) can cause sebaceous glands to become overactive, leading to oily scalp and acne.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 6: SHAFT LAYERS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'shaft-layers',
      title: 'SHAFT LAYERS — THE THREE COATS',
      subtitle: 'Cuticle, cortex, medulla — know what each does and why it matters',
      tabs: [
        {
          id: 'cuticle',
          label: 'CUTICLE',
          title: 'CUTICLE — THE PROTECTIVE SHIELD',
          bullets: [
            { label: 'STRUCTURE', description: 'Outermost layer of overlapping scale-like cells that lie flat like shingles on a roof' },
            { label: 'FUNCTION', description: 'Protects the inner structure; provides shine when smooth and flat; controls moisture entry and exit' },
            { label: 'DAMAGE SIGN', description: 'Raised or missing scales = rough texture, dull appearance, high porosity, breakage' },
          ],
          facts: [
            { text: 'KEY REVIEW: The cuticle must be intact for healthy hair. Damage raises scales and increases porosity.' },
            { text: 'When the cuticle is smooth and flat, hair reflects light and appears shiny. Damaged cuticles scatter light, causing dullness.' },
          ],
        },
        {
          id: 'cortex',
          label: 'CORTEX',
          title: 'CORTEX — THE HEART OF THE HAIR (~90%)',
          bullets: [
            { label: 'STRUCTURE', description: 'The middle and main layer; contains melanin granules, cortical cells, and side bonds' },
            { label: 'FUNCTION', description: 'Provides strength, elasticity, and color; it contains pigment and side bonds affected by chemical services.' },
            { label: 'BARBER RELEVANCE', description: 'Color, perms, and relaxers all work on the cortex. Damage here is permanent and cumulative.' },
          ],
          facts: [
            { text: 'KEY STUDY POINT: The cortex is approximately 90% of hair weight and contains pigment and side bonds central to chemical-service changes.' },
            { text: 'The cortex contains three types of side bonds: hydrogen, salt, and disulfide. These determine how hair responds to styling and chemicals.' },
          ],
        },
        {
          id: 'medulla',
          label: 'MEDULLA',
          title: 'MEDULLA — THE INNER CORE',
          bullets: [
            { label: 'STRUCTURE', description: 'Innermost layer; may be absent in fine or blond hair' },
            { label: 'FUNCTION', description: 'Provides structural support; contains air spaces that affect hair density and insulation' },
            { label: 'BARBER RELEVANCE', description: 'Fine or blond hair often lacks a medulla. This does not indicate poor health — it is simply genetic variation.' },
          ],
          facts: [
            { text: 'The medulla is the least understood layer and has minimal impact on chemical services.' },
            { text: 'Coarse hair typically has a well-developed medulla; fine hair may have none at all.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 6B: PEPTIDE (END) BONDS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'peptide-bonds',
      title: 'PEPTIDE BONDS — THE BACKBONE OF HAIR',
      content: 'Before the side bonds cross-link polypeptide chains, those chains must exist. PEPTIDE BONDS (also called END BONDS) are the strong chemical bonds that join amino acids together end-to-end in a definite order. Think of them as the backbone of the hair structure.\n\nUnlike side bonds, peptide bonds are NOT broken by water, heat, or normal chemical services. They are only broken by cutting the hair or by depilatory chemicals — which literally dissolve the hair by destroying these bonds permanently.\n\nKEY REVIEW: Peptide bonds join amino acids into polypeptide chains. Side bonds (hydrogen, salt, disulfide) cross-link those chains. Peptide bonds are strong and permanent; side bonds can be temporarily or chemically altered.',
      highlight: 'PEPTIDE BONDS = THE CHAIN | SIDE BONDS = THE CROSS-LINKS',
    },

    // ═══════════════════════════════════════════
    // SECTION 7: SIDE BONDS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'side-bonds',
      title: 'THE THREE SIDE BONDS OF THE CORTEX',
      subtitle: 'These bonds determine everything — from wet styling to permanent changes',
      features: [
        {
          icon: 'Droplets',
          title: 'HYDROGEN BOND',
          description: 'Physical, weak bond. Broken by water or heat. Reformed by drying/cooling. Allows temporary styling — wet sets, blow-drying, curling irons.',
        },
        {
          icon: 'FlaskConical',
          title: 'SALT BOND',
          description: 'Physical, weak bond. Broken by acids or alkalis. Reformed by normalizing pH. Affected by product pH and environmental conditions.',
        },
        {
          icon: 'Link',
          title: 'DISULFIDE BOND',
          description: 'Chemical, strong bond. Broken by permanent waves and chemical relaxers. Reformed by neutralizers. Determines permanent shape changes.',
        },
        {
          icon: 'AlertTriangle',
          title: 'KEY REVIEW',
          description: 'Hydrogen + salt = temporary styling. Disulfide = permanent changes. Peptide (end) bonds are strong and only broken by cutting or depilatories.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8: PIGMENT & WAVE PATTERN
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'pigment-wave',
      title: 'PIGMENT & WAVE PATTERN',
      subtitle: 'Why hair is the color and shape it is',
      tabs: [
        {
          id: 'melanin',
          label: 'MELANIN',
          title: 'MELANIN — THE COLOR MAKERS',
          bullets: [
            { label: 'EUMELANIN', description: 'Brown/black pigment. More eumelanin = darker hair.' },
            { label: 'PHEOMELANIN', description: 'Red/yellow pigment. More pheomelanin = lighter, warmer tones.' },
            { label: 'GRAY/WHITE', description: 'Little or no melanin production. The hair appears transparent/white because light passes through without pigment absorption.' },
          ],
          facts: [
            { text: 'KEY REVIEW: Eumelanin = brown/black. Pheomelanin = red/yellow. Gray = little/no melanin.' },
            { text: 'Melanin is produced in the hair bulb by melanocytes — the same cells that produce skin pigment.' },
          ],
        },
        {
          id: 'wave',
          label: 'WAVE PATTERN',
          title: 'WAVE PATTERN — THE CROSS-SECTION SECRET',
          bullets: [
            { label: 'ROUND', description: 'Straight hair. Round cross-section allows light reflection and smooth texture.' },
            { label: 'OVAL', description: 'Wavy or curly hair. Oval cross-section creates bends and curves in the strand.' },
            { label: 'ELLIPTICAL', description: 'Extremely curly/kinky hair. Flat cross-section creates tight coils. Low elasticity, breaks easily, requires gentle handling.' },
          ],
          facts: [
            { text: 'KEY REVIEW: Wave pattern is determined by cross-section shape — Round = straight, Oval = wavy, Elliptical = curly.' },
            { text: 'Extremely curly hair has LOW ELASTICITY and breaks easily. It requires extra conditioning and gentle handling.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8B: KERATINIZATION & COHNS ELEMENTS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'keratinization-cohns',
      title: 'KERATINIZATION & THE COHNS ELEMENTS',
      subtitle: 'How living cells become dead protein — and what hair is made of',
      features: [
        {
          icon: 'Sparkles',
          title: 'KERATINIZATION',
          description: 'The process where living cells in the hair bulb mature, fill with fibrous keratin protein, lose their nuclei, and die. By the time hair emerges from the scalp, it is completely keratinized and non-living.',
        },
        {
          icon: 'FlaskConical',
          title: 'CARBON — 51%',
          description: 'The primary building block of hair protein. Carbon atoms form the backbone of every amino acid in the hair structure.',
        },
        {
          icon: 'Droplets',
          title: 'OXYGEN — 21%',
          description: 'Essential for the chemical structure of keratin. Oxygen helps form the bonds that give hair its strength and stability.',
        },
        {
          icon: 'Zap',
          title: 'HYDROGEN — 6%',
          description: 'Critical for hydrogen bonding — one of the three side bonds that allow temporary styling and shape changes.',
        },
        {
          icon: 'Atom',
          title: 'NITROGEN — 17%',
          description: 'Found in the amino groups of amino acids. Nitrogen is essential for protein synthesis and hair formation.',
        },
        {
          icon: 'Circle',
          title: 'SULFUR — 5%',
          description: 'The key element in disulfide bonds — the strongest bond type. More sulfur = stronger, more resistant hair.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 9: HAIR GROWTH CYCLE
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'growth-cycle',
      title: 'THE HAIR GROWTH CYCLE',
      subtitle: 'Every strand lives, transitions, rests, and sheds — understand the rhythm',
      features: [
        {
          icon: 'Sprout',
          title: 'ANAGEN — GROWTH PHASE',
          description: 'About 2–10 years. Roughly 90% of scalp hair is in this growth phase. Active cell division in the bulb pushes the strand upward, and average growth is about ½ inch per month.',
        },
        {
          icon: 'ArrowRightLeft',
          title: 'CATAGEN — TRANSITION PHASE',
          description: 'The transition phase. The follicle shrinks, the bulb changes, and active growth stops before the resting phase.',
        },
        {
          icon: 'Moon',
          title: 'TELOGEN — RESTING PHASE',
          description: 'About 3–6 months. Less than 10% of scalp hair is in this resting/shedding phase. Normal shedding is about 75–100 hairs per day.',
        },
        {
          icon: 'TrendingUp',
          title: 'GROWTH RATE FACTORS',
          description: 'Genetics, age, hormones, nutrition, and health all influence growth rate. Stress, illness, and poor diet can push hair prematurely into telogen, causing increased shedding.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 10: HAIR ANALYSIS PROTOCOL
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'hair-analysis-protocol',
      title: '🔍 THE HAIR ANALYSIS PROTOCOL',
      content: 'A pre-service hair and scalp analysis helps identify the properties and conditions that matter to the planned service. Chapter 10 emphasizes checking the scalp before the hair, especially before chemical services.\n\nSIGHT: Observe whether the scalp appears dry or oily and note visible irritation, abrasions, parasites, broken hairs, or unusual patterns.\n\nTOUCH: Evaluate texture, density, porosity, and elasticity using the chapter\'s analysis methods.\n\nHEARING AND SMELL: Listen to the client\'s concerns and service history, and note relevant observations without using them to diagnose a medical condition.\n\nKEY STUDY POINT: Do not begin a service when parasites are present, and do not proceed with a chemical service when irritation or abrasions make the service unsafe.',
      highlight: 'ANALYZE BEFORE YOU ACT — MATCH THE ANALYSIS TO THE SERVICE',
    },

    // ═══════════════════════════════════════════
    // SECTION 11: TEXTURE, DENSITY, POROSITY, ELASTICITY
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'analysis-factors',
      title: 'THE FOUR FACTORS OF HAIR ANALYSIS',
      subtitle: 'Texture, density, porosity, elasticity — master them all',
      tabs: [
        {
          id: 'texture',
          label: 'TEXTURE',
          title: 'TEXTURE — THE DIAMETER OF THE STRAND',
          bullets: [
            { label: 'COARSE', description: 'Thick, strong strand. Holds styles well. Can be resistant to chemical services.' },
            { label: 'MEDIUM', description: 'Most common texture. Balanced strength and manageability.' },
            { label: 'FINE', description: 'Thin, fragile strand. Processes quickly. Requires gentle handling and lower chemical strength.' },
          ],
          facts: [
            { text: 'Texture is genetic and does not change over time (except with age-related thinning).' },
            { text: 'Fine hair is more prone to damage from heat and chemicals. Adjust your technique accordingly.' },
          ],
        },
        {
          id: 'density',
          label: 'DENSITY',
          title: 'DENSITY — HAIRS PER SQUARE INCH',
          bullets: [
            { label: 'THICK', description: 'Many hairs per square inch. Appears full and voluminous.' },
            { label: 'AVERAGE', description: 'Moderate number of hairs. Most common density.' },
            { label: 'THIN', description: 'Fewer hairs per square inch. May show scalp through the hair.' },
          ],
          facts: [
            { text: 'Density and texture are independent. A person can have fine hair but thick density, or coarse hair but thin density.' },
            { text: 'Thinning density may indicate hair loss — discuss gently and refer if appropriate.' },
          ],
        },
        {
          id: 'porosity',
          label: 'POROSITY',
          title: 'POROSITY — ABILITY TO ABSORB MOISTURE',
          bullets: [
            { label: 'RESISTANT (LOW)', description: 'Cuticle is compact and smooth. Hair repels moisture. Chemical services take longer to process.' },
            { label: 'NORMAL', description: 'Balanced cuticle condition. Absorbs and retains moisture appropriately.' },
            { label: 'POROUS/OVER-POROUS (HIGH)', description: 'Cuticle scales are raised or missing. Absorbs moisture quickly but cannot retain it. Feels rough, breaks easily. Often over-processed.' },
          ],
          facts: [
            { text: 'TEST: Slide fingers down a dry strand. Smooth = resistant. Rough = porous.' },
            { text: 'Overly porous hair has a compromised cuticle and absorbs moisture quickly. That condition should be considered when planning a chemical service.' },
          ],
        },
        {
          id: 'elasticity',
          label: 'ELASTICITY',
          title: 'ELASTICITY — STRETCH AND RETURN',
          bullets: [
            { label: 'NORMAL', description: 'Hair stretches and returns to original length without breaking. Indicates healthy cortex and strong side bonds.' },
            { label: 'LOW', description: 'Hair breaks when stretched. Indicates over-processing, heat damage, or weak side bonds. Do not perform chemical services.' },
          ],
          facts: [
            { text: 'TEST: Gently tug a wet strand. Healthy hair stretches and returns. Damaged hair snaps.' },
            { text: 'Low elasticity signals a greater risk of breakage and should be considered before a chemical service.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 12: HAIR LOSS (ALOPECIA)
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'alopecia-intro',
      title: 'UNDERSTANDING HAIR LOSS (ALOPECIA)',
      content: 'Hair loss can be an emotionally sensitive client concern. Chapter 10 introduces patterns of abnormal hair loss so the barber can recognize terminology, communicate respectfully, and understand when referral is appropriate.\n\nThe barber\'s role is not to diagnose or treat medical hair loss. Focus on observable patterns, service implications, and professional referral boundaries.\n\nKEY STUDY POINT: Androgenic alopecia is presented as a common form of pattern hair loss associated with heredity, age, and hormonal factors.',
      highlight: 'RECOGNIZE — EMPATHIZE — REFER',
    },

    // ═══════════════════════════════════════════
    // SECTION 13: TYPES OF ALOPECIA
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'alopecia-types',
      title: 'TYPES OF ABNORMAL HAIR LOSS',
      subtitle: 'Know the patterns so you can guide clients appropriately',
      tabs: [
        {
          id: 'androgenic',
          label: 'ANDROGENIC',
          title: 'ANDROGENIC ALOPECIA — PATTERN BALDNESS',
          bullets: [
            { label: 'CAUSE', description: 'Genetic + hormonal (dihydrotestosterone/DHT). Causes follicle miniaturization over time.' },
            { label: 'PATTERN', description: 'Men: receding hairline and crown thinning. Women: diffuse thinning over the crown.' },
            { label: 'SOURCE CONTEXT', description: 'Chapter 10 discusses medical hair-loss treatments such as minoxidil and finasteride. Treatment selection belongs to qualified medical professionals and is not a barbering service decision.' },
          ],
          facts: [
            { text: 'KEY STUDY POINT: Androgenic alopecia is a pattern of hair loss associated in this chapter with heredity, age, and hormonal factors.' },
            { text: 'This is a medical condition — barbers should recognize it, empathize, and refer to a physician or dermatologist.' },
          ],
        },
        {
          id: 'areata',
          label: 'AREATA',
          title: 'ALOPECIA AREATA — AUTOIMMUNE PATCHES',
          bullets: [
            { label: 'CAUSE', description: 'Autoimmune — the body attacks its own hair follicles.' },
            { label: 'APPEARANCE', description: 'Sudden round or oval patches of complete hair loss. Smooth, non-scarred scalp beneath.' },
            { label: 'PROGNOSIS', description: 'May resolve spontaneously or progress. Totalis = complete scalp loss. Universalis = complete body loss.' },
          ],
          facts: [
            { text: 'Alopecia areata is NOT contagious and NOT caused by poor hygiene.' },
            { text: 'Emotional support matters — hair loss can be devastating to self-image.' },
          ],
        },
        {
          id: 'other',
          label: 'OTHER TYPES',
          title: 'OTHER TYPES OF HAIR LOSS',
          bullets: [
            { label: 'ALOPECIA TOTALIS', description: 'Complete loss of scalp hair. This is a medical hair-loss condition and is outside barbering treatment scope.' },
            { label: 'ALOPECIA UNIVERSALIS', description: 'Complete loss of body hair. This is a medical hair-loss condition and is outside barbering treatment scope.' },
            { label: 'ABNORMAL HAIR LOSS', description: 'When hair loss appears abnormal or outside ordinary shedding patterns, focus on observation, respectful communication, and appropriate referral rather than diagnosis.' },
          ],
          facts: [
            { text: 'KEY STUDY POINT: Alopecia totalis affects the scalp; alopecia universalis affects the body.' },
            { text: 'Barbers should recognize hair-loss terminology and keep diagnosis and treatment decisions outside barbering scope.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 13B: HAIR GROWTH PATTERNS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'growth-patterns',
      title: 'HAIR GROWTH PATTERNS',
      subtitle: 'How hair flows, swirls, and stands — and what it means for your cuts',
      features: [
        {
          icon: 'ArrowRight',
          title: 'HAIR STREAM',
          description: 'Hair that flows in the same direction, resulting from follicles arranged and sloping uniformly. When two streams slope in opposite directions, they form a natural part.',
        },
        {
          icon: 'RotateCw',
          title: 'WHORL',
          description: 'Hair that grows in a circular or swirl pattern. It is commonly seen at the crown and should be considered when planning a haircut.',
        },
        {
          icon: 'ArrowUp',
          title: 'COWLICK',
          description: 'A tuft of hair that stands straight up, usually at the front hairline but can be anywhere. Choose styles that minimize the upright effect — fighting a cowlick is a losing battle.',
        },
        {
          icon: 'AlertTriangle',
          title: 'KEY REVIEW',
          description: 'Shaving or cutting hair does NOT make it grow back faster, darker, or coarser. This is a myth. Blunt cutting may make hair appear thicker temporarily, but growth rate and texture are genetically determined.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 14: COMMON HAIR DISORDERS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'hair-disorders',
      title: 'COMMON HAIR DISORDERS',
      subtitle: 'Recognize these conditions and know your professional boundaries',
      features: [
        {
          icon: 'CircleDot',
          title: 'CANITIES',
          description: 'Graying of hair. Natural reduction or absence of melanin production. Not a disorder — a normal aging process. Some clients gray prematurely due to genetics or stress.',
        },
        {
          icon: 'Maximize',
          title: 'HYPERTRICHOSIS',
          description: 'Excessive hair growth in areas where hair does not normally grow. Can be genetic or medication-induced. Cosmetic concern — refer if sudden or unusual.',
        },
        {
          icon: 'Scissors',
          title: 'TRICHOPTILOSIS',
          description: 'Split ends. Chapter 10 identifies trichoptilosis as split ends of the hair shaft.',
        },
        {
          icon: 'Link',
          title: 'MONILETHRIX',
          description: 'Beaded hair with fragile sections that break easily.',
        },
        {
          icon: 'CircleDot',
          title: 'RINGED HAIR',
          description: 'A variation of canities (graying) with alternating bands of gray and pigmented hair throughout the strand. Purely cosmetic — no treatment needed, but clients may ask about color options.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 14B: SERVICE-SAFETY OBSERVATION
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'service-boundary-observation',
      title: 'OBSERVABLE SCALP CONDITIONS — SERVICE BOUNDARIES',
      content: 'Pre-service scalp analysis supports safe service decisions without turning observation into medical diagnosis. Check the scalp first and note service-relevant findings such as parasites, irritation, and abrasions.\n\nSERVICE DECISIONS: Do not begin a service when parasites are present. Do not proceed with chemical services when irritation or abrasions are present. When a condition is outside barbering scope or makes the planned service unsafe, use appropriate referral guidance rather than diagnosing or treating the condition.\n\nKEY STUDY POINT: Observe the scalp carefully, make the appropriate service-safety decision, follow sanitation requirements, and refer when needed.',
      highlight: 'OBSERVE — PROTECT — REFER WITHIN SCOPE',
    },

    // ═══════════════════════════════════════════
    // SECTION 15: SCALP DISORDERS — CONTAGIOUS
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'contagious-disorders',
      title: '🚫 CONTAGIOUS SCALP CONDITIONS — SERVICE SAFETY',
      subtitle: 'Recognize source-covered contagious conditions, avoid unsafe service over affected areas, follow sanitation requirements, and refer for appropriate medical evaluation.',
      items: [
        { text: 'TINEA CAPITIS (ringworm of scalp) — Fungal infection. Circular patches with scaling and broken hairs. Highly contagious.' },
        { text: 'TINEA BARBAE (ringworm of beard) — Fungal infection of beard area. Red, scaly patches with pustules. Highly contagious.' },
        { text: 'PEDICULOSIS CAPITIS (head lice) — Parasitic infestation. Itching, visible nits on hair shafts. Extremely contagious.' },
        { text: 'SCABIES — Itch mite infestation. Intense itching, burrows in skin. Contagious through close contact.' },
        { text: 'FOLLICULITIS BARBAE (bacterial) — Infected hair follicles. Pustules around beard hairs. Can be contagious.' },
        { text: 'FAVUS — Severe ringworm with thick yellow crusts. Contagious and can cause permanent scarring hair loss.' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 16: SCALP DISORDERS — NON-CONTAGIOUS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'non-contagious-disorders',
      title: 'NON-CONTAGIOUS SCALP CONDITIONS',
      subtitle: 'Manageable conditions you will see regularly — know how to handle them',
      features: [
        {
          icon: 'Cloud',
          title: 'DANDRUFF',
          description: 'Pityriasis simplex or steatoides. Flaking of the scalp from excess cell turnover. Manageable with proper products. Not contagious. Gentle brushing helps distribute oils.',
        },
        {
          icon: 'AlertCircle',
          title: 'PSEUDOFOLLICULITIS (RAZOR BUMPS)',
          description: 'Ingrown hairs caused by shaving too closely or against grain. Curly hair is most susceptible. Prevent with proper technique, sharp blades, and grain-aware shaving.',
        },
        {
          icon: 'Thermometer',
          title: 'FURUNCLES & CARBUNCLES',
          description: 'A furuncle is an acute deep bacterial boil; a carbuncle is a cluster of connected boils. Chapter 10 directs referral for a carbuncle.' },
        {
          icon: 'ShieldCheck',
          title: 'PITYRIASIS / DANDRUFF',
          description: 'Chapter 10 describes pityriasis as flaky scalp skin and distinguishes capitis simplex from the greasy or waxy steatoides form. Malassezia overgrowth is associated with dandruff.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 17: THE BARBER'S DECISION FRAMEWORK
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'decision-framework',
      title: '⚖️ THE BARBER\'S DECISION FRAMEWORK',
      content: 'When an observation raises a service-safety concern, keep the decision within barbering scope:\n\nSTEP 1 — OBSERVE: Describe what you can see or feel without assigning a medical diagnosis.\n\nSTEP 2 — CHECK SERVICE SAFETY: Determine whether the planned service can proceed safely under the chapter guidance and your school, workplace, product, and state requirements.\n\nSTEP 3 — PAUSE WHEN NEEDED: Do not begin a service when parasites are present. For suspected contagious conditions or other concerns outside barbering scope, avoid working over the affected area and refer the client for appropriate medical evaluation.\n\nSTEP 4 — SANITATION: Follow required cleaning, disinfection, and exposure-control procedures for tools and the workstation.\n\nSTEP 5 — COMMUNICATE: Explain the service decision discreetly and professionally without diagnosing or prescribing treatment.\n\nKEY STUDY POINT: Chapter 10 supports observation, service-safety decisions, sanitation, and referral; licensing penalties and jurisdiction-specific enforcement must be verified from current state rules.',
      highlight: 'OBSERVE — PROTECT — REFER WHEN OUTSIDE SCOPE',
    },

    // ═══════════════════════════════════════════
    // SECTION 17B: SCALP ANALYSIS DO'S AND DON'TS
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'scalp-analysis-rules',
      title: 'SCALP ANALYSIS — DO\'S AND DON\'TS',
      subtitle: 'Source-aligned pre-service analysis reminders',
      items: [
        { text: 'DO: Check the scalp first for parasites, irritation, abrasions, and other service-relevant findings' },
        { text: 'DO: Check the SCALP first before analyzing the hair — scalp disorders can prohibit any service' },
        { text: 'DO: Use sight, hearing, smell, and touch as part of hair-and-scalp analysis' },
        { text: 'DO: Follow school, workplace, or state documentation requirements when they apply' },
        { text: 'DO: Recommend medical evaluation when a condition is outside barbering scope or makes the planned service unsafe' },
        { text: 'DON\'T: Scrape the scalp during analysis — this can cause irritation and spread infection' },
        { text: 'DON\'T: Begin the service when parasites are present; follow sanitation requirements and referral guidance' },
        { text: 'DON\'T: Proceed with chemical services if signs of irritation, abrasions, or inflammation exist' },
        { text: 'DON\'T: Diagnose or prescribe treatment; describe observable signs and make service-safety/referral decisions' },
        { text: 'DON\'T: Embarrass the client — explain discreetly and professionally' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 18: COMMON CONFUSIONS & MEMORY AIDS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'memory-aids',
      title: 'COMMON CONFUSIONS & MEMORY AIDS',
      subtitle: 'Avoid these mix-ups and lock in the key facts',
      tabs: [
        {
          id: 'confusions',
          label: 'CONFUSIONS',
          title: 'MIX-UPS THAT COST POINTS',
          bullets: [
            { label: 'Cuticle vs Cortex', description: 'Cuticle = outer protective layer. Cortex = middle layer, 90% of weight, target of chemical services. Do not confuse them.' },
            { label: 'Hydrogen vs Disulfide', description: 'Hydrogen = weak, temporary styling. Disulfide = strong, permanent changes. Know which services affect which bond.' },
            { label: 'Anagen vs Telogen', description: 'Anagen = growth (90% of hair). Telogen = resting/shedding (10%). Do not mix up the phases.' },
            { label: 'Contagious vs Non-Contagious', description: 'Ringworm, lice, scabies = contagious. Dandruff, seborrheic dermatitis, psoriasis = not contagious. Know the difference.' },
            { label: 'Androgenic vs Areata', description: 'Androgenic = gradual pattern baldness, genetic. Areata = sudden patches, autoimmune. Different causes, different patterns.' },
            { label: 'Porosity vs Elasticity', description: 'Porosity = ability to absorb moisture. Elasticity = ability to stretch and return. Test differently. Mean different things.' },
          ],
          facts: [
            { text: 'REMEMBER: The cortex is 90% of hair weight. The cuticle is just the protective outer layer.' },
            { text: 'REMEMBER: Disulfide bonds = permanent. Hydrogen and salt bonds = temporary.' },
          ],
        },
        {
          id: 'mnemonics',
          label: 'MNEMONICS',
          title: 'MEMORY TRICKS THAT WORK',
          bullets: [
            { label: 'HAIR LAYERS', description: 'Cuticle = COAT (outer coat). Cortex = CORE (heart of the hair). Medulla = MIDDLE (inner core).' },
            { label: 'BOND STRENGTH', description: 'Hydrogen = H2O = water = weak. Disulfide = DI = two sulfur atoms = strong chemical bond.' },
            { label: 'GROWTH PHASES', description: 'Anagen = ACTIVE growth. Catagen = CHANGING/transition. Telogen = TIRED/resting.' },
            { label: 'MELANIN TYPES', description: 'Eumelanin = EU = European = darker tones. Pheomelanin = PHEW = redheads = warm tones.' },
            { label: 'WAVE PATTERN', description: 'Round = Regular/straight. Oval = Wavy. Elliptical = Extra curly.' },
            { label: 'ANALYSIS FACTORS', description: 'T-T-P-E: Texture, Texture (density is about amount, but think T for Thickness), Porosity, Elasticity. Or use SIGHT: Sight, Inspection, Growth, Health, Texture.' },
          ],
          facts: [
            { text: 'MNEMONIC: "The cuticle is like a cuticle on your fingernail — the outer protective edge."' },
            { text: 'MNEMONIC: "Anagen = A for Active. Telogen = T for Tired."' },
          ],
        },
        {
          id: 'safety',
          label: 'SAFETY',
          title: 'SERVICE-SAFETY REMINDERS',
          bullets: [
            { label: 'ANALYZE FIRST', description: 'Analyze the scalp and hair before chemical services and consider any irritation, abrasions, parasites, porosity, and elasticity findings.' },
            { label: 'DO NOT DIAGNOSE', description: 'Stay within barbering scope: observe, communicate, make service-safety decisions, and refer without diagnosing.' },
            { label: 'STOP FOR CONTAGION', description: 'For suspected contagious conditions, avoid unsafe service, follow sanitation requirements, and refer when appropriate.' },
            { label: 'TEST ELASTICITY', description: 'Low elasticity indicates breakage risk and should affect chemical-service planning.' },
            { label: 'CHECK POROSITY', description: 'Overly porous hair has a compromised cuticle and should influence chemical-service planning.' },
            { label: 'INFECTION CONTROL', description: 'Follow required cleaning, disinfection, and exposure-control procedures when scalp conditions raise sanitation concerns.' },
          ],
          facts: [
            { text: 'KEY STUDY POINT: Follow current sanitation and licensing requirements when a contagious condition is suspected; penalties vary by jurisdiction.' },
            { text: 'Compromised hair can have a greater risk of breakage during chemical services, so porosity and elasticity findings should inform the service decision.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 19: KEY CHAPTER 10 STUDY POINTS
    // ═══════════════════════════════════════════
    // SECTION 19: KEY CHAPTER 10 STUDY POINTS
    // -------------------------------------------
    {
      type: 'contentBlock',
      id: 'board-exam-alerts',
      title: 'KEY CHAPTER 10 STUDY POINTS',
      content: 'These are high-value Chapter 10 distinctions from the available source material. Study the concepts and service-safety relationships rather than relying on unverified exam-frequency claims.',
      highlight: 'UNDERSTAND THE CORE DISTINCTIONS',
    },

    // -------------------------------------------
    // SECTION 20: APPLICATION SCENARIOS
    // -------------------------------------------
    {
      type: 'scenarioBlock',
      id: 'diagnostic-scenarios',
      title: 'APPLICATION SCENARIOS',
      subtitle: 'Shop situations that test Chapter 10 analysis and service-safety reasoning',
      scenarios: [
        {
          situation: 'During analysis, a client\'s hair feels rough and absorbs moisture quickly. What should the barber do with that observation?',
          options: [
            { letter: 'A', text: 'Treat the observation as a diagnosis of a medical hair disorder.', feedback: 'Incorrect. Hair analysis findings support service decisions but do not authorize medical diagnosis.' },
            { letter: 'B', text: 'Use the porosity finding when selecting and adjusting an appropriate cosmetic service.', feedback: 'Correct. Chapter 10 uses porosity as a service-relevant hair-analysis property.' },
            { letter: 'C', text: 'Ignore porosity because it has no relationship to service planning.', feedback: 'Incorrect. Porosity is one of the chapter\'s core analysis factors.' },
            { letter: 'D', text: 'Assume every client with porous hair needs the same chemical procedure.', feedback: 'Incorrect. Service decisions should use the full analysis and product directions rather than one universal response.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'A barber observes signs that could indicate a contagious scalp condition before beginning service. What is the safest Chapter 10 response?',
          options: [
            { letter: 'A', text: 'Continue the service and avoid discussing the observation.', feedback: 'Incorrect. A suspected contagious condition requires a safety-first service decision.' },
            { letter: 'B', text: 'Attempt to identify the exact disease and prescribe treatment.', feedback: 'Incorrect. Diagnosis and treatment are outside barbering scope.' },
            { letter: 'C', text: 'Pause the service, avoid unsafe contact or tool use, and recommend appropriate professional evaluation within scope and local requirements.', feedback: 'Correct. This preserves client safety, scope boundaries, and referral principles.' },
            { letter: 'D', text: 'Cover the area and proceed as long as the client agrees.', feedback: 'Incorrect. Client permission does not remove safety and infection-control responsibilities.' },
          ],
          correctAnswer: 'C',
        },
        {
          situation: 'A client asks the barber to tell them exactly what scalp disorder they have after the barber notices an unusual area. What should the barber do?',
          options: [
            { letter: 'A', text: 'Describe the observation without diagnosing and recommend evaluation when the concern is outside barbering scope.', feedback: 'Correct. Chapter 10 separates professional observation from medical diagnosis or treatment.' },
            { letter: 'B', text: 'Name the most likely condition so the client can buy medication.', feedback: 'Incorrect. A barber should not diagnose or direct medical treatment.' },
            { letter: 'C', text: 'Guarantee that the condition is harmless if there is no pain.', feedback: 'Incorrect. Lack of pain does not justify a medical conclusion.' },
            { letter: 'D', text: 'Perform a chemical service first and discuss the concern afterward.', feedback: 'Incorrect. Service safety should be evaluated before proceeding.' },
          ],
          correctAnswer: 'A',
        },
      ],
    },

    // -------------------------------------------
    // SECTION 21: ACTION PROMPTS
    // -------------------------------------------
    {
      type: 'actionPrompt',
      id: 'action-prompts',
      title: 'HAIR LAB ACTION ITEMS',
      subtitle: 'Practice source-covered analysis skills',
      prompts: [
        {
          action: 'Practice the Porosity Test',
          description: 'Slide your fingers down dry hair strands on 3-5 clients. Note which feel smooth (resistant) vs. rough (porous).',
          benefit: 'Builds tactile hair-analysis skill',
          timeframe: 'During your next 5 haircuts',
        },
        {
          action: 'Practice the Elasticity Test',
          description: 'Gently tug wet strands from the sink on 3 clients. Note which stretch and return vs. which break.',
          benefit: 'Prevents chemical service disasters before they happen',
          timeframe: 'During your next 3 shampoos',
        },
        {
          action: 'Inspect Your Tools',
          description: 'Check that your combs, brushes, and clippers are clean and disinfected. Contagious conditions spread through tools.',
          benefit: 'Protects every client who sits in your chair',
          timeframe: '5 minutes',
        },
        {
          action: 'Study Scalp Conditions',
          description: 'Review photos of ringworm, lice, scabies, and dandruff. Being able to recognize them quickly is critical.',
          benefit: 'Builds recognition confidence while preserving referral boundaries',
          timeframe: '10 minutes',
        },
      ],
    },

    // -------------------------------------------
    // SECTION 22: FINAL HAIR LAB PLEDGE
    // -------------------------------------------
    {
      type: 'quote',
      id: 'hair-lab-pledge',
      quote: 'I will analyze hair and scalp characteristics before I act, describe what I observe without diagnosing, and refer concerns that are outside barbering scope. I will use Chapter 10 knowledge to support safe, respectful service decisions and clear client communication.',
    },
  ],
}
