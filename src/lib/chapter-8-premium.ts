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
      subtitle: 'Three reasons electricity knowledge separates pros from pretenders',
      cards: [
        {
          icon: 'ShieldAlert',
          title: 'LIFE & DEATH SAFETY',
          text: 'A wet hand on a faulty clipper. An overloaded outlet behind your station. A missing GFCI near the shampoo bowl. These are not hypotheticals — they are real hazards that injure barbers and clients every year. Understanding electricity prevents accidents before they happen.',
        },
        {
          icon: 'Zap',
          title: 'TOOL MASTERY',
          text: 'Why does your dryer overheat? Why does your cordless clipper die faster than it should? Why does the breaker trip when two tools run together? Electrical knowledge answers these questions — saving you money, downtime, and frustration.',
        },
        {
          icon: 'Sparkles',
          title: 'ADVANCED SERVICES',
          text: 'Galvanic facials. High-frequency scalp treatments. LED light therapy. Microcurrent toning. These premium services require electrical knowledge to perform safely and effectively. The barbers who offer them charge premium prices.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: ELECTRICAL CERTIFICATION LEVELS
    // ═══════════════════════════════════════════
    {
      type: 'levelUp',
      id: 'electrical-certification',
      title: '⚡ ELECTRICAL SAFETY CERTIFICATION',
      subtitle: 'Progress from Apprentice to Grid Master — earn your electrical credentials',
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
          description: 'You master electrotherapy and light therapy. Galvanic current, microcurrent, Tesla high-frequency, LED treatments — you perform them with confidence and precision.',
          reward: 'Premium Service Provider — Advanced treatments command higher prices',
        },
        {
          level: 'Level 5',
          title: 'Grid Master',
          description: 'You command the entire electrical system of your shop. You understand wiring, load distribution, code compliance, and equipment selection. Other barbers and shop owners consult you.',
          reward: 'Electrical Authority — Your expertise is recognized and respected',
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
      content: 'Electricity is NOT matter. It does not occupy space or have mass like a chair or a clipper. It is a FORM OF ENERGY — invisible, powerful, and capable of producing physical, magnetic, chemical, or thermal effects when it moves.\n\nElectricity is created by the FLOW OF ELECTRONS between atoms. Imagine electrons as tiny particles orbiting the nucleus of an atom. When they break free and jump from atom to atom, they create an electric current. This flow powers everything from your phone charger to your high-frequency facial machine.\n\nBOARD EXAM ALERT: Electricity is energy, not matter. It produces effects (physical, magnetic, chemical, thermal) when electrons are in motion.',
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
            { label: 'BARBER REALITY', description: 'Your body is a conductor. Wet skin conducts even better. This is why the rule "water + electricity = death" exists.' },
            { label: 'WIRE DESIGN', description: 'Electrical wire contains twisted metal threads (conductor) coated with an insulator (plastic, rubber, or silk)' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: The human body is a conductor. Never touch electrical equipment with wet hands or while standing in water.' },
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
            { label: 'DANGER ZONE', description: 'Water turns insulators into conductors. A dry wooden floor is safe. A wet wooden floor conducts electricity.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Rubber and plastic are insulators. This is why rubber-soled shoes and plastic tool handles protect against shock.' },
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
            { text: 'BOARD EXAM ALERT: A complete circuit is required for electricity to flow. Break the circuit, stop the flow.' },
            { text: 'NEVER remove the grounding pin to fit a two-prong outlet. That third prong exists to save your life.' },
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
          description: 'Changes DC to AC or AC to DC. Used in rechargeable cordless tools and battery chargers. Allows battery devices to charge from wall outlets.',
        },
        {
          icon: 'AlertTriangle',
          title: 'BOARD EXAM ALERT',
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
            { label: 'BARBER REALITY', description: 'US standard: 110–120V. Some countries: 220–240V. Using a 220V tool on 110V = weak performance. Using 110V on 220V = fire hazard.' },
            { label: 'SAFETY RULE', description: 'Higher voltage = more dangerous. A 220V shock is more lethal than a 110V shock. Respect voltage ratings.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Volt = electrical pressure. Standard US voltage is 110–120V.' },
            { text: 'NEVER use a tool rated for different voltage without a proper transformer. Mismatched voltage destroys tools and creates fire risk.' },
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
            { text: 'BOARD EXAM ALERT: Ampere = current strength. Milliampere = 1/1,000 amp, used for facial/scalp treatments.' },
            { text: 'It takes only 0.1 amps (100 milliamps) passing through the heart to cause fatal fibrillation. Respect every amp.' },
          ],
        },
        {
          id: 'ohm',
          label: 'OHM (Ω)',
          title: 'OHM — ELECTRICAL RESISTANCE',
          bullets: [
            { label: 'WHAT IT MEASURES', description: 'RESISTANCE to electrical flow. Higher resistance = less current passes through.' },
            { label: 'WATER ANALOGY', description: 'Like a narrow section of pipe that restricts water flow — more ohms = less electricity gets through.' },
            { label: 'BARBER REALITY', description: 'Damaged cords increase resistance, causing heat buildup. A hot cord is a warning sign — replace it immediately.' },
            { label: 'RHEOSTAT', description: 'An adjustable resistor for controlling current. Used in light dimmers and some tool speed controls.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Ohm = resistance. Higher ohms = less current. A rheostat is an adjustable resistor.' },
            { text: 'Heat in cords = increased resistance. If a cord feels warm, it is struggling to carry current safely.' },
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
            { label: 'TOOL SELECTION', description: 'Higher wattage = more power. A 2,000W dryer dries faster than a 1,200W dryer but draws more current.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Watt = power (amps × volts). Kilowatt = 1,000 watts.' },
            { text: 'Calculate total wattage before plugging multiple tools into one outlet. Exceeding capacity = fire hazard.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 8: SAFETY DEVICES
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
          description: 'A one-time sacrifice. Melts when too much current passes, breaking the circuit. Must be replaced. Common in older buildings. Think of it as a soldier who gives their life to save the fort.',
        },
        {
          icon: 'ShieldCheck',
          title: 'CIRCUIT BREAKER',
          description: 'The reusable guardian. Automatically trips on overload, breaking the circuit. Can be reset with a flip. Common in modern buildings. Your first line of defense against overload.',
        },
        {
          icon: 'Anchor',
          title: 'GROUNDING',
          description: 'The escape route. Provides a safe path for electricity in case of short circuit. The third prong on modern plugs. NEVER remove it. It exists to save your life.',
        },
        {
          icon: 'Droplets',
          title: 'GFCI',
          description: 'Ground Fault Circuit Interrupter. Senses electrical imbalances and shuts off power in milliseconds. REQUIRED near sinks and water sources. The fastest responder in an emergency.',
        },
        {
          icon: 'BadgeCheck',
          title: 'UL MARK',
          description: 'Underwriters Laboratories symbol. Indicates equipment has been tested and meets safety standards. Look for this mark before buying ANY electrical tool. No mark = no trust.',
        },
        {
          icon: 'AlertTriangle',
          title: 'BOARD EXAM ALERT',
          description: 'GFCI = required near water. Grounding = third prong. Fuses melt; breakers trip. UL mark = safety tested. These five devices are exam favorites.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 9: CIRCUIT BREAKER CHALLENGE
    // ═══════════════════════════════════════════
    {
      type: 'challengeCard',
      id: 'circuit-breaker-challenge',
      title: '⚡ CIRCUIT BREAKER CHALLENGE',
      subtitle: 'Test your load calculation skills before the exam',
      challenges: [
        {
          badge: 'EASY',
          title: 'Single Tool Check',
          description: 'Your clipper is rated 120V, 0.5A. How many watts does it draw?',
          action: 'Calculate: 120V × 0.5A = 60W',
          difficulty: 'easy',
        },
        {
          badge: 'MEDIUM',
          title: 'Station Load Test',
          description: 'Your station has a 1,800W dryer, a 60W clipper, and a 100W steamer on a 20-amp circuit. Will the breaker trip?',
          action: 'Total: 1,960W ÷ 120V = 16.3A. Under 20A = SAFE. But add another dryer and it trips.',
          difficulty: 'medium',
        },
        {
          badge: 'HARD',
          title: 'Shop Wiring Puzzle',
          description: 'Your shop has three 20-amp circuits. You need to place six 1,800W dryers. How do you distribute them so no breaker trips?',
          action: 'Each dryer = 15A. Two per circuit = 30A > 20A (TRIPS). Max one dryer + small tools per circuit. You need six circuits or lower-wattage dryers.',
          difficulty: 'hard',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 10: NON-NEGOTIABLE SAFETY RULES
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'safety-rules',
      title: '🔒 NON-NEGOTIABLE SAFETY PROTOCOLS',
      items: [
        { text: 'Study instructions before using ANY electrical equipment' },
        { text: 'Disconnect tools when not in use — never leave them running unattended' },
        { text: 'Inspect cords, plugs, and equipment before EVERY use' },
        { text: 'Do NOT overload outlets or power strips — calculate total wattage first' },
        { text: 'Protect clients at all times — never let them touch electrical equipment' },
        { text: 'NEVER touch metal while using electrical equipment on a client' },
        { text: 'NEVER leave a client unattended with an electrical device running' },
        { text: 'NEVER use electrical equipment near water or with wet hands' },
        { text: 'Check for the UL mark before purchasing any electrical tool' },
        { text: 'Replace frayed cords immediately — tape is not a permanent fix' },
        { text: 'Use GFCI-protected outlets near all water sources' },
        { text: 'Never remove the grounding pin from a three-prong plug' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 11: ELECTROTHERAPY INTRO
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'electrotherapy-intro',
      title: 'ELECTROTHERAPY — ADVANCED SERVICES',
      content: 'Electrotherapy uses controlled electric currents for facial and scalp treatments. These services can be valuable add-ons when permitted by state regulations and performed with proper training.\n\nUnderstanding polarity, current types, and treatment effects separates the barber who merely performs services from the barber who customizes treatments for each client\'s needs.\n\nBOARD EXAM ALERT: Electrotherapy modalities vary by state. Know your state\'s regulations before offering these services.',
      highlight: 'KNOW YOUR STATE REGULATIONS',
    },

    // ═══════════════════════════════════════════
    // SECTION 12: POLARITY & ELECTRODES
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
          description: 'Usually RED. Produces ACIDIC reactions, CLOSES pores, SOOTHES nerves, DECREASES blood supply, and FIRMS tissues. Process: CATAPHORESIS.',
        },
        {
          icon: 'MinusCircle',
          title: 'CATHODE (–) — NEGATIVE POLE',
          description: 'Usually BLACK. Produces ALKALINE reactions, OPENS pores, STIMULATES nerves, INCREASES blood supply, and SOFTENS tissues. Process: ANAPHORESIS.',
        },
        {
          icon: 'ArrowLeftRight',
          title: 'POLARITY',
          description: 'Negative or positive pole of electric current. Understanding polarity is essential for galvanic treatments and customizing electrotherapy services.',
        },
        {
          icon: 'AlertTriangle',
          title: 'BOARD EXAM ALERT',
          description: 'Anode = positive (+), RED, closes pores, acidic. Cathode = negative (–), BLACK, opens pores, alkaline. Memorize the color coding.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 13: GALVANIC CURRENT DEEP DIVE
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'galvanic-current',
      title: 'GALVANIC CURRENT — THE CHEMICAL CURRENT',
      subtitle: 'DC power for deep skin transformation',
      tabs: [
        {
          id: 'basics',
          label: 'BASICS',
          title: 'GALVANIC CURRENT FUNDAMENTALS',
          bullets: [
            { label: 'TYPE', description: 'DC (direct current), low-voltage, safe level for skin treatments' },
            { label: 'EFFECT', description: 'Produces chemical changes and ionic reactions in the skin' },
            { label: 'METHOD', description: 'Uses an active electrode (positive or negative) placed on the treatment area' },
            { label: 'STATE REGULATIONS', description: 'Availability varies by state — check local regulations before offering galvanic services' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Galvanic current = DC, low voltage, produces chemical changes. Know anode vs cathode effects.' },
            { text: 'Never perform polarity tests without instructor supervision. Improper use can cause burns or skin damage.' },
          ],
        },
        {
          id: 'positive',
          label: 'POSITIVE (+)',
          title: 'POSITIVE POLE — CATAPHORESIS',
          bullets: [
            { label: 'REACTION', description: 'Produces ACIDIC reactions in the skin' },
            { label: 'PORE EFFECT', description: 'CLOSES pores — tightens and refines skin texture' },
            { label: 'NERVE EFFECT', description: 'SOOTHES nerves — calming, sedative effect' },
            { label: 'BLOOD EFFECT', description: 'DECREASES blood supply — contracts vessels, reduces redness' },
            { label: 'TISSUE EFFECT', description: 'HARDENS and FIRMS tissues — toning and tightening' },
            { label: 'PROCESS', description: 'CATAPHORESIS — introducing positive ions into the skin' },
          ],
          facts: [
            { text: 'MNEMONIC: POSITIVE = CLOSE (pores), CALM (nerves), CONTRACT (vessels), FIRM (tissue).' },
            { text: 'Use the positive pole AFTER deep cleansing to calm and tighten skin before finishing a facial.' },
          ],
        },
        {
          id: 'negative',
          label: 'NEGATIVE (–)',
          title: 'NEGATIVE POLE — ANAPHORESIS',
          bullets: [
            { label: 'REACTION', description: 'Produces ALKALINE reactions in the skin' },
            { label: 'PORE EFFECT', description: 'OPENS pores — prepares skin for deep cleansing' },
            { label: 'NERVE EFFECT', description: 'STIMULATES and IRRITATES nerves — invigorating effect' },
            { label: 'BLOOD EFFECT', description: 'INCREASES blood supply — expands vessels, brings nutrients' },
            { label: 'TISSUE EFFECT', description: 'SOFTENS tissues — relaxes and prepares for treatment' },
            { label: 'PROCESS', description: 'ANAPHORESIS — introducing negative ions into the skin' },
          ],
          facts: [
            { text: 'MNEMONIC: NEGATIVE = OPEN (pores), STIMULATE (nerves), EXPAND (vessels), SOFTEN (tissue).' },
            { text: 'Use the negative pole BEFORE deep cleansing to open pores and increase circulation.' },
          ],
        },
        {
          id: 'advanced',
          label: 'ADVANCED',
          title: 'DESINCUSTATION & IONTOPHORESIS',
          bullets: [
            { label: 'DESINCUSTATION', description: 'Uses galvanic current for DEEP PORE CLEANSING. Emulsifies sebum and draws impurities to the surface.' },
            { label: 'IONTOPHORESIS', description: 'Introduces water-soluble products into the skin. Positive pole for acidic substances. Negative pole for alkaline substances.' },
            { label: 'CLIENT COMFORT', description: 'Client should feel mild tingling. Burning or stinging = too high intensity. Reduce immediately.' },
            { label: 'CONTRAINDICATIONS', description: 'Avoid on broken capillaries, high blood pressure, metal implants, or pregnancy. Check client history first.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Desincrustation = deep pore cleansing. Iontophoresis = product penetration.' },
            { text: 'Always perform a skin sensitivity test before galvanic treatment. Some clients react strongly even to low current.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 14: MICROCURRENT & TESLA
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'other-modalities',
      title: 'MICROCURRENT & TESLA HIGH-FREQUENCY',
      subtitle: 'Advanced modalities for skin and scalp mastery',
      features: [
        {
          icon: 'Activity',
          title: 'MICROCURRENT',
          description: 'Extremely low-level electricity mirroring the body\'s natural impulses. Improves circulation, tones muscles, soothes tissue, and heals inflamed skin. Sub-sensory — client feels nothing.',
        },
        {
          icon: 'Zap',
          title: 'TESLA HIGH-FREQUENCY',
          description: 'High rate of oscillation producing heat and a violet ray. No muscular contractions. Used for scalp and facial treatments with germicidal benefits.',
        },
        {
          icon: 'HeartPulse',
          title: 'TESLA BENEFITS',
          description: 'Stimulates blood circulation and glandular activity. Increases metabolism and waste elimination. Improves germicidal action. Relieves skin congestion. Increases muscle tone and elasticity.',
        },
        {
          icon: 'AlertTriangle',
          title: 'TESLA CAUTIONS',
          description: 'Do not use on broken capillaries. Avoid with high blood pressure or metal implants. Never use without proper training. Keep away from eyes and mucous membranes.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 15: ELECTROMAGNETIC SPECTRUM
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'electromagnetic-spectrum',
      title: 'THE ELECTROMAGNETIC SPECTRUM',
      content: 'All forms of energy travel as WAVES. The electromagnetic spectrum includes everything from radio waves to gamma rays. For barbers, the most relevant portions are VISIBLE LIGHT and INVISIBLE LIGHT (ultraviolet and infrared).\n\nKEY PRINCIPLE: Long wavelengths penetrate DEEPLY but carry LESS energy. Short wavelengths penetrate LESS but carry MORE energy.\n\nThis explains why UV rays damage skin (high energy, short wavelength) while infrared rays warm tissue deeply (long wavelength, penetrating heat).\n\nBOARD EXAM ALERT: The electromagnetic spectrum includes radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays — in order from longest to shortest wavelength.',
      highlight: 'LONG = DEEP PENETRATION, LESS ENERGY | SHORT = LESS PENETRATION, MORE ENERGY',
    },

    // ═══════════════════════════════════════════
    // SECTION 16: VISIBLE & INVISIBLE LIGHT
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'light-types',
      title: 'VISIBLE LIGHT & INVISIBLE LIGHT',
      subtitle: '35% visible, 65% invisible — know what each does to skin',
      tabs: [
        {
          id: 'visible',
          label: 'VISIBLE',
          title: 'VISIBLE SPECTRUM (35% OF SUNLIGHT)',
          bullets: [
            { label: 'DEFINITION', description: 'The portion of the electromagnetic spectrum that human eyes can see' },
            { label: 'COLORS', description: 'Red, orange, yellow, green, blue, indigo, violet — remembered by ROY G BIV' },
            { label: 'PRODUCTION', description: 'Produced when light passes through a prism — each color bends at a different angle' },
            { label: 'BARBER RELEVANCE', description: 'Different LED colors produce different skin responses during light therapy treatments' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Visible light = 35% of natural sunlight. Colors: red, orange, yellow, green, blue, indigo, violet.' },
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
            { text: 'BOARD EXAM ALERT: UVA = aging/tanning. UVB = burning/cancer. UVC = germicidal (absorbed by atmosphere, used in lamps).' },
            { text: 'UV rays kill microorganisms by damaging their DNA. This is why UV lamps sterilize tools and water.' },
          ],
        },
        {
          id: 'infrared',
          label: 'INFRARED',
          title: 'INFRARED RAYS — LONG, DEEP HEAT',
          bullets: [
            { label: 'CHARACTERISTICS', description: 'Longer wavelength than visible light. Produces HEAT. Penetrates DEEPLY into tissue.' },
            { label: 'EFFECT', description: 'Creates a rosy glow on skin. Increases circulation and promotes healing.' },
            { label: 'BARBER USE', description: 'Infrared lamps warm skin before treatments, increase product absorption, and soothe sore muscles.' },
            { label: 'APPLICATION', description: 'Applied at approximately 30 inches from the skin. Monitor client comfort closely.' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: Infrared = heat rays, deep penetration. Ultraviolet = cold rays, surface damage.' },
            { text: 'Infrared lamps are used at ~30 inches distance. Too close = burns. Always monitor client comfort.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 17: LIGHT THERAPY INTRO
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'light-therapy-intro',
      title: 'LIGHT THERAPY (PHOTOTHERAPY)',
      content: 'Light therapy applies specific wavelengths of light to treat skin conditions. Modern barbershops use LED devices and therapeutic lamps to offer these services. Understanding each color\'s effect allows you to customize treatments for acne, aging, inflammation, and hyperpigmentation.\n\nBOARD EXAM ALERT: Light therapy exposure is usually 5 minutes or less. Never leave a client unattended. Always protect eyes with goggles or moistened cotton pads.',
      highlight: 'MATCH THE COLOR TO THE CONDITION',
    },

    // ═══════════════════════════════════════════
    // SECTION 18: LED LIGHT THERAPY
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'led-therapy',
      title: 'LED LIGHT THERAPY',
      subtitle: 'Different colors, different benefits — match the LED to the need',
      features: [
        {
          icon: 'CircleDot',
          title: 'BLUE LED',
          description: 'Reduces acne and kills bacteria. Targets P. acnes bacteria on the skin surface. Best for oily, acne-prone skin.',
        },
        {
          icon: 'CircleDot',
          title: 'RED LED',
          description: 'Increases circulation, collagen, and elastin. Stimulates wound healing. Best for aging skin, fine lines, and recovery.',
        },
        {
          icon: 'CircleDot',
          title: 'YELLOW LED',
          description: 'Reduces swelling and inflammation. Improves lymphatic flow. Best for sensitive skin and post-treatment recovery.',
        },
        {
          icon: 'CircleDot',
          title: 'GREEN LED',
          description: 'Reduces hyperpigmentation and redness. Calms and soothes irritated skin. Best for uneven skin tone and rosacea.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 19: THERAPEUTIC LAMPS
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'therapeutic-lamps',
      title: 'THERAPEUTIC LAMPS',
      subtitle: 'Dome-shaped reflector lamps with colored bulbs',
      tabs: [
        {
          id: 'white',
          label: 'WHITE',
          title: 'WHITE LIGHT THERAPY',
          bullets: [
            { label: 'EFFECT', description: 'Relieves pain, relaxes muscles, provides chemical and germicidal effects' },
            { label: 'USE', description: 'General wellness treatments and muscle relaxation after massage' },
            { label: 'DISTANCE', description: 'Apply at 30–36 inches from the skin' },
            { label: 'DURATION', description: 'Usually 5 minutes or less per treatment area' },
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
            { label: 'DISTANCE', description: 'Apply at 30–36 inches from the skin' },
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
            { label: 'DISTANCE', description: 'Apply at 30–36 inches from the skin' },
            { label: 'DURATION', description: 'Usually 5 minutes or less' },
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
            { label: 'EFFECT', description: 'Treats acne, seborrhea, and dandruff. Germicidal action kills surface bacteria and fungi.' },
            { label: 'USE', description: 'Scalp conditions and skin infections under professional supervision' },
            { label: 'DISTANCE', description: '30–36 inches from the skin' },
            { label: 'DURATION', description: 'VERY SHORT exposure times — UV can damage skin with overexposure' },
          ],
          facts: [
            { text: 'BOARD EXAM ALERT: UV light therapy treats acne, seborrhea, and dandruff. Use at 30–36 inches with short exposure.' },
            { text: 'Overexposure to UV causes burns and increases skin cancer risk. Strictly control duration and distance.' },
          ],
        },
        {
          id: 'infrared',
          label: 'INFRARED',
          title: 'INFRARED LIGHT THERAPY',
          bullets: [
            { label: 'EFFECT', description: 'Produces heat (rosy glow). Deep penetration warms tissue and increases circulation.' },
            { label: 'USE', description: 'Muscle relaxation, pre-treatment warming, and product absorption' },
            { label: 'DISTANCE', description: 'Approximately 30 inches from the skin' },
            { label: 'DURATION', description: 'Usually 5 minutes or less' },
          ],
          facts: [
            { text: 'Infrared produces visible heat. The client\'s skin should show a rosy glow — not redness or burning.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 20: LIGHT THERAPY SAFETY
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'light-therapy-safety',
      title: '💡 LIGHT THERAPY SAFETY PROTOCOLS',
      items: [
        { text: 'NEVER leave a client unattended during light therapy' },
        { text: 'PROTECT EYES with goggles or moistened cotton pads' },
        { text: 'CHECK skin products for contraindications before treatment' },
        { text: 'BREAK the light path frequently by waving your hand between lamp and client' },
        { text: 'LIMIT exposure time to 5 minutes or less per area' },
        { text: 'MAINTAIN proper distance (30–36 inches for most lamps)' },
        { text: 'DISCONTINUE immediately if client reports burning or discomfort' },
        { text: 'AVOID light therapy on clients with photosensitivity or certain medications' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 21: LASERS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'lasers',
      title: 'LASERS IN BARBERING',
      content: 'Medical lasers use electromagnetic radiation for hair removal and skin treatments. They work by SELECTIVE PHOTOTHERMOLYSIS — light energy converts to heat, targeting specific structures without damaging surrounding tissue.\n\nLASER CLASSIFICATION: Classified as Level II or higher medical devices. Usually require physician supervision.\n\nBARBER SCOPE: Most states do NOT permit barbers to operate medical lasers. Know your state\'s scope of practice. If lasers are permitted, specialized training and certification are required.\n\nBOARD EXAM ALERT: Selective photothermolysis = light converts to heat to target specific structures. Lasers are medical devices requiring proper training and often physician supervision.',
      highlight: 'KNOW YOUR STATE\'S SCOPE OF PRACTICE',
    },

    // ═══════════════════════════════════════════
    // SECTION 22: COMMON CONFUSIONS & MEMORY AIDS
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
            { text: 'BOARD EXAM ALERT: OSHA requires safe electrical practices. Violations can result in fines and license suspension.' },
            { text: 'A single electrical accident can end your career. Safety is not a suggestion — it is a professional obligation.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 23: BOARD EXAM CRITICAL ALERTS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'board-exam-alerts',
      title: '🚨 BOARD EXAM CRITICAL ALERTS',
      content: 'These electricity concepts appear on EVERY state board exam. Miss them, and you fail.\n\n1. ELECTRICITY = form of energy, NOT matter. Produces physical, magnetic, chemical, or thermal effects.\n\n2. CONDUCTOR = transmits electricity easily (metals, human body, watery solutions).\n\n3. INSULATOR = does not transmit electricity (rubber, plastic, dry wood, glass).\n\n4. DC = direct current, one direction, battery-powered.\n\n5. AC = alternating current, reverses direction, wall outlet.\n\n6. VOLT = electrical pressure. Standard US = 110–120V.\n\n7. AMPERE = current strength. Milliampere = 1/1,000 amp.\n\n8. OHM = resistance. Higher ohms = less current.\n\n9. WATT = power (amps × volts). Kilowatt = 1,000 watts.\n\n10. FUSE = melts on overload, must be replaced.\n\n11. CIRCUIT BREAKER = trips on overload, can be reset.\n\n12. GROUNDING = third prong, safe path for electricity.\n\n13. GFCI = required near water, prevents shock.\n\n14. UL MARK = safety tested equipment.\n\n15. ANODE = positive (+), RED, closes pores, acidic, cataphoresis.\n\n16. CATHODE = negative (–), BLACK, opens pores, alkaline, anaphoresis.\n\n17. GALVANIC CURRENT = DC, low voltage, chemical changes.\n\n18. MICROCURRENT = mirrors body\'s natural impulses, sub-sensory.\n\n19. TESLA HIGH-FREQUENCY = heat and violet ray, no muscle contractions.\n\n20. VISIBLE LIGHT = 35% of sunlight, ROY G BIV colors.\n\n21. UVA = aging/tanning. UVB = burning/cancer. UVC = germicidal.\n\n22. INFRARED = heat rays, deep penetration.\n\n23. LED BLUE = acne/bacteria. RED = circulation/collagen. YELLOW = swelling. GREEN = pigmentation.\n\n24. LIGHT THERAPY = 5 minutes max, protect eyes, never leave client unattended.\n\n25. LASERS = selective photothermolysis, medical devices, often require physician supervision.',
      highlight: 'MEMORIZE THESE 25 POINTS',
    },

    // ═══════════════════════════════════════════
    // SECTION 24: ELECTRICAL HAZARD SCENARIOS
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
            { letter: 'A', text: 'Proceed with the treatment but use lower intensity', feedback: '❌ INCORRECT. Metal implants and pacemakers are absolute contraindications for electrotherapy. Lower intensity does not eliminate the risk.' },
            { letter: 'B', text: 'Cancel the electrotherapy and suggest alternative non-electrical treatments', feedback: '✅ CORRECT. Pacemakers and metal implants are contraindications for galvanic current. Always check client history before electrotherapy. Offer safe alternatives.' },
            { letter: 'C', text: 'Use the positive pole only, as it is safer than the negative pole', feedback: '❌ INCORRECT. Both poles carry risk with pacemakers and metal implants. There is no "safer" pole in this situation.' },
            { letter: 'D', text: 'Ask the client to sign a waiver and proceed with the treatment', feedback: '❌ INCORRECT. A waiver does not protect you from liability when performing a contraindicated treatment. This is professional negligence.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 25: ACTION PROMPTS
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
    // SECTION 26: FINAL POWER PLEDGE
    // ═══════════════════════════════════════════
    {
      type: 'quote',
      id: 'power-pledge',
      quote: 'I pledge to respect the power of electricity. I will inspect my tools, protect my clients, and never compromise on safety. I understand that electricity is a servant when respected and a danger when ignored. A master barber masters the power behind the chair.',
    },
  ],
}
