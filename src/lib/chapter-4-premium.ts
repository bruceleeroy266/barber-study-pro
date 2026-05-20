// Chapter 4: Infection Control — PREMIUM IMMERSIVE SAFETY EXPERIENCE
// Professional barber safety certification atmosphere

import type { ChapterTheme, ChapterContent } from './chapter-content'

// ───────────────────────────────────────────────
// PREMIUM SAFETY LAB THEME
// Deep navy / Clinical teal / Warning amber / Biohazard red
// ───────────────────────────────────────────────

export const chapter4PremiumTheme: ChapterTheme = {
  primary: '#0891B2',
  primaryLight: '#22D3EE',
  primaryDark: '#164E63',
  secondary: '#F59E0B',
  background: 'rgba(8, 20, 35, 0.95)',
  backgroundAlt: 'rgba(12, 30, 50, 0.90)',
  surface: '#0A1628',
  border: 'rgba(8, 145, 178, 0.30)',
  text: '#F0F9FF',
  textMuted: '#94A3B8',
  highlight: '#F59E0B',
  timeline: {
    line: 'rgba(8, 145, 178, 0.4)',
    iconBg: '#0C1E32',
    iconBorder: '#0891B2',
  },
  quote: {
    border: 'rgba(8, 145, 178, 0.45)',
    icon: 'rgba(8, 145, 178, 0.35)',
    bg: 'rgba(8, 20, 35, 0.7)',
  },
  tabbed: {
    activeBg: 'rgba(8, 145, 178, 0.18)',
    activeBorder: 'rgba(8, 145, 178, 0.55)',
    activeText: '#22D3EE',
    inactiveBg: 'rgba(8, 20, 35, 0.7)',
    inactiveBorder: 'rgba(8, 145, 178, 0.15)',
    inactiveText: '#94A3B8',
    panelBg: 'rgba(8, 20, 35, 0.8)',
    panelBorder: 'rgba(8, 145, 178, 0.2)',
  },
  toolCard: {
    headerBg: 'rgba(8, 145, 178, 0.12)',
    headerText: '#22D3EE',
    dot: 'rgba(8, 145, 178, 0.65)',
    line: 'rgba(8, 145, 178, 0.3)',
  },
  featureGrid: {
    iconBg: 'rgba(8, 145, 178, 0.18)',
    iconColor: '#0891B2',
    cardBorder: 'rgba(8, 145, 178, 0.22)',
  },
  milestone: {
    yearColor: '#0891B2',
    border: 'rgba(8, 145, 178, 0.25)',
  },
  checklist: {
    checkBorder: 'rgba(8, 145, 178, 0.45)',
    checkColor: '#0891B2',
    bg: 'rgba(8, 20, 35, 0.7)',
  },
  contentBlock: {
    bg: 'rgba(8, 20, 35, 0.7)',
    border: 'rgba(8, 145, 178, 0.2)',
    highlightColor: '#22D3EE',
  },
  challengeCard: {
    badgeBg: 'rgba(8, 145, 178, 0.2)',
    badgeText: '#22D3EE',
    cardBorder: 'rgba(8, 145, 178, 0.25)',
    completedBg: 'rgba(16, 185, 129, 0.1)',
    completedBorder: 'rgba(16, 185, 129, 0.3)',
  },
  scenarioBlock: {
    situationBg: 'rgba(239, 68, 68, 0.08)',
    optionBorder: 'rgba(8, 145, 178, 0.2)',
    correctBg: 'rgba(16, 185, 129, 0.12)',
    incorrectBg: 'rgba(239, 68, 68, 0.1)',
  },
  levelUp: {
    levelBadgeBg: 'rgba(8, 145, 178, 0.2)',
    levelBadgeText: '#22D3EE',
    rewardBg: 'rgba(16, 185, 129, 0.12)',
    rewardText: '#10B981',
  },
  actionPrompt: {
    cardBorder: 'rgba(8, 145, 178, 0.2)',
    completedBorder: 'rgba(16, 185, 129, 0.35)',
    benefitBg: 'rgba(8, 145, 178, 0.1)',
    benefitBorder: 'rgba(8, 145, 178, 0.3)',
  },
}

