// Chapter 8: Basics of Electricity — PREMIUM IMMERSIVE EXPERIENCE
// THE POWER GRID COMMAND CENTER — Master Electrical Systems, Safety & Therapy

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ═══════════════════════════════════════════════
// POWER GRID THEME — Industrial Command Center
// Dark charcoal steel / High-voltage cyan / Warning amber / Circuit green
// Feels like: A high-tech electrical control room behind the barbershop
// ═══════════════════════════════════════════════

export const chapter8PremiumTheme: ChapterTheme = {
  primary: '#00E5FF',
  primaryLight: '#80F0FF',
  primaryDark: '#00B8D4',
  secondary: '#FFB300',
  background: 'rgba(18, 22, 28, 0.96)',
  backgroundAlt: 'rgba(28, 33, 42, 0.92)',
  surface: '#12161C',
  border: 'rgba(0, 229, 255, 0.25)',
  text: '#E8F4F8',
  textMuted: '#8BA4B4',
  highlight: '#FFB300',
  timeline: {
    line: 'rgba(0, 229, 255, 0.35)',
    iconBg: '#1C212A',
    iconBorder: '#00E5FF',
  },
  quote: {
    border: 'rgba(0, 229, 255, 0.4)',
    icon: 'rgba(0, 229, 255, 0.3)',
    bg: 'rgba(18, 22, 28, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(0, 229, 255, 0.15)',
    activeBorder: 'rgba(0, 229, 255, 0.5)',
    activeText: '#80F0FF',
    inactiveBg: 'rgba(18, 22, 28, 0.7)',
    inactiveBorder: 'rgba(0, 229, 255, 0.12)',
    inactiveText: '#8BA4B4',
    panelBg: 'rgba(18, 22, 28, 0.85)',
    panelBorder: 'rgba(0, 229, 255, 0.18)',
  },
  toolCard: {
    headerBg: 'rgba(0, 229, 255, 0.1)',
    headerText: '#80F0FF',
    dot: 'rgba(0, 229, 255, 0.6)',
    line: 'rgba(0, 229, 255, 0.25)',
  },
  featureGrid: {
    iconBg: 'rgba(0, 229, 255, 0.15)',
    iconColor: '#00E5FF',
    cardBorder: 'rgba(0, 229, 255, 0.2)',
  },
  milestone: {
    yearColor: '#00E5FF',
    border: 'rgba(0, 229, 255, 0.22)',
  },
  checklist: {
    checkBorder: 'rgba(0, 229, 255, 0.4)',
    checkColor: '#00E5FF',
    bg: 'rgba(18, 22, 28, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(18, 22, 28, 0.7)',
    border: 'rgba(0, 229, 255, 0.18)',
    highlightColor: '#FFB300',
  },
  challengeCard: {
    badgeBg: 'rgba(255, 179, 0, 0.15)',
    badgeText: '#FFB300',
    cardBorder: 'rgba(0, 229, 255, 0.22)',
    completedBg: 'rgba(0, 230, 118, 0.1)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(255, 179, 0, 0.06)',
    optionBorder: 'rgba(0, 229, 255, 0.18)',
    correctBg: 'rgba(0, 230, 118, 0.1)',
    incorrectBg: 'rgba(255, 82, 82, 0.08)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(0, 229, 255, 0.15)',
    levelBadgeText: '#80F0FF',
    rewardBg: 'rgba(0, 230, 118, 0.1)',
    rewardText: '#00E676',
  },
  actionPrompt: {
    cardBorder: 'rgba(0, 229, 255, 0.18)',
    completedBorder: 'rgba(0, 230, 118, 0.3)',
    benefitBg: 'rgba(0, 229, 255, 0.08)',
    benefitBorder: 'rgba(0, 229, 255, 0.25)',
  },
}

// ═══════════════════════════════════════════════
// PREMIUM IMMERSIVE CHAPTER 8 CONTENT
// ═══════════════════════════════════════════════

