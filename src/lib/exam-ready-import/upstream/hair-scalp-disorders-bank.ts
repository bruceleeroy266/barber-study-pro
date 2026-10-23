import { hairScalpDisorderQuestions as coreQuestions } from './hair-scalp-disorders';
import { hairScalpDisorderExpansionQuestions } from './hair-scalp-disorders-expansion';
import { applyHairScalpHardening } from './hair-scalp-disorders-hardening';

export const hairScalpDisorderQuestions = [
  ...coreQuestions,
  ...hairScalpDisorderExpansionQuestions,
].map(applyHairScalpHardening);

// Practice-engine alias kept explicit so module pages can name the assembled bank clearly.
export const hairScalpDisorderQuestionBank = hairScalpDisorderQuestions;
