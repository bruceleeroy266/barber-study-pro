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
  ["What does disinfection accomplish—and what does it not destroy?", "Disinfection destroys most disease-causing microorganisms on appropriate nonporous items and surfaces when used as labeled, but it does not destroy bacterial spores.", "Cleaning, Disinfection & Sterilization", 'medium'],
  ['What is sterilization?', 'Sterilization destroys all forms of microbial life, including bacterial spores, when a sterilization process is required and properly performed.', 'Cleaning, Disinfection & Sterilization', 'easy'],
  ['Why must an implement be cleaned before it is disinfected?', 'Hair, oils, and other debris can interfere with disinfectant contact, so visible contamination is removed first.', 'Cleaning, Disinfection & Sterilization', 'easy'],
  ['What determines disinfectant contact time?', 'Use the contact time on the product label. There is no single universal contact time for every disinfectant.', 'Cleaning, Disinfection & Sterilization', 'medium'],
  ['Why is an EPA registration number important on a disinfectant?', 'It identifies a pesticide product registered by EPA; the label states approved uses, organisms, directions, and required contact conditions.', 'Cleaning, Disinfection & Sterilization', 'medium'],
  ['How should disinfected implements be stored?', 'After proper processing, keep them protected from contamination and separated from used or soiled implements according to applicable rules.', 'Cleaning, Disinfection & Sterilization', 'easy'],
  ["How do common professional disinfectant categories differ?", "Hospital disinfectants, tuberculocidal products, quats, phenolics, and bleach-based products have different labeled claims and precautions. Select and use the product according to its EPA label.", "Cleaning, Disinfection & Sterilization", 'medium'],
  ['What is the key difference between an antiseptic and a disinfectant?', 'Antiseptics are formulated for use on living tissue as directed; disinfectants are intended for appropriate inanimate surfaces or implements as labeled.', 'Cleaning, Disinfection & Sterilization', 'medium'],
  ["What does an autoclave do, and how is its performance verified?", "An autoclave sterilizes compatible items using heat and pressure after cleaning. Its performance is checked with biological or spore testing according to applicable requirements and manufacturer instructions.", "Cleaning, Disinfection & Sterilization", 'medium'],

  ['What is contamination?', 'Contamination is the presence of potentially harmful material or microorganisms on an item, surface, person, or area.', 'Contamination & Cross-Contamination', 'easy'],
  ['What is cross-contamination?', 'Cross-contamination is the transfer of contaminants from one person, object, or surface to another.', 'Contamination & Cross-Contamination', 'easy'],
  ['What should happen if a clean comb falls on the floor during a service?', 'Treat it as contaminated. Replace it with a properly processed implement and reprocess the dropped comb before reuse.', 'Contamination & Cross-Contamination', 'medium'],
  ['Why separate clean and used implements?', 'Separation prevents used items from recontaminating implements that have already been properly processed.', 'Contamination & Cross-Contamination', 'easy'],
  ['How can hands cause cross-contamination?', 'Hands can transfer contaminants between clients, tools, products, phones, surfaces, and the barber, which is why hand hygiene and clean workflow matter.', 'Contamination & Cross-Contamination', 'medium'],
  ['Why should product containers be protected from contaminated contact?', 'Touching clean product or dispensing areas with contaminated hands or implements can transfer microorganisms into the product or onto its container.', 'Contamination & Cross-Contamination', 'medium'],
  ['What is the rule for a single-use item?', 'Use it for one client or one intended use, then discard it as required; do not clean it for reuse when it is designed to be disposable.', 'Contamination & Cross-Contamination', 'easy'],
  ["Why does ventilation matter in a barbershop?", "Adequate ventilation helps reduce inhalation and buildup of chemical vapors, dust, and other airborne contaminants created during services.", "Contamination & Cross-Contamination", 'medium'],

  ['What are Standard Precautions?', 'Standard Precautions are infection-prevention practices based on the principle that blood and certain body fluids may contain transmissible infectious agents.', 'Blood Exposure, PPE & Standard Precautions', 'easy'],
  ['When are gloves appropriate for blood-exposure protection?', 'Wear appropriate gloves when contact with blood or other potentially infectious material is reasonably anticipated and follow applicable exposure procedures.', 'Blood Exposure, PPE & Standard Precautions', 'easy'],
  ['Does wearing gloves replace hand hygiene?', 'No. Gloves are a barrier, not a substitute for hand hygiene, and contaminated or damaged gloves must be handled appropriately.', 'Blood Exposure, PPE & Standard Precautions', 'easy'],
  ['What is PPE?', 'Personal protective equipment is wearable equipment selected to reduce exposure to workplace hazards, such as appropriate gloves or eye protection.', 'Blood Exposure, PPE & Standard Precautions', 'easy'],
  ['What is the first priority when blood exposure occurs during a service?', 'Stop the service and control the situation using the applicable blood-exposure procedure and appropriate PPE.', 'Blood Exposure, PPE & Standard Precautions', 'medium'],
  ['Why must blood-contaminated tools and surfaces be handled carefully?', 'Blood may contain bloodborne pathogens, so contaminated items require the applicable cleaning, disinfection, disposal, and exposure-control procedures.', 'Blood Exposure, PPE & Standard Precautions', 'medium'],
  ['How should disposable sharps be handled?', 'Place used sharps in an appropriate sharps container and follow applicable workplace and disposal requirements; never leave loose blades exposed.', 'Blood Exposure, PPE & Standard Precautions', 'medium'],
  ["What is an exposure incident in infection control?", "An exposure incident involves contact of blood or certain body fluids with non-intact skin, mucous membranes, or another occupational exposure route and requires the applicable response procedure.", "Blood Exposure, PPE & Standard Precautions", 'medium'],
  ["When can a waterless hand sanitizer be used—and when is handwashing still required?", "A skin antiseptic or sanitizer may reduce microbes when appropriate, but it does not replace thorough handwashing when hands are visibly soiled and must never be used as a tool or surface disinfectant.", "Blood Exposure, PPE & Standard Precautions", 'medium'],

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
  ["Why do leather strops, holsters, and other porous items require special infection-control handling?", "Porous leather cannot be reliably disinfected like a nonporous implement, so reusable tools should be properly processed before and after contact and porous items handled according to applicable rules and manufacturer guidance.", "Safe Barbering Practice & Compliance", 'medium'],
  ['How should Oklahoma-specific rules relate to national infection-control knowledge?', 'National principles provide the foundation, while current Oklahoma rules determine state-specific compliance. State requirements should be identified as state-specific.', 'Safe Barbering Practice & Compliance', 'medium'],
  ['What is the safest response when a remembered school rule conflicts with a current product label or regulation?', 'Pause and verify the current authoritative requirement. Do not rely on an old memorized number or procedure when current directions control the task.', 'Safe Barbering Practice & Compliance', 'medium'],
  ["How do laws and rules differ in barbering infection control?", "Laws or statutes are enacted by legislatures and define legal requirements or scope; agency or board rules provide more specific requirements and can change more frequently.", "Regulatory & Chemical Safety", 'medium'],
  ["Which authority should a barber associate with workplace safety, disinfectant registration, and state licensing?", "OSHA addresses workplace safety, EPA registers disinfectant products and label claims, and state agencies or boards control licensing and state practice rules.", "Regulatory & Chemical Safety", 'medium'],
  ["How do cocci, bacilli, and spirilla differ?", "Cocci are round, bacilli are rod-shaped, and spirilla are spiral or corkscrew-shaped bacteria.", "Pathogens, Infection & Transmission", 'medium'],
  ["How do staphylococci and streptococci differ in arrangement?", "Staphylococci form grape-like clusters; streptococci form chains.", "Pathogens, Infection & Transmission", 'medium'],
  ["What happens during the active stage of bacterial growth?", "Bacteria grow and reproduce, commonly through binary fission when conditions are favorable.", "Pathogens, Infection & Transmission", 'medium'],
  ["What is the inactive or spore stage of certain bacteria?", "Some bacteria form resistant spores under unfavorable conditions; spores are harder to destroy and require sterilization for destruction.", "Pathogens, Infection & Transmission", 'medium'],
  ["What do inflammation and pus tell a barber?", "Redness, heat, pain, swelling, or pus can signal infection or inflammation. A barber should not diagnose; follow safe-service and referral rules.", "Pathogens, Infection & Transmission", 'medium'],
  ["Which infections are examples of bloodborne pathogens emphasized in Chapter 4?", "Hepatitis B, hepatitis C, and HIV are important bloodborne examples relevant to occupational exposure.", "Pathogens, Infection & Transmission", 'medium'],
  ["What is the basic difference between natural and acquired immunity?", "Natural immunity is inborn resistance; acquired immunity develops after exposure or through vaccination or other immune response.", "Pathogens, Infection & Transmission", 'medium'],
  ["Why can broken skin matter even when a client has no visible symptoms?", "Broken skin can create an exposure route, and some infectious people are asymptomatic, so precautions must be based on procedure rather than appearance.", "Pathogens, Infection & Transmission", 'medium'],
  ["How do hospital disinfectant and tuberculocidal claims differ?", "A hospital disinfectant has EPA-registered hospital-use claims; a tuberculocidal claim indicates effectiveness against Mycobacterium tuberculosis when used exactly as labeled.", "Cleaning, Disinfection & Sterilization", 'medium'],
  ["What is the safe way to think about quats, phenolics, and bleach-based disinfectants?", "They are different disinfectant chemistries. Use the product label for approved surfaces, dilution, contact time, PPE, ventilation, storage, and compatibility.", "Cleaning, Disinfection & Sterilization", 'medium'],
  ["Why is a waterless sanitizer not a substitute for handwashing or implement disinfection?", "It may reduce microbes on skin when appropriate, but visible soil still requires handwashing and skin antiseptics are not labeled as implement disinfectants.", "Cleaning, Disinfection & Sterilization", 'medium'],
  ["What water-safety practices matter at the shampoo bowl?", "Control the spray hose, test water temperature before client exposure, wipe spills promptly, and position the client to reduce scald and slip risks.", "Safe Barbering Practice & Compliance", 'medium'],
  ["What electrical practices reduce shock risk in a barbershop?", "Keep appliances away from water, use GFCI protection where required, avoid overloaded outlets, inspect cords, and remove damaged equipment from service.", "Safe Barbering Practice & Compliance", 'medium'],
  ["What should happen to damaged tools or appliances?", "Remove them from service until properly repaired or replaced; do not keep using equipment that creates a safety hazard.", "Safe Barbering Practice & Compliance", 'medium'],
  ["Why is ventilation part of safe work practice?", "Ventilation helps control exposure to chemical vapors, dust, aerosols, and other airborne contaminants created during services.", "Safe Barbering Practice & Compliance", 'medium'],
  ["How can attire and workstation setup prevent injuries?", "Professional nonrestrictive clothing, secure jewelry, supportive footwear, and controlled cords/walkways reduce snag, trip, and movement hazards.", "Safe Barbering Practice & Compliance", 'medium'],
  ["What extra safety responsibilities apply to children and adult clients?", "Supervise children around equipment; assist adult clients with chairs, neck support, draping, and movement as needed for a safe service.", "Safe Barbering Practice & Compliance", 'medium'],
  ["How should multiuse products and cape barriers be handled to reduce contamination?", "Dispense products with pumps, spatulas, or disposable tools, and use clean neck strips or towels so a cape neckband does not directly contact the client's skin.", "Safe Barbering Practice & Compliance", 'medium'],
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

if (chapter4ReconciledFlashcards.length !== 70) {
  throw new Error(`Chapter 4 canonical flashcard bank must contain exactly 70 cards; found ${chapter4ReconciledFlashcards.length}`)
}
