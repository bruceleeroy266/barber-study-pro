// Chapter 16: Women's Haircutting & Styling — PREMIUM IMMERSIVE EXPERIENCE
// PACKET A FOUNDATION — Design Philosophy, Structure & Professional Mindset
// THE STYLE STUDIO — Where precision, shape, and client confidence begin

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// STYLE STUDIO THEME — Warm Rose Gold & Champagne
// Feels like: A contemporary design studio focused on shape, texture, and finish
// ═══════════════════════════════════════════════

export const chapter16PremiumTheme: ChapterTheme = {
  primary: '#D4A574',
  primaryLight: '#E8C9A8',
  primaryDark: '#A67B5B',
  secondary: '#C9A227',
  background: 'rgba(32, 26, 24, 0.95)',
  backgroundAlt: 'rgba(45, 37, 34, 0.9)',
  surface: '#1F1917',
  border: 'rgba(212, 165, 116, 0.25)',
  text: '#F9F5F0',
  textMuted: '#B8A99A',
  highlight: '#E8C9A8',
  timeline: {
    line: 'rgba(212, 165, 116, 0.35)',
    iconBg: '#2D2522',
    iconBorder: '#D4A574',
  },
  quote: {
    border: 'rgba(212, 165, 116, 0.4)',
    icon: 'rgba(212, 165, 116, 0.3)',
    bg: 'rgba(32, 26, 24, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(212, 165, 116, 0.15)',
    activeBorder: 'rgba(212, 165, 116, 0.5)',
    activeText: '#E8C9A8',
    inactiveBg: 'rgba(32, 26, 24, 0.7)',
    inactiveBorder: 'rgba(212, 165, 116, 0.12)',
    inactiveText: '#B8A99A',
    panelBg: 'rgba(32, 26, 24, 0.85)',
    panelBorder: 'rgba(212, 165, 116, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(212, 165, 116, 0.1)',
    headerText: '#E8C9A8',
    dot: 'rgba(212, 165, 116, 0.6)',
    line: 'rgba(212, 165, 116, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(212, 165, 116, 0.15)',
    iconColor: '#D4A574',
    cardBorder: 'rgba(212, 165, 116, 0.2)',
  },
  milestone: {
    yearColor: '#D4A574',
    border: 'rgba(212, 165, 116, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(212, 165, 116, 0.4)',
    checkColor: '#D4A574',
    bg: 'rgba(32, 26, 24, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(32, 26, 24, 0.7)',
    border: 'rgba(212, 165, 116, 0.18)',
    highlightColor: '#E8C9A8',
  },
  challengeCard: {
    badgeBg: 'rgba(201, 162, 39, 0.15)',
    badgeText: '#C9A227',
    cardBorder: 'rgba(212, 165, 116, 0.22)',
    completedBg: 'rgba(34, 197, 94, 0.1)',
    completedBorder: 'rgba(34, 197, 94, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(201, 162, 39, 0.06)',
    optionBorder: 'rgba(212, 165, 116, 0.18)',
    correctBg: 'rgba(34, 197, 94, 0.1)',
    incorrectBg: 'rgba(239, 68, 68, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(212, 165, 116, 0.15)',
    levelBadgeText: '#E8C9A8',
    rewardBg: 'rgba(34, 197, 94, 0.1)',
    rewardText: '#22C55E',
  },
  actionPrompt: {
    cardBorder: 'rgba(212, 165, 116, 0.18)',
    completedBorder: 'rgba(34, 197, 94, 0.3)',
    benefitBg: 'rgba(212, 165, 116, 0.08)',
    benefitBorder: 'rgba(212, 165, 116, 0.25)',
  },
}

// ═══════════════════════════════════════════════
// CHAPTER 16 PACKET A FOUNDATION CONTENT
// ═══════════════════════════════════════════════

