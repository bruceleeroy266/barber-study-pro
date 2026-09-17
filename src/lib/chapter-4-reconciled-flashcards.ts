import type { Flashcard } from '@/types'

// C4-1 canonical bank. Original ASCYN wording; avoids universal contact-time,
// inspection-order, and procedure claims that were present in the legacy bank.
type Difficulty = 'easy' | 'medium'
type CardSeed = readonly [front: string, back: string, category: string, difficulty: Difficulty]

const seeds: readonly CardSeed[] = [
  ['What four microorganism groups are important in infection control?', 'Bacteria, viruses, fungi, and parasites are major groups a barber must recognize when preventing infection and transmission.', 'Pathogens, Infection & Transmission', 'easy'],
  ['What does pathogenic mean?', 'Pathogenic describes an organism capable of causing disease.', 'Pathogens, Infection & Transmission', 'easy'],
  ['What does nonpathogenic mean?', 'Nonpathogenic organisms generally do not cause disease under ordinary conditions.', 'Pathogens, Infection & Transmission', 'easy'],
  ['What is an infection?', 'An infection occurs when disease-causing organisms enter the body, multiply, and produce a reaction.', 'Pathogens, Infection & Transmission', 'easy'],
  ['How do direct and indirect transmission differ?', 'Direct transmission occurs through person-to-person contact; indirect transmission occurs through a contaminated object, surface, or other intermediary.', 'Pathogens, Infection & Transmission', 'medium'],
  ['Why can an asymptomatic person still matter to infection control?', 'A person can carry or transmit some infectious agents without obvious symptoms, so infection-control practices cannot depend only on appearance.', 'Pathogens, Infection & Transmission', 'medium'],
  ['What are bloodborne pathogens?', 'They are disease-causing microorganisms present in human blood that can cause disease when exposure occurs.', 'Pathogens, Infection & Transmission', 'easy'],
  ['What is a biofilm?', 'A biofilm is a community of microorganisms attached to a surface within a protective matrix, making thorough cleaning especially important.', 'Pathogens, Infection & Transmission', 'medium'],
  ['Why should a barber recognize fungal and parasitic conditions?', 'Recognition supports safe service decisions and helps prevent transmission; barbers do not diagnose or medically treat disease.', 'Pathogens, Infection & Transmission', 'medium'],

  ['What is cleaning?', 'Cleaning removes visible soil, debris, and many microorganisms and is performed before disinfection.', 'Cleaning, Disinfection & Sterilization', 'easy'],
  ['What is disinfection?', 'Disinfection uses an appropriate product or process to destroy many disease-causing microorganisms on suitable nonporous items and surfaces.', 'Cleaning, Disinfection & Sterilization', 'easy'],
  ['What is sterilization?', 'Sterilization destroys all forms of microbial life, including bacterial spores, when a sterilization process is required and properly performed.', 'Cleaning, Disinfection & Sterilization', 'easy'],
  ['Why must an implement be cleaned before it is disinfected?', 'Hair, oils, and other debris can interfere with disinfectant contact, so visible contamination is removed first.', 'Cleaning, Disinfection & Sterilization', 'easy'],
  ['What determines disinfectant contact time?', 'Use the contact time on the product label. There is no single universal contact time for every disinfectant.', 'Cleaning, Disinfection & Sterilization', 'medium'],
  ['Why is an EPA registration number important on a disinfectant?', 'It identifies a pesticide product registered by EPA; the label states approved uses, organisms, directions, and required contact conditions.', 'Cleaning, Disinfection & Sterilization', 'medium'],
  ['How should disinfected implements be stored?', 'After proper processing, keep them protected from contamination and separated from used or soiled implements according to applicable rules.', 'Cleaning, Disinfection & Sterilization', 'easy'],
  ['What should you do when disinfectant becomes contaminated or must be replaced?', 'Follow the product label and applicable rules for preparation, replacement, concentration, and disposal rather than guessing or topping off a solution.', 'Cleaning, Disinfection & Sterilization', 'medium'],
  ['What is the key difference between an antiseptic and a disinfectant?', 'Antiseptics are formulated for use on living tissue as directed; disinfectants are intended for appropriate inanimate surfaces or implements as labeled.', 'Cleaning, Disinfection & Sterilization', 'medium'],
  ['When is sterilization different from routine barber-tool disinfection?', 'Sterilization is a higher level of microbial destruction. Use the process required for the item, service, manufacturer directions, and applicable regulation.', 'Cleaning, Disinfection & Sterilization', 'medium'],

  ['What is contamination?', 'Contamination is the presence of potentially harmful material or microorganisms on an item, surface, person, or area.', 'Contamination & Cross-Contamination', 'easy'],
  ['What is cross-contamination?', 'Cross-contamination is the transfer of contaminants from one person, object, or surface to another.', 'Contamination & Cross-Contamination', 'easy'],
  ['What should happen if a clean comb falls on the floor during a service?', 'Treat it as contaminated. Replace it with a properly processed implement and reprocess the dropped comb before reuse.', 'Contamination & Cross-Contamination', 'medium'],
  ['Why separate clean and used implements?', 'Separation prevents used items from recontaminating implements that have already been properly processed.', 'Contamination & Cross-Contamination', 'easy'],
  ['How can hands cause cross-contamination?', 'Hands can transfer contaminants between clients, tools, products, phones, surfaces, and the barber, which is why hand hygiene and clean workflow matter.', 'Contamination & Cross-Contamination', 'medium'],
  ['Why should product containers be protected from contaminated contact?', 'Touching clean product or dispensing areas with contaminated hands or implements can transfer microorganisms into the product or onto its container.', 'Contamination & Cross-Contamination', 'medium'],
  ['What is the rule for a single-use item?', 'Use it for one client or one intended use, then discard it as required; do not clean it for reuse when it is designed to be disposable.', 'Contamination & Cross-Contamination', 'easy'],
  ['Why must work surfaces be addressed between clients?', 'Frequently touched or contaminated surfaces can become links in indirect transmission and should be cleaned and disinfected as appropriate.', 'Contamination & Cross-Contamination', 'medium'],

  ['What are Standard Precautions?', 'Standard Precautions are infection-prevention practices based on the principle that blood and certain body fluids may contain transmissible infectious agents.', 'Blood Exposure, PPE & Standard Precautions', 'easy'],
  ['When are gloves appropriate for blood-exposure protection?', 'Wear appropriate gloves when contact with blood or other potentially infectious material is reasonably anticipated and follow applicable exposure procedures.', 'Blood Exposure, PPE & Standard Precautions', 'easy'],
  ['Does wearing gloves replace hand hygiene?', 'No. Gloves are a barrier, not a substitute for hand hygiene, and contaminated or damaged gloves must be handled appropriately.', 'Blood Exposure, PPE & Standard Precautions', 'easy'],
  ['What is PPE?', 'Personal protective equipment is wearable equipment selected to reduce exposure to workplace hazards, such as appropriate gloves or eye protection.', 'Blood Exposure, PPE & Standard Precautions', 'easy'],
  ['What is the first priority when blood exposure occurs during a service?', 'Stop the service and control the situation using the applicable blood-exposure procedure and appropriate PPE.', 'Blood Exposure, PPE & Standard Precautions', 'medium'],
  ['Why must blood-contaminated tools and surfaces be handled carefully?', 'Blood may contain bloodborne pathogens, so contaminated items require the applicable cleaning, disinfection, disposal, and exposure-control procedures.', 'Blood Exposure, PPE & Standard Precautions', 'medium'],
  ['How should disposable sharps be handled?', 'Place used sharps in an appropriate sharps container and follow applicable workplace and disposal requirements; never leave loose blades exposed.', 'Blood Exposure, PPE & Standard Precautions', 'medium'],
  ['Why is an exposure-control plan important?', 'Where OSHA bloodborne-pathogen requirements apply, the plan documents how occupational exposure is identified and controlled and how incidents are managed.', 'Blood Exposure, PPE & Standard Precautions', 'medium'],
  ['Why should blood-exposure training avoid memorizing an outdated exam script?', 'Procedures and exam instructions can change; training should follow current regulatory, workplace, manufacturer, and examination guidance.', 'Blood Exposure, PPE & Standard Precautions', 'medium'],

  ['What is OSHA’s primary role?', 'OSHA administers and enforces federal workplace safety and health requirements within its jurisdiction.', 'Regulatory & Chemical Safety', 'easy'],
  ['What is EPA’s infection-control role relevant to disinfectants?', 'EPA regulates antimicrobial pesticide products such as surface disinfectants and their approved label claims and directions.', 'Regulatory & Chemical Safety', 'easy'],
  ['What is an SDS?', 'A Safety Data Sheet communicates standardized information about a hazardous chemical, including hazards, handling, protection, and emergency measures.', 'Regulatory & Chemical Safety', 'easy'],
  ['How many sections are in the standardized SDS format?', 'The standardized Safety Data Sheet format contains 16 sections.', 'Regulatory & Chemical Safety', 'easy'],
  ['What do GHS hazard pictograms communicate?', 'They provide standardized visual warnings about categories of chemical hazards; always use the full label and SDS for handling decisions.', 'Regulatory & Chemical Safety', 'medium'],
  ['Why should a barber follow a chemical product label?', 'The label provides the manufacturer and regulatory directions for safe, effective use, including dilution, application, contact conditions, storage, and precautions as applicable.', 'Regulatory & Chemical Safety', 'medium'],
  ['Why should chemicals remain properly labeled?', 'Labels communicate identity, hazards, and safe-use information and help prevent dangerous mix-ups or misuse.', 'Regulatory & Chemical Safety', 'medium'],

  ['What should an Oklahoma barber do when an implement cannot be properly disinfected and is intended for single use?', 'Discard it after use in accordance with applicable Oklahoma sanitation requirements rather than attempting to reuse it.', 'Safe Barbering Practice & Compliance', 'easy'],
  ['Why is handwashing a professional infection-control responsibility?', 'Proper hand hygiene reduces transfer of contaminants and is required around services where applicable by current sanitation rules.', 'Safe Barbering Practice & Compliance', 'easy'],
  ['What should a barber do when a client appears to have a communicable or infectious condition that makes service unsafe?', 'Do not diagnose. Follow applicable rules for discontinuing or declining the service and appropriately refer the client when required.', 'Safe Barbering Practice & Compliance', 'medium'],
  ['Why must reusable implements be processed between clients?', 'Proper processing interrupts indirect transmission and prepares the implement for safe reuse under applicable sanitation requirements.', 'Safe Barbering Practice & Compliance', 'easy'],
  ['A barber wipes a dropped clipper guard on a towel and wants to continue. What is wrong?', 'Wiping does not restore a contaminated reusable implement to a properly processed state; use a clean replacement and reprocess the dropped item.', 'Safe Barbering Practice & Compliance', 'medium'],
  ['How should Oklahoma-specific rules relate to national infection-control knowledge?', 'National principles provide the foundation, while current Oklahoma rules determine state-specific compliance. State requirements should be identified as state-specific.', 'Safe Barbering Practice & Compliance', 'medium'],
  ['What is the safest response when a remembered school rule conflicts with a current product label or regulation?', 'Pause and verify the current authoritative requirement. Do not rely on an old memorized number or procedure when current directions control the task.', 'Safe Barbering Practice & Compliance', 'medium'],
] as const

export const chapter4ReconciledFlashcards: Flashcard[] = seeds.map(([front, back, category, difficulty], index) => ({
  id: `fc-4-${String(index + 1).padStart(3, '0')}`,
  chapter_id: 'ch-4',
  front,
  back,
  category,
  difficulty,
  order_index: index + 1,
  is_active: true,
}))

if (chapter4ReconciledFlashcards.length !== 50) {
  throw new Error(`Chapter 4 canonical flashcard bank must contain exactly 50 cards; found ${chapter4ReconciledFlashcards.length}`)
}
