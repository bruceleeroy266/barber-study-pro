// Chapter 13: Shaving and Facial-Hair Design — PREMIUM IMMERSIVE EXPERIENCE
// THE BARBER'S BLADE — Master the Art of the Professional Shave

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// THE BARBER'S BLADE THEME — Classic Barbershop Heritage
// Deep burgundy / Warm brass / Ivory cream / Charcoal
// Feels like: A vintage barbershop where craftsmanship reigns
// ═══════════════════════════════════════════════

export const chapter13PremiumTheme: ChapterTheme = {
  primary: '#8B2635',
  primaryLight: '#B84555',
  primaryDark: '#5C1A24',
  secondary: '#C9A84C',
  background: 'rgba(24, 20, 20, 0.96)',
  backgroundAlt: 'rgba(36, 30, 30, 0.92)',
  surface: '#181414',
  border: 'rgba(139, 38, 53, 0.25)',
  text: '#F5F0EB',
  textMuted: '#B8A89A',
  highlight: '#C9A84C',
  timeline: {
    line: 'rgba(139, 38, 53, 0.35)',
    iconBg: '#241E1E',
    iconBorder: '#8B2635',
  },
  quote: {
    border: 'rgba(139, 38, 53, 0.4)',
    icon: 'rgba(139, 38, 53, 0.3)',
    bg: 'rgba(24, 20, 20, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(139, 38, 53, 0.15)',
    activeBorder: 'rgba(139, 38, 53, 0.5)',
    activeText: '#B84555',
    inactiveBg: 'rgba(24, 20, 20, 0.7)',
    inactiveBorder: 'rgba(139, 38, 53, 0.12)',
    inactiveText: '#B8A89A',
    panelBg: 'rgba(24, 20, 20, 0.85)',
    panelBorder: 'rgba(139, 38, 53, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(139, 38, 53, 0.1)',
    headerText: '#B84555',
    dot: 'rgba(139, 38, 53, 0.6)',
    line: 'rgba(139, 38, 53, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(139, 38, 53, 0.15)',
    iconColor: '#8B2635',
    cardBorder: 'rgba(139, 38, 53, 0.2)',
  },
  milestone: {
    yearColor: '#8B2635',
    border: 'rgba(139, 38, 53, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(139, 38, 53, 0.4)',
    checkColor: '#8B2635',
    bg: 'rgba(24, 20, 20, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(24, 20, 20, 0.7)',
    border: 'rgba(139, 38, 53, 0.18)',
    highlightColor: '#C9A84C',
  },
  challengeCard: {
    badgeBg: 'rgba(201, 168, 76, 0.15)',
    badgeText: '#C9A84C',
    cardBorder: 'rgba(139, 38, 53, 0.22)',
    completedBg: 'rgba(0, 230, 118, 0.1)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(201, 168, 76, 0.06)',
    optionBorder: 'rgba(139, 38, 53, 0.18)',
    correctBg: 'rgba(0, 230, 118, 0.1)',
    incorrectBg: 'rgba(255, 82, 82, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(139, 38, 53, 0.2)',
    levelBadgeText: '#B84555',
    rewardBg: 'rgba(0, 230, 118, 0.12)',
    rewardText: '#00E676',
  },
  actionPrompt: {
    cardBorder: 'rgba(139, 38, 53, 0.2)',
    completedBorder: 'rgba(0, 230, 118, 0.35)',
    benefitBg: 'rgba(201, 168, 76, 0.1)',
    benefitBorder: 'rgba(201, 168, 76, 0.3)',
  },
}

// ═══════════════════════════════════════════════
// CHAPTER 13: SHAVING AND FACIAL-HAIR DESIGN
// ═══════════════════════════════════════════════

