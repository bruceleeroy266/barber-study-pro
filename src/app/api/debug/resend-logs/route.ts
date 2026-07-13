import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

export async function GET() {
  const hasResendKey = !!process.env.RESEND_API_KEY
  const toEmail = process.env.EMAIL_TO || 'hello@ascynpro.com'
  const notificationFromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'ASCYN PRO <notifications@ascynpro.com>'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'ASCYN PRO <hello@ascynpro.com>'

  type EmailInfo = {
    id: string
    to: string | string[]
    from: string
    subject: string
    created_at: string
    status?: string | null
    last_event?: string | null
  }

  let recentEmails: EmailInfo[] = []
  let resendError: string | null = null

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const { data: listData, error: listError } = await resend.emails.list()
      if (listError) {
        resendError = listError.message
      } else {
        const emails = (listData?.data ?? []).slice(0, 10)
        for (const email of emails) {
          const { data: detail } = await resend.emails.get(email.id)
          const detailRecord = detail as Record<string, unknown> | null
          recentEmails.push({
            id: email.id,
            to: email.to,
            from: email.from,
            subject: email.subject,
            created_at: email.created_at,
            status: typeof detailRecord?.status === 'string' ? detailRecord.status : null,
            last_event: typeof detailRecord?.last_event === 'string' ? detailRecord.last_event : null,
          })
        }
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