export const chapter16PremiumContent: ChapterContent = {
  chapterNumber: 16,
  title: "Women's Haircutting & Styling",
  subtitle: 'The Style Studio — Design, Shape & Professional Mindset',
  theme: chapter16PremiumTheme,
  sections: [
    // ═══════════════════════════════════════════
    // SECTION 1: CHAPTER PURPOSE / WELCOME
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'style-studio-welcome',
      title: '✨ WELCOME TO THE STYLE STUDIO',
      content: "Chapter 16 introduces professional women's haircutting and hairstyling. It is the bridge between foundational haircutting knowledge and advanced haircut design. Here, you will learn that haircutting is not simply removing hair — it is a design process built on structure, elevation, weight distribution, texture, styling, and professional finishing. Every cut begins with understanding what the client needs and ends with a style that works in real life.",
      highlight: 'HAIRCUTTING IS A DESIGN PROCESS — NOT JUST REMOVING HAIR',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: WHY WOMEN'S HAIRCUTTING MATTERS
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'why-womens-haircutting-matters',
      title: 'WHY WOMEN\'S HAIRCUTTING MATTERS',
      subtitle: 'Four professional priorities that shape every service',
      cards: [
        {
          icon: 'Users',
          title: 'CLIENT EXPECTATIONS',
          text: 'Women often seek precision, shape, balance, and a finished style. Meeting those expectations builds trust and expands your client base.',
        },
        {
          icon: 'Award',
          title: 'PRECISION & SHAPE',
          text: "Women's services sharpen your eye for line, form, and proportion. These skills improve every haircut you perform.",
        },
        {
          icon: 'Scale',
          title: 'BALANCE & WEARABILITY',
          text: 'A successful cut must look good in the chair and behave well at home. Balance and wearability come from planning, not guessing.',
        },
        {
          icon: 'MessageCircle',
          title: 'CONSULTATION',
          text: "Never assume a client wants a men's-style service. A thorough consultation ensures the final design matches the client's goals and lifestyle.",
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: HAIRCUT DESIGN PHILOSOPHY
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'haircut-design-philosophy',
      title: 'THE DESIGN PHILOSOPHY',
      content: "Every professional haircut is created from five interrelated ideas: SHAPE, WEIGHT, ELEVATION, MOVEMENT, and TEXTURE. Shape is the overall silhouette. Weight is where hair mass is concentrated. Elevation is the angle at which hair is held before cutting. Movement is how the hair falls and flows after cutting. Texture is the surface quality of each strand and the overall head of hair. When you understand how these five elements interact, you can plan a cut instead of simply reacting to the hair in front of you.",
      highlight: 'SHAPE • WEIGHT • ELEVATION • MOVEMENT • TEXTURE',
    },

    // ═══════════════════════════════════════════
    // SECTION 4: FOUR FOUNDATIONAL HAIRCUTS (INTRODUCTION ONLY)
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'four-foundational-cuts-intro',
      title: 'THE FOUR FOUNDATIONAL HAIRCUTS',
      content: "All women's haircuts are variations of four foundational structures. These structures are defined primarily by elevation — the angle at which hair is held away from the head. In this chapter you will first understand what each structure does and why it matters. The step-by-step procedures for creating each one will follow in later lessons.",
      highlight: 'FOUR STRUCTURES • ONE DESIGN LANGUAGE',
    },
    {
      type: 'featureGrid',
      id: 'foundational-cuts-overview',
      title: 'FOUNDATIONAL STRUCTURES',
      subtitle: 'How elevation creates four distinct silhouettes',
      features: [
        {
          icon: 'Award',
          title: 'BLUNT CUT',
          description: 'Cut at low elevation to create a strong, heavy weight line along the perimeter. The silhouette is solid and clean.',
        },
        {
          icon: 'Scale',
          title: 'GRADUATED CUT',
          description: 'Cut at moderate elevation to build weight along a design line, often creating a wedge or stacked shape.',
        },
        {
          icon: 'Sparkles',
          title: 'UNIFORM-LAYERED CUT',
          description: 'Cut with hair projected straight out from the head to create even layering and consistent movement throughout.',
        },
        {
          icon: 'Star',
          title: 'LONG-LAYERED CUT',
          description: 'Cut with hair lifted overhead so interior layers are shorter while the perimeter preserves length.',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PACKET B1 — THE BLUNT CUT
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'blunt-cut-introduction',
      title: 'THE BLUNT CUT: FOUNDATION OF PRECISION',
      content: "The blunt cut is the first practical structure because it teaches control. In a blunt cut, the hair ends form one clean, solid edge called the perimeter. The cut uses little to no elevation, so the hair stays close to its natural fall and the weight collects near the bottom. This creates a strong, bold line. A true blunt cut is not simply 'cutting straight across.' It requires control of head position, sectioning, guide placement, comb angle, tension, cutting-line direction, and cross-checking. Master the blunt cut and you have the discipline needed for every other structure.",
      highlight: 'BLUNT CUT = BOLD WEIGHT AT THE PERIMETER',
    },
    {
      type: 'contentBlock',
      id: 'why-blunt-cut-matters',
      title: 'WHY THE BLUNT CUT MATTERS',
      content: "Blunt cuts build precision. If a student cannot produce a clean, balanced blunt line, graduated and layered designs will also suffer. Blunt cuts are the right choice for bobs, one-length shapes, classic finishes, and any client who wants fullness and weight at the bottom. The skill transfers directly to professional work: a strong perimeter communicates confidence and control to the client.",
      highlight: 'CONTROL THE BLUNT LINE BEFORE YOU LAYER',
    },
    {
      type: 'featureGrid',
      id: 'blunt-design-principles',
      title: 'BLUNT CUT DESIGN PRINCIPLES',
      subtitle: 'How the structure behaves',
      features: [
        {
          icon: 'Scale',
          title: 'LITTLE TO NO ELEVATION',
          description: 'Keeping hair near natural fall keeps weight at the perimeter instead of dispersing it upward.',
        },
        {
          icon: 'Award',
          title: 'NATURAL FALL',
          description: 'Hair is combed to where it hangs naturally. Forcing it out of position changes the finished line.',
        },
        {
          icon: 'Sparkles',
          title: 'GUIDE-DRIVEN LINE',
          description: 'The first guide section becomes the reference for every following section. Lose the guide and you lose the line.',
        },
        {
          icon: 'TrendingUp',
          title: 'HEAD POSITION MATTERS',
          description: 'A tilted head moves the cutting line. Consistent, upright positioning keeps the perimeter balanced.',
        },
      ],
    },
    {
      type: 'tabbed',
      id: 'blunt-cut-key-terms',
      title: 'BLUNT CUT KEY TERMS',
      subtitle: 'Language you must own',
      tabs: [
        {
          id: 'perimeter',
          label: 'Perimeter',
          title: 'Perimeter',
          bullets: [
            { label: 'Definition', description: 'The outside edge or outline of the haircut.' },
            { label: 'Why it matters', description: 'In a blunt cut, the perimeter is the visible finish line. It must be clean and balanced.' },
          ],
        },
        {
          id: 'natural-fall',
          label: 'Natural Fall',
          title: 'Natural Fall',
          bullets: [
            { label: 'Definition', description: 'How hair hangs when it is not lifted, pulled, or forced into position.' },
            { label: 'Why it matters', description: 'Blunt cuts rely on natural fall. Changing tension or elevation changes where the hair ends.' },
          ],
        },
        {
          id: 'cutting-line',
          label: 'Cutting Line',
          title: 'Cutting Line',
          bullets: [
            { label: 'Definition', description: 'The direction in which the hair is cut.' },
            { label: 'Why it matters', description: 'A horizontal cutting line creates a strong baseline. Diagonal lines change the shape around the face or perimeter.' },
          ],
        },
        {
          id: 'guide',
          label: 'Guide',
          title: 'Guide',
          bullets: [
            { label: 'Definition', description: 'A section of hair used as a reference to control following sections.' },
            { label: 'Why it matters', description: 'The first guide controls the final line. Every section after it must connect back to that guide.' },
          ],
        },
        {
          id: 'zero-elevation',
          label: 'Zero Elevation',
          title: 'Zero Elevation',
          bullets: [
            { label: 'Definition', description: 'Hair is not lifted away from the head before cutting.' },
            { label: 'Why it matters', description: 'Zero elevation keeps the maximum weight at the perimeter, which is the goal of a blunt cut.' },
          ],
        },
        {
          id: 'weight-line',
          label: 'Weight Line',
          title: 'Weight Line',
          bullets: [
            { label: 'Definition', description: 'The visual area where the hair ends collect and create heaviness.' },
            { label: 'Why it matters', description: 'In a blunt cut, the weight line is the perimeter itself. It is what the client sees and feels.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'blunt-cut-figures',
      title: 'FIGURE CALLOUTS: WHAT THE TEXTBOOK IMAGES TEACH',
      content: "The following figures support the lesson conceptually. Future ASCYN PRO illustrations will replace the textbook artwork. Figure 16-1 shows elevation reference and teaches that low or no elevation supports blunt weight. Figure 16-2 shows a horizontal cutting line and teaches a strong, balanced perimeter. Figure 16-3 shows a diagonal-forward cutting line and teaches how direction around the face changes the silhouette. Figure 16-4 shows a diagonal cutting line and teaches how cutting-line direction alters the overall shape.",
      highlight: 'FIGURES SHOW RELATIONSHIPS — NOT JUST LINES',
    },
    {
      type: 'contentBlock',
      id: 'blunt-cut-tools',
      title: 'TOOLS & MATERIALS',
      content: "The right tools make the blunt cut predictable. A cutting comb gives control over section size and tension. A wide-tooth comb helps detangle without stretching the hair. Sharp shears create a clean line without pushing or folding the hair. Clips keep unworked hair separated so it does not interfere. A cape and neck strip protect the client. A spray bottle keeps the hair evenly damp. Shampoo and conditioner prepare the hair to lie in its natural position. Towels, a blow-dryer, and a styling brush let you finish and evaluate the final perimeter. Each tool exists to support accuracy, cleanliness, and a professional result.",
      highlight: 'TOOLS SUPPORT ACCURACY — NOT JUST SPEED',
    },
    {
      type: 'milestoneList',
      id: 'blunt-cut-procedure-sequence',
      title: 'BLUNT CUT PROCEDURE SEQUENCE',
      milestones: [
        { year: 'Step 1', title: 'Prepare the client', description: 'Position the client facing the mirror so they can participate and so you can see the line from the front.' },
        { year: 'Step 2', title: 'Protect the client', description: 'Place a neck strip and cape to protect clothing and skin.' },
        { year: 'Step 3', title: 'Detangle the hair', description: 'Use a wide-tooth comb to remove tangles without forcing the hair out of natural fall.' },
        { year: 'Step 4', title: 'Create a center profile parting', description: 'Establish a straight center part from forehead to nape. This creates your road map for balance.' },
        { year: 'Step 5', title: 'Establish the first guide near the nape', description: 'The first guide controls the final line. Cut it with zero elevation and minimal tension.' },
        { year: 'Step 6', title: 'Cut with natural fall and minimal tension', description: 'Let the hair hang where it wants. Too much tension stretches the hair and changes the dry length.' },
        { year: 'Step 7', title: 'Continue section by section using the guide', description: 'Work from the established guide into new sections. Each new section must connect to the previous one.' },
        { year: 'Step 8', title: 'Work both sides evenly', description: 'Move from side to side rather than finishing one half first. This keeps the line balanced.' },
        { year: 'Step 9', title: 'Release remaining sections and follow the guide', description: 'As you move up the head, keep referencing the guide so the line stays consistent.' },
        { year: 'Step 10', title: 'Cross-check for balance', description: 'Check the line horizontally and vertically. Look for dips, corners, or uneven weight.' },
        { year: 'Step 11', title: 'Dry, style, and evaluate', description: 'Blow-dry or style the hair and reassess the perimeter. Wet and dry hair can behave differently.' },
        { year: 'Step 12', title: 'Clean up and disinfect', description: 'Remove neck strip and cape, clean the client, and disinfect your tools according to shop policy.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'blunt-cut-board-alerts',
      title: '🚨 BOARD ALERT: BLUNT CUT ESSENTIALS',
      content: "Expect licensing exams to test these ideas: blunt cuts require low or no elevation; natural fall determines the final line; head position changes the finished perimeter; and cross-checking is required for precision. If you can explain why each of these matters, you understand the core of the blunt cut.",
      highlight: 'LOW ELEVATION • NATURAL FALL • HEAD POSITION • CROSS-CHECKING',
    },
    {
      type: 'contentBlock',
      id: 'blunt-cut-memory-anchors',
      title: '⚓ MEMORY ANCHORS',
      content: "Use these phrases to lock in the concepts: Blunt means bold weight. The first guide controls the final line. Natural fall tells the truth. If the head moves, the line moves.",
      highlight: 'BLUNT MEANS BOLD WEIGHT • THE FIRST GUIDE CONTROLS THE FINAL LINE',
    },
    {
      type: 'checklist',
      id: 'blunt-cut-common-mistakes',
      title: 'COMMON MISTAKES TO AVOID',
      items: [
        { text: 'Lifting hair too much — removes weight and destroys the blunt line' },
        { text: 'Using uneven tension — stretches some sections more than others' },
        { text: 'Taking sections too thick — the shear cannot cut cleanly through bulk' },
        { text: 'Ignoring head position — a tilted client produces a tilted line' },
        { text: 'Losing the guide — new sections no longer match the established line' },
        { text: 'Skipping the cross-check — small errors become visible after drying' },
        { text: 'Cutting into the neck strip or cape — unprofessional and unsafe' },
      ],
    },
    {
      type: 'proTip',
      id: 'blunt-cut-instructor-tips',
      title: '💎 INSTRUCTOR TIPS',
      subtitle: 'Teaching the blunt cut with confidence',
      items: [
        { category: 'Start at the Nape', tips: ['Practice nape sections first. The nape is the foundation for the rest of the perimeter.'] },
        { category: 'Point to the Guide', tips: ['Have students point to the guide with their comb before they cut. If they cannot identify it, they should not cut.'] },
        { category: 'Mirror Check', tips: ['Use the mirror before moving to the next section. The eye sees balance better from the front.'] },
        { category: 'Head Position Demo', tips: ['Demonstrate how a tilted head changes the line. Students remember what they see more than what they hear.'] },
        { category: 'Wet vs. Dry', tips: ['Compare wet and dry results. This builds respect for natural fall and tension.'] },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'blunt-cut-scenario',
      title: '🪞 REAL SHOP SCENARIO: THE BOB REQUEST',
      scenarios: [
        {
          situation: "A client asks for a shoulder-length bob with a strong, clean bottom line. She wants the perimeter to look solid and balanced. What is the most important technical approach?",
          options: [
            { letter: 'A', text: 'Cut with the head tilted forward so the line is easier to reach', feedback: '❌ A tilted head moves the cutting line. The finished perimeter will be uneven when the head returns to neutral.' },
            { letter: 'B', text: 'Use zero elevation, natural fall, and a clear guide while keeping the head upright', feedback: '✅ Correct. Low or no elevation preserves weight at the perimeter, natural fall keeps the line honest, and the guide keeps every section connected.' },
            { letter: 'C', text: 'Elevate the hair to 90° to create soft layering along the bottom', feedback: '❌ 90° elevation removes weight and creates layers. That is the opposite of a strong blunt perimeter.' },
            { letter: 'D', text: 'Cut the perimeter freehand without a guide for a custom shape', feedback: '❌ Without a guide, the line is guesswork. A blunt bob depends on a consistent reference from section to section.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PACKET B2 — THE GRADUATED CUT
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'graduated-cut-introduction',
      title: 'THE GRADUATED CUT: BUILDING SHAPE THROUGH ELEVATION',
      content: "A graduated cut creates a stacked shape by using controlled elevation to build weight gradually. Unlike a blunt cut, which keeps weight at the perimeter, graduation distributes weight through elevation. Each section is cut at an angle that leaves the hair shorter underneath and longer above, producing a visible weight buildup. The result is a structured silhouette with controlled volume. Graduation is not random layering; it is deliberate, measured, and repeatable.",
      highlight: 'GRADUATION STACKS WEIGHT THROUGH CONTROLLED ELEVATION',
    },
    {
      type: 'contentBlock',
      id: 'why-graduated-cut-matters',
      title: 'WHY THE GRADUATED CUT MATTERS',
      content: "Graduation teaches students how to build shape into a haircut rather than simply removing length. It is the right choice for stacked bobs, fuller napes, structured silhouettes, and any client who wants controlled volume. Once a student can graduate cleanly, they can move between solid and shaped designs with confidence.",
      highlight: 'GRADUATION TURNS WEIGHT INTO SHAPE',
    },
    {
      type: 'featureGrid',
      id: 'graduated-design-principles',
      title: 'GRADUATED CUT DESIGN PRINCIPLES',
      subtitle: 'What makes graduation work',
      features: [
        {
          icon: 'Scale',
          title: 'GRADUATION BUILDS WEIGHT',
          description: 'Controlled elevation leaves shorter hair underneath and longer hair above, creating visible weight buildup.',
        },
        {
          icon: 'Award',
          title: 'CONSISTENT ELEVATION',
          description: 'Using the same angle throughout the cut produces a predictable, even shape.',
        },
        {
          icon: 'TrendingUp',
          title: 'THE GUIDE TRAVELS',
          description: 'A traveling guide moves with each new section, carrying the established angle forward.',
        },
        {
          icon: 'Sparkles',
          title: 'FINGER ANGLE CONTROLS SHAPE',
          description: 'The angle of your fingers and shears directly changes the finished silhouette.',
        },
      ],
    },
    {
      type: 'tabbed',
      id: 'graduated-cut-key-terms',
      title: 'GRADUATED CUT KEY TERMS',
      subtitle: 'Language for controlled shape',
      tabs: [
        {
          id: 'graduation',
          label: 'Graduation',
          title: 'Graduation',
          bullets: [
            { label: 'Definition', description: 'A haircut technique that builds weight by cutting hair at an angle, leaving shorter layers underneath and longer layers above.' },
            { label: 'Why it matters', description: 'Graduation is the foundation of stacked and shaped silhouettes.' },
          ],
        },
        {
          id: 'elevation',
          label: 'Elevation',
          title: 'Elevation',
          bullets: [
            { label: 'Definition', description: 'The angle at which hair is held away from the head before cutting.' },
            { label: 'Why it matters', description: 'In graduation, consistent elevation controls how much weight is built and where it sits.' },
          ],
        },
        {
          id: 'traveling-guide',
          label: 'Traveling Guide',
          title: 'Traveling Guide',
          bullets: [
            { label: 'Definition', description: 'A guide that moves with each new section as the haircut progresses.' },
            { label: 'Why it matters', description: 'A traveling guide carries the established length and angle into new areas of the head.' },
          ],
        },
        {
          id: 'stationary-guide',
          label: 'Stationary Guide',
          title: 'Stationary Guide',
          bullets: [
            { label: 'Definition', description: 'A guide that stays in one fixed position while other sections are cut to match it.' },
            { label: 'Why it matters', description: 'Stationary guides maintain a consistent perimeter or weight line in one area.' },
          ],
        },
        {
          id: 'weight-buildup',
          label: 'Weight Buildup',
          title: 'Weight Buildup',
          bullets: [
            { label: 'Definition', description: 'The visible concentration of hair mass created by cutting shorter underneath and longer above.' },
            { label: 'Why it matters', description: 'Weight buildup is the signature effect of a graduated cut.' },
          ],
        },
        {
          id: 'diagonal-forward-parting',
          label: 'Diagonal-Forward Parting',
          title: 'Diagonal-Forward Parting',
          bullets: [
            { label: 'Definition', description: 'A parting that angles forward, often used to control shape around the face or perimeter.' },
            { label: 'Why it matters', description: 'Parting direction affects where weight is placed and how the silhouette flows.' },
          ],
        },
        {
          id: 'silhouette',
          label: 'Silhouette',
          title: 'Silhouette',
          bullets: [
            { label: 'Definition', description: 'The overall outline or shape of the haircut as seen from the side or back.' },
            { label: 'Why it matters', description: 'The silhouette is what clients see first. Graduation shapes it deliberately.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'graduated-cut-figure',
      title: 'FIGURE CALLOUT: THE STACKED EFFECT',
      content: "Figure 16-5 demonstrates the stacked effect created by graduation. The image teaches that controlled elevation, not random layering, is what builds weight and shape. Shorter interior sections support longer exterior sections, producing a visible curve or stack. Future ASCYN PRO illustrations will replace the textbook figure, but the concept remains: graduation is the deliberate placement of weight through angle.",
      highlight: 'CONTROLLED ELEVATION CREATES THE STACK',
    },
    {
      type: 'contentBlock',
      id: 'graduated-cut-tools',
      title: 'TOOLS & MATERIALS',
      content: "The same tools used for a blunt cut support a graduated cut, but their purpose shifts slightly. A cutting comb controls section size and tension. A wide-tooth comb detangles without disturbing natural fall. Sharp shears cut cleanly through controlled elevation. Clips isolate sections so you can focus on one angle at a time. A cape and neck strip protect the client. A spray bottle maintains even dampness. The blow-dryer and styling brush reveal the finished silhouette. In graduation, accuracy matters more than speed: the tools are only as good as the sectioning, elevation, and guide control behind them.",
      highlight: 'ACCURATE SECTIONING AND ELEVATION MATTER MORE THAN SPEED',
    },
    {
      type: 'milestoneList',
      id: 'graduated-cut-procedure-sequence',
      title: 'GRADUATED CUT PROCEDURE SEQUENCE',
      milestones: [
        { year: 'Step 1', title: 'Prepare and position the client', description: 'Seat the client facing the mirror with the head upright and comfortable.' },
        { year: 'Step 2', title: 'Drape and protect', description: 'Apply a neck strip and cape to protect the client and clothing.' },
        { year: 'Step 3', title: 'Establish the starting section', description: 'Choose the starting point based on where the weight buildup should begin, often at the nape.' },
        { year: 'Step 4', title: 'Create the first guideline', description: 'Cut the first section at the desired angle. This guide sets the angle for every section that follows.' },
        { year: 'Step 5', title: 'Cut parallel to the parting', description: 'Keep the cutting line parallel to the parting so the angle stays consistent.' },
        { year: 'Step 6', title: 'Use a traveling guide', description: 'Move the guide with each new section so the established angle travels through the haircut.' },
        { year: 'Step 7', title: 'Keep subsections narrow and controlled', description: 'Small sections let you see the angle and maintain even elevation.' },
        { year: 'Step 8', title: 'Repeat on the opposite side', description: 'Work symmetrically so the weight buildup is balanced from left to right.' },
        { year: 'Step 9', title: 'Continue upward while maintaining elevation', description: 'As you move up the head, keep the same elevation and finger angle.' },
        { year: 'Step 10', title: 'Transition toward the sides', description: 'Adjust sectioning and elevation as needed to connect the graduated area with the sides.' },
        { year: 'Step 11', title: 'Cross-check for balance', description: 'View the silhouette from all angles. Look for uneven weight or asymmetry.' },
        { year: 'Step 12', title: 'Dry, style, and evaluate', description: 'Blow-dry and style to reveal the true silhouette. Wet hair can hide graduation.' },
        { year: 'Step 13', title: 'Clean, disinfect, and restore the workstation', description: 'Remove the cape and neck strip, clean the client, and disinfect tools.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'graduated-cut-board-alerts',
      title: '🚨 BOARD ALERT: GRADUATED CUT ESSENTIALS',
      content: "Licensing exams frequently test the relationship between graduation and weight. Remember: graduation builds weight; consistent elevation creates consistent results; a traveling guide carries the angle forward while a stationary guide stays fixed; and finger angle directly affects the finished shape. If you can explain these relationships, you understand graduation better than most test-takers.",
      highlight: 'GRADUATION BUILDS WEIGHT • CONSISTENT ELEVATION • GUIDE CONTROL • FINGER ANGLE',
    },
    {
      type: 'contentBlock',
      id: 'graduated-cut-memory-anchors',
      title: '⚓ MEMORY ANCHORS',
      content: "Use these phrases to remember the core ideas: Graduation stacks weight. The guide travels, the shape stays controlled. Elevation builds the silhouette. Small sections create precision.",
      highlight: 'GRADUATION STACKS WEIGHT • THE GUIDE TRAVELS, THE SHAPE STAYS CONTROLLED',
    },
    {
      type: 'checklist',
      id: 'graduated-cut-common-mistakes',
      title: 'COMMON MISTAKES TO AVOID',
      items: [
        { text: 'Confusing graduation with layering — graduation builds weight; layering removes it' },
        { text: 'Losing the traveling guide — the angle disappears with the guide' },
        { text: 'Changing finger angle — produces an uneven silhouette' },
        { text: 'Using sections that are too large — hides errors and uneven elevation' },
        { text: 'Uneven elevation — creates lopsided weight buildup' },
        { text: 'Skipping the cross-check — wet hair can hide graduation mistakes' },
        { text: 'Allowing client head movement — tilting changes the angle and the stack' },
      ],
    },
    {
      type: 'proTip',
      id: 'graduated-cut-instructor-tips',
      title: '💎 INSTRUCTOR TIPS',
      subtitle: 'Teaching graduation with clarity',
      items: [
        { category: 'Show the Angle First', tips: ['Demonstrate the elevation and finger angle before the student cuts. Seeing the angle is easier than imagining it.'] },
        { category: 'Identify the Guide', tips: ['Have students point to the traveling guide before each subsection. If they cannot find it, pause and re-establish.'] },
        { category: 'Evaluate the Silhouette', tips: ['Pause after every few sections to view the silhouette. Small corrections early prevent big fixes later.'] },
        { category: 'Compare Blunt vs. Graduated', tips: ['Show a blunt cut and a graduated cut side by side. The difference in weight distribution becomes obvious.'] },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'graduated-cut-scenario',
      title: '🪞 REAL SHOP SCENARIO: FULLNESS IN THE BACK',
      scenarios: [
        {
          situation: "A client wants a bob with fullness in the back but a softer silhouette than a one-length cut. Why is a graduated cut the better design choice, and what controls the shape?",
          options: [
            { letter: 'A', text: 'A blunt cut is better because it keeps all the weight at the bottom', feedback: '❌ A blunt cut creates a strong, solid perimeter but does not build stacked fullness in the back. The client specifically wants softness with volume.' },
            { letter: 'B', text: 'A graduated cut uses controlled elevation to stack weight gradually and create a shaped silhouette', feedback: '✅ Correct. Graduation builds weight through elevation, producing fullness in the back while keeping the overall shape softer than a one-length blunt line.' },
            { letter: 'C', text: 'A uniform-layered cut is better because it removes weight evenly throughout', feedback: '❌ Uniform layering removes weight and creates even movement. That would reduce fullness, not build it.' },
            { letter: 'D', text: 'Cutting the back shorter freehand will create the desired fullness', feedback: '❌ Freehand cutting without a guide or controlled elevation risks an uneven, unbalanced shape. Graduation requires a traveling guide and consistent angle.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PACKET C1 — THE UNIFORM LAYERED CUT
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'uniform-layer-introduction',
      title: 'THE UNIFORM LAYERED CUT: BALANCE THROUGH CONSISTENCY',
      content: "A uniform layered cut creates equal-length layers throughout the haircut by using consistent elevation. The goal is not to build weight at the perimeter or to stack it in one area. The goal is balance, movement, and an even distribution of weight. Every section is cut at the same projected length, usually with the hair held straight out from the head. When elevation stays consistent, the layers fall into a harmonious pattern that moves as one unit.",
      highlight: 'UNIFORM LAYERS CREATE EQUAL LENGTH, BALANCE, AND MOVEMENT',
    },
    {
      type: 'contentBlock',
      id: 'why-uniform-layer-matters',
      title: 'WHY THE UNIFORM LAYERED CUT MATTERS',
      content: "Uniform layering teaches students how consistent elevation produces a balanced haircut with movement. It is the right choice for clients who want versatility, texture, and a lighter silhouette. Unlike a blunt cut, which concentrates weight at the bottom, or a graduated cut, which builds weight in a specific area, a uniform layer spreads weight evenly so the hair can be styled in many directions.",
      highlight: 'EVEN WEIGHT DISTRIBUTION CREATES VERSATILITY',
    },
    {
      type: 'featureGrid',
      id: 'uniform-layer-design-principles',
      title: 'UNIFORM LAYERED CUT DESIGN PRINCIPLES',
      subtitle: 'What creates the even result',
      features: [
        {
          icon: 'Award',
          title: 'CONSISTENT ELEVATION',
          description: 'Using the same angle throughout the cut keeps every layer the same projected length.',
        },
        {
          icon: 'Scale',
          title: 'EQUAL-LENGTH LAYERS',
          description: 'Each layer is cut to the same length when held at the correct elevation.',
        },
        {
          icon: 'Sparkles',
          title: 'BALANCED MOVEMENT',
          description: 'Even layers move together, giving the hair a light, flowing quality.',
        },
        {
          icon: 'TrendingUp',
          title: 'WEIGHT DISTRIBUTION',
          description: 'Weight is spread throughout the head rather than concentrated at the perimeter or nape.',
        },
      ],
    },
    {
      type: 'tabbed',
      id: 'uniform-layer-key-terms',
      title: 'UNIFORM LAYERED CUT KEY TERMS',
      subtitle: 'Language for balanced layering',
      tabs: [
        {
          id: 'uniform-layer',
          label: 'Uniform Layer',
          title: 'Uniform Layer',
          bullets: [
            { label: 'Definition', description: 'A haircut in which all layers are cut to the same length when projected at a consistent elevation.' },
            { label: 'Why it matters', description: 'Uniform layers create balance and predictable movement across the entire head.' },
          ],
        },
        {
          id: 'ninety-degree-elevation',
          label: '90-Degree Elevation',
          title: '90-Degree Elevation',
          bullets: [
            { label: 'Definition', description: 'Hair is held straight out from the head, perpendicular to the scalp.' },
            { label: 'Why it matters', description: 'This elevation is the standard reference for creating equal-length uniform layers.' },
          ],
        },
        {
          id: 'traveling-guide',
          label: 'Traveling Guide',
          title: 'Traveling Guide',
          bullets: [
            { label: 'Definition', description: 'A guide that moves with each new section as the haircut progresses.' },
            { label: 'Why it matters', description: 'In uniform layering, a traveling guide carries the same length and elevation through each section.' },
          ],
        },
        {
          id: 'equal-length-layers',
          label: 'Equal-Length Layers',
          title: 'Equal-Length Layers',
          bullets: [
            { label: 'Definition', description: 'Layers that are the same length when measured from their projection point.' },
            { label: 'Why it matters', description: 'Equal length is what makes the cut uniform and balanced.' },
          ],
        },
        {
          id: 'movement',
          label: 'Movement',
          title: 'Movement',
          bullets: [
            { label: 'Definition', description: 'How the hair flows, falls, and responds to styling after cutting.' },
            { label: 'Why it matters', description: 'Uniform layers produce consistent movement because the weight is evenly distributed.' },
          ],
        },
        {
          id: 'balance',
          label: 'Balance',
          title: 'Balance',
          bullets: [
            { label: 'Definition', description: 'Visual equality between the left and right sides and between the top and bottom of the haircut.' },
            { label: 'Why it matters', description: 'Balance is the primary goal of a uniform layered cut.' },
          ],
        },
        {
          id: 'distribution',
          label: 'Distribution',
          title: 'Distribution',
          bullets: [
            { label: 'Definition', description: 'How hair weight is spread across the head.' },
            { label: 'Why it matters', description: 'Uniform layering distributes weight evenly so no one area dominates the silhouette.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'uniform-layer-figures',
      title: 'FIGURE CALLOUTS: UNIFORM LAYERING AND THE TRAVELING GUIDE',
      content: "The textbook figures for uniform layering show hair lifted to a consistent elevation and cut to the same projected length. The traveling guide figure shows how each new section is matched to the previous one so the length does not drift. These images teach that equal elevation, not guesswork, creates an even result. Future ASCYN PRO illustrations will replace the textbook artwork, but the concept remains: consistency creates balance.",
      highlight: 'EQUAL ELEVATION CREATES EVEN LAYERS',
    },
    {
      type: 'contentBlock',
      id: 'uniform-layer-tools',
      title: 'TOOLS & MATERIALS',
      content: "The same core tools used for blunt and graduated cuts apply here. A cutting comb and sharp shears maintain clean, even sections. Clips keep hair organized so you can focus on identical elevation from one section to the next. A spray bottle keeps the hair evenly damp. A blow-dryer and styling brush let you evaluate movement after the cut. The difference is not the tools; it is the discipline. In a uniform layer, consistency of elevation and tension matters more than in almost any other structure.",
      highlight: 'CONSISTENCY MATTERS MORE THAN SPEED',
    },
    {
      type: 'milestoneList',
      id: 'uniform-layer-procedure-sequence',
      title: 'UNIFORM LAYERED CUT PROCEDURE SEQUENCE',
      milestones: [
        { year: 'Step 1', title: 'Prepare and position the client', description: 'Seat the client upright and facing the mirror for visibility and balance.' },
        { year: 'Step 2', title: 'Drape and protect', description: 'Apply a neck strip and cape for client protection and cleanliness.' },
        { year: 'Step 3', title: 'Establish the initial guide', description: 'Cut the first section at the desired length and elevation. This guide sets the standard.' },
        { year: 'Step 4', title: 'Elevate hair consistently', description: 'Hold each section at the same elevation, typically 90 degrees from the head.' },
        { year: 'Step 5', title: 'Follow a traveling guide', description: 'Use the previously cut section as the guide for the next section.' },
        { year: 'Step 6', title: 'Maintain equal tension', description: 'Keep the same light, even tension throughout so no section is stretched more than another.' },
        { year: 'Step 7', title: 'Continue section by section', description: 'Work methodically through the head, matching each new section to the guide.' },
        { year: 'Step 8', title: 'Repeat evenly on both sides', description: 'Compare left and right frequently to maintain symmetry.' },
        { year: 'Step 9', title: 'Cross-check the haircut', description: 'Check horizontally and vertically for uneven layers or inconsistent length.' },
        { year: 'Step 10', title: 'Dry, style, and evaluate movement', description: 'Blow-dry the hair to see how the layers move and fall together.' },
        { year: 'Step 11', title: 'Clean and disinfect tools and workstation', description: 'Remove the cape and neck strip, clean the client, and disinfect all tools.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'uniform-layer-board-alerts',
      title: '🚨 BOARD ALERT: UNIFORM LAYERED CUT ESSENTIALS',
      content: "Expect licensing exams to focus on the relationship between elevation and layer length. Remember: uniform layers distribute weight evenly; consistent elevation is essential; changing the elevation changes the haircut; and the guide must be maintained through every section. These four ideas separate a uniform layer from a graduated or long-layered cut.",
      highlight: 'EVEN WEIGHT • CONSISTENT ELEVATION • ELEVATION CHANGES THE CUT • GUIDE CONTROL',
    },
    {
      type: 'contentBlock',
      id: 'uniform-layer-memory-anchors',
      title: '⚓ MEMORY ANCHORS',
      content: "Use these phrases to remember the core ideas: Equal elevation, equal layers. Consistency creates balance. Movement comes from uniformity.",
      highlight: 'EQUAL ELEVATION, EQUAL LAYERS • CONSISTENCY CREATES BALANCE',
    },
    {
      type: 'checklist',
      id: 'uniform-layer-common-mistakes',
      title: 'COMMON MISTAKES TO AVOID',
      items: [
        { text: 'Inconsistent elevation — creates uneven layer lengths' },
        { text: 'Losing the guide — later sections no longer match the first' },
        { text: 'Uneven tension — stretches some layers more than others' },
        { text: 'Large subsections — hide mistakes and make precision impossible' },
        { text: 'Rushing the cross-check — small length errors become obvious after drying' },
        { text: 'Uneven balance between sides — the cut looks lopsided' },
      ],
    },
    {
      type: 'proTip',
      id: 'uniform-layer-instructor-tips',
      title: '💎 INSTRUCTOR TIPS',
      subtitle: 'Teaching uniform layering with precision',
      items: [
        { category: 'Demonstrate 90 Degrees', tips: ['Show students what 90-degree elevation looks like on different areas of the head before they begin cutting.'] },
        { category: 'Compare Sides', tips: ['Pause frequently to compare the left and right sides. Balance is the whole point of a uniform layer.'] },
        { category: 'Point to the Guide', tips: ['Have students identify the traveling guide before each subsection. Consistency depends on knowing where the reference is.'] },
        { category: 'Show Elevation Changes', tips: ['Demonstrate how lifting the hair higher or lower changes the layer length. Seeing the difference locks in the concept.'] },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'uniform-layer-scenario',
      title: '🪞 REAL SHOP SCENARIO: MOVEMENT AND VERSATILITY',
      scenarios: [
        {
          situation: "A client wants a haircut with soft movement, lighter weight, and styling flexibility. She does not want a heavy bottom line or stacked fullness in the back. Why is a uniform layered cut the better choice?",
          options: [
            { letter: 'A', text: 'A blunt cut is better because it creates the cleanest perimeter', feedback: '❌ A blunt cut concentrates weight at the bottom. It would not give the client soft movement or lighter weight.' },
            { letter: 'B', text: 'A graduated cut is better because it builds fullness in the back', feedback: '❌ A graduated cut stacks weight in a specific area. The client wants lighter, more flexible weight distribution.' },
            { letter: 'C', text: 'A uniform layered cut distributes weight evenly and creates consistent movement throughout the hair', feedback: '✅ Correct. Equal elevation and even layers spread weight so the hair moves easily and styles in multiple directions.' },
            { letter: 'D', text: 'Cutting random layers freehand will create movement', feedback: '❌ Random layers produce uneven results. Movement without balance looks unprofessional and is hard to style.' },
          ],
          correctAnswer: 'C',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PACKET C2 — THE LONG LAYERED CUT
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'long-layer-introduction',
      title: 'THE LONG LAYERED CUT: LENGTH WITH MOVEMENT',
      content: "A long layered cut preserves overall length while creating movement, softness, and reduced weight through longer layers. Unlike a uniform layered cut, which creates equal-length layers throughout, a long layer keeps the perimeter long while introducing shorter interior layers. The result is a haircut that feels lighter, moves more freely, and offers greater styling versatility without sacrificing the length the client wants to keep.",
      highlight: 'LONG LAYERS KEEP PERIMETER LENGTH WHILE LIGHTENING INTERIOR WEIGHT',
    },
    {
      type: 'contentBlock',
      id: 'why-long-layer-matters',
      title: 'WHY THE LONG LAYERED CUT MATTERS',
      content: "Long layered cuts are one of the most requested services in salons and barbershops. Clients want the best of both worlds: the drama of long hair and the manageability of movement. Students must learn how to maintain length while improving shape, texture, and styling flexibility. A well-executed long layer looks effortless but depends on the same discipline as any other structure: consistent elevation, controlled sectioning, and a reliable guide.",
      highlight: 'LONG HAIR DOES NOT HAVE TO MEAN HEAVY HAIR',
    },
    {
      type: 'featureGrid',
      id: 'long-layer-design-principles',
      title: 'LONG LAYERED CUT DESIGN PRINCIPLES',
      subtitle: 'How to keep length and add movement',
      features: [
        {
          icon: 'Award',
          title: 'PRESERVE OVERALL LENGTH',
          description: 'The perimeter stays long. The goal is not to shorten the hair but to shape it.',
        },
        {
          icon: 'TrendingUp',
          title: 'USE HIGHER ELEVATION',
          description: 'Hair is lifted high, commonly to 180 degrees, so interior layers can be shorter while the perimeter remains long.',
        },
        {
          icon: 'Sparkles',
          title: 'CREATE MOVEMENT',
          description: 'Removing weight from the interior lets the hair move, bend, and respond to styling.',
        },
        {
          icon: 'Scale',
          title: 'MAINTAIN BALANCE',
          description: 'Symmetry and consistent elevation keep the layers from looking choppy or uneven.',
        },
      ],
    },
    {
      type: 'tabbed',
      id: 'long-layer-key-terms',
      title: 'LONG LAYERED CUT KEY TERMS',
      subtitle: 'Language for length and movement',
      tabs: [
        {
          id: 'long-layers',
          label: 'Long Layers',
          title: 'Long Layers',
          bullets: [
            { label: 'Definition', description: 'Layers that are significantly longer than traditional layers, designed to preserve perimeter length.' },
            { label: 'Why it matters', description: 'Long layers give clients movement without a dramatic loss of length.' },
          ],
        },
        {
          id: 'one-eighty-elevation',
          label: '180-Degree Elevation',
          title: '180-Degree Elevation',
          bullets: [
            { label: 'Definition', description: 'Hair is lifted straight up, overhead and parallel to the floor, before cutting.' },
            { label: 'Why it matters', description: 'High elevation allows interior layers to be cut shorter while the perimeter falls to its original length.' },
          ],
        },
        {
          id: 'perimeter-preservation',
          label: 'Perimeter Preservation',
          title: 'Perimeter Preservation',
          bullets: [
            { label: 'Definition', description: 'Keeping the outside edge of the haircut long while removing weight from within.' },
            { label: 'Why it matters', description: 'This is what distinguishes a long layered cut from a shorter, more layered style.' },
          ],
        },
        {
          id: 'interior-layers',
          label: 'Interior Layers',
          title: 'Interior Layers',
          bullets: [
            { label: 'Definition', description: 'Layers cut inside the haircut, away from the perimeter.' },
            { label: 'Why it matters', description: 'Interior layers reduce bulk and create movement without changing the outer length.' },
          ],
        },
        {
          id: 'movement',
          label: 'Movement',
          title: 'Movement',
          bullets: [
            { label: 'Definition', description: 'How freely the hair flows and responds to styling.' },
            { label: 'Why it matters', description: 'The main benefit of a long layered cut is increased movement while keeping length.' },
          ],
        },
        {
          id: 'weight-reduction',
          label: 'Weight Reduction',
          title: 'Weight Reduction',
          bullets: [
            { label: 'Definition', description: 'Removing bulk from the interior of the haircut so the hair feels lighter.' },
            { label: 'Why it matters', description: 'Weight reduction makes long hair more comfortable and easier to style.' },
          ],
        },
        {
          id: 'traveling-guide',
          label: 'Traveling Guide',
          title: 'Traveling Guide',
          bullets: [
            { label: 'Definition', description: 'A guide that moves with each new section as the haircut progresses.' },
            { label: 'Why it matters', description: 'A traveling guide keeps long layers consistent from the front to the back of the head.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'long-layer-figures',
      title: 'FIGURE CALLOUTS: LONG LAYERS AND HIGH ELEVATION',
      content: "The textbook figures for long layered cutting show hair lifted to a high elevation and cut so the interior layers fall shorter than the perimeter. The high-elevation figure teaches that lifting the hair overhead creates the gap between interior and perimeter length. These images demonstrate that increased elevation preserves perimeter length while producing longer internal layers. Future ASCYN PRO illustrations will replace the textbook artwork, but the principle remains: high elevation, long movement.",
      highlight: 'HIGH ELEVATION PRESERVES PERIMETER LENGTH',
    },
    {
      type: 'contentBlock',
      id: 'long-layer-tools',
      title: 'TOOLS & MATERIALS',
      content: "The same reliable tools support a long layered cut. A cutting comb controls sectioning and elevation. Sharp shears cut cleanly through high-elevation sections. Clips separate the hair so you can work methodically. A cape and neck strip protect the client. A spray bottle keeps the hair manageable. A blow-dryer and styling brush reveal the final movement. The most important factors are proper sectioning, consistent elevation, and stable body position. The tools enable the work, but discipline creates the result.",
      highlight: 'SECTIONING, ELEVATION, AND BODY POSITION CREATE THE RESULT',
    },
    {
      type: 'milestoneList',
      id: 'long-layer-procedure-sequence',
      title: 'LONG LAYERED CUT PROCEDURE SEQUENCE',
      milestones: [
        { year: 'Step 1', title: 'Prepare and position the client', description: 'Seat the client upright and facing the mirror. Good posture supports consistent elevation.' },
        { year: 'Step 2', title: 'Drape and protect', description: 'Apply a neck strip and cape for client protection.' },
        { year: 'Step 3', title: 'Establish the initial guide', description: 'Cut the first section at the desired length and elevation. This guide becomes the reference for all interior layers.' },
        { year: 'Step 4', title: 'Elevate hair consistently', description: 'Lift each section to the planned long-layer angle, commonly 180 degrees.' },
        { year: 'Step 5', title: 'Follow the traveling guide', description: 'Use the previously cut section as the guide for the next section to maintain consistency.' },
        { year: 'Step 6', title: 'Maintain even tension and body position', description: 'Keep the same light tension and stand in a stable position so the elevation does not drift.' },
        { year: 'Step 7', title: 'Continue section by section while preserving perimeter length', description: 'Work through the interior without cutting into the outside edge that the client wants to keep long.' },
        { year: 'Step 8', title: 'Repeat evenly on both sides', description: 'Compare left and right to keep the layering symmetrical.' },
        { year: 'Step 9', title: 'Cross-check for balance and symmetry', description: 'Look for uneven layers, heavy spots, or mismatched perimeter length.' },
        { year: 'Step 10', title: 'Dry, style, and evaluate movement', description: 'Blow-dry the hair to see how the layers move and whether the perimeter length is preserved.' },
        { year: 'Step 11', title: 'Clean, disinfect, and restore the workstation', description: 'Remove the cape and neck strip, clean the client, and disinfect tools.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'long-layer-board-alerts',
      title: '🚨 BOARD ALERT: LONG LAYERED CUT ESSENTIALS',
      content: "Licensing exams often test the difference between haircut structures. Remember: higher elevation creates longer layers; the perimeter must be preserved while interior weight is reduced; consistent elevation produces predictable results; and guide control is essential from section to section. These ideas separate a long layered cut from a uniform layer or blunt cut.",
      highlight: 'HIGH ELEVATION • PERIMETER PRESERVATION • CONSISTENT ELEVATION • GUIDE CONTROL',
    },
    {
      type: 'contentBlock',
      id: 'long-layer-memory-anchors',
      title: '⚓ MEMORY ANCHORS',
      content: "Use these phrases to lock in the concepts: High elevation, long movement. Keep the length, lighten the weight. The perimeter stays, the interior moves.",
      highlight: 'HIGH ELEVATION, LONG MOVEMENT • KEEP THE LENGTH, LIGHTEN THE WEIGHT',
    },
    {
      type: 'checklist',
      id: 'long-layer-common-mistakes',
      title: 'COMMON MISTAKES TO AVOID',
      items: [
        { text: 'Removing too much perimeter length — defeats the purpose of a long layered cut' },
        { text: 'Inconsistent elevation — creates uneven layer depth' },
        { text: 'Losing the traveling guide — later sections no longer match' },
        { text: 'Uneven tension — stretches some sections and changes the layer length' },
        { text: 'Overdirecting unintentionally — moves hair out of natural position and changes the shape' },
        { text: 'Failing to cross-check — small errors become visible after styling' },
      ],
    },
    {
      type: 'proTip',
      id: 'long-layer-instructor-tips',
      title: '💎 INSTRUCTOR TIPS',
      subtitle: 'Teaching long layers with clarity',
      items: [
        { category: 'Show the Elevation Difference', tips: ['Demonstrate 90-degree and 180-degree elevation side by side. Students need to feel the difference in their bodies, not just see it.'] },
        { category: 'Compare Uniform and Long Layers', tips: ['Show a uniform layer and a long layer next to each other. The difference in perimeter length becomes immediately clear.'] },
        { category: 'Evaluate After Blow Drying', tips: ['Always blow-dry before final judgment. Wet long hair can hide uneven interior layers.'] },
        { category: 'Reinforce the Guide', tips: ['Have students name the traveling guide before each subsection. Consistency depends on knowing the reference point.'] },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'long-layer-scenario',
      title: '🪞 REAL SHOP SCENARIO: KEEPING LENGTH, ADDING LIFE',
      scenarios: [
        {
          situation: "A client wants to keep her long hair but complains it feels heavy and lacks movement. Why is a long layered cut the right design choice?",
          options: [
            { letter: 'A', text: 'A blunt cut will remove weight and make the hair feel lighter', feedback: '❌ A blunt cut keeps all the weight at the perimeter. It would not address the heaviness or add movement.' },
            { letter: 'B', text: 'A uniform layered cut will shorten the perimeter while adding even layers', feedback: '❌ A uniform layer removes perimeter length. The client specifically wants to keep her long hair.' },
            { letter: 'C', text: 'A long layered cut preserves overall length while reducing interior weight and adding movement', feedback: '✅ Correct. High elevation removes weight from the interior, creates movement, and keeps the perimeter long.' },
            { letter: 'D', text: 'A graduated cut will stack weight at the back and create movement', feedback: '❌ A graduated cut builds weight in a specific area. The client wants overall lightness and movement, not stacked fullness.' },
          ],
          correctAnswer: 'C',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PACKET D1 — CURLY HAIR, TEXTURE & DENSITY
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'texture-density-curly-introduction',
      title: 'HAIR ANALYSIS: TEXTURE, DENSITY & CURLY HAIR',
      content: "Every haircut should begin with a thorough hair analysis. Texture, density, and natural curl pattern directly influence haircut planning, sectioning, tool selection, and the finished result. A haircut that works beautifully on one client may produce a completely different result on another because of differences in strand diameter, total hair mass, elasticity, growth patterns, and curl formation. Professional barbers adapt their techniques to the client's natural hair characteristics instead of forcing a single method on every head.",
      highlight: 'ANALYZE BEFORE YOU CUT',
    },
    {
      type: 'contentBlock',
      id: 'why-hair-analysis-matters',
      title: 'WHY HAIR ANALYSIS MATTERS',
      content: "Texture controls how the hair responds to tension and cutting. Density controls how much hair you are working with and how sections behave. Curl pattern controls how length changes as the hair dries. Ignoring any of these factors leads to surprises at the styling chair. A professional plan starts with observation, continues with the right technique, and ends with a result that matches the client's hair — not just their inspiration photo.",
      highlight: 'TEXTURE • DENSITY • CURL PATTERN • GROWTH PATTERNS • LIFESTYLE',
    },
    {
      type: 'featureGrid',
      id: 'hair-texture-types',
      title: 'HAIR TEXTURE',
      subtitle: 'Strand diameter affects control and finish',
      features: [
        {
          icon: 'Award',
          title: 'FINE',
          description: 'Small strand diameter. Fine hair is soft, may lack body, and can be overwhelmed by aggressive layering or heavy tension.',
        },
        {
          icon: 'Heart',
          title: 'MEDIUM',
          description: 'Average strand diameter. Medium hair responds predictably to most techniques and is the most versatile to cut.',
        },
        {
          icon: 'Sparkles',
          title: 'COARSE',
          description: 'Large strand diameter. Coarse hair is strong, may resist styling, holds shape well, and can require weight release.',
        },
      ],
    },
    {
      type: 'featureGrid',
      id: 'hair-density-types',
      title: 'HAIR DENSITY',
      subtitle: 'Total hair mass affects sectioning and planning',
      features: [
        {
          icon: 'Scale',
          title: 'THIN',
          description: 'Fewer hairs per square inch. Lower elevation and smaller sections help preserve the appearance of fullness.',
        },
        {
          icon: 'Users',
          title: 'MEDIUM',
          description: 'Average amount of hair. Most structures work well with standard adjustments and section sizes.',
        },
        {
          icon: 'TrendingUp',
          title: 'THICK',
          description: 'More hairs per square inch. Higher elevation, layering, and controlled sectioning reduce bulk and improve movement.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'texture-density-effects',
      title: 'HOW TEXTURE AND DENSITY AFFECT THE CUT',
      content: "Texture affects how the hair behaves under tension. Fine hair stretches easily and can look thinner if over-layered. Coarse hair resists tension and may need stronger release techniques. Density affects how much hair you remove with each cut and how large your sections should be. Thin density shows every cut, so precision and conservative layering matter. Thick density hides small errors but can become bulky if weight is not managed. The same elevation on fine, thin hair looks very different from the same elevation on coarse, thick hair.",
      highlight: 'SAME TECHNIQUE + DIFFERENT HAIR = DIFFERENT RESULT',
    },
    {
      type: 'contentBlock',
      id: 'curly-hair-fundamentals',
      title: 'CURLY HAIR FUNDAMENTALS',
      content: "Curly hair has a natural wave pattern that creates movement, expansion, and shrinkage. Wet curls may appear much longer than dry curls because the curl springs up as it dries. Curly hair also expands outward, so the silhouette can change dramatically after styling. Curls should never be treated like straight hair. Forcing a curl into a technique designed for straight hair removes the curl's memory and produces an uneven shape. Always observe the natural fall and curl pattern before choosing where and how much to cut.",
      highlight: 'CURLY HAIR HAS A MEMORY — RESPECT THE PATTERN',
    },
    {
      type: 'checklist',
      id: 'hair-analysis-checklist',
      title: 'HAIR ANALYSIS CHECKLIST',
      items: [
        { text: 'Texture — fine, medium, or coarse strand diameter' },
        { text: 'Density — thin, medium, or thick total hair mass' },
        { text: 'Growth patterns — direction the hair naturally grows' },
        { text: 'Cowlicks — areas where growth changes direction abruptly' },
        { text: 'Natural movement — wave, curl, or straight behavior' },
        { text: 'Client lifestyle — daily styling time and maintenance expectations' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'texture-curly-figures',
      title: 'FIGURE CALLOUTS: WAVE, CURL, AND TEXTURE',
      content: "The textbook figures for this topic show wave formation, curl pattern, and texture comparison. The wave-formation image teaches that curls have a repeating structure with crests and troughs. The curl-pattern image shows how different curl types expand and shrink after drying. The texture-comparison image illustrates the difference between fine, medium, and coarse strand diameters. Together these figures teach that hair analysis is visual as well as tactile. Future ASCYN PRO illustrations will replace the textbook artwork while preserving these educational concepts.",
      highlight: 'FIGURES TEACH VISUAL AND TACTILE ANALYSIS',
    },
    {
      type: 'contentBlock',
      id: 'texture-curly-board-alerts',
      title: '🚨 BOARD ALERT: HAIR ANALYSIS ESSENTIALS',
      content: "Licensing exams consistently test hair analysis and curl behavior. Remember: always perform a hair analysis before cutting; curly hair shrinks after drying; texture and density determine technique selection; and no single haircut fits every client. These principles protect both the client and your professional reputation.",
      highlight: 'ANALYZE FIRST • CURLS SHRINK • TEXTURE GUIDES TECHNIQUE • ONE SIZE DOES NOT FIT ALL',
    },
    {
      type: 'contentBlock',
      id: 'texture-curly-memory-anchors',
      title: '⚓ MEMORY ANCHORS',
      content: "Use these phrases to make the concepts stick: Analyze before you cut. Texture guides technique. Density changes design. Curly hair has a memory.",
      highlight: 'ANALYZE BEFORE YOU CUT • TEXTURE GUIDES TECHNIQUE • CURLY HAIR HAS A MEMORY',
    },
    {
      type: 'checklist',
      id: 'texture-curly-common-mistakes',
      title: 'COMMON MISTAKES TO AVOID',
      items: [
        { text: 'Ignoring curl shrinkage — wet length is not dry length' },
        { text: 'Using excessive tension on curly hair — stretches the curl and changes the cut' },
        { text: 'Choosing section sizes that are too large — hides unevenness and reduces precision' },
        { text: 'Treating all textures the same — fine, coarse, thin, and thick hair respond differently' },
        { text: 'Failing to evaluate growth patterns — cowlicks and growth direction affect the finished shape' },
      ],
    },
    {
      type: 'proTip',
      id: 'texture-curly-instructor-tips',
      title: '💎 INSTRUCTOR TIPS',
      subtitle: 'Teaching texture, density, and curl analysis',
      items: [
        { category: 'Compare Samples', tips: ['Show fine, medium, and coarse hair samples side by side. Students retain the difference when they can feel and see it.'] },
        { category: 'Demonstrate Shrinkage', tips: ['Cut a small curly section wet and let it dry. Measure before and after to prove shrinkage is real.'] },
        { category: 'Require Analysis First', tips: ['Have students perform a complete hair analysis before every practice haircut. Build the habit early.'] },
        { category: 'Discuss Adaptation', tips: ['Ask students how they would adjust a blunt cut for fine, thin hair versus coarse, thick hair. Conversation reinforces planning.'] },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'texture-curly-scenario',
      title: '🪞 REAL SHOP SCENARIO: THE STRAIGHT-HAIR PHOTO',
      scenarios: [
        {
          situation: "A client with naturally curly, thick hair shows you a photo of a style cut on straight, fine hair. How should consultation and hair analysis guide your response?",
          options: [
            { letter: 'A', text: 'Cut the style exactly as shown and explain that she can straighten it at home', feedback: '❌ Copying a straight-hair style onto curly, thick hair ignores texture, density, and curl shrinkage. The result will not match the photo.' },
            { letter: 'B', text: 'Analyze texture, density, and curl pattern, then explain how her hair will respond and adapt the design', feedback: '✅ Correct. Hair analysis and honest consultation set realistic expectations and guide technique selection.' },
            { letter: 'C', text: 'Refuse the service because curly hair cannot be layered', feedback: '❌ Curly hair can absolutely be layered. Refusing without education misses a teaching opportunity and a satisfied client.' },
            { letter: 'D', text: 'Use the highest elevation possible to remove all the bulk and match the photo', feedback: '❌ Removing too much bulk can destroy curl pattern and shape. Elevation must match the hair and the goal, not the photo alone.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PACKET D2 — RAZOR CUTTING, OVERDIRECTION & TEXTURIZING
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'advanced-techniques-introduction',
      title: 'ADVANCED TECHNIQUES: CUSTOMIZING THE CUT',
      content: "Advanced haircutting techniques allow the barber to customize shape, movement, weight distribution, and texture. These techniques should only be used after mastering the four foundational haircut structures. They do not replace structure; they refine it. Razor cutting, overdirection, and texturizing help personalize haircuts while maintaining balance and supporting the client's hair type, lifestyle, and desired result.",
      highlight: 'ADVANCED TECHNIQUES REFINE — NOT REPLACE — STRUCTURE',
    },
    {
      type: 'contentBlock',
      id: 'why-advanced-techniques-matter',
      title: 'WHY ADVANCED TECHNIQUES MATTER',
      content: "Professional barbers rarely rely on one haircut structure alone. A blunt cut may need point cutting to soften the edge. A graduated cut may need overdirection to preserve length around the face. A thick haircut may need texturizing to reduce bulk without losing the design. Advanced techniques turn a standard haircut into a personalized style, but they require judgment. The wrong technique on the wrong hair can damage the cut, the hair, or the client's trust.",
      highlight: 'PERSONALIZE THE CUT WITHOUT LOSING THE DESIGN',
    },
    {
      type: 'contentBlock',
      id: 'overdirection-explained',
      title: 'OVERDIRECTION',
      content: "Overdirection means combing hair away from its natural falling position before cutting. It preserves length in the area the hair is pulled from and shifts weight toward the area the hair is pulled to. Overdirection is useful when you want to keep length around the face, build weight in a specific area, or create an asymmetrical shape. It should be avoided when the goal is a balanced, natural fall, or when the client wants even weight distribution. The key is intention: every direction change must serve the design.",
      highlight: 'DIRECTION CHANGES DESIGN',
    },
    {
      type: 'contentBlock',
      id: 'razor-cutting-explained',
      title: 'RAZOR CUTTING',
      content: "Razor cutting uses a razor to remove hair at an angle. Unlike shears, which cut a clean, defined line, a razor softens the ends and creates movement. It is ideal for clients who want a lighter, more textured edge and for hair that is healthy and strong enough to handle the blade. Razor cutting is not appropriate for every texture. Fine, fragile, or highly porous hair can fray or weaken. A sharp razor, controlled pressure, and correct body position are essential for safety and consistency.",
      highlight: 'RAZOR SOFTENS; SHEARS DEFINE',
    },
    {
      type: 'tabbed',
      id: 'texturizing-techniques',
      title: 'TEXTURIZING TECHNIQUES',
      subtitle: 'Methods that refine weight and movement',
      tabs: [
        {
          id: 'point-cutting',
          label: 'Point Cutting',
          title: 'Point Cutting',
          bullets: [
            { label: 'Purpose', description: 'Softens blunt lines and removes small amounts of bulk from the ends.' },
            { label: 'When to use', description: 'Ideal for finishing layered or blunt cuts where the edge looks too heavy.' },
            { label: 'Effect', description: 'Creates a softer, more lived-in perimeter without shortening length dramatically.' },
            { label: 'Precautions', description: 'Use the tips of the shears and avoid cutting into fragile or damaged hair.' },
          ],
        },
        {
          id: 'notching',
          label: 'Notching',
          title: 'Notching',
          bullets: [
            { label: 'Purpose', description: 'Removes weight in a more aggressive, spaced pattern than point cutting.' },
            { label: 'When to use', description: 'Useful on thick, heavy hair that needs significant release at the perimeter.' },
            { label: 'Effect', description: 'Creates texture and separation while reducing bulk.' },
            { label: 'Precautions', description: 'Notching can create visible gaps if overdone. Use sparingly on fine hair.' },
          ],
        },
        {
          id: 'freehand-notching',
          label: 'Freehand Notching',
          title: 'Freehand Notching',
          bullets: [
            { label: 'Purpose', description: 'Removes bulk in specific spots without following a strict section pattern.' },
            { label: 'When to use', description: 'Useful for targeted weight release in dense areas.' },
            { label: 'Effect', description: 'Creates localized texture and movement.' },
            { label: 'Precautions', description: 'Requires a clear plan. Random notching produces uneven results.' },
          ],
        },
        {
          id: 'slithering',
          label: 'Slithering',
          title: 'Slithering',
          bullets: [
            { label: 'Purpose', description: 'Slides partially open shears along a section to remove a small amount of bulk.' },
            { label: 'When to use', description: 'Best for dense hair that needs subtle weight reduction while preserving length.' },
            { label: 'Effect', description: 'Softens the interior without creating visible layers or gaps.' },
            { label: 'Precautions', description: 'Avoid on fine or thin hair; it can remove too much mass quickly.' },
          ],
        },
        {
          id: 'slicing',
          label: 'Slicing',
          title: 'Slicing',
          bullets: [
            { label: 'Purpose', description: 'Removes weight along the length of a section using a deliberate slicing motion.' },
            { label: 'When to use', description: 'Useful for creating movement and separation in medium to thick hair.' },
            { label: 'Effect', description: 'Produces longer, more fluid texture than notching.' },
            { label: 'Precautions', description: 'Control depth and pressure. Slicing too deeply weakens the hair.' },
          ],
        },
        {
          id: 'carving',
          label: 'Carving',
          title: 'Carving',
          bullets: [
            { label: 'Purpose', description: 'Removes bulk from the interior of a section using a curved cutting motion.' },
            { label: 'When to use', description: 'Useful for releasing weight in thick, heavy hair without changing the exterior shape.' },
            { label: 'Effect', description: 'Creates internal movement and reduces bulk while keeping the perimeter intact.' },
            { label: 'Precautions', description: 'Requires practice and control. Carving too aggressively creates holes in the shape.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'advanced-techniques-figures',
      title: 'FIGURE CALLOUTS: OVERDIRECTION, RAZOR, AND TEXTURIZING',
      content: "The textbook figures show overdirection, razor cutting, point cutting, notching, slithering, slicing, and carving. The overdirection figure teaches how pulling hair away from natural fall shifts length and weight. The razor-cutting figure shows the angled blade position that creates softness. The texturizing figures demonstrate how different techniques remove bulk or soften edges in different patterns. Future ASCYN PRO illustrations will replace the textbook artwork while preserving these educational ideas.",
      highlight: 'EACH TECHNIQUE HAS A DISTINCT PURPOSE AND RESULT',
    },
    {
      type: 'contentBlock',
      id: 'advanced-techniques-board-alerts',
      title: '🚨 BOARD ALERT: ADVANCED TECHNIQUE ESSENTIALS',
      content: "Licensing exams expect you to understand when and why advanced techniques are used. Remember: overdirection changes where length and weight remain; razor cutting is not appropriate for every hair texture; texturizing removes bulk without dramatically changing overall length; and you must always evaluate hair texture before selecting advanced techniques. Safety and judgment are part of the test.",
      highlight: 'OVERDIRECTION CHANGES WEIGHT • RAZOR IS NOT UNIVERSAL • TEXTURIZE WITH INTENTION',
    },
    {
      type: 'contentBlock',
      id: 'advanced-techniques-memory-anchors',
      title: '⚓ MEMORY ANCHORS',
      content: "Use these phrases to keep the concepts clear: Direction changes design. Razor softens; shears define. Remove bulk, not control. Advanced techniques refine the haircut.",
      highlight: 'DIRECTION CHANGES DESIGN • RAZOR SOFTENS; SHEARS DEFINE • REMOVE BULK, NOT CONTROL',
    },
    {
      type: 'checklist',
      id: 'advanced-techniques-common-mistakes',
      title: 'COMMON MISTAKES TO AVOID',
      items: [
        { text: 'Excessive overdirection — shifts too much weight and destroys balance' },
        { text: 'Removing too much weight — leaves the haircut limp or uneven' },
        { text: 'Using a razor on unsuitable hair — frays fine, fragile, or porous strands' },
        { text: 'Over-texturizing — creates gaps, holes, or weak ends' },
        { text: 'Working without a clear design plan — advanced techniques must serve the structure' },
        { text: 'Using dull tools — damages hair and produces uneven results' },
        { text: 'Forgetting that advanced techniques support — not replace — the haircut structure' },
      ],
    },
    {
      type: 'proTip',
      id: 'advanced-techniques-instructor-tips',
      title: '💎 INSTRUCTOR TIPS',
      subtitle: 'Teaching advanced techniques safely',
      items: [
        { category: 'Demonstrate Separately', tips: ['Show each texturizing method on its own before combining them. Students confuse techniques when they blur together.'] },
        { category: 'Compare Razor and Shear', tips: ['Cut two swatches the same length — one with shears, one with a razor. Let students see and feel the difference.'] },
        { category: 'Require a Reason', tips: ['Before a student uses an advanced technique, ask why they chose it. If they cannot explain, they are not ready.'] },
        { category: 'Finishing Tools Mindset', tips: ['Reinforce that advanced techniques are finishing tools, not shortcuts. Structure comes first.'] },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'advanced-techniques-scenario',
      title: '🪞 REAL SHOP SCENARIO: THE BULKY FINISH',
      scenarios: [
        {
          situation: "A client has thick, heavy hair that appears bulky after the primary haircut is complete. How can overdirection and selected texturizing techniques improve the result without removing unnecessary length?",
          options: [
            { letter: 'A', text: 'Cut several inches off the perimeter to remove the bulk', feedback: '❌ Removing perimeter length sacrifices the design. Bulk is an interior problem, not always a length problem.' },
            { letter: 'B', text: 'Use overdirection to shift weight and texturizing to reduce bulk in dense areas', feedback: '✅ Correct. Overdirection can redistribute weight where it is wanted, and controlled texturizing can release bulk without shortening the overall shape.' },
            { letter: 'C', text: 'Apply heavy product and blow-dry the bulk flat', feedback: '❌ Product and styling cannot fix a structural bulk problem. The cut itself needs adjustment.' },
            { letter: 'D', text: 'Shave the underside of the hair with clippers', feedback: '❌ Shaving the underside is an extreme approach that is rarely appropriate and can create visible lines or damage.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PACKET E1 — STYLING, FINISHING & CHAPTER COMPLETION
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'styling-introduction',
      title: 'STYLING: THE FINAL STEP OF THE SERVICE',
      content: "A professional haircut is not complete until it has been properly finished and styled. Styling allows both the barber and the client to evaluate the haircut's balance, movement, weight distribution, and overall design. It also shows the client how the hair will behave after they leave the shop. The right finishing method depends on the haircut structure, the hair's condition, and the client's daily routine.",
      highlight: 'THE HAIRCUT IS NOT FINISHED UNTIL IT IS STYLED',
    },
    {
      type: 'contentBlock',
      id: 'why-styling-matters',
      title: 'WHY STYLING MATTERS',
      content: "Proper styling enhances the haircut, demonstrates professional skill, and helps the client recreate the look at home. It reveals whether the cut is balanced, whether weight is distributed correctly, and whether any corrections are needed. Styling is also a teaching moment: clients who understand how to maintain their hair are more satisfied and more likely to return.",
      highlight: 'STYLING REVEALS THE DESIGN AND BUILDS CLIENT CONFIDENCE',
    },
    {
      type: 'contentBlock',
      id: 'wet-styling',
      title: 'WET STYLING',
      content: "Wet styling shapes the hair while it is damp and sets it into a finished form as it dries. Common techniques include finger waves, pin curls, and roller sets. Wet styling is useful for polished, classic looks and for hair that holds a set well. Before wet styling, the hair should be clean, evenly damp, and prepared with the right product for hold and control. Wet styling also supports haircut evaluation because it shows how the shape settles when the hair is not blown straight.",
      highlight: 'WET STYLING SETS SHAPE WHILE THE HAIR DRIES',
    },
    {
      type: 'contentBlock',
      id: 'hair-wrapping',
      title: 'HAIR WRAPPING',
      content: "Hair wrapping is a smoothing technique used to create or preserve a straight, sleek finish. The hair is wrapped around the head in a specific pattern and left to set, often under a dryer or cap. Wrapping is beneficial for clients who want long-lasting smoothness, reduced volume, or a straighter silhouette between services. The general principle is to keep the hair flat and directed along the scalp so the cuticle lays smooth and the finished shape stays controlled.",
      highlight: 'WRAPPING SMOOTHS THE CUTICLE AND PRESERVES A STRAIGHT FINISH',
    },
    {
      type: 'contentBlock',
      id: 'blow-dry-styling',
      title: 'BLOW-DRY STYLING',
      content: "Blow-drying shapes hair with airflow, heat, and brushes. Brush selection matters: round brushes add volume and curve, paddle brushes smooth and straighten, and vent brushes speed drying with less tension. Airflow should follow the direction you want the hair to lie. Heat must be controlled to avoid damage. Volume is created at the roots by lifting with the brush and directing airflow upward. Smoothing is achieved by directing airflow downward along the cuticle. Finishing with a cool shot sets the style and closes the cuticle for shine.",
      highlight: 'AIRFLOW DIRECTION CONTROLS SHAPE AND SMOOTHNESS',
    },
    {
      type: 'contentBlock',
      id: 'thermal-styling',
      title: 'THERMAL STYLING',
      content: "Thermal styling uses heat tools such as curling irons and flat irons to reshape or smooth the hair. Always apply a heat protectant before using thermal tools. Choose an appropriate temperature for the hair's condition: fine or damaged hair needs lower heat; healthy, coarse hair can tolerate more. Keep tools moving to avoid scorching, and never apply heat to damp hair unless the tool is specifically designed for wet styling. Protect the client's skin and ears from hot surfaces, and always place tools on a heat-safe mat when not in use.",
      highlight: 'CONTROL THE HEAT, PROTECT THE HAIR',
    },
    {
      type: 'checklist',
      id: 'finishing-the-service',
      title: 'FINISHING THE SERVICE',
      items: [
        { text: 'Evaluate balance from all angles before showing the client' },
        { text: 'Confirm symmetry on both sides' },
        { text: "Remove loose hair from the client's neck and face" },
        { text: 'Review the haircut with the client and answer questions' },
        { text: 'Recommend home maintenance and appropriate products' },
        { text: 'Clean and disinfect all tools' },
        { text: 'Restore the workstation to professional standards' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'styling-figures',
      title: 'FIGURE CALLOUTS: STYLING AND FINISHING',
      content: "The textbook figures for this topic show wrapping, blow-drying, thermal styling, and finishing techniques. The wrapping figure teaches how hair is directed around the head to create smoothness. The blow-drying figure shows brush position and airflow direction. The thermal-styling figure demonstrates safe tool angle and heat application. The finishing figure reinforces professional cleanup and client review. Future ASCYN PRO illustrations will replace the textbook artwork while preserving these educational concepts.",
      highlight: 'FIGURES SHOW TECHNIQUE, SAFETY, AND PROFESSIONAL FINISH',
    },
    {
      type: 'contentBlock',
      id: 'styling-board-alerts',
      title: '🚨 BOARD ALERT: STYLING AND SAFETY ESSENTIALS',
      content: "Licensing exams expect professionalism from cut to cleanup. Remember: styling reveals the true haircut; always use heat safely; protect the client during thermal services; finish every service professionally; and sanitation continues after the haircut is complete. These standards protect the client, the barber, and the shop's reputation.",
      highlight: 'STYLING REVEALS • HEAT SAFETY • CLIENT PROTECTION • PROFESSIONAL FINISH • SANITATION',
    },
    {
      type: 'contentBlock',
      id: 'styling-memory-anchors',
      title: '⚓ MEMORY ANCHORS',
      content: "Use these phrases to lock in the finishing concepts: The haircut isn't finished until it's styled. Control the heat, protect the hair. Professional services end with professional cleanup.",
      highlight: 'THE HAIRCUT IS NOT FINISHED UNTIL IT IS STYLED',
    },
    {
      type: 'checklist',
      id: 'styling-common-mistakes',
      title: 'COMMON MISTAKES TO AVOID',
      items: [
        { text: 'Excessive heat — damages the cuticle and weakens the hair' },
        { text: 'Poor airflow direction — fights the natural fall and creates frizz' },
        { text: 'Incorrect brush selection — limits control and finish quality' },
        { text: 'Styling before checking haircut balance — hides problems instead of fixing them' },
        { text: 'Forgetting client education — leaves the client unprepared at home' },
        { text: 'Incomplete cleanup and sanitation — unprofessional and unsafe' },
      ],
    },
    {
      type: 'proTip',
      id: 'styling-instructor-tips',
      title: '💎 INSTRUCTOR TIPS',
      subtitle: 'Teaching finishing with purpose',
      items: [
        { category: 'Blow-Dryer Movement', tips: ['Demonstrate continuous motion. A stationary nozzle concentrates heat and can scorch the hair.'] },
        { category: 'Airflow Direction', tips: ['Show correct and incorrect airflow side by side. Students quickly see how direction affects smoothness and volume.'] },
        { category: 'Reveal Mistakes', tips: ['Explain that styling can reveal uneven layers or heavy spots. The cut may need refinement after drying.'] },
        { category: 'Evaluate Every Angle', tips: ['Have students view the finished style from the front, sides, and back before dismissing the client.'] },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'styling-scenario',
      title: '🪞 REAL SHOP SCENARIO: RECREATING THE LOOK AT HOME',
      scenarios: [
        {
          situation: "A client loves the haircut after it is styled but asks how to recreate the look at home. How should the barber respond to improve client satisfaction?",
          options: [
            { letter: 'A', text: 'Tell the client to use any product and blow-dry randomly', feedback: '❌ Vague advice leaves the client frustrated. Specific product and technique guidance is part of professional service.' },
            { letter: 'B', text: 'Recommend the right products, demonstrate blow-drying technique, and explain daily maintenance', feedback: '✅ Correct. Teaching the client how to recreate the style builds confidence, satisfaction, and loyalty.' },
            { letter: 'C', text: 'Explain that only a professional can style the hair', feedback: '❌ While professionals add value, clients need practical home care. This response discourages rather than empowers.' },
            { letter: 'D', text: 'Sell the most expensive product without explaining why', feedback: "❌ Product recommendations should match the client's hair and goal, not just price. Education matters more than the sale." },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // CHAPTER 16 WRAP-UP
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'chapter-16-wrap-up',
      title: '📝 CHAPTER 16 WRAP-UP',
      content: "This chapter covered the full arc of women's haircutting and styling. You learned the four foundational haircut structures: the blunt cut, the graduated cut, the uniform layered cut, and the long layered cut. You learned that hair analysis — texture, density, curl pattern, growth patterns, and lifestyle — must happen before any cutting begins. You explored advanced techniques including overdirection, razor cutting, and texturizing, and you saw how finishing and styling complete the service. Throughout it all, consultation, safety, and sanitation remained the foundation of professional work.",
      highlight: 'STRUCTURE • ANALYSIS • TECHNIQUE • STYLING • CONSULTATION • SAFETY',
    },
    {
      type: 'contentBlock',
      id: 'continuous-practice',
      title: 'KEEP PRACTICING',
      content: "Women's haircutting is a skill that deepens with repetition. Every head of hair is different, so every cut teaches something new. Return to the foundational structures often. Practice hair analysis on every client. Use advanced techniques only when they serve the design. Finish every service with professional styling and cleanup. The barbers who master this chapter are the ones who never stop learning, never stop observing, and never stop refining their craft.",
      highlight: 'LIFELONG LEARNING BUILDS TRUSTED PROFESSIONALS',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // CLOSING QUOTE
    // ═══════════════════════════════════════════════════════════════════════════
    {
      type: 'quote',
      id: 'chapter-16-closing-quote',
      quote: "A great barber does not limit who they serve. They expand their skill until every client — regardless of gender, texture, or style — leaves the chair feeling seen, heard, and confident.",
    },
  ],
}
