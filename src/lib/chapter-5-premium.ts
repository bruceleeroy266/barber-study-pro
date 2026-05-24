// Chapter 5: Implements, Tools, and Equipment - PREMIUM MASTER CRAFTSMAN EXPERIENCE
// The Barber's Forge - precision, steel, mastery

import type { ChapterTheme, ChapterContent } from './chapter-content'

// -----------------------------------------------
// MASTER CRAFTSMAN FORGE THEME
// Forged steel / Workshop amber / Leather brown / Precision silver
// -----------------------------------------------

export const chapter5PremiumTheme: ChapterTheme = {
  primary: '#B87333',
  primaryLight: '#E8A858',
  primaryDark: '#8B5A2B',
  secondary: '#C0C0C0',
  background: 'rgba(30, 25, 20, 0.95)',
  backgroundAlt: 'rgba(40, 35, 30, 0.90)',
  surface: '#1E1914',
  border: 'rgba(184, 115, 51, 0.30)',
  text: '#F5F0EB',
  textMuted: '#A89B8C',
  highlight: '#E8A858',
  timeline: {
    line: 'rgba(184, 115, 51, 0.4)',
    iconBg: '#2A2520',
    iconBorder: '#B87333',
  },
  quote: {
    border: 'rgba(184, 115, 51, 0.45)',
    icon: 'rgba(184, 115, 51, 0.35)',
    bg: 'rgba(30, 25, 20, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(184, 115, 51, 0.18)',
    activeBorder: 'rgba(184, 115, 51, 0.55)',
    activeText: '#E8A858',
    inactiveBg: 'rgba(30, 25, 20, 0.7)',
    inactiveBorder: 'rgba(184, 115, 51, 0.15)',
    inactiveText: '#A89B8C',
    panelBg: 'rgba(30, 25, 20, 0.8)',
    panelBorder: 'rgba(184, 115, 51, 0.2)',
  },
  toolCard: {
    headerBg: 'rgba(184, 115, 51, 0.12)',
    headerText: '#E8A858',
    dot: 'rgba(184, 115, 51, 0.65)',
    line: 'rgba(184, 115, 51, 0.3)',
  },
  featureGrid: {
    iconBg: 'rgba(184, 115, 51, 0.18)',
    iconColor: '#B87333',
    cardBorder: 'rgba(184, 115, 51, 0.22)',
  },
  milestone: {
    yearColor: '#B87333',
    border: 'rgba(184, 115, 51, 0.25)',
  },
  checklist: {
    checkBorder: 'rgba(184, 115, 51, 0.45)',
    checkColor: '#B87333',
    bg: 'rgba(30, 25, 20, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(30, 25, 20, 0.7)',
    border: 'rgba(184, 115, 51, 0.2)',
    highlightColor: '#E8A858',
  },
  challengeCard: {
    badgeBg: 'rgba(184, 115, 51, 0.2)',
    badgeText: '#E8A858',
    cardBorder: 'rgba(184, 115, 51, 0.25)',
    completedBg: 'rgba(16, 185, 129, 0.1)',
    completedBorder: 'rgba(16, 185, 129, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(239, 68, 68, 0.08)',
    optionBorder: 'rgba(184, 115, 51, 0.2)',
    correctBg: 'rgba(16, 185, 129, 0.12)',
    incorrectBg: 'rgba(239, 68, 68, 0.1)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(184, 115, 51, 0.2)',
    levelBadgeText: '#E8A858',
    rewardBg: 'rgba(16, 185, 129, 0.12)',
    rewardText: '#10B981',
  },
  actionPrompt: {
    cardBorder: 'rgba(184, 115, 51, 0.2)',
    completedBorder: 'rgba(16, 185, 129, 0.35)',
    benefitBg: 'rgba(184, 115, 51, 0.1)',
    benefitBorder: 'rgba(184, 115, 51, 0.3)',
  },
}

// -----------------------------------------------
// PREMIUM IMMERSIVE CHAPTER 5 CONTENT
// -----------------------------------------------

