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
          text: 'Professional shaving remains a defining barbering skill and depends on deliberate practice, control, and service judgment.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Safety First',
          text: 'Safe shaving depends on controlled blade handling, steady skin support, and careful observation rather than speed.',
        },
        {
          icon: 'User',
          title: 'Facial Structure Knowledge',
          text: 'Reading facial features, beard growth, and proportion helps the barber plan both shaving and facial-hair design.',
        },
      ],
    },
    {
      type: 'quote',
      id: 'shaving-quote',
      quote: 'A professional shave combines preparation, controlled razor work, and finishing steps to deliver precise grooming with client comfort in mind.',
    },

    // Section 2: Basic Guidelines for Shaving
    {
      type: 'contentBlock',
      id: 'shaving-fundamentals',
      title: 'Understand the Fundamentals of Shaving',
      content: 'Professional shaving removes visible facial and neck hair while protecting skin comfort. Before choosing towel preparation, lather, or razor technique, evaluate the client\'s skin, beard texture, growth direction, and tolerance. The chapter presents straight-razor and changeable-blade methods, but tool and legal requirements can vary by jurisdiction.',
      highlight: 'observe the client before selecting the shaving approach',
    },
    {
      type: 'checklist',
      id: 'shaving-dos-donts',
      title: 'Dos and Don\'ts of Shaving',
      items: [
        { text: 'Inspect the skin first; if pustules or signs of active infection are visible, defer shaving that area and follow infection-control and referral procedures' },
        { text: 'Map beard growth and locate grain changes before the first razor stroke' },
        { text: 'Avoid hot-towel preparation on chapped, blistered, thin, or highly sensitive skin and adjust preparation to client tolerance' },
        { text: 'Avoid a deep-cleansing facial immediately after shaving because freshly shaved skin may be more easily irritated' },
        { text: 'Use extra control beneath the lower lip, on the lower neck, and around the Adam\'s apple' },
        { text: 'Choose gentler toning products when stronger astringents are not appropriate for sensitive skin' },
        { text: 'Coarse or heavy beard growth may need more lathering and additional warm-towel preparation' },
        { text: 'If a mustache will remain, establish its shape before the facial shave so finish work can follow the design' },
      ],
    },

    // Section 3: Hair Type Considerations
    {
      type: 'contentBlock',
      id: 'hair-type-considerations',
      title: 'Hair Type Considerations',
      content: 'Curly beard hair can curve back toward the skin as it emerges. Very close hair removal, working contrary to the growth pattern, or using excessive tool pressure can increase ingrown-hair problems such as pseudofolliculitis. A barber should recognize visible risk, use conservative technique, and stay within professional scope rather than diagnose a medical condition.',
      highlight: 'growth pattern should guide how closely and in what direction you shave',
    },
    {
      type: 'infoCards',
      id: 'ingrown-hair-info',
      title: 'Understanding Ingrown Hairs',
      cards: [
        {
          icon: 'AlertTriangle',
          title: 'Causes',
          text: 'Very close hair removal, working against the growth pattern, and heavy tool pressure can increase ingrown-hair risk.',
        },
        {
          icon: 'Ban',
          title: 'Consequences',
          text: 'Ingrown hairs can become inflamed and may be associated with folliculitis or keloid-prone reactions; barbers should not diagnose these conditions.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Prevention',
          text: 'Map the grain, favor light pressure and with-grain technique, and avoid repeated scraping or excessive skin tension.',
        },
      ],
    },

    // Section 4: Hair Growth and Grain
    {
      type: 'contentBlock',
      id: 'hair-growth-grain',
      title: 'Hair Growth Considerations',
      content: 'Before shaving, trace the direction in which beard hair exits the skin; that direction is the grain. When neighboring areas grow in different directions, treat the transition as a grain change and adjust the razor position or stroke. Whorls and other growth patterns can alter the textbook\'s default area-by-area approach, so observe the client rather than relying on a diagram alone.',
      highlight: 'the client\'s actual grain determines the stroke',
    },
    {
      type: 'featureGrid',
      id: 'grain-terms',
      title: 'Key Shaving Terms',
      features: [
        {
          icon: 'ArrowDown',
          title: 'With the Grain',
          description: 'Move the razor in the same general direction as hair growth; this is the chapter\'s normal first-pass approach.',
        },
        {
          icon: 'ArrowUp',
          title: 'Against the Grain',
          description: 'Move opposite the growth direction; this is associated with close-shave work and can increase irritation or ingrown-hair risk.',
        },
        {
          icon: 'ArrowRight',
          title: 'Across the Grain',
          description: 'Move roughly across the growth direction; use this selectively during follow-up or once-over work.',
        },
        {
          icon: 'RefreshCw',
          title: 'Grain Change',
          description: 'A transition where the beard changes direction; pause to re-check stretch, angle, and stroke before continuing.',
        },
      ],
    },

    // Section 5: The 14 Shaving Areas
    {
      type: 'contentBlock',
      id: 'fourteen-areas',
      title: 'The 14 Shaving Areas of the Face',
      content: 'The chapter divides the face into 14 training areas for the first-time-over shave. Use the map to organize a systematic pass, but confirm the client\'s actual grain before choosing the stroke for each area. Whorls or unusual growth may require a different razor position or direction than the default map.',
      highlight: 'use the 14-area map as a guide, then follow the client\'s grain',
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
      content: 'A cutting stroke combines blade angle, hand position, direction, and movement across the skin. Keep the razor at a controlled shallow angle, lead with the point, and use a light forward glide. Facial shaving primarily uses freehand, backhand, and reverse-freehand positions; reverse-backhand is mainly associated with neck and outline work.',
      highlight: 'control the angle, lead with the point, and keep the stroke light',
    },
    {
      type: 'featureGrid',
      id: 'razor-positions',
      title: 'The Four Razor Positions',
      features: [
        {
          icon: 'Hand',
          title: 'Freehand',
          description: 'A toward-you gliding stroke using the freehand grip; the chapter assigns it to six first-pass shaving areas.',
        },
        {
          icon: 'HandMetal',
          title: 'Backhand',
          description: 'An away-from-you gliding stroke with the razor controlled near the shank and pivot; used in four first-pass areas, with Area 12 optionally backhand.',
        },
        {
          icon: 'ArrowUp',
          title: 'Reverse Freehand',
          description: 'A freehand-like grip adapted to an upward, semi-arced stroke, commonly used from behind the client in Areas 5, 10, 13, and 14.',
        },
        {
          icon: 'ArrowDown',
          title: 'Reverse Backhand',
          description: 'A backhand-style grip adapted to downward outline work along the neck or hairline; it is not one of the main 14-area facial strokes.',
        },
      ],
    },

    // Section 7: Skin Stretching
    {
      type: 'contentBlock',
      id: 'skin-stretching',
      title: 'The Art of Skin Stretching',
      content: 'Create a smooth, stable shaving surface without pulling the skin excessively. Stretch opposite the razor\'s travel, keep the supporting fingers dry, and keep them clear of the blade path. Too little control can let skin bunch ahead of the razor; too much tension can increase irritation.',
      highlight: 'use firm, controlled tension rather than maximum stretch',
    },
    {
      type: 'checklist',
      id: 'skin-stretching-tips',
      title: 'Skin Stretching Guidelines',
      items: [
        { text: 'Use the finger pads to create controlled tension without digging into the skin' },
        { text: 'Use the thumb and second finger as primary anchors, adjusting placement for the area' },
        { text: 'Pull the skin opposite the planned direction of razor travel' },
        { text: 'Keep the supporting fingertips dry enough to maintain a secure grip' },
        { text: 'Aim for firm, comfortable tension rather than the tightest possible stretch' },
        { text: 'Clear only enough lather to see and control the next stroke path' },
      ],
    },

    // Section 8: Body Positioning
    {
      type: 'contentBlock',
      id: 'body-positioning',
      title: 'Body Positioning for the Shave',
      content: 'Begin from the side that matches the dominant hand: right-handed barbers work from the client\'s right side and left-handed barbers mirror the setup. Reposition the client\'s head and move your own feet or body as the stroke changes instead of reaching awkwardly across the client.',
      highlight: 'move your body with the stroke instead of overreaching',
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
      content: 'This chapter organizes the professional shave into three checkpoints: prepare the client and beard, remove hair methodically with controlled razor technique, and complete the service with appropriate finishing care. Keeping those stages distinct helps the barber maintain both sequence and safety.',
      highlight: 'prepare → shave methodically → finish the service',
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
            { label: 'Draping', description: 'Position and drape the client securely before razor work begins' },
            { label: 'Warm Towel Prep', description: 'Use warm or hot towels only when the client\'s skin and tolerance make them appropriate' },
            { label: 'Softening', description: 'Warmth and moisture help prepare beard hair for the shave' },
            { label: 'Lathering', description: 'Apply shaving cream or gel to soften and lubricate the beard while creating a controlled surface for the razor' },
          ],
        },
        {
          id: 'shaving',
          label: 'Shaving',
          title: 'Performing the Shave',
          bullets: [
            { label: 'Grain-Aware Sequence', description: 'Work through the mapped areas while adapting each stroke to the client\'s actual growth pattern' },
            { label: 'Two-Hand Control', description: 'The dominant hand controls the razor while the other hand stabilizes and stretches the skin' },
            { label: 'Stable Surface', description: 'Keep skin firm enough for control without over-stretching' },
            { label: 'Light Glide', description: 'Use a controlled forward glide with the point leading rather than scraping or pressing' },
          ],
        },
        {
          id: 'finishing',
          label: 'Finishing',
          title: 'Finishing the Service',
          bullets: [
            { label: 'Moisturizer', description: 'Apply an appropriate moisturizer as part of the finishing routine' },
            { label: 'Toning', description: 'Use an appropriate toner or freshener to remove remaining product residue' },
            { label: 'Powder', description: 'A light powder finish may be used when appropriate and desired' },
            { label: 'Neck Shave', description: 'A neck shave may be offered when appropriate, permitted, and part of the planned service' },
          ],
        },
      ],
    },

    // Section 10: Types of Shaves
    {
      type: 'contentBlock',
      id: 'types-of-shaves',
      title: 'Know the Types of Shaves',
      content: 'Barbering uses several traditional terms to distinguish the primary pass, a follow-up pass, a faster once-over service, and a requested close shave. Learn what each term changes about lathering, direction, and follow-up technique.',
      highlight: 'know what changes from one shave type to another',
    },
    {
      type: 'featureGrid',
      id: 'shave-types',
      title: 'Types of Shaves',
      features: [
        {
          icon: 'Scissors',
          title: 'First-Time-Over Shave',
          description: 'The primary pass on lathered facial hair, normally following the grain to remove beard growth evenly while limiting irritation.',
        },
        {
          icon: 'RefreshCw',
          title: 'Second-Time-Over Shave',
          description: 'A follow-up after re-moistening the skin to address rough or uneven spots, using with-grain or across-grain strokes as appropriate.',
        },
        {
          icon: 'Zap',
          title: 'Once-Over Shave',
          description: 'A shorter, single-lather service that adds selected across-grain strokes for a more even result without intentionally becoming a close shave.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Close Shave',
          description: 'Against-grain work during a follow-up pass. It can increase irritation and ingrown-hair risk, so use it only when the client, skin, growth pattern, training, and local rules make it appropriate.',
        },
      ],
    },

    // Section 11: Neck and Outline Shaves
    {
      type: 'contentBlock',
      id: 'neck-outline',
      title: 'The Neck Shave and the Outline Shave',
      content: 'A neck shave cleans the neckline behind the ears and across the nape when the service calls for it. An outline shave extends around the sideburn and ear areas and may include the front hairline after a haircut. Inspect the skin first for moles, warts, or other raised areas and work within training and scope instead of shaving blindly over them.',
      highlight: 'inspect the neckline before placing the razor',
    },

    // Section 12: Mustache Design
    {
      type: 'contentBlock',
      id: 'mustache-design',
      title: 'Trimming and Designing the Mustache',
      content: 'Mustache design should start with the client\'s preference, natural growth, texture, and facial proportions. Shape conservatively enough to support easy maintenance between visits, and confirm the design before removing too much hair.',
      highlight: 'client preference and natural growth come before a preset style',
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
            { label: 'Mouth proportion', description: 'Use mouth width as one reference when choosing the overall mustache span' },
            { label: 'Nose proportion', description: 'Consider how the mustache scale relates visually to the nose' },
            { label: 'Upper-lip shape', description: 'Respect the natural lip area and the client\'s preferred outline' },
            { label: 'Cheek, jaw, and chin proportions', description: 'View the mustache as part of the whole facial silhouette rather than in isolation' },
            { label: 'Growth density and texture', description: 'Choose a design the client\'s actual hair growth can support' },
          ],
        },
        {
          id: 'design-guidelines',
          label: 'Design Guidelines',
          title: 'Mustache Design Guidelines by Face Type',
          bullets: [
            { label: 'Scale', description: 'Fuller facial features may visually support more mustache volume, while finer features often call for lighter proportions' },
            { label: 'Vertical balance', description: 'Face length, nose prominence, and upper-lip space can influence the height and width of the design' },
            { label: 'Mouth balance', description: 'Adjust width and end shape so the mustache complements rather than overwhelms the mouth' },
            { label: 'Natural hairline', description: 'Avoid cutting deeply into natural growth simply to force a textbook example' },
            { label: 'Client preference', description: 'Use design examples as starting points, not rigid rules; confirm the desired look with the client' },
          ],
        },
      ],
    },

    // Section 13: Beard Design
    {
      type: 'contentBlock',
      id: 'beard-design',
      title: 'Designing the Beard',
      content: 'Use beard length, outline, and volume to support the client\'s preferred appearance and create visual balance. Faces and growth patterns are rarely perfectly symmetrical, so compare both sides, work with natural density, and make gradual adjustments instead of cutting directly to the final length.',
      highlight: 'shape gradually around the client\'s natural growth and desired balance',
    },
    {
      type: 'checklist',
      id: 'beard-tips',
      title: 'Practical Tips for Beard Design',
      items: [
        { text: 'Check density and distribution before trimming so thin or uneven areas are not exposed accidentally' },
        { text: 'Use natural sideburn, cheek, and mustache hairlines as design guides whenever possible' },
        { text: 'Recheck growth direction under the chin and along the jaw before outlining' },
        { text: 'Begin slightly longer than the final target and reduce length gradually' },
        { text: 'Use the mirror and client feedback before committing to major shape changes' },
        { text: 'Select shears, comb, outliner, clippers, or razor according to the specific design step' },
        { text: 'Uniform clipper lengths work best when beard density and texture are reasonably even' },
        { text: 'Start near the existing beard length, then step shorter only as needed' },
      ],
    },

    // Section 14: Infection Control and Safety
    {
      type: 'contentBlock',
      id: 'infection-control',
      title: 'Infection Control and Safety Precautions',
      content: 'Shaving places a sharp implement in direct contact with skin, so infection-control and exposure procedures are part of the service—not an afterthought. Prepare reusable equipment correctly, use and discard blades according to their type, maintain hand and linen hygiene, and follow current jurisdictional requirements.',
      highlight: 'infection control is part of every razor step',
    },
    {
      type: 'checklist',
      id: 'safety-precautions',
      title: 'Shaving Safety Checklist',
      items: [
        { text: 'Prepare and disinfect reusable razor components as required, and use a fresh or properly processed blade for the razor type' },
        { text: 'Place used replaceable blades directly into an approved sharps container' },
        { text: 'Perform hand hygiene and use clean linens, capes, paper products, and a clean headrest barrier' },
        { text: 'If a cut or nick occurs, stop and follow standard precautions and the applicable exposure procedure before continuing' },
        { text: 'Lock and position the chair securely before blade work begins' },
        { text: 'Use towel and lather preparation only when the client\'s skin and tolerance make it appropriate' },
        { text: 'Use a light, point-leading glide and normally follow the observed grain on the first pass' },
        { text: 'Keep the stretch hand dry, stabilize the skin, and keep every supporting digit outside the razor path' },
        { text: 'Maintain enough moisture and lather for control rather than scraping dry skin' },
        { text: 'Finish each planned stroke cleanly and inspect between areas instead of repeatedly shaving the same spot' },
      ],
    },

    // Section 15: Customer Satisfaction
    {
      type: 'contentBlock',
      id: 'customer-satisfaction',
      title: 'Customer Satisfaction Factors',
      content: 'Client comfort and finish quality depend on several controllable factors: tool condition, cleanliness, temperature, pressure, complete hair removal, and professional presentation. Check these throughout the service instead of waiting for a complaint at the end.',
      highlight: 'quality control happens throughout the shave',
    },
    {
      type: 'featureGrid',
      id: 'satisfaction-factors',
      title: 'Common Causes of Client Dissatisfaction',
      features: [
        {
          icon: 'AlertTriangle',
          title: 'Tool Issues',
          description: 'A poorly prepared or rough-feeling razor can reduce comfort and finish quality.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Cleanliness',
          description: 'Hands, linens, draping, and work surfaces must remain clean and professionally managed.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Temperature',
          description: 'Cold hands or poorly controlled towel and lather temperature can make the service uncomfortable.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Technique',
          description: 'Heavy pressure, scraping, unnecessary close passes, or missed patches point to technique and inspection problems.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Environment',
          description: 'Lighting, personal hygiene, breath, and overall workstation comfort affect the client\'s experience.',
        },
      ],
    },

    // Section 16: Razor Anatomy
    {
      type: 'contentBlock',
      id: 'razor-anatomy',
      title: 'Straight Razor Anatomy',
      content: 'Learn the razor\'s parts before practicing opening, closing, gripping, and stroking it. Knowing where the edge, point, heel, shank, tang, pivot, and handle are helps you follow handling instructions precisely.',
      highlight: 'know the tool before practicing the stroke',
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
      content: 'Razor type, glove use, and other shaving requirements vary by jurisdiction. Treat this lesson as technique guidance rather than a universal legal rule. Before service, follow the current requirements of the applicable state board, school, and shop.',
      highlight: 'verify current local shaving rules instead of assuming one national rule',
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
          text: 'Alum-based styptic products use astringent action to help control minor bleeding.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Purpose',
          text: 'Use only in a sanitary, regulation-compliant manner and follow the required exposure procedure for any cut or nick.',
        },
      ],
    },
  ],
}
