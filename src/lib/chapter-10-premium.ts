// Chapter 10: Properties and Disorders of the Hair and Scalp — PREMIUM IMMERSIVE EXPERIENCE
// THE HAIR LAB — Master Trichology, Diagnosis & Client Care

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// HAIR LAB THEME — Scientific Precision
// Deep amethyst / Clinical teal / Diagnostic gold / Clean white
// Feels like: A modern trichology diagnostic lab behind the barbershop
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
  subtitle: 'Enter the Hair Lab — Master Trichology, Diagnosis & Every Client Who Sits in Your Chair',
  theme: chapter10PremiumTheme,
  sections: [
    // ═══════════════════════════════════════════
    // SECTION 1: WELCOME TO THE HAIR LAB
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'hair-lab-welcome',
      title: '🔬 WELCOME TO THE HAIR LAB',
      content: 'Every client who sits in your chair is a living case study. Their hair tells a story — of genetics, health, habits, and history. The scientific study of hair, its disorders, and care is called TRICHOLOGY. As a barber, you are part scientist, part detective, and part artist.\n\nThis chapter transforms you into a Hair Lab Technician. You will learn to read hair like a diagnostic instrument — understanding its structure, predicting its behavior, recognizing danger signs, and knowing when to treat and when to refer. The client who trusts you with their hair is trusting you with their identity. Earn that trust through knowledge.',
      highlight: 'READ THE HAIR — DIAGNOSE THE SCALP — PROTECT THE CLIENT',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: WHY TRICHOLOGY MATTERS
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'why-trichology-matters',
      title: 'WHY THE HAIR LAB MATTERS',
      subtitle: 'Three reasons trichology separates pros from pretenders',
      cards: [
        {
          icon: 'Microscope',
          title: 'DIAGNOSTIC PRECISION',
          text: 'Before every cut, color, or chemical service, you must assess what you are working with. Porosity, elasticity, texture, and scalp condition determine product selection, technique, and safety. Skip the analysis, risk the disaster.',
        },
        {
          icon: 'ShieldAlert',
          title: 'CLIENT SAFETY',
          text: 'A contagious scalp condition. An allergic reaction waiting to happen. Over-processed hair ready to break. These are not rare emergencies — they are daily realities. Trichology knowledge prevents harm before it happens.',
        },
        {
          icon: 'Award',
          title: 'PROFESSIONAL AUTHORITY',
          text: 'When you can explain why a client\'s hair behaves a certain way, recommend products with scientific reasoning, and spot conditions early, you become the trusted expert — not just the person who cuts hair.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: TRICHOLOGY CERTIFICATION LEVELS
    // ═══════════════════════════════════════════
    {
      type: 'levelUp',
      id: 'trichology-certification',
      title: '🔬 TRICHOLOGY CERTIFICATION',
      subtitle: 'Progress from Observer to Master Trichologist — earn your diagnostic credentials',
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
          description: 'You understand hair loss patterns, growth phases, and treatment options. You can counsel clients experiencing thinning or shedding with empathy and accuracy.',
          reward: 'Trusted Advisor — Clients confide in you about sensitive hair concerns',
        },
        {
          level: 'Level 5',
          title: 'Master Trichologist',
          description: 'You command complete knowledge of hair science, scalp health, and diagnostic protocols. Other barbers consult you. You elevate the entire profession.',
          reward: 'Trichology Authority — Your expertise is recognized and respected',
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
      content: 'Hair is a KERATINIZED appendage of the skin — meaning it is made of dead protein cells pushed upward from living roots. Every strand has two main parts: the ROOT (below the skin surface) and the SHAFT (the visible portion).\n\nUnderstanding hair structure is not academic trivia — it is the foundation of every service you perform. Chemical services target specific layers. Cutting techniques interact with the cuticle. Product absorption depends on porosity, which is determined by cuticle condition.\n\nBOARD EXAM ALERT: Hair is approximately 90% keratin protein. The cortex is the target of all chemical services.',
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
            { text: 'BOARD EXAM ALERT: The follicle is the living portion of hair. The shaft is dead keratin.' },
            { text: 'Folliculitis = inflammation of follicles. Never shave over active folliculitis.' },
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
            { text: 'BOARD EXAM ALERT: The dermal papilla is called "the mother of the hair" because it nourishes growth.' },
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
            { text: 'BOARD EXAM ALERT: The cuticle must be intact for healthy hair. Damage raises scales and increases porosity.' },
            { text: 'When the cuticle is smooth and flat, hair reflects light and appears shiny. Damaged cuticles scatter light, causing dullness.' },
          ],
        },
        {
          id: 'cortex',
          label: 'CORTEX',
          title: 'CORTEX — THE HEART OF THE HAIR (~90%)',
          bullets: [
            { label: 'STRUCTURE', description: 'The middle and main layer; contains melanin granules, cortical cells, and side bonds' },
            { label: 'FUNCTION', description: 'Provides strength, elasticity, and color. The target of ALL chemical services.' },
            { label: 'BARBER RELEVANCE', description: 'Color, perms, and relaxers all work on the cortex. Damage here is permanent and cumulative.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: The cortex is approximately 90% of hair weight and the target of all chemical services.' },
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
          title: 'BOARD EXAM ALERT',
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
            { text: 'BOARD EXAM ALERT: Eumelanin = brown/black. Pheomelanin = red/yellow. Gray = little/no melanin.' },
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
            { text: 'BOARD EXAM ALERT: Wave pattern is determined by cross-section shape — Round = straight, Oval = wavy, Elliptical = curly.' },
            { text: 'Extremely curly hair has LOW ELASTICITY and breaks easily. It requires extra conditioning and gentle handling.' },
          ],
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
          description: '3–5+ years. 90% of scalp hair is in this phase. Active cell division in the bulb pushes the strand upward. This is when hair grows approximately ½ inch per month.',
        },
        {
          icon: 'ArrowRightLeft',
          title: 'CATAGEN — TRANSITION PHASE',
          description: '~2 weeks. The follicle shrinks and detaches from the dermal papilla. Growth stops. Only 1–2% of hair is in this phase at any time.',
        },
        {
          icon: 'Moon',
          title: 'TELOGEN — RESTING PHASE',
          description: '3–6 months. The hair sheds naturally. 10% of scalp hair is in this phase. Normal shedding is 75–100 hairs per day. New anagen growth pushes the old hair out.',
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
      content: 'Before every service — EVERY service — you must analyze the hair and scalp. This is not optional. It is the professional standard that separates safe barbers from dangerous ones.\n\nUse ALL your senses:\n\nSIGHT: Look for dry or oily scalp, lesions, parasites, inflammation, broken hairs, or unusual patterns.\n\nTOUCH: Feel texture (coarse, medium, fine), density (thick, average, thin), porosity (how quickly hair absorbs moisture), and elasticity (how well it stretches and returns).\n\nSMELL & HEARING: Unusual odors can indicate infection or product buildup. Listen to the client\'s history — medications, recent illnesses, chemical services, and concerns.\n\nBOARD EXAM ALERT: Always perform scalp analysis before chemical services. Never proceed on irritated skin, parasites, or unknown lesions.',
      highlight: 'ANALYZE BEFORE YOU ACT — EVERY TIME, EVERY CLIENT',
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
            { text: 'Over-porous hair is damaged hair. Do not perform chemical services without conditioning treatments first.' },
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
            { text: 'Low elasticity = compromised cortex. Chemical services will cause further breakage.' },
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
      content: 'Hair loss is one of the most emotionally charged concerns clients bring to your chair. Understanding the types, causes, and treatments allows you to respond with empathy, accuracy, and appropriate referrals.\n\nHair loss affects millions of men and women. It can be temporary (stress, illness, medication) or permanent (genetic, scarring). Your role is not to treat medical hair loss — your role is to recognize it, support the client, and refer to appropriate professionals.\n\nBOARD EXAM ALERT: Androgenic alopecia is the most common type of hair loss — genetic and hormonal. Early detection and medical referral are important.',
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
            { label: 'TREATMENT', description: 'Minoxidil (topical, men and women), Finasteride (oral, men only). Early treatment is most effective.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Androgenic alopecia is the most common type of hair loss.' },
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
            { label: 'TRACTION ALOPECIA', description: 'Caused by prolonged tension from tight styles, braids, or extensions. Preventable.' },
            { label: 'TELOGEN EFFLUVIUM', description: 'Stress, illness, or medication pushes hair prematurely into telogen. Diffuse shedding 2–3 months after trigger.' },
            { label: 'SCARRING (CICATRICIAL)', description: 'Permanent destruction of follicles. Requires immediate medical attention. Barber cannot help.' },
          ],
          facts: [
            { text: 'Traction alopecia is preventable — educate clients about protective styling.' },
            { text: 'Scarring alopecia is permanent. Early medical intervention is critical.' },
          ],
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
          description: 'Split ends. The cuticle is damaged and the cortex separates at the end of the strand. Preventable with regular trims and conditioning. Not treatable — must be cut off.',
        },
        {
          icon: 'Link',
          title: 'MONILETHRIX',
          description: 'Beaded hair — alternating thick and thin segments along the strand. Genetic. Fragile and breaks easily. Be extremely gentle. No chemical services.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 15: SCALP DISORDERS — CONTAGIOUS
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'contagious-disorders',
      title: '🚫 CONTAGIOUS SCALP DISORDERS — NO SERVICE',
      subtitle: 'Recognize these conditions and STOP immediately. Refer to a physician.',
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
          description: 'Boils (single) or clusters of boils (carbuncles) from bacterial infection. Painful, raised, pus-filled. Do not shave over. Refer to physician. May be contagious if draining.' },
        {
          icon: 'ShieldCheck',
          title: 'SEBORRHEIC DERMATITIS',
          description: 'Oily, red, scaly patches. Dandruff-like but more severe. Not contagious. Manageable with medicated products. Handle gently during services.',
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
      content: 'When you spot something abnormal on a client\'s scalp or hair, you have a professional obligation to act. Here is your decision tree:\n\nSTEP 1 — ASSESS: Is this normal variation or a potential problem? When in doubt, assume it needs attention.\n\nSTEP 2 — CLASSIFY: Is this contagious or non-contagious? If contagious, STOP SERVICE IMMEDIATELY.\n\nSTEP 3 — ACT: For contagious conditions — politely explain, do not embarrass, sanitize your tools and station, and refer to a physician. For non-contagious conditions — proceed with caution, adjust technique, and suggest appropriate products or referrals.\n\nSTEP 4 — DOCUMENT: Note what you observed and what you recommended. Documentation protects you professionally.\n\nSTEP 5 — FOLLOW UP: On the client\'s next visit, ask about the condition. Show you care. Build trust.\n\nBOARD EXAM ALERT: Performing services on contagious scalp conditions is a sanitation violation that can result in license suspension.',
      highlight: 'WHEN IN DOUBT, STOP AND REFER',
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
          title: 'NON-NEGOTIABLE SAFETY RULES',
          bullets: [
            { label: 'ANALYZE FIRST', description: 'Always perform scalp and hair analysis before chemical services. No exceptions.' },
            { label: 'DO NOT DIAGNOSE', description: 'You are a barber, not a doctor. Recognize, refer, but never diagnose.' },
            { label: 'STOP FOR CONTAGION', description: 'Contagious conditions = immediate service stop. Sanitize. Refer. Document.' },
            { label: 'TEST ELASTICITY', description: 'Low elasticity = no chemical services. The hair will break. Explain to the client why.' },
            { label: 'CHECK POROSITY', description: 'Over-porous hair needs conditioning before chemicals. Adjust your approach.' },
            { label: 'PROTECT YOURSELF', description: 'Wear gloves when examining unknown scalp conditions. Wash hands thoroughly.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Performing services on contagious conditions is a sanitation violation with license suspension consequences.' },
            { text: 'A single mistake with chemical services on compromised hair can destroy a client\'s hair and your reputation.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 19: BOARD EXAM CRITICAL ALERTS
    // ═══════════════════════════════════════════
    // SECTION 19: BOARD EXAM CRITICAL ALERTS
    // -------------------------------------------
    {
      type: 'contentBlock',
      id: 'board-exam-alerts',
      title: 'BOARD EXAM CRITICAL ALERTS',
      content: 'These trichology concepts appear on EVERY state board exam. Miss them, and you fail.',
      highlight: 'MEMORIZE THESE 25 POINTS',
    },

    // -------------------------------------------
    // SECTION 20: DIAGNOSTIC SCENARIOS
    // -------------------------------------------
    {
      type: 'scenarioBlock',
      id: 'diagnostic-scenarios',
      title: 'DIAGNOSTIC SCENARIOS',
      subtitle: 'Real shop situations that test your trichology instincts',
      scenarios: [
      ],
    },

    // -------------------------------------------
    // SECTION 21: ACTION PROMPTS
    // -------------------------------------------
    {
      type: 'actionPrompt',
      id: 'action-prompts',
      title: 'HAIR LAB ACTION ITEMS',
      subtitle: 'Do these today to level up your diagnostic skills',
      prompts: [
        {
          action: 'Practice the Porosity Test',
          description: 'Slide your fingers down dry hair strands on 3-5 clients. Note which feel smooth (resistant) vs. rough (porous).',
          benefit: 'Builds tactile diagnostic skill you will use every day',
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
          benefit: 'Speeds up your diagnostic confidence',
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
      quote: 'I pledge to see every client\'s hair as a unique diagnostic case. I will analyze before I act, recognize what I cannot treat, and refer when safety demands it. I understand that the trust placed in my chair is built on knowledge, honesty, and care. A master barber does not just cut hair - they protect the health of every scalp they touch.',
    },
  ],
}
