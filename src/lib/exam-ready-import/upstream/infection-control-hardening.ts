import type { ExamQuestion } from './infection-control';

type InfectionControlOverride = Partial<Pick<ExamQuestion,'prompt'|'options'|'type'|'difficulty'|'correctOptionId'>>;
const o=(a:string,b:string,c:string,d:string)=>[
  {id:'a',text:a},{id:'b',text:b},{id:'c',text:c},{id:'d',text:d},
];

const overrides: Record<string, InfectionControlOverride> = {
  'IC-006': {options:o(
    'Assume blood may be infectious and immediately follow the required blood-exposure procedure',
    'Assume blood may be infectious but continue the service after covering the exposure if the bleeding has stopped',
    'Assume blood may be infectious only when the client reports a bloodborne condition or the exposure is substantial',
    'Assume blood may be infectious, clean the visible blood first, and complete the formal exposure procedure after the service',
  )},
  'IC-007': {correctOptionId:'a',options:o(
    'A disease that can spread from one person to another',
    'A condition caused exclusively by inherited traits',
    'A disorder that cannot involve infectious agents',
    'A condition prevented solely by removing visible debris',
  )},
  'IC-008': {options:o(
    'Remove visible debris, clean the blade, then disinfect it as required with an appropriate EPA-registered product',
    'Brush away debris, apply disinfectant for the label contact time, and clean only if residue remains afterward',
    'Clean the blade thoroughly and return it to use if no visible contamination remains',
    'Disinfect the blade first, then remove remaining debris before storing it with clean tools',
  )},
  'IC-010': {correctOptionId:'a',options:o(
    'Store it so it remains clean and protected from contamination',
    'Store it in an open clean area so moisture can evaporate while keeping it separated from used tools',
    'Place it with other disinfected implements even if the container also holds unused single-use items',
    'Keep it on the disinfected side of the workstation until the next client as long as no visible soil is present',
  )},
  'IC-012': {options:o(
    'Indirect transmission through a contaminated object or surface',
    'Direct transmission because the barber physically touched the client after touching the surface',
    'Airborne transmission because microorganisms moved from the surface through the barber’s hand',
    'Droplet transmission because the contaminated hand served as the immediate transfer route',
  )},
  'IC-013': {options:o(
    'Cleaning removes soil and debris; disinfection uses an appropriate process to destroy many disease-causing microorganisms on suitable surfaces',
    'Cleaning lowers microbial load on surfaces, while disinfection is mainly the physical removal of visible residue',
    'Cleaning and disinfection are interchangeable when an EPA-registered product is used on a nonporous implement',
    'Cleaning is the antimicrobial step, while disinfection prepares the surface by removing soil before treatment',
  )},
  'IC-014': {options:o(
    'Debris can prevent disinfectant from adequately contacting the surface',
    'Debris can dilute disinfectant enough that a longer contact time always compensates for incomplete cleaning',
    'Debris changes the required disinfectant concentration, so the barber should make the solution stronger',
    'Debris mainly affects drying time rather than disinfectant contact with the implement surface',
  )},
  'IC-018': {options:o(
    'Create a barrier that helps reduce exposure to potentially infectious material',
    'Reduce the amount of cleaning needed after exposure-risk procedures',
    'Protect the client while allowing the barber to handle contaminated and clean items with the same gloves',
    'Replace hand hygiene during tasks in which gloves or other barriers remain intact',
  )},
  'IC-019': {options:o(
    'Replace the compromised glove and follow applicable hand-hygiene precautions',
    'Place a second glove over the torn glove so the barrier is restored without interrupting the task',
    'Finish the immediate task if no blood is visible, then replace the glove before touching clean items',
    'Remove the glove, sanitize the outside surface, and put it back on if the tear is small',
  )},
  'IC-023': {options:o(
    'Treat it as contaminated and properly clean and disinfect it before reuse',
    'Disinfect only the part that touched the workstation because the rest of the comb remained clean',
    'Wipe away visible soil and reuse it if it had already been disinfected before falling',
    'Place it in disinfectant for a shortened contact time because it was clean immediately before contamination',
  )},
  'IC-041': {options:o(
    'Cross-contamination of the clean comb',
    'Contamination of the glove only, because the clean comb is not at risk until used on a client',
    'Contamination of the trash lid only, because gloves prevent transfer to clean implements',
    'Cross-contamination only if the glove is visibly soiled before touching the comb',
  )},
  'IC-042': {options:o(
    'Properly clean it and then repeat the required disinfection process',
    'Repeat disinfection for a longer contact time because the first application already exposed the surface to disinfectant',
    'Remove the visible residue and store the implement because the antimicrobial step has already been completed',
    'Clean the implement and use it without repeating disinfection if the original disinfectant remained wet throughout',
  )},
  'IC-043': {options:o(
    'Follow the concentration and use directions on that product label',
    'Use the shop’s standard dilution if the active ingredient is the same as the previous disinfectant',
    'Use a stronger concentration than the label when tools have visible contamination',
    'Use the dilution that produced the shortest contact time on a previously used brand',
  )},
  'IC-044': {options:o(
    'It is intended to be discarded rather than processed for reuse',
    'Its surface usually cannot be reliably disinfected enough for repeated client use',
    'It can be stored separately for later use on the same client if it appears intact',
    'It can be reused after cleaning when it did not contact blood or visibly contaminated material',
  )},
  'IC-045': {options:o(
    'Perform appropriate hand hygiene before the next service',
    'Change into fresh gloves before touching clean supplies, with hand hygiene needed only if the prior gloves tore',
    'Wipe hands with a clean towel before setting up because visible debris is the main contamination concern',
    'Handle clean supplies first, then perform hand hygiene immediately before touching the next client',
  )},
  'IC-046': {options:o(
    'Discard it and use new PPE when required',
    'Remove it carefully and save it for the same type of exposure-risk task later in the day',
    'Disinfect the exterior while worn and continue using it if no tear or puncture is visible',
    'Reuse it only for setup tasks that do not involve direct client contact',
  )},
  'IC-047': {options:o(
    'EPA — registers disinfectant products for labeled uses',
    'OSHA — registers disinfectants used to protect workers from infectious exposure',
    'CDC — enforces workplace exposure standards and required protective equipment',
    'EPA — publishes public-health treatment guidance for communicable diseases',
  )},
  'IC-048': {options:o(
    'To help prevent clean implements from becoming recontaminated',
    'To keep used implements from damaging clean ones while both await the next service',
    'To separate tools by service category so each group can follow its own processing schedule',
    'To prevent disinfectant residue on clean tools from contacting unprocessed implements',
  )},
  'IC-049': {options:o(
    'As a contaminated object capable of indirect transfer',
    'As a direct-contact source because the implement touched the client itself',
    'As a droplet vehicle because microorganisms moved from the tool to the client surface',
    'As an airborne source because contamination traveled from an object to a person',
  )},
  'IC-050': {options:o(
    'Treat the implement as contaminated and process it appropriately again before use',
    'Treat the implement as clean if no visible debris transferred from the used-tool container',
    'Treat only the contacted surface as contaminated and disinfect that area before use',
    'Treat the implement as previously disinfected and return it to clean storage after wiping it',
  )},
  'IC-051': {options:o(
    'The product Safety Data Sheet (SDS)',
    'The manufacturer’s marketing sheet because it summarizes intended use and common precautions',
    'The product label only, because first-aid and exposure response are always fully listed there',
    'The establishment procedure manual because shop policy replaces product-specific hazard documents',
  )},
  'IC-052': {options:o(
    'Pathogenic microorganisms can cause disease',
    'Pathogenic microorganisms are those most likely to survive routine cleaning, while nonpathogenic organisms cannot',
    'Pathogenic microorganisms are always contagious, while nonpathogenic organisms can never be transmitted',
    'Pathogenic microorganisms require a host to reproduce, while nonpathogenic organisms reproduce independently',
  )},
  'IC-057': {options:o(
    'They can be transmitted through exposure to infected blood or certain body fluids',
    'They can be transmitted mainly through contaminated skin-contact surfaces during ordinary barbering services',
    'They require concern primarily when visible symptoms are present during a client service',
    'They are important because standard surface disinfection alone eliminates the need for blood-exposure precautions',
  )},
  'IC-058': {options:o(
    'Treat blood and applicable body fluids as potentially infectious regardless of stated history',
    'Treat blood as potentially infectious only when the client reports a diagnosis or visible symptoms',
    'Treat blood as potentially infectious mainly when a sharp implement caused the exposure',
    'Treat blood as potentially infectious only when the amount of exposure exceeds routine service contact',
  )},
  'IC-064': {options:o(
    'The contact time on the label of the disinfectant currently being used',
    'The longer of the new product’s contact time and the shop’s previous standard contact time',
    'The contact time that was validated for the previous product if both are EPA-registered',
    'A standard shop contact time as long as it is not shorter than five minutes',
  )},
  'IC-070': {options:o(
    'The product Safety Data Sheet (SDS)',
    'The product label only, because it always contains the complete exposure-response procedure',
    'The establishment’s chemical inventory list because it identifies which products require first aid',
    'The appointment record because it shows which client service caused the exposure',
  )},
};

