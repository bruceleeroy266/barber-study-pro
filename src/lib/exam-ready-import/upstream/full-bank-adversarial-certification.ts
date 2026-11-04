import type { PracticeQuestion } from './randomize';
import { infectionControlQuestions } from './infection-control-bank';
import { anatomyPhysiologyQuestions } from './anatomy-physiology';
import { scientificConceptGapQuestions } from './scientific-concepts-gap';
import { hairScalpDisorderQuestionBank } from './hair-scalp-disorders-bank';
import { hairStructurePropertyQuestionBank } from './hair-structure-properties-bank';
import { implementsEquipmentQuestions } from './implements-equipment';
import { hairCareQuestionBank } from './hair-care-services-bank';
import { facialHairSkinQuestions } from './facial-hair-skin-care';
import {
  buildFullSimulator,
  certifySimulatorShape,
  scoreFullSimulator,
  WEIGHTED_DOMAIN_QUOTAS,
  UNWEIGHTED_DOMAIN_QUOTAS,
  type SimulatorDomain,
} from '@/lib/exam/simulator';

type BankSpec = {
  name: string;
  prefix: string;
  expectedCount: number;
  expectedDomain: string;
  questions: PracticeQuestion[];
};

const specs: BankSpec[] = [
  { name:'Infection Control', prefix:'IC-', expectedCount:78, expectedDomain:'Scientific Concepts', questions:infectionControlQuestions as PracticeQuestion[] },
  { name:'Anatomy & Physiology', prefix:'AP-', expectedCount:54, expectedDomain:'Scientific Concepts', questions:anatomyPhysiologyQuestions as PracticeQuestion[] },
  { name:'Skin Conditions & Barber Chemistry', prefix:'SCG-', expectedCount:38, expectedDomain:'Scientific Concepts', questions:scientificConceptGapQuestions as PracticeQuestion[] },
  { name:'Hair & Scalp Disorders', prefix:'HS-', expectedCount:51, expectedDomain:'Scientific Concepts', questions:hairScalpDisorderQuestionBank as PracticeQuestion[] },
  { name:'Hair Structure & Properties', prefix:'HP-', expectedCount:53, expectedDomain:'Scientific Concepts', questions:hairStructurePropertyQuestionBank as PracticeQuestion[] },
  { name:'Implements & Equipment', prefix:'IE-', expectedCount:56, expectedDomain:'Implements & Equipment', questions:implementsEquipmentQuestions as PracticeQuestion[] },
  { name:'Hair Care Services', prefix:'', expectedCount:173, expectedDomain:'Hair Care Services', questions:hairCareQuestionBank as PracticeQuestion[] },
  { name:'Facial Hair & Skin Care', prefix:'', expectedCount:70, expectedDomain:'Facial Hair & Skin Care', questions:facialHairSkinQuestions as PracticeQuestion[] },
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function norm(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}

const all = specs.flatMap((spec) => spec.questions.map((question) => ({spec, question})));
assert(all.length === 573, `expected 573 questions, found ${all.length}`);

const ids = new Set<string>();
const prompts = new Map<string,string>();
let hardCount = 0;

for (const spec of specs) {
  assert(spec.questions.length === spec.expectedCount, `${spec.name}: expected ${spec.expectedCount}, found ${spec.questions.length}`);

  for (const q of spec.questions) {
    assert(!ids.has(q.id), `duplicate question id: ${q.id}`);
    ids.add(q.id);

    if (spec.prefix) assert(q.id.startsWith(spec.prefix), `${q.id}: id prefix drift for ${spec.name}`);
    assert(q.domain === spec.expectedDomain, `${q.id}: domain drift: expected ${spec.expectedDomain}, got ${q.domain}`);
    assert(Boolean(q.subject?.trim()), `${q.id}: missing subject`);
    assert(Boolean(q.competency?.trim()), `${q.id}: missing competency`);
    assert(Boolean(q.prompt?.trim()), `${q.id}: empty prompt`);
    assert(Boolean(q.explanation?.trim()), `${q.id}: empty explanation`);
    assert(Array.isArray(q.sourceBasis) && q.sourceBasis.length > 0 && q.sourceBasis.every((s) => Boolean(s.trim())), `${q.id}: missing source basis`);
    assert(['recall','application','scenario'].includes(q.type), `${q.id}: invalid type`);
    assert(['easy','medium','hard'].includes(q.difficulty), `${q.id}: invalid difficulty`);
    if (q.difficulty === 'hard') {
      hardCount += 1;
      assert(q.type !== 'recall', `${q.id}: hard question regressed to recall`);
    }

    assert(q.options.length === 4, `${q.id}: expected 4 options, found ${q.options.length}`);
    const optionIds = q.options.map((o) => o.id);
    assert(new Set(optionIds).size === 4, `${q.id}: duplicate option ids`);
    assert(optionIds.includes(q.correctOptionId), `${q.id}: correct option id missing from options`);
    assert(q.options.every((o) => Boolean(o.text.trim())), `${q.id}: blank option text`);

    const normalizedOptions = q.options.map((o) => norm(o.text));
    assert(new Set(normalizedOptions).size === 4, `${q.id}: duplicate normalized option text`);

    const promptKey = norm(q.prompt);
    const prior = prompts.get(promptKey);
    assert(!prior, `${q.id}: duplicate normalized prompt with ${prior}`);
    prompts.set(promptKey, q.id);

    const correct = q.options.find((o) => o.id === q.correctOptionId);
    assert(correct, `${q.id}: no correct option`);
    const sameAsCorrect = normalizedOptions.filter((t) => t === norm(correct.text)).length;
    assert(sameAsCorrect === 1, `${q.id}: duplicate-answer risk: correct answer text appears more than once`);
  }
}

assert(ids.size === 573, `expected 573 unique ids, found ${ids.size}`);
assert(hardCount === 225, `hard-question count drift: expected 225, found ${hardCount}`);

for (let run = 1; run <= 1000; run += 1) {
  const exam = buildFullSimulator();
  const shape = certifySimulatorShape(exam);
  assert(shape.total === 110, `sim run ${run}: expected 110 total`);
  assert(shape.uniqueIds === 110, `sim run ${run}: duplicate ids`);
  assert(shape.weighted === 100, `sim run ${run}: expected 100 weighted`);
  assert(shape.experimental === 10, `sim run ${run}: expected 10 experimental`);

  for (const domain of Object.keys(WEIGHTED_DOMAIN_QUOTAS) as SimulatorDomain[]) {
    assert(shape.weightedByDomain[domain] === WEIGHTED_DOMAIN_QUOTAS[domain], `sim run ${run}: weighted quota drift in ${domain}`);
    assert(shape.experimentalByDomain[domain] === UNWEIGHTED_DOMAIN_QUOTAS[domain], `sim run ${run}: experimental quota drift in ${domain}`);
  }

  const allCorrect = Object.fromEntries(exam.map((q) => [q.id, q.correctOptionId]));
  const perfect = scoreFullSimulator(exam, allCorrect);
  assert(perfect.weightedCorrect === 100 && perfect.percentage === 100, `sim run ${run}: perfect scoring regression`);
  assert(perfect.experimentalTotal === 10, `sim run ${run}: experimental-count regression`);

  const experimentalWrong = {...allCorrect};
  for (const q of exam.filter((item) => !item.scored)) {
    experimentalWrong[q.id] = q.options.find((o) => o.id !== q.correctOptionId)?.id ?? q.correctOptionId;
  }
  const experimentalScore = scoreFullSimulator(exam, experimentalWrong);
  assert(experimentalScore.weightedCorrect === 100 && experimentalScore.percentage === 100, `sim run ${run}: experimental item affected weighted score`);
}

console.log('PASS: final full-bank adversarial certification');
console.log('573 unique questions • 225 hard • 4 unique options each • 573 unique normalized prompts');
console.log('No missing correct answer, duplicate answer text, source-basis gap, domain drift, or hard-to-recall regression.');
console.log('1000 simulator builds passed exact 110/100/10 structure, domain quotas, unique IDs, perfect scoring, and experimental-score exclusion.');
