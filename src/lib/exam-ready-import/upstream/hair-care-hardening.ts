import type { HairCareQuestion } from './hair-care-services';

type HairCareOverride = Partial<Pick<HairCareQuestion,'prompt'|'options'|'type'|'difficulty'>>;

const o = (a:string,b:string,c:string,d:string) => [
  {id:'a',text:a},{id:'b',text:b},{id:'c',text:c},{id:'d',text:d},
];

const overrides: Record<string, HairCareOverride> = {

  'HC-001': {
    options:o(
      'Identify the client’s needs, hair/scalp condition, service history, and service goals',
      'Identify the client’s desired result and service history, then analyze the scalp only if a concern is reported',
      'Identify the client’s hair texture and preferred result, then select the service before reviewing prior services',
      'Identify the requested service and maintenance goals, using the consultation mainly to confirm the final style',
    ),
  },
  'HC-002': {
    options:o(
      'Evaluate the condition and any contraindications before proceeding',
      'Evaluate the condition after selecting a modified service that avoids the most affected area',
      'Proceed with preparation while monitoring the condition for signs that the service should be stopped',
      'Ask about prior services first, then continue if the client says the condition has not caused problems before',
    ),
  },
  'HC-004': {
    options:o(
      'Protect the client’s skin and clothing while maintaining service sanitation',
      'Protect the client’s clothing while allowing the cape to contact the skin if the service is dry',
      'Protect the client’s skin from loose hair while using the same drape setup for every hair service',
      'Protect the client’s clothing from product while sanitation is handled separately by the workstation setup',
    ),
  },
  'HC-007': {
    options:o(
      'The angle at which the hair is held away from the head while cutting',
      'The direction in which a subsection is moved away from its natural fall before cutting',
      'The angle of the cutting line in relation to the subsection being held',
      'The direction the finished hair travels around the head after it is released',
    ),
  },
  'HC-009': {
    options:o(
      'Provide a length reference for cutting subsequent sections',
      'Provide an elevation reference for determining how far each subsection is held from the head',
      'Provide a sectioning reference that determines the direction each subsection is combed',
      'Provide a perimeter reference used only after interior lengths have already been established',
    ),
  },
  'HC-011': {
    options:o(
      'Gradually changing hair length so it becomes progressively shorter toward an area',
      'Gradually changing elevation so sections are held progressively farther from the head',
      'Gradually shifting the guideline so each new section becomes progressively longer',
      'Gradually changing overdirection while keeping the finished perimeter at one uniform length',
    ),
  },
  'HC-013': {
    options:o(
      'The natural hairline, growth pattern, desired design, and safe tool control',
      'The desired design and tool choice first, with the natural hairline adjusted to create stronger symmetry',
      'The natural hairline and density first, with growth pattern considered mainly when styling the finished outline',
      'The growth pattern and requested shape first, using tool control to create the same perimeter on both sides',
    ),
  },
  'HC-014': {
    options:o(
      'Control different cutting lengths and create a smooth transition',
      'Control the cutting plane while maintaining one length through the transition',
      'Control hair direction so the same guard removes equal weight from every section',
      'Control the outline while leaving the interior length unchanged through the graduated area',
    ),
  },
  'HC-016': {
    options:o(
      'Verify balance, consistency, and accuracy from another direction',
      'Verify the guideline by repeating the same sectioning direction used during the original cut',
      'Verify the perimeter by checking only the finished outline before styling',
      'Verify the elevation by measuring each subsection from the same side of the head',
    ),
  },
  'HC-021': {
    options:o(
      'Identify conditions or contraindications that may require modifying or avoiding the service',
      'Identify scalp type so the strongest treatment can be selected without changing the planned massage',
      'Identify sensitivity so massage pressure can be reduced while the planned treatment remains unchanged',
      'Identify product buildup so the scalp can be cleansed before deciding whether contraindications matter',
    ),
  },
  'HC-022': {
    options:o(
      'They improve consistency, visibility, and control of the cutting pattern',
      'They improve control of elevation while making the guideline less important from section to section',
      'They improve visibility of the perimeter while allowing larger sections to be cut with the same accuracy',
      'They improve cutting speed by reducing the need to compare neighboring subsections during the service',
    ),
  },
  'HC-026': {
    options:o(
      'Removal of weight and development of graduation or layering',
      'Retention of weight and development of a heavier perimeter',
      'Movement of length toward the area from which the subsection is combed',
      'Reduction of overdirection while the cutting line remains unchanged',
    ),
  },
  'HC-027': {
    options:o(
      'Combing hair away from its natural fall or designated section before cutting',
      'Holding hair at a higher angle from the head before cutting to remove more weight',
      'Changing the cutting line so the perimeter becomes shorter toward one side',
      'Moving the guideline through each subsection while keeping the hair at natural fall',
    ),
  },
  'HC-029': {
    options:o(
      'Improve control and consistency of the intended length',
      'Improve elevation consistency even if finger position changes through each subsection',
      'Improve cutting-line control while allowing tension to vary with hair texture',
      'Improve sectioning accuracy while the intended length is controlled mainly by the comb',
    ),
  },
  'HC-030': {
    options:o(
      'Lift and control hair while establishing the cutting plane',
      'Lift hair to a fixed elevation while the clipper establishes the cutting plane independently',
      'Control the guideline while the clipper determines how much hair is elevated from the head',
      'Control tension and natural fall while the clipper follows the perimeter instead of the comb',
    ),
  },
  'HC-032': {
    options:o(
      'Shears remove the hair projected through the comb',
      'Shears establish the comb angle while the comb removes hair outside the cutting plane',
      'Shears control the elevation while the comb determines the finished length without cutting',
      'Shears follow a fixed guard length while the comb is used only to check the finished blend',
    ),
  },
  'HC-035': {
    options:o(
      'Airflow, heat, brush or comb control, and sectioning',
      'Airflow, maximum heat, and larger sections to reduce the number of passes',
      'Heat, tension, and product choice while airflow direction remains constant',
      'Brush control, sectioning, and product choice while heat stays at one setting',
    ),
  },
  'HC-037': {
    options:o(
      'Hair/scalp condition, desired result, and service needs',
      'Desired result, product hold, and fragrance once scalp condition has been ruled out',
      'Hair texture, product strength, and service speed even if scalp condition differs from the norm',
      'Hair density, desired finish, and the product category normally used for that style',
    ),
  },
  'HC-038': {
    options:o(
      'Whether any condition or contraindication makes massage inappropriate',
      'Whether the scalp is dry enough to require additional pressure during massage',
      'Whether the client prefers light or firm pressure before contraindications are evaluated',
      'Whether the planned product can reduce sensitivity enough for massage to continue',
    ),
  },
  'HC-040': {
    options:o(
      'It supports future consultation and safer, more consistent service planning',
      'It supports future service timing while current analysis can be shortened if the same service is repeated',
      'It supports product selection by allowing prior formulas to replace some parts of a new consultation',
      'It supports consistency by encouraging the barber to repeat the previous service unless the client objects',
    ),
  },
  'HC-041': {
    options:o(
      'Fine texture with high density',
      'Coarse texture with high density',
      'Fine texture with low density',
      'Medium texture with high porosity',
    ),
  },
  'HC-046': {
    options:o(
      'Hair/scalp condition, texture, density, and desired result',
      'Hair/scalp condition, desired result, and product hold without evaluating density',
      'Texture, density, and desired result, with scalp condition checked only if discomfort is reported',
      'Texture, product choice, and maintenance needs, assuming density is addressed during styling',
    ),
  },
  'HCG-003': {
    options:o(
      'Products, formulas, processing details, results, and relevant reactions or observations',
      'Products and formulas used, with processing details recorded only when the result differs from the plan',
      'Products, final result, and client satisfaction, while reactions are documented only if medical care is required',
      'Formula and timing details, with observations omitted if the service was completed successfully',
    ),
  },
  'HCG-004': {
    options:o(
      'Previous chemistry can affect compatibility, condition, and the new service plan',
      'Previous chemistry mainly affects timing, while compatibility can be determined from current hair texture',
      'Previous chemistry affects expected tone, but current condition is enough to determine chemical compatibility',
      'Previous chemistry is useful for records, while a new strand test can replace the need to consider service history',
    ),
  },
  'HCG-005': {
    options:o(
      'Chemical products can contact and damage clothing or irritate skin if protection is inadequate',
      'Chemical products may require extra towels mainly to keep the cape dry during longer processing',
      'Chemical products need additional draping primarily because they are applied for more time than haircut services',
      'Chemical products require more protection mainly to keep product from transferring between sections of hair',
    ),
  },
  'HCG-006': {
    options:o(
      'Adjust the drape and towel protection before beginning',
      'Begin with reduced water flow and adjust the drape only if moisture reaches the collar',
      'Add a towel over the exposed collar while leaving the existing drape position unchanged',
      'Tilt the client farther back so water is less likely to reach the exposed collar',
    ),
  },
  'HCG-007': {
    options:o(
      'Hair and scalp condition, service needs, and product purpose',
      'Hair texture, service goal, and product strength after scalp condition has been ruled out',
      'Hair density, desired finish, and product category normally used for that service',
      'Hair length, service needs, and client preference even when scalp condition suggests a different choice',
    ),
  },
  'HCG-008': {
    options:o(
      'Reduce irritation, reassess product and technique, and stop if the condition indicates a contraindication',
      'Reduce pressure and water temperature, then continue unless visible irritation becomes worse',
      'Change shampoo products and continue if the client reports that the sensitivity is tolerable',
      'Pause the shampoo, add conditioner to the sensitive area, and resume with lighter manipulation',
    ),
  },
  'HCG-009': {
    options:o(
      'Analyze the scalp and determine whether the service is appropriate',
      'Choose the treatment goal first, then analyze the scalp to select product strength',
      'Analyze scalp oiliness first, then select a treatment before checking for contraindications',
      'Choose a conservative treatment and use the client’s response to determine whether the scalp is suitable',
    ),
  },
  'HCG-012': {
    options:o(
      'It can create an unnatural result and increase irritation or ingrown-hair risk in some areas',
      'It can make the outline appear uneven unless the same amount of hairline is removed on both sides',
      'It can expose shorter growth that makes the perimeter look lighter until the hair grows back',
      'It can make future outlining harder because the barber has fewer visible reference points to follow',
    ),
  },
  'HCG-016': {
    options:o(
      'It supports consistent shape and predictable drying results',
      'It supports consistent tension while allowing section size to vary with the desired shape',
      'It supports faster drying by keeping larger sections under the same amount of tension',
      'It supports product distribution while the final shape is controlled mainly after the hair dries',
    ),
  },
  'HCG-017': {
    options:o(
      'Section size, base control, tension, and consistent placement',
      'Section size and product amount first, with tension adjusted only after the set begins drying',
      'Base control and drying time, while placement can vary if each section uses equal tension',
      'Tension and placement, with section size changed freely to match the amount of hair in each area',
    ),
  },
  'HCG-019': {
    options:o(
      'It helps control hair direction, smoothness, and final shape',
      'It helps control drying speed and volume while brush direction determines the final shape',
      'It helps control heat exposure while sectioning determines direction and smoothness',
      'It helps control moisture removal while product choice determines direction and finish',
    ),
  },
  'HCG-021': {
    options:o(
      'Control sufficient for the style without excessive traction on hair or scalp',
      'Firm control that keeps the style secure even if mild scalp discomfort develops',
      'Equal tension on every section so the finished style remains uniform from area to area',
      'Maximum tension on the strongest hair sections with lighter tension only where breakage is visible',
    ),
  },
  'HCG-023': {
    options:o(
      'Hair/scalp condition, attachment method, tension, compatibility, and client maintenance needs',
      'Hair density, attachment method, and desired result, with tension adjusted after installation',
      'Hair/scalp condition and client maintenance needs, while compatibility is judged from the finished look',
      'Attachment method, desired length, and product choice, assuming scalp condition is normal unless symptoms appear',
    ),
  },
  'HC-010': {
    prompt:'A barber keeps losing length consistency as each new subsection is cut. Which correction most directly restores control of the haircut?',
    options:o(
      'Re-establish and follow a visible or traveling guideline through each subsection',
      'Increase elevation on each subsection while keeping the same cutting line',
      'Use more overdirection on each subsection without re-establishing the reference length',
      'Change to a shorter tool setting while continuing without a reference length',
    ),
  },
  'HC-012': {
    prompt:'A taper has a dark demarcation line between two otherwise appropriate lengths. Which adjustment most directly addresses the defect?',
    options:o(
      'Refine the transition by blending the two lengths through the demarcation area',
      'Shorten the entire lower section until it matches the upper section',
      'Raise the outline so the transition line appears farther from the perimeter',
      'Increase elevation above the line without connecting the two established lengths',
    ),
  },
  'HC-015': {
    options:o(
      'Use controlled light strokes and work the transition gradually',
      'Use a slightly shorter setting with the same deep pressure through the transition',
      'Work repeatedly on the line with slower heavy strokes until the area appears lighter',
      'Move above the transition and remove more bulk before checking the line again',
    ),
  },
  'HC-017': {
    options:o(
      'Natural growth direction can affect how the finished hair lies and may require length or technique adjustments',
      'Natural growth direction affects how the hair lies, so the barber should automatically cut the cowlick shorter',
      'Natural growth direction should be controlled by keeping identical length and tension across the front hairline',
      'Natural growth direction matters mainly after styling, so the planned cutting length should stay unchanged',
    ),
  },
  'HC-018': {
    options:o(
      'Do not perform the affected service and follow appropriate referral/contraindication procedures',
      'Modify the service to avoid direct contact with the lesion while continuing on the surrounding area',
      'Proceed with the service using reduced pressure and monitor the lesion for increased irritation',
      'Cleanse the area first and continue if the lesion appears less inflamed after preparation',
    ),
  },
  'HC-020': {
    options:o(
      'Evaluate hair condition, choose suitable heat, and control tool contact',
      'Evaluate hair condition, then use the highest heat the hair tolerates for the shortest contact time',
      'Choose heat from hair texture and density, then adjust only if visible damage appears',
      'Choose a moderate heat first and keep tool contact consistent regardless of prior damage',
    ),
  },
  'HC-023': {
    options:o(
      'Explain how density and growth pattern may affect the result and agree on a realistic adaptation',
      'Keep the requested silhouette but remove additional length where density is lowest to imitate the photo',
      'Use the reference photo as the primary guide and adjust only the final outline for the growth pattern',
      'Match the photo’s shortest areas first, then use styling products to compensate for density differences',
    ),
  },
  'HC-024': {
    options:o(
      'Lengths transition smoothly without unintended lines or heavy spots',
      'Lengths are shortest at the perimeter even if a visible weight line remains above it',
      'Lengths change gradually but one darker area remains where the guard setting changed',
      'Lengths are visually even from the front even if the side transition shows a faint demarcation',
    ),
  },
  'HC-025': {
    options:o(
      'Consult and analyze → identify growth patterns/contraindications → plan lengths and tools → drape and perform with controlled technique',
      'Consult and analyze → choose tools and shortest length → drape → identify growth patterns while cutting',
      'Consult on desired length → drape → establish the perimeter → analyze contraindications before finishing',
      'Analyze density and texture → select one guard plan → drape → adjust for growth patterns only during outlining',
    ),
  },
  'HC-028': {
    prompt:'A barber wants the finished haircut to retain progressively more length toward one side while preserving the planned cutting line. Which control best creates that distribution?',
    options:o(
      'Overdirection away from the area where additional length should remain',
      'Higher elevation toward the area where additional length should remain',
      'Lower elevation toward the area while combing each section to natural fall',
      'A stationary guideline used without shifting the subsection away from natural fall',
    ),
  },
  'HC-031': {
    prompt:'A guard leaves too much bulk in a curved transition area. Which technique gives the barber a movable cutting plane while allowing precise clipper refinement?',
    options:o(
      'Clipper-over-comb with the comb controlling the cutting plane',
      'Freehand clipper work with no comb while following the same transition line',
      'Shear-over-comb using the comb to control the plane and shears to remove the bulk',
      'A shorter fixed guard used through the entire transition without changing the cutting plane',
    ),
  },
  'HC-033': {
    options:o(
      'Analyze the natural pattern and choose a balanced outline that avoids unnecessary removal',
      'Choose a balanced outline first, then remove irregular natural growth until both sides match exactly',
      'Follow the lowest point of the natural neckline and square the opposite side to create symmetry',
      'Use the requested outline shape as the main guide and correct the natural pattern with closer removal',
    ),
  },
  'HC-034': {
    options:o(
      'It affects how length, weight, and silhouette appear around the head',
      'It affects where weight appears, but not the distribution of length around the head',
      'It affects the perimeter silhouette, while elevation controls shape independently of the head',
      'It affects tool position during cutting, but the planned silhouette should remain unchanged',
    ),
  },
  'HC-036': {
    options:o(
      'Use a more conservative heat approach based on the hair condition',
      'Use moderate heat with additional passes so each pass places less heat on the fragile hair',
      'Use higher heat for shorter contact because highly porous hair absorbs heat more quickly',
      'Use the normal heat setting but reduce tension so the fragile hair receives less mechanical stress',
    ),
  },
  'HC-039': {
    options:o(
      'Stop and reassess whether the service is appropriate before continuing',
      'Reduce pressure and continue only on areas that do not appear irritated',
      'Pause, apply a soothing product, and resume if the client reports less discomfort',
      'Continue the preparation but omit massage until the cause of the irritation is clearer',
    ),
  },
  'HC-042': {
    prompt:'During analysis, hair absorbs moisture very quickly but still has acceptable stretch and recovery. Which property should most affect caution with a later chemical service?',
    options:o(
      'Porosity because rapid absorption changes how readily the hair takes in moisture and product',
      'Elasticity because acceptable recovery means the hair will absorb chemical product more quickly',
      'Density because more hairs in an area increase the rate at which each strand absorbs product',
      'Growth direction because rapid absorption usually follows the direction in which the hair lies',
    ),
  },
  'HC-043': {
    options:o(
      'Compromised elasticity that should affect service selection',
      'High porosity that should affect service selection even if stretch and recovery are normal',
      'Low density that should affect service selection because fewer strands are supporting tension',
      'Coarse texture that should affect service selection because thicker strands stretch farther',
    ),
  },
  'HC-044': {
    prompt:'A barber is considering razor cutting on hair that is dry, porous, and prone to fraying. Which factor should control the decision before selecting the razor technique?',
    options:o(
      'Hair condition, desired result, and whether controlled razor technique is suitable for that condition',
      'Desired result first, then enough razor pressure to compensate for the porous condition',
      'Hair texture and density first, assuming the razor is suitable if the desired result requires softness',
      'The planned razor angle and section size, regardless of prior signs of fragility or fraying',
    ),
  },
  'HC-045': {
    options:o(
      'Reassess the technique and choose a safer method for the hair condition',
      'Keep the technique but reduce section size so mechanical stress is distributed over less hair',
      'Keep the technique but add moisture so the fragile hair stretches instead of resisting the tool',
      'Use lighter pressure with the same technique because all cutting methods create similar stress',
    ),
  },
  'HC-047': {
    options:o(
      'Evaluate hair/scalp condition, attachment area, desired result, and service suitability',
      'Evaluate hair density and desired result, then select the strongest attachment the hair can hold',
      'Evaluate the attachment area and desired result, then adjust tension after the enhancement is installed',
      'Evaluate hair length and maintenance needs, assuming scalp condition matters only for permanent methods',
    ),
  },
  'HC-048': {
    options:o(
      'Inspect the scalp and identify conditions, irregularities, or contraindications',
      'Map the growth direction and contours first, then inspect only areas where the razor will change direction',
      'Choose the desired final smoothness first, then inspect the scalp while preparing the first shaving section',
      'Prepare the scalp with warm moisture first so temporary redness does not get mistaken for a contraindication',
    ),
  },
  'HC-049': {
    options:o(
      'Avoid shaving over the lesion and follow appropriate contraindication/referral procedures',
      'Change the shaving path around the lesion while completing the rest of the planned head shave',
      'Use a fresh blade and lighter pressure around the lesion if the client reports no tenderness',
      'Prepare the area with warm lather and reassess whether the raised area can be shaved safely',
    ),
  },
  'HC-050': {
    options:o(
      'Use consultation and analysis to avoid unsafe areas, adapt lengths to growth, and select controlled techniques',
      'Prioritize the desired short blend, then modify only the irritated neckline while keeping the front length unchanged',
      'Adapt lengths to the crown growth and fragile front, then complete the neckline with reduced pressure around irritation',
      'Use the growth pattern to set lengths, then choose the safest tools after beginning the cut and observing the hair response',
    ),
  },
  'HCG-020': {
    options:o(
      'Hair condition, product use, temperature, and protection from excessive heat',
      'Hair condition and temperature, with product use determined after the first thermal pass',
      'Hair texture and density, using temperature as the main control once the iron contacts the hair',
      'Hair condition and desired finish, with protection from heat adjusted only if the hair becomes dry',
    ),
  },
  'HCG-022': {
    options:o(
      'Reduce tension and reassess the style before continuing',
      'Reduce tension only on the painful section and keep the original tension on completed sections',
      'Pause and continue at the same tension if the discomfort decreases after a few minutes',
      'Change the braid pattern while maintaining similar tension so the pressure is redistributed',
    ),
  },
  'HCG-024': {
    options:o(
      'Choose a safer method or postpone the enhancement to avoid further damage',
      'Use the planned method with lower tension and reduce the amount of hair in each attachment',
      'Use the planned method only in stronger areas and place normal tension there for better security',
      'Add a protective product before attachment so the fragile hair can tolerate the planned tension',
    ),
  },
  'HCG-025': {
    options:o(
      'Scalp condition, contours, lesions, growth direction, and client goals',
      'Scalp condition, contours, and desired smoothness, with growth direction checked during the first pass',
      'Growth direction, contours, and client goals, with lesion screening limited to visibly irritated areas',
      'Scalp condition and client goals first, with contours and growth direction corrected through razor technique',
    ),
  },
  'HCG-026': {
    type:'application',
    prompt:'A restructuring service calls for a hydroxide relaxer. Which choice correctly identifies the chemical category that matches the planned service?',
    options:o(
      'A hydroxide relaxing system selected and used according to its product directions',
      'A thio relaxing system selected because both categories can be substituted when curl reduction is desired',
      'A keratin smoothing system selected because all restructuring categories use the same chemical action',
      'A non-thio waving system selected because waving and relaxing categories are interchangeable',
    ),
  },
  'HCG-027': {
    type:'application',
    prompt:'A product label identifies the restructuring system as thio. Which classification should the barber recognize before planning compatibility and procedure?',
    options:o(
      'A thio relaxing/restructuring category with its own product-specific procedure',
      'A hydroxide relaxing category that follows the same compatibility rules as thio',
      'A keratin smoothing category that can replace thio when the desired result is straighter hair',
      'An alkaline waving category that is classified with thio because both can alter texture',
    ),
  },
  'HCG-028': {
    prompt:'A client is considering a keratin-based smoothing service. Which description best matches the category named in the service outline?',
    options:o(
      'A keratin smoothing/restructuring category that must follow its specific product directions',
      'A hydroxide relaxing category that uses keratin only as a conditioning step',
      'A thio restructuring category that is considered chemically equivalent to keratin smoothing',
      'A non-thio waving category used whenever the goal is to reduce curl rather than create it',
    ),
  },
  'HCG-029': {
    prompt:'A barber is comparing chemical waving systems before selecting a product. Which set contains the three waving/texturizing categories identified in the outline?',
    options:o(
      'Alkaline, acid, and non-thio',
      'Alkaline, hydroxide, and thio',
      'Acid, keratin, and non-thio',
      'Hydroxide, thio, and keratin',
    ),
  },
  'HCG-030': {
    options:o(
      'Monitor placement and processing to control lightening, protect integrity, and avoid unintended exposure',
      'Monitor processing time closely while allowing slight product movement if the desired level is developing evenly',
      'Monitor foil temperature primarily, because correct heat indicates that surrounding sections are protected',
      'Monitor the lightening result at the ends first, because product placement matters less after the foil is closed',
    ),
  },
  'HCG-031': {
    options:o(
      'Confirm intended product use and follow consultation, testing, skin protection, and manufacturer directions',
      'Confirm intended product use and skin protection, then omit testing if the same color family was used previously',
      'Confirm consultation and testing, then use standard scalp-hair timing because facial hair processes similarly',
      'Confirm manufacturer directions, then choose developer strength from the desired depth of color alone',
    ),
  },
  'HCG-032': {
    options:o(
      'Product is applied close to facial skin, so controlled application and skin protection reduce unintended contact',
      'Product is applied to coarser hair, so skin protection mainly helps keep the color formula from drying too quickly',
      'Product is applied in a smaller area, so skin protection allows a stronger formula to be controlled more precisely',
      'Product is applied near the face, so skin protection can replace some of the need for careful product placement',
    ),
  },
  'HCG-033': {
    options:o(
      'Some chemical systems are incompatible and can cause severe damage if layered improperly',
      'The systems may process at different speeds, so compatibility matters mainly for timing and final texture',
      'The systems have different pH ranges, but they can be layered if the hair passes a basic elasticity check',
      'The systems use different active ingredients, but compatibility is less important when the prior service is no longer visible',
    ),
  },
  'HCG-034': {
    options:o(
      'The specific manufacturer directions and the client’s hair condition',
      'The client’s hair condition and desired smoothness, using a standard temperature across keratin products',
      'The manufacturer’s timing directions, with temperature chosen mainly from the client’s hair density',
      'The product’s heat recommendation, while processing steps can follow the barber’s usual smoothing sequence',
    ),
  },
  'HCG-035': {
    type:'application',
    prompt:'A product is identified as an alkaline wave. Which classification should guide the barber’s choice of waving procedure and product directions?',
    options:o(
      'An alkaline chemical waving/texturizing category',
      'An acid waving category that can be processed with the same procedure at a higher pH',
      'A non-thio waving category selected whenever the product does not use hydroxide',
      'A thio relaxing category because alkaline products are primarily used to reduce curl',
    ),
  },
  'HCG-036': {
    options:o(
      'Use the procedure, processing, and safety directions for that specific acid-wave product',
      'Use the acid-wave timing but follow the same wrapping and testing assumptions as an alkaline wave',
      'Use the manufacturer’s processing time while selecting test procedures from the barber’s usual waving system',
      'Use a gentler temperature and timing approach because acid-wave products are handled mainly by pH category',
    ),
  },
  'HCG-037': {
    options:o(
      'Follow the non-thio product’s own directions, testing, timing, and safety requirements',
      'Follow the non-thio timing while using the same compatibility assumptions as a thio waving product',
      'Use the product directions for processing but substitute the barber’s usual preliminary-test routine',
      'Use the same wrapping procedure as other waves and adjust only the solution strength for the non-thio label',
    ),
  },
  'HCG-038': {
    options:o(
      'Isolate selected strands or sections so product placement can be controlled',
      'Isolate selected strands mainly to increase processing speed while maintaining the same product placement',
      'Separate selected strands so each section receives equal heat even if product placement overlaps slightly',
      'Separate selected strands primarily to keep the lightener moist rather than to control where product is placed',
    ),
  },
  'HCG-039': {
    options:o(
      'Correct the placement promptly and protect unintended hair from chemical exposure',
      'Open the foil and reduce product inside it while leaving the leaked product until the planned check time',
      'Move the leaked product back into the foil and extend processing so the selected section reaches the target level',
      'Remove the foil and reapply it tighter while continuing to process any hair already contacted by leaked product',
    ),
  },
  'HCG-040': {
    options:o(
      'Do not proceed as originally planned; use the result to modify or postpone the service according to safety guidance',
      'Repeat the preliminary test with a smaller amount and proceed if the second result appears less severe',
      'Modify the formula or timing and continue the service if the client understands the unfavorable test result',
      'Postpone only the tested area while proceeding with the original service plan on the remaining hair',
    ),
  },
};

