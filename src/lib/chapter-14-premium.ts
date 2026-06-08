// Chapter 14: Men's Haircutting and Styling — PREMIUM IMMERSIVE EXPERIENCE
// THE BARBER'S CHAIR — Master the Art of Men's Haircutting

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// THE BARBER'S CHAIR THEME — Classic Barbershop Craft
// Deep navy / Warm brass / Ivory cream / Charcoal
// Feels like: A modern barbershop where precision meets artistry
// ═══════════════════════════════════════════════

export const chapter14PremiumTheme: ChapterTheme = {
  primary: '#2C3E50',
  primaryLight: '#4A6FA5',
  primaryDark: '#1A252F',
  secondary: '#C9A84C',
  background: 'rgba(20, 24, 32, 0.96)',
  backgroundAlt: 'rgba(32, 38, 48, 0.92)',
  surface: '#141820',
  border: 'rgba(44, 62, 80, 0.25)',
  text: '#F5F0EB',
  textMuted: '#B8A89A',
  highlight: '#C9A84C',
  timeline: {
    line: 'rgba(44, 62, 80, 0.35)',
    iconBg: '#202630',
    iconBorder: '#2C3E50',
  },
  quote: {
    border: 'rgba(44, 62, 80, 0.4)',
    icon: 'rgba(44, 62, 80, 0.3)',
    bg: 'rgba(20, 24, 32, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(44, 62, 80, 0.15)',
    activeBorder: 'rgba(44, 62, 80, 0.5)',
    activeText: '#4A6FA5',
    inactiveBg: 'rgba(20, 24, 32, 0.7)',
    inactiveBorder: 'rgba(44, 62, 80, 0.12)',
    inactiveText: '#B8A89A',
    panelBg: 'rgba(20, 24, 32, 0.85)',
    panelBorder: 'rgba(44, 62, 80, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(44, 62, 80, 0.1)',
    headerText: '#4A6FA5',
    dot: 'rgba(44, 62, 80, 0.6)',
    line: 'rgba(44, 62, 80, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(44, 62, 80, 0.15)',
    iconColor: '#2C3E50',
    cardBorder: 'rgba(44, 62, 80, 0.2)',
  },
  milestone: {
    yearColor: '#2C3E50',
    border: 'rgba(44, 62, 80, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(44, 62, 80, 0.4)',
    checkColor: '#2C3E50',
    bg: 'rgba(20, 24, 32, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(20, 24, 32, 0.7)',
    border: 'rgba(44, 62, 80, 0.18)',
    highlightColor: '#C9A84C',
  },
  challengeCard: {
    badgeBg: 'rgba(201, 168, 76, 0.15)',
    badgeText: '#C9A84C',
    cardBorder: 'rgba(44, 62, 80, 0.22)',
    completedBg: 'rgba(0, 230, 118, 0.1)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(201, 168, 76, 0.06)',
    optionBorder: 'rgba(44, 62, 80, 0.18)',
    correctBg: 'rgba(0, 230, 118, 0.1)',
    incorrectBg: 'rgba(255, 82, 82, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(44, 62, 80, 0.2)',
    levelBadgeText: '#4A6FA5',
    rewardBg: 'rgba(0, 230, 118, 0.12)',
    rewardText: '#00E676',
  },
  actionPrompt: {
    cardBorder: 'rgba(44, 62, 80, 0.2)',
    completedBorder: 'rgba(0, 230, 118, 0.35)',
    benefitBg: 'rgba(201, 168, 76, 0.1)',
    benefitBorder: 'rgba(201, 168, 76, 0.3)',
  },
}

// ═══════════════════════════════════════════════
// CHAPTER 14: MEN'S HAIRCUTTING AND STYLING
// ═══════════════════════════════════════════════

