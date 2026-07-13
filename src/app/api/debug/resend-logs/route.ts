import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET() {
  const hasResendKey = !!process.env.RESEND_API_KEY
  const toEmail = process.env.EMAIL_TO || 'hello@ascynpro.com'
  const notificationFromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'ASCYN PRO <notifications@ascynpro.com>'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'ASCYN PRO <hello@ascynpro.com>'

  let recentEmails: Array<{
    id: string
    to: string | string[]
    from: string
    subject: string
    created_at: string
    status?: string
  }> = []
  let resendError: string | null = null

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { data, error } = await resend.emails.list()
      if (error) {
        resendError = error.message
      } else {
        recentEmails = (data?.data ?? []).slice(0, 20).map((email) => ({
          id: email.id,
          to: email.to,
          from: email.from,
          subject: email.subject,
          created_at: email.created_at,
        }))
      }
    } catch (err) {
      resendError = err instanceof Error ? err.message : String(err)
    }
  }

  return NextResponse.json({
    hasResendKey,
    toEmail,
    notificationFromEmail,
    fromEmail,
    recentEmails,
    resendError,
  })
}
