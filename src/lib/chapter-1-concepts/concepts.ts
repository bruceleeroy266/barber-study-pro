import type { Chapter1ConceptFamily, Chapter1ConceptFamilyId, Chapter1LearningObjective } from './types'

export const chapter1LearningObjectives:readonly Chapter1LearningObjective[]=[
{id:'LO-1-01',statement:'Explain ancient origins, cultural beliefs, grooming customs, and historical hair traditions.',sourceBasis:'Chapter 1 lesson: ancient origins and shaving/beard culture',conceptFamilyIds:['ch1-origins-culture']},
{id:'LO-1-02',statement:'Explain the barber-surgeon era, guilds, tonsure, and the historical symbolism of the barber pole.',sourceBasis:'Chapter 1 lesson: medieval barber-surgeons and barber-pole history',conceptFamilyIds:['ch1-barber-surgeons-symbols']},
{id:'LO-1-03',statement:'Trace the evolution of barbering implements and major tool-technology milestones.',sourceBasis:'Chapter 1 lesson: evolution of barbering tools',conceptFamilyIds:['ch1-tools-technology']},
{id:'LO-1-04',statement:'Explain licensing milestones and the role of professional organizations in modern barbering standards.',sourceBasis:'Chapter 1 lesson: professional organizations and licensing',conceptFamilyIds:['ch1-licensing-organizations']},
{id:'LO-1-05',statement:'Connect historical development to modern professional identity, regulation, and the changing barbershop.',sourceBasis:'Chapter 1 lesson: historical milestones and modern standards',conceptFamilyIds:['ch1-modern-profession']},
] as const

export const chapter1ConceptFamilies:readonly Chapter1ConceptFamily[]=[
{id:'ch1-origins-culture',name:'Ancient Origins & Cultural Traditions',learningObjectiveIds:['LO-1-01'],learningObjectiveId:'LO-1-01',description:'Ancient tools, cultural beliefs, Egypt, Greece, Rome, beard customs, tonsure, queues, and historical hair traditions.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
{id:'ch1-barber-surgeons-symbols',name:'Barber-Surgeons, Guilds & Barber-Pole Symbolism',learningObjectiveIds:['LO-1-02'],learningObjectiveId:'LO-1-02',description:'Barber-surgeon history, guilds, medical services, separation from surgery, and barber-pole symbolism.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
{id:'ch1-tools-technology',name:'Tools & Technology Evolution',learningObjectiveIds:['LO-1-03'],learningObjectiveId:'LO-1-03',description:'Development of cutting tools, shears, clippers, razors, and electrical barbering technology.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
{id:'ch1-licensing-organizations',name:'Licensing & Professional Organizations',learningObjectiveIds:['LO-1-04'],learningObjectiveId:'LO-1-04',description:'Licensing milestones, state regulation, NABBA, and professional standards.',importance:'core',professionalRelevance:'CORE',examRelevance:'DIRECT_VERIFIED',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
{id:'ch1-modern-profession',name:'Modern Profession & Legacy',learningObjectiveIds:['LO-1-05'],learningObjectiveId:'LO-1-05',description:'Modern barbershop changes, professional identity, public protection, standards, and the continuing legacy of barbering.',importance:'supporting',professionalRelevance:'CORE',examRelevance:'INDIRECT_REFERENCE_ONLY',sourceProvenance:'TEXTBOOK_DERIVED',status:'active'},
] as const
export const CHAPTER1_CONCEPT_FAMILY_IDS=chapter1ConceptFamilies.map(x=>x.id) as readonly Chapter1ConceptFamilyId[]
export const ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS=CHAPTER1_CONCEPT_FAMILY_IDS
export const isChapter1ConceptFamilyId=(value:string):value is Chapter1ConceptFamilyId=>(CHAPTER1_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)
