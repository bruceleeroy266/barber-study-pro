// Chapter 9: The Skin — Structure, Disorders, and Diseases
// PREMIUM IMMERSIVE EXPERIENCE
// The Skin Safety Academy — Where Observation Saves Lives

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// SKIN SAFETY ACADEMY THEME
// Warm clinical coral / Medical teal / Soft cream / Healing sage
// Feels like: A premium dermatology learning clinic for barbers
// ═══════════════════════════════════════════════

export const chapter9PremiumTheme: ChapterTheme = {
  primary: '#FF6B6B',
  primaryLight: '#FF9E9E',
  primaryDark: '#E85555',
  secondary: '#4ECDC4',
  background: 'rgba(28, 22, 22, 0.96)',
  backgroundAlt: 'rgba(38, 32, 32, 0.92)',
  surface: '#1C1616',
  border: 'rgba(255, 107, 107, 0.25)',
  text: '#FFF5F5',
  textMuted: '#C4A8A8',
  highlight: '#4ECDC4',
  timeline: {
    line: 'rgba(255, 107, 107, 0.35)',
    iconBg: '#2C2222',
    iconBorder: '#FF6B6B',
  },
  quote: {
    border: 'rgba(255, 107, 107, 0.4)',
    icon: 'rgba(255, 107, 107, 0.3)',
    bg: 'rgba(28, 22, 22, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(255, 107, 107, 0.15)',
    activeBorder: 'rgba(255, 107, 107, 0.5)',
    activeText: '#FF9E9E',
    inactiveBg: 'rgba(28, 22, 22, 0.7)',
    inactiveBorder: 'rgba(255, 107, 107, 0.12)',
    inactiveText: '#C4A8A8',
    panelBg: 'rgba(28, 22, 22, 0.85)',
    panelBorder: 'rgba(255, 107, 107, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(255, 107, 107, 0.1)',
    headerText: '#FF9E9E',
    dot: 'rgba(255, 107, 107, 0.6)',
    line: 'rgba(255, 107, 107, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(78, 205, 196, 0.15)',
    iconColor: '#4ECDC4',
    cardBorder: 'rgba(78, 205, 196, 0.2)',
  },
  milestone: {
    yearColor: '#FF6B6B',
    border: 'rgba(255, 107, 107, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(78, 205, 196, 0.4)',
    checkColor: '#4ECDC4',
    bg: 'rgba(28, 22, 22, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(28, 22, 22, 0.7)',
    border: 'rgba(255, 107, 107, 0.18)',
    highlightColor: '#4ECDC4',
  },
  challengeCard: {
    badgeBg: 'rgba(255, 107, 107, 0.15)',
    badgeText: '#FF9E9E',
    cardBorder: 'rgba(255, 107, 107, 0.22)',
    completedBg: 'rgba(78, 205, 196, 0.1)',
    completedBorder: 'rgba(78, 205, 196, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(255, 107, 107, 0.06)',
    optionBorder: 'rgba(255, 107, 107, 0.18)',
    correctBg: 'rgba(78, 205, 196, 0.1)',
    incorrectBg: 'rgba(239, 68, 68, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(255, 107, 107, 0.15)',
    levelBadgeText: '#FF9E9E',
    rewardBg: 'rgba(78, 205, 196, 0.1)',
    rewardText: '#4ECDC4',
  },
  actionPrompt: {
    cardBorder: 'rgba(255, 107, 107, 0.18)',
    completedBorder: 'rgba(78, 205, 196, 0.3)',
    benefitBg: 'rgba(78, 205, 196, 0.08)',
    benefitBorder: 'rgba(78, 205, 196, 0.25)',
  },
}

// ═══════════════════════════════════════════════
// PREMIUM IMMERSIVE CHAPTER 9 CONTENT
// ═══════════════════════════════════════════════

