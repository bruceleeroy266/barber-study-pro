import { createHash } from 'crypto'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
import {
  OwnerNotificationType,
  OwnerNotificationPayload,
  NotificationResult,
  OwnerNotification,
} from './types'
import { NotificationChannel } from './channels/NotificationChannel'
import { EmailChannel } from './channels/EmailChannel'
import { Resend } from 'resend'

const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || 'gabriel@ascynpro.com'
const FROM_EMAIL =
  process.env.NOTIFICATION_FROM_EMAIL ||
  process.env.RESEND_FROM_EMAIL ||
  'ASCYN PRO <hello@ascynpro.com>'

function normalizePayload(payload: OwnerNotificationPayload): string {
  const sorted = Object.keys(payload)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = payload[key]
      return acc
    }, {})
  return JSON.stringify(sorted)
}

function computeDedupHash(type: OwnerNotificationType, payload: OwnerNotificationPayload): string {
  return createHash('sha256').update(`${type}:${normalizePayload(payload)}`).digest('hex')
}

export interface NotifyOwnerOptions {
  sourceType?: string
  sourceId?: string
  recipientEmail?: string
}

export class NotificationService {
  private channels: NotificationChannel[]

  constructor(channels: NotificationChannel[]) {
    this.channels = channels
  }

  static createDefault(resend?: Resend | null): NotificationService {
    return new NotificationService([
      new EmailChannel({
        resend: resend ?? null,
        fromEmail: FROM_EMAIL,
        ownerEmail: OWNER_EMAIL,
      }),
    ])
  }

  async notifyOwner(
    type: OwnerNotificationType,
    payload: OwnerNotificationPayload,
    options: NotifyOwnerOptions = {}
  ): Promise<NotificationResult> {
    const supabase = createServiceRoleClient()
    const dedupHash = computeDedupHash(type, payload)
    const recipientEmail = options.recipientEmail || OWNER_EMAIL

    // Persist first. The unique constraint on dedup_hash prevents duplicate
    // notification emails for identical submissions.
    const { data: inserted, error: insertError } = await supabase
      .from('owner_notifications')
      .insert({
        type,
        source_type: options.sourceType || null,
        source_id: options.sourceId || null,
        payload,
        dedup_hash: dedupHash,
        recipient_email: recipientEmail,
        status: 'unread',
        email_status: 'pending',
      })
      .select('*')
      .single()

    if (insertError) {
      // 23505 = unique violation on dedup_hash
      if (insertError.code === '23505') {
        return { success: true, duplicate: true }
      }
      return { success: false, error: insertError.message }
    }

    const notification = inserted as OwnerNotification
    const channelResults = await Promise.all(
      this.channels.map((channel) => channel.send(notification))
    )

    const failed = channelResults.filter((r) => !r.success)
    const emailError = failed.find((r) => r.error)?.error || null

    const { error: updateError } = await supabase
      .from('owner_notifications')
      .update({
        email_status: failed.length === 0 ? 'sent' : 'failed',
        email_error: emailError,
        email_sent_at: failed.length === 0 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', notification.id)

    if (updateError) {
      console.error('[NotificationService] Failed to update notification status:', updateError)
    }

    if (failed.length > 0) {
      return {
        success: false,
        notificationId: notification.id,
        error: emailError || 'One or more notification channels failed',
      }
    }

    return { success: true, notificationId: notification.id }
  }
}
