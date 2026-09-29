// Chapter 15: Men's Hair Replacement — PREMIUM IMMERSIVE EXPERIENCE
// THE RESTORATION STUDIO — Where Confidence Is Rebuilt, One System at a Time

import type { ChapterTheme, ChapterContent } from './chapter-content'

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// THE RESTORATION STUDIO THEME — Elite Hair Replacement Academy
// Warm amber / Deep charcoal / Gold accents
// Feels like: A premium consultation suite where transformation happens
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const chapter15PremiumTheme: ChapterTheme = {
  primary: '#5D4037',
  primaryLight: '#8D6E63',
  primaryDark: '#3E2723',
  secondary: '#D4A017',
  background: 'rgba(46, 32, 22, 0.96)',
  backgroundAlt: 'rgba(62, 39, 35, 0.92)',
  surface: '#2E2016',
  border: 'rgba(93, 64, 55, 0.3)',
  text: '#F5F0EB',
  textMuted: '#BCAAA4',
  highlight: '#D4A017',
  timeline: {
    line: 'rgba(141, 110, 99, 0.35)',
    iconBg: '#3E2723',
    iconBorder: '#5D4037',
  },
  quote: {
    border: 'rgba(212, 160, 23, 0.4)',
    icon: 'rgba(212, 160, 23, 0.3)',
    bg: 'rgba(46, 32, 22, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(141, 110, 99, 0.15)',
    activeBorder: 'rgba(212, 160, 23, 0.5)',
    activeText: '#8D6E63',
    inactiveBg: 'rgba(46, 32, 22, 0.7)',
    inactiveBorder: 'rgba(93, 64, 55, 0.2)',
    inactiveText: '#BCAAA4',
    panelBg: 'rgba(46, 32, 22, 0.85)',
    panelBorder: 'rgba(93, 64, 55, 0.25)',
  },
  toolCard: {
    headerBg: 'rgba(141, 110, 99, 0.1)',
    headerText: '#8D6E63',
    dot: 'rgba(212, 160, 23, 0.6)',
    line: 'rgba(141, 110, 99, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(212, 160, 23, 0.15)',
    iconColor: '#D4A017',
    cardBorder: 'rgba(93, 64, 55, 0.25)',
  },
  milestone: {
    yearColor: '#D4A017',
    border: 'rgba(93, 64, 55, 0.25)',
  },
  checklist: {
    checkBorder: 'rgba(212, 160, 23, 0.4)',
    checkColor: '#D4A017',
    bg: 'rgba(46, 32, 22, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(46, 32, 22, 0.7)',
    border: 'rgba(93, 64, 55, 0.2)',
    highlightColor: '#D4A017',
  },
  challengeCard: {
    badgeBg: 'rgba(212, 160, 23, 0.15)',
    badgeText: '#D4A017',
    cardBorder: 'rgba(93, 64, 55, 0.25)',
    completedBg: 'rgba(163, 190, 140, 0.1)',
    completedBorder: 'rgba(163, 190, 140, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(212, 160, 23, 0.06)',
    optionBorder: 'rgba(93, 64, 55, 0.2)',
    correctBg: 'rgba(163, 190, 140, 0.1)',
    incorrectBg: 'rgba(191, 97, 106, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(141, 110, 99, 0.2)',
    levelBadgeText: '#8D6E63',
    rewardBg: 'rgba(163, 190, 140, 0.12)',
    rewardText: '#A3BE8C',
  },
  actionPrompt: {
    cardBorder: 'rgba(93, 64, 55, 0.25)',
    completedBorder: 'rgba(163, 190, 140, 0.35)',
    benefitBg: 'rgba(212, 160, 23, 0.1)',
    benefitBorder: 'rgba(212, 160, 23, 0.3)',
  },
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// CHAPTER 15: MEN'S HAIR REPLACEMENT
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const chapter15PremiumContent: ChapterContent = {
  chapterNumber: 15,
  title: "Men's Hair Replacement",
  subtitle: 'The Restoration Studio — Master the art and business of hair replacement systems',
  theme: chapter15PremiumTheme,
  sections: [
    // Section 0: Restoration Studio Welcome
    {
      type: 'contentBlock',
      id: 'restoration-studio-hero',
      title: 'Welcome to the Restoration Studio',
      content: 'You are not just learning about hair replacement — you are learning how to restore confidence, rebuild self-image, and transform lives. This chapter equips you with the knowledge to guide clients through one of the most personal decisions they will ever make. Every consultation is a trust exercise. Every fitting is a craft. Every blended system is invisible art.',
      highlight: 'Elite Hair Replacement Academy',
    },

    // Section 1: Why Study Men's Hair Replacement
    {
      type: 'infoCards',
      id: 'why-study-replacement',
      title: 'Why Study Men\'s Hair Replacement?',
      cards: [
        {
          icon: 'TrendingUp',
          title: 'Specialized Service Opportunity',
          text: 'Hair replacement is a specialized barbering service that can support recurring maintenance relationships and advanced client-care skills.',
        },
        {
          icon: 'Heart',
          title: 'Transform Lives',
          text: 'Hair loss affects self-esteem, social confidence, and professional presence. You hold the tools to change how a man sees himself every morning.',
        },
        {
          icon: 'DollarSign',
          title: 'Revenue Multiplier',
          text: 'Hair replacement clients return regularly for maintenance, cleaning, and reattachment. One satisfied client becomes a recurring revenue stream for years.',
        },
      ],
    },
    {
      type: 'quote',
      id: 'replacement-quote',
      quote: 'The client is not buying hair. He is buying the man he used to see in the mirror. Your job is to deliver that reflection with honesty, skill, and care.',
    },

    // Section 2: History and Terminology Evolution
    {
      type: 'contentBlock',
      id: 'history-intro',
      title: 'From Ancient Ritual to Modern Science',
      content: 'Hair replacement is not new. Assyrian warriors, Egyptian pharaohs, and Roman senators all used wigs and hairpieces for ceremony, status, and vanity. The foretop — a section of natural hair grown long to blend with a wig — evolved into the toupee of the 18th century. Today, bonding technology and base construction have transformed what was once obvious into something virtually undetectable. Understanding this evolution helps you speak with authority and educate clients who may still picture the "rug on a stand" stereotype.',
      highlight: 'Bonding technology and base construction have made modern systems virtually undetectable',
    },
    {
      type: 'tabbed',
      id: 'terminology-evolution',
      title: 'Terminology Evolution',
      subtitle: 'From stigma to solution — how language shapes perception',
      tabs: [
        {
          id: 'toupee',
          label: 'Toupee',
          title: 'Toupee — The Historical Term',
          bullets: [
            { label: 'Origin', description: '18th-century term for the foretop section that blended natural hair with a wig' },
            { label: 'Evolution', description: 'Became synonymous with small wigs covering the crown or top of the head' },
            { label: 'Modern Connotation', description: 'Carries stigma; clients may react negatively to this term' },
            { label: 'Study Note', description: 'Know the historical meaning so you can distinguish older terminology from modern professional language' },
          ],
        },
        {
          id: 'hairpiece',
          label: 'Hairpiece',
          title: 'Hairpiece — The Transitional Term',
          bullets: [
            { label: 'Usage', description: 'Industry-adopted term that replaced "toupee" in professional settings' },
            { label: 'Scope', description: 'Covers partial wigs and systems covering balding areas' },
            { label: 'Client Perception', description: 'Still feels artificial to some; better than toupee but not ideal' },
            { label: 'Professional Use', description: 'Acceptable in technical discussion, but not optimal for client consultation' },
          ],
        },
        {
          id: 'system',
          label: 'System',
          title: 'Hair Replacement System — The Modern Standard',
          bullets: [
            { label: 'Industry Term', description: 'Used interchangeably with "hair solution" throughout the professional world' },
            { label: 'Client Appeal', description: 'Sounds technical, sophisticated, and solution-oriented' },
            { label: 'Accuracy', description: 'Reflects the integrated nature of base, hair, attachment, and maintenance' },
            { label: 'Best Practice', description: 'Use this term in client consultations and marketing materials' },
          ],
        },
        {
          id: 'solution',
          label: 'Solution',
          title: 'Hair Solution — The Client-Friendly Term',
          bullets: [
            { label: 'Marketing Power', description: 'Positions the service as solving a problem, not covering a flaw' },
            { label: 'Psychological Benefit', description: 'Removes shame and reframes the conversation around results' },
            { label: 'Professional Use', description: 'Ideal for consultations, social media, and advertising' },
            { label: 'Exam Note', description: '"Hair solution" and "hair replacement system" are interchangeable on exams' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'memory-anchor-terms',
      title: 'Memory Anchor: The "Toupee to Solution" Journey',
      content: 'Picture three generations at a family reunion. Grandpa wore a "toupee" — everyone knew, nobody mentioned it. Dad wore a "hairpiece" — better, but still obvious. The grandson wears a "hair replacement system" — nobody can tell, and he tells anyone who asks. Same need. Three eras of technology. Three levels of confidence. That is the journey you are now part of.',
      highlight: 'Same need. Three eras. Three levels of confidence.',
    },

    // Section 3: The Client Consultation
    {
      type: 'scenarioBlock',
      id: 'consultation-scenario-1',
      title: 'Restoration Studio Challenge: The Sensitive Consultation',
      scenarios: [
        {
          situation: 'A regular client has been coming in for haircuts for two years. You have noticed progressive thinning at the crown. During today\'s service, he says, "I\'m starting to look like my father." What is your most professional response?',
          options: [
            { letter: 'A', text: 'Agree and immediately show him sample systems', feedback: 'Too aggressive. The client opened the door, but you must walk through it gently, not kick it down.' },
            { letter: 'B', text: 'Acknowledge his comment and ask if he would like to discuss options in private', feedback: 'Correct. You validated his concern, offered privacy, and invited further conversation without pressure.' },
            { letter: 'C', text: 'Change the subject to avoid making him uncomfortable', feedback: 'You missed an opportunity to serve. The client raised the topic — he wants to talk.' },
            { letter: 'D', text: 'Tell him hair loss is genetic and there is nothing he can do', feedback: 'Discouraging and inaccurate. There are many options, and your role is to educate, not dismiss.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'consultation-fundamentals',
      title: 'The Consultation Blueprint',
      content: 'Hair loss is deeply personal. Conduct consultations in a setting that protects the client\'s privacy and dignity, such as a private room or another appropriately discreet area. Avoid discussing sensitive hair-loss details where unrelated clients can overhear. Begin by asking open-ended questions: "If you could change anything about your hair, what would it be?" This question opens the door without forcing anyone through it.',
      highlight: 'Protect client privacy and discuss sensitive hair-loss information discreetly',
    },
    {
      type: 'checklist',
      id: 'consultation-topics',
      title: 'Essential Consultation Topics — The LAB MED Framework',
      items: [
        { text: 'Lifestyle — How active is the client? Does he swim, exercise, or travel frequently?' },
        { text: 'Age — Younger clients may want gradual transitions; older clients often prefer conservative styles' },
        { text: 'Budget — Determine what the client can afford, including ongoing maintenance costs' },
        { text: 'Medical History — Has he seen a physician? Is he using Minoxidil or Finasteride?' },
        { text: 'Expectations — What does he want to look like? Be honest about what is achievable' },
        { text: 'Daily Maintenance — Is he willing to remove, clean, and reattach the system regularly?' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'consultation-ethics',
      title: 'Ethics and Realistic Expectations',
      content: 'Never promise what you cannot deliver. Convincing a 70-year-old man that he will look 40 again is not only unethical — it is impossible. Recommend age-appropriate colors and styles. Dark, opaque colors look artificial on older clients. A salt-and-pepper blend or medium brown shade looks natural and believable. Your credibility depends on honesty, not flattery.',
      highlight: 'Your credibility depends on honesty, not flattery',
    },
    {
      type: 'scenarioBlock',
      id: 'consultation-scenario-2',
      title: 'Restoration Studio Challenge: The Unrealistic Expectation',
      scenarios: [
        {
          situation: 'A 68-year-old client wants a jet-black system styled like a 25-year-old celebrity. He insists, "Money is no object." What is your professional obligation?',
          options: [
            { letter: 'A', text: 'Give him exactly what he wants — the customer is always right', feedback: 'Wrong. You are the professional. Giving an unrealistic system damages your reputation and his dignity.' },
            { letter: 'B', text: 'Explain why the request will look unnatural and recommend a more appropriate option', feedback: 'Correct. Educate with respect. Show him samples of age-appropriate colors and styles that restore confidence without looking ridiculous.' },
            { letter: 'C', text: 'Refuse to serve him and ask him to leave', feedback: 'Too harsh. He came to you for help. Guide him, do not abandon him.' },
            { letter: 'D', text: 'Agree to the style but use a salt-and-pepper color without telling him', feedback: 'Deceptive and unprofessional. Always obtain informed consent before making decisions.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // Section 4: Marketing and Sales Ethics
    {
      type: 'contentBlock',
      id: 'marketing-intro',
      title: 'Marketing Hair Replacement Services',
      content: 'Hair replacement sells itself when presented correctly. Hard-sell tactics backfire — the client who wants a solution is already interested. Your job is to educate, demonstrate, and guide. Let the results speak. A well-displayed sample system, a confident before-and-after photo, and a barber who wears his own system with pride do more selling than any pitch ever could.',
      highlight: 'Let the results speak louder than any sales pitch',
    },
    {
      type: 'featureGrid',
      id: 'marketing-channels',
      title: 'Marketing Channels That Work',
      features: [
        {
          icon: 'Smartphone',
          title: 'Social Media',
          description: 'Post before-and-after photos only with documented client permission that meets applicable requirements. Share useful educational content about how systems work and maintain a consistent posting schedule that fits the business.',
        },
        {
          icon: 'Eye',
          title: 'In-Shop Display',
          description: 'Keep one or two clean, styled sample systems visible. Clients who see quality work become curious. Let them try samples on.',
        },
        {
          icon: 'Users',
          title: 'Referrals',
          description: 'Personal referrals from satisfied clients are your strongest advertising. Encourage word-of-mouth with referral incentives.',
        },
        {
          icon: 'FileText',
          title: 'Print Advertising',
          description: 'Print advertising may still reach some local audiences. Before using client images, obtain documented permission that meets applicable privacy, advertising, and recordkeeping requirements.',
        },
        {
          icon: 'UserCheck',
          title: 'Personal Experience',
          description: 'If you wear a system, you become a walking advertisement. Your confidence and ease make the strongest impression possible.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'sample-system-care',
      title: 'Sample System Care — Critical Detail',
      content: 'The sample system on your counter represents your standard of work. If it is dirty, tangled, or outdated, clients will assume their system will look the same. Shampoo the sample after every client who tries it on. Style it fresh. Replace it when it shows wear. Your sample is a silent salesperson — treat it accordingly.',
      highlight: 'Shampoo the sample system after every client who tries it on',
    },
    {
      type: 'checklist',
      id: 'model-release-checklist',
      title: 'Before Using Any Client Photo',
      items: [
        { text: 'Obtain a signed model release form' },
        { text: 'Explain exactly how the photo will be used' },
        { text: 'Confirm the client is comfortable showing their face' },
        { text: 'Use client photos only with documented permission that meets applicable privacy and advertising requirements' },
        { text: 'Retain signed release forms according to your business policy and applicable privacy/recordkeeping requirements' },
      ],
    },
    {
      type: 'challengeCard',
      id: 'marketing-challenge',
      title: 'Restoration Studio Challenge: Ethical Marketing Scenarios',
      challenges: [
        { badge: 'Scenario 1', title: 'The Friend Model', description: 'Your best friend lets you photograph his transformation. Do you still need documented permission before publishing it?', action: 'Yes. Personal relationships do not replace appropriate client permission and recordkeeping.', difficulty: 'easy' },
        { badge: 'Scenario 2', title: 'The Anonymous Post', description: 'A client permits a photo only if identifying features are excluded. What should you do?', action: 'Honor the exact permission granted and use only imagery that stays within the client\'s documented consent.', difficulty: 'medium' },
        { badge: 'Scenario 3', title: 'The Competitor\'s Photo', description: 'You find a great before-and-after online from another barber. Can you use it in your advertising?', action: 'Do not use another professional\'s image unless you have the rights or explicit permission to do so, and never present someone else\'s work as your own.', difficulty: 'easy' },
      ],
    },

    // Section 5: Alternative Hair Loss Treatments
    {
      type: 'contentBlock',
      id: 'alternatives-intro',
      title: 'Know All the Options — Even the Ones You Do Not Provide',
      content: 'A professional barber understands the full landscape of hair loss solutions, not just the ones sold in the shop. Clients trust you more when you discuss surgical options, medical treatments, and nonsurgical alternatives with equal knowledge. Your role is not to prescribe — it is to inform and refer. Never cross the line into medical advice. When a client asks about medication or surgery, your answer is always: "Let\'s discuss what I know, and then I recommend speaking with a physician for personalized medical guidance."',
      highlight: 'Your role is to inform and refer — never to prescribe or diagnose',
    },
    {
      type: 'tabbed',
      id: 'alternative-treatments',
      title: 'Alternative Hair Loss Treatments',
      subtitle: 'Nonsurgical and surgical options every barber should know',
      tabs: [
        {
          id: 'nonsurgical',
          label: 'Nonsurgical',
          title: 'Nonsurgical Alternatives',
          bullets: [
            { label: 'Cover-Up Hair Fibers', description: 'Temporary fibers shaken onto hair and held with hairspray. Washes out daily. Quick, inexpensive, but not a true solution.' },
            { label: 'Minoxidil', description: 'A topical medication used for certain forms of hair loss. Product strength, directions, benefits, risks, and suitability are medical questions; refer the client to product labeling and an appropriate licensed healthcare professional.' },
            { label: 'Finasteride', description: 'A prescription medication used for certain forms of hair loss. Benefits, risks, contraindications, and suitability for a particular client belong with an appropriate licensed healthcare professional.' },
            { label: 'Low-Level Light Therapy', description: 'Device-based light treatments are marketed for certain hair-loss concerns. Device status, indications, safety, and whether a barber may offer a particular service depend on the specific device, applicable rules, and professional scope; do not make medical claims beyond verified labeling.' },
          ],
        },
        {
          id: 'surgical',
          label: 'Surgical',
          title: 'Surgical Hair Restoration',
          bullets: [
            { label: 'Hair Transplantation', description: 'A medical procedure that moves hair-bearing follicular grafts from donor areas to areas of hair loss. Technique, candidacy, risks, and expected durability are medical matters for an appropriately licensed clinician.' },
            { label: 'Scalp Reduction', description: 'Bald scalp area is surgically removed. Surrounding hair-bearing scalp is pulled together to cover the gap.' },
            { label: 'Flap Surgery', description: 'A flap of hair-bearing skin is detached and repositioned to cover a bald area. More complex than scalp reduction.' },
            { label: 'Scope Reminder', description: 'All surgical procedures are performed by licensed medical professionals only. Barbers discuss, refer, and support — never perform.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'scope-of-practice',
      title: 'Professional Scope Boundary',
      content: 'Hair-replacement services can overlap with medical questions, so keep cosmetic service work separate from diagnosis, prescribing, and individualized medication advice. Barbering scope varies by jurisdiction; follow the law and licensing rules where you practice, and refer medical questions to an appropriately licensed healthcare professional.',
      highlight: 'Do not diagnose, prescribe, or give individualized medication directions; verify your jurisdiction\'s scope and refer medical questions appropriately',
    },
    {
      type: 'scenarioBlock',
      id: 'scope-scenario',
      title: 'Restoration Studio Challenge: The Scope Trap',
      scenarios: [
        {
          situation: 'A client asks, "Should I use the 2% or 5% Minoxidil? And how many times a day?" How do you respond professionally?',
          options: [
            { letter: 'A', text: 'Recommend the 5% strength twice daily for best results', feedback: 'That gives individualized medication directions. Keep the barbering conversation general and refer the client to an appropriately licensed healthcare professional.' },
            { letter: 'B', text: 'Explain that formulations differ and refer the client to product labeling and an appropriate licensed healthcare professional for individualized guidance', feedback: 'Correct. You stayed within a general educational role and referred individualized medication questions appropriately.' },
            { letter: 'C', text: 'Tell him to read the box and decide for himself', feedback: 'Dismissive and unprofessional. The client came to you for guidance. Provide what you can and refer the rest.' },
            { letter: 'D', text: 'Say you are not allowed to discuss medication at all', feedback: 'Too restrictive. You can discuss general educational information, but individualized medication guidance belongs with an appropriate licensed healthcare professional.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // Section 6: Hair Materials and Base Construction
    {
      type: 'levelUp',
      id: 'materials-level-up',
      title: 'Level Up: The Hair Material Mastery System',
      levels: [
        { level: '1', title: 'Identify', description: 'Distinguish human, synthetic, and mixed hair by sight and touch', reward: 'Accurate client recommendations' },
        { level: '2', title: 'Compare', description: 'Understand advantages and limitations of each material type', reward: 'Informed purchasing decisions' },
        { level: '3', title: 'Select', description: 'Match hair type to client lifestyle, budget, and maintenance capacity', reward: 'Satisfied, long-term clients' },
        { level: '4', title: 'Maintain', description: 'Clean, condition, and style each material type correctly', reward: 'Extended system lifespan' },
        { level: '5', title: 'Troubleshoot', description: 'Identify material-related problems and recommend solutions', reward: 'Expert status and referrals' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'hair-materials-intro',
      title: 'Understanding Hair Materials',
      content: 'The hair in a replacement system determines how natural it looks, how long it lasts, and how much maintenance it requires. Human hair offers the most realistic appearance and can be chemically processed, but it reacts to climate, fades in light, and needs regular styling. Synthetic hair holds its shape, costs less, and resists oxidation, but it can look overly glossy and is difficult to blend with natural hair. Mixed hair combines human, synthetic, and sometimes animal fibers for specialized applications. Know how the material types differ so you can explain their practical tradeoffs accurately.',
      highlight: 'Human hair looks most natural. Synthetic holds style. Mixed serves specialized needs.',
    },
    {
      type: 'tabbed',
      id: 'hair-types',
      title: 'Hair Material Types',
      subtitle: 'The HSM Framework: Human, Synthetic, Mixed',
      tabs: [
        {
          id: 'human',
          label: 'Human',
          title: 'Human Hair — The Premium Choice',
          bullets: [
            { label: 'Advantages', description: 'Most natural look and texture; can be permed, colored, and heat-styled; durable with proper care' },
            { label: 'Disadvantages', description: 'Reacts to humidity and temperature; fades with sun exposure; requires regular styling; can become damaged like natural hair' },
            { label: 'Processing', description: 'Chemically cleaned with acid solution, sorted, and hackled (combed through to separate strands). Most cuticle is removed during processing.' },
            { label: 'Best For', description: 'Clients who want the most natural appearance and are willing to maintain it' },
          ],
        },
        {
          id: 'synthetic',
          label: 'Synthetic',
          title: 'Synthetic Hair — The Practical Choice',
          bullets: [
            { label: 'Advantages', description: 'Holds style after washing; lower cost; does not oxidize or fade; easy maintenance' },
            { label: 'Disadvantages', description: 'High gloss makes it more noticeable; mats and tangles when blended with human hair; limited chemical processing options' },
            { label: 'Common Fiber', description: 'Kanekalon is the most common synthetic fiber used in ready-to-wear wigs' },
            { label: 'Best For', description: 'Budget-conscious clients or those who want low-maintenance style retention' },
          ],
        },
        {
          id: 'mixed',
          label: 'Mixed',
          title: 'Mixed Hair — The Specialized Blend',
          bullets: [
            { label: 'Composition', description: 'Human hair blended with synthetic or animal fibers — horse, yak, angora, or sheep\'s wool' },
            { label: 'Angora Advantage', description: 'Finer texture than yak; often used at the front hairline for softer, more natural appearance' },
            { label: 'Allergen Warning', description: 'Some fibers use wool bases. Clients with wool allergies need keratin fiber alternatives.' },
            { label: 'Best For', description: 'Theatrical wigs, fashion applications, and specialized blending needs' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'base-construction',
      title: 'Base Construction — The Foundation of the System',
      content: 'The base is the foundation that holds every hair in place. It must be durable enough to withstand daily wear, breathable enough for comfort, and thin enough to be undetectable. No single material does all three perfectly — that is why combination bases exist. Understanding base construction helps you recommend the right system for each client\'s lifestyle and budget.',
      highlight: 'The base must be durable, breathable, and thin — no single material does all three perfectly',
    },
    {
      type: 'tabbed',
      id: 'base-types',
      title: 'Base Material Types',
      subtitle: 'The "My Nylon Socks Pull Lace Tight" Memory Anchor',
      tabs: [
        {
          id: 'mesh',
          label: 'Mesh',
          title: 'Mesh / Net Bases — Breathable and Lightweight',
          bullets: [
            { label: 'Characteristics', description: 'Open-weave construction allows airflow to the scalp' },
            { label: 'Advantages', description: 'Most breathable option; comfortable for all-day wear' },
            { label: 'Disadvantages', description: 'Less durable than solid materials; can stretch over time' },
            { label: 'Best For', description: 'Clients who prioritize comfort and wear systems daily' },
          ],
        },
        {
          id: 'polyurethane',
          label: 'Poly',
          title: 'Polyurethane — Waterproof and Durable',
          bullets: [
            { label: 'Characteristics', description: 'Solid, skin-like material that creates a secure bond' },
            { label: 'Advantages', description: 'Waterproof; excellent for adhesive bonding; durable' },
            { label: 'Disadvantages', description: 'Less breathable than mesh; can feel warmer on the scalp' },
            { label: 'Best For', description: 'Active clients and those using full-head bonding' },
          ],
        },
        {
          id: 'lace',
          label: 'Lace',
          title: 'Lace Fronts — The Invisible Hairline',
          bullets: [
            { label: 'Characteristics', description: 'Sheer, delicate material that disappears at the hairline' },
            { label: 'Advantages', description: 'Virtually undetectable front hairline; allows off-the-face styling' },
            { label: 'Lace Handling', description: 'Delicate lace can be damaged by aggressive tape application or removal. Follow the system and adhesive manufacturer instructions for lace-front attachment.' },
            { label: 'Best For', description: 'Clients who wear their hair brushed back or styled off the face' },
          ],
        },
        {
          id: 'thin-skin',
          label: 'Thin Skin',
          title: 'Thin Skin (Onion Skin) — The Undetectable Edge',
          bullets: [
            { label: 'Characteristics', description: 'Extremely thin base material that blends seamlessly with skin' },
            { label: 'Advantages', description: 'Most undetectable at the perimeter; creates natural-looking edges' },
            { label: 'Disadvantages', description: 'More fragile than thicker materials; requires careful handling' },
            { label: 'Best For', description: 'Clients who need the most natural-looking hairline possible' },
          ],
        },
        {
          id: 'combination',
          label: 'Combo',
          title: 'Combination Bases — The Best of All Worlds',
          bullets: [
            { label: 'Characteristics', description: 'Strategic use of multiple materials in different base zones' },
            { label: 'Example', description: 'Lace front for natural hairline, polyurethane perimeter for bonding, mesh center for breathability' },
            { label: 'Advantages', description: 'Optimizes comfort, durability, and appearance in one system' },
            { label: 'Best For', description: 'Clients who need a balance of characteristics that a single base material may not provide' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'knotting-methods',
      title: 'Knotting Methods — How Hair Attaches to the Base',
      content: 'The method used to attach hair to the base affects durability, natural appearance, and how the hair behaves during cleaning. Single knotting is common and durable but may loosen during cleaning. Double-knotted hair stays secure through repeated washing and wear. V-looping and single hair injection create the most natural-looking root appearance because the hair appears to grow directly from the scalp rather than being tied. Root-turning — sorting hair so the cuticle points toward the ends in natural growth direction — prevents tangling and matting. When a manufacturer claims a system is "root-turned," it means the cuticle alignment has been preserved for natural flow.',
      highlight: 'Root-turned hair prevents tangling because cuticles flow in the correct direction',
    },
    {
      type: 'checklist',
      id: 'manufacturer-evaluation',
      title: 'Evaluating a Hair System Manufacturer',
      items: [
        { text: 'What hair materials are used — human, synthetic, or mixed?' },
        { text: 'Has the hair been chemically treated? If so, with what?' },
        { text: 'Is human hair graded for strength, elasticity, and porosity?' },
        { text: 'What is the product life expectancy?' },
        { text: 'Can the manufacturer create custom colors?' },
        { text: 'Does the manufacturer offer technical training on their products?' },
        { text: 'Will the manufacturer stand behind their product with support or warranty?' },
      ],
    },

    // Section 7: Stock vs Custom Systems
    {
      type: 'contentBlock',
      id: 'stock-vs-custom',
      title: 'Stock vs Custom — Matching the System to the Client',
      content: 'Not every client needs a fully custom system. Stock systems — also called pre-custom — come in standard sizes and colors from manufacturers. They cost less, arrive faster, and can be customized with cutting and styling. Custom systems require a template or plaster mold of the client\'s head, plus color-matching samples. They are made from client-specific measurements or templates and can provide a more individualized fit, typically at higher cost. The decision comes down to budget, timeline, and the degree of hair loss. A client with a standard-shaped bald area and a common hair color may be perfectly happy with a stock system. A client with an unusual head shape or specific color needs requires custom work.',
      highlight: 'Stock systems are faster and cheaper. Custom systems fit perfectly and look seamless.',
    },
    {
      type: 'tabbed',
      id: 'stock-custom-comparison',
      title: 'Stock vs Custom Comparison',
      subtitle: 'Which system fits which client?',
      tabs: [
        {
          id: 'stock',
          label: 'Stock',
          title: 'Stock (Pre-Custom) Systems',
          bullets: [
            { label: 'Availability', description: 'Ready-made in standard sizes and colors; barbers can maintain inventory' },
            { label: 'Cost', description: 'Lower price point; accessible to budget-conscious clients' },
            { label: 'Delivery', description: 'Immediate or fast turnaround; no waiting for manufacturing' },
            { label: 'Customization', description: 'Can be cut, styled, and partially modified to fit the client' },
            { label: 'Best For', description: 'Clients with common head shapes, standard color needs, or those wanting to try a system before investing in custom' },
          ],
        },
        {
          id: 'custom',
          label: 'Custom',
          title: 'Custom Systems',
          bullets: [
            { label: 'Process', description: 'Made from client\'s template, measurements, and color samples' },
            { label: 'Fit', description: 'Made from client-specific measurements or templates for a more individualized fit' },
            { label: 'Cost', description: 'Higher price point due to individualized manufacturing' },
            { label: 'Timeline', description: 'Longer wait time while the system is produced' },
            { label: 'Best For', description: 'Clients with unique head shapes, specific color requirements, or those seeking the most natural, undetectable result' },
          ],
        },
        {
          id: 'template',
          label: 'Template',
          title: 'Template and Plaster Mold Process',
          bullets: [
            { label: 'Template', description: 'A pattern of the client\'s head form created with plastic wrap and tape; sent to the manufacturer as a cutting guide' },
            { label: 'Plaster Mold', description: 'A three-dimensional cast of the client\'s head made with plaster of Paris; creates the most precise fit possible' },
            { label: 'Foam Mold', description: 'The manufacturer pours foam into the plaster cast to create a permanent mold for future orders' },
            { label: 'Color Sampling', description: 'Hair samples taken from the client\'s crown, temple, side, and back ensure accurate color matching — especially critical for gray blending' },
          ],
        },
      ],
    },
    {
      type: 'scenarioBlock',
      id: 'stock-custom-scenario',
      title: 'Restoration Studio Challenge: The Right Recommendation',
      scenarios: [
        {
          situation: 'A new client has a standard oval bald area at the crown, medium brown hair with 20% gray, and a budget of $400. He needs the system in three days for a wedding. What do you recommend?',
          options: [
            { letter: 'A', text: 'A fully custom system with plaster mold and rush manufacturing', feedback: 'Custom systems take weeks, not days. The timeline makes this impossible.' },
            { letter: 'B', text: 'A stock system in a close color match, customized with cutting and blending', feedback: 'Correct. Stock systems are available immediately, fit the budget, and can be cut and styled to look natural for the event.' },
            { letter: 'C', text: 'Tell him hair replacement is not possible on his budget', feedback: 'Unnecessary and discouraging. Stock systems exist precisely for this type of client.' },
            { letter: 'D', text: 'A synthetic full wig as a temporary solution', feedback: 'A full wig is overkill for a crown bald area and likely not what the client wants.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // Section 8: Supplies and Measurement
    {
      type: 'contentBlock',
      id: 'supplies-intro',
      title: 'Essential Supplies for Hair Replacement Services',
      content: 'Most barbershops already own the majority of tools needed for hair replacement — shears, clippers, combs, and blowdryers are standard. What you need to add are specialized supplies: adhesive removers, bonding agents, double-sided tape, spirit gum, wig blocks, T-pins, and manufacturer-specific cleaning solvents. Do not try to substitute barber supplies for hair replacement supplies. The wrong adhesive damages bases. The wrong solvent ruins hair. Build your kit methodically.',
      highlight: 'Do not substitute barber supplies for hair replacement supplies — the wrong product causes damage',
    },
    {
      type: 'checklist',
      id: 'supplies-checklist',
      title: 'Hair Replacement Supplies Checklist',
      items: [
        { text: 'Adhesive remover (manufacturer-recommended solvent)' },
        { text: 'Alcohol (for cleaning scalp before attachment)' },
        { text: 'Blowdryer (cool setting for drying systems)' },
        { text: 'Client record cards (track systems, colors, and maintenance dates)' },
        { text: 'Clippers (for preliminary cuts and blending)' },
        { text: 'Combs (wide-tooth for system care, standard for styling)' },
        { text: 'Double-sided adhesive tape (for perimeter attachment)' },
        { text: 'Grease pencil (for marking templates and patterns)' },
        { text: 'Hair density chart (for matching client\'s natural density)' },
        { text: 'Hairnet (for protecting systems during storage)' },
        { text: 'Haircutting shears and thinning shears' },
        { text: 'Manufacturer\'s color ring (for accurate color matching)' },
        { text: 'Measuring tape (for precise sizing in inches)' },
        { text: 'Plastic wrap (for creating templates)' },
        { text: 'Razor (for outlining and detailing)' },
        { text: 'Roller picks (for floating perm rods above the base)' },
        { text: 'Scissors (for cutting template patterns)' },
        { text: 'Small brush (for styling and distributing products)' },
        { text: 'Spirit gum / adhesive (for facial hair and some system types)' },
        { text: 'Styling or wig block (for cleaning, drying, and storing systems)' },
        { text: 'T-pins (for securing systems to blocks during cleaning)' },
        { text: 'Thinning shears (for blending system hair with natural hair)' },
        { text: 'Transparent tape (for template creation)' },
        { text: 'Wig cleaner (manufacturer-recommended solvent)' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'measurement-process',
      title: 'Measurement and Color Sampling',
      content: 'Accurate measurement ensures a comfortable, secure fit. Hair replacement sizes are measured in inches — length by width. A 6x4 piece means six inches front-to-back and four inches side-to-side. The larger number typically refers to length unless the manufacturer specifies otherwise. Before measuring, perform a preliminary haircut: trim the client\'s natural hair lightly, leaving length at the neckline and sides for blending. Then take color samples from the crown using thinning shears — wrap the base with adhesive tape to keep strands together. If the client has gray hair, take additional samples from the temple, side, and back to ensure accurate gray blending at the system edges.',
      highlight: 'A 6x4 piece means 6 inches front-to-back and 4 inches side-to-side',
    },
    {
      type: 'contentBlock',
      id: 'template-creation',
      title: 'Creating a Template',
      content: 'Templates replace guesswork with precision. Cover the client\'s bald area with plastic wrap, smoothing it flat against the scalp. Apply transparent tape over the plastic wrap to create a rigid pattern. Mark the front hairline, sides, and nape with a grease pencil. Remove the template carefully and transfer it to pattern paper. This template becomes the manufacturer\'s blueprint. For the most precise fit, some manufacturers prefer a plaster mold: the client holds plastic wrap in place while plaster of Paris is applied, creating a hard cast. The manufacturer then pours foam into the cast to create a permanent reusable mold.',
      highlight: 'The template is the manufacturer\'s blueprint — precision here prevents problems later',
    },

    // Section 9: Attachment Methods
    {
      type: 'contentBlock',
      id: 'attachment-intro',
      title: 'Attachment Methods — Making It Stay',
      content: 'How a system attaches determines how it feels, how secure it is, and what the client can do while wearing it. Full head bonding uses adhesive across the intended scalp contact area and can provide a secure attachment when the product is used as directed. Tape attachment uses double-sided tape at selected attachment areas and can be easier to remove and reattach. Lace-front systems require delicate handling; use only attachment and removal methods approved for that specific system and adhesive. Facial hair pieces — mustaches, beards, sideburns — attach with spirit gum. Full wigs use stretch caps with elastic bands. Match the attachment method to the client\'s lifestyle, not just the system type.',
      highlight: 'Match the attachment method to the client\'s lifestyle, not just the system type',
    },
    {
      type: 'tabbed',
      id: 'attachment-methods',
      title: 'Attachment Methods',
      subtitle: 'The BLF-F Framework: Bonding, Lace-front, Facial, Full wigs',
      tabs: [
        {
          id: 'bonding',
          label: 'Bonding',
          title: 'Full Head Bonding — Maximum Security',
          bullets: [
            { label: 'Method', description: 'Adhesive bonding agent (copolymer) applied across the entire scalp contact area' },
            { label: 'Advantages', description: 'Can provide a secure extended-wear attachment when the selected system and adhesive are used according to manufacturer directions' },
            { label: 'Cure Time', description: 'After bonding, follow the adhesive manufacturer\'s cure and water-exposure instructions before shampooing or wetting the attachment area' },
            { label: 'Removal', description: 'Requires manufacturer-recommended adhesive remover; never pull or force' },
          ],
        },
        {
          id: 'tape',
          label: 'Tape',
          title: 'Tape Attachment — Flexible and Removable',
          bullets: [
            { label: 'Method', description: 'Double-sided adhesive tape applied at the perimeter of the system' },
            { label: 'Advantages', description: 'Easier to remove and reattach; good for clients who take systems off daily' },
            { label: 'Best Practice', description: 'Use manufacturer-recommended tape; replace tape with each reattachment' },
            { label: 'Limitation', description: 'Less secure than full bonding; may lift at edges during heavy activity' },
          ],
        },
        {
          id: 'lace-front',
          label: 'Lace Front',
          title: 'Lace-Front Systems — The Natural Hairline',
          bullets: [
            { label: 'Purpose', description: 'Allows off-the-face styling with an undetectable front hairline' },
            { label: 'Lace Handling', description: 'Delicate lace can be damaged by aggressive tape application or removal. Follow the system and adhesive manufacturer instructions for lace-front attachment.' },
            { label: 'Attachment', description: 'Bonding agent applied to the skin at the hairline, not to the lace itself' },
            { label: 'Best For', description: 'Clients who brush hair back, wear pompadours, or prefer styles that expose the forehead' },
          ],
        },
        {
          id: 'facial',
          label: 'Facial',
          title: 'Facial Hair — Mustaches, Beards, Sideburns',
          bullets: [
            { label: 'Adhesive', description: 'Spirit gum applied to clean, dry facial skin' },
            { label: 'Application', description: 'Wait until gum becomes tacky, position the piece, press gently with lint-free cloth' },
            { label: 'Removal', description: 'Use spirit gum remover; never pull facial hair pieces off dry' },
            { label: 'Best Practice', description: 'Clean the facial area thoroughly before each application' },
          ],
        },
        {
          id: 'full-wig',
          label: 'Full Wig',
          title: 'Full Wigs — Complete Coverage',
          bullets: [
            { label: 'Construction', description: 'Stretch cap made of lightweight elastic with permanent elastic bands at the sides' },
            { label: 'Material', description: 'Usually Kanekalon synthetic fiber for ready-to-wear options' },
            { label: 'Fit', description: 'Should fit comfortably but tightly enough to stay in place without slipping' },
            { label: 'Best For', description: 'Clients with extensive hair loss who want complete coverage and instant style changes' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'bonding-cure-time',
      title: 'Bonding Cure-Time Guidance',
      content: 'After a bonded system is applied, the attachment must be allowed to cure according to the adhesive manufacturer\'s instructions before shampooing, swimming, heavy sweating, or other water exposure. Some source material presents a 24–48 hour window, but cure time depends on the adhesive system and manufacturer directions rather than one universal rule.',
      highlight: 'Follow the adhesive manufacturer\'s cure-time and water-exposure instructions before shampooing',
    },
    {
      type: 'scenarioBlock',
      id: 'attachment-scenario',
      title: 'Restoration Studio Challenge: The Attachment Decision',
      scenarios: [
        {
          situation: 'Your client is a competitive swimmer who wants an extended-wear hair replacement system and expects frequent water exposure. What is the best professional approach?',
          options: [
            { letter: 'A', text: 'Choose perimeter tape automatically because all tape systems tolerate repeated swimming', feedback: 'Too absolute. Water tolerance depends on the specific system, tape, preparation, cure requirements, and manufacturer directions.' },
            { letter: 'B', text: 'Select a system and attachment product specifically rated by the manufacturer for the client\'s expected water exposure, then follow its preparation, cure, and maintenance directions', feedback: 'Correct. Match the attachment to the client\'s use case and verified product instructions instead of assuming every bonding product is waterproof.' },
            { letter: 'C', text: 'A lace-front system with spirit gum attachment', feedback: 'Spirit gum is for facial hair, not full scalp bonding. Wrong product for this application.' },
            { letter: 'D', text: 'A full wig with elastic bands', feedback: 'A wig would shift and lift during swimming. Not secure enough for his lifestyle.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // Section 10: Cleaning, Maintenance, and Chemical Services
    {
      type: 'contentBlock',
      id: 'cleaning-intro',
      title: 'Cleaning and Maintenance — Extending System Life',
      content: 'A hair replacement system is an investment. Proper cleaning and maintenance protect that investment and keep the client looking sharp. Synthetic systems and human hair systems require different cleaning protocols — using the wrong method damages the hair, the base, or both. A backup or rotation system can be useful for some clients when maintenance, repair, or drying time would otherwise leave them without a wearable system. A system that is worn daily and never properly cleaned will mat, tangle, smell, and deteriorate months before its time.',
      highlight: 'Consider a backup or rotation system when it meaningfully supports the client\'s maintenance plan',
    },
    {
      type: 'tabbed',
      id: 'cleaning-methods',
      title: 'Cleaning Methods',
      subtitle: 'Synthetic vs Human Hair — different protocols, different results',
      tabs: [
        {
          id: 'synthetic-cleaning',
          label: 'Synthetic',
          title: 'Cleaning Synthetic Systems',
          bullets: [
            { label: 'Solvent', description: 'Always use manufacturer-recommended solvent — never substitute household cleaners' },
            { label: 'Water Temperature', description: 'Use the temperature range recommended for the specific fiber and system; the source material cautions against hot water on synthetic systems' },
            { label: 'Process', description: 'Attach system to foam block with T-pins; immerse in solvent solution; swish gently; rinse with clean lukewarm water' },
            { label: 'Drying', description: 'Use the drying method and heat limits recommended for the specific system; avoid unverified high-heat shortcuts' },
            { label: 'Dry Cleaning', description: 'Some systems may be dry-cleaned; follow manufacturer instructions exactly' },
          ],
        },
        {
          id: 'human-cleaning',
          label: 'Human',
          title: 'Cleaning Human Hair Systems',
          bullets: [
            { label: 'Products', description: 'Use shampoo and conditioner formulated specifically for hair replacement systems' },
            { label: 'What to Avoid', description: 'No harsh solvents, no acetone, no alcohol-based cleaners — these damage processed human hair' },
            { label: 'Follow Directions', description: 'Always follow manufacturer cleaning instructions; different processing methods require different care' },
            { label: 'Conditioning', description: 'Regular conditioning prevents dryness and brittleness; use small amounts as directed' },
          ],
        },
      ],
    },
    {
      type: 'checklist',
      id: 'basic-care-guidelines',
      title: 'Basic Care Guidelines — The COOL Rules',
      items: [
        { text: 'C — Clean with recommended solvent or shampoo only' },
        { text: 'O — Observe the system\'s approved water-temperature guidance; synthetic systems generally require avoiding hot water' },
        { text: 'O — Overnight drying on a block is preferred' },
        { text: 'L — Let the system dry naturally; cool air if rushed' },
        { text: 'N — Nurture the system\'s shape during storage using the support method recommended for that system' },
        { text: 'O — Opt for styling products that are compatible with the system and use them sparingly' },
        { text: 'H — Handle with care and use tools appropriate for the fiber, base, and manufacturer guidance' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'maintenance-schedule',
      title: 'Maintenance Schedule',
      content: 'The source material presents an initial cleaning after about one week of wear and then a three-to-four-week maintenance interval as a study baseline. Actual service timing should also follow the system manufacturer\'s instructions and be adjusted for attachment method, scalp oils, perspiration, product use, and wear pattern. Recondition treatments should be applied whenever the hair looks dull, feels dry, or loses its natural movement. Color rinses can refresh faded or yellowing systems without the damage of permanent color.',
      highlight: 'Study baseline: first cleaning around one week, then about every 3–4 weeks — adjust to the system and manufacturer guidance',
    },
    {
      type: 'contentBlock',
      id: 'perm-color-systems',
      title: 'Permanent Waving and Coloring Systems',
      content: 'Chemical-service limits depend on the system\'s hair fiber, base construction, prior processing, and manufacturer instructions. For systems specifically approved for permanent waving, the source material presents a floating technique that keeps rods from resting directly on the base by supporting them with roller picks. For color work, use only products and methods approved for the specific system. Do not assume a human-hair system can be lightened, permanently colored, or waved like natural hair; when the manufacturer does not explicitly support the service, do not perform it.',
      highlight: 'Floating rods hover above the base — never let perm rods rest directly on it',
    },
    {
      type: 'contentBlock',
      id: 'memory-anchor-floating',
      title: 'Memory Anchor: Floating Rods = Hovering Helicopters',
      content: 'Picture a helicopter landing pad. The pad is the base of the hair system. The helicopter is the perm rod. If the helicopter lands on the pad, it crushes it. But if the helicopter hovers just above — supported by landing gear — everything stays safe. The roller picks are the landing gear. The rubber band holds them in place. The rod hovers. The base stays perfect. Hovering helicopters. Floating rods. Same idea.',
      highlight: 'Roller picks are landing gear. The rod hovers. The base stays perfect.',
    },

    // Section 11: Cutting, Tapering, and Blending
    {
      type: 'contentBlock',
      id: 'cutting-intro',
      title: 'Cutting and Blending — Making It Invisible',
      content: 'The difference between an obvious hairpiece and an undetectable system is blending. A system can be perfectly fitted and beautifully constructed, but if the transition between system hair and natural hair is visible, the illusion is broken. Cutting and blending require the same precision you use in any haircut, plus an extra layer of artistry — you are not just cutting hair, you are erasing a boundary. The top section is cut at 90-degree elevation using clipper-over-comb or fingers-and-shear. The sides are tapered with slide cutting to create an undetectable transition. The back is blended with thinning shears to soften the line where system meets scalp.',
      highlight: 'You are not just cutting hair — you are erasing the boundary between artificial and natural',
    },
    {
      type: 'checklist',
      id: 'cutting-procedure',
      title: 'Cutting and Blending Procedure',
      items: [
        { text: 'Top Section: Remove excess length with clipper-over-comb or fingers-and-shear at 90° elevation' },
        { text: 'Top Section: Work forward from crown to forehead' },
        { text: 'Top Section: Blend using shears to create seamless transitions' },
        { text: 'Sides: Comb side hair down and blend to natural hairline from temple to sideburn to ear' },
        { text: 'Sides: Taper gradually using slide cutting for undetectable blending' },
        { text: 'Back: Cut excess length from the replacement' },
        { text: 'Back: Use thinning shears to blend system ends with natural hair' },
        { text: 'Bulk Removal: If any area appears heavy, use thinning shears close to the base with narrow partings' },
        { text: 'Final Check: Examine from all angles under different lighting' },
        { text: 'Photo Documentation: Capture front and back views for client records' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'slide-cutting',
      title: 'Slide Cutting — The Invisible Blend',
      content: 'Slide cutting is the technique that makes the magic happen. Instead of cutting straight across — which creates a visible line — the shear slides through the hair at an angle, removing length gradually. This creates a feathered, tapered edge that disappears into the client\'s natural hair. Practice slide cutting on mannequins until the motion feels automatic. Slide cutting is one technique used to create a softer transition when it is appropriate for the system and desired finish.',
      highlight: 'Slide cutting creates a feathered edge that disappears into natural hair',
    },
    {
      type: 'contentBlock',
      id: 'customizing-stock',
      title: 'Customizing Stock Systems',
      content: 'Stock systems arrive with standardized cuts that rarely match the client\'s natural hair perfectly. Your job is to customize. Remove excess length from the top, taper the sides to match the client\'s natural hairline, and thin any heavy areas near the base. Use narrow partings when thinning — wide partings create visible gaps. Be conservative: you can always cut more, but you cannot put hair back. Document every cut with before-and-after photos so the client sees the transformation and you have a reference for future services.',
      highlight: 'Be conservative — you can always cut more, but you cannot put hair back',
    },
    {
      type: 'challengeCard',
      id: 'blending-challenge',
      title: 'Restoration Studio Challenge: Blending Mastery',
      challenges: [
        { badge: 'Technique 1', title: 'Slide Cutting Practice', description: 'Practice slide cutting on a mannequin until the motion is automatic and the edge is feathered.', action: 'Complete 20 slide cuts on a mannequin before attempting on a live system.', difficulty: 'medium' },
        { badge: 'Technique 2', title: 'Thinning Near the Base', description: 'Use the first two teeth of thinning shears close to the base with narrow partings to remove bulk.', action: 'Practice on a sample system until you can thin without creating visible gaps.', difficulty: 'medium' },
        { badge: 'Technique 3', title: 'Angle Check', description: 'Examine your blend from front, back, sides, and top under different lighting.', action: 'Move around the client and check under shop lights, natural light, and dim light.', difficulty: 'easy' },
      ],
    },

    // Section 12: Common Mistakes and Exam Traps
    {
      type: 'contentBlock',
      id: 'common-mistakes',
      title: 'Common Mistakes — Learn from Others\' Errors',
      content: 'Every experienced hair replacement barber has stories of mistakes made and lessons learned. Here are the most common errors — and how to avoid them. Cutting too much during initial customization is a common and difficult-to-reverse mistake. Being too aggressive with thinning shears creates visible gaps. Using water that is too hot for a synthetic system can contribute to fiber or base damage. Using an attachment or removal method that is not approved for delicate lace can damage the front hairline. Promising unrealistic results damages credibility. Exposing a bonded system to water or heavy activity before the adhesive has cured can weaken the attachment. Failing to take color samples results in mismatched systems that look artificial.',
      highlight: 'A common irreversible mistake is removing too much hair during initial customization',
    },
    {
      type: 'checklist',
      id: 'exam-traps',
      title: 'Common Knowledge Traps — Do Not Fall For These',
      items: [
        { text: 'Trap: "A barber should tell a client which Minoxidil formulation and dosing schedule to use." — FALSE. Individualized medication guidance belongs with an appropriate licensed healthcare professional.' },
        { text: 'Trap: "Synthetic hair can be permed with standard solution." — FALSE. Synthetic fiber has limited chemical tolerance.' },
        { text: 'Trap: "Hotter water always cleans synthetic systems better." — FALSE. Follow the system\'s approved temperature guidance; the source material cautions against hot water on synthetic systems.' },
        { text: 'Trap: "Every lace-front system uses the same tape placement." — FALSE. Lace is delicate; use the attachment method approved for that specific system and adhesive.' },
        { text: 'Trap: "Every bonded system can be shampooed immediately." — FALSE. Follow the adhesive manufacturer\'s cure and water-exposure instructions.' },
        { text: 'Trap: "Barbers can perform hair transplantation." — FALSE. Surgical procedures are medical only.' },
        { text: 'Trap: "A human-hair system can automatically receive the same chemical services as natural hair." — FALSE. Fiber, base, prior processing, and manufacturer approval determine what services are appropriate.' },
        { text: 'Trap: "Every client needs exactly two systems." — FALSE. A backup can be useful, but the appropriate number depends on the client\'s wear and maintenance plan.' },
      ],
    },

    // Section 13: Knowledge Checkpoint
    {
      type: 'levelUp',
      id: 'board-exam-checkpoint',
      title: 'Chapter 15 Knowledge Checkpoint',
      levels: [
        { level: '1', title: 'Terminology', description: 'Can define toupee, hairpiece, hair replacement system, and hair solution with historical context', reward: 'Written exam confidence' },
        { level: '2', title: 'Consultation', description: 'Can conduct a private, ethical consultation using the LAB MED framework', reward: 'Client trust and realistic expectations' },
        { level: '3', title: 'Scope of Practice', description: 'Can separate cosmetic hair-replacement services from diagnosis, prescribing, surgery, and individualized medical advice while checking local scope rules', reward: 'Professional boundaries' },
        { level: '4', title: 'Materials', description: 'Can distinguish human, synthetic, and mixed hair and match each to appropriate clients', reward: 'Accurate recommendations' },
        { level: '5', title: 'Base Types', description: 'Understands mesh, polyurethane, lace, thin skin, and combination bases', reward: 'Proper system selection' },
        { level: '6', title: 'Attachment', description: 'Knows full bonding, tape, lace-front care, spirit gum, and full wig methods', reward: 'Secure, comfortable fittings' },
        { level: '7', title: 'Maintenance', description: 'Can explain source-based cleaning guidance while deferring cure time and product-specific care to manufacturer instructions', reward: 'Safer maintenance planning' },
        { level: '8', title: 'Cutting & Blending', description: 'Understands 90° top cutting, slide tapering, and thinning near the base', reward: 'Invisible, natural results' },
      ],
    },

    // Section 14: Key Takeaways
    {
      type: 'contentBlock',
      id: 'key-takeaways',
      title: 'Chapter 15 Key Takeaways',
      content: 'Men\'s hair replacement is a blend of technical skill, ethical practice, and emotional intelligence. Master the consultation. Know your materials. Respect scope of practice. Blend with artistry. And never forget — you are not selling hair. You are restoring the reflection your client wants to see every morning.',
      highlight: 'You are not selling hair. You are restoring the reflection your client wants to see.',
    },
    {
      type: 'checklist',
      id: 'chapter-summary',
      title: 'Restoration Studio Blueprint: Chapter 15 Complete Checklist',
      items: [
        { text: '✓ Terminology evolved: toupee -> hairpiece -> hair replacement system -> hair solution' },
        { text: '✓ Hair replacement is a specialized service built around consultation, fitting, maintenance, and client trust' },
        { text: '✓ Conduct consultations discreetly and protect client privacy and dignity' },
        { text: '✓ Use the LAB MED framework: Lifestyle, Age, Budget, Medical, Expectations, Daily maintenance' },
        { text: '✓ Never promise unrealistic results — credibility depends on honesty' },
        { text: '✓ Marketing works best through social media, in-shop displays, referrals, and personal experience' },
        { text: '✓ Use client photos only with documented permission that meets applicable privacy and advertising requirements' },
        { text: '✓ Recognize that cosmetic, medication, device-based, and surgical hair-loss options exist, and refer medical decisions appropriately' },
        { text: '✓ Provide general education within your licensed scope and refer diagnosis, prescribing, surgery, and individualized medical decisions appropriately' },
        { text: '✓ Human hair: most natural, processable, high maintenance' },
        { text: '✓ Synthetic hair: holds style, lower cost, limited chemical processing' },
        { text: '✓ Mixed hair: human + synthetic/animal fibers for specialized applications' },
        { text: '✓ Base materials differ in breathability, durability, edge visibility, and compatibility with attachment methods; combination bases blend characteristics' },
        { text: '✓ Knotting methods: single knot, double knot, V-loop, single hair injection' },
        { text: '✓ Root-turning prevents tangling by aligning cuticles in natural growth direction' },
        { text: '✓ Stock systems: faster, cheaper, standard sizes — customize with cutting' },
        { text: '✓ Custom systems use client-specific measurements or templates for a more individualized fit and typically require more time and cost' },
        { text: '✓ Measure in inches: length by width (e.g., 6x4 means 6" front-to-back, 4" side-to-side)' },
        { text: '✓ Take color samples from crown, temple, side, and back — especially for gray blending' },
        { text: '✓ Bonded attachments require product-specific preparation, cure, water-exposure, removal, and maintenance instructions' },
        { text: '✓ Treat lace as delicate and follow the system/adhesive manufacturer\'s approved attachment and removal method' },
        { text: '✓ Facial hair attaches with spirit gum on clean, dry skin' },
        { text: '✓ Follow the synthetic system\'s approved cleaner and water-temperature guidance; the source material cautions against hot water' },
        { text: '✓ Clean human hair systems with manufacturer-formulated shampoo and conditioner' },
        { text: '✓ Study baseline: initial cleaning around one week and then about every 3–4 weeks, adjusted to manufacturer guidance and client wear conditions' },
        { text: '✓ A backup or rotation system may be useful when it supports the client\'s maintenance plan' },
        { text: '✓ Store and support the system in a way that preserves its shape, following manufacturer care guidance' },
        { text: '✓ Top section cut at 90° elevation; sides tapered with slide cutting; back blended with thinning shears' },
        { text: '✓ Floating perm rods above the base using roller picks — never let rods rest on the base' },
        { text: '✓ Chemical services depend on fiber, base, prior processing, and manufacturer approval; do not assume natural-hair procedures are safe for a system' },
        { text: '✓ Keep cosmetic hair-replacement services separate from diagnosis, prescribing, surgery, and individualized medical advice; verify local scope rules' },
      ],
    },
  ],
}
