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
}
