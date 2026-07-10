import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@ascynpro.com'
const TO_EMAIL = process.env.EMAIL_TO || 'hello@ascynpro.com'

// Diagnostic logging (no values exposed)
console.log('[Email API] Boot', {
  hasKey: !!process.env.RESEND_API_KEY,
  keyLength: process.env.RESEND_API_KEY?.length ?? 0,
  from: FROM_EMAIL,
  to: TO_EMAIL,
  resendInitialized: !!resend,
})

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

    const notificationSubject =
      formType === 'pilot'
        ? 'New ASCYN PRO Pilot Inquiry'
        : 'New ASCYN PRO Contact Form Submission'

    const notificationHtml = `
      <h2>${formType === 'pilot' ? 'Pilot Inquiry' : 'Contact Form Submission'}</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        ${schoolName ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>School Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(schoolName)}</td></tr>` : ''}
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(contactName)}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(email)}</td></tr>
        ${phone ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(phone)}</td></tr>` : ''}
        ${programType ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Program Type</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(programType)}</td></tr>` : ''}
        ${cohortSize ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Estimated Cohort Size</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(cohortSize)}</td></tr>` : ''}
        ${startDate ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Preferred Start Date</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(startDate)}</td></tr>` : ''}
        ${message ? `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(message).replace(/\n/g, '<br/>')}</td></tr>` : ''}
        <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Submitted At</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${timestamp}</td></tr>
      </table>
    `

    const notificationText = [
      formType === 'pilot' ? 'New Pilot Inquiry' : 'New Contact Form Submission',
      schoolName ? `School Name: ${schoolName}` : '',
      `Name: ${contactName}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      programType ? `Program Type: ${programType}` : '',
      cohortSize ? `Estimated Cohort Size: ${cohortSize}` : '',
      startDate ? `Preferred Start Date: ${startDate}` : '',
      message ? `Message: ${message}` : '',
      `Submitted At: ${timestamp}`,
    ]
      .filter(Boolean)
      .join('\n')

    const [notificationResult, confirmationResult] = await Promise.all([
      resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: notificationSubject,
        html: notificationHtml,
        text: notificationText,
      }),
      resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Thank you for contacting ASCYN PRO',
        html: `
          <p>Thank you for contacting ASCYN PRO.</p>
          <p>We have received your request.</p>
          <p>A member of our team will contact you within one business day.</p>
          <p>We appreciate your interest in helping students succeed on their licensing exams.</p>
          <p>— ASCYN PRO</p>
        `,
        text: `Thank you for contacting ASCYN PRO.\n\nWe have received your request.\n\nA member of our team will contact you within one business day.\n\nWe appreciate your interest in helping students succeed on their licensing exams.\n\n— ASCYN PRO`,
      }),
    ])

    console.log('[Email API] Resend results', {
      notificationId: notificationResult.data?.id ?? null,
      notificationError: notificationResult.error ?? null,
      confirmationId: confirmationResult.data?.id ?? null,
      confirmationError: confirmationResult.error ?? null,
    })

    if (notificationResult.error || confirmationResult.error) {
      console.error('[Email API] Resend error:', notificationResult.error, confirmationResult.error)
      return NextResponse.json(
        { error: 'We could not send your message. Please try again in a moment.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        ids: {
          notification: notificationResult.data?.id ?? null,
          confirmation: confirmationResult.data?.id ?? null,
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('[Email API] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
