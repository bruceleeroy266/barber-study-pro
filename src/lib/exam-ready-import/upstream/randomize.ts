import type { QuestionOption } from './infection-control';

export type PracticeQuestion = {
  id: string;
  domain: string;
  subject: string;
  competency: string;
  type: 'recall' | 'application' | 'scenario';
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  sourceBasis: string[];
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export type DisplayQuestion = Omit<PracticeQuestion, 'options'> & {
  options: QuestionOption[];
};

function withShuffledOptions(questions: PracticeQuestion[]): DisplayQuestion[] {
  return questions.map((question) => ({
    ...question,
    options: shuffle(question.options),
  }));
}

export function buildPracticeSet(
  bank: PracticeQuestion[],
  count: number,
  previousQuestionIds: string[] = [],
): DisplayQuestion[] {
  if (count <= 0) return [];

  const previous = new Set(previousQuestionIds);
  const fresh = bank.filter((question) => !previous.has(question.id));
  const repeats = bank.filter((question) => previous.has(question.id));

  // Prefer unseen questions; use previous questions only if the bank is too small.
  const selected = [...shuffle(fresh), ...shuffle(repeats)].slice(
    0,
    Math.min(count, bank.length),
  );

  return withShuffledOptions(selected);
}

export function buildTargetedPracticeSet(
  bank: PracticeQuestion[],
  competencies: string[],
  count: number,
  previousQuestionIds: string[] = [],
  previousQuestionPrompts: string[] = [],
): DisplayQuestion[] {
  if (count <= 0 || competencies.length === 0) return [];

  const previousIds = new Set(previousQuestionIds);
  const previousPrompts = new Set(previousQuestionPrompts);
  // Derive prompt exclusions from prior IDs too. This prevents an exact repeat
  // even if duplicate wording accidentally exists under another question ID.
  for (const question of bank) {
    if (previousIds.has(question.id)) previousPrompts.add(question.prompt);
  }

  const uniqueCompetencies = Array.from(new Set(competencies));
  const selected: PracticeQuestion[] = [];
  const selectedIds = new Set<string>();

  // Guarantee each weak competency gets a fresh alternate first when one exists.
  for (const competency of shuffle(uniqueCompetencies)) {
    const targeted = bank.filter((question) => question.competency === competency);
    const fresh = targeted.filter(
      (question) => !previousIds.has(question.id) && !previousPrompts.has(question.prompt),
    );
    const pool = fresh.length > 0 ? fresh : targeted;
    const candidate = shuffle(pool).find((question) => !selectedIds.has(question.id));
    if (candidate) {
      selected.push(candidate);
      selectedIds.add(candidate.id);
    }
  }

  // Fill remaining slots with additional fresh questions from the same weak
  // competencies. Only fall back to prior questions if no fresh alternatives
  // remain and the requested retest still needs questions.
  const targeted = bank.filter((question) => uniqueCompetencies.includes(question.competency));
  const freshRemainder = shuffle(targeted.filter(
    (question) =>
      !selectedIds.has(question.id) &&
      !previousIds.has(question.id) &&
      !previousPrompts.has(question.prompt),
  ));
  for (const question of freshRemainder) {
    if (selected.length >= count) break;
    selected.push(question);
    selectedIds.add(question.id);
  }

  if (selected.length < count) {
    const fallback = shuffle(targeted.filter((question) => !selectedIds.has(question.id)));
    for (const question of fallback) {
      if (selected.length >= count) break;
      selected.push(question);
      selectedIds.add(question.id);
    }
  }

  return withShuffledOptions(shuffle(selected.slice(0, Math.min(count, selected.length))));
}

export function scorePracticeSet(
  questions: DisplayQuestion[],
  answers: Record<string, string>,
) {
  const results = questions.map((question) => {
    const selectedOptionId = answers[question.id];
    return {
      questionId: question.id,
      competency: question.competency,
      selectedOptionId,
      correctOptionId: question.correctOptionId,
      correct: selectedOptionId === question.correctOptionId,
      explanation: question.explanation,
    };
  });

  const correct = results.filter((result) => result.correct).length;
  const total = questions.length;

  return {
    correct,
    total,
    percentage: total === 0 ? 0 : Math.round((correct / total) * 100),
    results,
  };
}
