// Chapter 6: General Anatomy and Physiology — PREMIUM IMMERSIVE EXPERIENCE
// The Human Blueprint — clinical precision, living systems, barber relevance

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ───────────────────────────────────────────────
// CLINICAL BLUEPRINT THEME
// Medical teal / Clinical white / Deep navy / Vital red accents
// ───────────────────────────────────────────────

export const chapter6PremiumTheme: ChapterTheme = {
  primary: '#2DD4BF',
  primaryLight: '#5EEAD4',
  primaryDark: '#0D9488',
  secondary: '#F8FAFC',
  background: 'rgba(15, 23, 42, 0.95)',
  backgroundAlt: 'rgba(30, 41, 59, 0.90)',
  surface: '#0F172A',
  border: 'rgba(45, 212, 191, 0.30)',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  highlight: '#2DD4BF',
  timeline: {
    line: 'rgba(45, 212, 191, 0.4)',
    iconBg: '#1E293B',
    iconBorder: '#2DD4BF',
  },
  quote: {
    border: 'rgba(45, 212, 191, 0.45)',
    icon: 'rgba(45, 212, 191, 0.35)',
    bg: 'rgba(15, 23, 42, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(45, 212, 191, 0.18)',
    activeBorder: 'rgba(45, 212, 191, 0.55)',
    activeText: '#5EEAD4',
    inactiveBg: 'rgba(15, 23, 42, 0.7)',
    inactiveBorder: 'rgba(45, 212, 191, 0.15)',
    inactiveText: '#94A3B8',
    panelBg: 'rgba(15, 23, 42, 0.8)',
    panelBorder: 'rgba(45, 212, 191, 0.2)',
  },
  toolCard: {
    headerBg: 'rgba(45, 212, 191, 0.12)',
    headerText: '#5EEAD4',
    dot: 'rgba(45, 212, 191, 0.65)',
    line: 'rgba(45, 212, 191, 0.3)',
  },
  featureGrid: {
    iconBg: 'rgba(45, 212, 191, 0.18)',
    iconColor: '#2DD4BF',
    cardBorder: 'rgba(45, 212, 191, 0.22)',
  },
  milestone: {
    yearColor: '#2DD4BF',
    border: 'rgba(45, 212, 191, 0.25)',
  },
  checklist: {
    checkBorder: 'rgba(45, 212, 191, 0.45)',
    checkColor: '#2DD4BF',
    bg: 'rgba(15, 23, 42, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(15, 23, 42, 0.7)',
    border: 'rgba(45, 212, 191, 0.2)',
    highlightColor: '#5EEAD4',
  },
  challengeCard: {
    badgeBg: 'rgba(45, 212, 191, 0.2)',
    badgeText: '#5EEAD4',
    cardBorder: 'rgba(45, 212, 191, 0.25)',
    completedBg: 'rgba(16, 185, 129, 0.1)',
    completedBorder: 'rgba(16, 185, 129, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(239, 68, 68, 0.08)',
    optionBorder: 'rgba(45, 212, 191, 0.2)',
    correctBg: 'rgba(16, 185, 129, 0.12)',
    incorrectBg: 'rgba(239, 68, 68, 0.1)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(45, 212, 191, 0.2)',
    levelBadgeText: '#5EEAD4',
    rewardBg: 'rgba(16, 185, 129, 0.12)',
    rewardText: '#10B981',
  },
  actionPrompt: {
    cardBorder: 'rgba(45, 212, 191, 0.2)',
    completedBorder: 'rgba(16, 185, 129, 0.35)',
    benefitBg: 'rgba(45, 212, 191, 0.1)',
    benefitBorder: 'rgba(45, 212, 191, 0.3)',
  },
}

// ───────────────────────────────────────────────
// PREMIUM IMMERSIVE CHAPTER 6 CONTENT
// ───────────────────────────────────────────────