const finalOverrides: Record<string, InfectionControlOverride> = {
  'IC-006': {options:o(
    'Assume blood may be infectious and immediately follow the required blood-exposure procedure',
    'Pause the service and use gloves, then decide whether the full exposure procedure is needed from the amount of blood present',
    'Clean the visible blood first and continue if the client reports no known bloodborne infection',
    'Cover the exposure area and finish the current step before beginning the formal blood-exposure procedure',
  )},
  'IC-028': {options:o(
    'Complete the required disinfection process before using the implement',
    'Complete cleaning and use the implement for a noninvasive service before performing full disinfection',
    'Complete a shortened disinfectant contact time before use, then finish the full label time after the service',
    'Complete a visual inspection after cleaning and use the implement if no contamination remains',
  )},
  'IC-029': {options:o(
    'Treat it as contaminated and complete the required cleaning and disinfection process before use',
    'Disinfect it before use without recleaning because the uncertainty concerns only whether disinfection occurred',
    'Inspect for visible soil and use it if it appears clean and dry',
    'Use it for one service with gloves, then fully reprocess it before returning it to storage',
  )},
  'IC-033': {options:o(
    'Dispose of the gloves immediately after use and do not reuse them',
    'Dispose of the gloves after the client leaves, provided they remain intact and visibly clean',
    'Dispose of the gloves only after disinfecting the exterior if they contacted potentially infectious material',
    'Dispose of the gloves after reuse for cleanup tasks that do not involve direct client contact',
  )},
  'IC-035': {options:o(
    'The labeled contact-time requirement was not completed',
    'The labeled contact-time requirement is considered complete when most of the stated wet time has elapsed',
    'The labeled contact-time requirement can be offset by increasing disinfectant concentration on the next cycle',
    'The labeled contact-time requirement is unnecessary when the implement appears clean and the product is EPA-registered',
  )},
  'IC-038': {options:o(
    'It still requires the appropriate cleaning and disinfection process before reuse',
    'It can be stored after cleaning if the visible residue is removed and no blood is present',
    'It requires disinfection only if the visible residue came from direct skin contact',
    'It can enter clean storage after wiping if the implement is nonporous and was disinfected earlier that day',
  )},
  'IC-039': {options:o(
    'Microorganisms may be transferred indirectly to the clean neck strip',
    'The neck strip is contaminated only if it later touches the client, not when touched by the barber',
    'The transfer is considered direct because the barber’s hand moved contamination from one item to another',
    'The risk is limited to the barber’s hands because a clean neck strip cannot serve as a transmission vehicle',
  )},
  'IC-040': {options:o(
    'Treat it as potentially recontaminated and process it appropriately before use',
    'Move it to clean storage and use it if there was no visible contact with the used tools',
    'Disinfect only the surface that faced the contaminated tools because the implement had already been processed',
    'Use it once if it still appears clean, then repeat the full cleaning and disinfection cycle afterward',
  )},
  'IC-050': {options:o(
    'Treat it as contaminated and process it appropriately again before use',
    'Remove it from the used container and disinfect it once more without repeating cleaning',
    'Use it if no visible debris transferred because its previous disinfection is still valid',
    'Wipe it with a clean disposable towel and return it to clean storage before use',
  )},
  'IC-058': {options:o(
    'Treat blood and applicable body fluids as potentially infectious regardless of stated history',
    'Use full precautions only when blood is visible because a negative history reduces risk before exposure',
    'Use gloves when an exposure occurs but rely on the client’s history for other bloodborne-pathogen precautions',
    'Use reduced precautions for clients without a diagnosis unless the service involves a sharp implement',
  )},
  'IC-064': {options:o(
    'Use the contact time on the label of the disinfectant currently being used',
    'Use whichever contact time is longer between the new label and the shop’s prior disinfectant procedure',
    'Use the previous product’s time if both products are EPA-registered for the same type of surface',
    'Use a five-minute shop minimum unless the new product label specifies a shorter time',
  )},
};

