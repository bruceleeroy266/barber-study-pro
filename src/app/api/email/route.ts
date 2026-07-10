import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ASCYN PRO <hello@ascynpro.com>'
const NOTIFICATION_FROM_EMAIL = process.env.NOTIFICATION_FROM_EMAIL || 'ASCYN PRO <notifications@ascynpro.com>'
const TO_EMAIL = process.env.EMAIL_TO || 'hello@ascynpro.com'
const LOGO_URL = 'https://ascynpro.com/logo.svg'

// Lightweight in-memory rate limiter. Persists only for the lifetime of the
// serverless instance, which is enough to stop rapid duplicate submissions.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getRateLimitKey(ip: string, email: string) {
  return `${ip}:${email.toLowerCase().trim()}`
}

function isRateLimited(ip: string, email: string) {
  const key = getRateLimitKey(ip, email)
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return false
  }
  entry.count += 1
  return entry.count > 5
}

function sanitize(value: unknown): string {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function formatTimestamp() {
  return new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function emailWrapper(content: string, previewText: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(previewText)}</title>
</head>
<body style="margin:0; padding:0; background-color:#0a0a0a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#0a0a0a">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#111111; border:1px solid #2a2a2a; border-radius:12px; overflow:hidden;">
          <tr>
            <td align="center" style="padding:32px 24px 24px; border-bottom:1px solid #2a2a2a;">
              <img src="${LOGO_URL}" alt="ASCYN PRO" width="160" style="display:block; max-width:160px; height:auto;" />
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
</html>
  `.trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot — if filled, silently accept but do nothing
    if (sanitize(body.website).length > 0) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const formType = sanitize(body.formType) as 'pilot' | 'contact'
    const schoolName = sanitize(body.schoolName)
    const contactName = sanitize(body.contactName || body.name)
    const email = sanitize(body.email).toLowerCase()
    const phone = sanitize(body.phone)
    const programType = sanitize(body.programType)
    const cohortSize = sanitize(body.cohortSize)
    const startDate = sanitize(body.startDate)
    const message = sanitize(body.message)

    if (!['pilot', 'contact'].includes(formType)) {
      return NextResponse.json({ error: 'Invalid form type.' }, { status: 400 })
    }

    if (!contactName || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (formType === 'pilot' && (!schoolName || !programType)) {
      return NextResponse.json(
        { error: 'School name and program type are required.' },
        { status: 400 }
      )
    }

    if (formType === 'contact' && !message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }

    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'

    if (isRateLimited(ip, email)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few minutes and try again.' },
        { status: 429 }
      )
    }

    if (!resend) {
      console.error('[Email API] RESEND_API_KEY is not configured.')
      return NextResponse.json(
        { error: 'Email service is not configured. Please try again later.' },
        { status: 503 }
      )
    }

    const timestamp = formatTimestamp()
    const isPilot = formType === 'pilot'
    const isBarbering = programType === 'Barbering'

    // ── INTERNAL NOTIFICATION ───────────────────────────────────────────────
    const notificationSubject = isPilot
      ? '🚨 New ASCYN PRO Pilot Inquiry'
      : 'New ASCYN PRO Contact Form Submission'

    const notificationRows = [
      { label: 'School Name', value: schoolName },
      { label: 'Contact Name', value: contactName },
      { label: 'Email', value: email },
      { label: 'Phone Number', value: phone || 'Not provided' },
      { label: 'Program Selected', value: programType || 'N/A' },
      { label: 'Estimated Cohort Size', value: cohortSize || 'Not provided' },
      { label: 'Preferred Start Date', value: startDate || 'Not provided' },
      { label: 'Message / Notes', value: message || 'None' },
      { label: 'Date & Time Submitted', value: timestamp },
    ]

    const notificationHtml = emailWrapper(
      `
      <h1 style="margin:0 0 24px; color:#D4AF37; font-size:22px; font-weight:bold;">🚨 New ASCYN PRO Pilot Inquiry</h1>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        ${notificationRows
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
      <p style="margin:24px 0 0; color:#888888; font-size:13px;">
        Reply directly to this email to respond to ${escapeHtml(contactName)}.
      </p>
      `,
      notificationSubject
    )

    const notificationText = [
      '🚨 New ASCYN PRO Pilot Inquiry',
      '',
      ...notificationRows.map((row) => `${row.label}: ${row.value}`),
      '',
      `Reply to respond to ${contactName} at ${email}.`,
    ].join('\n')

    // ── VISITOR CONFIRMATION ────────────────────────────────────────────────
    const confirmationSubject = 'Thank you for contacting ASCYN PRO'

    let confirmationBodyHtml = ''
    let confirmationBodyText = ''

    if (isPilot) {
      const programLine = isBarbering
        ? 'We have received your <strong>Barbering</strong> pilot request successfully.'
        : `We have received your <strong>${escapeHtml(programType)}</strong> pilot request successfully.`

      const followUpLine = isBarbering
        ? 'Because ASCYN PRO is currently onboarding pilot partners, our team will review your submission and contact you within <strong>10 business days</strong>.'
        : 'Your program has been added to our early access notification list. We&apos;ll notify you when it becomes available.'

      confirmationBodyHtml = `
        <p style="margin:0 0 16px;">Thank you for contacting ASCYN PRO.</p>
        <p style="margin:0 0 16px;">${programLine}</p>
        <p style="margin:0 0 16px;">${followUpLine}</p>
        <p style="margin:0 0 16px;">We appreciate your interest in helping students succeed on their licensing exams.</p>
        <p style="margin:0;">— The ASCYN PRO Team</p>
      `

      const programLineText = isBarbering
        ? 'We have received your Barbering pilot request successfully.'
        : `We have received your ${programType} pilot request successfully.`

      const followUpLineText = isBarbering
        ? 'Because ASCYN PRO is currently onboarding pilot partners, our team will review your submission and contact you within 10 business days.'
        : 'Your program has been added to our early access notification list. We\'ll notify you when it becomes available.'

      confirmationBodyText = [
        'Thank you for contacting ASCYN PRO.',
        '',
        programLineText,
        '',
        followUpLineText,
        '',
        'We appreciate your interest in helping students succeed on their licensing exams.',
        '',
        '— The ASCYN PRO Team',
      ].join('\n')
    } else {
      confirmationBodyHtml = `
        <p style="margin:0 0 16px;">Thank you for contacting ASCYN PRO.</p>
        <p style="margin:0 0 16px;">We have received your message and a member of our team will contact you within one business day.</p>
        <p style="margin:0 0 16px;">We appreciate your interest in helping students succeed on their licensing exams.</p>
        <p style="margin:0;">— The ASCYN PRO Team</p>
      `
      confirmationBodyText = [
        'Thank you for contacting ASCYN PRO.',
        '',
        'We have received your message and a member of our team will contact you within one business day.',
        '',
        'We appreciate your interest in helping students succeed on their licensing exams.',
        '',
        '— The ASCYN PRO Team',
      ].join('\n')
    }

    const confirmationHtml = emailWrapper(confirmationBodyHtml, confirmationSubject)

    const [notificationResult, confirmationResult] = await Promise.all([
      resend.emails.send({
        from: NOTIFICATION_FROM_EMAIL,
        to: TO_EMAIL,
        replyTo: email,
        subject: notificationSubject,
        html: notificationHtml,
        text: notificationText,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: confirmationSubject,
        html: confirmationHtml,
        text: confirmationBodyText,
      }),
    ])

    if (notificationResult.error || confirmationResult.error) {
      console.error('[Email API] Resend error:', notificationResult.error, confirmationResult.error)
      return NextResponse.json(
        { error: 'We could not send your message. Please try again in a moment.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[Email API] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
