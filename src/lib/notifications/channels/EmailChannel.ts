import { Resend } from 'resend'
import { OwnerNotification } from '../types'
import { NotificationChannel, ChannelSendResult } from './NotificationChannel'
import { buildOwnerNotificationEmail } from '../templates/ownerNotificationEmail'

export interface EmailChannelConfig {
  resend: Resend | null
  fromEmail: string
  ownerEmail: string
}

export class EmailChannel implements NotificationChannel {
  readonly name = 'email'

  constructor(private config: EmailChannelConfig) {}

  async send(notification: OwnerNotification): Promise<ChannelSendResult> {
    const { resend, fromEmail, ownerEmail } = this.config

    if (!resend) {
      return { success: false, error: 'Resend client is not configured' }
    }

    const payload = notification.payload
    const replyTo = payload.email && typeof payload.email === 'string' ? payload.email : undefined

    const { subject, html, text } = buildOwnerNotificationEmail(
      notification.type,
      payload,
      replyTo
    )

    try {
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        ...(replyTo ? { replyTo } : {}),
        subject,
        html,
        text,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown email error'
      return { success: false, error: message }
    }
  }
}