const finalOverrides: Record<string, HairCareOverride> = {
  'HC-012': {options:o(
    'Blend through the demarcation area to connect the two established lengths smoothly',
    'Shorten only the darker side of the demarcation until its length matches the lighter side',
    'Refine above the line with the same guard while leaving the lower length unchanged',
    'Soften the line by changing cutting direction without actually connecting the two lengths',
  )},
  'HC-018': {options:o(
    'Do not perform the affected service and follow appropriate contraindication or referral procedures',
    'Avoid direct contact with the lesion and continue the service on nearby unaffected hair',
    'Reduce pressure and continue while monitoring whether irritation increases during the service',
    'Cleanse and protect the lesion first, then continue if the area appears stable',
  )},
  'HC-020': {options:o(
    'Evaluate hair condition, select suitable heat, and control tool contact throughout the service',
    'Evaluate hair condition, then use the highest tolerable heat for the shortest possible contact time',
    'Select heat from texture and density, then adjust only if the hair begins to show visible stress',
    'Use moderate heat with consistent contact time so every section receives the same thermal treatment',
  )},
  'HC-023': {options:o(
    'Explain how density and growth pattern affect the result and agree on a realistic adaptation',
    'Preserve the requested silhouette and remove extra length only where density differs most',
    'Follow the reference shape closely and adjust the final perimeter only where growth direction conflicts',
    'Match the shortest areas of the reference first, then use styling to visually balance density differences',
  )},
  'HC-024': {options:o(
    'Lengths transition smoothly with no unintended line or heavy spot between sections',
    'The perimeter is shortest and each section above it becomes longer even if a visible weight line remains',
    'The blend appears gradual from the front while a darker transition remains visible from the side',
    'The guard changes are evenly spaced even though one area still shows a distinct length break',
  )},
  'HC-028': {options:o(
    'Overdirect hair away from the area where additional length should remain',
    'Increase elevation toward the area where additional length should remain while keeping natural fall',
    'Lower elevation toward that area without changing how the subsection is directed',
    'Use a stationary guideline but keep each subsection in natural fall to preserve the added length',
  )},
  'HC-039': {options:o(
    'Stop and reassess whether the service is appropriate before continuing',
    'Reduce pressure and continue only if the irritation does not increase during the next section',
    'Pause, apply a soothing product, and resume if discomfort decreases after a short wait',
    'Continue preparation but omit massage until the irritated area can be checked again later in the service',
  )},
  'HC-042': {options:o(
    'Porosity, because rapid absorption changes how readily the hair takes in moisture and chemical product',
    'Elasticity, because acceptable stretch means the hair can tolerate faster chemical absorption',
    'Density, because closely packed strands will absorb more product in the same application area',
    'Growth pattern, because rapid absorption is usually strongest where the hair lies closest to the scalp',
  )},
  'HC-044': {options:o(
    'Hair condition, desired result, and whether razor technique is suitable for that fragile, porous hair',
    'Desired result and section size, using lighter razor pressure to compensate for the porous condition',
    'Texture and density first, assuming razor cutting remains suitable when the goal is added softness',
    'Razor angle and section width first, then reassess fragility only if fraying increases during the cut',
  )},
  'HC-045': {options:o(
    'Reassess the technique and choose a safer cutting method for the fragile hair condition',
    'Keep the same technique but reduce section size so each pass places less stress on the hair',
    'Keep the same technique but add moisture first so the hair stretches more easily under the tool',
    'Use lighter pressure and fewer passes because all cutting methods create similar mechanical stress',
  )},
  'HC-048': {options:o(
    'Inspect the scalp for conditions, irregularities, or contraindications before beginning the head shave',
    'Map growth direction and head contours first, then inspect only areas where the razor will change direction',
    'Choose the desired final smoothness first, then inspect the scalp as each section is prepared',
    'Prepare the scalp with warm moisture first, then check whether any visible irregularity still appears significant',
  )},
  'HC-049': {options:o(
    'Avoid shaving over the lesion and follow appropriate contraindication or referral procedures',
    'Adjust the shaving path to work around the lesion while completing the remaining planned head shave',
    'Use a fresh blade and lighter pressure near the lesion if the client reports no tenderness',
    'Apply warm lather and reassess whether the raised area can be shaved safely after preparation',
  )},
};

export function applyHairCareHardening(question: HairCareQuestion): HairCareQuestion {
  return {
    ...question,
    ...(overrides[question.id] ?? {}),
    ...(finalOverrides[question.id] ?? {}),
  };
}
