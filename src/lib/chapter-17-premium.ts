// Chapter 17: Chemical Texture Services — PREMIUM IMMERSIVE EXPERIENCE
// THE TEXTURE LAB — Where science, structure, and client confidence meet

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// TEXTURE LAB THEME — Deep Teal & Amber
// Feels like: A controlled chemistry environment focused on transformation
// ═══════════════════════════════════════════════

export const chapter17PremiumTheme: ChapterTheme = {
  primary: '#4DB6AC',
  primaryLight: '#80CBC4',
  primaryDark: '#00695C',
  secondary: '#D4AF37',
  background: 'rgba(20, 26, 26, 0.95)',
  backgroundAlt: 'rgba(30, 38, 38, 0.9)',
  surface: '#181F1F',
  border: 'rgba(77, 182, 172, 0.25)',
  text: '#F0F5F4',
  textMuted: '#A8B5B3',
  highlight: '#80CBC4',
  timeline: {
    line: 'rgba(77, 182, 172, 0.35)',
    iconBg: '#1E2626',
    iconBorder: '#4DB6AC',
  },
  quote: {
    border: 'rgba(77, 182, 172, 0.4)',
    icon: 'rgba(77, 182, 172, 0.3)',
    bg: 'rgba(20, 26, 26, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(77, 182, 172, 0.15)',
    activeBorder: 'rgba(77, 182, 172, 0.5)',
    activeText: '#80CBC4',
    inactiveBg: 'rgba(20, 26, 26, 0.7)',
    inactiveBorder: 'rgba(77, 182, 172, 0.12)',
    inactiveText: '#A8B5B3',
    panelBg: 'rgba(20, 26, 26, 0.85)',
    panelBorder: 'rgba(77, 182, 172, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(77, 182, 172, 0.1)',
    headerText: '#80CBC4',
    dot: 'rgba(77, 182, 172, 0.6)',
    line: 'rgba(77, 182, 172, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(77, 182, 172, 0.15)',
    iconColor: '#4DB6AC',
    cardBorder: 'rgba(77, 182, 172, 0.2)',
  },
  milestone: {
    yearColor: '#4DB6AC',
    border: 'rgba(77, 182, 172, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(77, 182, 172, 0.4)',
    checkColor: '#4DB6AC',
    bg: 'rgba(20, 26, 26, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(20, 26, 26, 0.7)',
    border: 'rgba(77, 182, 172, 0.18)',
    highlightColor: '#80CBC4',
  },
  challengeCard: {
    badgeBg: 'rgba(212, 175, 55, 0.15)',
    badgeText: '#D4AF37',
    cardBorder: 'rgba(77, 182, 172, 0.22)',
    completedBg: 'rgba(34, 197, 94, 0.1)',
    completedBorder: 'rgba(34, 197, 94, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(212, 175, 55, 0.06)',
    optionBorder: 'rgba(77, 182, 172, 0.18)',
    correctBg: 'rgba(34, 197, 94, 0.1)',
    incorrectBg: 'rgba(239, 68, 68, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(77, 182, 172, 0.15)',
    levelBadgeText: '#80CBC4',
    rewardBg: 'rgba(34, 197, 94, 0.1)',
    rewardText: '#22C55E',
  },
  actionPrompt: {
    cardBorder: 'rgba(77, 182, 172, 0.18)',
    completedBorder: 'rgba(34, 197, 94, 0.3)',
    benefitBg: 'rgba(77, 182, 172, 0.08)',
    benefitBorder: 'rgba(77, 182, 172, 0.25)',
  },
}

// ═══════════════════════════════════════════════
// CHAPTER 17 PREMIUM CONTENT
// ═══════════════════════════════════════════════

