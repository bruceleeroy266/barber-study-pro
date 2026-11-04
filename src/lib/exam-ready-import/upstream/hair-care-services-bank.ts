import { hairCareQuestions } from './hair-care-services';
import { hairCareExpansionQuestions } from './hair-care-services-expansion';
import { chemicalServiceQuestions } from './chemical-services';
import { hairCareBlueprintGapQuestions } from './hair-care-blueprint-gap';
import { applyHairCareHardening } from './hair-care-hardening';
import { applyChemicalServiceHardening } from './chemical-service-hardening';
import { applyHairCareSecondPass } from './hair-care-second-pass';
import { phase3CBatch4HairCareQuestions } from './phase-3c-batch-4';

export const hairCareQuestionBank = [
  ...hairCareQuestions,
  ...hairCareExpansionQuestions,
  ...chemicalServiceQuestions,
  ...hairCareBlueprintGapQuestions,
  ...phase3CBatch4HairCareQuestions,
].map(applyHairCareHardening).map(applyChemicalServiceHardening).map(applyHairCareSecondPass);