export const chapter8PremiumContent: ChapterContent = {
  chapterNumber: 8,
  title: 'BASICS OF ELECTRICITY',
  subtitle: 'Command the Power Grid — Master Every Volt, Amp, and Safety Protocol',
  theme: chapter8PremiumTheme,
  sections: [
    // ═══════════════════════════════════════════
    // SECTION 1: COMMAND CENTER WELCOME
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'command-center-welcome',
      title: '⚡ THE POWER GRID COMMAND CENTER',
      content: 'Welcome to the nerve center of your barbershop. Every light, every clipper, every steamer, every treatment device — they all draw power from the grid you are about to master. Electricity is not visible, but its presence is undeniable. A single mistake can shock a client, start a fire, or destroy your tools. A single mastery can save lives, prevent disasters, and unlock advanced services that set you apart.\n\nThis is not a physics lecture. This is your Electrical Safety Certification. You will learn to read the grid like a pilot reads instruments — knowing what every number means, what every warning signals, and what every protocol protects. By the end of this chapter, you will not just plug in tools. You will command the power behind the chair.',
      highlight: 'COMMAND THE GRID — PROTECT THE CHAIR — MASTER THE POWER',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: WHY ELECTRICITY MATTERS
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'why-electricity-matters',
      title: 'WHY THE GRID MATTERS',
      subtitle: 'Three reasons electrical knowledge matters behind the chair',
      cards: [
        {
          icon: 'ShieldAlert',
          title: 'ELECTRICAL SAFETY',
          text: 'Wet hands, damaged cords, overloaded circuits, and unprotected electrical use near water can create serious shock, burn, and fire hazards. Recognizing unsafe conditions and following equipment instructions helps reduce risk to the barber and client.',
        },
        {
          icon: 'Zap',
          title: 'TOOL MASTERY',
          text: 'Why does your dryer overheat? Why does your cordless clipper die faster than it should? Why does the breaker trip when two tools run together? Electrical knowledge answers these questions — saving you money, downtime, and frustration.',
        },
        {
          icon: 'Sparkles',
          title: 'ADVANCED SERVICES',
          text: 'Some jurisdictions permit barbers to use electrotherapy or light-based devices for facial or scalp services. These modalities require appropriate training, client screening, manufacturer-directed use, and compliance with the barber's actual scope of practice.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: ELECTRICAL CERTIFICATION LEVELS
    // ═══════════════════════════════════════════
    {
      type: 'levelUp',
      id: 'electrical-certification',
      title: '⚡ ELECTRICAL MASTERY PATH',
      subtitle: 'Progress from fundamentals to safer professional decision-making',
      levels: [
        {
          level: 'Level 1',
          title: 'Apprentice Technician',
          description: 'You know the basics: what electricity is, how it flows, and why it is dangerous. You can identify safe and unsafe conditions in your station.',
          reward: 'Station Safety Badge — Clients trust your clean, organized setup',
        },
        {
          level: 'Level 2',
          title: 'Circuit Monitor',
          description: 'You understand volts, amps, ohms, and watts. You can read tool ratings, calculate circuit loads, and spot overloaded outlets before they fail.',
          reward: 'Equipment Guardian — Your tools last longer and perform better',
        },
        {
          level: 'Level 3',
          title: 'Safety Inspector',
          description: 'You know every safety device: fuses, breakers, GFCI, grounding, UL marks. You inspect cords, test outlets, and enforce safety protocols in your shop.',
          reward: 'Shop Safety Officer — Coworkers look to you for electrical guidance',
        },
        {
          level: 'Level 4',
          title: 'Therapy Specialist',
          description: 'You can explain source-covered electrotherapy and light-therapy modalities and identify when scope-of-practice, client condition, or device instructions require a different choice.',
          reward: 'Service-Scope Awareness — Know when a modality is permitted and appropriate',
        },
        {
          level: 'Level 5',
          title: 'Grid Master',
          description: 'You can recognize shop-level electrical risks, read equipment ratings, avoid unsafe loading practices, and know when an electrical condition requires a qualified professional rather than barber repair.',
          reward: 'Safety Decision-Maker — Use electrical knowledge without exceeding barber scope',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 4: WHAT IS ELECTRICITY
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'what-is-electricity',
      title: 'WHAT IS ELECTRICITY?',
      content: 'Electricity is NOT matter. It does not occupy space or have mass like a chair or a clipper. It is a FORM OF ENERGY — invisible, powerful, and capable of producing physical, magnetic, chemical, or thermal effects when it moves.\n\nElectricity is created by the FLOW OF ELECTRONS between atoms. Imagine electrons as tiny particles orbiting the nucleus of an atom. When they break free and jump from atom to atom, they create an electric current. This flow powers everything from your phone charger to your high-frequency facial machine.\n\nEXAM FOCUS: Electricity is energy rather than matter, and moving electrical energy can produce physical, magnetic, chemical, or thermal effects.',
      highlight: 'ELECTRICITY = ENERGY IN MOTION',
    },

    // ═══════════════════════════════════════════
    // SECTION 5: CONDUCTORS VS INSULATORS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'conductors-insulators',
      title: 'CONDUCTORS VS INSULATORS',
      subtitle: 'Know what transmits power and what blocks it',
      tabs: [
        {
          id: 'conductors',
          label: 'CONDUCTORS',
          title: '⚡ CONDUCTORS — THE HIGHWAYS OF ELECTRICITY',
          bullets: [
            { label: 'DEFINITION', description: 'Substances that EASILY transmit electricity — electrons flow through them with minimal resistance' },
            { label: 'EXAMPLES', description: 'Most metals (copper, aluminum, silver), carbon, the HUMAN BODY, and watery solutions of acids and salts' },
            { label: 'BARBER REALITY', description: 'The human body can conduct electricity, and moisture can increase electrical hazard. Keep electrical equipment and cords dry and follow equipment and facility safety requirements around water.' },
            { label: 'WIRE DESIGN', description: 'Electrical wire contains twisted metal threads (conductor) coated with an insulator (plastic, rubber, or silk)' },
          ],
          facts: [
            { text: 'EXAM FOCUS: The human body can conduct electricity; wet-hand and water exposure increase electrical risk.' },
            { text: 'COPPER is the most common conductor in wiring because it combines excellent conductivity with affordability.' },
          ],
        },
        {
          id: 'insulators',
          label: 'INSULATORS',
          title: '🛡️ INSULATORS — THE BARRIERS OF SAFETY',
          bullets: [
            { label: 'DEFINITION', description: 'Substances that do NOT easily transmit electricity — electrons cannot flow through them freely' },
            { label: 'EXAMPLES', description: 'Rubber, silk, dry wood, glass, cement, plastic, and porcelain' },
            { label: 'BARBER REALITY', description: 'Tool handles, cord coatings, and safety equipment use insulators to protect you from shock' },
            { label: 'DANGER ZONE', description: 'Do not treat materials such as dry wood, rubber, or plastic as guaranteed protection. Moisture, damage, contamination, or unsuitable materials can reduce effective insulation and increase risk.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Rubber and many plastics resist electrical flow, but safe practice still depends on intact equipment, proper grounding/protection, and dry conditions.' },
            { text: 'DAMAGED INSULATION on cords exposes conductors — replace frayed cords immediately. Tape is not a permanent fix.' },
          ],
        },
        {
          id: 'circuits',
          label: 'CIRCUITS',
          title: '🔌 CIRCUITS — THE PATH OF POWER',
          bullets: [
            { label: 'COMPLETE CIRCUIT', description: 'The path of electric current from the source, through conductors and devices, and back to the source' },
            { label: 'OPEN CIRCUIT', description: 'A break in the path — electricity cannot flow. A switched-off light creates an open circuit.' },
            { label: 'SHORT CIRCUIT', description: 'Electricity takes an unintended shortcut, bypassing the device. Causes overheating and fire risk.' },
            { label: 'GROUNDING', description: 'Provides a safe escape path for electricity in case of malfunction — the third prong on modern plugs' },
          ],
          facts: [
            { text: 'EXAM FOCUS: A complete circuit provides a path for current; opening the circuit interrupts that path.' },
            { text: 'Do not defeat a grounding connection to make equipment fit an incompatible outlet. Use equipment and adapters only as permitted by the manufacturer and applicable electrical requirements.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 6: DC VS AC
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'current-types',
      title: 'DC VS AC — THE TWO TYPES OF CURRENT',
      subtitle: 'Know what powers your tools and why it matters',
      features: [
        {
          icon: 'BatteryCharging',
          title: 'DIRECT CURRENT (DC)',
          description: 'Constant, even flow in ONE DIRECTION only. Produced by chemical means (batteries). Powers cordless clippers, flashlights, and battery-operated trimmers.',
        },
        {
          icon: 'PlugZap',
          title: 'ALTERNATING CURRENT (AC)',
          description: 'Rapid, interrupted flow that REVERSES DIRECTION. Produced by mechanical means (generators). Powers wall-outlet tools: clippers, dryers, and shop equipment.',
        },
        {
          icon: 'RefreshCcw',
          title: 'CONVERTER / RECTIFIER',
          description: 'A converter changes DC to AC; a rectifier changes AC to DC. Rechargeable equipment commonly uses a power supply or charger that converts wall-supplied AC into the DC needed by the battery.',
        },
        {
          icon: 'AlertTriangle',
          title: 'EXAM FOCUS',
          description: 'DC = one direction (battery). AC = reverses direction (wall outlet). Most barber tools use AC. Cordless tools use DC with converters for charging.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 7: ELECTRICAL MEASUREMENTS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'electrical-measurements',
      title: 'THE FOUR MEASUREMENTS OF POWER',
      subtitle: 'Volts, amps, ohms, watts — the language of electricity',
      tabs: [
        {
          id: 'volt',
          label: 'VOLT (V)',
          title: 'VOLT — ELECTRICAL PRESSURE',
          bullets: [
            { label: 'WHAT IT MEASURES', description: 'The PRESSURE that pushes electrons through a conductor. Higher voltage = harder push.' },
            { label: 'WATER ANALOGY', description: 'Like water pressure in a pipe — high pressure pushes more water through; high voltage pushes more electrons through.' },
            { label: 'BARBER REALITY', description: 'Many U.S. receptacles provide about 120 V, while some equipment uses other supply voltages. Match the appliance rating to the available supply and use only manufacturer-approved conversion equipment.' },
            { label: 'SAFETY RULE', description: 'Shock severity depends on multiple conditions, including voltage, current path, contact time, environment, and body resistance. Treat all energized equipment as potentially hazardous and respect the equipment rating.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Volt = electrical pressure. Standard US voltage is 110–120V.' },
            { text: 'Do not connect equipment to an incompatible supply. Follow the nameplate and manufacturer instructions for voltage, frequency, and approved conversion devices.' },
          ],
        },
        {
          id: 'ampere',
          label: 'AMPERE (A)',
          title: 'AMPERE — CURRENT STRENGTH',
          bullets: [
            { label: 'WHAT IT MEASURES', description: 'The STRENGTH or RATE of electrical current flow. More amps = more current moving through the wire.' },
            { label: 'MILLIAMPERE', description: '1/1,000 of an ampere. Used for facial and scalp electrotherapy treatments — extremely low current for safety.' },
            { label: 'WATER ANALOGY', description: 'Like the volume of water flowing through a pipe — more amps = more water (electricity) flowing.' },
            { label: 'BARBER REALITY', description: 'Circuit breakers are rated in amps. A 15-amp breaker trips when current exceeds safe levels. Two high-wattage dryers on one 20-amp circuit will trip it.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Ampere = current strength. Milliampere = 1/1,000 amp, used for facial/scalp treatments.' },
            { text: 'Current through the body can cause serious injury. Do not use a single current value as a universal danger threshold; prevent contact with energized conductors and follow electrical-safety procedures.' },
          ],
        },
        {
          id: 'ohm',
          label: 'OHM (Ω)',
          title: 'OHM — ELECTRICAL RESISTANCE',
          bullets: [
            { label: 'WHAT IT MEASURES', description: 'RESISTANCE to electrical flow. Higher resistance = less current passes through.' },
            { label: 'WATER ANALOGY', description: 'Like a narrow section of pipe that restricts water flow — more ohms = less electricity gets through.' },
            { label: 'BARBER REALITY', description: 'A damaged, unusually warm, loose, or discolored cord or plug is an equipment warning sign. Remove the tool from service and follow manufacturer or qualified-repair guidance rather than diagnosing the fault at the station.' },
            { label: 'RHEOSTAT', description: 'An adjustable resistor for controlling current. Used in light dimmers and some tool speed controls.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Ohm = resistance. Higher ohms = less current. A rheostat is an adjustable resistor.' },
            { text: 'Unexpected cord or plug heating can indicate an unsafe equipment or connection condition. Stop use and have the condition evaluated rather than assuming a single cause.' },
          ],
        },
        {
          id: 'watt',
          label: 'WATT (W)',
          title: 'WATT — ELECTRICAL POWER',
          bullets: [
            { label: 'WHAT IT MEASURES', description: 'POWER — the rate of energy used per second. Watts = Amps × Volts.' },
            { label: 'KILOWATT', description: '1,000 watts. Household electricity is billed in kilowatt-hours (kWh).' },
            { label: 'BARBER REALITY', description: 'A 1,800-watt hair dryer at 120V draws 15 amps. Two dryers on one circuit = 30 amps = tripped breaker on a 20-amp circuit.' },
            { label: 'TOOL SELECTION', description: 'Wattage is electrical power demand. A higher wattage rating does not by itself guarantee better service performance, and it can increase circuit load.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Watt = power (amps × volts). Kilowatt = 1,000 watts.' },
            { text: 'Use equipment ratings to understand load, avoid overloaded receptacles or power strips, and follow the facility's electrical design and manufacturer instructions.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8: ELECTRICAL FORMULA FOUNDATIONS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'electrical-formula-foundations',
      title: '⚡ ELECTRICAL FORMULA FOUNDATIONS',
      content: 'Before you face the Circuit Breaker Challenge, you need the formulas that make load calculations possible. These four terms — volt, amp, watt, and ohm — are the building blocks of every electrical decision in your shop. Master them now, and the challenge becomes simple arithmetic.',
      highlight: 'FORMULAS FIRST — CHALLENGE SECOND',
    },

    // ═══════════════════════════════════════════
    // SECTION 8A: THE FOUR TERMS
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'four-terms-grid',
      title: 'THE FOUR TERMS — WHAT THEY MEAN',
      subtitle: 'Know the language before you do the math',
      features: [
        {
          icon: 'Gauge',
          title: 'VOLT (V) — ELECTRICAL PRESSURE',
          description: 'Think of voltage like water pressure in a pipe. Higher voltage pushes harder. US standard outlets deliver 110–120V.',
        },
        {
          icon: 'ArrowRightLeft',
          title: 'AMP / AMPERE (A) — ELECTRICAL CURRENT',
          description: 'Think of amps like the volume of water flowing through the pipe. More amps = more electricity moving through the wire.',
        },
        {
          icon: 'Lightbulb',
          title: 'WATT (W) — ELECTRICAL POWER',
          description: 'Think of watts as the actual work being done. A 1,800W hair dryer does more work (produces more heat) than a 600W steamer.',
        },
        {
          icon: 'Shield',
          title: 'OHM (Ω) — ELECTRICAL RESISTANCE',
          description: 'Think of ohms like a narrow section of pipe that restricts flow. More resistance = less current gets through.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8B: THE THREE FORMULAS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'three-formulas',
      title: 'THE THREE FORMULAS YOU MUST KNOW',
      content: 'Every circuit calculation uses one of these three formulas. Memorize them. They will appear on your board exam and in your shop every single day.\n\nFORMULA 1 — FIND POWER (WATTS):\nWatts = Volts × Amps\n\nFORMULA 2 — FIND CURRENT (AMPS):\nAmps = Watts ÷ Volts\n\nFORMULA 3 — FIND PRESSURE (VOLTS):\nVolts = Watts ÷ Amps\n\nEXAM FOCUS: Watts = Volts × Amps is the most tested formula. If you know two values, you can always find the third.',
      highlight: 'WATTS = VOLTS × AMPS | AMPS = WATTS ÷ VOLTS | VOLTS = WATTS ÷ AMPS',
    },

    // ═══════════════════════════════════════════
    // SECTION 8C: WORKED EXAMPLES
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'worked-examples',
      title: 'WORKED EXAMPLES — STEP BY STEP',
      subtitle: 'See the formulas in action with real barber shop tools',
      tabs: [
        {
          id: 'example-1',
          label: 'EXAMPLE 1',
          title: 'EXAMPLE 1: FIND WATTS',
          bullets: [
            { label: 'THE PROBLEM', description: 'Your clipper is rated 120V and draws 2A. How many watts does it use?' },
            { label: 'THE FORMULA', description: 'Watts = Volts × Amps' },
            { label: 'PLUG IN', description: '120V × 2A = 240W' },
            { label: 'ANSWER', description: 'The clipper uses 240 watts of power.' },
          ],
          facts: [
            { text: 'This is a low-wattage tool. A 240W clipper will not trip any breaker on its own.' },
            { text: 'BOARD EXAM TIP: When you see "V" and "A" given, multiply to find watts.' },
          ],
        },
        {
          id: 'example-2',
          label: 'EXAMPLE 2',
          title: 'EXAMPLE 2: FIND AMPS',
          bullets: [
            { label: 'THE PROBLEM', description: 'Your hair dryer is rated 600W on a 120V circuit. How many amps does it draw?' },
            { label: 'THE FORMULA', description: 'Amps = Watts ÷ Volts' },
            { label: 'PLUG IN', description: '600W ÷ 120V = 5A' },
            { label: 'ANSWER', description: 'The dryer draws 5 amps of current.' },
          ],
          facts: [
            { text: 'A 20-amp breaker can safely handle four of these dryers (4 × 5A = 20A).' },
            { text: 'BOARD EXAM TIP: When you see "W" and "V" given, divide watts by volts to find amps.' },
          ],
        },
        {
          id: 'example-3',
          label: 'EXAMPLE 3',
          title: 'EXAMPLE 3: STATION LOAD',
          bullets: [
            { label: 'THE PROBLEM', description: 'Your station has a 1,200W dryer, a 240W clipper, and a 100W lamp on one 20-amp circuit at 120V. Will the breaker trip?' },
            { label: 'STEP 1', description: 'Add total watts: 1,200W + 240W + 100W = 1,540W' },
            { label: 'STEP 2', description: 'Find total amps: 1,540W ÷ 120V = 12.8A' },
            { label: 'ANSWER', description: '12.8A is under 20A. The breaker will NOT trip.' },
          ],
          facts: [
            { text: 'You still have room (about 7 amps) before the breaker trips. But add another 1,200W dryer and you hit 22.8A — TRIP.' },
            { text: 'SAFETY RULE: Stay under 80% of breaker rating. For a 20A breaker, keep load under 16A.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8D: BARBER SHOP SAFETY MEANING
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'barber-safety-meaning',
      title: '🔌 WHY THIS MATTERS IN YOUR SHOP',
      content: 'These formulas help you interpret equipment ratings and recognize when several devices may place a heavy load on the same circuit.\n\nOVERLOADED CIRCUITS: Too many high-watt devices on one circuit draw more amps than the breaker allows. Protective devices are designed to interrupt unsafe conditions. Repeated tripping is a warning to stop and have the load or equipment condition evaluated.\n\nYOUR TOOLS: Clippers, dryers, steamers, hot towel cabinets, and permitted electrical or light-based devices all draw power. A single station might have 3,000+ watts running simultaneously. On a 120V circuit, that is 25 amps — enough to trip a 20-amp breaker instantly.\n\nTHE REAL COST: A tripped breaker interrupts service and may signal an overload or equipment problem. Treat repeated trips, unusual heat, damaged cords, or burning odors as stop-use conditions.\n\nTHE SOLUTION: Calculate before you plug in. Spread high-draw tools across multiple circuits. Know your shop\'s electrical layout. Respect the math — it protects your clients, your tools, and your livelihood.',
      highlight: 'CALCULATE BEFORE YOU PLUG — SPREAD THE LOAD — RESPECT THE MATH',
    },

    // ═══════════════════════════════════════════
    // SECTION 9: SAFETY DEVICES
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'safety-devices',
      title: 'THE FIVE GUARDIANS OF SAFETY',
      subtitle: 'These devices exist to protect you, your clients, and your shop',
      features: [
        {
          icon: 'Flame',
          title: 'FUSE',
          description: 'A fuse opens a circuit when excessive current causes its element to melt. A blown fuse must be replaced with the correct type and rating by an appropriate person.',
        },
        {
          icon: 'ShieldCheck',
          title: 'CIRCUIT BREAKER',
          description: 'A circuit breaker opens a circuit when specified fault or overload conditions occur. Do not repeatedly reset a breaker without addressing the cause of the trip.',
        },
        {
          icon: 'Anchor',
          title: 'GROUNDING',
          description: 'Grounding provides a lower-resistance fault path that supports protective-device operation. Do not defeat a grounding pin or modify a plug to fit an incompatible receptacle.',
        },
        {
          icon: 'Droplets',
          title: 'GFCI',
          description: 'A ground-fault circuit interrupter monitors current imbalance and disconnects power rapidly when a ground-fault condition is detected. Use GFCI protection where required by the facility's applicable electrical code, especially in locations with water exposure.',
        },
        {
          icon: 'BadgeCheck',
          title: 'UL MARK',
          description: 'A recognized third-party certification/listing mark indicates the product was evaluated to specified safety standards. Verify that equipment is approved/listed as required for the workplace rather than relying on appearance alone.',
        },
        {
          icon: 'AlertTriangle',
          title: 'EXAM FOCUS',
          description: 'Know the function of fuses, circuit breakers, grounding, ground-fault protection, and recognized equipment certification/listing marks.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 10: CIRCUIT BREAKER CHALLENGE
    // ═══════════════════════════════════════════
    {
      type: 'challengeCard',
      id: 'circuit-breaker-challenge',
      title: '⚡ CIRCUIT BREAKER CHALLENGE',
      subtitle: 'Test your load calculation skills — calculate first, then check your work',
      challenges: [
        {
          badge: 'EASY',
          title: 'Single Tool Check',
          description: 'Your clipper is rated 120V and draws 0.5A. How many watts does it draw?\n\n📝 DO THE MATH FIRST — Then scroll down to check your work.',
          action: 'CHECK YOUR WORK:\n\nFormula: Watts = Volts × Amps\n120V × 0.5A = 60W\n\n✅ The clipper draws 60 watts.',
          difficulty: 'easy',
        },
        {
          badge: 'MEDIUM',
          title: 'Station Load Test',
          description: 'Your station has a 1,800W dryer, a 60W clipper, and a 100W steamer all plugged into one 20-amp circuit at 120V. Will the breaker trip?\n\n📝 DO THE MATH FIRST — Then scroll down to check your work.',
          action: 'CHECK YOUR WORK:\n\nStep 1: Add total watts\n1,800W + 60W + 100W = 1,960W\n\nStep 2: Find total amps\n1,960W ÷ 120V = 16.3A\n\nStep 3: Compare to breaker rating\n16.3A < 20A\n\n✅ The breaker will NOT trip. But add another 1,800W dryer (total 3,760W = 31.3A) and it WILL trip.',
          difficulty: 'medium',
        },
        {
          badge: 'HARD',
          title: 'Shop Wiring Puzzle',
          description: 'Your shop has three 20-amp circuits at 120V. You need to power six 1,800W hair dryers. How do you distribute them so no breaker trips?\n\n📝 DO THE MATH FIRST — Then scroll down to check your work.',
          action: 'CHECK YOUR WORK:\n\nStep 1: Find amps per dryer\n1,800W ÷ 120V = 15A per dryer\n\nStep 2: Check capacity per circuit\nTwo dryers = 30A > 20A (TRIPS)\nOne dryer + small tools = ~16A < 20A (SAFE)\n\nStep 3: Evaluate the puzzle\nThree circuits can each safely handle ONE dryer plus small tools.\n\n❌ You CANNOT fit six 1,800W dryers on three 20-amp circuits without tripping breakers.\n\n✅ SOLUTION: You need six separate 20-amp circuits, OR lower-wattage dryers (e.g., 1,200W dryers draw 10A each — two per circuit = 20A, which fits safely).',
          difficulty: 'hard',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 11: NON-NEGOTIABLE SAFETY RULES
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'safety-rules',
      title: '🔒 ELECTRICAL EQUIPMENT SAFETY CHECKLIST',
      items: [
        { text: 'Read manufacturer instructions before using electrical equipment' },
        { text: 'Disconnect tools when not in use — never leave them running unattended' },
        { text: 'Inspect cords, plugs, and equipment regularly and before use when condition is uncertain' },
        { text: 'Do not overload receptacles or power strips; use equipment ratings and facility guidance to understand load' },
        { text: 'Protect the client from unintended contact with energized or metal equipment surfaces during treatment' },
        { text: 'Avoid simultaneous contact with conductive metal objects when electrical equipment is in use' },
        { text: 'NEVER leave a client unattended with an electrical device running' },
        { text: 'Keep hands and electrical equipment dry and use required ground-fault protection around water' },
        { text: 'Use workplace-appropriate equipment carrying recognized safety certification/listing when required' },
        { text: 'Replace frayed cords immediately — tape is not a permanent fix' },
        { text: 'Use ground-fault protection in locations where required by applicable electrical code and facility policy' },
        { text: 'Never remove the grounding pin from a three-prong plug' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 12: ELECTROTHERAPY INTRO
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'electrotherapy-intro',
      title: 'ELECTROTHERAPY — TERMINOLOGY & SCOPE',
      content: 'Electrotherapy uses controlled electric currents for facial and scalp treatments. These services can be valuable add-ons when permitted by state regulations and performed with proper training.\n\nUnderstanding polarity, current types, and treatment effects separates the barber who merely performs services from the barber who customizes treatments for each client\'s needs.\n\nEXAM FOCUS: Electrotherapy modalities vary by state. Know your state\'s regulations before offering these services.',
      highlight: 'KNOW YOUR STATE REGULATIONS',
    },

    // ═══════════════════════════════════════════
    // SECTION 13: POLARITY & ELECTRODES
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'polarity',
      title: 'POLARITY & ELECTRODES',
      subtitle: 'The positive and negative poles of electrotherapy',
      features: [
        {
          icon: 'PlusCircle',
          title: 'ANODE (+) — POSITIVE POLE',
          description: 'Usually marked red in the source. The positive pole is associated with acidic reactions and source-described cataphoretic effects. Treat these as modality concepts, not universal treatment promises.',
        },
        {
          icon: 'MinusCircle',
          title: 'CATHODE (–) — NEGATIVE POLE',
          description: 'Usually marked black in the source. The negative pole is associated with alkaline reactions and source-described anaphoretic effects. Treat these as modality concepts, not universal treatment promises.',
        },
        {
          icon: 'ArrowLeftRight',
          title: 'POLARITY',
          description: 'Polarity identifies the positive or negative pole of a current. Correct polarity matters when a permitted device or procedure requires a specific electrode setup.',
        },
        {
          icon: 'AlertTriangle',
          title: 'EXAM FOCUS',
          description: 'Anode = positive (+) and is commonly marked red; cathode = negative (–) and is commonly marked black. Know the source-described polarity associations without treating color alone as a safety control.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 14: GALVANIC CURRENT DEEP DIVE
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'galvanic-current',
      title: 'GALVANIC CURRENT — THE CHEMICAL CURRENT',
      subtitle: 'Direct-current concepts for permitted skin services',
      tabs: [
        {
          id: 'basics',
          label: 'BASICS',
          title: 'GALVANIC CURRENT FUNDAMENTALS',
          bullets: [
            { label: 'TYPE', description: 'DC (direct current) used at device-controlled levels for permitted skin services; "low voltage" does not remove the need for training, screening, and manufacturer-directed use' },
            { label: 'EFFECT', description: 'The source describes chemical and ionic effects when galvanic current passes through body tissues and fluids' },
            { label: 'METHOD', description: 'Uses an active electrode (positive or negative) placed on the treatment area' },
            { label: 'STATE REGULATIONS', description: 'Availability varies by state — check local regulations before offering galvanic services' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Galvanic current = DC, low voltage, produces chemical changes. Know anode vs cathode effects.' },
            { text: 'Do not improvise polarity tests or electrode procedures. Use the device only within training, scope, and manufacturer directions.' },
          ],
        },
        {
          id: 'positive',
          label: 'POSITIVE (+)',
          title: 'POSITIVE POLE — CATAPHORESIS',
          bullets: [
            { label: 'REACTION', description: 'Produces ACIDIC reactions in the skin' },
            { label: 'PORE EFFECT', description: 'Source-described cataphoretic effect: closes/contracting action on tissue' },
            { label: 'NERVE EFFECT', description: 'Source-described effect: soothing action on nerves' },
            { label: 'BLOOD EFFECT', description: 'Source-described effect: decreased blood supply and vessel contraction' },
            { label: 'TISSUE EFFECT', description: 'Source-described effect: tissue hardening/firming' },
            { label: 'PROCESS', description: 'CATAPHORESIS — introducing positive ions into the skin' },
          ],
          facts: [
            { text: 'MNEMONIC: POSITIVE = CLOSE (pores), CALM (nerves), CONTRACT (vessels), FIRM (tissue).' },
            { text: 'Do not turn source-described pole effects into a universal service sequence. Follow the specific procedure, product, and device directions.' },
          ],
        },
        {
          id: 'negative',
          label: 'NEGATIVE (–)',
          title: 'NEGATIVE POLE — ANAPHORESIS',
          bullets: [
            { label: 'REACTION', description: 'Produces ALKALINE reactions in the skin' },
            { label: 'PORE EFFECT', description: 'Source-described anaphoretic effect: opening/softening action' },
            { label: 'NERVE EFFECT', description: 'Source-described effect: stimulating action on nerves' },
            { label: 'BLOOD EFFECT', description: 'Source-described effect: increased blood supply and vessel expansion' },
            { label: 'TISSUE EFFECT', description: 'Source-described effect: tissue softening' },
            { label: 'PROCESS', description: 'ANAPHORESIS — introducing negative ions into the skin' },
          ],
          facts: [
            { text: 'MNEMONIC: NEGATIVE = OPEN (pores), STIMULATE (nerves), EXPAND (vessels), SOFTEN (tissue).' },
            { text: 'Do not turn source-described pole effects into a universal service sequence. Follow the specific procedure, product, and device directions.' },
          ],
        },
        {
          id: 'advanced',
          label: 'ADVANCED',
          title: 'DESINCUSTATION & IONTOPHORESIS',
          bullets: [
            { label: 'DESINCUSTATION', description: 'Source-described galvanic cleansing process that creates an alkaline reaction intended to emulsify sebum and debris in pores.' },
            { label: 'IONTOPHORESIS', description: 'Source-described process for introducing ions from water-soluble products. Electrode/product selection must follow the specific professional procedure and product/device directions.' },
            { label: 'CLIENT COMFORT', description: 'Unexpected burning, stinging, pain, or excessive discomfort is a stop-service signal. Turn the device off and follow the manufacturer's safety procedure.' },
            { label: 'CONTRAINDICATIONS', description: 'Screen the client for contraindications identified by the device manufacturer, applicable training, and state scope. The source lists vascular conditions, high blood pressure, and metal implants as cautions for negative galvanic use; do not expand that into a universal list without device-specific support.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Desincrustation = deep pore cleansing. Iontophoresis = product penetration.' },
            { text: 'Perform only the pre-service checks required by the specific device, product, training, and applicable rules. Do not substitute a generic "sensitivity test" for device-specific screening.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 15: MICROCURRENT & TESLA
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'other-modalities',
      title: 'MICROCURRENT & TESLA HIGH-FREQUENCY',
      subtitle: 'Source-covered modalities for skin and scalp services',
      features: [
        {
          icon: 'Activity',
          title: 'MICROCURRENT',
          description: 'Extremely low-level electricity mirroring the body\'s natural impulses. Improves circulation, tones muscles, soothes tissue, and heals inflamed skin. Sub-sensory — client feels nothing.',
        },
        {
          icon: 'Zap',
          title: 'TESLA HIGH-FREQUENCY',
          description: 'Tesla high-frequency current has a high oscillation rate and is associated in the source with heat/violet-ray effects and no muscular contraction. Use only as allowed by scope and device directions.',
        },
        {
          icon: 'HeartPulse',
          title: 'TESLA BENEFITS',
          description: 'The source lists circulation, glandular, metabolic, germicidal, and congestion-related effects. Treat these as source-covered modality claims rather than guaranteed outcomes for every device or client.',
        },
        {
          icon: 'AlertTriangle',
          title: 'TESLA CAUTIONS',
          description: 'Follow the device's contraindications, eye/skin safety requirements, and state scope of practice. Do not perform electrotherapy without appropriate training and client screening.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 16: ELECTROMAGNETIC SPECTRUM
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'electromagnetic-spectrum',
      title: 'THE ELECTROMAGNETIC SPECTRUM',
      content: 'All forms of energy travel as WAVES. The electromagnetic spectrum includes everything from radio waves to gamma rays. For barbers, the most relevant portions are VISIBLE LIGHT and INVISIBLE LIGHT (ultraviolet and infrared).\n\nKEY PRINCIPLE: Long wavelengths penetrate DEEPLY but carry LESS energy. Short wavelengths penetrate LESS but carry MORE energy.\n\nIn the chapter's barbering examples, ultraviolet and infrared occupy opposite sides of the visible spectrum and differ in wavelength, frequency, penetration, and typical tissue effects.\n\nEXAM FOCUS: Know the relative order of radio, microwave, infrared, visible, ultraviolet, X-ray, and gamma regions and the relationship among wavelength, frequency, and energy.',
      highlight: 'LONG = DEEP PENETRATION, LESS ENERGY | SHORT = LESS PENETRATION, MORE ENERGY',
    },

    // ═══════════════════════════════════════════
    // SECTION 17: VISIBLE & INVISIBLE LIGHT
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'light-types',
      title: 'VISIBLE LIGHT & INVISIBLE LIGHT',
      subtitle: 'Visible and invisible regions — learn their source-described relationships',
      tabs: [
        {
          id: 'visible',
          label: 'VISIBLE',
          title: 'VISIBLE SPECTRUM (35% OF SUNLIGHT)',
          bullets: [
            { label: 'DEFINITION', description: 'The portion of the electromagnetic spectrum that human eyes can see' },
            { label: 'COLORS', description: 'Red, orange, yellow, green, blue, indigo, violet — remembered by ROY G BIV' },
            { label: 'PRODUCTION', description: 'Produced when light passes through a prism — each color bends at a different angle' },
            { label: 'BARBER RELEVANCE', description: 'The source associates different device wavelengths/colors with different treatment purposes; actual indications depend on the device and permitted use' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Visible light = 35% of natural sunlight. Colors: red, orange, yellow, green, blue, indigo, violet.' },
            { text: 'A prism separates white light into colors because each wavelength bends at a different angle.' },
          ],
        },
        {
          id: 'ultraviolet',
          label: 'UV RAYS',
          title: 'ULTRAVIOLET (UV) RAYS — SHORT, HIGH ENERGY',
          bullets: [
            { label: 'CHARACTERISTICS', description: 'Short wavelength, high frequency, COLD light (produces chemical reactions, not heat)' },
            { label: 'UVA', description: 'Longest UV rays. Used in tanning. Penetrates DEEPLY. Causes aging and wrinkling.' },
            { label: 'UVB', description: 'Middle range. Causes BURNING and skin cancer. The "burning rays."' },
            { label: 'UVC', description: 'Absorbed by Earth\'s atmosphere. Used in GERMICIDAL lamps for sterilization.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: EXAM FOCUS: Distinguish UVA, UVB, and UVC by their relative wavelength/penetration and the source-described effects.' },
            { text: 'UVC is used in germicidal irradiation applications. Do not treat a UV cabinet or lamp as a substitute for required barbering cleaning/disinfection procedures unless the applicable rule explicitly recognizes that device.' },
          ],
        },
        {
          id: 'infrared',
          label: 'INFRARED',
          title: 'INFRARED RAYS — LONG, DEEP HEAT',
          bullets: [
            { label: 'CHARACTERISTICS', description: 'Longer wavelength than visible light. Produces HEAT. Penetrates DEEPLY into tissue.' },
            { label: 'EFFECT', description: 'Produces heat; the source describes warming and circulation-related effects.' },
            { label: 'BARBER USE', description: 'The source describes infrared lamps as warming devices used in some hair-conditioning, skin, or spa contexts. Use only within scope and device directions.' },
            { label: 'APPLICATION', description: 'Use the distance specified by the particular lamp manufacturer and training procedure; monitor client comfort continuously.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: EXAM FOCUS: Infrared is associated with longer wavelength/heat; ultraviolet with shorter wavelength/higher frequency and chemical effects.' },
            { text: 'Do not memorize one distance as universal. Follow the specific lamp's instructions and stop if the client experiences excessive heat or discomfort.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 18: LIGHT THERAPY INTRO
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'light-therapy-intro',
      title: 'LIGHT THERAPY (PHOTOTHERAPY)',
      content: 'Light therapy applies specific wavelengths of light to treat skin conditions. Modern barbershops use LED devices and therapeutic lamps to offer these services. Understanding each color\'s effect allows you to customize treatments for acne, aging, inflammation, and hyperpigmentation.\n\nEXAM FOCUS: Light therapy exposure is usually 5 minutes or less. Never leave a client unattended. Always protect eyes with goggles or moistened cotton pads.',
      highlight: 'MATCH THE COLOR TO THE CONDITION',
    },

    // ═══════════════════════════════════════════
    // SECTION 19: LED LIGHT THERAPY
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'led-therapy',
      title: 'LED LIGHT THERAPY',
      subtitle: 'Source-described LED color associations — verify the device indication',
      features: [
        {
          icon: 'CircleDot',
          title: 'BLUE LED',
          description: 'The source associates blue LED with acne/bacteria-related applications. Do not promise a treatment outcome; verify the device indication, client suitability, and permitted scope.',
        },
        {
          icon: 'CircleDot',
          title: 'RED LED',
          description: 'The source associates red LED with circulation and collagen/elastin-related effects. Present these as device-dependent cosmetic claims rather than guaranteed healing outcomes.',
        },
        {
          icon: 'CircleDot',
          title: 'YELLOW LED',
          description: 'The source associates yellow LED with swelling/inflammation and circulation/lymphatic-related effects. Actual device claims and client suitability must be verified.',
        },
        {
          icon: 'CircleDot',
          title: 'GREEN LED',
          description: 'The source associates green LED with pigmentation/redness and calming effects. Avoid diagnosing or treating medical skin conditions outside barber scope.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 20: THERAPEUTIC LAMPS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'therapeutic-lamps',
      title: 'THERAPEUTIC LAMPS',
      subtitle: 'Source-described therapeutic lamps — follow device-specific instructions',
      tabs: [
        {
          id: 'white',
          label: 'WHITE',
          title: 'WHITE LIGHT THERAPY',
          bullets: [
            { label: 'EFFECT', description: 'Relieves pain, relaxes muscles, provides chemical and germicidal effects' },
            { label: 'USE', description: 'General wellness treatments and muscle relaxation after massage' },
            { label: 'DISTANCE', description: 'Use the distance specified for the particular lamp/device' },
            { label: 'DURATION', description: 'Use the exposure time specified by the device and training procedure' },
          ],
          facts: [
            { text: 'White light provides broad-spectrum benefits but is less targeted than colored LED therapy.' },
          ],
        },
        {
          id: 'blue',
          label: 'BLUE',
          title: 'BLUE LIGHT THERAPY',
          bullets: [
            { label: 'EFFECT', description: 'Tonic effect on bare skin. Stimulates and invigorates tissue.' },
            { label: 'USE', description: 'Oily skin and mild acne treatments' },
            { label: 'DISTANCE', description: 'Use the distance specified for the particular lamp/device' },
            { label: 'DURATION', description: 'Short exposure times — monitor closely' },
          ],
          facts: [
            { text: 'Blue light has a tonic (stimulating) effect. It is invigorating but can be overstimulating for sensitive skin.' },
          ],
        },
        {
          id: 'red',
          label: 'RED',
          title: 'RED LIGHT THERAPY',
          bullets: [
            { label: 'EFFECT', description: 'Heat rays that stimulate penetration of creams and increase circulation' },
            { label: 'USE', description: 'Dry skin, aging concerns, and product penetration enhancement' },
            { label: 'DISTANCE', description: 'Use the distance specified for the particular lamp/device' },
            { label: 'DURATION', description: 'Use the exposure time specified by the device and training procedure' },
          ],
          facts: [
            { text: 'Red light produces warmth. Clients should feel gentle heat, never burning. Adjust distance if too hot.' },
          ],
        },
        {
          id: 'uv',
          label: 'UV',
          title: 'ULTRAVIOLET LIGHT THERAPY',
          bullets: [
            { label: 'EFFECT', description: 'The source describes ultraviolet therapeutic-lamp use for certain acne, seborrhea, and dandruff applications. Because UV can injure skin and eyes, use only where permitted and only under device-specific professional instructions.' },
            { label: 'USE', description: 'Source-described skin/scalp applications only where allowed by scope; do not diagnose or treat infection as a barber.' },
            { label: 'DISTANCE', description: 'Use the distance specified by the particular lamp/device' },
            { label: 'DURATION', description: 'VERY SHORT exposure times — UV can damage skin with overexposure' },
          ],
          facts: [
            { text: 'EXAM FOCUS: Know the source-described ultraviolet uses and the need for strict eye, exposure, scope, and device controls.' },
            { text: 'Ultraviolet exposure can injure skin and eyes. Follow device-specific exposure controls and applicable professional rules.' },
          ],
        },
        {
          id: 'infrared',
          label: 'INFRARED',
          title: 'INFRARED LIGHT THERAPY',
          bullets: [
            { label: 'EFFECT', description: 'Produces heat (rosy glow). Deep penetration warms tissue and increases circulation.' },
            { label: 'USE', description: 'Muscle relaxation, pre-treatment warming, and product absorption' },
            { label: 'DISTANCE', description: 'Use the distance specified by the particular lamp/device' },
            { label: 'DURATION', description: 'Use the exposure time specified by the device and training procedure' },
          ],
          facts: [
            { text: 'Infrared produces visible heat. The client\'s skin should show a rosy glow — not redness or burning.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 21: LIGHT THERAPY SAFETY
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'light-therapy-safety',
      title: '💡 LIGHT-THERAPY CLIENT PROTECTION',
      items: [
        { text: 'Never leave a client unattended while a light-based treatment device is operating' },
        { text: 'Use the eye protection required by the device and professional procedure' },
        { text: 'Check client history, skin condition, medications/photosensitivity risk, products, and device contraindications as required' },
        { text: 'For source-described therapeutic lamps, monitor heat and client comfort using the professional procedure; do not improvise around modern devices' },
        { text: 'Use the exposure time specified by the particular device and training procedure' },
        { text: 'Use the operating distance specified by the particular device manufacturer' },
        { text: 'Stop the service immediately for burning, pain, excessive heat, unexpected skin reaction, or other adverse symptoms' },
        { text: 'Screen for photosensitivity and medication/device contraindications before light-based services' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 22: LASERS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'lasers',
      title: 'LASERS IN BARBERING',
      content: 'Medical lasers use electromagnetic radiation for hair removal and skin treatments. They work by SELECTIVE PHOTOTHERMOLYSIS — light energy converts to heat, targeting specific structures without damaging surrounding tissue.\n\nLASER CLASSIFICATION: Classified as Level II or higher medical devices. Usually require physician supervision.\n\nBARBER SCOPE: Most states do NOT permit barbers to operate medical lasers. Know your state\'s scope of practice. If lasers are permitted, specialized training and certification are required.\n\nEXAM FOCUS: Selective photothermolysis = light converts to heat to target specific structures. Lasers are medical devices requiring proper training and often physician supervision.',
      highlight: 'KNOW YOUR STATE\'S SCOPE OF PRACTICE',
    },

    // ═══════════════════════════════════════════
    // SECTION 23: COMMON CONFUSIONS & MEMORY AIDS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'memory-aids',
      title: 'COMMON CONFUSIONS & MEMORY AIDS',
      subtitle: 'Avoid these mix-ups and lock in the key facts',
      tabs: [
        {
          id: 'confusions',
          label: 'CONFUSIONS',
          title: 'MIX-UPS THAT COST POINTS',
          bullets: [
            { label: 'DC vs AC', description: 'DC = battery, ONE direction. AC = wall outlet, REVERSES direction. Do not mix them up.' },
            { label: 'GFCI Locations', description: 'GFCI is required near WATER sources. Not just sinks — anywhere water is present.' },
            { label: 'Anode vs Cathode', description: 'Anode = POSITIVE (+), RED, closes pores, acidic. Cathode = NEGATIVE (–), BLACK, opens pores, alkaline.' },
            { label: 'Frayed Cords', description: 'Frayed cords are not cosmetic issues — they are shock and fire hazards. Replace, do not tape.' },
            { label: 'Outlet Overloading', description: 'Two high-wattage dryers on one circuit trip breakers. Calculate total wattage before plugging in.' },
            { label: 'Unattended Clients', description: 'Never leave a client alone with electrical equipment running. This is negligence, not convenience.' },
          ],
          facts: [
            { text: 'REMEMBER: A fuse melts once and must be replaced. A breaker trips and can be reset. Both protect against overload.' },
            { text: 'REMEMBER: The third prong on a plug is grounding. Never remove it to fit a two-prong outlet.' },
          ],
        },
        {
          id: 'mnemonics',
          label: 'MNEMONICS',
          title: 'MEMORY TRICKS THAT WORK',
          bullets: [
            { label: 'VOLT = PRESSURE', description: 'Think of a volt as the PUSH behind electricity. Higher voltage = harder push.' },
            { label: 'AMP = AMOUNT', description: 'Think of amps as the VOLUME of electricity flowing. More amps = more current.' },
            { label: 'OHM = OBSTACLE', description: 'Think of ohms as OBSTACLES. More ohms = more resistance = less flow.' },
            { label: 'WATT = WORK', description: 'Think of watts as the actual WORK being done. Watts = amps × volts.' },
            { label: 'POSITIVE POLE', description: 'POSITIVE = CLOSE (pores), CALM (nerves), CONTRACT (vessels), FIRM (tissue).' },
            { label: 'NEGATIVE POLE', description: 'NEGATIVE = OPEN (pores), STIMULATE (nerves), EXPAND (vessels), SOFTEN (tissue).' },
            { label: 'UV RAYS', description: 'UVA = Aging. UVB = Burning. UVC = Clean (germicidal).' },
          ],
          facts: [
            { text: 'MNEMONIC: "Anode is RED and POSITIVE like a stop sign. Cathode is BLACK and NEGATIVE like the night."' },
            { text: 'MNEMONIC: "Long waves go deep (infrared heat), short waves stay surface (UV damage)."' },
          ],
        },
        {
          id: 'safety',
          label: 'SAFETY',
          title: 'NON-NEGOTIABLE SAFETY RULES',
          bullets: [
            { label: 'INSPECT BEFORE USE', description: 'Check cords, plugs, and equipment before every use. Damage = danger.' },
            { label: 'KEEP DRY', description: 'Never use electrical equipment with wet hands or near water without GFCI protection.' },
            { label: 'DO NOT OVERLOAD', description: 'Calculate total wattage. Spread high-draw tools across multiple circuits.' },
            { label: 'GROUND EVERYTHING', description: 'Use three-prong plugs. Never remove the grounding pin.' },
            { label: 'UNPLUG WHEN DONE', description: 'Disconnect tools when finished. Do not leave them running unattended.' },
            { label: 'LOOK FOR UL', description: 'Only use equipment with the UL safety mark. Untested tools are unpredictable.' },
          ],
          facts: [
            { text: 'EXAM FOCUS: OSHA requires safe electrical practices. Violations can result in fines and license suspension.' },
            { text: 'A single electrical accident can end your career. Safety is not a suggestion — it is a professional obligation.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 24: BOARD EXAM CRITICAL ALERTS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'board-exam-alerts',
      title: '🚨 BOARD EXAM CRITICAL ALERTS',
      content: 'These are high-value Chapter 8 review concepts. Actual state-board content and weighting vary by jurisdiction and exam program, so use them as a study checklist rather than a prediction of exact exam questions.\n\n1. ELECTRICITY = form of energy, NOT matter. Produces physical, magnetic, chemical, or thermal effects.\n\n2. CONDUCTOR = transmits electricity easily (metals, human body, watery solutions).\n\n3. INSULATOR = does not transmit electricity (rubber, plastic, dry wood, glass).\n\n4. DC = direct current, one direction, battery-powered.\n\n5. AC = alternating current, reverses direction, wall outlet.\n\n6. VOLT = electrical pressure. Standard US = 110–120V.\n\n7. AMPERE = current strength. Milliampere = 1/1,000 amp.\n\n8. OHM = resistance. Higher ohms = less current.\n\n9. WATT = power (amps × volts). Kilowatt = 1,000 watts.\n\n10. FUSE = melts on overload, must be replaced.\n\n11. CIRCUIT BREAKER = trips on overload, can be reset.\n\n12. GROUNDING = third prong, safe path for electricity.\n\n13. GFCI = ground-fault protection; know its purpose and follow applicable code/facility requirements around water.\n\n14. UL MARK = safety tested equipment.\n\n15. ANODE = positive (+), commonly red; know the source-described acidic/cataphoresis associations.\n\n16. CATHODE = negative (–), commonly black; know the source-described alkaline/anaphoresis associations.\n\n17. GALVANIC CURRENT = DC, low voltage, chemical changes.\n\n18. MICROCURRENT = mirrors body\'s natural impulses, sub-sensory.\n\n19. TESLA HIGH-FREQUENCY = source-described high oscillation, heat/violet-ray effect, and no muscular contraction.\n\n20. VISIBLE LIGHT = 35% of sunlight, ROY G BIV colors.\n\n21. UVA, UVB, UVC = distinguish relative wavelength/penetration and source-described biological/germicidal effects.\n\n22. INFRARED = heat rays, deep penetration.\n\n23. LED COLORS = know the source-described associations, but verify the actual device indication and client suitability.\n\n24. LIGHT THERAPY = protect the client, use required eye protection, follow device-specific time/distance, and never leave the client unattended.\n\n25. LASERS = selective photothermolysis concept; operation may require separate authorization, credentials, or medical oversight depending on jurisdiction.',
      highlight: 'MASTER THESE HIGH-VALUE CONCEPTS',
    },

    // ═══════════════════════════════════════════
    // SECTION 25: ELECTRICAL HAZARD SCENARIOS
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'hazard-scenarios',
      title: '⚡ ELECTRICAL HAZARD SCENARIOS',
      subtitle: 'Real shop situations that test your safety instincts',
      scenarios: [
        {
          situation: 'You notice the cord on your favorite clipper is frayed near the plug. The exposed wire is visible. Your next client is waiting. What do you do?',
          options: [
            { letter: 'A', text: 'Wrap the frayed area with electrical tape and continue using it', feedback: '❌ INCORRECT. Tape is a temporary fix at best. Exposed wire is a shock and fire hazard. Professional standards require proper repair or replacement.' },
            { letter: 'B', text: 'Stop using the clipper immediately, label it as unsafe, and use a backup tool', feedback: '✅ CORRECT. A frayed cord is a serious hazard. Stop using the tool, mark it clearly, and replace or professionally repair it. Never compromise on electrical safety.' },
            { letter: 'C', text: 'Use the clipper carefully and avoid touching the frayed area', feedback: '❌ INCORRECT. "Being careful" does not eliminate the hazard. The cord could spark, shock the client, or start a fire. This is negligence.' },
            { letter: 'D', text: 'Cut off the damaged plug and use a replacement plug from the hardware store', feedback: '❌ INCORRECT. Unless you are trained in electrical repair, improper wiring creates a worse hazard. Leave repairs to qualified professionals.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'You are about to start a facial treatment using a galvanic machine. The client mentions they have a pacemaker and metal pins in their shoulder from a previous surgery. What do you do?',
          options: [
            { letter: 'A', text: 'Proceed with the treatment but use lower intensity', feedback: '❌ INCORRECT. A pacemaker or implanted electronic device is a high-priority screening concern. Do not proceed unless the specific device instructions, professional training, and applicable scope clearly permit the service.' },
            { letter: 'B', text: 'Cancel the electrotherapy and suggest alternative non-electrical treatments', feedback: '✅ CORRECT. Do not proceed with galvanic service when the client history presents an implanted-device or other contraindication that the equipment instructions identify. Choose a non-electrical alternative when appropriate.' },
            { letter: 'C', text: 'Use the positive pole only, as it is safer than the negative pole', feedback: '❌ INCORRECT. Changing polarity is not a substitute for contraindication screening or device instructions.' },
            { letter: 'D', text: 'Ask the client to sign a waiver and proceed with the treatment', feedback: '❌ INCORRECT. A consent or waiver does not replace scope-of-practice limits, contraindication screening, or safe device use.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 26: ACTION PROMPTS
    // ═══════════════════════════════════════════
    {
      type: 'actionPrompt',
      id: 'action-prompts',
      title: '⚡ POWER GRID ACTION ITEMS',
      subtitle: 'Do these today to level up your electrical safety',
      prompts: [
        {
          action: 'Inspect Every Cord',
          description: 'Check all cords in your station for fraying, exposed wire, or damaged insulation.',
          benefit: 'Prevents shocks and fires before they happen',
          timeframe: '5 minutes',
        },
        {
          action: 'Test Your GFCI',
          description: 'Press the TEST button on every GFCI outlet near water sources. It should trip. Press RESET to restore.',
          benefit: 'Ensures your shock protection is working',
          timeframe: '2 minutes',
        },
        {
          action: 'Calculate Your Load',
          description: 'Add up the wattage of all tools on each circuit. Divide by 120V to get amps. Ensure you are under 80% of breaker rating.',
          benefit: 'Prevents tripped breakers and fire hazards',
          timeframe: '10 minutes',
        },
        {
          action: 'Check Tool Ratings',
          description: 'Verify every electrical tool has a visible UL mark and voltage rating matching your outlets.',
          benefit: 'Ensures all equipment is safe and compatible',
          timeframe: '5 minutes',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 27: FINAL POWER PLEDGE
    // ═══════════════════════════════════════════
    {
      type: 'quote',
      id: 'power-pledge',
      quote: 'I will use electrical knowledge to protect clients, inspect equipment, follow manufacturer directions, respect scope-of-practice limits, and stop when a condition is unsafe or outside my training. Professional judgment includes knowing when not to proceed.',
    },
  ],
}