// ───────────────────────────────────────────────
// PREMIUM IMMERSIVE CHAPTER 4 CONTENT
// ───────────────────────────────────────────────

export const chapter4PremiumContent: ChapterContent = {
  chapterNumber: 4,
  title: 'INFECTION CONTROL',
  subtitle: 'Professional Safety Certification — Protect Lives, Protect Your License',
  theme: chapter4PremiumTheme,
  sections: [
    // ═══════════════════════════════════════════
    // SECTION 1: SAFETY COMMAND CENTER
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'safety-command-center',
      title: '🚨 SAFETY COMMAND CENTER',
      content: 'Welcome to the most critical chapter of your barbering career. This is not just about cleaning — it is about protecting human lives, preventing disease outbreaks, and keeping your professional license. Every decision you make in this chapter affects real people in real barbershops.',
      highlight: 'PROTECT LIVES • PROTECT YOUR LICENSE',
    },

    // ═══════════════════════════════════════════
    // SECTION 2: THE STAKES — REAL CONSEQUENCES
    // ═══════════════════════════════════════════
    {
      type: 'infoCards',
      id: 'real-stakes',
      title: '⚠️ THE REAL STAKES',
      subtitle: 'What happens when infection control fails',
      cards: [
        {
          icon: 'AlertTriangle',
          title: 'LICENSE GONE',
          text: 'One confirmed cross-contamination incident can trigger a state board investigation. Result: license suspension or permanent revocation. Years of training — gone in one mistake.',
        },
        {
          icon: 'Shield',
          title: 'LAWSUIT',
          text: 'A client contracts MRSA from contaminated clippers. Medical bills: $50,000+. Your liability insurance may not cover negligence. Personal assets at risk. Shop closes.',
        },
        {
          icon: 'Heart',
          title: 'LIVES AT RISK',
          text: 'Hepatitis B survives 7+ days outside the body. One nick with an improperly disinfected blade can transmit a lifelong, potentially fatal disease. This is not hypothetical — it happens.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 3: CONTAMINATION SIMULATION
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'contamination-sim-1',
      title: '🧪 CONTAMINATION SIMULATION #1',
      subtitle: 'Trace the infection chain. Identify every failure point.',
      scenarios: [
        {
          situation: 'SCENARIO: A barber finishes a haircut on Client A who has an undiagnosed staph infection. The barber wipes the clippers with a towel, sprays them with "disinfectant" for 30 seconds, and immediately uses them on Client B. Client B develops a painful boil three days later.',
          options: [
            { letter: 'A', text: 'The barber did nothing wrong — infections happen', feedback: '❌ CRITICAL FAILURE. This is gross negligence. Multiple violations occurred.' },
            { letter: 'B', text: 'The barber failed to clean before disinfecting, failed to follow contact time, and failed to use proper disinfectant', feedback: '✅ CORRECT. Three major failures: (1) No cleaning step, (2) 30 seconds vs 10 minutes contact time, (3) Unknown if disinfectant was EPA-registered.' },
            { letter: 'C', text: 'Only the contact time was wrong', feedback: '❌ PARTIAL. Contact time was wrong, but cleaning before disinfecting was also skipped. The towel may have spread contamination.' },
            { letter: 'D', text: 'The disinfectant brand was the problem', feedback: '❌ INCORRECT. The brand is irrelevant if proper procedure is not followed. Even the best disinfectant fails if misused.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 4: OSHA COMPLIANCE DASHBOARD
    // ═══════════════════════════════════════════
    {
      type: 'featureGrid',
      id: 'osha-compliance',
      title: '🛡️ OSHA COMPLIANCE DASHBOARD',
      subtitle: 'Your legal obligations — miss one, risk everything',
      features: [
        {
          icon: 'FileText',
          title: 'EXPOSURE CONTROL PLAN',
          description: 'Every shop MUST have a written plan. Must include: job classifications with exposure risk, procedures for different tasks, schedule for PPE and training, method of compliance evaluation. OSHA inspectors ask for this FIRST.',
        },
        {
          icon: 'Syringe',
          title: 'HEPATITIS B VACCINE',
          description: 'Employers MUST offer the Hep B vaccine series (3 shots over 6 months) to all employees with potential exposure. Must be offered within 10 days of assignment. Employees can decline, but must sign a waiver.',
        },
        {
          icon: 'Glasses',
          title: 'PPE SUPPLY',
          description: 'Employers MUST provide: gloves, eye protection, gowns/aprons at no cost to employees. PPE must be appropriate for the task, properly sized, and readily accessible. Never make employees buy their own safety equipment.',
        },
        {
          icon: 'Trash2',
          title: 'SHARPS DISPOSAL',
          description: 'Puncture-resistant containers must be: easily accessible, upright, not overfilled (replace at 3/4 full), labeled with biohazard symbol, and disposed of per local regulations. Never throw loose blades in trash.',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 5: SPOT THE VIOLATION
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'spot-violation-1',
      title: '🔍 SPOT THE VIOLATION #1',
      subtitle: 'Inspect this barber station. Count the safety violations.',
      scenarios: [
        {
          situation: 'INSPECTION SCENARIO: You walk into a barbershop and see: (1) Clippers with hair on them sitting on a "clean" towel, (2) Disinfectant solution is cloudy and has been sitting out for 3 days, (3) No gloves visible at any station, (4) Used blades in a regular trash can, (5) Barber is eating a sandwich while cutting hair, (6) No SDS binder visible, (7) Cape is draped over the back of a chair, touching the floor.',
          options: [
            { letter: 'A', text: '3 violations', feedback: '❌ UNDERCOUNT. There are at least 7 major violations visible.' },
            { letter: 'B', text: '5 violations', feedback: '❌ STILL UNDER. Keep looking — every item described is a separate violation.' },
            { letter: 'C', text: '7 or more violations', feedback: '✅ CORRECT. (1) Contaminated tools on "clean" surface, (2) Expired disinfectant, (3) No PPE, (4) Improper sharps disposal, (5) Eating while working, (6) Missing SDS, (7) Cape contamination. This shop would fail inspection immediately.' },
            { letter: 'D', text: 'Only 2 violations', feedback: '❌ DANGEROUSLY UNDERCOUNTING. This level of unawareness is how outbreaks happen.' },
          ],
          correctAnswer: 'C',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 6: PATHOGEN THREAT MATRIX
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'pathogen-threat-matrix',
      title: '🦠 PATHOGEN THREAT MATRIX',
      subtitle: 'Know your enemy — classification, transmission, and kill methods',
      tabs: [
        {
          id: 'bacteria-threat',
          label: 'BACTERIA',
          title: 'BACTERIA: HIGH THREAT LEVEL',
          bullets: [
            { label: 'STAPHYLOCOCCI', description: 'MRSA is antibiotic-resistant and can cause life-threatening infections. Survives on surfaces for days. Killed by proper disinfection — but NOT by sanitizing.' },
            { label: 'STREPTOCOCCI', description: 'Causes strep throat, skin infections, scarlet fever. Spread through direct contact and respiratory droplets. Highly contagious in close-contact environments.' },
            { label: 'BACILLI', description: 'Includes tetanus (lockjaw) and tuberculosis. Some form spores that survive standard disinfection. Requires sterilization or tuberculocidal disinfectants.' },
          ],
          facts: [
            { text: '⚠️ BOARD EXAM ALERT: Bacteria reproduce by BINARY FISSION (splitting in two). Under ideal conditions, they double every 20 minutes.' },
            { text: '⚠️ BACTERIAL SPORES are dormant, protected forms that resist heat, cold, and disinfectants. Only STERILIZATION kills spores.' },
          ],
        },
        {
          id: 'virus-threat',
          label: 'VIRUSES',
          title: 'VIRUSES: EXTREME THREAT LEVEL',
          bullets: [
            { label: 'HEPATITIS B', description: 'SURVIVES 7+ DAYS outside body. 100x more contagious than HIV. Vaccine available — GET IT. Transmitted through blood and bodily fluids. Can cause liver cancer and death.' },
            { label: 'HEPATITIS C', description: 'No vaccine. Often asymptomatic for years. Leading cause of liver transplants. Transmitted through blood contact. Can survive on surfaces for days.' },
            { label: 'HIV', description: 'Less contagious than Hepatitis B but still deadly. Requires blood-to-blood contact. No cure. Proper PPE and disinfection prevent transmission completely.' },
          ],
          facts: [
            { text: '⚠️ CRITICAL: You CANNOT tell by looking if someone has HIV, Hep B, or Hep C. Assume EVERY client is infectious.' },
            { text: '⚠️ Viruses are smaller than bacteria and harder to kill. Check EPA registration to confirm disinfectant efficacy against viruses.' },
          ],
        },
        {
          id: 'fungi-threat',
          label: 'FUNGI',
          title: 'FUNGI: PERSISTENT THREAT LEVEL',
          bullets: [
            { label: 'RINGWORM (TINEA)', description: 'Highly contagious fungal infection. Spores survive MONTHS on surfaces. Spreads through direct contact and contaminated tools. Requires fungicidal disinfectant.' },
            { label: 'TINEA BARBAE', description: 'Barber\'s itch — fungal infection of beard area. Spread through contaminated clippers and razors. Can cause permanent hair loss if untreated.' },
            { label: 'ATHLETE\'S FOOT', description: 'Can spread from feet to hands to tools. Thrives in warm, moist environments. Common in shops with poor ventilation and damp floors.' },
          ],
          facts: [
            { text: '⚠️ FUNGAL SPORES are among the hardest organisms to kill. Standard disinfectants may not work — verify fungicidal claims on the EPA label.' },
            { text: '⚠️ Always disinfect tools between clients, even when no visible infection is present. Fungal infections are often asymptomatic in early stages.' },
          ],
        },
        {
          id: 'parasite-threat',
          label: 'PARASITES',
          title: 'PARASITES: IMMEDIATE ACTION REQUIRED',
          bullets: [
            { label: 'HEAD LICE', description: 'STOP SERVICE IMMEDIATELY. Tiny insects that feed on blood. Eggs (nits) attach to hair shafts. Spread through direct contact and shared tools. Refer to physician.' },
            { label: 'SCABIES MITES', description: 'Microscopic mites that burrow into skin. Intense itching. Spread through prolonged skin contact. Stop service and refer to physician.' },
          ],
          facts: [
            { text: '🚨 NEVER treat parasitic infestations yourself. This is outside your scope of practice and requires medical treatment.' },
            { text: '🚨 After discovering lice or scabies: Disinfect ALL tools, wash all linens in hot water, vacuum the station, and notify the shop manager.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 7: THE 8-STEP DISINFECTION PROTOCOL
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'disinfection-protocol',
      title: '🔬 THE 8-STEP DISINFECTION PROTOCOL',
      subtitle: 'Miss one step, and the entire process fails',
      items: [
        { text: 'STEP 1: REMOVE — Brush off all visible hair and debris from the tool' },
        { text: 'STEP 2: WASH — Use soap and water to remove oils and organic matter' },
        { text: 'STEP 3: RINSE — Thoroughly rinse away all soap and loosened debris' },
        { text: 'STEP 4: DRY — Completely dry the tool (water dilutes disinfectant)' },
        { text: 'STEP 5: IMMERSE — Fully submerge in EPA-registered disinfectant' },
        { text: 'STEP 6: WAIT — Follow manufacturer contact time (typically 10 MINUTES)' },
        { text: 'STEP 7: REMOVE — Use gloves and tongs to remove tools' },
        { text: 'STEP 8: STORE — Place in clean, covered container labeled "DISINFECTED"' },
      ],
    },
    {
      type: 'contentBlock',
      id: 'protocol-warning',
      title: '⚠️ PROTOCOL FAILURE POINTS',
      content: 'The most common failure is rushing Step 6 (contact time). Most barbers remove tools after 2-3 minutes. At 5 minutes, you have killed roughly 50% of pathogens. At 10 minutes, you have killed 99.9%. That 5-minute difference is the difference between safety and an outbreak. Set a timer. Every time.',
      highlight: 'SET A TIMER. EVERY TIME.',
    },

    // ═══════════════════════════════════════════
    // SECTION 8: BLOOD SPILL EMERGENCY RESPONSE
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'blood-spill-response',
      title: '🚨 BLOOD SPILL EMERGENCY RESPONSE',
      subtitle: 'You have 60 seconds to respond correctly. What do you do?',
      scenarios: [
        {
          situation: 'EMERGENCY: During a straight razor shave, you accidentally cut the client\'s neck. Blood is dripping onto the cape, chair, and floor. The client is calm but bleeding. Three other clients are waiting. What is your FIRST action?',
          options: [
            { letter: 'A', text: 'Continue the shave carefully to finish the service', feedback: '❌ NEVER continue service after blood exposure. This violates OSHA, state board regulations, and basic safety.' },
            { letter: 'B', text: 'Stop immediately, apply pressure with clean gauze, put on fresh gloves, and clean the wound', feedback: '✅ CORRECT. Stop service → Apply first aid → Protect yourself with gloves → Clean and disinfect everything the blood touched → Document the incident.' },
            { letter: 'C', text: 'Call 911 immediately', feedback: '❌ Unless the bleeding is severe or the client is in distress, 911 is unnecessary for a minor cut. Handle the situation professionally first.' },
            { letter: 'D', text: 'Ask the client to hold pressure while you finish the next client', feedback: '❌ NEVER leave a bleeding client unattended. This is negligence and could result in license revocation.' },
          ],
          correctAnswer: 'B',
          timeLimit: 60,
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 9: PPE MASTERY CHECKLIST
    // ═══════════════════════════════════════════
    {
      type: 'checklist',
      id: 'ppe-mastery',
      title: '🛡️ PPE MASTERY CHECKLIST',
      subtitle: 'Before every client, every day, without exception',
      items: [
        { text: '✓ Fresh disposable gloves within arm\'s reach' },
        { text: '✓ Clean cape and fresh neck strip ready' },
        { text: '✓ All tools cleaned and disinfected from previous client' },
        { text: '✓ Disinfectant solution is CLEAR, FRESH, and at proper concentration' },
        { text: '✓ Sharps container accessible and NOT overfilled' },
        { text: '✓ Hand washing station stocked with liquid soap and paper towels' },
        { text: '✓ Trash bin empty and lined with fresh bag' },
        { text: '✓ First aid kit stocked and accessible' },
        { text: '✓ Eye protection available for high-risk services' },
        { text: '✓ Apron/gown available for blood exposure situations' },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 10: DISEASE RECOGNITION — REFUSE OR PROCEED
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'disease-recognition',
      title: '🔬 DISEASE RECOGNITION: REFUSE OR PROCEED?',
      subtitle: 'Your license depends on getting these right',
      scenarios: [
        {
          situation: 'CLIENT SCREENING: A new client sits down. During the pre-service inspection, you notice: (1) Circular, red, scaly patches on the scalp with raised borders, (2) Several pustules around the beard area, (3) Client mentions "my last barber said it was just dry skin." What do you do?',
          options: [
            { letter: 'A', text: 'Proceed with the service but use extra disinfectant afterward', feedback: '❌ NEVER proceed when contagious conditions are suspected. "Extra disinfectant" does not protect you or the client during the service.' },
            { letter: 'B', text: 'Politely explain you cannot proceed and refer to a physician. Document the refusal.', feedback: '✅ CORRECT. The circular scaly patches suggest ringworm (tinea capitis). The pustules suggest bacterial infection. Both are contagious. Refuse service, explain professionally, refer to doctor, document everything.' },
            { letter: 'C', text: 'Tell the client to come back when it clears up, but do not document', feedback: '❌ PARTIAL. Referring them away is correct, but documentation is CRITICAL. If they go to another barber and that barber gets infected, your documentation protects you.' },
            { letter: 'D', text: 'Ask the client to sign a waiver releasing you from liability', feedback: '❌ WAIVERS DO NOT PROTECT YOU. You cannot waive your professional obligation to prevent harm. Serving a client with a known contagious condition is negligence regardless of waivers.' },
          ],
          correctAnswer: 'B',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 11: CHEMICAL SAFETY — SDS MASTERY
    // ═══════════════════════════════════════════
    {
      type: 'tabbed',
      id: 'sds-mastery',
      title: '⚗️ CHEMICAL SAFETY — SDS MASTERY',
      subtitle: 'Every chemical in your shop can hurt you if mishandled',
      tabs: [
        {
          id: 'sds-16-sections',
          label: '16 SECTIONS',
          title: 'SDS 16 SECTIONS — MEMORIZE THESE',
          bullets: [
            { label: '1. Identification', description: 'Product name, manufacturer, recommended use' },
            { label: '2. Hazard Classification', description: 'GHS hazard classes and signal words (Danger/Warning)' },
            { label: '3. Composition', description: 'Chemical ingredients and concentrations' },
            { label: '4. First Aid', description: 'What to do if inhaled, swallowed, or contacts skin/eyes' },
            { label: '5. Firefighting', description: 'Extinguishing methods, hazards from fire' },
            { label: '6. Accidental Release', description: 'Cleanup procedures, PPE for spills' },
            { label: '7. Handling & Storage', description: 'Safe handling, incompatible materials, storage conditions' },
            { label: '8. Exposure Controls', description: 'Occupational exposure limits, required ventilation' },
            { label: '9. Physical Properties', description: 'Appearance, odor, pH, boiling point, flash point' },
            { label: '10. Stability & Reactivity', description: 'Conditions to avoid, incompatible materials' },
            { label: '11. Toxicology', description: 'Routes of exposure, symptoms, acute/chronic effects' },
            { label: '12. Ecology', description: 'Environmental impact, aquatic toxicity' },
            { label: '13. Disposal', description: 'Safe disposal methods, regulatory requirements' },
            { label: '14. Transport', description: 'UN number, proper shipping name, hazard class' },
            { label: '15. Regulations', description: 'OSHA, EPA, state, and international regulations' },
            { label: '16. Other Information', description: 'Revision date, preparation date, disclaimer' },
          ],
          facts: [
            { text: '📋 BOARD EXAM ALERT: The most common SDS question asks how many sections exist. Answer: 16.' },
            { text: '📋 OSHA requires SDSs to be readily accessible within 5 minutes of a request.' },
          ],
        },
        {
          id: 'ghs-pictograms',
          label: 'GHS SYMBOLS',
          title: 'GHS PICTOGRAMS — KNOW AT A GLANCE',
          bullets: [
            { label: '🔥 FLAME', description: 'Flammable materials — keep away from heat and sparks' },
            { label: '☠️ SKULL & CROSSBONES', description: 'Acute toxicity — can cause death or serious harm' },
            { label: '⚠️ EXCLAMATION MARK', description: 'Irritant, skin sensitizer, acute toxicity (less severe)' },
            { label: '🧪 CORROSION', description: 'Corrosive to skin, eyes, or metals — causes severe burns' },
            { label: '☢️ HEALTH HAZARD', description: 'Carcinogen, mutagen, reproductive toxicity, respiratory sensitizer' },
            { label: '💨 GAS CYLINDER', description: 'Compressed gas — may explode if heated' },
            { label: '🔥⭕ FLAME OVER CIRCLE', description: 'Oxidizer — intensifies fire, may cause spontaneous combustion' },
            { label: '🌊 ENVIRONMENT', description: 'Aquatic toxicity — harmful to water ecosystems' },
          ],
          facts: [
            { text: '📋 GHS pictograms are REQUIRED on all chemical containers and secondary containers (spray bottles).' },
            { text: '📋 Never remove or cover GHS labels. Faded labels must be replaced immediately.' },
          ],
        },
        {
          id: 'chemical-dangers',
          label: 'DEADLY MIXES',
          title: 'NEVER MIX THESE — DEADLY COMBINATIONS',
          bullets: [
            { label: 'BLEACH + AMMONIA', description: 'Produces CHLORAMINE GAS — causes chest pain, coughing, fluid in lungs, DEATH. Common in cleaning products.' },
            { label: 'BLEACH + ACIDS', description: 'Produces CHLORINE GAS — causes burning eyes, nose, throat, respiratory failure, DEATH. Vinegar and toilet bowl cleaners contain acids.' },
            { label: 'HYDROGEN PEROXIDE + VINEGAR', description: 'Produces PERACETIC ACID — corrosive to skin, eyes, and respiratory system.' },
            { label: 'RUBBING ALCOHOL + BLEACH', description: 'Produces CHLOROFORM and other toxic compounds — damages liver, kidneys, and nervous system.' },
          ],
          facts: [
            { text: '🚨 IF YOU ACCIDENTALLY MIX CHEMICALS: Evacuate immediately. Ventilate the area. Call Poison Control: 1-800-222-1222.' },
            { text: '🚨 When in doubt, do NOT mix. Use one product at a time. Rinse thoroughly between different products.' },
          ],
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 12: INFECTION TRANSMISSION SIMULATION
    // ═══════════════════════════════════════════
    {
      type: 'scenarioBlock',
      id: 'transmission-sim',
      title: '🦠 INFECTION TRANSMISSION SIMULATION',
      subtitle: 'Trace how one infected client can contaminate your entire shop',
      scenarios: [
        {
          situation: 'TRANSMISSION CHAIN: Client A has ringworm (undiagnosed). Your barber uses clippers on Client A, then uses the same clippers on Client B without proper disinfection. Client B\'s cape is draped over a chair. Client C sits in that chair. Client C\'s neck strip falls on the floor. You pick it up with bare hands. What is the contamination pathway?',
          options: [
            { letter: 'A', text: 'Only Client B is at risk', feedback: '❌ UNDERESTIMATING. The contamination chain extends much further.' },
            { letter: 'B', text: 'Clients A, B, and C are at risk', feedback: '❌ STILL UNDERESTIMATING. The barber and you are also at risk.' },
            { letter: 'C', text: 'Clients B and C, the barber, and you are all at risk. The cape, chair, floor, and your hands are contaminated.', feedback: '✅ CORRECT. Contamination pathway: Client A → Clippers → Client B (direct). Clippers → Cape → Chair → Client C (indirect). Neck strip → Floor → Your hands (indirect). The barber touched contaminated clippers. This is why ONE mistake affects EVERYONE.' },
            { letter: 'D', text: 'Only the barber is at risk', feedback: '❌ COMPLETELY WRONG. Everyone in the chain is at risk.' },
          ],
          correctAnswer: 'C',
        },
      ],
    },

    // ═══════════════════════════════════════════
    // SECTION 13: BOARD EXAM CRITICAL ALERTS
    // ═══════════════════════════════════════════
    {
      type: 'contentBlock',
      id: 'board-exam-critical',
      title: '📋 BOARD EXAM CRITICAL ALERTS',
      content: 'These concepts appear on EVERY state board exam. Miss them, and you fail.\n\n1. CLEANING must happen BEFORE disinfecting. Disinfectants cannot penetrate dirt and organic matter.\n\n2. CONTACT TIME is non-negotiable. Most disinfectants require 10 minutes of wet contact.\n\n3. BACTERIAL SPORES are killed only by STERILIZATION, not disinfection.\n\n4. OSHA requires: Exposure Control Plan, Hep B vaccine offer, PPE, sharps disposal, annual training.\n\n5. You CANNOT tell by looking who has HIV, Hep B, or Hep C. Treat EVERY client as infectious.\n\n6. EPA registers disinfectants. Only use EPA-registered products.\n\n7. SDS has 16 sections. GHS pictograms identify hazards at a glance.\n\n8. Refuse service for contagious conditions. Document the refusal.\n\n9. Never mix bleach with ammonia or acids — produces deadly gas.\n\n10. GFCI outlets required near water. Max water temperature: 130°F.',
      highlight: 'MEMORIZE THESE 10 POINTS',
    },

    // ═══════════════════════════════════════════
    // SECTION 14: FINAL SAFETY PLEDGE
    // ═══════════════════════════════════════════
    {
      type: 'quote',
      id: 'safety-pledge',
      quote: 'I pledge to protect every client who sits in my chair. I will clean before disinfecting. I will wait the full contact time. I will wear gloves. I will refuse service when contagious conditions are present. I will document exposure incidents. I will stay current on OSHA and state board requirements. I understand that my license, my reputation, and human lives depend on my diligence. This is not just a job — it is a sacred trust.',
    },
  ],
}