const auditCleanup: Record<string, InfectionControlOverride> = {
  'IC-006': {options:o(
    'For the exposure, follow the required blood-exposure procedure immediately and without relying on stated history',
    'For the exposure, follow the required blood-exposure procedure only after the client confirms a bloodborne condition',
    'For the exposure, follow the required blood-exposure procedure only if bleeding continues after initial control',
    'For the exposure, follow the required blood-exposure procedure after finishing the current service step',
  )},
  'IC-028': {options:o(
    'Before use, complete the required disinfection process for the implement',
    'Before use, complete cleaning and reserve full disinfection until after a noninvasive service',
    'Before use, complete only part of the disinfectant contact time and finish the rest afterward',
    'Before use, complete a visual cleanliness check and use the implement if no soil remains',
  )},
  'IC-033': {options:o(
    'Discard the gloves immediately after use and do not reuse them',
    'Save intact gloves for another exposure-risk task on the same day',
    'Disinfect the glove exterior and reuse them on the same client',
    'Reuse the gloves only for cleanup tasks without direct client contact',
  )},
  'IC-035': {options:o(
    'The process is incomplete because the labeled disinfectant contact time was not completed',
    'The process is complete because most of the labeled disinfectant contact time was completed',
    'The process is complete if a stronger disinfectant concentration is used on the next cycle',
    'The process is complete if the implement appears clean and the disinfectant is EPA-registered',
  )},
  'IC-050': {options:o(
    'After recontamination, process the implement appropriately again before use',
    'After recontamination, use the implement if no visible debris transferred from the used-tool container',
    'After recontamination, disinfect only the surface that contacted the used-tool container',
    'After recontamination, wipe the implement and return it to clean storage because it was processed earlier',
  )},
  'IC-058': {options:o(
    'For standard precautions, treat applicable blood or body-fluid exposure as potentially infectious regardless of history',
    'For standard precautions, treat exposure as potentially infectious only when the client reports a known condition',
    'For standard precautions, treat exposure as potentially infectious mainly when a sharp implement caused it',
    'For standard precautions, treat exposure as potentially infectious only when the amount is substantial',
  )},
  'IC-014': {options:o(
    'Debris can shield part of the surface and keep disinfectant from making adequate contact',
    'Debris mainly changes the required dilution, so stronger disinfectant can replace the cleaning step',
    'Debris mainly shortens contact time because organic material speeds antimicrobial action',
    'Debris affects appearance but does not matter once the correct disinfectant concentration is used',
  )},
  'IC-037': {options:o(
    'Wash with running water and soap, then dry with a disposable towel',
    'Use hand sanitizer only when hands look clean, then dry on a clean reusable towel',
    'Wash with running water but omit soap when gloves will be worn for the service',
    'Wash with soap and water after the service rather than before it when no visible contamination is present',
  )},
  'IC-039': {options:o(
    'Indirect transfer of microorganisms from the contaminated implement to the clean neck strip through the barber’s hands',
    'Direct transmission from the clean neck strip to the contaminated implement because the strip touched the barber’s hands',
    'Airborne transmission caused by handling the contaminated implement near the clean neck strip',
    'Chemical contamination caused by disinfectant residue moving from the implement to the neck strip',
  )},
};

