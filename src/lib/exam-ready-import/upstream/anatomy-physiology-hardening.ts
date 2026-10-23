import type { PracticeQuestion } from './randomize';

type Override = Partial<Pick<PracticeQuestion,'prompt'|'options'|'type'|'difficulty'>>;
const o=(a:string,b:string,c:string,d:string)=>[
  {id:'a',text:a},{id:'b',text:b},{id:'c',text:c},{id:'d',text:d},
];

const overrides: Record<string, Override> = {
  'AP-022': {options:o(
    'Circulation delivers oxygen and nutrients to skin and scalp tissues while carrying away metabolic wastes',
    'Circulation mainly regulates skin temperature while nutrient delivery is handled by the nervous system',
    'Circulation mainly supplies oil to skin and scalp tissues while waste removal occurs through sweat glands',
    'Circulation mainly supports muscle movement while skin and scalp tissues receive nutrients by diffusion alone',
  )},
  'AP-023': {options:o(
    'Sweating supports temperature regulation because evaporation helps remove body heat',
    'Sweating supports sensory perception because moisture increases nerve response at the skin surface',
    'Sweating supports sebum production because sweat glands stimulate nearby sebaceous glands',
    'Sweating supports pigmentation because moisture helps melanin spread through the epidermis',
  )},
  'AP-025': {options:o(
    'The integumentary system includes skin, hair, and associated structures directly involved in many barbering services',
    'The integumentary system mainly controls digestion, while skin and hair belong to the nervous system',
    'The integumentary system mainly forms bones and joints that support positioning during barbering services',
    'The integumentary system has little relevance to scalp or facial services because it does not include hair structures',
  )},
  'AP-033': {options:o(
    'A joint is the connection between two or more bones and may be movable or immovable',
    'A joint is a gland that releases hormones directly into the bloodstream',
    'A joint is a sensory receptor that detects pressure and temperature in the skin',
    'A joint is a muscle attachment that always permits free movement between bones',
  )},
  'AP-047': {options:o(
    'Damage to the dermal papilla would most directly interfere with nourishment of growing hair at the follicle base',
    'Damage to the visible hair shaft would most directly interfere with nourishment of growing hair at the follicle base',
    'Damage to the cuticle above the skin would most directly interfere with nourishment of growing hair at the follicle base',
    'Damage to the hair tip would most directly interfere with nourishment of growing hair at the follicle base',
  )},
  'AP-050': {options:o(
    'Anatomy and physiology knowledge helps identify the structures and body systems contacted during barbering services',
    'Anatomy and physiology knowledge helps replace infection-control decisions when the relevant structures are understood',
    'Anatomy and physiology knowledge helps the barber diagnose medical disease involving structures contacted during services',
    'Anatomy and physiology knowledge makes consultation less important because service areas can be identified anatomically',
  )},
};

const phase2CCalibration: Record<string, Override> = {
  'AP-002': {options:o(
    'Hair follicle',
    'Dermal papilla',
    'Arrector pili muscle',
    'Sebaceous gland',
  )},
  'AP-025': {
    prompt:'During a scalp or facial service, which body system is directly involved because it includes the skin, hair, and associated glands?',
    options:o(
      'Integumentary system',
      'Nervous system',
      'Circulatory system',
      'Muscular system',
    ),
  },
  'AP-050': {
    prompt:'During a facial or shaving service, why should a barber understand the anatomy of the area being worked on?',
    options:o(
      'To identify the structures being contacted and adapt technique and positioning safely',
      'To identify the structures being contacted and decide which medical condition explains tenderness before adapting the service',
      'To identify the structures being contacted and use anatomy in place of consultation when the service area appears normal',
      'To identify the structures being contacted and choose infection-control procedures from anatomy rather than exposure risk',
    ),
  },
};

export function applyAnatomyPhysiologyHardening(question: PracticeQuestion): PracticeQuestion {
  const override={...(overrides[question.id] ?? {}), ...(phase2CCalibration[question.id] ?? {})};
  return Object.keys(override).length ? {...question,...override,...(override.options?{correctOptionId:'a'}:{})} : question;
}