export const chapter14PremiumContent: ChapterContent = {
  chapterNumber: 14,
  title: "Men's Haircutting and Styling",
  subtitle: 'Master the foundation of barbering — from consultation to clean-up',
  theme: chapter14PremiumTheme,
  sections: [
    // Section 1: Why Study Men's Haircutting
    {
      type: 'infoCards',
      id: 'why-study-haircutting',
      title: 'Why Study Men\'s Haircutting and Styling?',
      cards: [
        {
          icon: 'Scissors',
          title: 'Foundation of Barbering',
          text: 'Haircutting is the core skill that defines a barber. Mastering techniques builds confidence and client loyalty.',
        },
        {
          icon: 'User',
          title: 'Client Customization',
          text: 'Understanding facial shapes and hair types allows you to create customized haircuts that complement each client.',
        },
        {
          icon: 'TrendingUp',
          title: 'Revenue Growth',
          text: 'Quality haircutting and styling services increase client retention and open doors to premium services.',
        },
      ],
    },
    {
      type: 'quote',
      id: 'haircutting-quote',
      quote: 'The consultation is the most important part of any haircut. A thorough consultation prevents misunderstandings and ensures client satisfaction.',
    },

    // Section 2: Client Consultation
    {
      type: 'contentBlock',
      id: 'consultation-fundamentals',
      title: 'The Client Consultation',
      content: 'A thorough consultation is the foundation of a successful haircut. Understanding what the client wants prevents misunderstandings and builds trust. Always clarify vague terms like "just a trim" — what is a trim to one person may be a major cut to another.',
      highlight: 'Always clarify vague terms like "just a trim"',
    },
    {
      type: 'checklist',
      id: 'consultation-questions',
      title: 'Key Consultation Questions',
      items: [
        { text: 'What would you like done today?' },
        { text: 'How short do you want it? (Use fingers to show length)' },
        { text: 'Do you want a fade, taper, or all one length?' },
        { text: 'How do you usually style your hair?' },
        { text: 'Do you have any cowlicks or growth patterns I should know about?' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'trim-warning',
      title: 'Understanding "Just a Trim"',
      content: 'When a client says "just a trim," it can mean different things to different people. Always clarify by showing exactly how much hair will be removed, using fingers or a comb to demonstrate length, and confirming before cutting.',
      highlight: 'Always clarify "just a trim"',
    },

    // Section 3: Facial Shapes and Hair Design
    {
      type: 'contentBlock',
      id: 'facial-shapes-intro',
      title: 'Facial Shapes and Hair Design',
      content: 'Understanding facial shapes helps you recommend styles that complement the client\'s features. The five basic facial shapes are oval, round, square, inverted triangular (heart), and pear-shaped (triangular). Each shape has specific design goals to create balance and harmony.',
      highlight: 'The five basic facial shapes: oval, round, square, inverted triangular, pear-shaped',
    },
    {
      type: 'tabbed',
      id: 'facial-shapes-tabbed',
      title: 'Five Basic Facial Shapes',
      subtitle: 'Design goals for each face type',
      tabs: [
        {
          id: 'oval',
          label: 'Oval',
          title: 'Oval Face — The Ideal Shape',
          bullets: [
            { label: 'Characteristics', description: 'Balanced proportions; width of forehead and jaw are similar; face is longer than wide' },
            { label: 'Design Goal', description: 'Can wear most styles; maintain balanced proportions' },
            { label: 'Recommendation', description: 'Most versatile face shape — almost any style works well' },
          ],
        },
        {
          id: 'round',
          label: 'Round',
          title: 'Round Face — Add Height, Minimize Width',
          bullets: [
            { label: 'Characteristics', description: 'Width and length are nearly equal; full cheeks; rounded jawline' },
            { label: 'Design Goal', description: 'Add height and minimize width' },
            { label: 'Avoid', description: 'Styles that add volume to the sides' },
          ],
        },
        {
          id: 'square',
          label: 'Square',
          title: 'Square Face — Soften Angles',
          bullets: [
            { label: 'Characteristics', description: 'Strong, angular jawline; forehead and jaw width similar' },
            { label: 'Design Goal', description: 'Soften angles while maintaining masculine features' },
            { label: 'Avoid', description: 'Too much volume on top which exaggerates squareness' },
          ],
        },
        {
          id: 'inverted-triangular',
          label: 'Heart',
          title: 'Inverted Triangular (Heart) — Balance Forehead and Chin',
          bullets: [
            { label: 'Characteristics', description: 'Wider forehead, narrower chin' },
            { label: 'Design Goal', description: 'Add width at jawline, minimize forehead width' },
            { label: 'Recommendation', description: 'Styles with volume on sides work well' },
          ],
        },
        {
          id: 'pear-shaped',
          label: 'Pear',
          title: 'Pear-Shaped (Triangular) — Add Width at Temples',
          bullets: [
            { label: 'Characteristics', description: 'Narrower forehead, wider jawline' },
            { label: 'Design Goal', description: 'Add width at temples, minimize jaw width' },
            { label: 'Recommendation', description: 'Styles with volume on top work well' },
          ],
        },
      ],
    },
    {
      type: 'featureGrid',
      id: 'design-principles',
      title: 'Five Design Principles',
      features: [
        {
          icon: 'Scale',
          title: 'Balance',
          description: 'Create visual equilibrium between all elements of the haircut.',
        },
        {
          icon: 'Ruler',
          title: 'Proportion',
          description: 'Keep features in pleasing ratio to one another.',
        },
        {
          icon: 'Eye',
          title: 'Emphasis',
          description: 'Draw attention to the client\'s best features.',
        },
        {
          icon: 'Waves',
          title: 'Rhythm',
          description: 'Create movement and flow throughout the design.',
        },
        {
          icon: 'Heart',
          title: 'Harmony',
          description: 'Ensure all elements work together as a cohesive whole.',
        },
      ],
    },

    // Section 4: Basic Haircutting Principles
    {
      type: 'contentBlock',
      id: 'haircutting-fundamentals',
      title: 'Basic Haircutting Principles',
      content: 'Proper preparation and technique are essential for every haircut. Following a systematic approach ensures consistency, safety, and client satisfaction.',
      highlight: 'Proper preparation and technique are essential for every haircut',
    },
    {
      type: 'checklist',
      id: 'preparation-steps',
      title: 'Preparation for All Haircuts',
      items: [
        { text: 'Wash hands thoroughly' },
        { text: 'Conduct client consultation' },
        { text: 'Drape client for wet service' },
        { text: 'Shampoo and towel dry hair' },
        { text: 'Remove waterproof cape; replace with neck strip and haircutting cape' },
        { text: 'Face client toward mirror and lock chair' },
      ],
    },
    {
      type: 'featureGrid',
      id: 'basic-techniques',
      title: 'Basic Haircutting Techniques',
      features: [
        {
          icon: 'Scissors',
          title: 'Clipper-Over-Comb',
          description: 'Using clippers over a comb to create precise, clean lines and gradual fades.',
        },
        {
          icon: 'Cut',
          title: 'Shear-Over-Comb',
          description: 'Using shears over a comb for softer, more blended results than clippers.',
        },
        {
          icon: 'Zap',
          title: 'Freehand Clipper',
          description: 'Using clippers without a comb for outlining and detail work.',
        },
        {
          icon: 'Blend',
          title: 'Blending',
          description: 'Creating smooth transitions between different lengths.',
        },
        {
          icon: 'TrendingDown',
          title: 'Fading',
          description: 'Gradually tapering hair from short to shorter or to skin.',
        },
      ],
    },

    // Section 5: Haircutting Procedures
    {
      type: 'contentBlock',
      id: 'haircutting-procedures',
      title: 'Haircutting Procedures',
      content: 'Mastering specific haircut procedures requires understanding sectioning, guide placement, and blending techniques. Each style has unique steps that must be followed precisely.',
      highlight: 'Mastering specific haircut procedures requires understanding sectioning, guide placement, and blending',
    },
    {
      type: 'tabbed',
      id: 'haircut-procedures',
      title: 'Common Haircut Procedures',
      subtitle: 'Step-by-step guides for popular styles',
      tabs: [
        {
          id: 'basic-clipper',
          label: 'Basic Clipper',
          title: 'Basic Haircut with Clippers',
          bullets: [
            { label: 'Step 1', description: 'Determine desired length on top' },
            { label: 'Step 2', description: 'Establish center guide on top' },
            { label: 'Step 3', description: 'Cut sections right and left of center from front through top' },
            { label: 'Step 4', description: 'Move to back section; cut from crown to nape' },
            { label: 'Step 5', description: 'Cut sections left and right of center through back' },
            { label: 'Step 6', description: 'Move to sides; cut from hairline to top' },
            { label: 'Step 7', description: 'Cut around ears and blend into back section' },
            { label: 'Step 8', description: 'Cross-check and blend as needed' },
            { label: 'Step 9', description: 'Outline and detail with trimmer' },
          ],
        },
        {
          id: 'shadow-fade',
          label: 'Shadow Fade',
          title: 'Shadow Fade Cut',
          bullets: [
            { label: 'Step 1', description: 'Determine length for top section' },
            { label: 'Step 2', description: 'Select appropriate clipper blade or guard' },
            { label: 'Step 3', description: 'Start at front hairline; cut center guide back to crown' },
            { label: 'Step 4', description: 'Cut sections right and left of center' },
            { label: 'Step 5', description: 'Move to back; adjust clippers to open blade position' },
            { label: 'Step 6', description: 'Start at nape; cut against grain to mid-occipital area' },
            { label: 'Step 7', description: 'Cut sections left and right of center panel' },
            { label: 'Step 8', description: 'Move to sides; cut from hairline to desired point' },
            { label: 'Step 9', description: 'Cut around ears and blend' },
            { label: 'Step 10', description: 'Attach guard and close blades halfway; blend at top of parietal ridge' },
            { label: 'Step 11', description: 'Adjust blades to closed position; blend through middle parietal' },
            { label: 'Step 12', description: 'Attach No. 0 guard; blend around parietal ridge' },
            { label: 'Step 13', description: 'Remove guard; taper and blend hairline' },
            { label: 'Step 14', description: 'Finish with trimmer or outline shave' },
          ],
        },
        {
          id: 'pompadour-fade',
          label: 'Pompadour Fade',
          title: 'Pompadour Fade',
          bullets: [
            { label: 'Step 1', description: 'Re-dampen top section with water if necessary' },
            { label: 'Step 2', description: 'Part off top section following curve of head at parietal ridge' },
            { label: 'Step 3', description: 'Secure with clips' },
            { label: 'Step 4', description: 'Select appropriate blade size for back and sides' },
            { label: 'Step 5', description: 'On preferred side, use freehand clipper technique to establish guide' },
            { label: 'Step 6', description: 'Rock clipper out at point where transition will occur' },
            { label: 'Step 7', description: 'Repeat on opposite side' },
            { label: 'Step 8', description: 'Move to back; cut from nape upward' },
            { label: 'Step 9', description: 'Blend transition areas' },
            { label: 'Step 10', description: 'Release top section; comb through' },
            { label: 'Step 11', description: 'Create slight overdirection of parting to center top guide' },
            { label: 'Step 12', description: 'Cut parting to guide' },
            { label: 'Step 13', description: 'Continue cutting from parietal area up to top' },
            { label: 'Step 14', description: 'Move behind client; comb through top sections' },
            { label: 'Step 15', description: 'Check hair horizontally and blend as needed' },
            { label: 'Step 16', description: 'Style as desired' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'grain-reminder',
      title: 'Key Point: Cutting Against the Grain',
      content: 'Cutting against the grain achieves a closer cut than cutting with the grain. This is essential for fades and tapers but requires careful technique to avoid irritation.',
      highlight: 'Cutting against the grain achieves a closer cut',
    },

    // Section 6: Blowdrying Techniques
    {
      type: 'contentBlock',
      id: 'blowdrying-intro',
      title: 'Blowdrying Techniques',
      content: 'Proper blowdrying technique is essential for finishing any haircut. Different methods create different results — from natural texture to polished styles.',
      highlight: 'Proper blowdrying technique is essential for finishing any haircut',
    },
    {
      type: 'tabbed',
      id: 'blowdrying-methods',
      title: 'Blowdrying Methods',
      subtitle: 'Four techniques for different finishes',
      tabs: [
        {
          id: 'freeform',
          label: 'Freeform',
          title: 'Freeform Blowdrying',
          bullets: [
            { label: 'Step 1', description: 'Hold dryer 6 to 10 inches from hair' },
            { label: 'Step 2', description: 'Angle nozzle pointing downward' },
            { label: 'Step 3', description: 'Dry layers underneath first' },
            { label: 'Step 4', description: 'Move dryer briskly from side to side' },
            { label: 'Step 5', description: 'As hair underneath dries, release next section' },
            { label: 'Step 6', description: 'Comb or brush hair down after each section' },
            { label: 'Step 7', description: 'Dry sides in same manner' },
            { label: 'Step 8', description: 'Dry top loosely; comb or brush into desired style' },
          ],
        },
        {
          id: 'stylized',
          label: 'Stylized',
          title: 'Stylized Blowdrying',
          bullets: [
            { label: 'Step 1', description: 'Begin in back section' },
            { label: 'Step 2', description: 'Lift section with comb or brush' },
            { label: 'Step 3', description: 'Follow movement of comb with dryer' },
            { label: 'Step 4', description: 'Apply concentrated stream of heated air' },
            { label: 'Step 5', description: 'Dry from scalp to ends' },
            { label: 'Step 6', description: 'Repeat until section is dry' },
            { label: 'Step 7', description: 'Move to next section and sides' },
          ],
        },
        {
          id: 'blow-waving',
          label: 'Blow Waving',
          title: 'Blow Waving',
          bullets: [
            { label: 'Step 1', description: 'Use blow-waving technique to create lift or direction in top section' },
            { label: 'Step 2', description: 'Work from natural part' },
            { label: 'Step 3', description: 'Elevate hair to create desired fullness' },
            { label: 'Step 4', description: 'Insert comb 1½ inches from hairline' },
            { label: 'Step 5', description: 'Draw comb to back then toward hairline in one motion' },
            { label: 'Step 6', description: 'This creates ridge or bend to set style' },
            { label: 'Step 7', description: 'Apply heat until soft ridge is formed' },
            { label: 'Step 8', description: 'Repeat in subsequent sections' },
            { label: 'Step 9', description: 'Apply suitable styling aid to finish' },
          ],
        },
        {
          id: 'diffused',
          label: 'Diffused',
          title: 'Diffused Drying',
          bullets: [
            { label: 'Step 1', description: 'Pick hair out into basic shape of desired style' },
            { label: 'Step 2', description: 'Begin drying in back section, working toward crown and sides' },
            { label: 'Step 3', description: 'Gently pick hair out as dryer moves from section to section' },
            { label: 'Step 4', description: 'Dry sides in same manner' },
            { label: 'Step 5', description: 'Dry top section forward from crown' },
            { label: 'Step 6', description: 'Apply suitable styling aid to complete' },
          ],
        },
      ],
    },

    // Section 7: The Head Shave
    {
      type: 'contentBlock',
      id: 'head-shave-intro',
      title: 'The Head Shave',
      content: 'A complete head shave requires careful preparation and technique. Proper draping, skin examination, and systematic shaving ensure a smooth, irritation-free result.',
      highlight: 'Proper draping, skin examination, and systematic shaving ensure a smooth result',
    },
    {
      type: 'checklist',
      id: 'head-shave-prep',
      title: 'Head Shave Preparation',
      items: [
        { text: 'Wash hands' },
        { text: 'Conduct client consultation' },
        { text: 'Drape client for haircut' },
        { text: 'Face client toward mirror and lock chair' },
        { text: 'Examine scalp for abrasions, lesions, or disorders' },
        { text: 'Remove excess hair length with clippers if necessary' },
        { text: 'Drape for wet service and shampoo remaining hair' },
        { text: 'Re-examine scalp' },
        { text: 'Remove shampoo cape' },
        { text: 'Re-drape with haircutting cape and towels' },
        { text: 'Tuck wiping cloth into neckline' },
      ],
    },
    {
      type: 'checklist',
      id: 'head-shave-procedure',
      title: 'Head Shave Procedure',
      items: [
        { text: 'Apply shaving cream or gel and lather' },
        { text: 'Follow with two or three steamed-towel treatments to soften hair' },
        { text: 'Re-lather scalp' },
        { text: 'Lock chair' },
        { text: 'Start in back section using freehand stroke' },
        { text: 'Shave with grain from crown to nape' },
        { text: 'Use opposite hand to stretch skin taut' },
        { text: 'Follow curve of head' },
        { text: 'Move to front; tip head forward slightly' },
        { text: 'Continue shaving from crown to front hairline' },
        { text: 'Reapply lather as needed' },
        { text: 'Keep skin moist' },
        { text: 'When top is completed, work down sides' },
        { text: 'Hold ear out of way with left hand' },
        { text: 'Carefully shave in front of and around ears' },
        { text: 'Repeat on left side' },
        { text: 'Check for missed areas and re-shave as necessary' },
        { text: 'Wrap warm towel around head' },
        { text: 'Use towel to remove remaining lather' },
        { text: 'Apply witch hazel or skin toner' },
        { text: 'Follow with cool-towel application for 2-3 minutes' },
        { text: 'Apply moisturizing cream or oil as requested' },
      ],
    },

    // Section 8: Cornrow Braiding
    {
      type: 'contentBlock',
      id: 'cornrow-intro',
      title: 'Cornrow Braiding',
      content: 'Cornrows are narrow rows of visible braids that lie close to the scalp. This technique requires precision, even tension, and understanding of hair growth patterns.',
      highlight: 'Cornrows are narrow rows of visible braids that lie close to the scalp',
    },
    {
      type: 'checklist',
      id: 'cornrow-prep',
      title: 'Cornrow Preparation',
      items: [
        { text: 'Wash hands' },
        { text: 'Conduct client consultation' },
        { text: 'Drape for wet service' },
        { text: 'Shampoo and condition hair' },
        { text: 'Remove waterproof cape' },
        { text: 'Replace with towels under and over haircutting cape' },
        { text: 'Face client toward mirror and lock chair' },
      ],
    },
    {
      type: 'checklist',
      id: 'cornrow-procedure',
      title: 'Cornrow Braiding Procedure',
      items: [
        { text: 'Start with clean, damp hair' },
        { text: 'Apply and massage essential oil to scalp' },
        { text: 'Determine correct size and direction of cornrow base' },
        { text: 'Use tail comb to part off top section on right side' },
        { text: 'Secure with clip' },
        { text: 'Use mirror to determine where to section left side' },
        { text: 'Secure with clip' },
        { text: 'Create two parallel partings in center of top section' },
        { text: 'Form neat row for cornrow base' },
        { text: 'Divide parting into three strands' },
        { text: 'Place fingers close to base' },
        { text: 'Cross left strand under center strand' },
        { text: 'Cross right strand under center strand' },
        { text: 'With each crossing under, pick up hair from base of panel' },
        { text: 'Add to outer strand before crossing under center' },
        { text: 'When braid is finished, secure ends with small rubber band' },
        { text: 'Braid subsequent panels left and right of center' },
        { text: 'Once top three braids complete, complete braids on left and right' },
        { text: 'Maintain even tension' },
        { text: 'Follow curvature of head' },
        { text: 'Finish with oil sheen or appropriate styling aid' },
      ],
    },

    // Section 9: Clean-Up and Disinfection
    {
      type: 'contentBlock',
      id: 'cleanup-intro',
      title: 'Clean-Up and Disinfection',
      content: 'After every haircutting service, proper clean-up and disinfection protect both the barber and the client. Following standard precautions ensures a safe, professional environment.',
      highlight: 'Proper clean-up and disinfection protect both the barber and the client',
    },
    {
      type: 'checklist',
      id: 'cleanup-checklist',
      title: 'Post-Service Clean-Up Checklist',
      items: [
        { text: 'Clean and disinfect all tools and implements' },
        { text: 'Clean and disinfect the work area' },
        { text: 'Clean surfaces and chair' },
        { text: 'Sweep up hair and deposit in closed receptacle' },
        { text: 'Deposit used blades in sharps container' },
        { text: 'Dispose of single-use items' },
        { text: 'Place all used linens, towels, and capes in laundry' },
        { text: 'Wash hands thoroughly' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'sharps-warning',
      title: 'Sharps Safety',
      content: 'Never leave used blades on the counter or in regular trash. Always use a proper sharps container. Improper disposal risks injury and violates health codes.',
      highlight: 'Always use a proper sharps container',
    },

    // Section 10: Key Takeaways
    {
      type: 'contentBlock',
      id: 'key-takeaways',
      title: 'Chapter 14 Key Takeaways',
      content: 'Mastering men\'s haircutting and styling requires understanding consultation, facial shapes, cutting techniques, and finishing methods. Always prioritize safety, sanitation, and client satisfaction.',
      highlight: 'Always prioritize safety, sanitation, and client satisfaction',
    },
    {
      type: 'checklist',
      id: 'chapter-summary',
      title: 'Chapter Summary',
      items: [
        { text: 'Always conduct a thorough consultation before cutting' },
        { text: 'Five facial shapes: oval, round, square, inverted triangular, pear-shaped' },
        { text: 'Basic techniques: clipper-over-comb, shear-over-comb, freehand, blending, fading' },
        { text: 'Shadow fade uses adjustable-blade clipper with/without guards' },
        { text: 'Pompadour fade requires sectioning and careful blending' },
        { text: 'Blowdrying methods: freeform, stylized, blow waving, diffused' },
        { text: 'Head shave requires steamed towels and careful stretching of skin' },
        { text: 'Cornrow braiding involves picking up hair with each strand cross' },
        { text: 'Always follow proper clean-up and disinfection procedures' },
        { text: 'Dispose of blades in sharps container only' },
      ],
    },
  ],
}
