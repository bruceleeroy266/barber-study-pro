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
      standardId: 'CH17-L01',
      competencyIds: ['CH17-C01', 'CH17-C02', 'CH17-C07'],
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
          text: 'Chemical texture services can broaden a barber’s service menu, but pricing and maintenance frequency depend on the service, product system, client needs, and business model.',
        },
        {
          icon: 'HeartHandshake',
          title: 'Build Loyalty',
          text: 'Careful consultation, realistic expectations, and safe technique can support long-term client trust.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Prevent Damage',
          text: 'Strong analysis, product-specific directions, and controlled technique help reduce avoidable hair and scalp damage.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'what-is-texture',
      standardId: 'CH17-L02',
      competencyIds: ['CH17-C02'],
      title: 'What Chemical Texture Services Do',
      content:
        'Chemical texture services alter the wave pattern of treated hair through chemical changes within the cortex. Thio-based waving and relaxing services reduce disulfide bonds and later use oxidation to reform bonds in the new shape. Hydroxide relaxers act differently through lanthionization rather than the same reduction-and-oxidation cycle. Common service categories include permanent waving, chemical relaxing, and curl reformation.',
      highlight: 'Chemical texture services affect sulfur-containing bonds in the cortex, but thio and hydroxide product families do not use identical chemistry.'
    },
    {
      type: 'featureGrid',
      id: 'vocabulary-anchors',
      standardId: 'CH17-L03',
      competencyIds: ['CH17-C02', 'CH17-C03', 'CH17-C04'],
      title: 'Key Terms, Pronunciation & Memory Hooks',
      subtitle: 'Lock in the core professional vocabulary'
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
          description: 'Memory hook: "Neutral = stop and stabilize" — in thio/permanent-wave systems, oxidizing neutralizer helps reform disulfide bonds in the new shape.',
        },
      ],
    },

    {
      type: 'tabbed',
      id: 'hair-analysis',
      standardId: 'CH17-L04',
      competencyIds: ['CH17-C01'],
      title: 'Client Consultation & Hair Analysis',
      tabs: [
        {
          id: 'hair-type',
          label: 'Texture',
          title: 'Texture (Diameter)',
          bullets: [
            { label: 'Fine', description: 'May process more quickly and can be more vulnerable to overprocessing; confirm with hair analysis and product directions.' },
            { label: 'Medium', description: 'Normal strength; generally predictable processing.' },
            { label: 'Coarse', description: 'May be more resistant, but processing time and product strength must come from the hair analysis and manufacturer directions rather than diameter alone.' },
          ],
        },
        {
          id: 'porosity',
          label: 'Porosity',
          title: 'Porosity — An Important Processing Factor'
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
            { label: 'Postpone / refer when appropriate', description: 'Do not perform a chemical service over irritated, abraded, or visibly compromised scalp tissue; follow product warnings and refer medical concerns appropriately.' },
          ],
        },
        {
          id: 'history',
          label: 'History',
          title: 'Service History',
          bullets: [
            { label: 'Previous chemical services', description: 'Identify prior relaxers, waving products, lighteners, color, or other chemical services because product families can be incompatible or increase breakage risk.' },
            { label: 'Health / medication concerns', description: 'Ask about relevant health or medication concerns listed in product warnings or disclosed by the client; do not diagnose medication effects, and refer medical questions appropriately.' },
            { label: 'Home care', description: 'Color, bleach, or heat damage changes processing.' },
          ],
        },
      ],
    },
    {
      type: 'featureGrid',
      id: 'bond-science',
      standardId: 'CH17-L05',
      competencyIds: ['CH17-C02'],
      title: 'The Science: Disulfide Bonds',
      features: [
        {
          icon: 'Unlink',
          title: 'Reduction Phase',
          description:
            'In thio-based waving or relaxing systems, the reducing agent breaks disulfide bonds so the hair can be reshaped. Hydroxide relaxers use a different reaction and should not be taught as the same reduction step.',
        },
        {
          icon: 'Move',
          title: 'Rearrangement Phase',
          description:
            'Hair is physically positioned in the intended shape while the selected product system is used according to its directions.'
        },
        {
          icon: 'Link',
          title: 'Oxidation Phase',
          description:
            'For thio/permanent-wave systems, an oxidizing neutralizer helps reform disulfide bonds in the new shape. Hydroxide relaxers instead require thorough removal and the product’s specified post-service neutralizing/pH-restoring steps.'
        },
        {
          icon: 'AlertTriangle',
          title: 'Why This Matters',
          description:
            'Excess processing, incompatible chemistry, incomplete rinsing, or incorrect finishing can weaken the fiber, increase breakage risk, or compromise the intended result.'
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'tools-materials',
      standardId: 'CH17-L06',
      competencyIds: ['CH17-C06'],
      title: 'Tools & Materials for Chemical Texture Services',
      content:
        'Set up the supplies required by the specific service and manufacturer before application begins. Depending on the service, this may include gloves, draping supplies, sectioning tools, rods and end papers, the selected waving or relaxing product, the manufacturer-specified neutralizing or post-service products, timer, towels, and rinsing access. Base cream or other protective products are used only when required by the selected relaxer system and directions.'
      highlight: 'Set up your station completely before the client sits down.',
    },

    {
      type: 'tabbed',
      id: 'perm-waves',
      standardId: 'CH17-L07',
      competencyIds: ['CH17-C03'],
      title: 'Permanent Waves',
      tabs: [
        {
          id: 'perm-rods',
          label: 'Rods',
          title: 'Perm Rod Types',
          bullets: [
            { label: 'Concave', description: 'Produces a curl pattern influenced by its narrower center and larger ends.' },
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
            { label: 'On-base', description: 'Uses elevated placement over the base area and can create more base lift; exact tension and placement should follow the wrapping method being taught.' },
            { label: 'Half off-base', description: 'Uses approximately perpendicular elevation with the rod positioned partly off the base, producing moderate base control.' },
            { label: 'Off-base', description: 'Positions the rod away from the base area to reduce base lift compared with on-base placement.' },
          ],
        },
        {
          id: 'perm-types',
          label: 'Solutions',
          title: 'Permanent Wave Solutions',
          bullets: [
            { label: 'Alkaline waves', description: 'Generally operate at a higher pH than acid-balanced systems and are commonly activated without added heat; use the specific product directions for timing and suitability.' },
            { label: 'Acid / acid-balanced waves', description: 'Operate at a lower pH than alkaline waves; whether added heat is used depends on the specific product system and manufacturer directions.' },
            { label: 'Exothermic', description: 'Generates heat through the product reaction after mixing; follow the product directions for activation, timing, and client suitability.' },
          ],
        },
      ],
    },
    {
      type: 'milestoneList',
      id: 'perm-procedure',
      standardId: 'CH17-L08',
      competencyIds: ['CH17-C03'],
      title: 'Permanent Wave Procedure Sequence',
      milestones: [
        { year: 'Step 1', title: 'Consult and analyze', description: 'Assess texture, porosity, elasticity, density, scalp condition, and service history.' },
        { year: 'Step 2', title: 'Perform required tests', description: 'Complete the strand or preliminary tests required by the selected product and the hair analysis before full application.' },
        { year: 'Step 3', title: 'Shampoo and section', description: 'Use a clarifying or pre-perm shampoo if directed. Section hair for controlled wrapping.' },
        { year: 'Step 4', title: 'Wrap with end papers', description: 'Choose rod size and wrapping technique based on the desired curl.' },
        { year: 'Step 5', title: 'Apply waving solution', description: 'Saturate every rod evenly and start the timer according to manufacturer directions and hair analysis.' },
        { year: 'Step 6', title: 'Check test curls', description: 'Evaluate representative test curls at the intervals and locations directed by the product instructions and service plan before rinsing.' },
        { year: 'Step 7', title: 'Rinse thoroughly', description: 'Remove all waving solution before applying neutralizer.' },
        { year: 'Step 8', title: 'Apply neutralizer', description: 'Apply and process the neutralizer exactly as directed for the selected waving system so oxidation can stabilize the new bond arrangement.' },
        { year: 'Step 9', title: 'Rinse, remove rods, and condition', description: 'Rinse gently, remove rods carefully, and apply conditioner or aftercare treatment.' },
        { year: 'Step 10', title: 'Style and educate', description: 'Style as desired and give written or verbal aftercare instructions.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'perm-service-check',
      standardId: 'CH17-L09',
      competencyIds: ['CH17-C03', 'CH17-C06'],
      title: 'Permanent Wave Service Check',
      content:
        'Complete any strand or preliminary tests required by the selected waving system. Process and check representative test curls according to the manufacturer’s timing and directions. Inadequate processing can produce a weak result, while excessive processing increases damage risk. Rinse the waving solution thoroughly as directed before applying the system’s neutralizer.'
      highlight: 'For permanent-wave systems, correct rinsing and neutralization are essential parts of stabilizing the new curl pattern; follow the product-specific sequence and timing.'
    },
    {
      type: 'tabbed',
      id: 'relaxers',
      standardId: 'CH17-L10',
      competencyIds: ['CH17-C04'],
      title: 'Chemical Hair Relaxers',
      tabs: [
        {
          id: 'relaxer-types',
          label: 'Types',
          title: 'Two Main Relaxer Types',
          bullets: [
            { label: 'Hydroxide relaxers', description: 'Include lye and no-lye hydroxide systems. They straighten through highly alkaline chemistry and lanthionization; follow the specific product directions and compatibility warnings.' },
            { label: 'Thio relaxers', description: 'Use thioglycolate-based reducing chemistry and require the compatible neutralization sequence specified by the product. Do not assume that prior or future chemical services are compatible.' },
          ],
        },
        {
          id: 'base-application',
          label: 'Base vs No-Base',
          title: 'Base and No-Base Relaxers',
          bullets: [
            { label: 'Base relaxer', description: 'Uses a protective base/barrier as directed by that product system before relaxer application.' },
            { label: 'No-base relaxer', description: 'Does not require the same full scalp-base application, but it still does not mean relaxer should be intentionally placed on the scalp; follow the product directions and protect sensitive areas as directed.' },
          ],
        },
        {
          id: 'strand-tests',
          label: 'Strand Tests',
          title: 'Three Strand Tests Before Relaxing',
          bullets: [
            { label: 'Porosity assessment', description: 'Helps evaluate how readily the hair may accept product and whether the fiber appears overly porous or compromised.' },
            { label: 'Elasticity assessment', description: 'Helps evaluate fiber condition and whether the hair shows signs of weakness before chemical processing.' },
            { label: 'Texture / diameter assessment', description: 'Contributes to product and service planning, but product strength and timing must follow the complete hair analysis and manufacturer directions.' },
          ],
        },
      ],
    },
    {
      type: 'milestoneList',
      id: 'relaxer-procedure',
      standardId: 'CH17-L11',
      competencyIds: ['CH17-C04'],
      title: 'Chemical Relaxer Procedure Sequence',
      milestones: [
        { year: 'Step 1', title: 'Consult and analyze', description: 'Assess all six hair/scalp characteristics and record service history.' },
        { year: 'Step 2', title: 'Perform required tests', description: 'Assess porosity, elasticity, texture/diameter, and complete any preliminary tests required by the selected relaxer system before full application.' },
        { year: 'Step 3', title: 'Protect the client', description: 'Use appropriate draping, gloves, and any barrier/base product required by the selected relaxer system.' },
        { year: 'Step 4', title: 'Section the hair', description: 'Use clean, manageable subsections based on density.' },
        { year: 'Step 5', title: 'Apply relaxer', description: 'Follow the manufacturer’s application order and subsection guidance. Avoid unnecessary contact with skin and scalp and apply only where the product directions permit.' },
        { year: 'Step 6', title: 'Process and monitor', description: 'Monitor timing, hair response, and client comfort continuously. Stop and remove product according to safety directions if burning, pain, or other concerning reactions occur.' },
        { year: 'Step 7', title: 'Rinse thoroughly', description: 'Remove the relaxer thoroughly according to product directions before the specified post-service neutralizing, cleansing, or conditioning steps.' },
        { year: 'Step 8', title: 'Complete post-service steps', description: 'Use the manufacturer-specified neutralizing/pH-restoring shampoo, oxidizing neutralizer, conditioner, or other finishing products required for that relaxer chemistry.' },
        { year: 'Step 9', title: 'Style and educate', description: 'Blow-dry or style and provide home-care instructions.' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'relaxer-warning',
      standardId: 'CH17-L12',
      competencyIds: ['CH17-C02', 'CH17-C04', 'CH17-C06'],
      title: 'Relaxer Compatibility Warning',
      content:
        'Hydroxide and thioglycolate product families are chemically incompatible on the same previously treated hair and can create severe breakage risk. Treat prior chemical-service history as a required consultation step and follow the selected manufacturer’s compatibility warnings before any new texture service.'
      highlight: 'A strand test can reveal condition or compatibility concerns, but it does not override a known product-family incompatibility or manufacturer prohibition.'
    },
    {
      type: 'contentBlock',
      id: 'curl-reformation',
      standardId: 'CH17-L13',
      competencyIds: ['CH17-C05'],
      title: 'Chemical Curl Reformation',
      content:
        'Curl reformation uses a compatible thio-based system to reduce or relax the existing curl pattern, reshape the hair on rods, and then oxidatively neutralize it in the new pattern. Because the hair undergoes multiple chemical and physical steps, product-specific compatibility, preliminary testing, timing, and fiber condition are especially important.'
      highlight: 'Do not perform curl reformation unless the hair analysis and the selected product system indicate that the service is appropriate for the hair’s condition and prior chemical history.'
    },
    {
      type: 'contentBlock',
      id: 'texturizers',
      standardId: 'CH17-L14',
      competencyIds: ['CH17-C07'],
      title: 'Texturizers & Chemical Blowouts',
      content:
        'Texturizing services are intended to reduce or loosen curl without necessarily producing full straightening. Products marketed for texturizing or chemical blowout effects can differ in chemistry and directions, so the expected result, processing plan, preliminary testing, and safety steps must be based on the specific product system and the client’s hair history.'
      highlight: 'Do not define a texturizer only by shorter processing time; identify the actual product chemistry, intended result, and manufacturer directions.'
    },
    {
      type: 'contentBlock',
      id: 'compare-chemistries',
      standardId: 'CH17-L15',
      competencyIds: ['CH17-C02'],
      title: 'How the Three Services Are Alike — and Different',
      content:
        'Permanent waving and thio-based relaxing use reducing chemistry that breaks disulfide bonds so the hair can be reshaped, followed by compatible oxidation/neutralization. Hydroxide relaxers also alter sulfur-containing bonds, but they do so through lanthionization and are not completed with the same oxidizing neutralizer cycle. Curl reformation uses a compatible thio-based sequence to relax and then reshape the curl pattern. Product family, prior chemical history, and manufacturer compatibility instructions determine whether a service is appropriate.'
      highlight: 'Related target structure, different chemistry: thio reduction/oxidation and hydroxide lanthionization must not be treated as interchangeable systems.'
    },
    {
      type: 'checklist',
      id: 'safety-checklist',
      standardId: 'CH17-L16',
      competencyIds: ['CH17-C06'],
      title: 'Safety Checklist',
      items: [
        { text: 'Complete a full consultation and service history.' },
        { text: 'Analyze hair texture, porosity, elasticity, density, scalp condition, and history.' },
        { text: 'Perform the preliminary tests required by the selected product and the hair analysis.' },
        { text: 'Choose product strength, rod size, and wrapping method based on analysis.' },
        { text: 'Apply protective base cream when required.' },
        { text: 'Wear gloves and follow the manufacturer’s mixing, application, timing, rinsing, and safety directions.' },
        { text: 'Use even application and perform test-curl or processing checks when required by the selected service.' },
        { text: 'Rinse or remove the processing product in the sequence required by that specific system.' },
        { text: 'Complete the correct neutralizing or pH-restoring step for the product family and required time.' },
        { text: 'Condition and advise the client on home care and maintenance.' },
      ],
    },
    {
      type: 'confidenceBuilder',
      id: 'texture-confidence',
      standardId: 'CH17-L17',
      competencyIds: ['CH17-C01', 'CH17-C06'],
      title: 'Client Conversation Confidence Builder',
      subtitle: 'How would you respond in the chair?',
      cards: [
        {
          situation: 'A client says, "Will this perm burn my scalp?"',
          question: 'Which response is most professional?',
          responses: [
            { text: '"You should not ignore burning or pain. If you feel either, tell me immediately so I can stop and follow the product-removal and safety directions."', isProfessional: true, feedback: 'Correct. The response validates the concern and gives a clear safety action without promising that irritation cannot occur.' },
            { text: `"Don't worry, it never burns."`, isProfessional: false, feedback: 'Incorrect. A chemical-service professional should not promise that irritation or a reaction cannot occur.' },
            { text: `"If it burns, that means it's working."`, isProfessional: false, feedback: 'Incorrect. Burning or pain is a warning sign to stop and follow product-removal and safety directions.' },
          ],
          insight: 'Professional answers are honest, brief, and include what you will do if something feels wrong.',
        },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'scenario-1',
      standardId: 'CH17-L18',
      competencyIds: ['CH17-C01', 'CH17-C02', 'CH17-C03'],
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
              text: 'Pause the full service, complete the required compatibility/strand testing, and choose only a waving system and processing plan that the manufacturer directions and hair analysis support for previously highlighted, porous hair.',
              feedback: 'Correct. Previously lightened, porous hair requires a compatibility and condition check before any waving system or timing plan is selected.'
            },
            {
              letter: 'C',
              text: 'Guarantee that no perm can ever be performed on highlighted hair without checking the hair or product system.'
              feedback: 'Incorrect. Do not make a universal guarantee either way; compatibility, fiber condition, and the selected product directions determine whether the service should proceed.'
            },
          ],
          correctAnswer: 'B',
        },
      ],
    },
    {
      type: 'challengeCard',
      id: 'try-this',
      standardId: 'CH17-L19',
      competencyIds: ['CH17-C03', 'CH17-C04', 'CH17-C06'],
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
          badge: 'Sequence Drill',
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
      standardId: 'CH17-L20',
      competencyIds: ['CH17-C06'],
      title: 'Common Mistakes to Avoid',
      content:
        'Common preventable problems include skipping required preliminary testing, ignoring previous chemical services, applying chemical products over irritated or compromised scalp tissue, choosing tools that do not match the intended result, and failing to follow the correct rinsing or neutralizing sequence. Timing must come from the selected product directions and the ongoing hair analysis rather than a memorized universal number.'
      highlight: 'Chemical texture services require controlled timing, compatibility checks, and immediate attention to client discomfort because errors can cause hair breakage or scalp injury.'
    },
    {
      type: 'contentBlock',
      id: 'memory-tricks',
      standardId: 'CH17-L21',
      competencyIds: ['CH17-C02', 'CH17-C03', 'CH17-C04'],
      title: 'Memory Tricks',
      content:
        'For thio/permanent-wave chemistry, remember R-R-O: **Reduce** disulfide bonds, **Reshape** the hair, **Oxidize** to stabilize the new pattern. Do not apply that mnemonic to hydroxide relaxers, which use lanthionization rather than the same oxidation cycle. For base relaxer systems, “Base = Barrier” can help you remember the protective barrier step when that product requires it.'
      highlight: 'R-R-O applies to thio/permanent-wave chemistry; hydroxide relaxers follow a different chemical pathway.'
    },
    {
      type: 'proTip',
      id: 'instructor-tips',
      standardId: 'CH17-L22',
      competencyIds: ['CH17-C01', 'CH17-C02', 'CH17-C03', 'CH17-C04', 'CH17-C05', 'CH17-C06', 'CH17-C07'],
      title: '💎 Instructor Notes & Remediation',
      subtitle: 'Teaching chemical texture services with confidence',
      items: [
        { category: 'Teaching Priorities', tips: ['Start with the disulfide bond, then distinguish thio reduction/oxidation from hydroxide lanthionization.', 'Teach students to combine porosity, texture/diameter, elasticity, previous services, and manufacturer directions when planning processing.', 'Make consultation and chemical-service history non-negotiable habits.'] },
        { category: 'Common Student Misunderstandings', tips: ['Students may treat all permanent-wave products as chemically identical; compare product families and directions instead of relying on one pH rule.', 'Many confuse rod placement with wrapping technique. Use mannequin demos for both.', 'Students may incorrectly apply oxidizing-neutralizer logic to hydroxide relaxers; distinguish the required finishing step for each chemistry.'] },
        { category: 'Discussion Prompts', tips: ['What compatibility questions must you resolve if a client wants a perm after a previous relaxer?', 'How should porosity influence your testing and product-direction review?', 'How do thio neutralization and hydroxide post-service pH-restoring steps differ?'] },
        { category: 'Remediation Steps', tips: ['For struggling students: diagram the thio R-R-O cycle beside the hydroxide lanthionization pathway so they do not merge the two chemistries.', 'For quiz gaps: use the flashcard deck and re-test with only the missed competency.', 'For practical gaps: require supervised preliminary testing and rod-placement practice before full-service work.'] },
        { category: 'Quick Checks for Understanding', tips: ['Ask: "Which hair/scalp and service-history factors must you analyze before choosing a chemical texture service?"', 'Ask: "What is the difference between a base and no-base relaxer?"', 'Ask: "Why must thio and hydroxide finishing steps be taught separately?"'] },
        { category: 'Instructor Pro Tips', tips: ['Demonstrate overprocessing on a swatch so students see the difference between healthy and damaged hair.', 'Keep a "chemistry corner" with pH strips so students can see alkaline vs. acid solutions.', 'Use a timer in class so students learn to respect manufacturer processing windows.'] },
      ],
    },

    {
      type: 'reflectionBlock',
      id: 'texture-reflection',
      standardId: 'CH17-L23',
      competencyIds: ['CH17-C01', 'CH17-C02', 'CH17-C03', 'CH17-C04', 'CH17-C05', 'CH17-C06', 'CH17-C07'],
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
      standardId: 'CH17-L24',
      competencyIds: ['CH17-C02', 'CH17-C03', 'CH17-C04', 'CH17-C06'],
      title: 'Safety & Chemistry Checkpoints'
      features: [
        {
          icon: 'AlertCircle',
          title: 'Analyze Before Processing',
          description: 'Porosity is one important factor in product penetration and processing decisions; use the complete hair analysis and manufacturer directions.'
        },
        {
          icon: 'AlertCircle',
          title: 'Know the Chemistry',
          description: 'Thio services use reduction and oxidation of disulfide bonds, while hydroxide relaxers alter sulfur-containing bonds through lanthionization.'
        },
        {
          icon: 'AlertCircle',
          title: 'Finish the Correct System',
          description: 'Use the correct neutralizing or pH-restoring sequence for the selected product family; do not treat thio and hydroxide finishing steps as interchangeable.'
        },
        {
          icon: 'AlertCircle',
          title: 'Hydroxide ≠ Thio',
          description: 'Treat hydroxide- and thioglycolate-treated hair as chemically incompatible unless verified product-system guidance explicitly supports the planned service.'
        },
      ],
    },
  ],
  competencies: [
    {
      id: 'CH17-C01',
      standardId: 'CH17-C01',
      legacyId: 'CH17-COMP-01',
      title: 'Client Consultation and Hair Analysis',
      description: 'Conduct a thorough consultation and analyze six hair/scalp characteristics before recommending or performing any chemical texture service.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH17-LO02', 'CH17-LO03'],
      vocabularyIds: ['fc-ch17-006', 'fc-ch17-007', 'fc-ch17-008', 'fc-ch17-009', 'fc-ch17-010', 'fc-ch17-011'],
      flashcardIds: ['fc-ch17-001', 'fc-ch17-006', 'fc-ch17-007', 'fc-ch17-008', 'fc-ch17-009', 'fc-ch17-010', 'fc-ch17-011', 'fc-ch17-036', 'fc-ch17-037', 'fc-ch17-039', 'fc-ch17-040', 'fc-ch17-056', 'fc-ch17-057', 'fc-ch17-059'],
      quizQuestionIds: ['qq-17-001', 'qq-17-002', 'qq-17-003', 'qq-17-004', 'qq-17-005', 'lq-17-001', 'lq-17-006', 'lq-17-007'],
    },
    {
      id: 'CH17-C02',
      standardId: 'CH17-C02',
      legacyId: 'CH17-COMP-02',
      title: 'Chemistry of Chemical Texture Services',
      description: 'Explain how disulfide bonds are reduced, reshaped, and oxidized, and compare the chemistry of perms, relaxers, and curl reformation.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH17-LO01', 'CH17-LO04', 'CH17-LO05'],
      vocabularyIds: ['fc-ch17-002', 'fc-ch17-003', 'fc-ch17-004', 'fc-ch17-034'],
      flashcardIds: ['fc-ch17-002', 'fc-ch17-003', 'fc-ch17-004', 'fc-ch17-005', 'fc-ch17-020', 'fc-ch17-021', 'fc-ch17-022', 'fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027', 'fc-ch17-030', 'fc-ch17-034', 'fc-ch17-035', 'fc-ch17-043', 'fc-ch17-046', 'fc-ch17-052', 'fc-ch17-053'],
      quizQuestionIds: ['qq-17-006', 'qq-17-007', 'qq-17-008', 'qq-17-009', 'qq-17-010', 'lq-17-002', 'lq-17-012', 'lq-17-013', 'lq-17-016'],
    },
    {
      id: 'CH17-C03',
      standardId: 'CH17-C03',
      legacyId: 'CH17-COMP-03',
      title: 'Permanent Waving Procedures',
      description: 'Select appropriate rods, wrapping techniques, and placement; execute the full perm service from analysis to neutralization.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH17-LO06', 'CH17-LO07'],
      vocabularyIds: ['fc-ch17-012', 'fc-ch17-013', 'fc-ch17-014', 'fc-ch17-015', 'fc-ch17-016', 'fc-ch17-017', 'fc-ch17-018', 'fc-ch17-019'],
      flashcardIds: ['fc-ch17-012', 'fc-ch17-013', 'fc-ch17-014', 'fc-ch17-015', 'fc-ch17-016', 'fc-ch17-017', 'fc-ch17-018', 'fc-ch17-019', 'fc-ch17-020', 'fc-ch17-021', 'fc-ch17-022', 'fc-ch17-023', 'fc-ch17-024', 'fc-ch17-038', 'fc-ch17-041', 'fc-ch17-042', 'fc-ch17-047', 'fc-ch17-048', 'fc-ch17-055'],
      quizQuestionIds: ['qq-17-011', 'qq-17-012', 'qq-17-013', 'qq-17-014', 'qq-17-015', 'qq-17-016', 'qq-17-017', 'lq-17-003', 'lq-17-004', 'lq-17-008', 'lq-17-011'],
    },
    {
      id: 'CH17-C04',
      standardId: 'CH17-C04',
      legacyId: 'CH17-COMP-04',
      title: 'Chemical Relaxing Procedures',
      description: 'Identify relaxer types, choose base vs. no-base application, and perform the full relaxer service safely.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH17-LO08', 'CH17-LO09'],
      vocabularyIds: ['fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027', 'fc-ch17-028'],
      flashcardIds: ['fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027', 'fc-ch17-028', 'fc-ch17-029', 'fc-ch17-044', 'fc-ch17-045', 'fc-ch17-049', 'fc-ch17-051'],
      quizQuestionIds: ['qq-17-018', 'qq-17-019', 'qq-17-020', 'qq-17-021', 'qq-17-022', 'qq-17-023', 'qq-17-024', 'lq-17-009', 'lq-17-014', 'lq-17-015'],
    },
    {
      id: 'CH17-C05',
      standardId: 'CH17-C05',
      legacyId: 'CH17-COMP-05',
      title: 'Curl Reformation Procedures',
      description: 'Explain and perform the three-step curl reformation process while recognizing its higher risk profile.',
      importance: 'high',
      difficulty: 'hard',
      learningObjectives: ['CH17-LO11'],
      vocabularyIds: ['fc-ch17-031'],
      flashcardIds: ['fc-ch17-031', 'fc-ch17-050'],
      quizQuestionIds: ['qq-17-025', 'qq-17-026'],
    },
    {
      id: 'CH17-C06',
      standardId: 'CH17-C06',
      legacyId: 'CH17-COMP-06',
      title: 'Safety, Contraindications, and Strand Tests',
      description: 'Recognize contraindications, perform strand and elasticity tests, and apply all required safety precautions.',
      importance: 'critical',
      difficulty: 'medium',
      learningObjectives: ['CH17-LO10'],
      vocabularyIds: ['fc-ch17-029', 'fc-ch17-036'],
      flashcardIds: ['fc-ch17-029', 'fc-ch17-030', 'fc-ch17-035', 'fc-ch17-036', 'fc-ch17-044', 'fc-ch17-046', 'fc-ch17-052', 'fc-ch17-056', 'fc-ch17-058'],
      quizQuestionIds: ['qq-17-028', 'qq-17-029', 'qq-17-030', 'lq-17-005'],
    },
    {
      id: 'CH17-C07',
      standardId: 'CH17-C07',
      legacyId: 'CH17-COMP-07',
      title: 'Texturizers and Chemical Blowouts',
      description: 'Describe the intended outcomes of texturizer and chemical blowout services and how they differ from full relaxers.',
      importance: 'medium',
      difficulty: 'easy',
      learningObjectives: ['CH17-LO12'],
      vocabularyIds: ['fc-ch17-032', 'fc-ch17-033'],
      flashcardIds: ['fc-ch17-032', 'fc-ch17-033', 'fc-ch17-049'],
      quizQuestionIds: ['qq-17-027', 'lq-17-010'],
    },
  ],
  learningObjectives: [
    {
      id: 'CH17-LO01',
      standardId: 'CH17-LO01',
      description: 'Describe how permanent waves, relaxers, and curl reformation services change the appearance of the hair.',
      competencyIds: ['CH17-C02'],
      lessonIds: ['what-is-texture', 'compare-chemistries'],
      flashcardIds: ['fc-ch17-001', 'fc-ch17-005'],
      quizQuestionIds: ['lq-17-016'],
    },
    {
      id: 'CH17-LO02',
      standardId: 'CH17-LO02',
      description: 'List topics to discuss during a client consultation.',
      competencyIds: ['CH17-C01'],
      lessonIds: ['hair-analysis', 'scenario-1'],
      flashcardIds: ['fc-ch17-039', 'fc-ch17-040', 'fc-ch17-057', 'fc-ch17-060'],
      quizQuestionIds: ['qq-17-005', 'lq-17-006'],
    },
    {
      id: 'CH17-LO03',
      standardId: 'CH17-LO03',
      description: 'Identify six characteristics of the hair and scalp that are analyzed before performing chemical texture services.',
      competencyIds: ['CH17-C01'],
      lessonIds: ['hair-analysis'],
      flashcardIds: ['fc-ch17-006', 'fc-ch17-007', 'fc-ch17-008', 'fc-ch17-009', 'fc-ch17-010', 'fc-ch17-011', 'fc-ch17-037'],
      quizQuestionIds: ['qq-17-001', 'qq-17-004', 'lq-17-001'],
    },
    {
      id: 'CH17-LO04',
      standardId: 'CH17-LO04',
      description: 'Describe how the ingredients in permanent waves, relaxers, and curl reformation services are chemically similar and chemically different from each other.',
      competencyIds: ['CH17-C02'],
      lessonIds: ['what-is-texture', 'bond-science', 'compare-chemistries'],
      flashcardIds: ['fc-ch17-002', 'fc-ch17-003', 'fc-ch17-004', 'fc-ch17-005', 'fc-ch17-020', 'fc-ch17-025', 'fc-ch17-031'],
      quizQuestionIds: ['lq-17-016'],
    },
    {
      id: 'CH17-LO05',
      standardId: 'CH17-LO05',
      description: 'Explain the physical and chemical actions of permanent waving, chemical relaxing, and curl reformation processes.',
      competencyIds: ['CH17-C02'],
      lessonIds: ['bond-science', 'perm-procedure', 'relaxer-procedure', 'curl-reformation'],
      flashcardIds: ['fc-ch17-002', 'fc-ch17-003', 'fc-ch17-004', 'fc-ch17-034', 'fc-ch17-035', 'fc-ch17-050', 'fc-ch17-053'],
      quizQuestionIds: ['qq-17-006', 'qq-17-007', 'qq-17-008', 'qq-17-029', 'lq-17-002'],
    },
    {
      id: 'CH17-LO06',
      standardId: 'CH17-LO06',
      description: 'Identify types of perm rods and end wrapping techniques.',
      competencyIds: ['CH17-C03'],
      lessonIds: ['perm-waves'],
      flashcardIds: ['fc-ch17-012', 'fc-ch17-013', 'fc-ch17-014', 'fc-ch17-015', 'fc-ch17-016', 'fc-ch17-041'],
      quizQuestionIds: ['qq-17-012', 'qq-17-013', 'qq-17-014', 'lq-17-004', 'lq-17-008'],
    },
    {
      id: 'CH17-LO07',
      standardId: 'CH17-LO07',
      description: 'Define on-base, half off-base, and off-base rod placement.',
      competencyIds: ['CH17-C03'],
      lessonIds: ['perm-waves'],
      flashcardIds: ['fc-ch17-017', 'fc-ch17-018', 'fc-ch17-019', 'fc-ch17-042'],
      quizQuestionIds: ['qq-17-011', 'lq-17-003'],
    },
    {
      id: 'CH17-LO08',
      standardId: 'CH17-LO08',
      description: 'Identify two types of chemical relaxers.',
      competencyIds: ['CH17-C04'],
      lessonIds: ['relaxers'],
      flashcardIds: ['fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027', 'fc-ch17-043'],
      quizQuestionIds: ['qq-17-018', 'qq-17-024', 'lq-17-009'],
    },
    {
      id: 'CH17-LO09',
      standardId: 'CH17-LO09',
      description: 'Explain the difference between base and no-base relaxers.',
      competencyIds: ['CH17-C04'],
      lessonIds: ['relaxers'],
      flashcardIds: ['fc-ch17-028', 'fc-ch17-051'],
      quizQuestionIds: ['qq-17-019', 'lq-17-009'],
    },
    {
      id: 'CH17-LO10',
      standardId: 'CH17-LO10',
      description: 'List three strand tests to be performed before a chemical relaxing process.',
      competencyIds: ['CH17-C06'],
      lessonIds: ['relaxers', 'safety-checklist'],
      flashcardIds: ['fc-ch17-029', 'fc-ch17-030'],
      quizQuestionIds: ['qq-17-020', 'qq-17-021', 'lq-17-005', 'lq-17-007'],
    },
    {
      id: 'CH17-LO11',
      standardId: 'CH17-LO11',
      description: 'Explain the three steps of a curl reformation process.',
      competencyIds: ['CH17-C05'],
      lessonIds: ['curl-reformation'],
      flashcardIds: ['fc-ch17-031', 'fc-ch17-050'],
      quizQuestionIds: ['qq-17-025', 'qq-17-026'],
    },
    {
      id: 'CH17-LO12',
      standardId: 'CH17-LO12',
      description: 'Describe the intended outcomes of texturizer and chemical blowout services.',
      competencyIds: ['CH17-C07'],
      lessonIds: ['texturizers'],
      flashcardIds: ['fc-ch17-032', 'fc-ch17-033', 'fc-ch17-049'],
      quizQuestionIds: ['qq-17-027', 'lq-17-010'],
    },
  ],
  remediation: [
    {
      id: 'CH17-R01',
      standardId: 'CH17-R01',
      competencyId: 'CH17-C01',
      lessonIds: ['why-study', 'hair-analysis', 'scenario-1', 'texture-confidence'],
      flashcardIds: ['fc-ch17-001', 'fc-ch17-006', 'fc-ch17-007', 'fc-ch17-008', 'fc-ch17-009', 'fc-ch17-010', 'fc-ch17-011', 'fc-ch17-039', 'fc-ch17-040'],
      vocabularyIds: ['texture', 'porosity', 'elasticity', 'density', 'scalp-condition', 'service-history'],
      learningQuestionIds: ['lq-17-001', 'lq-17-006', 'lq-17-007'],
      boardQuestionIds: ['qq-17-001', 'qq-17-002', 'qq-17-003', 'qq-17-004', 'qq-17-005'],
      instructorNote: 'Return to the six-analysis checklist. Have the student practice a mock consultation and explain why each characteristic affects product selection.',
      retakeCount: 3,
    },
    {
      id: 'CH17-R02',
      standardId: 'CH17-R02',
      competencyId: 'CH17-C02',
      lessonIds: ['what-is-texture', 'bond-science', 'compare-chemistries', 'memory-tricks'],
      flashcardIds: ['fc-ch17-002', 'fc-ch17-003', 'fc-ch17-004', 'fc-ch17-005', 'fc-ch17-020', 'fc-ch17-021', 'fc-ch17-022', 'fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027'],
      vocabularyIds: ['disulfide-bond', 'reduction', 'oxidation', 'neutralization'],
      learningQuestionIds: ['lq-17-002', 'lq-17-012', 'lq-17-013', 'lq-17-016'],
      boardQuestionIds: ['qq-17-006', 'qq-17-007', 'qq-17-008', 'qq-17-009', 'qq-17-010', 'qq-17-029'],
      instructorNote: 'Use the R-R-O mnemonic and draw the bond cycle. Compare alkaline, acid, hydroxide, and thio chemistries side-by-side.',
      retakeCount: 3,
    },
    {
      id: 'CH17-R03',
      standardId: 'CH17-R03',
      competencyId: 'CH17-C03',
      lessonIds: ['perm-waves', 'perm-procedure', 'perm-service-check'],
      flashcardIds: ['fc-ch17-012', 'fc-ch17-013', 'fc-ch17-014', 'fc-ch17-015', 'fc-ch17-016', 'fc-ch17-017', 'fc-ch17-018', 'fc-ch17-019', 'fc-ch17-020', 'fc-ch17-023', 'fc-ch17-024', 'fc-ch17-038'],
      vocabularyIds: ['concave-rod', 'straight-rod', 'croquignole', 'spiral', 'piggyback', 'on-base', 'half-off-base', 'off-base'],
      learningQuestionIds: ['lq-17-003', 'lq-17-004', 'lq-17-008', 'lq-17-011'],
      boardQuestionIds: ['qq-17-011', 'qq-17-012', 'qq-17-013', 'qq-17-014', 'qq-17-015', 'qq-17-016', 'qq-17-017'],
      instructorNote: 'Have the student demonstrate rod placement on a mannequin and verbalize the tension angle for each placement.',
      retakeCount: 3,
    },
    {
      id: 'CH17-R04',
      standardId: 'CH17-R04',
      competencyId: 'CH17-C04',
      lessonIds: ['relaxers', 'relaxer-procedure', 'relaxer-warning'],
      flashcardIds: ['fc-ch17-025', 'fc-ch17-026', 'fc-ch17-027', 'fc-ch17-028', 'fc-ch17-029', 'fc-ch17-044', 'fc-ch17-045', 'fc-ch17-049', 'fc-ch17-051'],
      vocabularyIds: ['hydroxide-relaxer', 'thio-relaxer', 'base-relaxer', 'no-base-relaxer'],
      learningQuestionIds: ['lq-17-009', 'lq-17-014', 'lq-17-015'],
      boardQuestionIds: ['qq-17-018', 'qq-17-019', 'qq-17-020', 'qq-17-021', 'qq-17-022', 'qq-17-023', 'qq-17-024'],
      instructorNote: 'Focus on the difference between base and no-base application and why hydroxide/thio compatibility matters.',
      retakeCount: 3,
    },
    {
      id: 'CH17-R05',
      standardId: 'CH17-R05',
      competencyId: 'CH17-C05',
      lessonIds: ['curl-reformation'],
      flashcardIds: ['fc-ch17-031', 'fc-ch17-050'],
      vocabularyIds: ['curl-reformation'],
      learningQuestionIds: [],
      boardQuestionIds: ['qq-17-025', 'qq-17-026'],
      instructorNote: 'Stress the two-process risk. Require the student to explain why hair must be healthy enough for reformation.',
      retakeCount: 3,
    },
    {
      id: 'CH17-R06',
      standardId: 'CH17-R06',
      competencyId: 'CH17-C06',
      lessonIds: ['tools-materials', 'safety-checklist', 'texture-confidence', 'scenario-1'],
      flashcardIds: ['fc-ch17-029', 'fc-ch17-030', 'fc-ch17-035', 'fc-ch17-036', 'fc-ch17-044', 'fc-ch17-046', 'fc-ch17-052', 'fc-ch17-056', 'fc-ch17-058'],
      vocabularyIds: ['porosity-test', 'elasticity-test', 'texture-test', 'contraindication'],
      learningQuestionIds: ['lq-17-005'],
      boardQuestionIds: ['qq-17-028', 'qq-17-029', 'qq-17-030'],
      instructorNote: 'Return to the safety checklist and strand-test procedures. Practice identifying contraindications from photos or case studies.',
      retakeCount: 3,
    },
    {
      id: 'CH17-R07',
      standardId: 'CH17-R07',
      competencyId: 'CH17-C07',
      lessonIds: ['texturizers', 'compare-chemistries'],
      flashcardIds: ['fc-ch17-032', 'fc-ch17-033', 'fc-ch17-049'],
      vocabularyIds: ['texturizer', 'chemical-blowout'],
      learningQuestionIds: ['lq-17-010'],
      boardQuestionIds: ['qq-17-027'],
      instructorNote: 'Compare texturizer and blowout outcomes to full relaxers using processing time and final curl pattern.',
      retakeCount: 3,
    },
  ],
  mastery: {
    passingScore: 80,
    confidenceCheck: true,
    remediationRequiredBelow: 80,
  },
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
