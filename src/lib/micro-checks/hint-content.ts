import {
  hintLeaksAnswer,
  type HintableMicroCheckQuestion,
  type ResolvedMicroCheckHint,
} from './hints'

interface CoverageQuestion extends HintableMicroCheckQuestion {
  difficulty?: 'understanding' | 'application' | 'scenario'
  question?: string
  explanation?: string
}

const TOPIC_HINTS: readonly {
  pattern: RegExp
  text: string
}[] = [
  {
    pattern: /infect|disinfect|steriliz|sanit|pathogen|blood|ppe|sds|safety|contamin|clean/i,
    text: 'Identify the controlling safety or infection-control rule, then choose the response that follows the full required procedure rather than a shortcut.',
  },
  {
    pattern: /color|lighten|developer|peroxide|chemical|relax|permanent wave|perm\b|ph\b|oxid/i,
    text: 'Focus on the product action, hair condition, timing, and safety limits in the scenario before deciding which response best follows the service rule.',
  },
  {
    pattern: /razor|shav|beard|mustache|facial|skin|follic|pore/i,
    text: 'Separate skin and hair-growth facts from technique choices, then apply the service step that best protects the client and supports the intended result.',
  },
  {
    pattern: /clipper|shear|scissor|comb|cutting|haircut|elevation|guideline|distribution|graduat|layer/i,
    text: 'Visualize the haircut structure: guideline, elevation, distribution, and tool movement. Choose the response that would create the intended shape most consistently.',
  },
  {
    pattern: /anatom|muscle|bone|nerve|circul|blood vessel|cell|tissue|organ|body system/i,
    text: 'Match the structure to its primary function and location, then eliminate responses that describe a neighboring structure or a secondary effect.',
  },
  {
    pattern: /electric|current|volt|watt|amp|circuit|ground|shock/i,
    text: 'Identify what the electrical quantity or safety feature actually controls, then apply that relationship to the situation rather than relying on a familiar-sounding term.',
  },
  {
    pattern: /bacteria|virus|fung|parasite|microorgan|disease|infection/i,
    text: 'Classify the organism or transmission risk first, then apply the prevention or control rule that fits that category.',
  },
  {
    pattern: /consult|client|communicat|listen|complaint|conflict|professional|ethic|culture|inclusive/i,
    text: 'Prioritize clear communication, client understanding, professional boundaries, and the stated facts. Avoid responses that rely on assumptions or skip clarification.',
  },
  {
    pattern: /business|shop|lease|tax|entity|llc|insurance|record|finance|cash|marketing|advertis|referral|rental|contract/i,
    text: 'Separate the business decision from assumptions. Check the relevant costs, responsibilities, documentation, current rules, and client or worker protections before choosing.',
  },
  {
    pattern: /license|law|rule|regulat|scope|compliance|state board|inspection/i,
    text: 'Identify the governing requirement and scope boundary first. Choose the response that follows the current rule without inventing an exception or relying on shop custom.',
  },
  {
    pattern: /study|goal|time management|burnout|stress|habit|learning|memory/i,
    text: 'Focus on the behavior that improves consistency over time: clear priorities, measurable follow-through, active review, and early correction when performance starts slipping.',
  },
  {
    pattern: /shampoo|conditioner|scalp|hair care|porosity|elasticity|texture|density|growth/i,
    text: 'Use the hair or scalp condition described in the question to decide which principle matters most, then reject responses that ignore the client’s actual condition.',
  },
  {
    pattern: /nail|manicure|pedicure|foot|onych|cuticle/i,
    text: 'Identify the nail or skin condition first, then distinguish normal service steps from situations that require caution, referral, or a different procedure.',
  },
]

function sourceText(question: CoverageQuestion): string {
  return [
    question.conceptFamilyId,
    question.question ?? '',
    question.explanation ?? '',
  ].join(' ')
}

function difficultyHint(question: CoverageQuestion): string {
  switch (question.difficulty) {
    case 'scenario':
      return 'Identify the main professional rule being tested, apply it to every fact in the scenario, and reject responses that solve only part of the problem or add unsupported assumptions.'
    case 'application':
      return 'Apply the governing concept to the facts exactly as given. Look for the response that follows the whole rule, not one that is merely related to the topic.'
    case 'understanding':
    default:
      return 'Recall the defining principle for this concept, then compare each response for the one that matches that principle without adding unrelated claims.'
  }
}

export function buildMicroCheckCoverageHint(
  question: CoverageQuestion,
): ResolvedMicroCheckHint {
  const topic = TOPIC_HINTS.find(({ pattern }) => pattern.test(sourceText(question)))
  const candidate = topic?.text ?? difficultyHint(question)

  if (!hintLeaksAnswer(candidate, question)) {
    return { text: candidate, source: 'question' }
  }

  const fallback = difficultyHint(question)
  if (!hintLeaksAnswer(fallback, question)) {
    return { text: fallback, source: 'question' }
  }

  return {
    text: 'Identify the governing concept, compare each response against that rule, and reject any response that depends on an assumption not stated in the question.',
    source: 'question',
  }
}
