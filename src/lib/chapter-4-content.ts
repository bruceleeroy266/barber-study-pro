// Chapter 4: Infection Control — Clinical Lab Theme
// Sterile teal, warning amber, clinical white
// This file contains the theme and content for Chapter 4
// It is imported and merged into chapter-content.ts

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ───────────────────────────────────────────────
// Chapter 4: Infection Control — Clinical Lab Theme
// Sterile teal / Warning amber / Clinical white
// ───────────────────────────────────────────────

export const chapter4Theme: ChapterTheme = {
  primary: '#0EA5A5',
  primaryLight: '#5EEAD4',
  primaryDark: '#0F766E',
  secondary: '#F59E0B',
  background: 'rgba(10, 25, 30, 0.92)',
  backgroundAlt: 'rgba(15, 40, 45, 0.85)',
  surface: '#071518',
  border: 'rgba(14, 165, 165, 0.25)',
  text: '#F0FDFC',
  textMuted: '#94A3B8',
  highlight: '#F59E0B',
  timeline: {
    line: 'rgba(14, 165, 165, 0.4)',
    iconBg: '#0A1F24',
    iconBorder: '#0EA5A5',
  },
  quote: {
    border: 'rgba(14, 165, 165, 0.45)',
    icon: 'rgba(14, 165, 165, 0.35)',
    bg: 'rgba(10, 25, 30, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(14, 165, 165, 0.18)',
    activeBorder: 'rgba(14, 165, 165, 0.55)',
    activeText: '#5EEAD4',
    inactiveBg: 'rgba(10, 25, 30, 0.7)',
    inactiveBorder: 'rgba(14, 165, 165, 0.15)',
    inactiveText: '#94A3B8',
    panelBg: 'rgba(10, 25, 30, 0.8)',
    panelBorder: 'rgba(14, 165, 165, 0.2)',
  },
  toolCard: {
    headerBg: 'rgba(14, 165, 165, 0.12)',
    headerText: '#5EEAD4',
    dot: 'rgba(14, 165, 165, 0.65)',
    line: 'rgba(14, 165, 165, 0.3)',
  },
  featureGrid: {
    iconBg: 'rgba(14, 165, 165, 0.18)',
    iconColor: '#0EA5A5',
    cardBorder: 'rgba(14, 165, 165, 0.22)',
  },
  milestone: {
    yearColor: '#0EA5A5',
    border: 'rgba(14, 165, 165, 0.25)',
  },
  checklist: {
    checkBorder: 'rgba(14, 165, 165, 0.45)',
    checkColor: '#0EA5A5',
    bg: 'rgba(10, 25, 30, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(10, 25, 30, 0.7)',
    border: 'rgba(14, 165, 165, 0.2)',
    highlightColor: '#5EEAD4',
  },
  challengeCard: {
    badgeBg: 'rgba(14, 165, 165, 0.2)',
    badgeText: '#5EEAD4',
    cardBorder: 'rgba(14, 165, 165, 0.25)',
    completedBg: 'rgba(16, 185, 129, 0.1)',
    completedBorder: 'rgba(16, 185, 129, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(14, 165, 165, 0.1)',
    optionBorder: 'rgba(14, 165, 165, 0.2)',
    correctBg: 'rgba(16, 185, 129, 0.12)',
    incorrectBg: 'rgba(239, 68, 68, 0.1)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(14, 165, 165, 0.2)',
    levelBadgeText: '#5EEAD4',
    rewardBg: 'rgba(16, 185, 129, 0.12)',
    rewardText: '#10B981',
  },
  actionPrompt: {
    cardBorder: 'rgba(14, 165, 165, 0.2)',
    completedBorder: 'rgba(16, 185, 129, 0.35)',
    benefitBg: 'rgba(14, 165, 165, 0.1)',
    benefitBorder: 'rgba(14, 165, 165, 0.3)',
  },
}

