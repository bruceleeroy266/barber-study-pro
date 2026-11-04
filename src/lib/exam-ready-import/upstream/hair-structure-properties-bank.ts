import { hairStructurePropertyQuestions as coreQuestions } from './hair-structure-properties';
import { hairStructurePropertyExpansionQuestions } from './hair-structure-properties-expansion';
import { applyHairStructureHardening } from './hair-structure-properties-hardening';

export const hairStructurePropertyQuestionBank = [
  ...coreQuestions,
  ...hairStructurePropertyExpansionQuestions,
].map(applyHairStructureHardening);