export const chapter17PremiumContent: ChapterContent = {
  chapterNumber: 17,
  title: 'Chemical Texture Services',
  subtitle: 'Permanent waves, relaxers, and curl reformation',
  theme: chapter17PremiumTheme,
  sections: [
    {
      type: 'infoCards',
      id: 'why-study',
      title: 'Why Study Chemical Texture Services?',
      cards: [
        {
          icon: 'Sparkles',
          title: 'Expand Your Services',
          text: 'Adding waves, curls, straightening, and softening services gives clients more reasons to choose your chair.',
        },
        {
          icon: 'TrendingUp',
          title: 'Increase Income',
          text: 'Chemical texture services are premium appointments that command higher prices and regular maintenance visits.',
        },
        {
          icon: 'HeartHandshake',
          title: 'Build Loyalty',
          text: 'When you transform texture safely and predictably, clients trust you with their ongoing hair health.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Prevent Damage',
          text: 'Strong analysis and precise technique protect hair integrity and prevent costly mistakes.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'what-is-texture',
      title: 'What Chemical Texture Services Do',
      content:
        'Chemical texture services permanently change the natural wave pattern of hair. They do this by breaking the disulfide bonds inside the cortex, reshaping the hair, and then rebuilding those bonds in the new shape. The three main service categories are permanent waves (add curl), chemical relaxers (remove curl), and curl reformation (loosen and reset curl pattern).',
      highlight: 'All chemical texture services work on the same bond type — the disulfide bond in the cortex.',
    },
    {
      type: 'featureGrid',
      id: 'vocabulary-anchors',
      title: 'Key Terms, Pronunciation & Memory Hooks',
      subtitle: 'Lock in the language the board expects',
      features: [
        {
          icon: 'BookOpen',
          title: 'Disulfide bond (dy-SUL-fyed)',
          description: 'Memory hook: "Sulfur pairs" — disulfide bonds are sulfur-sulfur bridges that hold hair shape.',
        },
        {
          icon: 'BookOpen',
          title: 'Croquignole (CROAK-in-yole)',
          description: 'Memory hook: "Croak-in-yo-lap" — the hair overlaps from ends toward the scalp.',
        },
        {
          icon: 'BookOpen',
          title: 'Porosity (por-AH-si-tee)',
          description: 'Memory hook: "Porous like a sponge" — high porosity soaks up product fast.',
        },
        {
          icon: 'BookOpen',
          title: 'Neutralization',
          description: 'Memory hook: "Neutral = normal again" — it rebuilds bonds so hair holds its new shape.',
        },
      ],
    },

    {
      type: 'tabbed',
      id: 'hair-analysis',
      title: 'Client Consultation & Hair Analysis',
      tabs: [
        {
          id: 'hair-type',
          label: 'Texture',
          title: 'Texture (Diameter)',
          bullets: [
            { label: 'Fine', description: 'Fragile; processes quickly and is easily overprocessed.' },
            { label: 'Medium', description: 'Normal strength; generally predictable processing.' },
            { label: 'Coarse', description: 'Strong and resistant; often needs longer processing or stronger solution.' },
          ],
        },
        {
          id: 'porosity',
          label: 'Porosity',
          title: 'Porosity — The #1 Processing Factor',
          bullets: [
            { label: 'Resistant', description: 'Tight cuticle; solution takes longer to penetrate.' },
            { label: 'Normal', description: 'Processes according to manufacturer guidelines.' },
            { label: 'Porous', description: 'Raised cuticle; absorbs quickly and risks overprocessing.' },
          ],
        },
        {
          id: 'elasticity',
          label: 'Elasticity',
          title: 'Elasticity',
          bullets: [
            { label: 'Normal', description: 'Stretches and returns to original length; healthy.' },
            { label: 'Low', description: 'Does not stretch or return well; may be damaged.' },
          ],
        },
        {
          id: 'density',
          label: 'Density',
          title: 'Density',
          bullets: [
            { label: 'Thin', description: 'Fewer hairs per square inch; smaller sections may be needed.' },
            { label: 'Medium', description: 'Average coverage; standard sectioning.' },
            { label: 'Thick', description: 'More hair; smaller subsections for complete saturation.' },
          ],
        },
        {
          id: 'scalp-skin',
          label: 'Scalp & Skin',
          title: 'Scalp & Skin Condition',
          bullets: [
            { label: 'Healthy', description: 'No signs of irritation, abrasion, or disease.' },
            { label: 'Contraindicated', description: 'Abrasions, infections, or disorders require postponing service.' },
          ],
        },
        {
          id: 'history',
          label: 'History',
          title: 'Service History',
          bullets: [
            { label: 'Previous chemical services', description: 'Hydroxide and thio products are not compatible.' },
            { label: 'Medications', description: 'Some drugs affect hair strength and reaction.' },
            { label: 'Home care', description: 'Color, bleach, or heat damage changes processing.' },
          ],
        },
      ],
    },
    {
      type: 'featureGrid',
      id: 'bond-science',
      title: 'The Science: Disulfide Bonds',
      features: [
        {
          icon: 'Unlink',
          title: 'Reduction Phase',
          description:
            'An alkaline or thio-based solution swells the cuticle and breaks disulfide bonds, turning cystine into cysteine.',
        },
        {
          icon: 'Move',
          title: 'Rearrangement Phase',
          description:
            'Hair is wrapped around rods or combed straight, positioning it in the desired new shape.',
        },
        {
          icon: 'Link',
          title: 'Oxidation Phase',
          description:
            'Neutralizer rebuilds the disulfide bonds in the new shape, locking in the curl or straight pattern.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Why This Matters',
          description:
            'If bonds are broken too long or not rebuilt correctly, hair becomes weak, frizzy, or loses its new shape.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'tools-materials',
      title: 'Tools & Materials for Chemical Texture Services',
      content:
        'Every texture service depends on having the right supplies ready before you start: protective gloves, cape and neck strip, sectioning clips, tail comb, perm rods in several sizes, end papers, waving or relaxing solution, neutralizer, timer, spray bottle, towels, and a basin for rinsing. For relaxers you also need a protective base cream (if using a base relaxer), applicator brush, and plastic cap. For curl reformation you need both relaxer and perm rods. Missing one item mid-service can lead to rushed timing, uneven saturation, or client injury.',
      highlight: 'Set up your station completely before the client sits down.',
    },

    {
      type: 'tabbed',
      id: 'perm-waves',
      title: 'Permanent Waves',
      tabs: [
        {
          id: 'perm-rods',
          label: 'Rods',
          title: 'Perm Rod Types',
          bullets: [
            { label: 'Concave', description: 'Most common; tighter curl in the center.' },
            { label: 'Straight', description: 'Creates a more uniform curl from base to end.' },
            { label: 'Diameter', description: 'Smaller rods produce tighter curls; larger rods produce looser waves.' },
          ],
        },
        {
          id: 'wrapping',
          label: 'Wrapping',
          title: 'Wrapping Techniques',
          bullets: [
            { label: 'Croquignole', description: 'Hair wrapped from ends to scalp in overlapping layers.' },
            { label: 'Spiral', description: 'Hair wrapped vertically down the rod for a corkscrew effect.' },
            { label: 'Piggyback', description: 'Two rods stacked on one section for very long or dense hair.' },
          ],
        },
        {
          id: 'rod-placement',
          label: 'Placement',
          title: 'Rod Placement',
          bullets: [
            { label: 'On-base', description: 'Hair is stretched 135° from base; creates tight curl and fullness.' },
            { label: 'Half off-base', description: 'Hair is stretched 90°; creates moderate lift and curl.' },
            { label: 'Off-base', description: 'Hair is wrapped with little tension; creates natural curl with less volume.' },
          ],
        },
        {
          id: 'perm-types',
          label: 'Solutions',
          title: 'Permanent Wave Solutions',
          bullets: [
            { label: 'Alkaline (cold)', description: 'pH 9.0–9.6; strong, fast action at room temperature.' },
            { label: 'True acid', description: 'pH 4.5–7.0; gentler curl, usually requires heat.' },
            { label: 'Exothermic', description: 'Generates its own heat when mixed for stronger activation.' },
          ],
        },
      ],
    },
    {
      type: 'milestoneList',
      id: 'perm-procedure',
      title: 'Permanent Wave Procedure Sequence',
      milestones: [
        { year: 'Step 1', title: 'Consult and analyze', description: 'Assess texture, porosity, elasticity, density, scalp condition, and service history.' },
        { year: 'Step 2', title: 'Perform strand tests', description: 'Test a hidden section with the planned solution and timing.' },
        { year: 'Step 3', title: 'Shampoo and section', description: 'Use a clarifying or pre-perm shampoo if directed. Section hair for controlled wrapping.' },
        { year: 'Step 4', title: 'Wrap with end papers', description: 'Choose rod size and wrapping technique based on the desired curl.' },
        { year: 'Step 5', title: 'Apply waving solution', description: 'Saturate every rod evenly and start the timer according to manufacturer directions and hair analysis.' },
        { year: 'Step 6', title: 'Check test curls', description: 'Unwind one rod from at least three areas to evaluate curl formation before rinsing.' },
        { year: 'Step 7', title: 'Rinse thoroughly', description: 'Remove all waving solution before applying neutralizer.' },
        { year: 'Step 8', title: 'Apply neutralizer', description: 'Saturate rods and process for the full recommended time to rebuild bonds.' },
        { year: 'Step 9', title: 'Rinse, remove rods, and condition', description: 'Rinse gently, remove rods carefully, and apply conditioner or aftercare treatment.' },
        { year: 'Step 10', title: 'Style and educate', description: 'Style as desired and give written or verbal aftercare instructions.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'perm-service-check',
      title: 'Permanent Wave Service Check',
      content:
        'Before processing, perform strand tests on representative sections. Process according to manufacturer timing. Check a test curl in at least three areas before rinsing. Underprocessing leaves hair limp; overprocessing causes frizz and breakage. Always rinse thoroughly before applying neutralizer.',
      highlight: 'Neutralization is just as important as the waving solution. Skipping or rushing it causes curl relaxation and damage.',
    },
    {
      type: 'tabbed',
      id: 'relaxers',
      title: 'Chemical Hair Relaxers',
      tabs: [
        {
          id: 'relaxer-types',
          label: 'Types',
          title: 'Two Main Relaxer Types',
          bullets: [
            { label: 'Hydroxide relaxers', description: 'Lye or no-lye formulas with a high pH; very effective straighteners.' },
            { label: 'Thio relaxers', description: 'Ammonium thioglycolate-based; milder and easier to follow with a thio perm.' },
          ],
        },
        {
          id: 'base-application',
          label: 'Base vs No-Base',
          title: 'Base and No-Base Relaxers',
          bullets: [
            { label: 'Base relaxer', description: 'Requires a protective base cream applied to the scalp before the relaxer.' },
            { label: 'No-base relaxer', description: 'Contains protective ingredients; applied directly to the hair, not the scalp.' },
          ],
        },
        {
          id: 'strand-tests',
          label: 'Strand Tests',
          title: 'Three Strand Tests Before Relaxing',
          bullets: [
            { label: 'Porosity test', description: 'Confirms how quickly hair will absorb the product.' },
            { label: 'Elasticity test', description: 'Checks if hair can withstand chemical processing.' },
            { label: 'Texture test', description: 'Determines appropriate relaxer strength.' },
          ],
        },
      ],
    },
    {
      type: 'milestoneList',
      id: 'relaxer-procedure',
      title: 'Chemical Relaxer Procedure Sequence',
      milestones: [
        { year: 'Step 1', title: 'Consult and analyze', description: 'Assess all six hair/scalp characteristics and record service history.' },
        { year: 'Step 2', title: 'Perform strand tests', description: 'Test porosity, elasticity, and texture to choose strength and timing.' },
        { year: 'Step 3', title: 'Protect the client', description: 'Apply cape, neck strip, and petroleum base cream if required.' },
        { year: 'Step 4', title: 'Section the hair', description: 'Use clean, manageable subsections based on density.' },
        { year: 'Step 5', title: 'Apply relaxer', description: 'Begin at the back or most resistant area. Keep product off the skin and scalp unless the product is designed for scalp application.' },
        { year: 'Step 6', title: 'Process and monitor', description: 'Watch the clock and the hair. Do not rely on the client to tell you when it burns.' },
        { year: 'Step 7', title: 'Rinse thoroughly', description: 'Remove all relaxer before conditioning or neutralizing as directed.' },
        { year: 'Step 8', title: 'Condition and detangle', description: 'Use a neutralizing or conditioning shampoo according to manufacturer instructions.' },
        { year: 'Step 9', title: 'Style and educate', description: 'Blow-dry or style and provide home-care instructions.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'relaxer-warning',
      title: 'Relaxer Compatibility Warning',
      content:
        'Hydroxide relaxers are not compatible with thio-based perms or relaxers. Hair treated with hydroxide has been restructured with a different chemistry, and applying a thio product afterward can cause severe damage. Always ask about previous services during consultation.',
      highlight: 'When in doubt, perform a compatibility test on a small strand before full application.',
    },
    {
      type: 'contentBlock',
      id: 'curl-reformation',
      title: 'Chemical Curl Reformation',
      content:
        'Curl reformation loosens tight curl patterns and resets them into a larger, more manageable curl. The three basic steps are: (1) straighten the hair with a thio-based relaxer, (2) wrap the hair on large rods in the desired new curl pattern, and (3) neutralize to lock the new shape. Because the hair is processed twice, precise timing and strand testing are essential.',
      highlight: 'Curl reformation is a two-step chemical service — the hair must be healthy enough to handle both processes.',
    },
    {
      type: 'contentBlock',
      id: 'texturizers',
      title: 'Texturizers & Chemical Blowouts',
      content:
        'Texturizers use a mild relaxer formula to loosen curl rather than fully straighten. They create softer, more manageable curl patterns with less volume. Chemical blowouts relax curl enough to allow easier blow-drying and styling. Both services require the same consultation, strand testing, and safety steps as full relaxers.',
      highlight: 'The line between texturizing and relaxing is the processing time and desired outcome, not the product alone.',
    },
    {
      type: 'contentBlock',
      id: 'compare-chemistries',
      title: 'How the Three Services Are Alike — and Different',
      content:
        'Permanent waves, chemical relaxers, and curl reformation all rely on the same three-stage chemistry: reduce disulfide bonds, reshape the hair, then oxidize to lock the new pattern. The difference is the desired outcome and the tools used. A perm adds curl by wrapping hair on rods. A relaxer removes curl by combing hair straight. Curl reformation combines both: it first relaxes tight curl, then wraps the hair in a new pattern and neutralizes. Perms usually use alkaline or acid solutions; relaxers use hydroxide or thio formulas; curl reformation uses a thio relaxer followed by a perm wrap. Understanding these similarities and differences is what lets you choose the right service and explain it to a client.',
      highlight: 'Same bond. Different shape. Different product family.',
    },
    {
      type: 'checklist',
      id: 'safety-checklist',
      title: 'Safety Checklist',
      items: [
        { text: 'Complete a full consultation and service history.' },
        { text: 'Analyze hair texture, porosity, elasticity, density, scalp condition, and history.' },
        { text: 'Perform required strand and elasticity tests.' },
        { text: 'Choose product strength, rod size, and wrapping method based on analysis.' },
        { text: 'Apply protective base cream when required.' },
        { text: 'Wear gloves and follow manufacturer mixing and timing directions exactly.' },
        { text: 'Process with clean, even saturation and check test curls.' },
        { text: 'Rinse thoroughly before neutralizing.' },
        { text: 'Neutralize for the full recommended time.' },
        { text: 'Condition and advise the client on home care and maintenance.' },
      ],
    },
    {
      type: 'confidenceBuilder',
      id: 'texture-confidence',
      title: 'Client Conversation Confidence Builder',
      subtitle: 'How would you respond in the chair?',
      cards: [
        {
          situation: 'A client says, "Will this perm burn my scalp?"',
          question: 'Which response is most professional?',
          responses: [
            { text: '"It might tingle a little, but burning means we rinse immediately."', isProfessional: true, feedback: 'Correct. You validate the concern, set realistic expectations, and state a clear safety action.' },
            { text: `"Don't worry, it never burns."`, isProfessional: false, feedback: 'Incorrect. Dismissing the concern is unprofessional and untrue; any chemical can irritate if misused.' },
            { text: `"If it burns, that means it's working."`, isProfessional: false, feedback: 'Incorrect. Burning is never a sign that a service is working; it signals potential injury.' },
          ],
          insight: 'Professional answers are honest, brief, and include what you will do if something feels wrong.',
        },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'scenario-1',
      title: 'Real Shop Scenario',
      scenarios: [
        {
          situation:
            'A client wants a tight curl permanent wave. During analysis you notice the hair is fine, porous, and has previously been highlighted. What should you do?',
          options: [
            {
              letter: 'A',
              text: 'Proceed with a standard alkaline perm and process for the full time.',
              feedback: 'Incorrect. Porous, highlighted hair is fragile and can overprocess quickly.',
            },
            {
              letter: 'B',
              text: 'Recommend a milder acid perm, perform strand tests, and use a weaker solution with shorter processing.',
              feedback: 'Correct. The service must be adjusted to the hair condition to avoid breakage.',
            },
            {
              letter: 'C',
              text: 'Tell the client a perm is impossible and refuse all texture services.',
              feedback: 'Incorrect. A perm may still be possible with the right product and caution; analysis guides the decision.',
            },
          ],
          correctAnswer: 'B',
        },
      ],
    },
    {
      type: 'challengeCard',
      id: 'try-this',
      title: 'Try This',
      challenges: [
        {
          badge: 'Quick Win',
          title: 'Practice Rod Placement',
          description: 'On a mannequin, wrap three sections using on-base, half off-base, and off-base placement.',
          action: 'Compare the tension and curl result of each placement.',
          difficulty: 'easy',
        },
        {
          badge: 'Board Ready',
          title: 'Map the Service Flow',
          description: 'Write the correct order of a permanent wave service from consultation to neutralization.',
          action: 'Time yourself to recall it in under 60 seconds.',
          difficulty: 'medium',
        },
        {
          badge: 'Pro Level',
          title: 'Strand Test Drill',
          description: 'Explain to a partner how porosity, elasticity, and texture affect relaxer selection.',
          action: 'Use your own words and include a safety reason for each test.',
          difficulty: 'medium',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'common-mistakes',
      title: 'Common Mistakes to Avoid',
      content:
        'Skipping the strand test, ignoring previous chemical services, applying relaxer to damaged scalp, using rods that are too large or too small for the desired curl, and rinsing before neutralizing properly are the most common reasons texture services fail. Always treat timing as a range based on hair condition, not a fixed number.',
      highlight: 'One rushed step in a texture service can turn a loyal client into a corrective color appointment — or worse, a trip to the doctor.',
    },
    {
      type: 'contentBlock',
      id: 'memory-tricks',
      title: 'Memory Tricks',
      content:
        'Remember the texture service cycle with R-R-O: **Reduce** the bonds, **Reshape** the hair, **Oxidize** to lock. For rod placement, think “ON the head = ON the base” (most tension, fullest curl). For relaxers, “Base = Barrier” (you add a protective base cream).',
      highlight: 'R-R-O: Reduce → Reshape → Oxidize.',
    },
    {
      type: 'proTip',
      id: 'instructor-tips',
      title: '💎 Instructor Notes & Remediation',
      subtitle: 'Teaching chemical texture services with confidence',
      items: [
        { category: 'Teaching Priorities', tips: ['Start with the disulfide bond. If students do not understand reduction and oxidation, every service becomes memorization instead of reasoning.', 'Emphasize that porosity controls timing, not just texture.', 'Make consultation and service history non-negotiable habits.'] },
        { category: 'Common Student Misunderstandings', tips: ['Students often think "acid perm" means dangerous acid. Clarify that it is gentler and pH-balanced.', 'Many confuse rod placement with wrapping technique. Use mannequin demos for both.', 'Some believe neutralizer is optional. Stress that it rebuilds bonds and locks the shape.'] },
        { category: 'Discussion Prompts', tips: ['What would you do if a client wants a perm on hair that was relaxed six months ago?', 'How does porosity change your timing plan?', 'Why is the same neutralization step essential for perms and relaxers?'] },
        { category: 'Remediation Steps', tips: ['For struggling students: return to the R-R-O cycle and have them label each step on a diagram.', 'For quiz gaps: use the flashcard deck and re-test with only the missed competency.', 'For practical gaps: require a supervised strand test and rod-placement drill before full service practice.'] },
        { category: 'Quick Checks for Understanding', tips: ['Ask: "Name the six analysis characteristics in order."', 'Ask: "What is the difference between a base and no-base relaxer?"', 'Ask: "Why do we rinse before neutralizing?"'] },
        { category: 'Instructor Pro Tips', tips: ['Demonstrate overprocessing on a swatch so students see the difference between healthy and damaged hair.', 'Keep a "chemistry corner" with pH strips so students can see alkaline vs. acid solutions.', 'Use a timer in class so students learn to respect manufacturer processing windows.'] },
      ],
    },

    {
      type: 'reflectionBlock',
      id: 'texture-reflection',
      title: 'Reflect Before You Practice',
      questions: [
        {
          question: 'Which chemical texture service would you feel most confident performing today, and why?',
          placeholder: 'I feel most confident with... because...',
          insight: 'Confidence should come from understanding the chemistry and the consultation, not just memorizing steps.',
        },
        {
          question: 'What is one safety step you will never skip, no matter how experienced you become?',
          placeholder: 'I will never skip...',
          insight: 'The best barbers protect the client first; speed and convenience never override safety.',
        },
      ],
    },
    {
      type: 'featureGrid',
      id: 'board-alerts',
      title: 'Board Alerts',
      features: [
        {
          icon: 'AlertCircle',
          title: 'Porosity First',
          description: 'Porosity is the primary factor that controls processing time and product penetration.',
        },
        {
          icon: 'AlertCircle',
          title: 'Disulfide Bonds',
          description: 'All texture services permanently alter disulfide bonds in the cortex.',
        },
        {
          icon: 'AlertCircle',
          title: 'Neutralization Is Critical',
          description: 'Incomplete neutralization leaves bonds unstable and causes curl drop or damage.',
        },
        {
          icon: 'AlertCircle',
          title: 'Hydroxide ≠ Thio',
          description: 'Never apply a thio product over hair previously treated with hydroxide relaxer.',
        },
      ],
    },
  ],
  competencies: [
    {
      id: 'CH17-COMP-01',
      title: 'Client Consultation and Hair Analysis',
      description: 'Conduct a thorough consultation and analyze six hair/scalp characteristics before recommending or performing any chemical texture service.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['2', '3'],
      vocabularyIds: ['fc-ch17-006', 'fc-ch17-007', 'fc-ch17-008', 'fc-ch17-009', 'fc-ch17-010', 'fc-ch17-011'],
      flashcardIds: ['fc-ch17-001', 'fc-ch17-006', 'fc-ch17-007', 'fc-ch17-008', 'fc-ch17-009', 'fc-ch17-010', 'fc-ch17-011', 'fc-ch17-036', 'fc-ch17-037', 'fc-ch17-039', 'fc-ch17-040', 'fc-ch17-056', 'fc-ch17-057', 'fc-ch17-059'],
      quizQuestionIds: ['qq-17-001', 'qq-17-002', 'qq-17-003', 'qq-17-004', 'qq-17-005', 'lq-17-001', 'lq-17-006', 'lq-17-007'],
    },
    {
      id: 'CH17-COMP-02',
      title: 'Chemistry of Chemical Texture Services',
      description: 'Explain how disulfide bonds are reduced, reshaped, and oxidized, and compare the chemistry of perms, relaxers, and curl reformation.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['1', '4', '5'],
      vocabularyIds: ['fc-ch17-002', 'fc-ch17-003', 'fc-ch17-004', 'fc-ch17-034'],
      flashcardIds: ['fc-ch17-002', 'fc-ch17-003', 'fc-ch17-004', 'fc-ch17-005', 'fc-ch17-020', 'fc-ch17-021', 'fc-ch17-022', 'fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027', 'fc-ch17-030', 'fc-ch17-034', 'fc-ch17-035', 'fc-ch17-043', 'fc-ch17-046', 'fc-ch17-052', 'fc-ch17-053'],
      quizQuestionIds: ['qq-17-006', 'qq-17-007', 'qq-17-008', 'qq-17-009', 'qq-17-010', 'lq-17-002', 'lq-17-012', 'lq-17-013'],
    },
    {
      id: 'CH17-COMP-03',
      title: 'Permanent Waving Procedures',
      description: 'Select appropriate rods, wrapping techniques, and placement; execute the full perm service from analysis to neutralization.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['6', '7'],
      vocabularyIds: ['fc-ch17-012', 'fc-ch17-013', 'fc-ch17-014', 'fc-ch17-015', 'fc-ch17-016', 'fc-ch17-017', 'fc-ch17-018', 'fc-ch17-019'],
      flashcardIds: ['fc-ch17-012', 'fc-ch17-013', 'fc-ch17-014', 'fc-ch17-015', 'fc-ch17-016', 'fc-ch17-017', 'fc-ch17-018', 'fc-ch17-019', 'fc-ch17-020', 'fc-ch17-021', 'fc-ch17-022', 'fc-ch17-023', 'fc-ch17-024', 'fc-ch17-038', 'fc-ch17-041', 'fc-ch17-042', 'fc-ch17-047', 'fc-ch17-048', 'fc-ch17-055'],
      quizQuestionIds: ['qq-17-011', 'qq-17-012', 'qq-17-013', 'qq-17-014', 'qq-17-015', 'qq-17-016', 'qq-17-017', 'lq-17-003', 'lq-17-004', 'lq-17-008', 'lq-17-011'],
    },
    {
      id: 'CH17-COMP-04',
      title: 'Chemical Relaxing Procedures',
      description: 'Identify relaxer types, choose base vs. no-base application, and perform the full relaxer service safely.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['8', '9'],
      vocabularyIds: ['fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027', 'fc-ch17-028'],
      flashcardIds: ['fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027', 'fc-ch17-028', 'fc-ch17-029', 'fc-ch17-044', 'fc-ch17-045', 'fc-ch17-049', 'fc-ch17-051'],
      quizQuestionIds: ['qq-17-018', 'qq-17-019', 'qq-17-020', 'qq-17-021', 'qq-17-022', 'qq-17-023', 'qq-17-024', 'lq-17-009', 'lq-17-014', 'lq-17-015'],
    },
    {
      id: 'CH17-COMP-05',
      title: 'Curl Reformation Procedures',
      description: 'Explain and perform the three-step curl reformation process while recognizing its higher risk profile.',
      importance: 'high',
      difficulty: 'hard',
      learningObjectives: ['11'],
      vocabularyIds: ['fc-ch17-031'],
      flashcardIds: ['fc-ch17-031', 'fc-ch17-050'],
      quizQuestionIds: ['qq-17-025', 'qq-17-026'],
    },
    {
      id: 'CH17-COMP-06',
      title: 'Safety, Contraindications, and Strand Tests',
      description: 'Recognize contraindications, perform strand and elasticity tests, and apply all required safety precautions.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['10'],
      vocabularyIds: ['fc-ch17-029', 'fc-ch17-036'],
      flashcardIds: ['fc-ch17-029', 'fc-ch17-030', 'fc-ch17-035', 'fc-ch17-036', 'fc-ch17-044', 'fc-ch17-046', 'fc-ch17-052', 'fc-ch17-056', 'fc-ch17-058'],
      quizQuestionIds: ['qq-17-028', 'qq-17-029', 'qq-17-030', 'lq-17-005'],
    },
    {
      id: 'CH17-COMP-07',
      title: 'Texturizers and Chemical Blowouts',
      description: 'Describe the intended outcomes of texturizer and chemical blowout services and how they differ from full relaxers.',
      importance: 'medium',
      difficulty: 'easy',
      learningObjectives: ['12'],
      vocabularyIds: ['fc-ch17-032', 'fc-ch17-033'],
      flashcardIds: ['fc-ch17-032', 'fc-ch17-033', 'fc-ch17-049'],
      quizQuestionIds: ['qq-17-027', 'lq-17-010'],
    },
  ],
  imagePlaceholders: [
    {
      assetId: 'ch17-img-001',
      concept: 'Disulfide bond reduction and oxidation',
      visualType: 'diagram',
      priority: 'critical',
      altText: 'Diagram showing disulfide bonds breaking during reduction and rebuilding during oxidation in the hair cortex.',
      status: 'planned',
    },
    {
      assetId: 'ch17-img-002',
      concept: 'On-base, half off-base, and off-base rod placement',
      visualType: 'illustration',
      priority: 'critical',
      altText: 'Illustration comparing three rod placement angles: 135-degree on-base, 90-degree half off-base, and low-tension off-base.',
      status: 'planned',
    },
    {
      assetId: 'ch17-img-003',
      concept: 'Perm rod sizes and resulting curl types',
      visualType: 'chart',
      priority: 'high',
      altText: 'Chart matching perm rod diameters to curl tightness, from small tight curls to large loose waves.',
      status: 'planned',
    },
    {
      assetId: 'ch17-img-004',
      concept: 'Strand test procedure for relaxer selection',
      visualType: 'illustration',
      priority: 'high',
      altText: 'Illustration showing how to perform porosity, elasticity, and texture strand tests before a relaxer service.',
      status: 'planned',
    },
  ],
}
