'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'
import { NotificationService } from '@/lib/notifications/NotificationService'
import type { OwnerNotificationPayload } from '@/lib/notifications/types'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

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
    const { data: inserted, error } = await supabase
      .from('beta_feedback')
      .insert({
        user_id: user.id,
        checklist_item_id: input.checklistItemId || null,
        category: input.category,
        severity: input.severity,
        message,
      })
      .select('id')
      .single()

    if (error) {
      // Fail gracefully if the table does not exist yet (migration not applied).
      if (error.message?.includes('relation') || error.message?.includes('does not exist') || error.code === '42P01') {
        return { success: false, error: 'Feedback storage is not ready. Please ask an admin to apply the latest migration.' }
      }
      return { success: false, error: error.message }
    }

    try {
      const notificationService = NotificationService.createDefault(resend)
      const notificationPayload: OwnerNotificationPayload = {
        timeSubmitted: new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
        contactName:
          (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim())
            ? user.user_metadata.full_name.trim()
            : user.email || 'Beta tester',
        email: user.email || null,
        feedbackCategory: input.category,
        feedbackSeverity: input.severity,
        checklistItemId: input.checklistItemId || null,
        message,
      }

      const notificationResult = await notificationService.notifyOwner(
        'beta_feedback',
        notificationPayload,
        { sourceType: 'beta_feedback', sourceId: inserted?.id },
      )

      if (!notificationResult.success) {
        console.error('[BetaFeedback] Owner notification failed:', notificationResult.error)
      }
    } catch (notificationError) {
      console.error('[BetaFeedback] Owner notification error:', notificationError)
    }

    revalidatePath('/dashboard/beta-checklist')
    revalidatePath('/admin/beta-feedback')
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