export const chapter13PremiumContent: ChapterContent = {
  chapterNumber: 13,
  title: 'Shaving and Facial-Hair Design',
  subtitle: 'Master the timeless art of the professional shave and facial-hair sculpting',
  theme: chapter13PremiumTheme,
  sections: [
    // Section 1: Why Study Shaving
    {
      type: 'infoCards',
      id: 'why-study-shaving',
      title: 'Why Study Shaving and Facial-Hair Design?',
      cards: [
        {
          icon: 'Scissors',
          title: 'A Traditional Skill',
          text: 'Shaving is a traditional skill that separates barbering from other professions and helps ensure the longevity of the craft.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Safety First',
          text: 'Shaving requires careful attention, skill, and practice to perfect. Understanding proper technique prevents injury and irritation.',
        },
        {
          icon: 'User',
          title: 'Facial Structure Knowledge',
          text: 'Shaving and facial-hair design require knowledge about bone structure and facial features to create balanced, flattering results.',
        },
      ],
    },
    {
      type: 'quote',
      id: 'shaving-quote',
      quote: 'When performed correctly, a full facial shave, complete with hot towels, lotions, and massage, is one of the most relaxing, yet rejuvenating, services men can enjoy in the barbershop.',
    },

    // Section 2: Basic Guidelines for Shaving
    {
      type: 'contentBlock',
      id: 'shaving-fundamentals',
      title: 'Understand the Fundamentals of Shaving',
      content: 'Shaving is one of the basic services performed in the barbershop; its primary objective is to remove the visible part of facial and neck hair without causing irritation to the skin. A changeable-blade or conventional straight razor, hot towels, and warm lather are used in a professional shave. Although there are general shaving principles that apply to all men, there are also exceptions that require consideration based on individual characteristics.',
      highlight: 'remove the visible part of facial and neck hair without causing irritation',
    },
    {
      type: 'checklist',
      id: 'shaving-dos-donts',
      title: 'Dos and Don\'ts of Shaving',
      items: [
        { text: 'Analyze the client\'s skin before beginning — do not proceed if infection or pustules are present' },
        { text: 'Analyze hair growth pattern to identify grain changes before shaving' },
        { text: 'Do not use hot towels on skin that is chapped, blistered, thin, or sensitive' },
        { text: 'Do not perform a deep cleansing facial immediately after a shave' },
        { text: 'Be careful when shaving sensitive areas beneath the lower lip, lower neck, and around the Adam\'s apple' },
        { text: 'Use pH-balanced fresheners or toners when stronger astringents are too harsh' },
        { text: 'Heavy beard growth may require more thorough lathering and more hot-towel applications' },
        { text: 'When a client wears a mustache, trim and shape it prior to the shave service' },
      ],
    },

    // Section 3: Hair Type Considerations
    {
      type: 'contentBlock',
      id: 'hair-type-considerations',
      title: 'Hair Type Considerations',
      content: 'Curly facial hair requires special care because it grows in a looped direction as it grows out of the follicle; if not shaved correctly, it can bend back into the skin surface where it may cause ingrown hairs (pseudofolliculitis). Ingrown hairs are often the result of improper hair removal by a razor, tweezers, or trimmer. Improper hair removal includes excessively close shaving, shaving in the wrong direction, and/or excessive pressure with clippers, trimmers, or razors.',
      highlight: 'Curly facial hair requires special care',
    },
    {
      type: 'infoCards',
      id: 'ingrown-hair-info',
      title: 'Understanding Ingrown Hairs',
      cards: [
        {
          icon: 'AlertTriangle',
          title: 'Causes',
          text: 'Excessively close shaving, shaving in the wrong direction, and excessive pressure with clippers, trimmers, or razors.',
        },
        {
          icon: 'Ban',
          title: 'Consequences',
          text: 'New hair can be trapped or pushed under the skin, resulting in infected bumps (folliculitis) and sometimes keloid conditions.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Prevention',
          text: 'Shave with the grain, use light pressure, and avoid stretching the skin too tightly during the shave.',
        },
      ],
    },

    // Section 4: Hair Growth and Grain
    {
      type: 'contentBlock',
      id: 'hair-growth-grain',
      title: 'Hair Growth Considerations',
      content: 'As hair emerges from the skin surface it flows in a particular direction. This direction of hair growth creates the grain of the hair. A grain change occurs when hair growing in one direction meets hair that is growing in a different or an opposite direction. Hair growth patterns are visible indicators of the direction of the hair as it emerges from the skin surface. Growth patterns determine hairline shapes and whether the hair lies down as it emerges from the skin or results in a whorl, cowlick, or other growth feature.',
      highlight: 'grain change occurs when hair growing in one direction meets hair growing in a different direction',
    },
    {
      type: 'featureGrid',
      id: 'grain-terms',
      title: 'Key Shaving Terms',
      features: [
        {
          icon: 'ArrowDown',
          title: 'With the Grain',
          description: 'Shaving in the same direction that the hair grows. This is the standard and safest approach for the first-time-over shave.',
        },
        {
          icon: 'ArrowUp',
          title: 'Against the Grain',
          description: 'Shaving in the opposite direction of hair growth. Used in close shaves but may irritate skin and cause ingrown hairs.',
        },
        {
          icon: 'ArrowRight',
          title: 'Across the Grain',
          description: 'Shaving perpendicular to the direction of hair growth. Used in once-over and second-time-over shaves for completeness.',
        },
        {
          icon: 'RefreshCw',
          title: 'Grain Change',
          description: 'Where hair growing in one direction meets hair growing in a different or opposite direction. Requires adjusted razor strokes.',
        },
      ],
    },

    // Section 5: The 14 Shaving Areas
    {
      type: 'contentBlock',
      id: 'fourteen-areas',
      title: 'The 14 Shaving Areas of the Face',
      content: 'There are 14 shaving areas of the face to be shaved during the first-time-over part of the service. These areas are shaved systematically and sequentially from one section to another using a specific razor position to shave with the grain in each area. While men\'s facial hair usually grows in the same direction in each of the 14 shaving areas, there are always exceptions. Occasionally, a section of the beard or neck hair will grow in a whorl pattern and may require the barber to use a different razor stroke.',
      highlight: '14 shaving areas shaved systematically and sequentially',
    },
    {
      type: 'tabbed',
      id: 'shaving-areas-tabbed',
      title: 'Shaving Areas by Position',
      subtitle: 'Right-handed barber reference (left-handed barbers mirror)',
      tabs: [
        {
          id: 'freehand-areas',
          label: 'Freehand Areas',
          title: 'Freehand Stroke Areas',
          bullets: [
            { label: 'Area 1', description: 'From right sideburn toward jawbone and angle of mouth' },
            { label: 'Area 3', description: 'From center of upper lip to corner of mouth on right side' },
            { label: 'Area 4', description: 'From right jawbone to grain change' },
            { label: 'Area 8', description: 'From angle of mouth toward point of chin' },
            { label: 'Area 11', description: 'Across chin from left to right' },
            { label: 'Area 12', description: 'Under chin to grain change' },
          ],
        },
        {
          id: 'backhand-areas',
          label: 'Backhand Areas',
          title: 'Backhand Stroke Areas',
          bullets: [
            { label: 'Area 2', description: 'From angle of mouth toward point of chin' },
            { label: 'Area 6', description: 'From center of lip to corner of left side of mouth' },
            { label: 'Area 7', description: 'From left sideburn toward jawbone and angle of mouth' },
            { label: 'Area 9', description: 'From left jawbone to grain change' },
          ],
        },
        {
          id: 'reverse-freehand-areas',
          label: 'Reverse Freehand',
          title: 'Reverse Freehand Stroke Areas',
          bullets: [
            { label: 'Area 5', description: 'Right side of neck up to grain change' },
            { label: 'Area 10', description: 'Left side of neck to grain change' },
            { label: 'Area 13', description: 'Center of neck to grain change' },
            { label: 'Area 14', description: 'Beneath lower lip' },
          ],
        },
      ],
    },

    // Section 6: Razor Positions and Strokes
    {
      type: 'contentBlock',
      id: 'razor-positions-intro',
      title: 'Understand Razor Positions and Strokes',
      content: 'The term used to describe the correct angle of cutting with a razor is called the cutting stroke. To achieve a proper cutting stroke, the razor is positioned at a slight angle to the skin surface and stroked with the point leading. This should be a light-handed forward gliding motion that is most often positioned to shave with the grain of the hair, not against it. The four razor positions used in barbering are freehand, backhand, reverse freehand, and reverse backhand.',
      highlight: 'razor is positioned at a slight angle to the skin surface and stroked with the point leading',
    },
    {
      type: 'featureGrid',
      id: 'razor-positions',
      title: 'The Four Razor Positions',
      features: [
        {
          icon: 'Hand',
          title: 'Freehand',
          description: 'Handle rests between third and fourth fingers, thumb on side of shank. Used for gliding strokes toward you. Used in 6 of 14 areas.',
        },
        {
          icon: 'HandMetal',
          title: 'Backhand',
          description: 'Shank held firmly between thumb and first two fingers at pivot. Used for gliding strokes away from you. Used in 4 of 14 areas.',
        },
        {
          icon: 'ArrowUp',
          title: 'Reverse Freehand',
          description: 'Similar to freehand but stroke is performed upward rather than downward. Usually performed standing behind the client. Used in 4 areas.',
        },
        {
          icon: 'ArrowDown',
          title: 'Reverse Backhand',
          description: 'Same holding position as backhand, but elbow is positioned downward and forearm upward. Uses a downward gliding stroke along the natural hairline.',
        },
      ],
    },

    // Section 7: Skin Stretching
    {
      type: 'contentBlock',
      id: 'skin-stretching',
      title: 'The Art of Skin Stretching',
      content: 'Proper skin stretching is essential for a safe, effective shave. While the right hand holds and strokes the razor, the fingers of the left hand gently stretch the skin area being shaved. Taut skin allows the beard hair to be cut more easily. Loose skin tends to push out in front of the razor and can result in cuts or nicks. Stretching the skin too tightly, however, will cause irritation. The skin must be held firmly, neither too loosely nor too tightly, to create the correct shaving surface for the razor.',
      highlight: 'The skin must be held firmly, neither too loosely nor too tightly',
    },
    {
      type: 'checklist',
      id: 'skin-stretching-tips',
      title: 'Skin Stretching Guidelines',
      items: [
        { text: 'Use the cushions of the fingertips to stretch the skin with proper pressure' },
        { text: 'Use the thumb and second finger as the primary digits for stretching' },
        { text: 'Stretch different areas of the skin in the opposite direction that the razor will travel' },
        { text: 'Keep the fingers of the nondominant hand dry at all times' },
        { text: 'Find the balance between stretching too much or too little' },
        { text: 'Remove excess lather with the thumb to see the area to be shaved' },
      ],
    },

    // Section 8: Body Positioning
    {
      type: 'contentBlock',
      id: 'body-positioning',
      title: 'Body Positioning for the Shave',
      content: 'The shave procedure begins with the barber standing at the client\'s side; right-handed barbers stand at the client\'s right side; left-handed barbers stand at the client\'s left side. Gently turn the client\'s head to the position needed to accommodate the stroke. Take half steps or shift body weight from one foot to the other to change position.',
      highlight: 'right-handed barbers stand at the client\'s right side; left-handed barbers stand at the client\'s left side',
    },
    {
      type: 'featureGrid',
      id: 'body-positions',
      title: 'Four Common Body Positions (Right-Handed Barber)',
      features: [
        {
          icon: 'User',
          title: 'Slightly at Front of Right Side',
          description: 'Shaving Areas 1, 4, and 12 (if using freehand)',
        },
        {
          icon: 'User',
          title: 'Centered at Right Side',
          description: 'Shaving Areas 2, 3, 6, 8, 11, and 12 (if using backhand)',
        },
        {
          icon: 'User',
          title: 'At Client\'s Right Shoulder',
          description: 'Shaving Areas 7 and 9',
        },
        {
          icon: 'User',
          title: 'Behind Client\'s Right Shoulder',
          description: 'Shaving Areas 5, 10, 13, and 14',
        },
      ],
    },

    // Section 9: The Professional Shave Steps
    {
      type: 'contentBlock',
      id: 'professional-shave',
      title: 'The Professional Shave',
      content: 'The three main steps of a standard professional shave are preparation, shaving, and finishing. Preparation includes draping the client, preparing hot towels, and preparing the client\'s face. Shaving involves safely removing hair in the 14 shaving areas. Finishing includes massaging moisturizer, toning, and a light powder dusting.',
      highlight: 'three main steps: preparation, shaving, and finishing',
    },
    {
      type: 'tabbed',
      id: 'shave-steps',
      title: 'The Three Steps of a Professional Shave',
      tabs: [
        {
          id: 'preparation',
          label: 'Preparation',
          title: 'Preparing for the Shave',
          bullets: [
            { label: 'Draping', description: 'Properly drape the client for the shave service' },
            { label: 'Hot Towels', description: 'Prepare hot towels to soften the beard and relax the client' },
            { label: 'Steaming', description: 'Steam softens the hair cuticle, provides lubrication by stimulating oil glands, and relaxes the client' },
            { label: 'Lathering', description: 'Shaving cream or gel cleanses the skin, softens hair, holds hair upright, and creates a smooth surface for the razor' },
          ],
        },
        {
          id: 'shaving',
          label: 'Shaving',
          title: 'Performing the Shave',
          bullets: [
            { label: 'Systematic Strokes', description: 'Razor strokes should be correct and systematic across all 14 areas' },
            { label: 'Coordination', description: 'Proper coordination of both hands is necessary — right hand strokes, left hand stretches' },
            { label: 'Taut Skin', description: 'Taut skin allows beard hair to be cut more easily; loose skin can result in cuts' },
            { label: 'Light Touch', description: 'Use a light hand with forward gliding motion leading with the point of the blade' },
          ],
        },
        {
          id: 'finishing',
          label: 'Finishing',
          title: 'Finishing the Service',
          bullets: [
            { label: 'Moisturizer', description: 'Massage moisturizer into the skin to soothe and hydrate' },
            { label: 'Toning', description: 'Tone to remove residual cream product' },
            { label: 'Powder', description: 'Light powder dusting to leave a matte finish, if desired' },
            { label: 'Neck Shave', description: 'Traditionally, a neck shave is also offered at this time' },
          ],
        },
      ],
    },

    // Section 10: Types of Shaves
    {
      type: 'contentBlock',
      id: 'types-of-shaves',
      title: 'Know the Types of Shaves',
      content: 'There are several terms that both barbers and clients may use to describe either a type of shave or the different steps performed in a standard shave service. These terms have remained consistent for decades, so it is important that you become familiar with the terminology.',
      highlight: 'terms have remained consistent for decades',
    },
    {
      type: 'featureGrid',
      id: 'shave-types',
      title: 'Types of Shaves',
      features: [
        {
          icon: 'Scissors',
          title: 'First-Time-Over Shave',
          description: 'The primary shave performed on lathered facial hair. Objective is to remove beard growth without irritation and leave a smooth skin surface.',
        },
        {
          icon: 'RefreshCw',
          title: 'Second-Time-Over Shave',
          description: 'Follows the first-time-over to remove rough or uneven spots. Uses freehand stroke with or across the grain on moistened skin.',
        },
        {
          icon: 'Zap',
          title: 'Once-Over Shave',
          description: 'Requires less time. Uses a few more strokes across the grain in each area with a single lathering. Results in a smooth face without being a close shave.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Close Shave',
          description: 'Shaving against the grain during the second-time-over. Undesirable because it may irritate skin and lead to infection or ingrown hairs.',
        },
      ],
    },

    // Section 11: Neck and Outline Shaves
    {
      type: 'contentBlock',
      id: 'neck-outline',
      title: 'The Neck Shave and the Outline Shave',
      content: 'A neck shave traditionally accompanies a facial shave and involves shaving the neckline on both sides of the neck behind the ears and across the nape if desired or necessary. A complete outline shave includes the sideburn, around the ear, behind the ear areas, and sometimes the front hairline, and typically follows a haircut. Be sure to check the hairline and neck areas for moles, warts, or other hypertrophies before beginning the neck shave.',
      highlight: 'check the hairline and neck areas for moles, warts, or other hypertrophies',
    },

    // Section 12: Mustache Design
    {
      type: 'contentBlock',
      id: 'mustache-design',
      title: 'Trimming and Designing the Mustache',
      content: 'A mustache is most often worn for personal adornment and men are usually very particular about how it is designed and maintained. Care, artistry, and sensitivity to the client\'s preferences are required. Corrective shaping or redesign can help clients with daily maintenance until their next visit.',
      highlight: 'Care, artistry, and sensitivity to the client\'s preferences are required',
    },
    {
      type: 'tabbed',
      id: 'mustache-factors',
      title: 'Mustache Design Factors',
      tabs: [
        {
          id: 'facial-features',
          label: 'Facial Features',
          title: 'Facial Characteristics That Influence Mustache Design',
          bullets: [
            { label: 'Width of the mouth', description: 'Affects the horizontal span of the mustache' },
            { label: 'Size of the nose', description: 'Larger noses can balance with medium to large mustaches' },
            { label: 'Shape of upper lip area', description: 'Determines the natural boundary and curve of the mustache' },
            { label: 'Width of cheeks, jaw, and chin', description: 'Wider features can support heavier mustache designs' },
            { label: 'Density and texture of hair growth', description: 'Thicker hair allows fuller, more dramatic styles' },
          ],
        },
        {
          id: 'design-guidelines',
          label: 'Design Guidelines',
          title: 'Mustache Design Guidelines by Face Type',
          bullets: [
            { label: 'Large, coarse facial features', description: 'Heavier-looking mustache' },
            { label: 'Prominent nose', description: 'Medium to large mustache' },
            { label: 'Long, narrow face', description: 'Narrow to medium mustache' },
            { label: 'Extra-large mouth', description: 'Pyramid-shaped mustache' },
            { label: 'Extra-small mouth', description: 'Medium, short mustache' },
            { label: 'Smallish, regular features', description: 'Smaller, triangular mustache' },
            { label: 'Wide mouth with prominent upper lip', description: 'Heavier handlebar or large divided mustache' },
            { label: 'Round face with regular features', description: 'Semisquare mustache' },
            { label: 'Square with angular features', description: 'Heavier, linear mustache with ends slightly curving downward' },
          ],
        },
      ],
    },

    // Section 13: Beard Design
    {
      type: 'contentBlock',
      id: 'beard-design',
      title: 'Designing the Beard',
      content: 'Like mustaches, beards can be used to balance the appearance of facial features. The correct shaping or design of the beard can emphasize pleasant facial features, minimize less desirable ones, and camouflage flaws. It is important to develop a good eye for balance and proportion. Since very few individuals have perfectly symmetrical face shapes, it may be challenging to create the illusion of symmetry and balance in design.',
      highlight: 'emphasize pleasant facial features, minimize less desirable ones, and camouflage flaws',
    },
    {
      type: 'checklist',
      id: 'beard-tips',
      title: 'Practical Tips for Beard Design',
      items: [
        { text: 'Analyze the density and distribution of hair to identify uneven growth areas' },
        { text: 'Work with the natural hairline in the sideburn, cheek, and mustache areas' },
        { text: 'Consider where hair growth under the chin and jaw changes direction' },
        { text: 'Leave facial hair slightly longer than desired during first trimming — you can always cut more off' },
        { text: 'Face the client to the mirror so they can check progress and clarify preferences' },
        { text: 'Beard trimming is usually performed with shears, comb, outliner, clippers, and razor' },
        { text: 'Even-all-over clipper-cutting works best on beards with even density and texture' },
        { text: 'Start with a blade size close to the client\'s current beard length when trimming' },
      ],
    },

    // Section 14: Infection Control and Safety
    {
      type: 'contentBlock',
      id: 'infection-control',
      title: 'Infection Control and Safety Precautions',
      content: 'Safety is paramount when performing shaving services. Proper infection control protects both the barber and the client. Always follow standard precautions and state board regulations.',
      highlight: 'Safety is paramount when performing shaving services',
    },
    {
      type: 'checklist',
      id: 'safety-precautions',
      title: 'Shaving Safety Checklist',
      items: [
        { text: 'Clean and disinfect razors and blades before use' },
        { text: 'Discard used blades in a sharps container' },
        { text: 'Wash your hands before servicing a client' },
        { text: 'Use clean linens, capes, and paper products' },
        { text: 'Provide a clean cloth or paper barrier between the client\'s head and the headrest' },
        { text: 'Treat small cuts or nicks using standard precautions and exposure incident procedures' },
        { text: 'Lock the chair once the client is properly draped and in position' },
        { text: 'Prepare facial hair with warm or hot towels and lather before shaving' },
        { text: 'Use a light touch and forward gliding motion that leads with the point of the blade' },
        { text: 'Observe hair growth pattern and shave with it, not against it' },
        { text: 'Lather against the grain gently to place hair in position to be shaved' },
        { text: 'Keep fingers dry to stretch or hold skin firmly during the shave' },
        { text: 'Use cushions of fingertips to stretch skin in the opposite direction of the razor stroke' },
        { text: 'Keep fingers and thumb of nondominant hand away from the path of the razor' },
        { text: 'Apply lather neatly and replace as necessary' },
        { text: 'Keep the skin moist while shaving' },
        { text: 'Follow through with shaving strokes; do not stop short or shave over an area repeatedly' },
      ],
    },

    // Section 15: Customer Satisfaction
    {
      type: 'contentBlock',
      id: 'customer-satisfaction',
      title: 'Customer Satisfaction Factors',
      content: 'While there are many reasons why a client may find fault with a shave procedure, the most common complaints are preventable with attention to detail and professionalism.',
      highlight: 'most common complaints are preventable with attention to detail',
    },
    {
      type: 'featureGrid',
      id: 'satisfaction-factors',
      title: 'Common Causes of Client Dissatisfaction',
      features: [
        {
          icon: 'AlertTriangle',
          title: 'Tool Issues',
          description: 'Dull or rough razors cause irritation and an uneven shave.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Cleanliness',
          description: 'Unclean hands, towels, or drape signal poor hygiene standards.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Temperature',
          description: 'Cold fingers, poorly heated towels, or poorly heated lather create discomfort.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Technique',
          description: 'Heavy touch, scraping the skin, close shaving, and unshaven patches indicate poor skill.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Environment',
          description: 'Glaring overhead lights and offensive body odor or foul breath of the barber ruin the experience.',
        },
      ],
    },

    // Section 16: Razor Anatomy
    {
      type: 'contentBlock',
      id: 'razor-anatomy',
      title: 'Straight Razor Anatomy',
      content: 'Before learning to shave, master the fundamentals of handling the razor. Review the parts of the razor to become familiar with terms associated with this tool.',
      highlight: 'master the fundamentals of handling the razor',
    },
    {
      type: 'infoCards',
      id: 'razor-parts',
      title: 'Parts of the Straight Razor',
      cards: [
        {
          icon: 'Grip',
          title: 'Handle',
          text: 'The part held in the hand during shaving.',
        },
        {
          icon: 'ArrowRight',
          title: 'Tang',
          text: 'The extended part of the blade that connects to the handle.',
        },
        {
          icon: 'RotateCcw',
          title: 'Pivot',
          text: 'The point where the blade and handle connect, allowing the razor to open and close.',
        },
        {
          icon: 'Minus',
          title: 'Shank',
          text: 'The unsharpened part of the blade between the shoulder and the pivot.',
        },
        {
          icon: 'Circle',
          title: 'Shoulder',
          text: 'The area where the blade widens from the shank.',
        },
        {
          icon: 'Square',
          title: 'Heel',
          text: 'The back corner of the blade near the shank.',
        },
        {
          icon: 'Sword',
          title: 'Blade',
          text: 'The sharpened metal portion that cuts the hair.',
        },
        {
          icon: 'LineChart',
          title: 'Back',
          text: 'The unsharpened top edge of the blade.',
        },
        {
          icon: 'CircleDot',
          title: 'Head / Point',
          text: 'The tip of the blade that leads the cutting stroke.',
        },
        {
          icon: 'Zap',
          title: 'Edge',
          text: 'The sharpened cutting edge of the blade.',
        },
      ],
    },

    // Section 17: State Regulatory Alert
    {
      type: 'contentBlock',
      id: 'state-alert',
      title: 'State Regulatory Alert',
      content: 'Some states prohibit the use of conventional straight razors and allow only changeable-blade razors. Be guided by your state barber board rules and regulations. Always check your state board regulations for rules related to shaving, including requirements for protective gloves.',
      highlight: 'Some states prohibit the use of conventional straight razors',
    },

    // Section 18: Styptic Powder
    {
      type: 'infoCards',
      id: 'styptic-info',
      title: 'Styptic Powder',
      cards: [
        {
          icon: 'Droplets',
          title: 'Definition',
          text: 'Styptic powder or liquid, made from alum, is an antihemorrhagic with astringent properties.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Purpose',
          text: 'Can stop the bleeding of small nicks or cuts that may occur during shaving.',
        },
      ],
    },
  ],
}
