import type { Chapter6ConceptFamily, Chapter6ConceptFamilyId, Chapter6LearningObjective } from './types'

export const chapter6LearningObjectives: readonly Chapter6LearningObjective[] = [
  {id:'LO-6-01',statement:'Explain basic cell structure, cell division, tissues, homeostasis, and metabolism.',sourceBasis:'Chapter 6 premium lesson: cells and tissues/basic physiology',conceptFamilyIds:['ch6-cells-tissues']},
  {id:'LO-6-02',statement:'Identify the major body systems and relate anatomy and physiology to professional barbering services.',sourceBasis:'Chapter 6 premium lesson: body systems overview',conceptFamilyIds:['ch6-body-systems']},
  {id:'LO-6-03',statement:'Identify major skeletal structures and head, face, and neck landmarks relevant to barbering.',sourceBasis:'Chapter 6 premium lesson: skeletal system',conceptFamilyIds:['ch6-skeletal']},
  {id:'LO-6-04',statement:'Identify major muscle types and head, face, neck, and movement functions relevant to barbering.',sourceBasis:'Chapter 6 premium lesson: muscular system',conceptFamilyIds:['ch6-muscular']},
  {id:'LO-6-05',statement:'Explain nervous-system organization, key cranial nerves, and service-safety relevance.',sourceBasis:'Chapter 6 premium lesson: nervous system',conceptFamilyIds:['ch6-nervous']},
  {id:'LO-6-06',statement:'Explain cardiovascular structures, circulation, blood vessels, and head/neck blood supply.',sourceBasis:'Chapter 6 premium lesson: circulatory system',conceptFamilyIds:['ch6-cardiovascular']},
  {id:'LO-6-07',statement:'Explain lymphatic and immune structures and functions while maintaining observation and referral boundaries.',sourceBasis:'Chapter 6 premium lesson: lymphatic and immune system',conceptFamilyIds:['ch6-lymphatic']},
  {id:'LO-6-08',statement:'Identify skin layers, accessory structures, glands, hair-related structures, and integumentary functions.',sourceBasis:'Chapter 6 premium lesson: integumentary system',conceptFamilyIds:['ch6-integumentary']},
  {id:'LO-6-09',statement:'Explain endocrine glands and hormones and their general relationships to hair and skin without diagnosing conditions.',sourceBasis:'Chapter 6 premium lesson: endocrine system',conceptFamilyIds:['ch6-endocrine']},
  {id:'LO-6-10',statement:'Identify the core functions of the respiratory, digestive, urinary, and reproductive systems.',sourceBasis:'Chapter 6 premium lesson: other body systems',conceptFamilyIds:['ch6-other-systems']},
] as const

export const chapter6ConceptFamilies: readonly Chapter6ConceptFamily[] = [
  {id:'ch6-cells-tissues',name:'Cells, Tissues & Basic Physiology',learningObjectiveIds:['LO-6-01'],learningObjectiveId:'LO-6-01',description:'Cell structure and function, mitosis, tissues, homeostasis, and metabolism.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-body-systems',name:'Body Systems Overview',learningObjectiveIds:['LO-6-02'],learningObjectiveId:'LO-6-02',description:'Major body systems, anatomy versus physiology, system relationships, and barbering relevance.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-skeletal',name:'Skeletal System',learningObjectiveIds:['LO-6-03'],learningObjectiveId:'LO-6-03',description:'Skeletal functions and barber-relevant skull, facial, and neck landmarks.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-muscular',name:'Muscular System',learningObjectiveIds:['LO-6-04'],learningObjectiveId:'LO-6-04',description:'Muscle types, facial/scalp/neck muscles, mastication, and movement.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-nervous',name:'Nervous System',learningObjectiveIds:['LO-6-05'],learningObjectiveId:'LO-6-05',description:'CNS/PNS, neurons, sensory and motor pathways, cranial nerves, and service-safety relevance.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-cardiovascular',name:'Cardiovascular System',learningObjectiveIds:['LO-6-06'],learningObjectiveId:'LO-6-06',description:'Heart, blood, circulation, vessels, and head/neck blood supply.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-lymphatic',name:'Lymphatic & Immune System',learningObjectiveIds:['LO-6-07'],learningObjectiveId:'LO-6-07',description:'Lymph, vessels, nodes, immune functions, and professional observation/referral boundaries.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-integumentary',name:'Integumentary System',learningObjectiveIds:['LO-6-08'],learningObjectiveId:'LO-6-08',description:'Skin layers, hair, nails, glands, receptors, and accessory structures.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-endocrine',name:'Endocrine System',learningObjectiveIds:['LO-6-09'],learningObjectiveId:'LO-6-09',description:'Endocrine glands, hormones, regulation, and general hair/skin relationships.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
  {id:'ch6-other-systems',name:'Respiratory, Digestive, Urinary & Reproductive Systems',learningObjectiveIds:['LO-6-10'],learningObjectiveId:'LO-6-10',description:'Core functions of the remaining body systems and limited barber-relevant relationships.',importance:'supporting',professionalRelevance:'SUPPORTING',examRelevance:'INDIRECT_REFERENCE_ONLY',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
] as const

export const CHAPTER6_CONCEPT_FAMILY_IDS = chapter6ConceptFamilies.map(x=>x.id) as readonly Chapter6ConceptFamilyId[]
export const ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS = CHAPTER6_CONCEPT_FAMILY_IDS
export const isChapter6ConceptFamilyId=(value:string):value is Chapter6ConceptFamilyId=>(CHAPTER6_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
export function getChapter6ConceptFamily(id:Chapter6ConceptFamilyId):Chapter6ConceptFamily {
  const family=chapter6ConceptFamilies.find(x=>x.id===id)
  if(!family) throw new Error(`Unknown Chapter 6 concept family: ${id}`)
  return family
}