export const chapter9PremiumContent: ChapterContent = {
  chapterNumber: 9,
  title: 'THE SKIN — STRUCTURE, DISORDERS, AND DISEASES',
  subtitle: 'Master the Canvas — Understand Every Layer, Spot Every Condition, Protect Every Client',
  theme: chapter9PremiumTheme,
  sections: [
    // ═══════════════════════════════════════════
    // SECTION 1: ACADEMY WELCOME
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'academy-welcome',
      title: '🏥 WELCOME TO THE SKIN SAFETY ACADEMY',
      content: 'You are not just a barber. You are a frontline health observer. Every client who sits in your chair trusts you with more than their hair — they trust you with their skin, their scalp, their face, their neck.\n\nThe skin is the LARGEST organ of the body. It is the first line of defense against disease, the canvas for every service you perform, and the surface where dangerous conditions first appear. A barber who understands skin science does not just cut hair — they protect health, spot danger, and save lives.\n\nThis chapter transforms you into a Skin Safety Officer. You will learn to read the skin like a medical chart, recognize conditions that require referral, and make split-second decisions that keep clients safe.\n\nYour chair is an observation post. Your eyes are diagnostic tools. Your judgment is a life-saving skill.',
      highlight: 'YOUR CHAIR IS AN OBSERVATION POST — YOUR EYES SAVE LIVES',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: WHY STUDY THE SKIN
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'why-study-skin',
      title: 'WHY THE SKIN MATTERS IN BARBERING',
      subtitle: 'Three reasons skin knowledge separates professionals from amateurs',
      cards: [
        {
          icon: 'Shield',
          title: 'CLIENT SAFETY',
          text: 'Knowing skin composition and underlying structures is crucial for safe facials, scalp treatments, and shaving services. Performing services on compromised skin causes damage, infection, and liability.',
        },
        {
          icon: 'Eye',
          title: 'EARLY DETECTION',
          text: 'You must recognize normal skin conditions versus those requiring medical treatment. Barbers are often the first to notice skin and scalp changes — your observation can save lives.',
        },
        {
          icon: 'Ban',
          title: 'SERVICE PROTECTION',
          text: 'You must identify abnormal skin conditions that prohibit certain services. Shaving over an infection, applying product to broken skin, or ignoring contagious conditions is professional negligence.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: SKIN SAFETY OFFICER CERTIFICATION
    // ═══════════════════════════════════════════
    {
      type: 'levelUp',
      id: 'skin-certification',
      title: '🏆 SKIN SAFETY OFFICER CERTIFICATION',
      subtitle: 'Progress from Observer to Master Safety Officer — earn your credentials',
      levels: [
        {
          level: 'Level 1',
          title: 'Observer',
          description: 'You know the basics: skin is the largest organ, it has layers, and it protects the body. You can identify obvious problems and know when to pause before proceeding with a service.',
          reward: 'Safety-First Badge — Clients trust your careful eye',
        },
        {
          level: 'Level 2',
          title: 'Layer Analyst',
          description: 'You understand epidermis, dermis, and subcutaneous tissue. You know what each layer contains, how they function, and why they matter for barbering services.',
          reward: 'Anatomy Expert — You understand what lies beneath your tools',
        },
        {
          level: 'Level 3',
          title: 'Condition Spotter',
          description: 'You recognize primary and secondary lesions, common skin disorders, and glandular problems. You know the difference between a harmless mole and a potential melanoma.',
          reward: 'Early Detection Specialist — You protect client health',
        },
        {
          level: 'Level 4',
          title: 'Referral Expert',
          description: 'You understand when to proceed, when to modify, and when to refer. You can explain skin conditions to clients in plain language and recommend appropriate professional care.',
          reward: 'Trusted Advisor — Clients seek your guidance',
        },
        {
          level: 'Level 5',
          title: 'Master Safety Officer',
          description: 'You are the skin expert in your shop. Other barbers consult you. Clients trust your judgment. You have prevented serious conditions from going unnoticed and educated countless people on skin health.',
          reward: 'Dermatology Authority — Your expertise is recognized and respected',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 4: KEY DEFINITIONS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'key-definitions',
      title: 'KEY DEFINITIONS — KNOW THE TERMINOLOGY',
      subtitle: 'Board exam questions often test definitions first',
      features: [
        {
          icon: 'BookOpen',
          title: 'DERMATOLOGY',
          description: 'The branch of medical science that studies the skin — its nature, structure, functions, diseases, and treatment.',
        },
        {
          icon: 'Stethoscope',
          title: 'DERMATOLOGIST',
          description: 'A physician who specializes in skin, hair, and nails. When you spot something suspicious, this is who you refer clients to.',
        },
        {
          icon: 'Scan',
          title: 'LESION',
          description: 'Any mark on the skin indicating injury, damage, or disease. Barbers must recognize lesions and refer abnormal ones before performing services.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 5: LEARNING OBJECTIVES
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'learning-objectives',
      title: '🎯 CHAPTER 9 LEARNING OBJECTIVES',
      subtitle: 'What the state board expects you to know',
      items: [
        { text: 'LO1: Describe the structure and divisions of the skin' },
        { text: 'LO2: List the functions of the skin' },
        { text: 'LO3: Identify and describe common primary and secondary skin lesions' },
        { text: 'LO4: Describe common skin inflammations and infections' },
        { text: 'LO5: List and describe disorders of the sebaceous and sudoriferous glands' },
        { text: 'LO6: List and describe types of skin pigmentations' },
        { text: 'LO7: Identify common skin hypertrophies' },
        { text: 'LO8: Identify and describe types of skin cancer' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 6: SKIN BASICS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'skin-basics',
      title: 'THE SKIN — YOUR LARGEST ORGAN',
      content: 'The skin is the LARGEST organ of the body and the body\'s FIRST LINE OF DEFENSE against disease and the environment. It protects internal organs, regulates temperature, and provides sensory information.\n\nHealthy skin is slightly moist, soft, flexible, and has a smooth fine-grained texture. It maintains a SLIGHTLY ACIDIC pH (around 5.5), which creates a protective barrier against microorganisms.\n\nSkin renews itself constantly and varies in thickness across the body. The THINNEST skin is on the eyelids. The THICKEST is on the palms and soles.\n\nBOARD EXAM ALERT: Calluses form from continued pressure and are a natural defense. Do not remove them — they protect underlying tissue.',
      highlight: 'LARGEST ORGAN — FIRST LINE OF DEFENSE — CONSTANTLY RENEWS',
    },

    // ═══════════════════════════════════════════
    // SECTION 7: TWO MAIN DIVISIONS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'skin-divisions',
      title: 'THE TWO MAIN DIVISIONS OF SKIN',
      subtitle: 'Epidermis and Dermis — know what each layer does',
      tabs: [
        {
          id: 'epidermis',
          label: 'EPIDERMIS',
          title: 'THE EPIDERMIS — OUTERMOST PROTECTION',
          bullets: [
            { label: 'ALSO CALLED', description: 'Cuticle or scarf skin — these are alternate names for the epidermis found in older textbooks and exam questions.' },
            { label: 'LOCATION', description: 'Outermost, thinnest protective layer of the skin' },
            { label: 'BLOOD VESSELS', description: 'NONE — the epidermis contains no blood vessels. It receives nutrients by diffusion from the dermis below.' },
            { label: 'RENEWAL', description: 'Cells continually shed from the surface and are replaced from below. Complete renewal takes approximately 28 days.' },
            { label: 'WATERPROOFING', description: 'Sebum from sebaceous glands waterproofs the outer surface, preventing moisture loss and microbial entry.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: The epidermis has NO blood vessels. It relies entirely on the dermis for nourishment.' },
            { text: 'The epidermis is your first line of defense. Every cut, scrape, or shave passes through this layer first.' },
          ],
        },
        {
          id: 'dermis',
          label: 'DERMIS',
          title: 'THE DERMIS — TRUE SKIN',
          bullets: [
            { label: 'ALSO CALLED', description: 'True skin, corium, or cutis — these alternate names appear on board exams and in textbook references.' },
            { label: 'LOCATION', description: 'Underlying, thicker layer beneath the epidermis — approximately 25× thicker than the epidermis' },
            { label: 'PAPILLARY LAYER', description: 'Superficial layer containing papillae (conical projections), tactile corpuscles for touch, looped capillaries, and some melanin' },
            { label: 'RETICULAR LAYER', description: 'Deeper layer supplying oxygen and nutrients. Contains fat cells, sweat glands, blood vessels, hair follicles, lymph glands, arrector pili muscles, and oil glands' },
            { label: 'FUNCTION', description: 'Provides strength, elasticity, nourishment, and sensory perception. The dermis is what gives skin its resilience and structure.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: The dermis is 25× thicker than the epidermis and contains all the skin\'s functional structures.' },
            { text: 'When you feel pain from a cut, you have reached the dermis — the epidermis itself has no nerve endings.' },
          ],
        },
        {
          id: 'subcutaneous',
          label: 'SUBCUTANEOUS',
          title: 'SUBCUTANEOUS TISSUE — THE FOUNDATION',
          bullets: [
            { label: 'ALSO CALLED', description: 'Hypodermis or adipose tissue — the layer of fatty tissue below the dermis' },
            { label: 'SMOOTHNESS', description: 'Provides smoothness and contour to the skin surface' },
            { label: 'ENERGY STORAGE', description: 'Stores fat as an energy reserve for the body' },
            { label: 'CUSHIONING', description: 'Cushions and protects underlying organs and structures from impact' },
          ],
          facts: [
            { text: 'The subcutaneous layer is not technically skin, but it is essential for skin health and appearance.' },
            { text: 'Thicker subcutaneous tissue in the scalp provides cushioning during massage and shaving services.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8: EPIDERMIS LAYERS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'epidermis-layers',
      title: 'THE FIVE LAYERS OF THE EPIDERMIS',
      subtitle: 'From deepest to surface — know the journey of a skin cell',
      features: [
        {
          icon: 'Layers',
          title: 'STRATUM GERMINATIVUM',
          description: 'Basal cell layer — deepest layer responsible for growth. Contains melanocytes that produce melanin pigment. This is where all new skin cells are born.',
        },
        {
          icon: 'Layers',
          title: 'STRATUM SPINOSUM',
          description: 'Spiny layer — cells pushed upward from the basal layer. Named for the spiny appearance cells take on as they begin to flatten and prepare for their journey to the surface.',
        },
        {
          icon: 'Layers',
          title: 'STRATUM GRANULOSUM',
          description: 'Granular layer — cells filled with keratin and becoming almost dead. Keratin is the protein that makes skin waterproof and durable.',
        },
        {
          icon: 'Layers',
          title: 'STRATUM LUCIDUM',
          description: 'Clear layer — small, transparent cells through which light passes. Found only in thick skin (palms and soles).',
        },
        {
          icon: 'Layers',
          title: 'STRATUM CORNEUM',
          description: 'Horny layer — outermost layer of tightly packed, scale-like cells continually shed and replaced. Waterproofed by sebum. This is the layer you touch and see.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 9: MELANIN
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'melanin',
      title: 'MELANIN — THE PIGMENT OF PROTECTION',
      content: 'Melanin is the pigment produced by MELANOCYTES in the basal layer (stratum germinativum) of the epidermis. It gives skin its color — more melanin means darker skin.\n\nBut melanin is not just about color. Its primary function is PROTECTION against UV damage. Melanin absorbs harmful ultraviolet rays before they can damage deeper skin layers and DNA.\n\nWhen skin is exposed to sunlight, melanocytes produce more melanin — this is what creates a tan. The tan is actually the skin\'s defense mechanism kicking into higher gear.\n\nBOARD EXAM ALERT: Melanin is produced by melanocytes in the stratum germinativum. Its primary function is UV protection, not just coloration.',
      highlight: 'MELANIN = UV PROTECTION, NOT JUST COLOR',
    },

    // ═══════════════════════════════════════════
    // SECTION 10: FLUIDS OF THE SKIN
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'skin-fluids',
      title: 'BLOOD & LYMPH — THE SKIN\'S NOURISHMENT',
      content: 'Blood and lymph supply nourishment to the skin, delivering protein, carbohydrates, and fat that cells need to function and regenerate.\n\nApproximately HALF THE BODY\'S BLOOD SUPPLY flows through the skin at any given time. This massive blood flow is why the skin plays such a critical role in temperature regulation — when the body overheats, blood vessels dilate and bring warm blood to the surface where heat can escape. When the body is cold, vessels constrict to preserve core temperature.\n\nLymphatic vessels in the dermis drain waste and excess fluid, supporting immune function and tissue health.\n\nBOARD EXAM ALERT: About half the body\'s blood supply goes to the skin. This fact demonstrates why the skin is considered an organ, not just a covering.',
      highlight: 'HALF THE BODY\'S BLOOD SUPPLY — THE SKIN IS AN ORGAN',
    },

    // ═══════════════════════════════════════════
    // SECTION 11: NERVES OF THE SKIN
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'skin-nerves',
      title: 'THE NERVES OF THE SKIN',
      subtitle: 'Three types of nerve fibers control sensation and function',
      features: [
        {
          icon: 'Zap',
          title: 'MOTOR NERVE FIBERS',
          description: 'Control arrector pili muscles — the tiny muscles that cause goose bumps when you are cold or frightened. They also stimulate glandular activity.',
        },
        {
          icon: 'Hand',
          title: 'SENSORY NERVE FIBERS',
          description: 'React to heat, cold, touch, pressure, and pain. These nerves make the skin the body\'s largest sensory organ. The papillary layer houses most touch receptors.',
        },
        {
          icon: 'Droplets',
          title: 'SECRETORY NERVE FIBERS',
          description: 'Regulate sweat and oil gland secretion. They control when and how much sebum and perspiration the skin produces.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 12: SKIN CHARACTERISTICS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'skin-characteristics',
      title: 'SKIN COLOR & ELASTICITY',
      subtitle: 'What determines how skin looks and behaves',
      tabs: [
        {
          id: 'color',
          label: 'SKIN COLOR',
          title: 'WHAT DETERMINES SKIN COLOR?',
          bullets: [
            { label: 'GENETICS', description: 'Inherited traits determine baseline melanin production and distribution' },
            { label: 'MELANIN AMOUNT', description: 'Darker skin has more melanin. Lighter skin has less. This is genetically determined, not a health indicator.' },
            { label: 'SUN EXPOSURE', description: 'UV exposure stimulates melanin production, temporarily darkening skin (tanning)' },
            { label: 'BLOOD FLOW', description: 'Increased blood flow near the surface creates a rosy or flushed appearance' },
          ],
          facts: [
            { text: 'All humans have approximately the same number of melanocytes. Skin color differences come from how much melanin each melanocyte produces.' },
            { text: 'Darker skin has more natural UV protection but can still suffer sun damage and skin cancer.' },
          ],
        },
        {
          id: 'elasticity',
          label: 'ELASTICITY',
          title: 'SKIN ELASTICITY — THE BOUNCE-BACK FACTOR',
          bullets: [
            { label: 'COLLAGEN', description: 'Provides strength and structural support. Collagen fibers form a network that holds skin firm and resilient.' },
            { label: 'ELASTIN', description: 'Provides elasticity — the ability to stretch and return to original shape. Elastin fibers act like rubber bands in the dermis.' },
            { label: 'HEALTHY SKIN', description: 'Expands and returns to shape. Poor elasticity shows as sagging, wrinkles, or slow recovery from stretching.' },
            { label: 'AGING', description: 'Collagen and elastin production decreases with age, leading to reduced elasticity and wrinkle formation.' },
          ],
          facts: [
            { text: 'Smoking, sun damage, and poor nutrition accelerate collagen and elastin breakdown, causing premature aging.' },
            { text: 'Vitamin C is essential for collagen synthesis — a diet rich in vitamin C supports skin elasticity.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 13: GLANDS OF THE SKIN
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'skin-glands',
      title: 'THE GLANDS OF THE SKIN',
      subtitle: 'Sudoriferous and Sebaceous — sweat and oil control everything',
      tabs: [
        {
          id: 'sudoriferous',
          label: 'SWEAT GLANDS',
          title: 'SUDORIFEROUS (SWEAT) GLANDS',
          bullets: [
            { label: 'STRUCTURE', description: 'Coiled base with a duct leading to the skin surface (pore)' },
            { label: 'FUNCTION', description: 'Regulate body temperature by producing sweat that evaporates and cools the skin' },
            { label: 'WASTE ELIMINATION', description: 'Eliminates waste products including salt and chemicals through perspiration' },
            { label: 'DISTRIBUTION', description: 'Most numerous on palms, soles, forehead, and armpits' },
            { label: 'INFLUENCES', description: 'Heat, exercise, emotion, and drugs all affect sweat production' },
          ],
          facts: [
            { text: 'The body has 2–4 million sweat glands. They are essential for thermoregulation — without them, overheating would be life-threatening.' },
            { text: 'Emotional sweating (nervousness) occurs primarily on palms, soles, and armpits — different from heat-regulation sweating.' },
          ],
        },
        {
          id: 'sebaceous',
          label: 'OIL GLANDS',
          title: 'SEBACEOUS (OIL) GLANDS',
          bullets: [
            { label: 'CONNECTION', description: 'Connected to hair follicles — every hair has an associated sebaceous gland' },
            { label: 'SEBUM', description: 'Oily substance that lubricates skin and hair, preventing moisture loss and maintaining flexibility' },
            { label: 'ACTIVITY', description: 'Most active on face and scalp — these areas tend to be oilier' },
            { label: 'BLOCKAGE', description: 'Blocked sebum + debris forms blackheads (open comedo) and whiteheads (closed comedo)' },
          ],
          facts: [
            { text: 'Sebum production is controlled by hormones. During puberty, increased androgens stimulate sebaceous glands, often causing acne.' },
            { text: 'Over-washing the face strips natural sebum, causing glands to overproduce oil in compensation — making skin oilier, not cleaner.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 14: ABSORPTION LEVEL
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'skin-absorption',
      title: 'SKIN ABSORPTION — LIMITED BUT IMPORTANT',
      content: 'The skin\'s ability to absorb substances is LIMITED beyond the top layer (stratum corneum). This limited absorption is actually a protective feature — the skin blocks most foreign substances from entering the body.\n\nHowever, this same property makes the skin useful for TOPICAL MEDICATIONS and creams. Products applied to the skin can penetrate enough to deliver active ingredients locally without entering the bloodstream in large amounts.\n\nAbsorption depends on two factors: SKIN THICKNESS (thinner skin absorbs more) and PRODUCT CONCENTRATION (higher concentration increases absorption).\n\nBOARD EXAM ALERT: Many drugs are more effective when absorbed through the skin (transdermal delivery). Nicotine patches, pain relief creams, and hormone therapies all use skin absorption. This is why barbers must be cautious about what products they apply — even topical substances can have systemic effects.',
      highlight: 'LIMITED ABSORPTION — PROTECTIVE FEATURE — TOPICAL MEDICATIONS',
    },

    // ═══════════════════════════════════════════
    // SECTION 15: FUNCTIONS OF THE SKIN (SHAPES)
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'skin-functions',
      title: 'FUNCTIONS OF THE SKIN — THE SHAPES MNEMONIC',
      subtitle: 'Six essential functions every barber must know',
      features: [
        {
          icon: 'Hand',
          title: 'S — SENSATION',
          description: 'Skin detects touch, pressure, pain, heat, and cold. Sensory nerve fibers in the papillary layer make the skin the body\'s largest sensory organ.',
        },
        {
          icon: 'Thermometer',
          title: 'H — HEAT REGULATION',
          description: 'Maintains approximately 98.6°F body temperature through blood flow (vasodilation/vasoconstriction) and sweat evaporation.',
        },
        {
          icon: 'Droplets',
          title: 'A — ABSORPTION',
          description: 'Limited absorption of topical medications and creams through the skin. Depends on skin thickness and product concentration.',
        },
        {
          icon: 'Shield',
          title: 'P — PROTECTION',
          description: 'Barrier against pathogens, physical injury, and chemicals. Sebum waterproofs the surface. Acidic pH inhibits bacterial growth.',
        },
        {
          icon: 'ArrowUp',
          title: 'E — EXCRETION',
          description: 'Perspiration removes waste products including salts, urea, and toxins. Sweat is not just water — it carries metabolic waste.',
        },
        {
          icon: 'Sparkles',
          title: 'S — SECRETION',
          description: 'Sebum lubricates skin and hair, maintaining moisture balance and flexibility. Without sebum, skin cracks and hair becomes brittle.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 16: PRIMARY SKIN LESIONS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'lesion-definition',
      title: 'WHAT IS A LESION?',
      content: 'A LESION is any mark on the skin that indicates injury, damage, or disease. Lesions are the visible signs that something is wrong — or was wrong — with the skin.\n\nPrimary lesions are the ORIGINAL lesions — they appear first, directly from a disease process or injury. They are typically different in color from the surrounding skin and may be raised above the surface.\n\nSecondary lesions EVOLVE from primary lesions through accumulation, infection, or the healing process. A papule that fills with pus becomes a pustule. A vesicle that breaks open and dries becomes a crust.\n\nAs a barber, your job is not to diagnose lesions — it is to RECOGNIZE when a lesion looks abnormal, CONTAGIOUS, or UNFAMILIAR, and REFER the client to a physician or dermatologist before performing services.\n\nBOARD EXAM ALERT: Never perform services on infectious or contagious conditions such as pediculosis (lice), scabies, impetigo, or open herpes lesions.',
      highlight: 'RECOGNIZE — DO NOT DIAGNOSE — REFER WHEN IN DOUBT',
    },

    // ═══════════════════════════════════════════
    // SECTION 17: PRIMARY SKIN LESIONS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'primary-lesions',
      title: 'PRIMARY SKIN LESIONS',
      subtitle: 'Original lesions — the first signs of skin conditions',
      tabs: [
        {
          id: 'raised-fluid',
          label: 'RAISED / FLUID',
          title: 'RAISED AND FLUID-FILLED LESIONS',
          bullets: [
            { label: 'BULLA', description: 'Large blister with watery fluid. Examples: contact dermatitis, burns.' },
            { label: 'VESICLE', description: 'Small blister with clear fluid. Examples: poison ivy, chicken pox, shingles.' },
            { label: 'PUSTULE', description: 'Raised, inflamed papule containing pus. Examples: acne, impetigo, folliculitis.' },
            { label: 'WHEAL', description: 'Itchy, swollen lesion caused by fluid accumulation. Examples: hives, insect bites, allergic reactions.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: A bulla is a LARGE blister; a vesicle is a SMALL blister. Size is the distinguishing factor.' },
            { text: 'Never perform services on skin with pustules or open vesicles — risk of infection spread is high.' },
          ],
        },
        {
          id: 'solid-raised',
          label: 'SOLID / RAISED',
          title: 'SOLID AND RAISED LESIONS',
          bullets: [
            { label: 'PAPULE', description: 'Small elevation of the skin with no pus. Examples: acne (early stage), warts, insect bites.' },
            { label: 'NODULE', description: 'Solid bump larger than 0.4 inch, extending deeper into the skin. Examples: swollen lymph nodes, cystic acne.' },
            { label: 'CYST / TUBERCLE', description: 'Closed sac containing fluid or semisolid material. Examples: severe acne cysts, lipomas.' },
            { label: 'TUMOR', description: 'Abnormal mass of tissue. May be benign or malignant — always requires medical evaluation.' },
          ],
          facts: [
            { text: 'A papule becomes a pustule when it fills with pus. The progression matters for treatment decisions.' },
            { text: 'Any nodule or tumor on the scalp, face, or neck should be noted and the client advised to see a physician.' },
          ],
        },
        {
          id: 'flat',
          label: 'FLAT',
          title: 'FLAT LESIONS',
          bullets: [
            { label: 'MACULE', description: 'Flat spot or discoloration with no change in skin texture. Examples: freckle, liver spot, birthmark.' },
          ],
          facts: [
            { text: 'Macules are non-palpable — you cannot feel them by touch. If a spot is raised, it is not a macule.' },
            { text: 'Monitor macules for changes in size, color, or elevation — these could signal melanoma development.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 18: SECONDARY SKIN LESIONS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'secondary-lesions',
      title: 'SECONDARY SKIN LESIONS',
      subtitle: 'Evolved lesions — what primary lesions become over time',
      features: [
        {
          icon: 'Circle',
          title: 'CRUST',
          description: 'Dead cells and dried fluid forming a scab over a wound. Examples: scab over a cut, dried exudate from impetigo.',
        },
        {
          icon: 'Circle',
          title: 'EXCORIATION',
          description: 'Skin sore or abrasion caused by scratching. Examples: nail cuticle damage, scratched insect bites.',
        },
        {
          icon: 'Circle',
          title: 'FISSURE',
          description: 'Crack in the skin that penetrates into the dermis. Examples: chapped hands, cracked lips, athlete\'s foot fissures.',
        },
        {
          icon: 'Circle',
          title: 'KELOID',
          description: 'Thick scar resulting from excessive fibrous tissue growth. More common in darker skin types. Can form after piercings or cuts.',
        },
        {
          icon: 'Circle',
          title: 'SCALE',
          description: 'Thin, dry, or oily flakes of dead skin cells. Examples: dandruff, psoriasis, seborrheic dermatitis.',
        },
        {
          icon: 'Circle',
          title: 'SCAR (CICATRIX)',
          description: 'Mark left on the skin after injury or healing. Permanent replacement of normal skin with fibrous tissue.',
        },
        {
          icon: 'AlertTriangle',
          title: 'ULCER',
          description: 'Open lesion with loss of skin depth. Examples: chicken pox scars, herpes lesions, diabetic ulcers. Never shave over ulcers.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 19: CAUTION — WHEN TO REFER
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'referral-caution',
      title: '⚠️ WHEN TO REFER — NON-NEGOTIABLE RULES',
      content: 'As a barber, you are not a medical professional. Your role is to recognize, not to diagnose or treat.\n\nNEVER perform services on infectious or contagious conditions including pediculosis (lice), scabies, impetigo, or open herpes lesions.\n\nALWAYS refer inflamed, irritated, or unknown lesions to a physician or dermatologist before proceeding with services.\n\nWhen in doubt, STOP and REFER. A canceled appointment is better than a lawsuit, an infection, or permanent damage to a client\'s health.\n\nBOARD EXAM ALERT: Performing services on contagious skin conditions is a violation of sanitation standards and can result in license suspension.',
      highlight: 'WHEN IN DOUBT, STOP AND REFER',
    },

    // ═══════════════════════════════════════════
    // SECTION 20: SEBACEOUS GLAND DISORDERS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'sebaceous-disorders',
      title: 'SEBACEOUS GLAND DISORDERS',
      subtitle: 'Oil gland problems every barber encounters',
      tabs: [
        {
          id: 'comedones',
          label: 'COMEDONES',
          title: 'COMEDONES — CLOGGED PORES',
          bullets: [
            { label: 'BLACKHEAD (OPEN COMEDO)', description: 'Plugged follicle open to the air. The dark color comes from oxidation of sebum and melanin — not dirt.' },
            { label: 'WHITEHEAD (CLOSED COMEDO)', description: 'Plugged follicle covered by skin. Appears as a small white bump. Can develop into a pustule if inflamed.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Blackheads are NOT caused by dirt. The dark color is oxidation, not poor hygiene.' },
            { text: 'Do not squeeze comedones during barbering services. This can cause infection, scarring, and spread bacteria.' },
          ],
        },
        {
          id: 'acne',
          label: 'ACNE',
          title: 'ACNE VULGARIS — GRADES I–IV',
          bullets: [
            { label: 'GRADE I', description: 'Mild — minor breakouts, mostly blackheads and a few papules' },
            { label: 'GRADE II', description: 'Moderate — more blackheads, papules, and some pustules' },
            { label: 'GRADE III', description: 'Severe — numerous papules and pustules, inflammation spreading' },
            { label: 'GRADE IV', description: 'Very severe — cystic acne with deep, painful lesions and significant inflammation' },
            { label: 'CAUSE', description: 'Bacteria (Propionibacterium acnes) multiply in clogged follicles, causing inflammation and infection' },
          ],
          facts: [
            { text: 'Acne is NOT caused by dirty skin. It results from hormonal changes, excess sebum, and bacterial overgrowth.' },
            { text: 'Avoid shaving over active acne lesions. Use caution with products that may irritate inflamed skin.' },
          ],
        },
        {
          id: 'other-sebaceous',
          label: 'OTHER',
          title: 'OTHER SEBACEOUS DISORDERS',
          bullets: [
            { label: 'MILIA', description: 'Small, benign keratin-filled cysts. Common around eyes and in newborns. Do not attempt to remove.' },
            { label: 'SEBORRHEA / SEBORRHEIC DERMATITIS', description: 'Oily, red, scaly, crusty patches. Dandruff-like on scalp. Common and treatable with medicated products.' },
            { label: 'ROSACEA', description: 'Chronic flushing, redness, dilated vessels, papules and pustules on cheeks and nose. Triggers: sun, spicy food, alcohol, stress.' },
            { label: 'ASTEATOSIS', description: 'Dry, scaly skin from sebum deficiency. Common in older adults and cold climates.' },
            { label: 'SEBACEOUS CYST', description: 'Large pocket filled with sebum. May need surgical removal by a physician. Also called a steatoma or wen.' },
            { label: 'STEATOMA', description: 'Sebaceous cyst or fatty tumor (wen). May require surgical removal by a physician. Same condition, different name.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Sebaceous cyst and steatoma refer to the same condition — a pocket filled with sebum. Know both terms for the exam.' },
            { text: 'Rosacea affects approximately 16 million Americans. Many do not know they have it. Gentle handling and avoiding triggers are essential.' },
            { text: 'Seborrheic dermatitis is not contagious. It is manageable with proper products and hygiene.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 21: SUDORIFEROUS GLAND DISORDERS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'sudoriferous-disorders',
      title: 'SUDORIFEROUS (SWEAT) GLAND DISORDERS',
      subtitle: 'Sweat-related conditions that affect client comfort and service safety',
      features: [
        {
          icon: 'Thermometer',
          title: 'ANHIDROSIS',
          description: 'Deficiency or complete inability to sweat. Can be life-threatening in severe cases because the body cannot cool itself. Clients may overheat during services under warm towels or steam.',
        },
        {
          icon: 'Wind',
          title: 'BROMHIDROSIS',
          description: 'Foul-smelling sweat caused by bacterial breakdown of perspiration. Often affects feet and underarms. Not contagious but can be embarrassing for clients.',
        },
        {
          icon: 'Droplets',
          title: 'HYPERHIDROSIS',
          description: 'Excessive sweating beyond what is needed for temperature regulation. Can make holding tools difficult and cause discomfort during facial services.',
        },
        {
          icon: 'Flame',
          title: 'MILIARIA RUBRA (PRICKLY HEAT)',
          description: 'Acute inflammation with small red vesicles and intense itching caused by heat and blocked sweat ducts. Common in hot, humid conditions. Avoid heat-based treatments.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 22: COMMON INFLAMMATIONS & INFECTIONS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'inflammations',
      title: 'COMMON INFLAMMATIONS & INFECTIONS',
      subtitle: 'Skin conditions that require caution or referral',
      tabs: [
        {
          id: 'dermatitis',
          label: 'DERMATITIS',
          title: 'DERMATITIS — SKIN INFLAMMATION',
          bullets: [
            { label: 'DEFINITION', description: 'General term for inflammation of the skin. Can be caused by irritants, allergens, or underlying conditions.' },
            { label: 'IRRITANT CONTACT', description: 'Caused by direct damage from chemicals, detergents, or harsh products. Appears as redness, burning, or dryness.' },
            { label: 'ALLERGIC CONTACT', description: 'Immune system reaction to an allergen. Examples: reactions to fragrances, nickel, latex, or certain hair products.' },
          ],
          facts: [
            { text: 'If a client develops a rash after a product application, stop using that product immediately and document the reaction.' },
            { text: 'Patch tests before chemical services prevent allergic contact dermatitis reactions.' },
          ],
        },
        {
          id: 'eczema-psoriasis',
          label: 'ECZEMA / PSORIASIS',
          title: 'ECZEMA & PSORIASIS — CHRONIC CONDITIONS',
          bullets: [
            { label: 'ECZEMA', description: 'Chronic inflammatory condition with itching, burning, and redness. Often triggered by stress, allergens, or irritants. Not contagious.' },
            { label: 'PSORIASIS', description: 'Chronic condition causing red patches covered with silvery scales. Autoimmune-related. Not contagious. Can be triggered by stress, injury, or infection.' },
          ],
          facts: [
            { text: 'Neither eczema nor psoriasis is contagious. However, both can be irritated by harsh products, hot water, or friction from shaving.' },
            { text: 'Clients with psoriasis on the scalp may have flakes that resemble severe dandruff. Handle gently and avoid irritating the skin.' },
          ],
        },
        {
          id: 'herpes',
          label: 'HERPES',
          title: 'HERPES SIMPLEX — VIRAL INFECTION',
          bullets: [
            { label: 'TYPE 1', description: 'Cold sores or fever blisters around the mouth. Highly contagious during active outbreaks.' },
            { label: 'TYPE 2', description: 'Genital herpes — not relevant to barbering services but important to know for general health knowledge.' },
            { label: 'BARBER IMPACT', description: 'NEVER shave over active cold sores. The virus can spread to other areas and to you. Wait until lesions are completely healed.' },
          ],
          facts: [
            { text: 'Herpes simplex is contagious even before visible blisters appear. If a client feels tingling (prodrome), postpone facial services.' },
            { text: 'The herpes virus remains dormant in nerve cells and reactivates during stress, illness, or sun exposure.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 23: PIGMENT DISORDERS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'pigment-disorders',
      title: 'PIGMENT DISORDERS',
      subtitle: 'Conditions affecting skin coloration',
      features: [
        {
          icon: 'Moon',
          title: 'HYPERPIGMENTATION',
          description: 'Darker than normal skin patches. Examples: chloasma (mask of pregnancy), lentigines (freckles/liver spots), post-inflammatory hyperpigmentation after acne or injury.',
        },
        {
          icon: 'Sun',
          title: 'HYPOPIGMENTATION',
          description: 'Lighter or white patches. Examples: leukoderma, vitiligo (autoimmune destruction of melanocytes). Not contagious.',
        },
        {
          icon: 'Eye',
          title: 'ALBINISM',
          description: 'Congenital absence of melanin production. Characterized by white hair, very light skin, and pinkish eyes. Requires extreme sun protection.',
        },
        {
          icon: 'CircleDot',
          title: 'NEVUS (MOLE)',
          description: 'Small brownish spot or growth. Most are benign. Monitor for changes in size, shape, color, or elevation — could indicate melanoma.',
        },
        {
          icon: 'Droplet',
          title: 'PORT-WINE STAIN',
          description: 'Permanent discoloration present from birth. Caused by abnormal blood vessel development. Does not fade over time.',
        },
        {
          icon: 'Palette',
          title: 'TAN',
          description: 'Temporary darkening from sun or UV exposure. The skin\'s defense mechanism — increased melanin production in response to UV damage.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 24: HYPERTROPHIES (ABNORMAL GROWTHS)
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'hypertrophies',
      title: 'HYPERTROPHIES — ABNORMAL GROWTHS',
      subtitle: 'Raised or thickened skin formations',
      features: [
        {
          icon: 'Grip',
          title: 'KERATOMA',
          description: 'Thickened patch of skin caused by friction or pressure. Calluses and corns are types of keratomas. Do not remove — they are protective.',
        },
        {
          icon: 'Circle',
          title: 'MOLE',
          description: 'Small growth that may be raised or flat, dark or light, with or without hair. Most are harmless. Monitor for ABCDE changes.',
        },
        {
          icon: 'Tag',
          title: 'SKIN TAG',
          description: 'Small, benign outgrowth of skin, commonly on neck, chest, or underarms. Harmless but can be irritated by friction from capes or clippers.',
        },
        {
          icon: 'AlertTriangle',
          title: 'VERRUCA (WART)',
          description: 'Caused by human papillomavirus (HPV). Contagious and can spread by scratching or contact. Do not shave over warts — refer for medical treatment.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 25: SKIN CANCER
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'skin-cancer',
      title: 'SKIN CANCER — THE LIFE-SAVING SECTION',
      subtitle: 'Three types every barber must recognize',
      tabs: [
        {
          id: 'basal',
          label: 'BASAL CELL',
          title: 'BASAL CELL CARCINOMA — MOST COMMON',
          bullets: [
            { label: 'APPEARANCE', description: 'Pearly, waxy, or translucent nodules. May have visible blood vessels. Sometimes appears as a flat, flesh-colored scar.' },
            { label: 'SEVERITY', description: 'Least severe form of skin cancer. High survival rate with early treatment. Rarely metastasizes.' },
            { label: 'LOCATION', description: 'Most common on sun-exposed areas: face, neck, ears, scalp (in balding men), hands.' },
            { label: 'BARBER ROLE', description: 'Notice pearly bumps or non-healing sores on the scalp, face, or neck. Gently suggest a dermatologist visit.' },
          ],
          facts: [
            { text: 'Basal cell carcinoma accounts for approximately 80% of all skin cancers. It grows slowly but can cause significant local damage if untreated.' },
            { text: 'Men with thinning hair are at higher risk for scalp basal cell carcinoma because the scalp receives more sun exposure.' },
          ],
        },
        {
          id: 'squamous',
          label: 'SQUAMOUS CELL',
          title: 'SQUAMOUS CELL CARCINOMA — MORE SERIOUS',
          bullets: [
            { label: 'APPEARANCE', description: 'Scaly red papules, open sores, or crusted areas that do not heal. May be tender or bleed easily.' },
            { label: 'SEVERITY', description: 'More serious than basal cell. Can metastasize if untreated. Survival depends on stage at diagnosis.' },
            { label: 'LOCATION', description: 'Sun-exposed areas: face, ears, lips, back of hands, scalp.' },
            { label: 'BARBER ROLE', description: 'Watch for persistent scaly patches or non-healing sores. Early detection saves lives.' },
          ],
          facts: [
            { text: 'Squamous cell carcinoma is the second most common skin cancer, accounting for about 20% of cases.' },
            { text: 'Chronic sun exposure, fair skin, and a history of precancerous lesions increase risk significantly.' },
          ],
        },
        {
          id: 'melanoma',
          label: 'MELANOMA',
          title: 'MALIGNANT MELANOMA — MOST DANGEROUS',
          bullets: [
            { label: 'APPEARANCE', description: 'Black, brown, or multicolored patches with irregular borders. May be flat or raised, and can develop from existing moles.' },
            { label: 'SEVERITY', description: 'Least common but MOST DANGEROUS. 100% fatal if untreated. Spreads quickly to lymph nodes and organs.' },
            { label: 'EARLY DETECTION', description: 'Critical for survival. The 5-year survival rate is 99% when detected early but drops to 27% once it spreads.' },
            { label: 'BARBER ROLE', description: 'You may be the first to notice changes on the scalp, ears, or neck. Speak up — it could save a life.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: The ABCDE rule for melanoma detection: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution (changing).' },
            { text: 'Melanoma can develop anywhere — including under nails, on the scalp, and in areas with little sun exposure.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 26: ABCDE OF MELANOMA
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'abcde-melanoma',
      title: 'THE ABCDE OF MELANOMA DETECTION',
      subtitle: 'Memorize this — it could save a client\'s life',
      features: [
        {
          icon: 'Asterisk',
          title: 'A — ASYMMETRY',
          description: 'One half of the mole does not match the other half. Benign moles are usually symmetrical.',
        },
        {
          icon: 'Square',
          title: 'B — BORDER',
          description: 'Irregular, notched, or blurred edges. Benign moles have smooth, even borders.',
        },
        {
          icon: 'Palette',
          title: 'C — COLOR',
          description: 'Multiple colors or uneven distribution — shades of brown, black, tan, red, white, or blue.',
        },
        {
          icon: 'Ruler',
          title: 'D — DIAMETER',
          description: 'Larger than 6mm (about the size of a pencil eraser). Melanomas are usually larger, though early ones may be smaller.',
        },
        {
          icon: 'RefreshCw',
          title: 'E — EVOLUTION',
          description: 'Any change in size, shape, color, elevation, or new symptoms like bleeding, itching, or crusting.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 27: SKIN HEALTH MAINTENANCE
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'skin-health',
      title: 'MAINTAINING HEALTHY SKIN — CLIENT EDUCATION',
      items: [
        { text: 'Balanced diet with adequate fats, carbohydrates, and proteins' },
        { text: 'Vitamins A, C, D, and E support skin healing and health (consult physician before supplements)' },
        { text: 'Adequate water intake maintains cell health and toxin elimination' },
        { text: 'Sunscreen SPF 30+ on exposed skin daily' },
        { text: 'Regular moisturizers appropriate for skin type' },
        { text: 'Avoid excessive sun exposure, alcohol, and tobacco' },
        { text: 'Regular self-exams for new or changing moles and growths' },
        { text: 'Annual professional skin checkups, especially for high-risk clients' },
        { text: 'AMERICAN CANCER SOCIETY RECOMMENDATION: Regular self-exams and professional checkups for skin cancer detection' },
        { text: 'Many drugs are more effective when absorbed through the skin — be cautious about products you apply to clients' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 28: COMMON MISTAKES & MEMORY AIDS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'memory-aids',
      title: 'COMMON MISTAKES & MEMORY AIDS',
      subtitle: 'Avoid these errors and lock in the key facts',
      tabs: [
        {
          id: 'mistakes',
          label: 'MISTAKES',
          title: 'MISTAKES THAT COST POINTS ON THE EXAM',
          bullets: [
            { label: 'CONFUSING EPIDERMIS AND DERMIS', description: 'Epidermis = outer, no blood vessels, 5 layers. Dermis = inner, 25× thicker, contains glands/vessels/nerves.' },
            { label: 'THINKING BLACKHEADS ARE DIRT', description: 'Blackheads are oxidized sebum and melanin — NOT dirt. Telling clients to "wash better" is misinformation.' },
            { label: 'IGNORING SKIN CONDITIONS', description: 'Performing services on contagious or infected skin is negligence. Always inspect before starting.' },
            { label: 'MISSING MELANOMA SIGNS', description: 'The ABCDE rule is exam-critical. Asymmetry, Border, Color, Diameter, Evolution — memorize it.' },
            { label: 'CONFUSING PRIMARY AND SECONDARY LESIONS', description: 'Primary = original (bullae, papules, pustules). Secondary = evolved (crusts, scales, scars).' },
          ],
          facts: [
            { text: 'REMEMBER: When in doubt, refer out. Your license and your client\'s health are more important than one appointment.' },
            { text: 'REMEMBER: The skin is slightly acidic (pH ~5.5). This acidity inhibits bacterial growth — do not strip it with harsh alkaline products.' },
          ],
        },
        {
          id: 'mnemonics',
          label: 'MNEMONICS',
          title: 'MEMORY TRICKS THAT WORK',
          bullets: [
            { label: 'SHAPES', description: 'Sensation, Heat regulation, Absorption, Protection, Excretion, Secretion — the six functions of skin.' },
            { label: 'ABCDE', description: 'Asymmetry, Border, Color, Diameter, Evolution — melanoma detection. This appears on every board exam.' },
            { label: 'EPIDERMIS LAYERS (deep to surface)', description: 'Germinativum, Spinosum, Granulosum, Lucidum, Corneum — remember: "Go Somewhere Good, Life Continues."' },
            { label: 'SEBACEOUS vs SUDORIFEROUS', description: 'SEBACEOUS = SEbum (oil). SUDORIFEROUS = SWeat. Both start with S but produce different substances.' },
          ],
          facts: [
            { text: 'MNEMONIC: "The epidermis has NO blood — it is dead at the top and alive at the bottom, fed from below."' },
            { text: 'MNEMONIC: "Basal cell = Best outcome (most common, least severe). Melanoma = Most deadly (least common, most dangerous)."' },
          ],
        },
        {
          id: 'safety',
          label: 'SAFETY',
          title: 'NON-NEGOTIABLE SAFETY RULES',
          bullets: [
            { label: 'INSPECT BEFORE EVERY SERVICE', description: 'Check scalp, face, and neck for lesions, infections, or abnormalities before starting any service.' },
            { label: 'NEVER TREAT CONTAGIOUS CONDITIONS', description: 'Lice, scabies, impetigo, active herpes — these require medical treatment, not barbering services.' },
            { label: 'REFER UNKNOWN LESIONS', description: 'If you do not know what it is, do not touch it. Suggest a dermatologist visit.' },
            { label: 'DOCUMENT CONCERNS', description: 'If you notice a suspicious mole or growth, document it and mention it to the client professionally.' },
            { label: 'STAY IN YOUR SCOPE', description: 'You are a barber, not a doctor. Recognize, refer, and educate — but never diagnose or treat.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Performing services on contagious skin conditions is a sanitation violation that can result in license suspension.' },
            { text: 'Your observation skills are a professional asset. The client who sits in your chair trusts you with more than their hair — they trust you with their health.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 29: BOARD EXAM CRITICAL ALERTS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'board-exam-alerts',
      title: '🚨 BOARD EXAM CRITICAL ALERTS',
      content: 'These skin science concepts appear on EVERY state board exam. Miss them, and you fail.\n\n1. SKIN = largest organ; first line of defense; renews itself constantly.\n\n2. EPIDERMIS = outermost, NO blood vessels, 5 layers (germinativum → spinosum → granulosum → lucidum → corneum).\n\n3. DERMIS = 25× thicker than epidermis; contains glands, vessels, follicles, nerves.\n\n4. MELANIN = pigment from melanocytes in basal layer; protects against UV damage.\n\n5. SEBACEOUS GLANDS = oil/sebum; SUDORIFEROUS GLANDS = sweat.\n\n6. SHAPES = Skin functions (Sensation, Heat regulation, Absorption, Protection, Excretion, Secretion).\n\n7. PRIMARY LESIONS = original (bullae, papules, pustules, vesicles, wheals, macules, nodules, cysts, tumors).\n\n8. SECONDARY LESIONS = evolved (crusts, scales, scars, excoriations, fissures, keloids, ulcers).\n\n9. ACNE = grades I–IV; caused by Propionibacterium acnes in clogged follicles.\n\n10. ROSACEA = chronic flushing, redness, triggers include sun/spicy food/alcohol.\n\n11. THREE SKIN CANCERS: Basal cell (most common, least severe), Squamous cell (more serious), Melanoma (most dangerous).\n\n12. ABCDE = Melanoma detection (Asymmetry, Border, Color, Diameter, Evolution).\n\n13. NEVER TREAT infectious/contagious conditions — REFER to physician.\n\n14. CALLUSES = natural defense from pressure; do NOT remove.\n\n15. BLACKHEADS = oxidized sebum, NOT dirt.\n\n16. SKIN pH = slightly acidic (~5.5); protects against microorganisms.\n\n17. COLLAGEN = strength/support; ELASTIN = elasticity.\n\n18. BARBERS often first to notice skin/scalp changes — report and suggest dermatologist visit.\n\n19. HERPES SIMPLEX = contagious; never shave over active lesions.\n\n20. VERRUCA (WART) = viral, contagious; refer for medical treatment.\n\n21. DERMATOLOGY = branch of medical science studying skin, hair, and nails.\n\n22. LESION = any mark on skin indicating injury, damage, or disease.\n\n23. PRIMARY LESIONS = original, different color, raised above surface.\n\n24. SECONDARY LESIONS = evolved from primary lesions through accumulation or healing.\n\n25. SEBACEOUS CYST = STEATOMA = same condition, different name.\n\n26. BLOOD & LYMPH = supply nourishment; half the body\'s blood supply goes to skin.\n\n27. SKIN ABSORPTION = limited beyond stratum corneum; depends on thickness and concentration.\n\n28. AMERICAN CANCER SOCIETY recommends regular self-exams and professional checkups.\n\n29. BARBERS are often first to notice skin/scalp changes — report and suggest dermatologist visit.\n\n30. WHEN IN DOUBT, STOP AND REFER — your license and client health matter more than one appointment.',
      highlight: 'MEMORIZE THESE 30 POINTS',
    },

    // ═══════════════════════════════════════════
    // SECTION 30: SKIN SCENARIO
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'skin-scenario',
      title: '🏥 CLINICAL SCENARIO CHALLENGE',
      subtitle: 'Real shop situations that test your skin knowledge',
      scenarios: [
        {
          situation: 'A regular client sits in your chair. You notice a new dark spot on their scalp that was not there two weeks ago. It is irregular in shape, has multiple colors, and is larger than a pencil eraser. The client says it does not itch or hurt. What do you do?',
          options: [
            { letter: 'A', text: 'Shave around it carefully and continue the service', feedback: '❌ INCORRECT. Shaving near a suspicious lesion could irritate it or mask changes. More importantly, you have identified potential melanoma warning signs — this requires immediate professional attention.' },
            { letter: 'B', text: 'Politely mention your observation, explain the ABCDE warning signs in plain language, and strongly recommend a dermatologist visit within the week', feedback: '✅ CORRECT. You are not diagnosing — you are observing and referring. Your professional observation could save this client\'s life. Document the conversation and follow up at their next visit.' },
            { letter: 'C', text: 'Say nothing to avoid making the client uncomfortable', feedback: '❌ INCORRECT. Silence is not professionalism. The ABCDE signs you observed (Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution) are melanoma red flags. Speaking up is a professional obligation.' },
            { letter: 'D', text: 'Tell the client it is definitely melanoma and they need emergency surgery', feedback: '❌ INCORRECT. You are a barber, not a doctor. Never diagnose. Your role is to observe, express concern, and refer to a qualified medical professional.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'A new client requests a hot towel shave. During the consultation, you notice clusters of small fluid-filled blisters around their mouth and chin. They mention they have been feeling run down lately. What do you do?',
          options: [
            { letter: 'A', text: 'Proceed with the shave but avoid the blistered areas', feedback: '❌ INCORRECT. Herpes simplex (cold sores) is highly contagious, especially during active outbreaks. The virus can spread to other areas of the face and to you. Facial services must be postponed.' },
            { letter: 'B', text: 'Explain that facial services cannot be performed during an active outbreak and reschedule for at least one week after complete healing', feedback: '✅ CORRECT. Herpes simplex is contagious and shaving over active lesions spreads the virus. Rescheduling protects both the client and you. Suggest they consult a physician about antiviral treatment.' },
            { letter: 'C', text: 'Perform the shave but wear gloves for extra protection', feedback: '❌ INCORRECT. Gloves do not prevent herpes transmission in this context. The virus spreads by contact with fluid from blisters. No facial service should be performed during an active outbreak.' },
            { letter: 'D', text: 'Ask the client to sign a waiver and proceed with the service', feedback: '❌ INCORRECT. A waiver does not protect you from liability for performing services on contagious conditions. This is a sanitation violation that could result in license suspension.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 31: ACTION PROMPTS
    // ═══════════════════════════════════════════
    {
      type: 'actionPrompt',
      id: 'action-prompts',
      title: '🏥 CLINIC ACTION ITEMS',
      subtitle: 'Do these today to level up your skin science knowledge',
      prompts: [
        {
          action: 'Inspect Your Tools',
          description: 'Check all combs, brushes, and clippers for cleanliness. Dirty tools transfer bacteria to skin and cause infections.',
          benefit: 'Prevents skin infections and builds client trust',
          timeframe: '5 minutes',
        },
        {
          action: 'Practice the ABCDE Rule',
          description: 'Review the ABCDE melanoma detection criteria. Look at photos of normal moles vs. suspicious moles online.',
          benefit: 'Builds confidence in recognizing potential skin cancer',
          timeframe: '10 minutes',
        },
        {
          action: 'Update Your Consultation',
          description: 'Add a 30-second skin inspection to every client consultation. Check scalp, face, and neck before starting services.',
          benefit: 'Protects clients and demonstrates professionalism',
          timeframe: 'Ongoing',
        },
        {
          action: 'Know Your Referral Network',
          description: 'Find 2–3 dermatologists in your area. Keep their contact information at your station for client referrals.',
          benefit: 'Shows professionalism and helps clients get timely care',
          timeframe: '15 minutes',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 32: PRACTICE QUESTIONS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'practice-questions',
      title: '📝 PRACTICE QUESTIONS — TEST YOUR KNOWLEDGE',
      subtitle: 'These mirror the style of questions you will see on the state board exam',
      tabs: [
        {
          id: 'q1-5',
          label: 'QUESTIONS 1–5',
          title: 'PRACTICE QUESTIONS 1–5',
          bullets: [
            { label: 'Q1: What are the two main divisions of the skin?', description: 'ANSWER: Epidermis and Dermis. The subcutaneous tissue (hypodermis) is below the dermis but is not technically considered a division of the skin itself.' },
            { label: 'Q2: What is the deepest layer of the epidermis and what does it contain?', description: 'ANSWER: Stratum germinativum (basal cell layer). It contains melanocytes, which produce melanin pigment.' },
            { label: 'Q3: What is melanin and what does it do?', description: 'ANSWER: Melanin is pigment produced by melanocytes. It gives skin its color and protects against UV damage.' },
            { label: 'Q4: What are the two types of skin glands and their functions?', description: 'ANSWER: Sebaceous glands produce oil (sebum) for lubrication. Sudoriferous glands produce sweat for temperature regulation and waste elimination.' },
            { label: 'Q5: What does SHAPES stand for?', description: 'ANSWER: Sensation, Heat regulation, Absorption, Protection, Excretion, Secretion — the six functions of the skin.' },
          ],
          facts: [
            { text: 'These five questions cover the foundational anatomy and physiology that appear on every board exam.' },
          ],
        },
        {
          id: 'q6-10',
          label: 'QUESTIONS 6–10',
          title: 'PRACTICE QUESTIONS 6–10',
          bullets: [
            { label: 'Q6: What is the difference between primary and secondary skin lesions?', description: 'ANSWER: Primary lesions are the original lesions that appear first. Secondary lesions evolve from primary lesions through accumulation, infection, or healing.' },
            { label: 'Q7: What causes acne?', description: 'ANSWER: Bacteria (Propionibacterium acnes) multiply in clogged follicles, causing inflammation and infection. Hormonal changes and excess sebum contribute.' },
            { label: 'Q8: What are the ABCDE signs of melanoma?', description: 'ANSWER: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution (changing).' },
            { label: 'Q9: What should you do if you see a suspicious skin condition on a client?', description: 'ANSWER: Do not perform the service. Refer the client to a physician or dermatologist. Document your observation.' },
            { label: 'Q10: What is the most dangerous type of skin cancer?', description: 'ANSWER: Malignant melanoma. It is the least common but most dangerous form, with 100% fatality if untreated.' },
          ],
          facts: [
            { text: 'Questions 6–10 test lesion identification, disorder knowledge, melanoma detection, and professional judgment.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 33: FINAL ACADEMY PLEDGE
    // ═══════════════════════════════════════════
    {
      type: 'quote',
      id: 'academy-pledge',
      quote: 'I pledge to respect the skin as the vital organ it is. I will inspect before I serve, recognize before I treat, and refer before I risk. I understand that my chair is a frontline observation post and that my eyes can catch what mirrors miss. A master barber masters skin science.',
    },
  ],
}
