import type { HairStructureQuestion } from './hair-structure-properties';

type Override = Partial<Pick<HairStructureQuestion,'prompt'|'options'|'type'|'difficulty'>>;
const o=(a:string,b:string,c:string,d:string)=>[
  {id:'a',text:a},{id:'b',text:b},{id:'c',text:c},{id:'d',text:d},
];

const overrides: Record<string, Override> = {
  'HP-012': {options:o(
    'Coarse texture may require stronger processing, high porosity absorbs moisture rapidly, and poor elasticity can indicate fragile or overprocessed hair',
    'Coarse texture may require stronger processing, low porosity absorbs moisture rapidly, and poor elasticity indicates strong resistance to breakage',
    'Fine texture may require stronger processing, high porosity resists moisture absorption, and normal elasticity indicates overprocessed hair',
    'Coarse texture mainly affects density, high porosity mainly affects strand diameter, and poor elasticity mainly affects growth pattern',
  )},
  'HP-022': {difficulty:'medium', options:o(
    'High porosity, because overly porous hair can have a raised cuticle and absorb liquids quickly',
    'Low porosity, because resistant hair absorbs the least moisture',
    'High density, because density measures the number of strands per square inch',
    'Coarse texture, because texture describes strand diameter rather than moisture absorption',
  )},
  'HP-023': {options:o(
    'Low or poor elasticity, because brittle hair breaks easily and may be overprocessed',
    'Normal elasticity, because normal hair stretches and returns without breaking',
    'High density, because density measures the number of strands in a scalp area',
    'Low porosity, because porosity describes resistance to moisture penetration',
  )},
  'HP-024': {difficulty:'medium', options:o(
    'The cortex provides strength, elasticity, and natural color, and chemical-service changes take place there',
    'The cuticle is the middle layer where natural pigment is stored',
    'The hair root is the visible portion where chemical-service changes occur',
    'Hair density is controlled by the cortex and determines chemical penetration',
  )},
  'HP-025': {options:o(
    'Porosity measures moisture absorption, while density measures the number of strands per square inch',
    'Texture measures moisture absorption, while elasticity measures the number of strands per square inch',
    'Density measures strand diameter, while texture measures moisture absorption',
    'Elasticity measures strand count, while porosity measures strand diameter',
  )},
  'HP-030': {options:o(
    'Low porosity, because resistant hair absorbs the least amount of moisture',
    'High porosity, because overly porous hair absorbs liquids quickly',
    'High density, because density measures the number of strands per square inch',
    'Poor elasticity, because elasticity measures stretch and return rather than moisture absorption',
  )},
  'HP-031': {difficulty:'medium', options:o(
    'The hair breaks easily or does not return toward its original length after stretching',
    'The hair absorbs very little moisture and resists penetration during the analysis',
    'The scalp area contains fewer individual hairs per square inch than expected',
    'The individual strand has a larger diameter and feels coarse during analysis',
  )},
  'HP-033': {options:o(
    'Catagen, because it is the brief transition between the growth and resting phases',
    'Anagen, because it is the active growth phase',
    'Telogen, because it is the resting phase',
    'Canities, because it describes a change in hair pigment rather than a growth phase',
  )},
  'HP-034': {options:o(
    'Telogen, because it is the resting phase',
    'Anagen, because it is the active growth phase',
    'Catagen, because it is the brief transition phase',
    'Canities, because it is a hair-pigment condition rather than a growth phase',
  )},
  'HP-040': {options:o(
    'Texture, density, porosity, and elasticity',
    'Texture, density, anagen, and catagen',
    'Porosity, elasticity, follicle, and papilla',
    'Density, cortex, medulla, and telogen',
  )},
  'HP-044': {options:o(
    'The medulla is the innermost layer and may be absent, while the cortex is the middle layer and makes up most of the hair shaft',
    'The medulla is the outer protective layer, while the cortex is a gland attached to the follicle',
    'The medulla contains the hair root, while the cortex supplies blood to the follicle',
    'The medulla and cortex are two names for the same layer',
  )},
  'HP-049': {options:o(
    'Texture describes individual-strand diameter, while density describes the number of hairs per square inch',
    'Texture describes moisture absorption, while density describes stretch and return',
    'Texture is a growth phase, while density is a hair bond',
    'Texture and density describe the same measurement',
  )},
  'HP-050': {options:o(
    'Texture can affect processing needs, porosity shows moisture absorption, and elasticity can reveal brittle or overprocessed hair',
    'Texture shows moisture absorption, porosity shows strand diameter, and elasticity determines how many hairs are present per square inch',
    'Texture determines all processing time, porosity identifies the growth phase, and elasticity measures the amount of natural pigment',
    'Texture, porosity, and elasticity describe separate findings, but none of them contributes useful information before a chemical service',
  )},
};

const phase2CCalibration: Record<string, Override> = {
  'HP-019': {
    prompt:'During a permanent wave, which bond must be chemically altered to create a lasting change in hair shape?',
    options:o(
      'Disulfide bond',
      'Hydrogen bond',
      'Salt bond',
      'Peptide bond',
    ),
  },
  'HP-020': {
    prompt:'Which weak physical side bond is broken by changes in pH and can re-form when normal pH is restored?',
    options:o(
      'Salt bond',
      'Disulfide bond',
      'Peptide bond',
      'Hydrogen bond',
    ),
  },
  'HP-037': {options:o(
    'Disulfide bonds, because permanent-wave solutions and chemical relaxers break these strong chemical side bonds',
    'Hydrogen bonds, because water or heat temporarily breaks these weak physical side bonds',
    'Salt bonds, because strong acidic or alkaline solutions affect these weak pH-dependent side bonds',
    'Peptide bonds, because Milady identifies these as end bonds rather than the side bonds targeted by permanent waving',
  )},
};

export function applyHairStructureHardening(question: HairStructureQuestion): HairStructureQuestion {
  const override={...(overrides[question.id] ?? {}), ...(phase2CCalibration[question.id] ?? {})};
  return Object.keys(override).length ? {...question,...override} : question;
}
