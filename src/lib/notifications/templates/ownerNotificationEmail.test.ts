import { describe, expect, it } from 'vitest'
import { buildOwnerNotificationEmail, getOwnerNotificationSubject } from './ownerNotificationEmail'

describe('beta feedback owner notification', () => {
  it('uses a dedicated subject and includes triage details', () => {
    const payload = {
      timeSubmitted: 'Sep 25, 2026, 8:15 AM',
      contactName: 'Test Student',
      email: 'student@example.com',
      feedbackCategory: 'bug',
      feedbackSeverity: 'high',
      checklistItemId: 'progress-updates',
      message: 'Progress did not refresh after the assessment.',
    }

    expect(getOwnerNotificationSubject('beta_feedback')).toContain('Beta Tester Feedback')

    const email = buildOwnerNotificationEmail('beta_feedback', payload, payload.email)

    expect(email.subject).toContain('Beta Tester Feedback')
    expect(email.text).toContain('Feedback Category: bug')
    expect(email.text).toContain('Feedback Severity: high')
    expect(email.text).toContain('Checklist Item: progress-updates')
    expect(email.text).toContain(payload.message)
    expect(email.html).toContain('student@example.com')
  })
})
