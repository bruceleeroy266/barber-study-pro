import type { HairCareQuestion } from './hair-care-services';

type HairCareOverride = Partial<Pick<HairCareQuestion,'prompt'|'options'|'type'|'difficulty'>>;
const o=(a:string,b:string,c:string,d:string)=>[
  {id:'a',text:a},{id:'b',text:b},{id:'c',text:c},{id:'d',text:d},
];

const overrides: Record<string, HairCareOverride> = {
  'CS-001': {options:o(
    'Hair/scalp condition, prior chemical history, and the desired result',
    'Hair texture, desired result, and the client’s usual styling routine, with chemical history checked only if damage is visible',
    'Current hair condition and preferred tone, with prior chemical history considered mainly after formulation',
    'Desired result, maintenance commitment, and application method, assuming the current scalp appears normal',
  )},
  'CS-002': {options:o(
    'Evaluate how the hair may respond and help guide processing decisions',
    'Confirm that the selected formula reaches the desired tone without changing the planned processing time',
    'Measure hair density and texture before selecting section size for the chemical application',
    'Check whether the client prefers the planned result before applying the service to the full head',
  )},
  'CS-003': {options:o(
    'Reassess or stop the planned chemical service rather than forcing further processing',
    'Reduce the remaining processing time but continue because the planned goal has not yet been reached',
    'Apply a weaker formula to the same strand and continue if the hair still stretches without breaking',
    'Pause processing, add conditioning product, and resume once the strand feels stronger',
  )},
  'CS-004': {options:o(
    'Possible sensitivity or reaction to a product when the product directions require such testing',
    'Whether the hair can tolerate the planned developer strength during a strand-processing test',
    'Whether the client’s scalp has enough natural oil to protect it during chemical application',
    'Whether the finished color is likely to match the selected target level and tone',
  )},
  'CS-005': {options:o(
    'Do not proceed with that chemical service and follow product directions or referral guidance',
    'Postpone the service and repeat the test later with a smaller amount of the same product before deciding',
    'Select a milder formulation in the same product family and proceed only if the visible reaction subsides',
    'Apply the product only to areas away from the test site while monitoring the client closely',
  )},
  'CS-008': {options:o(
    'Warm underlying tones may be exposed as natural pigment is lightened',
    'Underlying pigment determines how quickly the developer oxidizes regardless of the target level',
    'Underlying pigment controls porosity and therefore determines whether lightener can enter the cortex',
    'Underlying pigment changes density as hair is lightened, which affects the final visual tone',
  )},
  'CS-009': {options:o(
    'Provide oxidizing action that supports color development or lightening',
    'Control the pH of every chemical service so the hair returns to neutral after processing',
    'Deposit artificial pigment while preventing any natural pigment from being lightened',
    'Condition the cortex so color molecules can enter without changing the hair chemically',
  )},
  'CS-010': {options:o(
    'Developer strength must match product directions, hair condition, and the intended result',
    'A stronger developer may shorten processing, but it should be chosen mainly from the client’s natural level',
    'Developer strength should be increased only when the hair is resistant, regardless of prior chemical history',
    'The strongest developer is appropriate when the target requires lift, provided the processing time is shortened',
  )},
  'CS-011': {options:o(
    'Reduce or disperse natural or artificial pigment to create a lighter result',
    'Deposit tone while keeping the existing level unchanged and making the hair appear lighter',
    'Neutralize unwanted warmth without changing the amount of pigment present in the hair',
    'Open the cuticle so conditioning products can create the appearance of a lighter result',
  )},
  'CS-012': {options:o(
    'The hair may have limited tolerance and the service must be reassessed carefully',
    'The hair may process quickly, so a shorter but otherwise standard lightening service is usually sufficient',
    'High porosity indicates the hair will accept lightener evenly if the formula strength is reduced',
    'Fragile hair can still be lightened safely if heat is avoided and the target level is modest',
  )},
  'CS-013': {options:o(
    'Clarify the chemical history and perform appropriate analysis or testing before selecting a formula',
    'Select a conservative formula first, then investigate the home-color history if the test section reacts unexpectedly',
    'Choose the target formula from the desired result and use a lower developer until the prior product is identified',
    'Begin with a strand test using the planned formula because a successful result makes detailed history less important',
  )},
  'CS-014': {options:o(
    'Support precise product placement and consistent processing',
    'Increase the amount of product each strand receives while reducing the need to monitor placement',
    'Create identical heat inside every foil so all sections process at the same speed',
    'Keep lightener from drying while allowing neighboring strands to be processed together',
  )},
  'CS-015': {options:o(
    'Stop the service and respond according to the product’s safety directions',
    'Pause application, lower the product strength, and continue if the burning decreases quickly',
    'Rinse only the area that feels hottest and continue processing the remaining sections to the scheduled time',
    'Add a soothing product over the chemical and continue if the client says the sensation becomes tolerable',
  )},
  'CS-017': {options:o(
    'Acidity and alkalinity can affect hair structure and how chemical products act',
    'pH mainly determines processing speed, while hair structure is controlled by developer strength',
    'pH primarily predicts porosity and therefore how much product the strand can absorb',
    'pH mainly identifies whether a formula deposits or lifts, regardless of the condition of the hair',
  )},
  'CS-018': {options:o(
    'Investigate the history and follow compatibility testing and manufacturer guidance before proceeding',
    'Use a lower-strength version of the planned product first because reduced strength usually prevents incompatibility',
    'Perform the service on a small area and continue on the full head if no immediate reaction appears',
    'Choose the product from the current hair condition because prior chemistry matters only when visible residue remains',
  )},
  'CS-020': {options:o(
    'Soften or reduce appropriate bonds so the hair can assume the rod shape',
    'Oxidize altered bonds so the hair is stabilized in the rod shape before neutralization',
    'Open the cuticle and permanently remove natural curl without affecting side bonds',
    'Temporarily break hydrogen bonds so the rod pattern remains only until the next shampoo',
  )},
  'CS-021': {options:o(
    'Reform or oxidize altered bonds to stabilize the hair in its new shape',
    'Reduce disulfide bonds a second time so the curl pattern becomes more permanent',
    'Remove waving solution residue while leaving the altered bonds unchanged',
    'Return the hair to its original pH without affecting the bonds changed during waving',
  )},
  'CS-022': {options:o(
    'Follow the product procedure for completing processing, rinsing, and neutralization',
    'Continue a short additional processing interval to strengthen the developed curl before rinsing',
    'Rinse immediately and assess the curl again before deciding whether neutralizer is necessary',
    'Remove one rod first to confirm the shape, then continue processing the remaining rods if needed',
  )},
  'CS-024': {options:o(
    'Determine the prior chemical history and compatibility before choosing any product',
    'Choose a mild relaxer and perform a strand test first, then investigate the prior system only if the test fails',
    'Base product selection on current elasticity because old relaxer type matters only when the hair is visibly damaged',
    'Use a lower-strength product from a different relaxer category to reduce the chance of overlap damage',
  )},
  'CS-025': {options:o(
    'Reassess service suitability, verify history, and use appropriate testing before performing either service',
    'Perform the less aggressive chemical service first and postpone the second only if the hair becomes weaker',
    'Use reduced strength for both services and separate them by additional conditioning during the same visit',
    'Prioritize the color goal first because porosity affects color more directly than texture restructuring',
  )},
  'CS-030': {options:o(
    'Manufacturer directions, desired result, and the analyzed condition of the hair',
    'Natural level, amount of lift desired, and processing speed, with condition checked only if prior damage is visible',
    'Desired result and hair density, using the strongest developer that reaches the target within the label time',
    'Porosity and natural level first, while manufacturer directions mainly control mixing ratio rather than strength',
  )},
  'CS-031': {options:o(
    'Hair integrity and safe termination or modification of processing',
    'The target tone, provided the formula is removed immediately once the desired level is reached',
    'Evenness of the lift, because correcting uneven lightening is harder after processing stops',
    'Processing speed, because a weakened strand may still reach the target if the remaining time is shortened',
  )},
  'CS-032': {options:o(
    'More porous areas may absorb and release color differently from less porous areas',
    'More porous areas usually resist color because raised cuticle layers prevent pigment from entering evenly',
    'Porosity mainly changes processing temperature, while color uptake is controlled by density',
    'Porosity affects only permanent color because temporary and semipermanent color remain entirely on the surface',
  )},
  'CS-033': {options:o(
    'Treat the history as uncertain and perform appropriate compatibility analysis or testing before proceeding',
    'Assume the product was oxidative color if there is no visible metallic residue and use a mild formula first',
    'Perform a strand test with the planned service and proceed if the strand survives without immediate breakage',
    'Choose a non-lightening service because metallic or compound products matter mainly when lift is attempted',
  )},
  'CS-034': {options:o(
    'Rod size and shape together with wrapping and processing',
    'Wrapping tension and processing time, while rod diameter mainly affects smoothness rather than curl size',
    'Hair density and section size, with rod shape having little effect once neutralized',
    'Neutralizer strength and wrapping pattern, while rod diameter matters mainly during drying',
  )},
  'CS-035': {options:o(
    'Use a smaller rod appropriate to the desired result',
    'Use a larger rod with greater wrapping tension to create the tighter pattern',
    'Keep the rod size and increase processing time until the curl becomes tighter',
    'Use the same rod but increase subsection width so more hair is compressed around it',
  )},
  'CS-036': {options:o(
    'Do not proceed until the scalp condition is appropriately resolved',
    'Protect the abrasions with barrier product and continue with a milder waving solution',
    'Avoid direct solution contact on the abrasions but process the surrounding hair normally',
    'Proceed only after a preliminary test confirms the client can tolerate the waving solution',
  )},
  'CS-037': {options:o(
    'Postpone or avoid the chemical service and follow appropriate contraindication guidance',
    'Apply protective base to the irritated area and use a milder relaxer on the remaining hair',
    'Reduce application time over the irritated area while keeping the planned formula elsewhere',
    'Proceed only on areas without visible irritation and avoid manipulating the affected scalp',
  )},
  'CS-038': {options:o(
    'Previously relaxed hair generally should not be unnecessarily overlapped with relaxer',
    'Previously relaxed hair usually processes more slowly, so overlap should be limited mainly to avoid uneven timing',
    'Overlap is acceptable when the same relaxer category is used and the prior result remains strong',
    'Overlap should be controlled mainly to keep product away from the scalp rather than to protect processed hair',
  )},
  'CS-039': {options:o(
    'Some chemical systems can be incompatible and may cause severe damage when combined',
    'Different relaxer systems mainly change processing speed, so compatibility affects timing more than structure',
    'Prior relaxer type matters mostly for selecting neutralizer because all relaxers act similarly during application',
    'Compatibility is important only when the previous service was recent enough to leave active product in the hair',
  )},
  'CS-040': {options:o(
    'Proper neutralization supports reformation of altered bonds throughout the processed hair',
    'Even neutralizer distribution mainly removes remaining waving solution so the hair stops processing',
    'Neutralizer placement controls curl size after processing by tightening sections that need more curl',
    'Neutralizer distribution restores the original cuticle condition without affecting the altered side bonds',
  )},
  'CS-041': {options:o(
    'Follow manufacturer directions and service-specific testing rather than extending processing on request',
    'Extend processing slightly if the client accepts the risk and the hair still feels strong during checks',
    'Increase monitoring frequency while leaving the product on beyond the stated time to pursue the stronger result',
    'Reduce heat and keep the product on longer because lower temperature offsets the extra processing time',
  )},
  'CS-042': {options:o(
    'The manufacturer’s directions for that product, within applicable safety rules',
    'The general rule when it is more conservative than the product directions, regardless of the product system',
    'The salon’s standard procedure if the same active ingredient is used in several different brands',
    'The barber’s usual timing when prior clients have achieved consistent results with the same service category',
  )},
  'CS-043': {options:o(
    'Follow the product’s first-aid directions and applicable emergency procedures immediately',
    'Rinse briefly, then resume the service if the client reports normal vision and no continuing discomfort',
    'Neutralize the exposed product with a compatible salon chemical before beginning the product’s first-aid steps',
    'Cover the eye with clean gauze and complete product removal from the hair before addressing the eye exposure',
  )},
  'CS-044': {options:o(
    'Stop exposure and follow the product’s removal and first-aid directions',
    'Remove product only from the irritated area and continue processing unaffected sections until the planned time',
    'Apply a soothing product over the affected skin and continue if the irritation does not spread',
    'Shorten total processing time but leave product in place long enough to complete the service result',
  )},
  'CS-045': {options:o(
    'Correct proportions support predictable product action and safer processing',
    'Exact proportions mainly control product texture, while processing strength can be adjusted through timing',
    'Mixing ratios affect final tone but have little effect on how aggressively the product acts on the hair',
    'Ratios may be adjusted for resistant hair if the total application time stays within the manufacturer’s range',
  )},
  'CS-046': {options:o(
    'The hair shows compromised integrity and the strong chemical service should be reassessed',
    'The hair is highly elastic, so a reduced-strength chemical service may still be appropriate without further testing',
    'The gummy feel indicates high porosity only, so the service can proceed if the processing time is shortened',
    'The hair should be dried fully and retested because wet-hair stretch does not reflect chemical-service suitability',
  )},
  'CS-047': {options:o(
    'Hair/scalp analysis, chemical history, compatibility, testing, product directions, and service sequence',
    'Desired result, service order, and client tolerance, with compatibility checked only if both services affect disulfide bonds',
    'Chemical history and timing first, while hair condition can be monitored as the first service proceeds',
    'Product directions and appointment length, using a mild formula for the second service to reduce combined stress',
  )},
  'CS-048': {options:o(
    'Relevant formula or product, processing observations, results, and reactions',
    'Formula and processing time only, because current results can be judged visually at the next appointment',
    'Products and final result only, with reactions documented only if the service had to be stopped',
    'Client satisfaction and target shade, while technical processing details remain unnecessary if the outcome was acceptable',
  )},
  'CS-049': {options:o(
    'Perform a current analysis and appropriate new testing rather than relying on the old result alone',
    'Repeat the prior test exactly and proceed if the result is slightly better than before',
    'Use the old test as the baseline and reduce product strength without repeating a full analysis',
    'Proceed with a small service area first because improved condition over time makes formal retesting less important',
  )},
  'CS-050': {options:o(
    'Clarify history, analyze integrity and porosity, establish compatibility, perform required tests, and modify or decline services based on results',
    'Prioritize the lighter color goal, use a mild formula, then decide on texture reduction from how the ends respond',
    'Perform the texture service first to even porosity, then formulate the cooler color after reassessing the result',
    'Use conservative strengths for both services and separate them with conditioning because client goals justify completing both',
  )},
};

export function applyChemicalServiceHardening(question: HairCareQuestion): HairCareQuestion {
  const override=overrides[question.id];
  return override ? {...question,...override} : question;
}
