import type { PracticeQuestion } from './randomize';
import { infectionControlQuestions } from './infection-control-bank';
import { anatomyPhysiologyQuestions } from './anatomy-physiology';
import { scientificConceptGapQuestions } from './scientific-concepts-gap';
import { hairScalpDisorderQuestionBank } from './hair-scalp-disorders-bank';
import { hairStructurePropertyQuestionBank } from './hair-structure-properties-bank';
import { implementsEquipmentQuestions } from './implements-equipment';
import { hairCareQuestionBank } from './hair-care-services-bank';
import { facialHairSkinQuestions } from './facial-hair-skin-care';

const BANKS: Record<string, PracticeQuestion[]> = {
  'Infection Control': infectionControlQuestions as PracticeQuestion[],
  'Anatomy & Physiology': anatomyPhysiologyQuestions as PracticeQuestion[],
  'Skin Conditions & Barber Chemistry': scientificConceptGapQuestions as PracticeQuestion[],
  'Hair & Scalp Disorders': hairScalpDisorderQuestionBank as PracticeQuestion[],
  'Hair Structure & Properties': hairStructurePropertyQuestionBank as PracticeQuestion[],
  'Implements & Equipment': implementsEquipmentQuestions as PracticeQuestion[],
  'Hair Care Services': hairCareQuestionBank as PracticeQuestion[],
  'Facial Hair & Skin Care': facialHairSkinQuestions as PracticeQuestion[],
};

type Finding = {
  id: string;
  subject: string;
  difficulty: PracticeQuestion['difficulty'];
  type: PracticeQuestion['type'];
  reasons: string[];
};

const giveawayPattern = /\b(price alone|package color|favorite brand|regardless of|ignore (it|the)|do nothing|skip (the|future)|cover .*continue|continue anyway|always proceed|never test)\b/i;
const stopWords = new Set(['the','a','an','and','or','to','of','in','on','for','with','at','by','from','is','are','be','should','would','could','client','barber','hair','service','product']);

function tokens(text: string) {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\s-]/g,' ').split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word)),
  );
}

function jaccard(a: Set<string>, b: Set<string>) {
  const intersection = [...a].filter((value) => b.has(value)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
}

function auditQuestion(question: PracticeQuestion, subject: string): Finding | null {
  const reasons: string[] = [];
  const correct = question.options.find((option) => option.id === question.correctOptionId);
  const distractors = question.options.filter((option) => option.id !== question.correctOptionId);

  if (!correct) reasons.push('missing-correct-option');
  if (question.options.length !== 4) reasons.push('not-four-options');
  if (new Set(question.options.map((option) => option.text.trim().toLowerCase())).size !== question.options.length) {
    reasons.push('duplicate-option-text');
  }

  if (question.difficulty === 'hard' && question.type === 'recall') {
    reasons.push('hard-labeled-recall');
  }

  if (correct && distractors.length) {
    const distractorAverage = distractors.reduce((sum, option) => sum + option.text.length, 0) / distractors.length;
    if (correct.text.length >= distractorAverage * 1.75 && correct.text.length - distractorAverage >= 24) {
      reasons.push('correct-answer-length-standout');
    }

    if (distractors.some((option) => giveawayPattern.test(option.text))) {
      reasons.push('obvious-or-absurd-distractor-language');
    }

    if (question.difficulty === 'hard') {
      const correctTokens = tokens(correct.text);
      const relatedDistractors = distractors.filter((option) => jaccard(correctTokens, tokens(option.text)) >= 0.12).length;
      if (relatedDistractors < 2) {
        reasons.push('hard-distractors-not-close-enough');
      }
    }
  }

  return reasons.length ? { id: question.id, subject, difficulty: question.difficulty, type: question.type, reasons } : null;
}

const all = Object.entries(BANKS).flatMap(([subject, questions]) => questions.map((question) => ({ subject, question })));
const ids = all.map(({ question }) => question.id);
if (all.length !== 573) {
  throw new Error(`Expected 573 questions in composed bank, found ${all.length}`);
}
if (new Set(ids).size !== ids.length) {
  throw new Error('Question bank contains duplicate IDs');
}

const findings = all.map(({ subject, question }) => auditQuestion(question, subject)).filter((finding): finding is Finding => Boolean(finding));
const hard = all.filter(({ question }) => question.difficulty === 'hard');
const byReason = new Map<string, number>();
for (const finding of findings) {
  for (const reason of finding.reasons) byReason.set(reason, (byReason.get(reason) ?? 0) + 1);
}

console.log('QUESTION BANK DIFFICULTY / DISTRACTOR AUDIT — BASELINE');
console.log(`Total questions: ${all.length}`);
console.log(`Hard-labeled questions: ${hard.length}`);
console.log(`Questions flagged by at least one heuristic: ${findings.length}`);
for (const [reason, count] of [...byReason.entries()].sort((a,b) => b[1] - a[1])) {
  console.log(`- ${reason}: ${count}`);
}

for (const [subject, questions] of Object.entries(BANKS)) {
  const subjectFindings = findings.filter((finding) => finding.subject === subject);
  const hardCount = questions.filter((question) => question.difficulty === 'hard').length;
  console.log(`\n${subject}: ${questions.length} questions • ${hardCount} hard • ${subjectFindings.length} flagged`);
  for (const finding of subjectFindings) {
    console.log(`  ${finding.id} [${finding.difficulty}/${finding.type}] ${finding.reasons.join(', ')}`);
  }
}

console.log('\nAudit rule: heuristics identify review candidates; they do not automatically prove an item is bad.');
console.log('Human hardening target: plausible same-family distractors, no giveaway wording, and multi-step reasoning for hard items.');
