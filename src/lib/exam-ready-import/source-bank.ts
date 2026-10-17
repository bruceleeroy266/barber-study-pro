/**
 * Exam Ready source-bank boundary.
 *
 * Source questions remain independent of ASCYN PRO chapter assessments.
 * This module has no database writes, auth clients, or UI side effects.
 */
export type ExamReadyReasoning = 'recall' | 'application' | 'scenario'
export type ExamReadyDifficulty = 'easy' | 'medium' | 'hard'
export type ExamReadyOption = { id: string; text: string }
export type ExamReadySourceQuestion = {
  id: string
  domain: string
  subject: string
  competency: string
  type: ExamReadyReasoning
  difficulty: ExamReadyDifficulty
  prompt: string
  options: ExamReadyOption[]
  correctOptionId: string
  explanation: string
  sourceBasis: string[]
}

export type ExamReadyBankIssue = { id: string; issue: string }

/** Fail closed on content corruption before questions become student-facing. */
export function validateExamReadyBank(questions: readonly ExamReadySourceQuestion[]): ExamReadyBankIssue[] {
  const issues: ExamReadyBankIssue[] = []
  const ids = new Set<string>()
  const prompts = new Set<string>()
  for (const question of questions) {
    const id = question.id?.trim() || '(missing id)'
    if (ids.has(id)) issues.push({ id, issue: 'duplicate question id' })
    ids.add(id)
    if (!question.id?.trim()) issues.push({ id, issue: 'missing question id' })
    const prompt = question.prompt?.trim().replace(/\s+/g, ' ').toLowerCase()
    if (!prompt) issues.push({ id, issue: 'missing prompt' })
    else if (prompts.has(prompt)) issues.push({ id, issue: 'duplicate prompt' })
    if (prompt) prompts.add(prompt)
    if (!question.domain?.trim() || !question.subject?.trim() || !question.competency?.trim()) {
      issues.push({ id, issue: 'missing classification' })
    }
    if (!['recall', 'application', 'scenario'].includes(question.type)) issues.push({ id, issue: 'invalid reasoning type' })
    if (!['easy', 'medium', 'hard'].includes(question.difficulty)) issues.push({ id, issue: 'invalid difficulty' })
    if (!Array.isArray(question.options) || question.options.length < 2) {
      issues.push({ id, issue: 'insufficient options' })
      continue
    }
    const optionIds = question.options.map(option => option.id)
    if (new Set(optionIds).size !== optionIds.length) issues.push({ id, issue: 'duplicate option id' })
    if (question.options.some(option => !option.id?.trim() || !option.text?.trim())) issues.push({ id, issue: 'empty option id or text' })
    if (question.options.filter(option => option.id === question.correctOptionId).length !== 1) {
      issues.push({ id, issue: 'correct option does not resolve exactly once' })
    }
    if (!question.explanation?.trim()) issues.push({ id, issue: 'missing explanation' })
    if (!Array.isArray(question.sourceBasis) || question.sourceBasis.length === 0 ||
        question.sourceBasis.some(source => !source?.trim())) {
      issues.push({ id, issue: 'missing source basis' })
    }
  }
  return issues
}
