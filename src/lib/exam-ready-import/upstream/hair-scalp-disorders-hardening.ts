import type { HairScalpQuestion } from './hair-scalp-disorders';

type Override = Partial<Pick<HairScalpQuestion,'prompt'|'options'|'type'|'difficulty'>>;
const o=(a:string,b:string,c:string,d:string)=>[
  {id:'a',text:a},{id:'b',text:b},{id:'c',text:c},{id:'d',text:d},
];

const overrides: Record<string, Override> = {
  'HS-026': {options:o(
    'Split ends are a structural hair concern and are not by themselves a contagious contraindication',
    'Split ends are a structural disorder that requires referral before any chemical service but not before haircutting',
    'Split ends are noncontagious but still prohibit all scalp manipulation until the damaged ends are removed',
    'Split ends are not contagious, but they indicate an infectious scalp risk when breakage is widespread',
  )},
  'HS-028': {options:o(
    'Treat the findings as a contraindication, avoid manipulating the area, and refer when infection is suspected',
    'Avoid massage directly on the draining area but continue treatment on intact scalp nearby',
    'Cleanse and cover the lesion, then continue if redness decreases and the client reports less tenderness',
    'Use only light pressure around the lesion because massage can continue when direct contact is avoided',
  )},
  'HS-029': {options:o(
    'Because scalp disorders or conditions may be present that could prohibit the service',
    'Because scalp analysis allows the barber to make a medical diagnosis before consultation',
    'Because contraindications are checked only when chemical services are planned',
    'Because hair texture alone determines whether the service is safe to perform',
  )},
};

const finalOverrides: Record<string, Override> = {
  'HS-023': {options:o(
    'Base the service decision on the actual scalp assessment because noncontagious patterned hair loss alone is not infectious',
    'Postpone the service until the patterned hair-loss diagnosis is medically confirmed even when the scalp is intact',
    'Proceed only after the client confirms the patterned hair loss is noncontagious and no lesions are present',
    'Treat patterned hair loss as a service contraindication until a scalp examination shows no sign of infection',
  )},
  'HS-028': {options:o(
    'Treat the redness, broken skin, and draining lesion as a contraindication; avoid manipulation and refer if infection is suspected',
    'Treat the draining lesion as a localized concern and continue scalp treatment only on nearby intact skin',
    'Treat the draining lesion with cleansing first and continue treatment if redness and tenderness decrease',
    'Treat the broken skin as a pressure limitation and use light scalp treatment around the affected area',
  )},
};

const phase2CCalibration: Record<string, Override> = {
  'HS-027': {options:o(
    'Monilethrix—beaded hair shaft; trichoptilosis—split ends',
    'Monilethrix—brittle hair with nodular swellings; trichoptilosis—beaded shaft',
    'Monilethrix—split ends; trichoptilosis—brittle hair with nodular swellings',
    'Monilethrix—gray hair from pigment loss; trichoptilosis—excessive hair growth',
  )},
};

export function applyHairScalpHardening(question: HairScalpQuestion): HairScalpQuestion {
  return {
    ...question,
    ...(overrides[question.id] ?? {}),
    ...(finalOverrides[question.id] ?? {}),
    ...(phase2CCalibration[question.id] ?? {}),
  };
}