export const chapter5PremiumContent: ChapterContent = {
  chapterNumber: 5,
  title: 'IMPLEMENTS, TOOLS & EQUIPMENT',
  subtitle: "The Master Craftsman's Forge - Know Your Steel, Master Your Craft",
  theme: chapter5PremiumTheme,
  sections: [
    // ==========================================
    // SECTION 1: THE FORGE WELCOME
    // ==========================================
    {
      type: 'contentBlock',
      id: 'forge-welcome',
      title: 'THE BARBER\'S FORGE',
      content: 'A barber without tools is a painter without brushes. But owning tools is not enough - you must understand them intimately. Every shear, clipper, and comb in your station represents decades of craftsmanship evolution. This chapter transforms you from someone who USES tools into a master who COMMANDS them. Your tools are an extension of your hands. Treat them with respect, maintain them with discipline, and they will serve you for decades.',
      highlight: 'OWN TOOLS - COMMAND TOOLS - MASTER TOOLS',
    },

    // ==========================================
    // SECTION 2: THE REAL STAKES
    // ==========================================
    {
      type: 'infoCards',
      id: 'tool-stakes',
      title: 'WHY TOOLS MATTER',
      subtitle: 'The consequences of tool ignorance',
      cards: [
        {
          icon: 'Shield',
          title: 'CLIENT SAFETY',
          text: 'Dull blades cause nicks and cuts. Improperly sanitized combs spread infections. A barber who does not understand tool maintenance is a liability to every client in their chair.',
        },
        {
          icon: 'Award',
          title: 'QUALITY RESULTS',
          text: 'Using clippers when shears are needed produces mediocre cuts. The wrong comb for a technique ruins fade work. Tool mastery separates apprentices from masters.',
        },
        {
          icon: 'DollarSign',
          title: 'INVESTMENT PROTECTION',
          text: 'A quality shear costs $200-500+. Proper maintenance extends life from months to decades. Neglected tools cost thousands in replacements. A sharp barber keeps sharp tools.',
        },
      ],
    },

    // ==========================================
    // SECTION 3: COMBS & BRUSHES MASTERY
    // ==========================================
    {
      type: 'tabbed',
      id: 'comb-mastery',
      title: 'COMBS & BRUSHES MASTERY',
      subtitle: 'Know every comb in your station - each has a purpose',
      tabs: [
        {
          id: 'all-purpose',
          label: 'ALL-PURPOSE',
          title: 'ALL-PURPOSE CUTTING COMBS',
          bullets: [
            { label: 'LENGTH', description: '7-8 inches - the standard workhorse' },
            { label: 'TEETH', description: 'Fine teeth on one end, medium on the other for versatility' },
            { label: 'MATERIAL', description: 'Carbon fiber or hard rubber - most durable and heat-resistant' },
            { label: 'BEST USES', description: 'Sectioning, scissor-over-comb, general cutting, detangling' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Carbon fiber and hard rubber combs are most durable and heat-resistant.' },
            { text: 'Replace combs with worn or broken teeth - they snag hair and damage the cuticle.' },
          ],
        },
        {
          id: 'taper',
          label: 'TAPER/BARBER',
          title: 'TAPER & BARBER COMBS',
          bullets: [
            { label: 'DESIGN', description: 'Shorter, sturdier with teeth spaced to grip hair firmly' },
            { label: 'PURPOSE', description: 'Specifically for clipper-over-comb and scissor-over-comb tapering' },
            { label: 'TECHNIQUE', description: 'Essential for fades, blending, and precision detail work' },
            { label: 'MATERIAL', description: 'Usually hard rubber for grip and control' },
          ],
          facts: [
            { text: 'Taper combs are NOT the same as all-purpose combs - they are specialized tools.' },
            { text: 'The teeth spacing determines how much hair is gripped - critical for fade consistency.' },
          ],
        },
        {
          id: 'clipper-guards',
          label: 'CLIPPER GUARDS',
          title: 'CLIPPER GUARDS / ATTACHMENT COMBS',
          bullets: [
            { label: '#0 GUARD', description: '1/16" (1.5mm) - closest cut without blade-on-skin' },
            { label: '#1 GUARD', description: '1/8" (3mm) - standard short fade starting point' },
            { label: '#2 GUARD', description: '1/4" (6mm) - most common guard for basic cuts' },
            { label: '#3 GUARD', description: '3/8" (10mm) - medium length, blending work' },
            { label: '#4 GUARD', description: '1/2" (13mm) - longer top work' },
            { label: '#5-8 GUARDS', description: '5/8" to 1" - longer styles, bulk removal' },
          ],
          facts: [
            { text: 'GUARD SIZES ARE UNIVERSAL across major clipper brands - memorize these conversions.' },
            { text: 'Always snap guards on firmly - loose guards cause uneven cuts and client injury.' },
          ],
        },
        {
          id: 'styling-brushes',
          label: 'STYLING BRUSHES',
          title: 'STYLING BRUSHES & FINISHING TOOLS',
          bullets: [
            { label: 'VENT BRUSH', description: 'Speeds drying time, great for detangling and light styling' },
            { label: 'ROUND BRUSH', description: 'Creates volume and curl during blow-drying - barrel size matters' },
            { label: 'PADDLE BRUSH', description: 'Smooths and straightens longer hair, covers more surface area' },
            { label: 'PICK/COMB', description: 'Lifts and adds volume to textured and curly hair' },
          ],
          facts: [
            { text: 'Brush choice affects final style as much as cutting technique.' },
            { text: 'Clean brushes daily - hair and product buildup transfers between clients.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 4: SHEAR ANATOMY INTERACTIVE
    // ==========================================
    {
      type: 'tabbed',
      id: 'shear-anatomy',
      title: 'SHEAR ANATOMY - KNOW EVERY PART',
      subtitle: 'A $500 tool demands $500-level knowledge',
      tabs: [
        {
          id: 'blade',
          label: 'BLADE',
          title: 'THE BLADE',
          bullets: [
            { label: 'MATERIAL', description: 'High-quality stainless steel or cobalt alloy - Japanese steel is premium' },
            { label: 'EDGE', description: 'Convex edge (hollow ground) is sharpest; beveled edge is more durable' },
            { label: 'LENGTH', description: '5" to 7" - 5.5"-6" is most versatile for barbering' },
            { label: 'CARE', description: 'Cut ONLY clean hair. Never cut paper, plastic, or anything else.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Convex edges are sharper but more fragile. Beveled edges last longer but cut less smoothly.' },
            { text: 'A nick in the blade from dropping requires professional repair - do NOT attempt to fix it yourself.' },
          ],
        },
        {
          id: 'pivot',
          label: 'PIVOT SCREW',
          title: 'PIVOT SCREW & TENSION',
          bullets: [
            { label: 'FUNCTION', description: 'Holds blades together and controls tension' },
            { label: 'TENSION TEST', description: 'Hold tips up, lift one handle. Blades should open partially, not fully, not stay closed.' },
            { label: 'TOO LOOSE', description: 'Blades fall completely open - hair bends instead of cutting' },
            { label: 'TOO TIGHT', description: 'Blades do not move - causes hand fatigue and premature wear' },
          ],
          facts: [
            { text: 'TENSION CHECK before EVERY haircut. This 5-second test prevents bad cuts and extends shear life.' },
            { text: 'Only adjust tension with the proper tool - never force the screw.' },
          ],
        },
        {
          id: 'handle',
          label: 'HANDLE',
          title: 'HANDLE CONFIGURATIONS',
          bullets: [
            { label: 'OFFSET HANDLE', description: 'Thumb hole set back from finger hole - most ergonomic, reduces wrist strain' },
            { label: 'CRANE HANDLE', description: 'Extreme offset with downward angle - maximum ergonomic benefit' },
            { label: 'OPPOSING HANDLE', description: 'Traditional straight design - thumb and fingers aligned' },
            { label: 'FINGER REST/TANG', description: 'Provides balance and control - removable on many models' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Offset and crane handles reduce repetitive strain injury (RSI) risk.' },
            { text: 'The finger rest is NOT just for pinky placement - it balances the shear for precision control.' },
          ],
        },
        {
          id: 'shear-types',
          label: 'SHEAR TYPES',
          title: 'TYPES OF SHEARS',
          bullets: [
            { label: 'STRAIGHT SHEARS', description: 'Standard cutting shear - 90% of haircutting work. 5"-7" lengths.' },
            { label: 'THINNING/TEXTURIZING', description: 'One blade has teeth (20-40 count). Removes bulk without changing length.' },
            { label: 'BLENDING SHEARS', description: 'Fewer, wider teeth than thinning shears. Blends lines between clipper and shear work.' },
            { label: 'LEFT-HANDED SHEARS', description: 'Blades are reversed for left-handed barbers. Using right-handed shears left-handed damages the edge.' },
          ],
          facts: [
            { text: 'Thinning shears with MORE teeth (40) create softer texture. FEWER teeth (20) create more dramatic removal.' },
            { text: 'Never use right-handed shears in your left hand - it crushes the cutting edge and ruins the blade.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 4.5: THE HAND DANCE
    // ==========================================
    {
      type: 'tabbed',
      id: 'hand-dance',
      title: 'THE HAND DANCE',
      subtitle: 'Master the fluid movement between comb and shears - never break your rhythm',
      tabs: [
        {
          id: 'shear-palming',
          label: 'SHEAR PALMING',
          title: 'SHEAR PALMING - FREE YOUR FINGERS',
          bullets: [
            { label: 'STEP 1', description: 'Open the shears slightly - about 30% open' },
            { label: 'STEP 2', description: 'Transfer the shears to your palm - still blade rests against the fleshy base of your thumb' },
            { label: 'STEP 3', description: 'Secure with your thumb - wrap around the finger holes or tang' },
            { label: 'STEP 4', description: 'Keep fingers free - index, middle, and ring fingers available for comb work' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Palming is tested on practical exams. You must demonstrate smooth tool transitions.' },
            { text: 'PRO TIP: Practice palming 50 times daily for one week. It becomes muscle memory.' },
          ],
        },
        {
          id: 'comb-grip',
          label: 'COMB GRIP',
          title: 'THE THREE-FINGER COMB GRIP',
          bullets: [
            { label: 'POSITION', description: 'Hold the comb between your ring finger, middle finger, and index finger' },
            { label: 'STABILITY', description: 'The comb rests in the crooks of these three fingers - stable platform' },
            { label: 'FREEDOM', description: 'Thumb and pinky remain free for hair control and shear retrieval' },
            { label: 'THE TWIRL', description: 'Advanced: spin the comb between fingers for seamless repositioning' },
          ],
          facts: [
            { text: 'The three-finger grip lets you hold BOTH comb and shears in one hand when needed.' },
            { text: 'PRO TIP: Use a lightweight carbon fiber comb for easier twirling and less fatigue.' },
          ],
        },
        {
          id: 'transition-flow',
          label: 'THE TRANSITION',
          title: 'THE PROFESSIONAL TRANSITION FLOW',
          bullets: [
            { label: 'COMB', description: 'Section and lift hair with comb in non-dominant hand' },
            { label: 'PALM', description: 'Transfer shears to palm - secure, fingers free' },
            { label: 'REPOSITION', description: 'Use freed fingers to adjust client head or hold hair' },
            { label: 'RETRIEVE', description: 'Retrieve shears from palm - seamless, no looking' },
            { label: 'CUT', description: 'Cut with confidence - blade parallel to comb' },
          ],
          facts: [
            { text: 'Professional barbers complete this transition in under 2 seconds.' },
            { text: 'PRO TIP: Never look at your hands during transition - keep eyes on the hair.' },
          ],
        },
        {
          id: 'scissor-over-comb',
          label: 'SCISSOR-OVER-COMB',
          title: 'SCISSOR-OVER-COMB TECHNIQUE',
          bullets: [
            { label: 'COMB POSITION', description: 'Lift hair at consistent angle from scalp - usually 45-90 degrees' },
            { label: 'BLADE ALIGNMENT', description: 'Keep top blade PARALLEL to the comb - never angled' },
            { label: 'MOVEMENT', description: 'Top blade moves, bottom blade stays relatively still' },
            { label: 'GUIDE', description: 'Use previously cut hair as your guide - lift some cut with new section' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Scissor-over-comb is a core practical skill. Blade must stay parallel to comb.' },
            { text: 'COMMON MISTAKE: Angling the blade creates uneven lines and ruins the fade.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 5: SHEAR MAINTENANCE CHECKLIST
    // ==========================================
    {
      type: 'checklist',
      id: 'shear-maintenance',
      title: 'SHEAR MAINTENANCE PROTOCOL',
      subtitle: 'Daily discipline that separates masters from amateurs',
      items: [
        { text: 'WIPE BLADES clean after EVERY haircut - remove all hair and product residue' },
        { text: 'OIL PIVOT POINT daily - 1 drop at the screw, open/close to distribute' },
        { text: 'CHECK TENSION before each use - perform the lift test every morning' },
        { text: 'NEVER DROP OR TOSS shears - a fall can create micro-fractures in the blade' },
        { text: 'STORE IN PROTECTIVE CASE - never loose in a drawer with other tools' },
        { text: 'SHARPEN EVERY 6-12 MONTHS - only use certified shear sharpeners' },
        { text: 'CUT ONLY CLEAN HAIR - dirty hair contains minerals that dull edges' },
        { text: 'NEVER CUT PAPER, PLASTIC, OR ANYTHING NON-HAIR - instant edge damage' },
      ],
    },

    // ==========================================
    // SECTION 6: CLIPPERS & TRIMMERS
    // ==========================================
    {
      type: 'tabbed',
      id: 'clipper-mastery',
      title: 'CLIPPERS & TRIMMERS',
      subtitle: 'The engine room of modern barbering',
      tabs: [
        {
          id: 'clippers',
          label: 'CLIPPERS',
          title: 'CLIPPERS - BULK & FADE POWER',
          bullets: [
            { label: 'PURPOSE', description: 'Powerful motors for bulk hair removal, fades, tapers, and buzz cuts' },
            { label: 'SIZE', description: 'Larger, heavier, more powerful than trimmers' },
            { label: 'BLADE TYPES', description: 'Adjustable (taper lever #000 to #1) or Fixed (single length, more powerful)' },
            { label: 'GUARD SYSTEM', description: 'Snap-on attachment combs in sizes #0 through #8+' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Adjustable blades use a taper lever. Fixed blades require blade changes or guards for different lengths.' },
            { text: 'Always start with the LONGEST guard and work down - you can cut more off, you cannot put it back.' },
          ],
        },
        {
          id: 'trimmers',
          label: 'TRIMMERS',
          title: 'TRIMMERS - PRECISION & DETAIL',
          bullets: [
            { label: 'PURPOSE', description: 'Smaller, precise tools for outlining, edging, and detail work' },
            { label: 'T-BLADE DESIGN', description: 'Allows for extremely close, clean lines around necklines and beards' },
            { label: 'COMMON USES', description: 'Neckline cleanup, beard outlining, edge-ups, designs, detail around ears' },
            { label: 'ZERO GAP', description: 'Blades can be adjusted to cut extremely close - requires skill to avoid skin irritation' },
          ],
          facts: [
            { text: 'Trimmers are NOT small clippers - they serve completely different purposes.' },
            { text: 'Zero-gap trimmers can cause razor burn if used improperly. Master the technique before using on clients.' },
          ],
        },
        {
          id: 'motor-types',
          label: 'MOTORS',
          title: 'MOTOR TYPES - KNOW YOUR ENGINE',
          bullets: [
            { label: 'MAGNETIC/PIVOT', description: 'Fast blade speed, quieter, lighter. Best for fine to medium hair. Beginner-friendly.' },
            { label: 'ROTARY', description: 'Most powerful, cooler running, longest lasting. Handles ALL hair types including thick and coarse. Professional standard.' },
            { label: 'CORDLESS/LITHIUM', description: 'Maximum mobility, consistent power. Modern battery tech provides corded-level performance. Most popular choice today.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Rotary motors are the professional standard for handling all hair types.' },
            { text: 'Lithium-ion batteries provide consistent power until depleted - no gradual weakening like older battery types.' },
          ],
        },
        {
          id: 'blade-maintenance',
          label: 'BLADE CARE',
          title: 'BLADE MAINTENANCE - NON-NEGOTIABLE',
          bullets: [
            { label: 'CLEAN AFTER EVERY USE', description: 'Brush out all hair debris from blade teeth' },
            { label: 'OIL BEFORE EACH USE', description: '3 drops across the blade - center, left, right' },
            { label: 'SPRAY DISINFECTANT', description: 'Between every client - blades must be sanitized' },
            { label: 'REPLACE WHEN DULL', description: 'Pulling or snagging hair means blades are dull - replace immediately' },
            { label: 'COOLANT SPRAY', description: 'Blades heat up during use - cool them to prevent client discomfort' },
          ],
          facts: [
            { text: 'A dull blade pulls hair instead of cutting - this causes pain, uneven cuts, and client distrust.' },
            { text: 'Never use a clipper on a client without oiling - dry blades overheat and damage hair.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 7: STRAIGHT RAZOR MASTERY
    // ==========================================
    {
      type: 'featureGrid',
      id: 'razor-types',
      title: 'STRAIGHT RAZOR MASTERY',
      subtitle: 'The most respected tool in barbering - and the most dangerous',
      features: [
        {
          icon: 'Skull',
          title: 'TRADITIONAL CUT-THROAT',
          description: 'Classic folding razor with permanent blade. Requires regular honing and stropping. Authentic experience, lifetime tool, ultimate control. High maintenance, steep learning curve.',
        },
        {
          icon: 'Shield',
          title: 'DISPOSABLE BLADE (SHAVETTE)',
          description: 'Uses replaceable single-edge blades. No honing or stropping required. Sanitary (new blade per client), low maintenance, affordable. Less heft, requires blade changes mid-service.',
        },
        {
          icon: 'Wrench',
          title: 'HONING PROCESS',
          description: 'Sharpening with whetstones (1000 -> 4000 -> 8000 grit). Removes metal to create new edge. Done every 2-3 months. Many barbers send out for professional honing.',
        },
        {
          icon: 'Sparkles',
          title: 'STROPPING',
          description: 'Polishing and aligning edge on leather. Does NOT remove metal. Done BEFORE every shave. Canvas side first, then leather. 20-30 passes each side. Maintains edge between honings.',
        },
      ],
    },

    // ==========================================
    // SECTION 7.5: THE RAZOR GRIP LAB
    // ==========================================
    {
      type: 'tabbed',
      id: 'razor-grip-lab',
      title: 'THE RAZOR GRIP LAB',
      subtitle: 'Four grips, four purposes - master each or risk failure',
      tabs: [
        {
          id: 'freehand',
          label: 'FREEHAND',
          title: 'FREEHAND GRIP - THE STANDARD',
          bullets: [
            { label: 'HAND POSITION', description: 'Scales opened 270 degrees, edge down, two fingers in front of scales' },
            { label: 'FINGER PLACEMENT', description: 'Two fingers behind scales, thumb underneath on tang' },
            { label: 'MOVEMENT', description: 'Short gliding strokes away from you - with the grain' },
            { label: 'BEST FOR', description: 'General face shaving, cheeks, broad areas' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Freehand is the foundation grip. Master this before learning others.' },
            { text: 'PRO TIP: Keep wrist straight - movement comes from shoulder and forearm, not wrist.' },
          ],
        },
        {
          id: 'backhand',
          label: 'BACKHAND',
          title: 'BACKHAND GRIP - BROAD CONTROL',
          bullets: [
            { label: 'HAND POSITION', description: 'Back of hand away from face, wrist bent slightly down' },
            { label: 'ELBOW', description: 'Elbow raised for forward movement control' },
            { label: 'MOVEMENT', description: 'Forward movement with arm or wrist - broader strokes' },
            { label: 'BEST FOR', description: 'Face, broader areas, with-the-grain passes' },
          ],
          facts: [
            { text: 'Backhand provides more leverage for coarse beard areas.' },
            { text: 'PRO TIP: Practice transitioning from freehand to backhand smoothly - no pause.' },
          ],
        },
        {
          id: 'reverse-freehand',
          label: 'REVERSE FREEHAND',
          title: 'REVERSE FREEHAND - PRECISION AREAS',
          bullets: [
            { label: 'HAND POSITION', description: 'Hand turned toward you, edge facing up' },
            { label: 'MOVEMENT', description: 'Semi-curved strokes toward you - controlled and precise' },
            { label: 'BEST FOR', description: 'Chin, upper lip, precision areas' },
            { label: 'BLADE ANGLE', description: 'Maintain 30-degree angle - critical for safety' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Reverse freehand is REQUIRED for upper lip and chin areas.' },
            { text: 'NEVER use reverse freehand on the neck - wrong grip for the area.' },
          ],
        },
        {
          id: 'reverse-backhand',
          label: 'REVERSE BACKHAND',
          title: 'REVERSE BACKHAND - NECK ONLY',
          bullets: [
            { label: 'HAND POSITION', description: 'Palm up, elbow down to your side' },
            { label: 'MOVEMENT', description: 'Downward gliding strokes - smooth and controlled' },
            { label: 'RESTRICTION', description: 'SIDES OF NECK ONLY - never use on face' },
            { label: 'SAFETY', description: 'This grip on the face is a critical error that fails exams' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Reverse backhand is RESTRICTED to sides of neck. Using it elsewhere fails the practical.' },
            { text: 'CRITICAL: This grip on the face risks serious cuts. Know your zones.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 7.6: THE GRIND WORKSHOP
    // ==========================================
    {
      type: 'featureGrid',
      id: 'grind-workshop',
      title: 'THE GRIND WORKSHOP',
      subtitle: 'The hidden geometry that separates good steel from great steel',
      features: [
        {
          icon: 'Scan',
          title: 'HOLLOW-GROUND (CONCAVE)',
          description: 'Concave profile creates a "singing" edge. Detects resistance during honing. Preferred for fine beards and precision work. The blade "tells" you when it is sharp through vibration feedback.',
        },
        {
          icon: 'Wrench',
          title: 'WEDGE GRIND',
          description: 'Sharp angle, aggressive cutting. Powers through coarse, thick beards. Challenging to hone but unmatched for heavy hair. The workhorse grind for tough clients.',
        },
        {
          icon: 'Award',
          title: 'CROCUS FINISH',
          description: 'Premium finish quality indicator. The finest polish on razor steel. A crocus-finished blade has mirror-like smoothness and superior edge retention. The mark of master craftsmanship.',
        },
        {
          icon: 'Shield',
          title: 'BEARD TYPE MATCHING',
          description: 'Fine beard -> Hollow-ground for precision. Coarse beard -> Wedge for power. Sensitive skin -> Hollow-ground for smoothness. Know your steel, know your client.',
        },
      ],
    },

    // ==========================================
    // SECTION 8: RAZOR SAFETY PROTOCOL
    // ==========================================
    {
      type: 'checklist',
      id: 'razor-safety',
      title: 'STRAIGHT RAZOR SAFETY PROTOCOL',
      subtitle: 'One mistake with this tool can end a career',
      items: [
        { text: 'ALWAYS use a fresh blade (disposable) or freshly stropped blade (traditional)' },
        { text: 'STRETCH THE SKIN TAUT - never shave loose or wrinkled skin' },
        { text: 'USE MINIMAL PRESSURE - let the weight of the razor do the work' },
        { text: 'SHAVE WITH THE GRAIN first, then across, then against if needed' },
        { text: 'NEVER pass the razor hand-to-hand - set it down, let the other person pick it up' },
        { text: 'DISPOSE of used blades in a SHARPS CONTAINER - never in regular trash' },
        { text: 'NEVER attempt to catch a falling razor - step back and let it fall' },
        { text: 'MASTER the tool on a mannequin or balloon before using on paying clients' },
      ],
    },

    // ==========================================
    // SECTION 9: TOOL IDENTIFICATION CHALLENGE
    // ==========================================
    {
      type: 'scenarioBlock',
      id: 'tool-id-challenge',
      title: 'TOOL IDENTIFICATION CHALLENGE',
      subtitle: 'A client wants a skin fade with sharp lines. Which tools do you reach for?',
      scenarios: [
        {
          situation: 'CLIENT REQUEST: "I want a skin fade with a sharp lineup and beard trim." You look at your station. Which tools are REQUIRED for this service?',
          options: [
            { letter: 'A', text: 'Clippers with guards, trimmer, straight razor, comb', feedback: 'CORRECT. Clippers with guards for the fade, trimmer for the sharp lineup, straight razor for the final edge and neck shave, comb for sectioning and clipper-over-comb work.' },
            { letter: 'B', text: 'Just clippers with a #1 guard', feedback: 'INCORRECT. A #1 guard cannot create a skin fade (which requires #0 or no guard). No trimmer means no sharp lines. No razor means no clean finish.' },
            { letter: 'C', text: 'Scissors and a comb only', feedback: 'INCORRECT. Shears cannot create a skin fade. This is a clipper-dominant service. Shears are for blending and detail, not the foundation.' },
            { letter: 'D', text: 'Trimmer and straight razor only', feedback: 'PARTIAL. These handle the lines and finish but cannot create the fade foundation. You need clippers for the bulk removal and taper work.' },
          ],
          correctAnswer: 'A',
        },
      ],
    },

    // ==========================================
    // SECTION 9.5: THE HEAT STATION
    // ==========================================
    {
      type: 'tabbed',
      id: 'heat-station',
      title: 'THE HEAT STATION',
      subtitle: 'Controlled fire - master thermal tools or burn your reputation',
      tabs: [
        {
          id: 'marcel-iron',
          label: 'MARCEL IRON',
          title: 'MARCEL IRON - THE PRO STANDARD',
          bullets: [
            { label: 'DESIGN', description: 'Manual temperature control with rotating handle - no spring' },
            { label: 'CONTROL', description: 'Barrel heats evenly, clamp holds hair firmly without crushing' },
            { label: 'TECHNIQUE', description: 'Rotate handle to wind hair, hold 5-8 seconds, release smoothly' },
            { label: 'BEST FOR', description: 'Professional curls, waves, and texture work - the barber standard' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Marcel irons are the professional standard for thermal curling.' },
            { text: 'PRO TIP: The rotating handle gives you infinite control - practice the wrist motion.' },
          ],
        },
        {
          id: 'pressing-comb',
          label: 'PRESSING COMB',
          title: 'PRESSING COMB - TEXTURED HAIR MASTERY',
          bullets: [
            { label: 'DESIGN', description: 'Metal comb heated on electric stove or heater - straightens textured hair' },
            { label: 'TEMPERATURE', description: 'Test on tissue paper before client contact - scorch means too hot' },
            { label: 'TECHNIQUE', description: 'Slow, steady passes through sections - never rush' },
            { label: 'SAFETY', description: 'NEVER use metal pressing comb directly on scalp - causes burns' },
          ],
          facts: [
            { text: 'CRITICAL: Metal on scalp causes serious burns. Always maintain distance from skin.' },
            { text: 'The pressing comb is essential for textured hair services - know it well.' },
          ],
        },
        {
          id: 'blowdryer',
          label: 'BLOWDRYER',
          title: 'BLOWDRYER - THE FINISHING TOUCH',
          bullets: [
            { label: 'NOZZLE TYPES', description: 'Concentrator (precision), diffuser (texture), pick (volume)' },
            { label: 'HEAT SETTINGS', description: 'High for coarse/thick, medium for normal, cool for fine/damaged' },
            { label: 'SAFETY RULE 1', description: 'Keep the dryer MOVING - stationary heat damages hair' },
            { label: 'SAFETY RULE 2', description: 'Never use near water - electrocution risk' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Always use a heat protectant product before blow-drying.' },
            { text: 'PRO TIP: Finish with cool shot to set the style and close the cuticle.' },
          ],
        },
        {
          id: 'thermal-safety',
          label: 'THERMAL SAFETY',
          title: 'THERMAL SAFETY - NON-NEGOTIABLE',
          bullets: [
            { label: 'THE TISSUE TEST', description: 'Drag iron across tissue - clean pass means ready, scorch means too hot' },
            { label: 'HEAT PROTECTANT', description: 'Apply to EVERY client before thermal contact - no exceptions' },
            { label: 'KEEP MOVING', description: 'Stationary iron = burned hair and angry clients' },
            { label: 'NEVER METAL ON SCALP', description: 'Metal combs on scalp cause burns - maintain safe distance' },
          ],
          facts: [
            { text: 'A burn from a thermal tool can end your career - take safety seriously.' },
            { text: 'BOARD EXAM ALERT: Thermal safety is tested on every state board exam.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 9.6: RAZOR GRIP SCENARIO
    // ==========================================
    {
      type: 'scenarioBlock',
      id: 'razor-grip-scenario',
      title: 'RAZOR GRIP CHALLENGE',
      subtitle: 'Wrong grip, wrong area - know your zones or fail',
      scenarios: [
        {
          situation: "PRACTICAL EXAM: Your examiner asks you to demonstrate the proper razor grip for shaving the client's upper lip. Which grip do you use?",
          options: [
            { letter: 'A', text: 'Freehand grip - standard position', feedback: 'INCORRECT. Freehand is for general face shaving. The upper lip requires reverse freehand for precision and visibility.' },
            { letter: 'B', text: 'Reverse freehand - hand turned toward you, edge up', feedback: 'CORRECT. Reverse freehand provides the angle and control needed for the upper lip and chin areas.' },
            { letter: 'C', text: 'Reverse backhand - palm up, elbow down', feedback: 'DANGEROUS. Reverse backhand is for SIDES OF NECK ONLY. Using it on the face is a critical safety error that fails the exam.' },
            { letter: 'D', text: 'Backhand grip - back of hand away', feedback: 'INCORRECT. Backhand is for broader areas like cheeks. It lacks the precision needed for the upper lip.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ==========================================
    // SECTION 9.7: THERMAL SAFETY SCENARIO
    // ==========================================
    {
      type: 'scenarioBlock',
      id: 'thermal-safety-scenario',
      title: 'THERMAL SAFETY CHALLENGE',
      subtitle: 'One moment of carelessness with heat can end a career',
      scenarios: [
        {
          situation: 'SHOP CRISIS: You are prepping a Marcel iron for a press-and-curl service. The iron starts smoking slightly. Your client is watching from the chair. What is your FIRST action?',
          options: [
            { letter: 'A', text: 'Use it anyway - a little smoke is normal for hot tools', feedback: 'DANGEROUS. Smoking means the iron is overheating. Using it risks burning the client\'s hair and scalp. Stop immediately.' },
            { letter: 'B', text: 'Test on tissue paper, adjust temperature, explain to client', feedback: 'CORRECT. Test the temperature safely. Adjust down if needed. Professional communication keeps the client calm and informed.' },
            { letter: 'C', text: 'Wipe it off with a towel and continue', feedback: 'INCORRECT. Wiping does not fix overheating. The internal temperature is still too high.' },
            { letter: 'D', text: 'Switch to a different tool without explanation', feedback: 'UNPROFESSIONAL. Clients notice tool changes. Explain briefly: "Let me grab a better tool for your hair type."' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ==========================================
    // SECTION 10: EQUIPMENT & STATION SETUP
    // ==========================================
    {
      type: 'featureGrid',
      id: 'station-setup',
      title: 'THE BARBER STATION',
      subtitle: 'Your command center - every item has a purpose and a place',
      features: [
        {
          icon: 'Armchair',
          title: 'BARBER CHAIR',
          description: 'Hydraulic lift, reclining back, adjustable headrest. Must support client weight safely. Headrest adjusts for neck comfort. Footrest for client stability. Clean and disinfect after every client.',
        },
        {
          icon: 'Lightbulb',
          title: 'STATION LIGHTING',
          description: 'Bright, even LED or fluorescent lighting with minimal shadows. Task lighting at the mirror. Color temperature matters - daylight-balanced (5000K-6500K) shows true hair color.',
        },
        {
          icon: 'Scan',
          title: 'STATION MIRROR',
          description: 'Large enough for full haircut visibility. Clean constantly - smudges and hair obscure your work. Some stations use dual mirrors (front and back) for 360-degree visibility.',
        },
        {
          icon: 'Droplets',
          title: 'HOT TOWEL CABINET',
          description: 'Maintains towels at 160F+ for hot towel services. Essential for straight razor shaves. Sanitize cabinet weekly. Never use a towel that is too hot - test on wrist first.',
        },
        {
          icon: 'Sparkles',
          title: 'BLOWDRYER STATION',
          description: 'Professional dryer with concentrator, diffuser, and pick attachments. Multiple heat settings for different hair types. Always keep moving - stationary heat damages hair. Never use near water.',
        },
        {
          icon: 'Shield',
          title: 'THERMAL TOOL STATION',
          description: 'Marcel irons, pressing combs, curling irons, flat irons. Electric heater or stove for metal tools. Test temperature on tissue before client contact. Heat protectant mandatory.',
        },
      ],
    },

    // ==========================================
    // SECTION 11: ESSENTIAL SUPPLIES CHECKLIST
    // ==========================================
    {
      type: 'checklist',
      id: 'supplies-checklist',
      title: 'ESSENTIAL SUPPLIES CHECKLIST',
      subtitle: 'A master barber is never caught without the essentials',
      items: [
        { text: 'NECK STRIPS - Paper or foam, placed before cape to prevent hair contact with skin' },
        { text: 'BARBER CAPES - Clean, disinfected, properly secured for every client' },
        { text: 'TOWELS - White, plentiful, washed at 160F+, completely dry before use' },
        { text: 'EPA-REGISTERED DISINFECTANT - Hospital grade for tools and surfaces' },
        { text: 'BARBICIDE SOLUTION AND JAR - For immersion disinfection of combs and tools' },
        { text: 'DISPOSABLE GLOVES - Nitrile or latex, changed between clients' },
        { text: 'STYPTIC POWDER/PENCIL - Stops bleeding from minor nicks instantly' },
        { text: 'AFTERSHAVE/ASTRINGENT - Closes pores, sanitizes, refreshes the client' },
        { text: 'STYLING PRODUCTS - Pomade, gel, wax - know what each does and when to use it' },
        { text: 'FIRST AID KIT - Accessible, stocked, checked monthly for expiration dates' },
      ],
    },

    // ==========================================
    // SECTION 12: TOWEL WRAPPING METHODS
    // ==========================================
    {
      type: 'tabbed',
      id: 'towel-methods',
      title: 'TOWEL WRAPPING METHODS',
      subtitle: 'Professional comfort and hygiene standards',
      tabs: [
        {
          id: 'neck-strip-cape',
          label: 'NECK STRIP + CAPE',
          title: 'THE NECK STRIP + CAPE METHOD',
          bullets: [
            { label: 'STEP 1', description: "Place neck strip around client's neck, overlapping in front" },
            { label: 'STEP 2', description: 'Drape cape over neck strip - ensure full coverage' },
            { label: 'STEP 3', description: 'Secure cape closure (snap, velcro, or elastic)' },
            { label: 'STEP 4', description: 'Verify no skin is exposed at neckline' },
          ],
          facts: [
            { text: 'The neck strip is a BARRIER - it prevents hair from touching the client\'s skin and clothing.' },
            { text: 'Never reuse a neck strip. One client, one strip, dispose after service.' },
          ],
        },
        {
          id: 'hot-towel',
          label: 'HOT TOWEL',
          title: 'THE HOT TOWEL WRAP',
          bullets: [
            { label: 'STEP 1', description: 'Heat towel in steamer or hot towel cabinet (160F+)' },
            { label: 'STEP 2', description: 'Test temperature on YOUR WRIST before touching client' },
            { label: 'STEP 3', description: 'Wrap around face/neck for shaves - cover completely' },
            { label: 'STEP 4', description: 'Leave for 2-3 minutes to soften beard hair' },
            { label: 'STEP 5', description: 'Remove and begin shave immediately while hair is soft' },
          ],
          facts: [
            { text: 'NEVER apply a hot towel without testing temperature - burns are serious injuries and liability issues.' },
            { text: 'Hot towels open pores and soften hair - this reduces irritation and allows a closer shave.' },
          ],
        },
        {
          id: 'towel-hygiene',
          label: 'TOWEL HYGIENE',
          title: 'TOWEL HYGIENE STANDARDS',
          bullets: [
            { label: 'FRESH TOWEL', description: 'Use a clean, freshly laundered towel for EVERY client' },
            { label: 'HOT WATER WASH', description: 'Wash at 160F+ with detergent to kill bacteria' },
            { label: 'COMPLETE DRYING', description: 'Dry completely to prevent mildew and bacterial growth' },
            { label: 'CLOSED STORAGE', description: 'Store clean towels in a closed cabinet, never open air' },
            { label: 'REPLACE WORN TOWELS', description: 'Discard towels with stains, tears, or fraying edges' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Towels must be washed in hot water (160F+) to meet sanitation standards.' },
            { text: 'A damp towel is a breeding ground for bacteria - never use a towel that is not completely dry.' },
          ],
        },
      ],
    },

    // ==========================================
    // SECTION 13: TOOL TROUBLESHOOTING SCENARIO
    // ==========================================
    {
      type: 'scenarioBlock',
      id: 'troubleshooting-scenario',
      title: 'TOOL TROUBLESHOOTING CHALLENGE',
      subtitle: 'Your clippers start pulling hair mid-fade. What do you do?',
      scenarios: [
        {
          situation: 'MID-SERVICE CRISIS: You are halfway through a fade when your clippers start pulling hair instead of cutting. The client winces. You have 3 more clients booked today. What is your FIRST action?',
          options: [
            { letter: 'A', text: 'Continue carefully - maybe the client has thick hair', feedback: 'NEVER continue with dull or damaged blades. Pulling hair causes pain, uneven cuts, and damages your reputation. Stop immediately.' },
            { letter: 'B', text: 'Stop, apologize to the client, switch to backup clippers, and replace the blade after the service', feedback: 'CORRECT. Stop immediately to prevent further discomfort. Apologize professionally. Switch to backup clippers to finish the service. Replace the dull blade before your next client.' },
            { letter: 'C', text: 'Oil the blades and continue - they probably just need lubrication', feedback: 'PARTIAL. Oiling helps prevent dullness but does not fix already-dull blades. If blades are pulling, they need replacement, not just oil.' },
            { letter: 'D', text: 'Switch to scissors for the rest of the cut', feedback: 'INCORRECT. Shears cannot replicate clipper work. A fade requires clipper precision. Switching to shears mid-fade produces an uneven, unprofessional result.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ==========================================
    // SECTION 14: BOARD EXAM CRITICAL ALERTS
    // ==========================================
    {
      type: 'contentBlock',
      id: 'board-exam-tools',
      title: 'BOARD EXAM CRITICAL ALERTS',
      content: 'These tool-related concepts appear on EVERY state board exam. Miss them, and you fail.\n\n1. CLIPPER GUARD SIZES: #0 = 1/16in, #1 = 1/8in, #2 = 1/4in, #3 = 3/8in, #4 = 1/2in. Memorize these conversions.\n\n2. SHEAR TENSION TEST: Hold tips up, lift one handle. Blades should open partially. Too loose = hair bends. Too tight = hand fatigue.\n\n3. BLADE MAINTENANCE: Clean after every use, oil before each use, spray disinfectant between clients, replace when dull.\n\n4. STRAIGHT RAZOR SAFETY: Stretch skin taut, minimal pressure, shave with grain first, dispose blades in sharps container.\n\n5. COMB TYPES: All-purpose (sectioning), taper (fades), clipper guards (length control), styling brushes (finishing).\n\n6. SANITATION: EPA-registered disinfectant, Barbicide immersion, 10-minute contact time, clean before disinfecting.\n\n7. TOWEL HYGIENE: Fresh towel per client, wash at 160F+, dry completely, store in closed cabinet.\n\n8. MOTOR TYPES: Magnetic (quiet, light), Rotary (powerful, professional standard), Cordless/Lithium (mobile, consistent power).\n\n9. SHEAR TYPES: Straight (standard), Thinning/Texturizing (removes bulk), Blending (blends clipper lines).\n\n10. NEVER USE DULL TOOLS: Pulling hair = dull blade. Replace immediately. Client comfort is non-negotiable.\n\n11. SHEAR PALMING: Never set shears down mid-cut. Palm them professionally. Transfer to palm, secure with thumb, free your fingers.\n\n12. RAZOR GRIPS: Four grips - freehand (general), backhand (broad areas), reverse freehand (upper lip/chin), reverse backhand (neck only). Know your zones.\n\n13. RAZOR GRINDS: Hollow-ground detects resistance and sings when sharp. Wedge grind powers through coarse beards. Match grind to beard type.\n\n14. THERMAL SAFETY: Test on tissue paper before client contact. Keep tools moving. Never use metal comb on scalp. Heat protectant is mandatory.\n\n15. TOOL CONSTRUCTION: Forged shears are denser and stronger than cast. Look for the weld line - it proves forged construction.',
      highlight: 'MEMORIZE THESE 15 POINTS',
    },

    // ==========================================
    // SECTION 15: FINAL CRAFTSMAN PLEDGE
    // ==========================================
    {
      type: 'quote',
      id: 'craftsman-pledge',
      quote: 'I pledge to respect my tools as the instruments of my craft. I will clean them after every use, maintain them with discipline, and replace them when they fail. I will never subject a client to a dull blade or a dirty comb. I understand that my tools are an extension of my hands, my reputation, and my professionalism. A master barber keeps master tools.',
    },
  ],
}
