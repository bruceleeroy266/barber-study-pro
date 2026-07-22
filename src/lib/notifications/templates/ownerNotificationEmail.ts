import { OwnerNotificationType, OwnerNotificationPayload } from '../types'

const SUBJECTS: Record<OwnerNotificationType, string> = {
  pilot_request: '🚨 New ASCYN PRO Pilot School Request',
  contact_submission: '📬 New ASCYN PRO Contact Form Submission',
  demo_request: '🎓 New ASCYN PRO Demo Request',
  student_registration: '🎓 New Student Registration',
  instructor_registration: '👨‍🏫 New Instructor Registration',
  school_approval: '🏫 School Approval',
  email_delivery_failure: '⚠️ Failed Email Delivery',
  system_error: '🚨 System Error',
}

export function getOwnerNotificationSubject(type: OwnerNotificationType): string {
  return SUBJECTS[type] ?? 'New ASCYN PRO Notification'
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatValue(value: string | null | undefined): string {
  if (value === null || value === undefined || value.trim() === '') return 'Not provided'
  return value
}

function formatRows(payload: OwnerNotificationPayload): { label: string; value: string }[] {
  return [
    { label: 'Time Submitted', value: payload.timeSubmitted },
    { label: 'School Name', value: payload.schoolName },
    { label: 'Contact Name', value: payload.contactName },
    { label: 'Email', value: payload.email },
    { label: 'Phone', value: payload.phone },
    { label: 'Student Count', value: payload.studentCount },
    { label: 'State', value: payload.state },
    { label: 'Program Type', value: payload.programType },
    { label: 'Message', value: payload.message },
  ].map((row) => ({ label: row.label, value: formatValue(row.value) }))
}

function emailWrapper(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(previewText)}</title>
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0a0a0a">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#111111; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden;">
          <tr>
            <td align="center" style="padding:32px 24px 24px; border-bottom:1px solid #2a2a2a;">
              <img src="https://ascynpro.com/logo.svg" alt="ASCYN PRO" width="160" style="display:block; max-width:160px; height:auto;" />
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px; color:#ffffff; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:1.6;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:24px; border-top:1px solid #2a2a2a; color:#888888; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.5; text-align:center;">
              © 2026 ASCYN PRO. Built for future licensed professionals.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}

export function buildOwnerNotificationEmail(
  type: OwnerNotificationType,
  payload: OwnerNotificationPayload,
  replyTo?: string | null
): { subject: string; html: string; text: string } {
  const subject = getOwnerNotificationSubject(type)
  const rows = formatRows(payload)

  const html = emailWrapper(
    `
      <h1 style="margin:0 0 24px; color:#D4AF37; font-size:22px; font-weight:bold;">${escapeHtml(subject)}</h1>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        ${rows
          .map(
            (row) => `
          <tr>
            <td style="padding:12px 16px; border-bottom:1px solid #2a2a2a; color:#D4AF37; font-weight:bold; width:40%; font-size:14px; vertical-align:top;">${escapeHtml(row.label)}</td>
            <td style="padding:12px 16px; border-bottom:1px solid #2a2a2a; color:#ffffff; font-size:14px; vertical-align:top;">${escapeHtml(row.value).replace(/\n/g, '<br/>')}</td>
          </tr>
        `
          )
          .join('')}
      </table>
      ${replyTo ? `<p style="margin:24px 0 0; color:#888888; font-size:13px;">Reply directly to this email to respond to ${escapeHtml(payload.contactName || replyTo)}.</p>` : ''}
    `,
    subject
  )

  const text = [
    subject,
    '',
    ...rows.map((row) => `${row.label}: ${row.value}`),
    ...(replyTo ? [``, `Reply to respond to ${payload.contactName || replyTo} at ${replyTo}.`] : []),
  ].join('\n')

  return { subject, html, text }
}
