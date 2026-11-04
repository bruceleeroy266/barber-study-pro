import { infectionControlQuestions as coreQuestions } from './infection-control';
import { infectionControlExpansionQuestions } from './infection-control-expansion';
import { infectionControlValidationExpansionQuestions } from './infection-control-validation-expansion';
import { infectionControlFinalGapQuestions } from './infection-control-final-gap';
import { applyInfectionControlHardening } from './infection-control-hardening';

export const infectionControlQuestions = [
  ...coreQuestions,
  ...infectionControlExpansionQuestions,
  ...infectionControlValidationExpansionQuestions,
  ...infectionControlFinalGapQuestions,
].map(applyInfectionControlHardening);