export const chapter6PremiumContent: ChapterContent = {
  chapterNumber: 6,
  title: 'GENERAL ANATOMY & PHYSIOLOGY',
  subtitle: 'The Human Blueprint — Understand the Body You Work On Every Day',
  theme: chapter6PremiumTheme,
  sections: [
    // ═══════════════════════════════════════════
    // SECTION 1: THE BLUEPRINT WELCOME
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'blueprint-welcome',
      title: '🧬 THE HUMAN BLUEPRINT',
      content: 'Every client who sits in your chair is a living system made of trillions of cells, 11 integrated body systems, and countless structures you interact with directly. When you massage a scalp, you work around blood vessels and nerve endings. When you shave a neck, you work over areas containing arteries and lymph nodes. When you recommend a product, you are working with the largest organ of the human body — the skin. This chapter builds anatomical knowledge for safer, more precise professional services.',
      highlight: 'KNOW THE BODY • WORK WITH PRECISION • BUILD TRUST',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: WHY ANATOMY MATTERS
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'anatomy-stakes',
      title: '⚠️ WHY ANATOMY MATTERS',
      subtitle: 'The real consequences of anatomical ignorance',
      cards: [
        {
          icon: 'Shield',
          title: 'CLIENT SAFETY',
          text: 'Avoid sustained or forceful pressure over the carotid area during neck work. If a client becomes dizzy or faint, stop the service and follow appropriate safety or emergency procedures. Do not manipulate swollen, tender, or otherwise abnormal areas; stay within barber scope and recommend evaluation when appropriate.',
        },
        {
          icon: 'Award',
          title: 'SERVICE EXCELLENCE',
          text: 'Understanding facial muscle structure lets you shave WITH the grain for comfort. Knowing hair follicle anatomy helps you explain growth patterns to clients. Precision requires knowledge.',
        },
        {
          icon: 'AlertCircle',
          title: 'LICENSE REQUIREMENT',
          text: 'State board exams test anatomy heavily. You will face questions on bones, muscles, nerves, skin structure, and circulatory pathways. This chapter is exam survival.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: CELLS & TISSUES
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'cells-tissues',
      title: '🔬 CELLS & TISSUES — THE BUILDING BLOCKS',
      subtitle: 'Everything starts with the cell',
      tabs: [
        {
          id: 'cell-structure',
          label: 'CELL STRUCTURE',
          title: 'The Basic Unit of Life',
          bullets: [
            { label: 'Protoplasm', description: 'Colorless, jelly-like substance containing proteins, fats, carbohydrates, mineral salts, and water — the living material of the cell.' },
            { label: 'Nucleus', description: 'The control center that directs cell reproduction and contains DNA. Without the nucleus, the cell cannot divide or function properly.' },
            { label: 'Cytoplasm', description: 'Fluid surrounding the nucleus containing organelles that perform specialized functions like energy production and protein synthesis.' },
            { label: 'Cell Membrane', description: 'The outer layer that encloses the cell and regulates what enters and exits — critical for maintaining cellular health.' },
          ],
          facts: [
            { text: '📋 BOARD EXAM ALERT: Cells reproduce by MITOSIS — this is how tissues grow and repair after injury.' },
            { text: '📋 Remember: All living organisms are composed of cells. This is the foundation of biology.' },
          ],
        },
        {
          id: 'tissue-types',
          label: '4 TISSUE TYPES',
          title: 'Tissues — Groups of Similar Cells',
          bullets: [
            { label: 'Epithelial Tissue', description: 'Protective covering tissue. Forms skin, mucous membranes, and glands. This is the tissue you work with MOST as a barber.' },
            { label: 'Connective Tissue', description: 'Supports, protects, and binds other tissues. Includes bone, cartilage, fat, and blood. Provides structure to the body.' },
            { label: 'Muscular Tissue', description: 'Contracts and moves the body. Three types: skeletal (voluntary), smooth (involuntary), and cardiac (heart only).' },
            { label: 'Nervous Tissue', description: 'Carries messages throughout the body via neurons. Forms the brain, spinal cord, and nerves and helps coordinate sensation, movement, and many automatic body functions.' },
          ],
          facts: [
            { text: '📋 In barbering, you work most directly with EPITHELIAL tissue (skin and hair) and MUSCULAR tissue (facial muscles during massage).' },
            { text: '📋 Connective tissue includes blood. Blood vessels in the scalp deliver oxygen and nutrients to living tissues; topical product behavior is a separate skin and hair-care concept.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 4: THE 11 BODY SYSTEMS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'body-systems',
      title: '🏛️ THE 11 BODY SYSTEMS',
      subtitle: 'Every system plays a role in the services you provide',
      features: [
        {
          icon: 'Shield',
          title: 'Integumentary',
          description: 'Skin, hair, nails, glands. THE system you work on directly. Protection, sensation, temperature regulation.',
        },
        {
          icon: 'Bone',
          title: 'Skeletal',
          description: '206 bones providing structure and protection. Skull shape determines head shape for cutting.',
        },
        {
          icon: 'Dumbbell',
          title: 'Muscular',
          description: '600+ muscles enabling movement. Facial muscles shape expressions you see in the mirror.',
        },
        {
          icon: 'Zap',
          title: 'Nervous',
          description: 'Brain, spinal cord, nerves. Controls sensation — clients feel every touch of your blade.',
        },
        {
          icon: 'Activity',
          title: 'Endocrine',
          description: 'Glands and hormones. Regulates hair growth, skin oil production, and overall metabolism.',
        },
        {
          icon: 'Heart',
          title: 'Cardiovascular',
          description: 'Heart, blood, blood vessels. Delivers oxygen and nutrients to hair follicles and skin.',
        },
        {
          icon: 'Droplets',
          title: 'Lymphatic/Immune',
          description: 'Lymph nodes, vessels, spleen. Removes waste and fights infection. Critical near neck and jaw.',
        },
        {
          icon: 'Wind',
          title: 'Respiratory',
          description: 'Lungs and airways. You breathe while working — but also notice client breathing patterns for comfort.',
        },
        {
          icon: 'Utensils',
          title: 'Digestive',
          description: 'Breaks down food so nutrients can be absorbed and used by the body. Overall nutrition supports normal hair and skin structure and function.',
        },
        {
          icon: 'Filter',
          title: 'Urinary',
          description: 'Kidneys, ureters, and bladder help remove wastes and regulate fluid balance. Visible skin changes are nonspecific and should not be used by a barber to judge kidney function.',
        },
        {
          icon: 'Users',
          title: 'Reproductive',
          description: 'Hormonal changes affect hair growth patterns, skin condition, and oil production throughout life.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 5: SKELETAL SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'skeletal-system',
      title: '🦴 SKELETAL SYSTEM — THE FRAMEWORK',
      subtitle: 'Bones you need to know for barbering',
      tabs: [
        {
          id: 'skull-bones',
          label: 'SKULL BONES',
          title: 'The Skull — 22 Bones',
          bullets: [
            { label: 'Frontal Bone', description: 'Forms the forehead and upper eye sockets. Shape affects how bangs and front hairlines fall.' },
            { label: 'Parietal Bones (2)', description: 'Form the sides and roof of the cranium. The curve here determines crown shape for cutting.' },
            { label: 'Temporal Bones (2)', description: 'Located at the sides, housing the ear canals. Critical area for sideburn placement and taper work.' },
            { label: 'Occipital Bone', description: 'Forms the back of the skull. The occipital ridge affects how hair lays at the neckline.' },
            { label: 'Nasal Bones (2)', description: 'Form the bridge of the nose. Reference point for beard shaping and symmetry.' },
            { label: 'Mandible', description: 'The lower jawbone. Shape determines jawline definition for beard design and fading.' },
            { label: 'Maxillae (2)', description: 'Upper jaw bones. Support the upper lip and mustache area.' },
            { label: 'Zygomatic Bones (2)', description: 'Cheekbones. High or flat cheekbones change how facial hair frames the face.' },
          ],
          facts: [
            { text: '📋 BOARD EXAM ALERT: The skull has 22 bones total — 8 cranial bones and 14 facial bones.' },
            { text: '📋 The mandible is the ONLY movable bone in the face — it moves when clients talk or chew.' },
          ],
        },
        {
          id: 'vertebrae',
          label: 'VERTEBRAE',
          title: 'The Adult Spinal Column — 26 Bones',
          bullets: [
            { label: 'Cervical (7)', description: 'Neck vertebrae. The top two (atlas and axis) allow head rotation. You support these during shampooing.' },
            { label: 'Thoracic (12)', description: 'Upper back vertebrae. Connected to ribs. Prolonged poor posture can contribute to upper-back discomfort during barbering.' },
            { label: 'Lumbar (5)', description: 'Lower back vertebrae. Bear most body weight. Standing all day stresses this region.' },
            { label: 'Sacrum (1)', description: 'Triangular bone at the base of the spine. Fused from 5 vertebrae.' },
            { label: 'Coccyx (1)', description: 'Tailbone. Fused from 3-5 vertebrae. Sits at the very bottom of the spine.' },
          ],
          facts: [
            { text: '📋 The cervical vertebrae are the smallest and most flexible — this is why the neck moves so freely during services.' },
            { text: '📋 Barbering posture tip: A neutral, supported posture can help reduce unnecessary lower-back strain during prolonged standing.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'skeletal-upper-body',
      title: '🦴 UPPER-BODY BONES BARBERS SHOULD RECOGNIZE',
      content: 'The source chapter extends skeletal study beyond the skull and spine into the neck, chest, shoulder, arm, wrist, hand, and fingers. The hyoid is a U-shaped bone at the base of the tongue. The humerus is the large upper-arm bone. In the forearm, the ulna lies on the little-finger side and the radius lies on the thumb side. The wrist is formed by eight small carpal bones. Five metacarpals form the framework of the palm, and the phalanges form the fingers and thumb. These landmarks matter to barbers because repeated shoulder, arm, wrist, and hand motion is part of daily professional work.',
      highlight: 'HUMERUS = UPPER ARM • RADIUS = THUMB SIDE • ULNA = LITTLE-FINGER SIDE • CARPALS = WRIST • METACARPALS = PALM • PHALANGES = FINGERS',
    },

    // SECTION 6: MUSCULAR SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'muscular-system',
      title: '💪 MUSCULAR SYSTEM — FACIAL MUSCLES',
      subtitle: 'Muscles that shape the face and affect your services',
      tabs: [
        {
          id: 'facial-muscles',
          label: 'FACIAL MUSCLES',
          title: 'Muscles of Facial Expression',
          bullets: [
            { label: 'Frontalis', description: 'Covers the forehead. Raises eyebrows and wrinkles the forehead. Active when clients raise eyebrows during consultation.' },
            { label: 'Orbicularis Oculi', description: 'Ring muscle around the eye. Closes the eyelid. You see this contract when clients squint at mirror checks.' },
            { label: 'Orbicularis Oris', description: 'Ring muscle around the mouth. Purses lips. Affects mustache area and lip line during shaving.' },
            { label: 'Buccinator', description: 'Cheek muscle. Compresses cheeks (like blowing). Supports the cheek area during facial massage.' },
            { label: 'Platysma', description: 'Broad sheet muscle covering the neck. Depresses the jaw and wrinkles neck skin. Critical for neck shaving and trimming.' },
            { label: 'Masseter', description: 'Powerful chewing muscle at the jaw angle. Closes the jaw. Bulges when clients clench — affects jawline fading.' },
            { label: 'Temporalis', description: 'Fan-shaped muscle at the temple. Elevates and retracts the jaw. Covers the temple area for clipper work.' },
            { label: 'Sternocleidomastoid', description: 'Neck muscle from sternum to mastoid process. Rotates and flexes the head. Visible during neck trimming.' },
          ],
          facts: [
            { text: '📋 BOARD EXAM ALERT: The platysma is the broad muscle covering the neck — critical for neck shaving and understanding skin tension.' },
            { text: '📋 The masseter is a powerful jaw-closing muscle and becomes prominent when a client clenches, which can change the contour of the jawline during service.' },
          ],
        },
        {
          id: 'muscle-types',
          label: 'MUSCLE TYPES',
          title: 'Three Types of Muscle Tissue',
          bullets: [
            { label: 'Striated (Skeletal)', description: 'Voluntary muscles attached to bones. You control them consciously. Enables all purposeful movement.' },
            { label: 'Nonstriated (Smooth)', description: 'Involuntary muscles in internal organs. You cannot control them. Found in blood vessels and digestive tract.' },
            { label: 'Cardiac', description: 'Involuntary striated muscle found in the heart. Its specialized electrical conduction system supports continuous rhythmic contraction and high fatigue resistance.' },
          ],
          facts: [
            { text: '📋 Muscles of facial expression are skeletal (striated) muscles under voluntary control, although facial movement can also occur reflexively or automatically.' },
            { text: '📋 Arrector pili muscles are smooth (involuntary) — they cause goosebumps when clients are cold or nervous.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'muscular-upper-body',
      title: '💪 MUSCLE STRUCTURE & UPPER-EXTREMITY MOVEMENT',
      subtitle: 'Book-aligned anatomy for the body mechanics barbers use every day',
      tabs: [
        {
          id: 'muscle-structure',
          label: 'MUSCLE STRUCTURE',
          title: 'Origin, Belly, and Insertion',
          bullets: [
            { label: 'Origin', description: 'The attachment that remains relatively fixed during a movement.' },
            { label: 'Belly', description: 'The main middle portion of a muscle that contracts and produces force.' },
            { label: 'Insertion', description: 'The attachment that moves when the muscle contracts.' },
          ],
          facts: [
            { text: '📋 On exam questions, identify which end is relatively fixed versus which attachment moves during contraction.' },
          ],
        },
        {
          id: 'arm-forearm-muscles',
          label: 'ARM & FOREARM',
          title: 'Key Muscles Used in Repetitive Barbering Work',
          bullets: [
            { label: 'Deltoid', description: 'Covers the shoulder joint and helps move the arm outward from the body.' },
            { label: 'Biceps', description: 'Front upper-arm muscle that helps flex the elbow and lift the forearm.' },
            { label: 'Triceps', description: 'Back upper-arm muscle that extends the forearm.' },
            { label: 'Flexors & Extensors', description: 'Forearm muscle groups that bend and straighten the wrist and fingers.' },
            { label: 'Pronator', description: 'Turns the forearm so the palm rotates inward/downward.' },
            { label: 'Supinator', description: 'Rotates the forearm so the palm turns upward/outward.' },
          ],
          facts: [
            { text: '📋 Barber relevance: clipper, shear, comb, razor, and brush control depend on coordinated shoulder, elbow, forearm, wrist, and hand movement.' },
          ],
        },
      ],
    },

    // SECTION 7: NERVOUS SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'nervous-system',
      title: '🧠 NERVOUS SYSTEM — CONTROL CENTER',
      subtitle: 'How the body communicates and why it matters to barbers',
      tabs: [
        {
          id: 'cns-pns',
          label: 'CNS & PNS',
          title: 'Central vs. Peripheral Nervous System',
          bullets: [
            { label: 'Central Nervous System (CNS)', description: 'Brain and spinal cord. The command center. Processes all information and sends orders to the body.' },
            { label: 'Peripheral Nervous System (PNS)', description: 'Nerves branching from the spinal cord to all body parts. Carries signals to and from the CNS.' },
            { label: 'Sensory Nerves', description: 'Carry messages TO the brain (pain, touch, temperature). Clients feel your blade through these nerves.' },
            { label: 'Motor Nerves', description: 'Carry messages FROM the brain to muscles. Control movement. Affected by nerve damage or compression.' },
          ],
          facts: [
            { text: '📋 BOARD EXAM ALERT: The nervous system is divided into CNS (brain + spinal cord) and PNS (all other nerves).' },
            { text: '📋 Injury to facial nerves can impair sensation or movement. Barbers should avoid forceful pressure and stay within safe service technique.' },
          ],
        },
        {
          id: 'cranial-nerves',
          label: 'CRANIAL NERVES',
          title: 'Cranial Nerves Most Relevant to Barbering',
          bullets: [
            { label: 'Cranial Nerve V (Trigeminal)', description: 'The largest cranial nerve. Controls chewing muscles and carries facial sensation. Three branches: ophthalmic, maxillary, mandibular.' },
            { label: 'Cranial Nerve VII (Facial)', description: 'Controls muscles of facial expression. Dysfunction can affect facial movement; barbers should observe without diagnosing and use gentle, appropriate technique.' },
            { label: 'Cranial Nerve X (Vagus)', description: 'Longest cranial nerve. Extends through the neck to the chest and abdomen and helps regulate several involuntary functions. Avoid forceful deep-neck pressure and stop the service if a client becomes dizzy or faint.' },
          ],
          facts: [
            { text: '📋 The trigeminal nerve (V) has three branches — one serves the forehead, one the cheek, one the jaw. All are relevant to barbering.' },
            { text: '📋 Avoid sustained or forceful pressure over the carotid area and other sensitive neck structures. Stop the service and follow appropriate safety procedures if a client becomes dizzy or faint.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'nervous-head-neck-branches',
      title: '🧠 HEAD, FACE & NECK NERVE LANDMARKS',
      subtitle: 'Named branches emphasized in the source chapter',
      tabs: [
        {
          id: 'facial-nerve-branches',
          label: 'FACIAL NERVE',
          title: 'Important Branches of Cranial Nerve VII',
          bullets: [
            { label: 'Temporal Branch', description: 'Serves muscles in the temple, forehead, eyebrow, eyelid, and upper cheek region.' },
            { label: 'Zygomatic Branch', description: 'Serves muscles in the upper cheek area.' },
            { label: 'Buccal Branch', description: 'Serves muscles around the mouth and cheek region.' },
            { label: 'Marginal Mandibular Branch', description: 'Serves muscles along the lower jaw and lower lip region.' },
          ],
          facts: [
            { text: '📋 These are motor branches involved with facial expression. Do not confuse facial-nerve motor function with the trigeminal nerve’s major sensory role.' },
          ],
        },
        {
          id: 'cervical-nerves',
          label: 'CERVICAL NERVES',
          title: 'Scalp and Neck Sensory Landmarks',
          bullets: [
            { label: 'Greater Occipital Nerve', description: 'Supplies sensation to much of the posterior scalp and extends upward toward the top of the head.' },
            { label: 'Lesser Occipital Nerve', description: 'Serves the lower posterior/lateral scalp near the base of the skull.' },
            { label: 'Greater Auricular Nerve', description: 'Serves skin around the ear and nearby side-of-neck region.' },
            { label: 'Cervical Cutaneous Nerve', description: 'Serves skin along the front and sides of the neck.' },
          ],
          facts: [
            { text: '📋 Barber relevance: know these as anatomical landmarks for sensation and safe service awareness—not as targets for diagnosis or treatment.' },
          ],
        },
      ],
    },

    // SECTION 8: CIRCULATORY SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'circulatory-system',
      title: '❤️ CIRCULATORY SYSTEM — BLOOD FLOW',
      content: 'The circulatory system delivers oxygen and nutrients to every cell and removes waste products. For barbers, understanding blood flow to the head, face, and neck is essential. The heart pumps blood through arteries (away from heart) and returns it through veins (toward heart).\n\nKEY ARTERIES OF THE HEAD AND NECK:\n• Common carotid artery — splits into internal (brain) and external (face/scalp) carotid arteries\n• Temporal artery — supplies the temple and side of head\n• Facial artery — supplies the face, crosses the jaw near the chin\n• Superficial temporal artery — pulse point in front of the ear\n\nKEY VEINS:\n• Internal jugular vein — collects blood from the brain and deep face structures\n• External jugular vein — carries blood from the superficial head, face, and neck\n• Both veins run parallel to arteries and share their names\n\n⚠️ SAFETY: The carotid arteries supply blood to the brain. Never apply sustained pressure here. The jugular veins return blood — avoid aggressive massage over these vessels.',
      highlight: 'ARTERIES CARRY AWAY • VEINS RETURN • NEVER COMPRESS CAROTID',
    },

    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'cardiovascular-detail',
      title: '❤️ BLOOD & HEAD/FACE/NECK CIRCULATION',
      subtitle: 'Expanded from the source chapter into barber-focused exam review',
      tabs: [
        {
          id: 'blood-functions',
          label: 'BLOOD FUNCTIONS',
          title: 'What Blood Does',
          bullets: [
            { label: 'Transport', description: 'Carries oxygen and nutrients to living tissues and carries carbon dioxide and other wastes away.' },
            { label: 'Temperature Regulation', description: 'Helps distribute heat and support temperature balance throughout the body.' },
            { label: 'Defense', description: 'White blood cells and immune components help defend against harmful microorganisms and toxins.' },
            { label: 'Clotting', description: 'Platelets and clotting factors help seal damaged blood vessels and reduce continued blood loss.' },
          ],
          facts: [
            { text: '📋 Do not reduce blood to “oxygen delivery” only—transport, defense, temperature regulation, and clotting are all testable functions.' },
          ],
        },
        {
          id: 'head-face-arteries',
          label: 'ARTERIES',
          title: 'Named Arteries Emphasized for the Head and Face',
          bullets: [
            { label: 'Supraorbital', description: 'Supplies the upper eyelid and forehead region.' },
            { label: 'Submental', description: 'Supplies the chin and lower-lip region.' },
            { label: 'Inferior & Superior Labial', description: 'Supply the lower and upper lips respectively.' },
            { label: 'Frontal & Parietal', description: 'Branches associated with the forehead and side/crown of the scalp.' },
            { label: 'Transverse Facial', description: 'Supplies portions of the face across the cheek region.' },
            { label: 'Middle Temporal', description: 'Supplies the temple region.' },
            { label: 'Anterior & Posterior Auricular', description: 'Supply areas around the front and back of the ear and nearby scalp.' },
          ],
          facts: [
            { text: '📋 Learn location relationships, not just names. The exam may ask which vessel supplies a specific head, face, lip, ear, or scalp region.' },
          ],
        },
        {
          id: 'head-neck-veins',
          label: 'VEINS',
          title: 'Principal Jugular Veins',
          bullets: [
            { label: 'Internal Jugular', description: 'Collects venous blood from the brain and deeper regions of the face and neck.' },
            { label: 'External Jugular', description: 'Returns blood from more superficial regions of the head, face, and neck toward the heart.' },
          ],
          facts: [
            { text: '📋 Safety remains the priority: anatomical knowledge helps you avoid aggressive pressure over major neck vessels; it does not authorize vascular assessment or treatment.' },
          ],
        },
      ],
    },

    // SECTION 9: LYMPHATIC/IMMUNE SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'lymphatic-system',
      title: '🛡️ LYMPHATIC & IMMUNE SYSTEM',
      subtitle: 'The body\'s defense and waste removal network',
      features: [
        {
          icon: 'Droplets',
          title: 'Lymph Fluid',
          description: 'Clear fluid circulating in lymphatic vessels. Carries waste away from cells and returns it to the bloodstream.',
        },
        {
          icon: 'Shield',
          title: 'Lymph Nodes',
          description: 'Small lymphatic structures that filter lymph and support immune activity. Swelling can have multiple causes; barbers should observe without diagnosing and recommend evaluation when appropriate.',
        },
        {
          icon: 'Heart',
          title: 'Thymus Gland',
          description: 'Located behind the sternum. Produces T-cells that fight infection. Most active in childhood.',
        },
        {
          icon: 'Filter',
          title: 'Spleen',
          description: 'Largest lymphatic organ. Filters blood, stores blood cells, and produces antibodies.',
        },
        {
          icon: 'Activity',
          title: '5 Key Functions',
          description: '1. Carry nourishment to cells 2. Defend against toxins 3. Remove infection by-products 4. Remove waste 5. Provide fluid environment',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 10: INTEGUMENTARY SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'integumentary-system',
      title: '🛡️ INTEGUMENTARY SYSTEM — SKIN & HAIR',
      subtitle: 'The largest organ — and your primary workspace',
      tabs: [
        {
          id: 'skin-structure',
          label: 'SKIN STRUCTURE',
          title: 'The Two Main Layers',
          bullets: [
            { label: 'Epidermis (Outer Layer)', description: 'Thin, protective outer layer. No blood vessels. New cells form in the deeper epidermis and move toward the surface as they mature. Epidermal renewal occurs over several weeks and varies by age, body site, and individual factors.' },
            { label: 'Dermis (Inner Layer)', description: 'Thick, deeper layer containing blood vessels, nerves, glands, hair follicles, and connective tissue. The "true skin" that provides strength and elasticity.' },
            { label: 'Subcutaneous Layer', description: 'Below the dermis. Fatty tissue that insulates, cushions, and stores energy. Not technically skin but important for understanding facial structure.' },
          ],
          facts: [
            { text: '📋 BOARD EXAM ALERT: The epidermis has NO blood vessels — it receives nourishment by diffusion from the dermis below.' },
            { text: '📋 The dermis contains many structures relevant to barbering, including hair follicles, sebaceous glands, sweat glands, blood vessels, and nerve endings.' },
          ],
        },
        {
          id: 'skin-glands',
          label: 'GLANDS',
          title: 'Glands of the Skin',
          bullets: [
            { label: 'Sudoriferous (Sweat) Glands', description: 'Excrete perspiration to regulate body temperature and eliminate waste. Two types: eccrine (all over) and apocrine (armpits, groin — activated at puberty).' },
            { label: 'Sebaceous (Oil) Glands', description: 'Secrete sebum (oil) that helps lubricate skin and hair. They are commonly associated with hair follicles, with some follicle-independent glands. Higher or lower sebum production can contribute to oiliness or dryness.' },
            { label: 'Ceruminous Glands', description: 'Located in the ear canal. Secrete cerumen (earwax) that protects the ear from dust and bacteria. Never probe into the ear canal.' },
          ],
          facts: [
            { text: '📋 Sebaceous glands are commonly associated with hair follicles and release sebum that helps lubricate skin and hair. Some sebaceous glands open directly onto the skin rather than into a follicle.' },
            { text: '📋 Apocrine gland activity increases around puberty. Body odor can have multiple sources, so avoid treating it as a single-cause sign.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 11: ENDOCRINE SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'endocrine-system',
      title: '⚡ ENDOCRINE SYSTEM — HORMONE CONTROL',
      subtitle: 'Glands that regulate hair growth, skin condition, and metabolism',
      tabs: [
        {
          id: 'key-glands',
          label: 'KEY GLANDS',
          title: 'Major Endocrine Glands',
          bullets: [
            { label: 'Pituitary Gland', description: 'Gland at the base of the brain that is often called the "master gland" because its hormones regulate several other endocrine glands as well as growth and other body functions.' },
            { label: 'Thyroid Gland', description: 'Butterfly-shaped gland in the neck. Thyroid hormones help regulate metabolism and body heat. Thyroid disorders can be associated with changes in hair and skin, but barbers should not diagnose the cause.' },
            { label: 'Parathyroid Glands (4)', description: 'Behind the thyroid. Regulate calcium and phosphorus levels. Critical for bone health and nerve function.' },
            { label: 'Adrenal Glands (2)', description: 'On top of kidneys. Produce adrenaline and cortisol. Affect stress response, blood pressure, and inflammation.' },
            { label: 'Pancreas', description: 'Behind the stomach. Produces insulin and glucagon. Regulates blood sugar. Diabetes affects wound healing and skin health.' },
            { label: 'Ovaries (Female)', description: 'Produce estrogen and progesterone. Affect hair texture, skin condition, and oil production throughout the menstrual cycle.' },
            { label: 'Testes (Male)', description: 'Produce testosterone. Androgens such as testosterone influence facial-hair development, muscle development, and sebum production, but individual response varies.' },
          ],
          facts: [
            { text: '📋 REVIEW: The pituitary is often called the "master gland" because it regulates several other endocrine glands through hormone signals; it does not control every endocrine gland.' },
            { text: '📋 Androgens, including testosterone, influence facial-hair growth. Hair response varies with genetics, hormone levels, receptor sensitivity, age, and other individual factors.' },
          ],
        },
        {
          id: 'hormone-effects',
          label: 'BARBER IMPACT',
          title: 'How Hormones Affect Your Work',
          bullets: [
            { label: 'Hair Growth', description: 'Thyroid hormones and androgens are among the factors that influence hair-growth cycles and facial/body hair development. Hormonal changes may contribute to thinning or shedding, but individual causes vary.' },
            { label: 'Skin Condition', description: 'Estrogen and other hormones influence skin structure and moisture. Hormonal changes during menopause may contribute to dryness, while stress hormones can influence oil production and inflammation.' },
            { label: 'Oil Production', description: 'Androgens can increase sebaceous-gland activity, especially around puberty, but oiliness varies by individual. Product recommendations should stay within barber scope and avoid diagnosing a hormonal cause.' },
            { label: 'Pigmentation', description: 'Melanocyte-stimulating hormone is involved in pigmentation. Changes in hair or skin color can have many causes and should not be diagnosed by a barber.' },
          ],
          facts: [
            { text: '📋 Stress and stress hormones can influence skin and hair, but acne, scalp oiliness, and hair shedding have many possible causes. Barbers should avoid diagnosing a cause and recommend appropriate professional evaluation for persistent or concerning changes.' },
            { text: '📋 Pregnancy and postpartum hormone shifts can change the hair-growth cycle. Some people notice fuller hair during pregnancy and increased shedding after delivery; patterns and severity vary.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'endocrine-exocrine',
      title: '⚡ ENDOCRINE VS. EXOCRINE GLANDS',
      content: 'The source chapter distinguishes two gland categories. Endocrine glands are ductless: they release hormones into the bloodstream so those chemical messengers can influence activity elsewhere in the body. Exocrine glands use ducts to carry their products to a surface or specific location; sweat and oil glands of the skin are familiar barbering examples. Hormones such as insulin, adrenaline, estrogen, and testosterone influence body functions, but visible hair or skin changes alone do not identify a specific hormonal condition.',
      highlight: 'ENDOCRINE = DUCTLESS / HORMONES TO BLOOD • EXOCRINE = DUCTS / PRODUCT TO A SURFACE OR LOCATION',
    },

    // SECTION 12: REPRODUCTIVE, RESPIRATORY, EXCRETORY, DIGESTIVE
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'other-systems',
      title: '🔄 OTHER BODY SYSTEMS',
      subtitle: 'Systems that indirectly affect barbering services',
      features: [
        {
          icon: 'Users',
          title: 'Reproductive System',
          description: 'Hormonal changes during puberty, pregnancy, and menopause can influence hair-growth patterns, texture, and skin condition, with substantial individual variation.',
        },
        {
          icon: 'Wind',
          title: 'Respiratory System',
          description: 'The respiratory system brings oxygen into the body, and the cardiovascular system transports that oxygen to tissues, including hair follicles. Smoking can impair circulation and is associated with broader skin and hair health effects.',
        },
        {
          icon: 'Filter',
          title: 'Excretory/Urinary System',
          description: 'Kidneys filter wastes from the blood and help regulate fluid and electrolyte balance. Visible skin changes are nonspecific and should not be used by a barber to infer kidney function or diagnose disease.',
        },
        {
          icon: 'Utensils',
          title: 'Digestive System',
          description: 'Breaks down food into nutrients. Adequate protein, vitamins, minerals, and overall nutrition support normal hair growth and structure.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 13: BOARD EXAM SUMMARY TABLE
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'board-exam-summary',
      title: '📋 BOARD EXAM QUICK REFERENCE',
      content: 'SYSTEM → KEY STRUCTURES → BARBER RELEVANCE\n\nINTEGUMENTARY → Skin, hair, nails, glands → Your PRIMARY workspace\nSKELETAL → 206 bones, 22 skull bones → Head shape, jawline, posture\nMUSCULAR → 600+ muscles, key facial muscles → Massage, shaving, expressions\nNERVOUS → CNS, PNS, cranial nerves → Sensation, safety, massage pressure\nCIRCULATORY → Heart, arteries, veins → Blood flow to scalp, safety zones\nLYMPHATIC → Lymph nodes, vessels, spleen → Immunity, infection signs\nENDOCRINE → Key endocrine glands → Hair growth, skin condition, oil production\nRESPIRATORY → Lungs, airways → Gas exchange; works with circulation to supply tissues\nDIGESTIVE → Stomach, intestines → Nutrient absorption for hair health\nEXCRETORY → Kidneys, bladder → Waste removal and fluid balance\nREPRODUCTIVE → Hormones → Hair patterns, skin changes, life stages',
      highlight: 'KNOW ALL 11 SYSTEMS • FOCUS ON INTEGUMENTARY, SKELETAL, MUSCULAR, NERVOUS',
    },

    // ═══════════════════════════════════════════
    // SECTION 14: COMMON MISTAKES
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'common-mistakes',
      title: '⚠️ COMMON MISTAKES TO AVOID',
      content: '❌ Confusing arteries and veins — Arteries carry blood AWAY from the heart. Veins RETURN blood to the heart.\n\n❌ Forgetting the 11th system — Students often remember 10 and forget the reproductive system. It counts!\n\n❌ Mixing up cranial nerves — Nerve V (Trigeminal) controls sensation and chewing. Nerve VII (Facial) controls facial expressions. Different functions!\n\n❌ Thinking the epidermis has blood vessels — The epidermis is avascular. Blood vessels are found in deeper tissues such as the dermis, not within the epidermis itself.\n\n❌ Applying forceful pressure to the neck — Avoid sustained or deep pressure over the carotid area and sensitive neck structures. Stop the service if the client becomes dizzy, faint, or otherwise unwell.\n\n❌ Confusing muscle types — Striated = voluntary (facial muscles). Smooth = involuntary (blood vessels, arrector pili). Cardiac = only in heart.',
      highlight: 'THESE MISTAKES COST POINTS ON THE BOARD EXAM',
    },

    // ═══════════════════════════════════════════
    // SECTION 15: REMEMBER THIS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'remember-this',
      title: '🧠 REMEMBER THIS — KEY MEMORY ANCHORS',
      content: '🔑 MITOSIS = the usual process of somatic cell division used for growth and tissue renewal.\n\n🔑 4 TISSUE TYPES: Epithelial (covering), Connective (support), Muscular (movement), Nervous (communication)\n\n🔑 11 BODY SYSTEMS: Integumentary, Skeletal, Muscular, Nervous, Endocrine, Cardiovascular, Lymphatic, Respiratory, Digestive, Urinary, Reproductive\n\n🔑 SKULL = 22 bones (8 cranial + 14 facial). Mandible is the ONLY movable facial bone.\n\n🔑 3 MUSCLE TYPES: Striated (voluntary), Smooth (involuntary), Cardiac (heart only)\n\n🔑 NERVOUS SYSTEM: CNS (brain + spinal cord) + PNS (all other nerves)\n\n🔑 CRANIAL NERVE V = Trigeminal (sensation + chewing). CRANIAL NERVE VII = Facial (expressions)\n\n🔑 ARTERIES AWAY, VEINS RETURN — Never compress carotid arteries\n\n🔑 EPIDERMIS = no blood vessels. DERMIS = contains blood vessels, nerves, glands, follicles\n\n🔑 PITUITARY = often called the "master gland" because it regulates several other endocrine glands. ANDROGENS such as testosterone influence facial hair growth.',
      highlight: 'HIGH-VALUE REVIEW: MEMORIZE THESE 10 ANCHORS',
    },

    // ═══════════════════════════════════════════
    // SECTION 16: REAL SHOP SCENARIOS
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'real-shop-scenarios',
      title: '🏪 REAL SHOP SCENARIOS',
      subtitle: 'Apply anatomical knowledge to real barbering situations',
      scenarios: [
        {
          situation: 'A client complains of dizziness during a hot towel neck massage. They look pale and sweaty.',
          options: [
            { letter: 'A', text: 'Continue the massage — it is just relaxation', feedback: '❌ Wrong! Dizziness or pallor is a reason to stop the service and assess the client rather than continuing.' },
            { letter: 'B', text: 'Immediately stop the service, keep the client safely positioned, and assess how they feel', feedback: '✅ Correct! Stop the service, keep the client safe, assess responsiveness and symptoms, and follow appropriate first-aid or emergency procedures if needed.' },
            { letter: 'C', text: 'Tell them to tough it out — massages sometimes feel intense', feedback: '❌ Never dismiss client discomfort. Dizziness is a physiological warning sign, not a mental weakness.' },
            { letter: 'D', text: 'Apply more pressure to "work through it"', feedback: '❌ Unsafe. Do not increase pressure when a client reports or shows concerning symptoms; stop the service and respond appropriately.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'You notice a client has a swollen lymph node behind their ear during a haircut. They say it has been there for two weeks.',
          options: [
            { letter: 'A', text: 'Ignore it — lymph nodes swell all the time', feedback: '❌ Do not dismiss persistent or concerning swelling. A barber should observe without diagnosing, avoid manipulating the area, and recommend appropriate medical evaluation.' },
            { letter: 'B', text: 'Politely suggest they see a doctor since it has persisted', feedback: '✅ Correct! Barbers are not diagnosticians. When swelling has persisted or otherwise seems concerning, avoid manipulating the area and recommend appropriate medical evaluation.' },
            { letter: 'C', text: 'Tell them it is probably cancer', feedback: '❌ Never diagnose or alarm clients. Suggest seeing a professional without causing panic.' },
            { letter: 'D', text: 'Massage the node to "help it drain"', feedback: '❌ Do not massage or manipulate a swollen or abnormal area. Stay within barber scope and recommend appropriate evaluation rather than attempting treatment.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'A teenage client asks why their face is so oily and they are getting acne breakouts.',
          options: [
            { letter: 'A', text: 'Tell them they are not washing enough', feedback: '❌ Over-simplification and potentially shaming. Oiliness has multiple influences and should not be reduced to hygiene alone.' },
            { letter: 'B', text: 'Explain that hormonal changes during puberty can increase oil production, while avoiding a diagnosis. Suggest gentle, appropriate skin-care practices within your scope.', feedback: '✅ Correct! Give general education without diagnosing a cause, keep recommendations within barber scope, and suggest medical evaluation for persistent or concerning symptoms.' },
            { letter: 'C', text: 'Say it is just bad genetics', feedback: '❌ Dismissive and overly certain. Genetics, hormones, skin-care practices, and other factors can all influence oiliness and breakouts.' },
            { letter: 'D', text: 'Diagnose the breakouts as a hormone disorder and tell them which treatment they need', feedback: '❌ Barbers should not diagnose endocrine or skin disorders or prescribe treatment. Stay within scope and refer persistent or concerning problems to an appropriate professional.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 17: LEVEL UP SYSTEM
    // ═══════════════════════════════════════════
    {
      type: 'levelUp',
      id: 'anatomy-levels',
      title: '🏆 ANATOMY MASTERY LEVELS',
      subtitle: 'Progress from beginner to master of the human blueprint',
      levels: [
        {
          level: 'LEVEL 1',
          title: 'Cell Scout',
          description: 'Memorize the 4 tissue types and basic cell structure. Know the difference between epithelial and connective tissue.',
          reward: '📛 Cell Scout Badge',
        },
        {
          level: 'LEVEL 2',
          title: 'System Navigator',
          description: 'Name all 11 body systems and their primary functions. Understand which systems are most relevant to barbering.',
          reward: '📛 System Navigator Badge',
        },
        {
          level: 'LEVEL 3',
          title: 'Bone Expert',
          description: 'Identify the 8 cranial bones and 14 facial bones. Know the mandible is the only movable facial bone.',
          reward: '📛 Bone Expert Badge',
        },
        {
          level: 'LEVEL 4',
          title: 'Muscle Master',
          description: 'Name the 8 key facial muscles and their functions. Distinguish between striated, smooth, and cardiac muscle.',
          reward: '📛 Muscle Master Badge',
        },
        {
          level: 'LEVEL 5',
          title: 'Nerve Whisperer',
          description: 'Understand CNS vs PNS. Know cranial nerves V and VII. Recognize safety zones during massage.',
          reward: '📛 Nerve Whisperer Badge',
        },
        {
          level: 'BOSS MODE',
          title: 'Human Blueprint Master',
          description: 'Teach anatomy to another student. Pass a 50-question practice exam with 90%+. Apply anatomical knowledge to recommend services and products.',
          reward: '🏆 Human Blueprint Master Certification',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 18: CLOSING QUOTE
    // ═══════════════════════════════════════════
    {
      type: 'quote',
      id: 'anatomy-closing-quote',
      quote: 'The barber who understands the body beneath the hair can work with greater precision, safety, and professional awareness. Anatomy is more than exam knowledge; it supports sound service decisions and appropriate recognition of when to stop or refer.',
    },
  ],
}