export const chapter4Content: ChapterContent = {
  chapterNumber: 4,
  title: 'Infection Control',
  subtitle: 'Protecting Yourself, Your Clients, and Your Community',
  theme: chapter4Theme,
  sections: [
    // Section 1: Why Infection Control Matters
    {
      type: 'infoCards',
      id: 'why-infection-control',
      title: 'Why Infection Control Matters',
      subtitle: 'The reality of working with sharp tools and human contact',
      cards: [
        {
          icon: 'AlertTriangle',
          title: 'The Reality',
          text: 'Every day, barbers work with sharp tools that break skin, come into contact with blood and body fluids, and touch open wounds or infections. Without proper precautions, you are at risk.',
        },
        {
          icon: 'Shield',
          title: 'The Stakes',
          text: 'Poor infection control can lead to license revocation, lawsuits, permanent reputation damage, serious illness, and even business closure. This is not optional — it is foundational.',
        },
        {
          icon: 'Heart',
          title: 'The Responsibility',
          text: 'You are the first line of defense for every client who sits in your chair. Your diligence protects not just them, but their families, your coworkers, and your community.',
        },
      ],
    },
    {
      type: 'quote',
      id: 'infection-control-mindset',
      quote: 'Infection control is not just a rule — it is a professional mindset. Every cut, every shave, every service is an opportunity to demonstrate that you take your client\'s safety seriously.',
    },

    // Section 2: Federal & State Agencies
    {
      type: 'featureGrid',
      id: 'regulatory-agencies',
      title: 'Federal & State Agencies',
      subtitle: 'Who sets the rules and enforces compliance',
      features: [
        {
          icon: 'Building2',
          title: 'OSHA',
          description: 'The Occupational Safety and Health Administration requires every barbershop to have a written Exposure Control Plan, provide annual bloodborne pathogen training, supply PPE, offer the Hepatitis B vaccine, and maintain proper sharps disposal.',
        },
        {
          icon: 'Leaf',
          title: 'EPA',
          description: 'The Environmental Protection Agency registers all disinfectants used in the United States. Only EPA-registered products with proven efficacy claims can be used in barbershops. They also regulate hazardous waste disposal.',
        },
        {
          icon: 'ClipboardCheck',
          title: 'State Board of Barbering',
          description: 'Your state board conducts unannounced inspections, verifies licenses, checks sanitation compliance, investigates complaints, and has the authority to fine, suspend, or revoke licenses for violations.',
        },
      ],
    },

    // INTERACTIVE: Safety Scenario Challenge
    {
      type: 'scenarioBlock',
      id: 'safety-scenarios-1',
      title: '🧪 Safety Scenario Challenge',
      subtitle: 'Test your infection control instincts with real shop situations',
      scenarios: [
        {
          situation: 'You accidentally nick a client\'s ear with your clippers and a small amount of blood appears. The client says it is "just a scratch" and wants you to finish the cut.',
          options: [
            { letter: 'A', text: 'Continue the service carefully and wipe the blood with the cape', feedback: '❌ Never continue service after blood exposure. The cape is now contaminated and cannot be used to clean a wound.' },
            { letter: 'B', text: 'Stop immediately, apply first aid with a clean cotton round, disinfect the clippers, and use fresh protective gear before finishing', feedback: '✅ Correct! Stop the service, address the wound, clean and disinfect tools, replace contaminated barriers, then finish safely.' },
            { letter: 'C', text: 'Tell the client to wash it themselves in the restroom', feedback: '❌ You are responsible for first aid. Directing a bleeding client to a restroom spreads contamination and shows negligence.' },
            { letter: 'D', text: 'Ignore it and finish quickly before anyone notices', feedback: '❌ Ignoring exposure incidents violates OSHA, state board regulations, and basic human decency. This can cost you your license.' },
          ],
          correctAnswer: 'B',
        },
        {
          situation: 'During a busy Saturday, you realize your disinfectant solution has turned cloudy and has hair floating in it. You have three clients waiting.',
          options: [
            { letter: 'A', text: 'Use it anyway — the clients are waiting and the solution is mostly fine', feedback: '❌ Cloudy disinfectant with debris is ineffective. Using it gives false confidence and puts every client at risk.' },
            { letter: 'B', text: 'Replace the solution immediately, even if it means a short delay', feedback: '✅ Correct! Fresh disinfectant is non-negotiable. A brief delay is infinitely better than cross-contaminating tools between clients.' },
            { letter: 'C', text: 'Strain the hair out and continue using it', feedback: '❌ Straining does not restore efficacy. Once contaminated, the solution must be discarded and replaced per manufacturer instructions.' },
            { letter: 'D', text: 'Switch to water for the rest of the day', feedback: '❌ Water does not disinfect. This would be a severe violation and could spread infection to multiple clients.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // Section 2b: Terminology Precision
    {
      type: 'contentBlock',
      id: 'terminology-precision',
      title: 'Terminology Matters',
      content: 'Healthcare professionals distinguish carefully between cleaning, sanitizing, disinfecting, and sterilizing. The Association for Professionals in Infection Control and Epidemiology prefers the term "cleaning" over "sanitizing" because "sanitizing" is often used as a marketing term (like "hand sanitizers"). When communicating with inspectors, doctors, or other professionals, use precise terminology to demonstrate your expertise.',
      highlight: 'Use precise terminology',
    },
    {
      type: 'featureGrid',
      id: 'four-levels-detailed',
      title: 'The Four Levels of Clean — Detailed',
      subtitle: 'Understanding the critical differences for state board exams',
      features: [
        {
          icon: 'Droplets',
          title: '1. Cleaning',
          description: 'A mechanical process using soap and water or detergent to remove visible dirt, debris, and many disease-causing germs. Cleaning also removes invisible debris that interferes with disinfection. Required as a step BEFORE disinfecting.',
        },
        {
          icon: 'Sparkles',
          title: '2. Sanitizing',
          description: 'A chemical process that reduces the number of disease-causing germs on cleaned surfaces to a safe level. Considered a layperson\'s term by infection control professionals. Not sufficient for barbering tools.',
        },
        {
          icon: 'ShieldCheck',
          title: '3. Disinfecting',
          description: 'A chemical process for use with nonporous items that destroys harmful organisms (except bacterial spores) on implements and environmental surfaces. This is the standard for barbering tools between clients.',
        },
        {
          icon: 'Flame',
          title: '4. Sterilizing',
          description: 'Destroys all microbial life including bacterial spores. Required for instruments that penetrate skin. Achieved through autoclaving or dry heat sterilization.',
        },
      ],
    },

    // Section 3: Types of Pathogens
    {
      type: 'tabbed',
      id: 'types-of-pathogens',
      title: 'Types of Pathogens',
      subtitle: 'Know your enemy — the organisms that cause infection',
      tabs: [
        {
          id: 'bacteria',
          label: 'Bacteria',
          title: 'Bacteria: The Most Common Threat',
          bullets: [
            { label: 'Shapes', description: 'Cocci (round), bacilli (rod-shaped), and spirilla (corkscrew-shaped). Each shape indicates different families of bacteria.' },
            { label: 'Staphylococci', description: 'Round bacteria that form grape-like clusters. Cause staph infections, boils, and impetigo. MRSA is a dangerous antibiotic-resistant strain.' },
            { label: 'Streptococci', description: 'Round bacteria that form chains. Cause strep throat, scarlet fever, and skin infections.' },
            { label: 'Bacilli', description: 'Rod-shaped bacteria that cause tetanus, tuberculosis, and diphtheria. Some form protective spores that are highly resistant.' },
          ],
          facts: [
            { text: 'Bacteria can double in number every 20 minutes under ideal conditions.' },
            { text: 'Nonpathogenic bacteria are harmless or beneficial — like those used in yogurt production.' },
            { text: 'Pathogenic bacteria cause disease and require strict sanitation protocols to prevent spread.' },
          ],
        },
        {
          id: 'viruses',
          label: 'Viruses',
          title: 'Viruses: Invisible but Dangerous',
          bullets: [
            { label: 'Bloodborne Pathogens', description: 'Hepatitis B, Hepatitis C, and HIV are the primary bloodborne viruses barbers must protect against. They spread through blood and bodily fluid contact.' },
            { label: 'Hepatitis B', description: 'Extremely contagious. The virus can survive outside the body for 7+ days. The Hep B vaccine is strongly recommended for all barbers.' },
            { label: 'Hepatitis C', description: 'Often asymptomatic for years. No vaccine exists. Spread through blood contact with contaminated tools or surfaces.' },
            { label: 'HIV', description: 'While less contagious than Hepatitis B, HIV is still a serious concern. It requires blood-to-blood contact for transmission.' },
          ],
          facts: [
            { text: 'Viruses are much smaller than bacteria and cannot be seen with standard microscopes.' },
            { text: 'Unlike bacteria, viruses cannot reproduce outside a living host cell.' },
            { text: 'Disinfectants effective against bacteria may not kill viruses — check EPA registration labels.' },
          ],
        },
        {
          id: 'fungi',
          label: 'Fungi',
          title: 'Fungi: Persistent Skin & Nail Threats',
          bullets: [
            { label: 'Ringworm (Tinea)', description: 'A fungal infection of the skin that appears as circular, red, scaly patches. Highly contagious through direct contact and contaminated tools.' },
            { label: 'Athlete\'s Foot', description: 'Fungal infection of the feet that can spread to hands and tools. Common in environments where people walk barefoot.' },
            { label: 'Nail Fungus', description: 'Discolored, thickened nails caused by fungal infection. Can spread through contaminated nail tools and clippers.' },
            { label: 'Barber\'s Itch', description: 'A staphylococcal infection of the beard area, sometimes confused with fungal infections. Requires medical treatment.' },
          ],
          facts: [
            { text: 'Fungi thrive in warm, moist environments — like towels, capes, and damp floors.' },
            { text: 'Spores can survive on surfaces for months if not properly disinfected.' },
            { text: 'Always disinfect tools between clients, even when no visible infection is present.' },
          ],
        },
        {
          id: 'parasites',
          label: 'Parasites',
          title: 'Parasites: External Infestations',
          bullets: [
            { label: 'Head Lice', description: 'Tiny insects that live on the scalp and feed on blood. Spread through direct head-to-head contact and shared combs, brushes, or caps.' },
            { label: 'Scabies Mites', description: 'Microscopic mites that burrow into skin, causing intense itching. Spread through prolonged skin-to-skin contact.' },
            { label: 'Bed Bugs', description: 'While not a barbering-specific parasite, bed bugs can hitchhike on clothing and bags. Be aware if clients mention infestations at home.' },
          ],
          facts: [
            { text: 'If you discover lice on a client, stop service immediately and refer them to a physician.' },
            { text: 'Disinfect all tools and wash capes and towels in hot water after any suspected parasite exposure.' },
            { text: 'Never treat a client with an active infestation — this is outside your scope of practice.' },
          ],
        },
      ],
    },

    // Section 3b: Infection Classifications
    {
      type: 'tabbed',
      id: 'infection-classifications',
      title: 'Infection Classifications',
      subtitle: 'Understanding how infections spread and progress',
      tabs: [
        {
          id: 'local-vs-general',
          label: 'Local vs General',
          title: 'Local vs General Infections',
          bullets: [
            { label: 'Local Infection', description: 'Confined to a specific area of the body. Example: A pimple or boil on one area of the skin. The body usually contains it with white blood cells.' },
            { label: 'General Infection', description: 'Spreads throughout the body via bloodstream or lymphatic system. Example: Tetanus or tuberculosis affecting multiple organs. Requires immediate medical attention.' },
          ],
          facts: [
            { text: 'A local infection can become general if not properly treated or if the immune system is compromised.' },
            { text: 'Barbers must recognize signs of local infection and refuse service to prevent spreading it.' },
          ],
        },
        {
          id: 'primary-vs-secondary',
          label: 'Primary vs Secondary',
          title: 'Primary vs Secondary Infections',
          bullets: [
            { label: 'Primary Infection', description: 'The initial infection that occurs when a pathogen first invades the body. Example: A fresh staph infection from a contaminated tool.' },
            { label: 'Secondary Infection', description: 'An infection that occurs because the body is already weakened by a primary infection. Example: A fungal infection developing after a bacterial infection has compromised the skin barrier.' },
          ],
          facts: [
            { text: 'Secondary infections are often harder to treat because the body\'s defenses are already compromised.' },
            { text: 'Proper disinfection prevents primary infections, which in turn prevents secondary infections.' },
          ],
        },
        {
          id: 'contagious-vs-non',
          label: 'Contagious vs Non-Contagious',
          title: 'Contagious vs Non-Contagious Diseases',
          bullets: [
            { label: 'Contagious Disease', description: 'Can be transmitted from one person to another through direct or indirect contact. Examples: Ringworm, flu, staph infections, lice.' },
            { label: 'Non-Contagious Disease', description: 'Cannot be transmitted between people. Examples: Genetic conditions, autoimmune disorders, some types of dermatitis.' },
          ],
          facts: [
            { text: 'Barbers must be able to identify contagious conditions to protect themselves and other clients.' },
            { text: 'When in doubt, refuse service and refer the client to a physician.' },
          ],
        },
      ],
    },

    // Section 3c: Methods of Transmission
    {
      type: 'featureGrid',
      id: 'transmission-methods',
      title: 'Methods of Disease Transmission',
      subtitle: 'How pathogens travel from person to person',
      features: [
        {
          icon: 'User',
          title: 'Direct Contact',
          description: 'Physical transfer through touching, kissing, coughing, sneezing, or contact with open wounds. Example: Shaking hands with someone who has a contagious skin infection.',
        },
        {
          icon: 'Package',
          title: 'Indirect Contact',
          description: 'Transfer through contaminated objects, airborne particles, vectors, or contaminated food/water. Example: Using a comb that was used on a client with ringworm.',
        },
        {
          icon: 'Wind',
          title: 'Airborne Transmission',
          description: 'Pathogens travel through the air on dust particles or respiratory droplets. Example: Tuberculosis bacteria can remain airborne for hours in poorly ventilated spaces.',
        },
        {
          icon: 'Bug',
          title: 'Vector-Borne',
          description: 'Transmission through insects or animals. Less common in barbering but important to know. Example: Mosquitoes transmitting certain viruses.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'transmission-warning',
      content: 'In barbering, the most common transmission routes are direct skin-to-skin contact and indirect contact through contaminated tools, capes, and surfaces. Understanding these pathways helps you target your infection control efforts where they matter most.',
      highlight: 'Most common in barbering',
    },

    // Section 3d: Bacterial Growth
    {
      type: 'tabbed',
      id: 'bacterial-growth',
      title: 'Bacterial Growth & Reproduction',
      subtitle: 'How bacteria multiply and why speed matters',
      tabs: [
        {
          id: 'active-stage',
          label: 'Active Stage',
          title: 'Active Stage: Rapid Reproduction',
          bullets: [
            { label: 'Binary Fission', description: 'Bacteria reproduce by splitting into two identical cells. One bacterium becomes two, two become four, four become eight, and so on.' },
            { label: 'Growth Rate', description: 'Under ideal conditions (warmth, moisture, food source), bacteria can double every 20 minutes. One bacterium can become millions in just hours.' },
            { label: 'Ideal Conditions', description: 'Warmth, moisture, darkness, and organic material (skin cells, hair, blood) create perfect breeding grounds for bacteria.' },
          ],
          facts: [
            { text: 'A single bacterium can produce over 16 million descendants in just 8 hours under ideal conditions.' },
            { text: 'This is why prompt cleaning and disinfection between clients is absolutely critical.' },
          ],
        },
        {
          id: 'inactive-stage',
          label: 'Inactive Stage',
          title: 'Inactive Stage: Spore Formation',
          bullets: [
            { label: 'Spores', description: 'When conditions become unfavorable (too dry, too cold, no food), some bacteria form protective spores. These spores are extremely resistant to heat, cold, and disinfectants.' },
            { label: 'Reactivation', description: 'When conditions improve, spores can reactivate and return to the active stage, resuming reproduction.' },
            { label: 'Why It Matters', description: 'Standard disinfectants do NOT kill bacterial spores. Only sterilization (autoclaving) destroys spores completely.' },
          ],
          facts: [
            { text: 'Bacillus and Clostridium bacteria are known for forming spores that can survive for years.' },
            { text: 'This is why sterilization is required for tools that penetrate the skin — spores can cause serious infections.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'bacterial-growth-warning',
      content: 'Board Exam Alert: Remember that bacteria reproduce through binary fission in the active stage and form resistant spores in the inactive stage. Standard disinfectants kill active bacteria but NOT spores — only sterilization destroys spores.',
      highlight: 'Board Exam Alert',
    },

    // Section 4: The Four Levels of Clean
    {
      type: 'featureGrid',
      id: 'four-levels-of-clean',
      title: 'The Four Levels of Clean',
      subtitle: 'Understanding the hierarchy of sanitation',
      features: [
        {
          icon: 'Droplets',
          title: '1. Cleaning',
          description: 'Removes visible dirt, debris, and organic matter using soap and water. This is the essential first step — disinfectants cannot work through dirt and hair.',
        },
        {
          icon: 'Sparkles',
          title: '2. Sanitizing',
          description: 'Reduces bacteria to safe levels as determined by public health standards. Common on surfaces like floors and counters, but not sufficient for tools.',
        },
        {
          icon: 'ShieldCheck',
          title: '3. Disinfecting',
          description: 'Kills most microorganisms on non-porous surfaces. This is the standard for barbering tools and is required between every client. Does not kill spores.',
        },
        {
          icon: 'Flame',
          title: '4. Sterilizing',
          description: 'Destroys all microbial life including bacterial spores. Required for instruments that penetrate skin, such as tattoo needles. Achieved through autoclaving.',
        },
      ],
    },
    {
      type: 'checklist',
      id: 'disinfection-procedure',
      title: 'The 8-Step Disinfection Procedure',
      subtitle: 'Follow this exact sequence for every tool, every time',
      items: [
        { text: 'Step 1: Clean — Remove all visible hair, debris, and product residue from the tool' },
        { text: 'Step 2: Wash — Use soap and water to remove oils and organic matter' },
        { text: 'Step 3: Rinse — Thoroughly rinse away all soap and loosened debris' },
        { text: 'Step 4: Dry — Completely dry the tool with a clean towel or air dry' },
        { text: 'Step 5: Immerse — Fully submerge the tool in EPA-registered disinfectant for the full contact time' },
        { text: 'Step 6: Wait — Follow manufacturer contact time (typically 10 minutes) — do not rush this' },
        { text: 'Step 7: Remove — Use gloves and tongs to remove tools from disinfectant' },
        { text: 'Step 8: Store — Place in a clean, covered container labeled "Clean & Disinfected"' },
      ],
    },

    // INTERACTIVE: Sanitization Challenge
    {
      type: 'challengeCard',
      id: 'sanitization-challenges',
      title: '🧪 Sanitization Challenge',
      subtitle: 'Quick drills to lock in proper disinfection habits',
      challenges: [
        {
          badge: 'Level 1',
          title: 'Tool Inspection',
          description: 'Before disinfecting any tool, inspect it under light for hair, skin cells, and product residue.',
          action: 'Pick up your most-used clipper right now and inspect the blades. Is it truly clean?',
          difficulty: 'easy',
        },
        {
          badge: 'Level 2',
          title: 'Contact Time Test',
          description: 'Most barbers rush disinfection. The full contact time is non-negotiable for efficacy.',
          action: 'Set a timer for 10 minutes the next time you disinfect tools. Do not remove them early.',
          difficulty: 'medium',
        },
        {
          badge: 'Level 3',
          title: 'Solution Check',
          description: 'Disinfectant solution becomes contaminated over time and loses effectiveness.',
          action: 'Check your disinfectant solution right now. Is it clear? Fresh? Within the manufacturer\'s recommended usage period?',
          difficulty: 'medium',
        },
        {
          badge: 'Level 4',
          title: 'Full Protocol Run',
          description: 'Perform the complete 8-step disinfection procedure from start to finish without skipping a step.',
          action: 'Time yourself performing the full 8-step protocol on one tool. Aim for perfection, not speed.',
          difficulty: 'hard',
        },
      ],
    },

    // Section 4b: SDS and Chemical Safety
    {
      type: 'tabbed',
      id: 'sds-safety',
      title: 'Safety Data Sheets (SDS)',
      subtitle: 'Understanding chemical safety for barbershop products',
      tabs: [
        {
          id: 'sds-basics',
          label: 'SDS Basics',
          title: 'What is an SDS?',
          bullets: [
            { label: 'Definition', description: 'Safety Data Sheets (formerly called Material Safety Data Sheets or MSDS) provide detailed information about chemical products, including hazards, handling, storage, and emergency procedures.' },
            { label: 'OSHA Requirement', description: 'OSHA\'s Hazard Communication Standard requires that SDSs be readily accessible for every chemical product in the workplace.' },
            { label: '16 Categories', description: 'SDSs contain 16 standardized sections including identification, hazard classification, composition, first aid, firefighting, accidental release, handling, exposure controls, physical properties, stability, toxicology, ecology, disposal, transport, regulations, and other information.' },
          ],
          facts: [
            { text: 'SDSs must be available within 5 minutes of a request during an inspection.' },
            { text: 'Digital copies are acceptable as long as employees know how to access them.' },
          ],
        },
        {
          id: 'ghs-pictograms',
          label: 'GHS Pictograms',
          title: 'GHS Hazard Pictograms',
          bullets: [
            { label: 'What is GHS?', description: 'The Globally Harmonized System of Classification and Labeling of Chemicals standardizes hazard symbols worldwide so workers can quickly identify dangers.' },
            { label: 'Common Pictograms', description: 'Flame (flammable), Flame Over Circle (oxidizer), Gas Cylinder (compressed gas), Corrosion (skin/eye damage), Skull & Crossbones (acute toxicity), Exclamation Mark (irritant), Health Hazard (carcinogen), Environment (aquatic toxicity).' },
            { label: 'Why They Matter', description: 'Pictograms allow workers to identify hazards at a glance, even if they cannot read the language on the label.' },
          ],
          facts: [
            { text: 'GHS pictograms are required on all chemical containers in the workplace.' },
            { text: 'Secondary containers (spray bottles) must also have GHS labels if they contain hazardous chemicals.' },
          ],
        },
        {
          id: 'chemical-safety',
          label: 'Chemical Safety',
          title: 'Safe Chemical Handling',
          bullets: [
            { label: 'Never Mix Chemicals', description: 'Mixing cleaning products can create toxic gases. Never mix bleach with ammonia or acids — this can produce deadly chlorine gas.' },
            { label: 'Proper Storage', description: 'Store chemicals in original containers with labels intact. Keep away from heat sources and direct sunlight. Ensure proper ventilation.' },
            { label: 'PPE for Chemicals', description: 'Wear gloves, eye protection, and apron when handling caustic chemicals. Read the SDS for specific PPE requirements.' },
            { label: 'Disposal', description: 'Dispose of chemicals according to SDS instructions and local regulations. Never pour hazardous chemicals down the drain.' },
          ],
          facts: [
            { text: 'Improper chemical mixing is a leading cause of workplace injuries in salons and barbershops.' },
            { text: 'When in doubt about a chemical reaction, evacuate the area and call poison control.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'sds-exam-tip',
      content: 'Board Exam Tip: Know that SDSs have 16 categories, GHS pictograms are used for hazard identification, and OSHA requires SDSs to be readily accessible. The most common exam question tests whether you know that SDSs replaced MSDSs and that they contain 16 standardized sections.',
      highlight: 'Board Exam Tip',
    },

    // Section 5: Standard Precautions
    {
      type: 'featureGrid',
      id: 'standard-precautions',
      title: 'Standard Precautions',
      subtitle: 'Treat every client as if they are infectious',
      features: [
        {
          icon: 'Hand',
          title: 'Hand Hygiene',
          description: 'Wash hands before and after every client, after removing gloves, after touching contaminated surfaces, and before eating or drinking. Use soap and water for at least 20 seconds.',
        },
        {
          icon: 'Shield',
          title: 'Personal Protective Equipment (PPE)',
          description: 'Wear disposable gloves when contact with blood or body fluids is possible. Change gloves between clients. Use protective eyewear and aprons for high-risk services.',
        },
        {
          icon: 'Scissors',
          title: 'Preventing Injuries',
          description: 'Never recap used blades. Use safety razors with retractable blades. Keep sharps containers within arm\'s reach. Never pass sharp instruments hand-to-hand.',
        },
        {
          icon: 'Trash2',
          title: 'Safe Disposal',
          description: 'Dispose of single-use items immediately after use. Place sharps in puncture-resistant containers. Seal and dispose of biohazard waste according to local regulations.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'universal-warning',
      content: 'You cannot tell by looking who has HIV, Hepatitis B, or Hepatitis C. Many people with bloodborne infections show no visible symptoms. This is why Standard Precautions must be followed for every single client, every single time — without exception.',
      highlight: 'You cannot tell by looking',
    },

    // INTERACTIVE: PPE Readiness Checklist
    {
      type: 'checklist',
      id: 'ppe-checklist',
      title: '⚡ Pre-Service PPE Readiness Checklist',
      subtitle: 'Complete this checklist before every client',
      items: [
        { text: 'Fresh pair of disposable gloves within reach' },
        { text: 'Clean cape and neck strip ready' },
        { text: 'All tools cleaned and disinfected from previous client' },
        { text: 'Disinfectant solution is fresh and at proper concentration' },
        { text: 'Sharps container is accessible and not overfilled' },
        { text: 'Hand sanitizer or soap and water available' },
        { text: 'Trash bin is empty and lined' },
        { text: 'First aid kit is stocked and accessible' },
      ],
    },

    // Section 5b: Immunity Types
    {
      type: 'tabbed',
      id: 'immunity-types',
      title: 'Understanding Immunity',
      subtitle: 'How the body fights infection',
      tabs: [
        {
          id: 'natural-vs-acquired',
          label: 'Natural vs Acquired',
          title: 'Natural vs Acquired Immunity',
          bullets: [
            { label: 'Natural Immunity', description: 'Immunity you are born with. Partly inherited and partly developed through normal exposure to everyday germs. Provides general protection against many pathogens.' },
            { label: 'Acquired Immunity', description: 'Immunity developed after exposure to a specific pathogen or through vaccination. The body creates antibodies that recognize and attack that specific pathogen.' },
          ],
          facts: [
            { text: 'Natural immunity is your first line of defense. Acquired immunity provides targeted protection.' },
            { text: 'Vaccines help your body develop acquired immunity without getting sick.' },
          ],
        },
        {
          id: 'active-vs-passive',
          label: 'Active vs Passive',
          title: 'Active vs Passive Immunity',
          bullets: [
            { label: 'Active Immunity', description: 'Developed when your body produces its own antibodies after exposure to a disease or vaccination. Long-lasting protection. Example: Getting the Hepatitis B vaccine.' },
            { label: 'Passive Immunity', description: 'Received from another source, such as antibodies passed from mother to baby or through antibody treatments. Temporary protection that fades over time.' },
          ],
          facts: [
            { text: 'Active immunity lasts years or even a lifetime. Passive immunity lasts weeks to months.' },
            { text: 'Barbers should maintain active immunity through vaccinations, especially Hepatitis B.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'hepatitis-vaccine',
      title: 'Hepatitis B Vaccine for Barbers',
      content: 'OSHA requires employers to offer the Hepatitis B vaccine series to all employees who may be exposed to blood or bodily fluids. The vaccine is typically given as three shots over six months and provides long-term protection. While employers must offer it, employees can decline. However, as a barber, getting vaccinated is one of the smartest investments in your long-term health.',
      highlight: 'Get vaccinated',
    },

    // Section 5c: Biofilms
    {
      type: 'infoCards',
      id: 'biofilms',
      title: 'Biofilms: Hidden Threats',
      subtitle: 'Why slime on your tools is more dangerous than it looks',
      cards: [
        {
          icon: 'AlertTriangle',
          title: 'What Are Biofilms?',
          text: 'Biofilms are colonies of microorganisms that stick to surfaces and each other, surrounded by a protective slime layer. This slime makes them up to 1,000 times more resistant to disinfectants than free-floating bacteria.',
        },
        {
          icon: 'Shield',
          title: 'Where They Form',
          text: 'Biofilms form on wet surfaces, in drain pipes, inside disinfectant containers, on tools left damp, and on station surfaces that are not properly dried. Anywhere moisture and organic material meet, biofilms can develop.',
        },
        {
          icon: 'Droplets',
          title: 'How to Prevent Them',
          text: 'Thoroughly dry all tools after cleaning before disinfecting. Change disinfectant solutions regularly. Clean and dry containers between refills. Do not let water sit in tool trays or disinfectant jars overnight.',
        },
      ],
    },

    // Section 6: Proper Hand Washing
    {
      type: 'checklist',
      id: 'hand-washing-steps',
      title: 'Proper Hand Washing Technique',
      subtitle: 'The single most important infection control action',
      items: [
        { text: 'Step 1: Wet your hands with warm running water' },
        { text: 'Step 2: Apply liquid soap (bar soap can harbor bacteria)' },
        { text: 'Step 3: Lather thoroughly — palms, backs, between fingers, under nails, and wrists' },
        { text: 'Step 4: Scrub for at least 20 seconds (sing "Happy Birthday" twice)' },
        { text: 'Step 5: Rinse completely under running water' },
        { text: 'Step 6: Dry with a single-use paper towel' },
        { text: 'Step 7: Turn off the faucet using the paper towel (not your clean hands)' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'when-to-wash',
      title: 'When to Wash Your Hands',
      content: 'Before beginning service on each client. After touching contaminated surfaces, tools, or materials. After removing gloves. After contact with blood or body fluids. After using the restroom. Before eating or drinking. After coughing, sneezing, or blowing your nose. After handling money or personal items.',
      highlight: 'Before beginning service on each client',
    },

    // Section 6b: Water & Electrical Safety
    {
      type: 'tabbed',
      id: 'water-electrical-safety',
      title: 'Water & Electrical Safety',
      subtitle: 'Preventing burns, shocks, and scalds',
      tabs: [
        {
          id: 'water-safety',
          label: 'Water Safety',
          title: 'Water Safety in the Barbershop',
          bullets: [
            { label: 'Maximum Temperature', description: 'Water temperature should never exceed 130°F (54°C) for shampooing. Higher temperatures can cause serious burns, especially on clients with sensitive skin or children.' },
            { label: 'Test Before Use', description: 'Always test water temperature on your wrist before applying to a client\'s scalp. What feels warm to you may be too hot for someone else.' },
            { label: 'Spray Hoses', description: 'Be careful with spray hoses at shampoo bowls. Sudden pressure changes can cause hot water surges. Hold the sprayer away from the client when turning on the water.' },
            { label: 'Avoid Very Hot Water', description: 'Very hot water dries out skin and scalp, damages hair, and increases risk of burns. Use warm, comfortable water instead.' },
          ],
          facts: [
            { text: 'Scalding can occur in just 5 seconds at 140°F water temperature.' },
            { text: 'Children and elderly clients are especially vulnerable to hot water burns.' },
          ],
        },
        {
          id: 'electrical-safety',
          label: 'Electrical Safety',
          title: 'Electrical Safety in the Barbershop',
          bullets: [
            { label: 'GFCI Outlets', description: 'Ground Fault Circuit Interrupter (GFCI) outlets must be installed near all water sources. These outlets shut off power instantly if they detect an electrical fault, preventing electrocution.' },
            { label: 'Keep Appliances Unplugged', description: 'Keep electrical appliances (clippers, trimmers, hair dryers) unplugged when not in use and never leave them near water sources when plugged in.' },
            { label: 'Check Cords Regularly', description: 'Inspect electrical cords for fraying, exposed wires, or damage. Replace damaged cords immediately — never use tape as a temporary fix.' },
            { label: 'No Overloading', description: 'Do not overload electrical outlets with multiple appliances. Use power strips with surge protection, not cheap extension cords.' },
          ],
          facts: [
            { text: 'Water and electricity are a deadly combination. Always unplug before cleaning electrical tools.' },
            { text: 'GFCI outlets are required by electrical code in areas near water sources.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'safety-exam-alert',
      content: 'Board Exam Alert: Know that GFCI outlets are required near water sources, maximum water temperature is 130°F, and electrical appliances must be unplugged before cleaning. These are common state board exam questions.',
      highlight: 'Board Exam Alert',
    },

    // Section 7: Safe Work Practices
    {
      type: 'tabbed',
      id: 'safe-work-practices',
      title: 'Safe Work Practices',
      subtitle: 'Protecting yourself and clients throughout the workday',
      tabs: [
        {
          id: 'workstation-setup',
          label: 'Workstation Setup',
          title: 'Organize Your Station for Safety',
          bullets: [
            { label: 'Clean Zone', description: 'Designate an area for clean, disinfected tools that have not touched a client. This zone stays contamination-free.' },
            { label: 'Contaminated Zone', description: 'Designate an area for used tools, capes, and materials that have touched a client. Keep this separate from the Clean Zone.' },
            { label: 'Disposal Zone', description: 'Keep a lined trash bin and sharps container within easy reach. Never walk across the shop with a used blade.' },
            { label: 'Product Safety', description: 'Use pump or shaker dispensers for products. Never double-dip into containers. Discard single-use items immediately.' },
          ],
        },
        {
          id: 'during-service',
          label: 'During Service',
          title: 'Safety During Every Service',
          bullets: [
            { label: 'Inspect Before You Cut', description: 'Examine the client\'s scalp and skin before beginning. Look for open wounds, infections, rashes, or parasites. If you find something, stop and refer them to a physician.' },
            { label: 'Use Neck Strips', description: 'Always place a fresh neck strip between the client\'s skin and the cape. This prevents cross-contamination and absorbs perspiration.' },
            { label: 'Never Double-Dip', description: 'Once a brush, comb, or applicator has touched a client, it is contaminated. Do not return it to a shared product container.' },
            { label: 'Handle Sharps with Care', description: 'Never leave blades exposed on your station. Use a safety razor or guard your straight razor. Pass tools handle-first if you must hand them to someone.' },
          ],
        },
        {
          id: 'end-of-day',
          label: 'End-of-Day',
          title: 'Closing Procedures for a Safe Shop',
          bullets: [
            { label: 'Step 1: Dispose', description: 'Empty all trash bins and replace liners. Seal sharps containers when they are 3/4 full.' },
            { label: 'Step 2: Clean', description: 'Sweep and mop all floors. Wipe down all chairs, stations, and shared surfaces with disinfectant.' },
            { label: 'Step 3: Disinfect', description: 'Run all multi-use tools through the complete disinfection procedure. Never leave tools dirty overnight.' },
            { label: 'Step 4: Store', description: 'Store clean tools in covered containers. Lock up chemicals and sharp instruments.' },
            { label: 'Step 5: Check', description: 'Verify that disinfectant solutions are fresh, PPE is restocked, and first aid supplies are available.' },
            { label: 'Step 6: Document', description: 'Log any exposure incidents, equipment maintenance, or sanitation concerns in the shop log.' },
            { label: 'Step 7: Ventilate', description: 'Run ventilation systems to clear chemical fumes and airborne particles before closing.' },
          ],
        },
      ],
    },

    // INTERACTIVE: Safety Actions
    {
      type: 'actionPrompt',
      id: 'daily-safety-actions',
      title: '⚡ Safety Actions: Build the Habit',
      subtitle: 'Four daily practices that prevent infection',
      prompts: [
        {
          action: 'The Glove Check',
          description: 'Before your first client, check that you have a full box of disposable gloves within arm\'s reach.',
          benefit: 'Eliminates the temptation to skip gloves when you are busy.',
          timeframe: 'Every morning before opening',
        },
        {
          action: 'The Solution Test',
          description: 'Check your disinfectant solution for clarity, proper concentration, and expiration.',
          benefit: 'Ensures your tools are actually being disinfected, not just rinsed.',
          timeframe: 'At opening and midday',
        },
        {
          action: 'The Station Sweep',
          description: 'Wipe down your entire station with disinfectant between every client — not just your tools.',
          benefit: 'Removes invisible contamination from armrests, trays, and product bottles.',
          timeframe: 'Between every client',
        },
        {
          action: 'The Blade Audit',
          description: 'Count and inspect all blades and sharp tools at closing. Dispose of any dull or damaged blades.',
          benefit: 'Prevents accidental cuts from dull blades and ensures proper sharps disposal.',
          timeframe: 'At end of day',
        },
      ],
    },

    // Section 8: Handling Exposure Incidents
    {
      type: 'infoCards',
      id: 'exposure-incidents',
      title: 'Handling Exposure Incidents',
      subtitle: 'What to do when blood or body fluids are involved',
      cards: [
        {
          icon: 'AlertCircle',
          title: 'Immediate Response',
          text: 'Stop the service immediately. If the client is cut, apply first aid with a clean cotton round and slight pressure. If blood splashes into your eyes or mouth, flush with water for 15 minutes. Remove contaminated gloves carefully without touching the outside.',
        },
        {
          icon: 'FileText',
          title: 'Document Everything',
          text: 'Record the date, time, nature of the incident, names of those involved, and actions taken. Use the shop\'s Exposure Incident Report form. This documentation is required by OSHA and protects both you and the business.',
        },
        {
          icon: 'Stethoscope',
          title: 'Medical Follow-Up',
          text: 'If you were exposed to blood or body fluids, seek medical evaluation immediately. The Hepatitis B vaccine series should be offered to all barbers. Post-exposure prophylaxis may be recommended depending on the source client\'s status.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'exposure-warning',
      content: 'Quick action matters. The sooner you clean a wound, disinfect tools, and seek medical evaluation after an exposure, the lower your risk of infection. Never delay because you are embarrassed or because the client downplays the incident.',
      highlight: 'Quick action matters',
    },

    // Section 8b: Contagious Diseases to Recognize
    {
      type: 'tabbed',
      id: 'contagious-diseases',
      title: 'Contagious Diseases to Recognize',
      subtitle: 'When to refuse service and refer to a physician',
      tabs: [
        {
          id: 'bacterial-infections',
          label: 'Bacterial',
          title: 'Bacterial Infections',
          bullets: [
            { label: 'Impetigo', description: 'Highly contagious bacterial skin infection causing red sores that rupture and form honey-colored crusts. Common in children. Stop service immediately.' },
            { label: 'Folliculitis', description: 'Inflammation of hair follicles appearing as small red bumps or white-headed pimples. Can spread through contaminated tools.' },
            { label: 'Boils (Furuncles)', description: 'Painful, pus-filled bumps under the skin caused by infected hair follicles. Highly contagious until healed.' },
            { label: 'MRSA', description: 'Antibiotic-resistant staph infection that can cause severe skin infections. Spread through skin contact and contaminated surfaces.' },
          ],
          facts: [
            { text: 'Never service a client with active bacterial skin infections — this protects you, the client, and future clients.' },
            { text: 'When in doubt, refer to a physician. It is better to be cautious than to spread infection.' },
          ],
        },
        {
          id: 'viral-infections',
          label: 'Viral',
          title: 'Viral Infections',
          bullets: [
            { label: 'Herpes Simplex (Cold Sores)', description: 'Highly contagious blister-like sores around the mouth. Active sores mean the virus is shedding. Do not service if lesions are present.' },
            { label: 'Warts', description: 'Caused by human papillomavirus (HPV). Can spread through direct contact and shared tools. Stop service if warts are in the service area.' },
            { label: 'Molluscum Contagiosum', description: 'Viral skin infection causing small, flesh-colored bumps with a central dimple. Highly contagious through direct contact and shared items.' },
          ],
          facts: [
            { text: 'Viral infections like herpes can be transmitted even before visible symptoms appear.' },
            { text: 'Always use barriers and disinfect thoroughly when serving clients with a history of viral skin conditions.' },
          ],
        },
        {
          id: 'fungal-infections',
          label: 'Fungal',
          title: 'Fungal Infections',
          bullets: [
            { label: 'Ringworm (Tinea Capitis)', description: 'Circular, scaly, red patches with raised borders and clearer centers. Highly contagious. Stop service and refer to physician.' },
            { label: 'Tinea Barbae', description: 'Fungal infection of the beard area causing red, scaly patches and hair loss. Also called "barber\'s itch." Contagious through tools.' },
            { label: 'Athlete\'s Foot (Tinea Pedis)', description: 'Fungal infection of feet that can spread to hands and tools. Common in warm, moist environments.' },
          ],
          facts: [
            { text: 'Fungal spores can survive on tools and surfaces for months if not properly disinfected.' },
            { text: 'EPA-registered fungicidal disinfectants are required to kill fungal spores.' },
          ],
        },
        {
          id: 'parasitic-infestations',
          label: 'Parasitic',
          title: 'Parasitic Infestations',
          bullets: [
            { label: 'Head Lice (Pediculosis)', description: 'Tiny insects that live on scalp and feed on blood. Eggs (nits) attach to hair shafts. Stop service immediately and refer to physician.' },
            { label: 'Scabies', description: 'Microscopic mites burrow into skin causing intense itching and rash. Spread through prolonged skin-to-skin contact.' },
          ],
          facts: [
            { text: 'If you discover lice or scabies on a client, stop service, disinfect all tools, and wash all linens in hot water.' },
            { text: 'Never treat parasitic infestations — this is outside your scope of practice and requires medical treatment.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'refuse-service',
      title: 'When to Refuse Service',
      content: 'You have both the right and the obligation to refuse service when you suspect a contagious condition. Politely explain that you are concerned about their health and the health of other clients, and recommend they see a physician. Document the refusal in your records. Never make a diagnosis — simply state that you are not comfortable proceeding and suggest medical evaluation.',
      highlight: 'You have the right to refuse service',
    },

    // Section 8c: Disinfectant Types Deep Dive
    {
      type: 'tabbed',
      id: 'disinfectant-types',
      title: 'Types of Disinfectants',
      subtitle: 'Choosing the right disinfectant for the job',
      tabs: [
        {
          id: 'hospital-disinfectants',
          label: 'Hospital Grade',
          title: 'Hospital Disinfectants',
          bullets: [
            { label: 'Definition', description: 'EPA-registered disinfectants effective against a broad spectrum of bacteria, viruses, and fungi. Required for surfaces that contact blood or body fluids.' },
            { label: 'When to Use', description: 'Use on non-porous tools and surfaces that have contacted blood or body fluids. Required for barbering implements.' },
            { label: 'Contact Time', description: 'Typically 10 minutes of wet contact time required. Read the label — never guess.' },
          ],
          facts: [
            { text: 'Hospital disinfectants are the minimum standard for barbering tools between clients.' },
            { text: 'Always check the EPA registration number on the label to verify efficacy claims.' },
          ],
        },
        {
          id: 'tuberculocidal',
          label: 'Tuberculocidal',
          title: 'Tuberculocidal Disinfectants',
          bullets: [
            { label: 'Definition', description: 'Disinfectants proven effective against Mycobacterium tuberculosis (TB bacteria). TB bacteria are harder to kill than most pathogens, so these disinfectants are considered high-level.' },
            { label: 'When Required', description: 'Required when blood or body fluids are present. Some state boards require tuberculocidal disinfectants for all barbering tools.' },
            { label: 'Examples', description: 'Phenolic disinfectants and some quaternary ammonium compounds with tuberculocidal claims.' },
          ],
          facts: [
            { text: 'If a disinfectant can kill TB bacteria, it can kill most other pathogens you will encounter.' },
            { text: 'Check your state board requirements — some states mandate tuberculocidal disinfectants.' },
          ],
        },
        {
          id: 'quats',
          label: 'Quats',
          title: 'Quaternary Ammonium Compounds (Quats)',
          bullets: [
            { label: 'Definition', description: 'Common disinfectants that are effective against many bacteria and some viruses and fungi. Less corrosive than phenolics and generally safer to handle.' },
            { label: 'Advantages', description: 'Low odor, non-corrosive to metal, good for daily use on tools and surfaces. Many are EPA-registered for barbershop use.' },
            { label: 'Limitations', description: 'Not effective against bacterial spores or some viruses. Must be used at proper dilution. Inactivated by organic matter (hair, blood, skin cells).' },
          ],
          facts: [
            { text: 'Quats are popular in barbershops because they are effective and gentle on tools.' },
            { text: 'Always clean tools before using quats — organic matter deactivates them.' },
          ],
        },
        {
          id: 'phenolics',
          label: 'Phenolics',
          title: 'Phenolic Disinfectants',
          bullets: [
            { label: 'Definition', description: 'Powerful disinfectants effective against bacteria, fungi, and many viruses. Often tuberculocidal. Common in hospital and salon settings.' },
            { label: 'Advantages', description: 'Broad spectrum of kill, including TB bacteria. Effective even in the presence of some organic matter.' },
            { label: 'Cautions', description: 'Can be corrosive to metal over time. Strong odor may irritate sensitive clients. Can damage some plastics and rubber.' },
          ],
          facts: [
            { text: 'Phenolics are excellent for disinfecting countertops and non-metal surfaces.' },
            { text: 'Rinse tools after phenolic disinfection to prevent corrosion.' },
          ],
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'disinfectant-exam-tip',
      content: 'Board Exam Tip: Know the difference between hospital disinfectants, tuberculocidal disinfectants, quats, and phenolics. The exam often asks which disinfectant is appropriate for specific situations. Remember: clean first, then disinfect, and always follow manufacturer contact times.',
      highlight: 'Board Exam Tip',
    },

    // Section 8d: Antiseptics vs Disinfectants
    {
      type: 'featureGrid',
      id: 'antiseptics-vs-disinfectants',
      title: 'Antiseptics vs Disinfectants',
      subtitle: 'Know the difference — one is for skin, one is for surfaces',
      features: [
        {
          icon: 'Hand',
          title: 'Antiseptics',
          description: 'Chemical germicides safe for use on human skin. Reduce microbes but do not sterilize. Examples: isopropyl alcohol (70%), hydrogen peroxide (3%), iodine solutions. Used for skin preparation before shaving or treating minor cuts.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Disinfectants',
          description: 'Chemical agents used on non-living surfaces and tools. Destroy harmful organisms on implements and environmental surfaces. Must be EPA-registered. Never use disinfectants on skin — they can cause irritation, burns, or allergic reactions.',
        },
      ],
    },
    {
      type: 'contentBlock',
      id: 'antiseptic-warning',
      content: 'Common Mistake: Some barbers use surface disinfectants on client\'s skin thinking it provides extra protection. This is dangerous and can cause chemical burns, allergic reactions, or skin damage. Antiseptics are for skin. Disinfectants are for surfaces and tools. Never confuse the two.',
      highlight: 'Common Mistake',
    },

    // Section 8e: Laws vs Rules
    {
      type: 'infoCards',
      id: 'laws-vs-rules',
      title: 'Laws vs Rules & Regulations',
      subtitle: 'Understanding the hierarchy of barbering regulations',
      cards: [
        {
          icon: 'Scale',
          title: 'Laws (Statutes)',
          text: 'Written by state legislatures. Define the scope of practice for barbering, licensing requirements, and broad public health mandates. Change infrequently and require legislative action.',
        },
        {
          icon: 'FileText',
          title: 'Rules & Regulations',
          text: 'Written by state boards and regulatory agencies. More specific than laws and can be updated more frequently. Cover sanitation standards, continuing education, and specific operational requirements.',
        },
        {
          icon: 'AlertTriangle',
          title: 'Why Both Matter',
          text: 'Barbers must comply with both laws and rules. Ignorance is not a defense. State boards can fine, suspend, or revoke licenses for violations of either. Stay current by checking your state board\'s website regularly.',
        },
      ],
    },

    // Final Quote
    {
      type: 'quote',
      id: 'ch4-closing-quote',
      quote: 'The barber who masters infection control does not just protect health — they build trust. Clients may never see your disinfection routine, but they feel the confidence that comes from knowing they are in safe hands.',
    },
  ],
}
