import fs from 'node:fs';
import type { PracticeQuestion } from './randomize';
import { infectionControlQuestions } from './infection-control-bank';
import { anatomyPhysiologyQuestions } from './anatomy-physiology';
import { scientificConceptGapQuestions } from './scientific-concepts-gap';
import { hairScalpDisorderQuestionBank } from './hair-scalp-disorders-bank';
import { hairStructurePropertyQuestionBank } from './hair-structure-properties-bank';
import { implementsEquipmentQuestions } from './implements-equipment';
import { hairCareQuestionBank } from './hair-care-services-bank';
import { facialHairSkinQuestions } from './facial-hair-skin-care';

const all: PracticeQuestion[]=[
  ...(infectionControlQuestions as PracticeQuestion[]),
  ...(anatomyPhysiologyQuestions as PracticeQuestion[]),
  ...(scientificConceptGapQuestions as PracticeQuestion[]),
  ...(hairScalpDisorderQuestionBank as PracticeQuestion[]),
  ...(hairStructurePropertyQuestionBank as PracticeQuestion[]),
  ...(implementsEquipmentQuestions as PracticeQuestion[]),
  ...(hairCareQuestionBank as PracticeQuestion[]),
  ...(facialHairSkinQuestions as PracticeQuestion[]),
];

const modifierFiles=[
  'src/lib/exam-ready-import/upstream/anatomy-physiology-hardening.ts',
  'src/lib/exam-ready-import/upstream/chemical-service-hardening.ts',
  'src/lib/exam-ready-import/upstream/hair-care-hardening.ts',
  'src/lib/exam-ready-import/upstream/hair-care-second-pass.ts',
  'src/lib/exam-ready-import/upstream/hair-scalp-disorders-hardening.ts',
  'src/lib/exam-ready-import/upstream/hair-structure-properties-hardening.ts',
  'src/lib/exam-ready-import/upstream/infection-control-hardening.ts',
  'src/lib/exam-ready-import/upstream/scientific-concepts-gap-hardening.ts',
];

const optionOverrideIds=new Set<string>();
for(const file of modifierFiles){
  const text=fs.readFileSync(file,'utf8');
  for(const match of text.matchAll(/['"]([A-Z]+-\d{3})['"]\s*:\s*\{[\s\S]*?options\s*:\s*o\s*\(/g)){
    optionOverrideIds.add(match[1]);
  }
}
const byId=new Map(all.map(q=>[q.id,q]));
const problems=[...optionOverrideIds].sort().flatMap(id=>{
  const q=byId.get(id);
  if(!q) return [{id,issue:'override id missing from composed bank'}];
  return q.correctOptionId==='a' ? [] : [{
    id,
    issue:'hardened options put intended correct answer at option a, but composed correctOptionId is '+q.correctOptionId,
    prompt:q.prompt,
    keyedAnswer:q.options.find(o=>o.id===q.correctOptionId)?.text,
    intendedAnswer:q.options.find(o=>o.id==='a')?.text,
    explanation:q.explanation,
  }];
});
console.log(JSON.stringify({totalQuestions:all.length,optionOverrideIds:optionOverrideIds.size,problems},null,2));
if(problems.length) process.exitCode=2;
