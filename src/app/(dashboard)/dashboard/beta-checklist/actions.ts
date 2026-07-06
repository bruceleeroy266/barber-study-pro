'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export type BetaFeedbackCategory = 'bug' | 'feature' | 'ux' | 'content' | 'other'
export type BetaFeedbackSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface BetaFeedbackInput {
  checklistItemId?: string
  category: BetaFeedbackCategory
  severity: BetaFeedbackSeverity
  message: string
}

export interface BetaFeedbackResult {
  success: boolean
  error?: string
}

export async function submitBetaFeedback(input: BetaFeedbackInput): Promise<BetaFeedbackResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in to submit feedback.' }
  }

  const message = input.message?.trim()
  if (!message || message.length < 5) {
    return { success: false, error: 'Please provide a feedback message of at least 5 characters.' }
  }

  const validCategories: BetaFeedbackCategory[] = ['bug', 'feature', 'ux', 'content', 'other']
  const validSeverities: BetaFeedbackSeverity[] = ['low', 'medium', 'high', 'critical']

  if (!validCategories.includes(input.category)) {
    return { success: false, error: 'Invalid feedback category.' }
  }

  if (!validSeverities.includes(input.severity)) {
    return { success: false, error: 'Invalid severity level.' }
  }

  try {
    const { error } = await supabase
      .from('beta_feedback')
      .insert({
        user_id: user.id,
        checklist_item_id: input.checklistItemId || null,
        category: input.category,
        severity: input.severity,
        message,
      })

    if (error) {
      // Fail gracefully if the table does not exist yet (migration not applied).
      if (error.message?.includes('relation') || error.message?.includes('does not exist') || error.code === '42P01') {
        return { success: false, error: 'Feedback storage is not ready. Please ask an admin to apply the latest migration.' }
      }
      return { success: false, error: error.message }
    }

    revalidatePath('/dashboard/beta-checklist')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to submit feedback. Please try again.',
    }
  }
}

export interface BetaFeedbackRecord {
  id: string
  checklist_item_id: string | null
  category: BetaFeedbackCategory
  severity: BetaFeedbackSeverity
  message: string
  created_at: string
}

export interface BetaFeedbackHistoryResult {
  feedback: BetaFeedbackRecord[]
  error?: string
}

export async function getMyBetaFeedback(): Promise<BetaFeedbackHistoryResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { feedback: [], error: 'Unauthorized' }
  }

  try {
    const { data, error } = await supabase
      .from('beta_feedback')
      .select('id, checklist_item_id, category, severity, message, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      if (error.message?.includes('relation') || error.message?.includes('does not exist') || error.code === '42P01') {
        return { feedback: [], error: undefined }
      }
      return { feedback: [], error: error.message }
    }

    return { feedback: (data ?? []) as BetaFeedbackRecord[] }
  } catch (err) {
    return {
      feedback: [],
      error: err instanceof Error ? err.message : 'Failed to load feedback history.',
    }
  }
}