const phase2CCalibration: Record<string, InfectionControlOverride> = {
  'IC-013': {options:o(
    'Cleaning removes visible soil and debris; disinfection uses an appropriate antimicrobial process on a cleaned nonporous surface',
    'Cleaning destroys most disease-causing microorganisms; disinfection removes visible soil before chemical treatment',
    'Cleaning and disinfection are interchangeable as long as the implement remains wet for the full contact time',
    'Cleaning is used for porous items, while disinfection is used only for visibly soiled nonporous items',
  )},
  'IC-014': {options:o(
    'Debris can shield part of the surface and keep disinfectant from making adequate contact',
    'Debris mainly changes the required dilution, so stronger disinfectant can replace the cleaning step',
    'Debris mainly shortens contact time because organic material speeds antimicrobial action',
    'Debris affects appearance but does not matter once the correct disinfectant concentration is used',
  )},
  'IC-037': {options:o(
    'Wash with running water and soap, then dry with a disposable towel',
    'Use hand sanitizer only when hands look clean, then dry on a clean reusable towel',
    'Wash with running water but omit soap when gloves will be worn for the service',
    'Wash with soap and water after the service rather than before it when no visible contamination is present',
  )},
  'IC-039': {options:o(
    'Indirect transfer of microorganisms from the contaminated implement to the clean neck strip through the barber’s hands',
    'Direct transmission from the clean neck strip to the contaminated implement because the strip touched the barber’s hands',
    'Airborne transmission caused by handling the contaminated implement near the clean neck strip',
    'Chemical contamination caused by disinfectant residue moving from the implement to the neck strip',
  )},
};

export function applyInfectionControlHardening(question: ExamQuestion): ExamQuestion {
  return {
    ...question,
    ...(overrides[question.id] ?? {}),
    ...(finalOverrides[question.id] ?? {}),
    ...(auditCleanup[question.id] ?? {}),
    ...(phase2CCalibration[question.id] ?? {}),
  };
}
