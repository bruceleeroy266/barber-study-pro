'use server'

import { createServiceRoleClient } from '@/lib/supabase-service-role'
import { Resend } from 'resend'
import { revalidatePath } from 'next/cache'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ASCYN PRO <hello@ascynpro.com>'

export async function sendPilotInquiryReply(
  inquiryId: string,
  subject: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resend) {
      return { success: false, error: 'Resend is not configured.' }
    }

    if (!subject.trim() || !message.trim()) {
      return { success: false, error: 'Subject and message are required.' }
    }

    const supabase = createServiceRoleClient()

    const { data: inquiry, error: fetchError } = await supabase
      .from('pilot_inquiries')
      .select('id, email, contact_name, school_name')
      .eq('id', inquiryId)
      .single()

    if (fetchError || !inquiry) {
      return { success: false, error: fetchError?.message ?? 'Inquiry not found.' }
    }

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a; color:#ffffff; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0a0a0a">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#111111; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden;">
          <tr>
            <td style="padding:32px 24px; color:#ffffff; font-size:16px; line-height:1.6;">
              <p style="margin:0 0 16px;">Hello ${inquiry.contact_name || 'there'},</p>
              <div style="margin:0 0 16px; white-space:pre-wrap;">${message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
              <p style="margin:24px 0 0; color:#888888; font-size:13px;">
                — The ASCYN PRO Team
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim()

    const text = message

    const { error: sendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: inquiry.email,
      subject,
      html,
      text,
    })

    if (sendError) {
      return { success: false, error: sendError.message }
    }

    const { error: updateError } = await supabase
      .from('pilot_inquiries')
      .update({
        status: 'contacted',
        notes: `Replied on ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}.\nSubject: ${subject}\n\n${message}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', inquiryId)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    revalidatePath('/admin/pilot-inquiries')

    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}
