import type { PracticeQuestion } from './randomize';

type Override = Partial<Pick<PracticeQuestion,'prompt'|'options'|'type'|'difficulty'>>;
const o=(a:string,b:string,c:string,d:string)=>[
  {id:'a',text:a},{id:'b',text:b},{id:'c',text:c},{id:'d',text:d},
];

const overrides: Record<string, Override> = {
};

const finalOverrides: Record<string, Override> = {
};

const phase2CCalibration: Record<string, Override> = {
};

export function applyScientificConceptHardening(question: PracticeQuestion): PracticeQuestion {
  return {
    ...question,
    ...(overrides[question.id] ?? {}),
    ...(finalOverrides[question.id] ?? {}),
    ...(phase2CCalibration[question.id] ?? {}),
  };
}
