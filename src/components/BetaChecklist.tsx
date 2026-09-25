'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/demo-helpers'
import {
  submitBetaFeedback,
  type BetaFeedbackCategory,
  type BetaFeedbackSeverity,
  type BetaFeedbackRecord,
} from '@/app/(dashboard)/dashboard/beta-checklist/actions'
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Bug,
  Lightbulb,
  MessageSquare,
  FileText,
  Send,
  RotateCcw,
} from 'lucide-react'
import { Button, Card, Badge, ProgressBar, Input, Textarea, Select } from '@/components/ui'

const AGREEMENT_VERSION = 'v1.0'
const CHECKLIST_VERSION = 'v2.0'
const LOCAL_STORAGE_KEY = 'ascyn_beta_checklist_v2'

export interface ChecklistItem {
  id: string
  label: string
  description?: string
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'accept-invitation',
    label: 'Accept ASCYN PRO invitation',
    description: 'Open the invitation email and launch the ASCYN PRO account setup flow.',
  },
  {
    id: 'set-password',
    label: 'Create or set password',
    description: 'Create a password from the invitation or setup link and confirm the password-update flow completes successfully.',
  },
  {
    id: 'pending-approval',
    label: 'Confirm pending approval behavior',
    description: 'Before approval, confirm the account is blocked from protected areas and shows the pending-approval message without redirect loops.',
  },
  {
    id: 'approval-enablement',
    label: 'Confirm account approval and enablement',
    description: 'After an administrator approves and enables the account, confirm access is granted normally.',
  },
  {
    id: 'login-logout',
    label: 'Log in and log out',
    description: 'Confirm login succeeds and logout returns you to a clean login page.',
  },
  {
    id: 'accept-beta-agreement',
    label: 'Accept Beta Agreement',
    description: 'Review and accept the current ASCYN PRO Beta Tester Agreement.',
  },
  {
    id: 'dashboard',
    label: 'Load Student Dashboard',
    description: 'Confirm the Student Dashboard loads and shows the correct student identity, chapter status, and progress overview.',
  },
  {
    id: 'current-chapter',
    label: 'Open assigned or current chapter',
    description: 'Open the chapter assigned to you or the chapter currently shown on the dashboard.',
  },
  {
    id: 'flashcards',
    label: 'Complete flashcards',
    description: 'Work through the chapter flashcard deck and confirm completion is recorded.',
  },
  {
    id: 'chapter-assessment',
    label: 'Complete chapter assessment',
    description: 'Take the chapter assessment and confirm the result is saved correctly.',
  },
  {
    id: 'missed-questions',
    label: 'Verify missed-question tracking',
    description: 'Confirm missed questions appear in Missed Questions and support the expected review/remediation flow.',
  },
  {
    id: 'progress-updates',
    label: 'Verify progress updates correctly',
    description: 'Confirm chapter and overall progress update according to the current ASCYN PRO weighting rules.',
  },
  {
    id: 'progress-persist',
    label: 'Verify progress persists after logout/login',
    description: 'Log out and back in, then confirm saved chapter progress and assessment results are still present.',
  },
  {
    id: 'my-progress',
    label: 'Open My Progress',
    description: 'Open My Progress and confirm the student progress view loads correctly.',
  },
  {
    id: 'grades',
    label: 'Open Grades',
    description: 'Open Grades and confirm available scores and results display correctly.',
  },
  {
    id: 'assessments',
    label: 'Open Assessments',
    description: 'Open Assessments and confirm assigned or available assessments load correctly.',
  },
  {
    id: 'compliance',
    label: 'Open Compliance',
    description: 'Open Compliance and confirm the page loads without errors.',
  },
  {
    id: 'messages',
    label: 'Open Messages',
    description: 'Open Messages and confirm the student messaging view loads correctly.',
  },
  {
    id: 'submit-feedback',
    label: 'Submit tester feedback',
    description: 'Use the form below to report a bug, UX issue, content issue, feature request, or observation.',
  },
  {
    id: 'mobile-viewport',
    label: 'Test on mobile viewport',
    description: 'Open ASCYN PRO on a phone or narrow browser window and confirm the Student experience remains usable.',
  },
]

const CATEGORIES: { value: BetaFeedbackCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'bug', label: 'Bug', icon: <Bug className="w-4 h-4" /> },
  { value: 'ux', label: 'UX / Design', icon: <MessageSquare className="w-4 h-4" /> },
  { value: 'feature', label: 'Feature Request', icon: <Lightbulb className="w-4 h-4" /> },
  { value: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
  { value: 'other', label: 'Other', icon: <MessageSquare className="w-4 h-4" /> },
]

const SEVERITIES: { value: BetaFeedbackSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-silver/20 text-silver border-silver/30' },
  { value: 'medium', label: 'Medium', color: 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30' },
  { value: 'high', label: 'High', color: 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30' },
  { value: 'critical', label: 'Critical', color: 'bg-silver/20 text-silver border-silver/30' },
]

export interface BetaChecklistProps {
  initialFeedback: BetaFeedbackRecord[]
}

export default function BetaChecklist({ initialFeedback }: BetaChecklistProps) {
  const router = useRouter()
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  const [selectedItem, setSelectedItem] = useState<string>('')
  const [category, setCategory] = useState<BetaFeedbackCategory>('bug')
  const [severity, setSeverity] = useState<BetaFeedbackSeverity>('medium')
  const [message, setMessage] = useState('')
  const [feedbackHistory, setFeedbackHistory] = useState<BetaFeedbackRecord[]>(initialFeedback)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed.completed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCompleted(new Set(parsed.completed))
        }
      }
    } catch {
      // ignore localStorage errors
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ completed: Array.from(completed), version: CHECKLIST_VERSION })
    )
  }, [completed, loaded])

  const toggleItem = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const resetProgress = () => {
    if (typeof window !== 'undefined' && window.confirm('Reset all checklist progress?')) {
      setCompleted(new Set())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)

    const trimmed = message.trim()
    if (trimmed.length < 5) {
      setStatus({ type: 'error', text: 'Please write at least 5 characters.' })
      return
    }

    startTransition(async () => {
      const result = await submitBetaFeedback({
        checklistItemId: selectedItem || undefined,
        category,
        severity,
        message: trimmed,
      })

      if (result.success) {
        setMessage('')
        setSelectedItem('')
        setStatus({ type: 'success', text: 'Feedback submitted. Thank you!' })
        // Mark submit-feedback checklist item complete.
        setCompleted((prev) => {
          const next = new Set(prev)
          next.add('submit-feedback')
          return next
        })
        // Refresh feedback history from server.
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('beta_feedback')
            .select('id, checklist_item_id, category, severity, message, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50)
          if (data) {
            setFeedbackHistory(data as BetaFeedbackRecord[])
          }
        }
      } else {
        setStatus({ type: 'error', text: result.error || 'Failed to submit feedback.' })
      }
    })
  }

  const progress = Math.round((completed.size / CHECKLIST_ITEMS.length) * 100)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Beta Tester Checklist</h1>
        <p className="text-silver">
          Work through each item and submit feedback as you go.
        </p>
      </div>

      {/* Progress */}
      <Card variant="default" padding="md" className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">Your progress</span>
          <span className="text-[var(--color-brand-gold)] font-bold">{progress}%</span>
        </div>
        <ProgressBar value={progress} variant="default" size="lg" showLabel={false} />
        <p className="text-silver text-sm mt-4">
          {completed.size} of {CHECKLIST_ITEMS.length} items completed
        </p>
      </Card>

      {/* Checklist */}
      <Card variant="default" padding="md" className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[var(--color-brand-gold)]" />
            Tasks
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetProgress}
            className="text-sm"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        <div className="space-y-3">
          {CHECKLIST_ITEMS.map((item) => {
            const isComplete = completed.has(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-4 ${
                  isComplete
                    ? 'bg-[var(--color-brand-gold)]/10 border-[var(--color-brand-gold)]/30'
                    : 'bg-graphite/50 border-[var(--color-border-secondary)] hover:border-silver-gray'
                }`}
                type="button"
              >
                {isComplete ? (
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-brand-gold)] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-6 h-6 text-silver-gray flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isComplete ? 'text-white line-through opacity-70' : 'text-white'}`}>
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-silver text-sm mt-1">{item.description}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Feedback Form */}
      <Card variant="default" padding="md" className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[var(--color-brand-gold)]" />
          Submit Feedback
        </h2>
        <p className="text-silver text-sm mb-6">
          Report bugs, suggest improvements, or share observations. Your feedback goes directly to the ASCYN PRO team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="feedback-item" className="block text-sm font-medium text-silver mb-1">
              Related checklist item (optional)
            </label>
            <Select
              id="feedback-item"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              options={[
                { value: '', label: 'General feedback' },
                ...CHECKLIST_ITEMS.map((item) => ({ value: item.id, label: item.label }))
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-silver mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={category === cat.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCategory(cat.value)}
                    type="button"
                  >
                    {cat.icon}
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-silver mb-2">Severity</label>
              <div className="flex flex-wrap gap-2">
                {SEVERITIES.map((sev) => (
                  <Button
                    key={sev.value}
                    variant={severity === sev.value ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setSeverity(sev.value)}
                    type="button"
                  >
                    {sev.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="feedback-message" className="block text-sm font-medium text-silver mb-1">
              Message
            </label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe what happened, what you expected, and steps to reproduce if applicable."
              required
            />
          </div>

          {status && (
            <p
              className={`text-sm ${status.type === 'success' ? 'text-gold' : 'text-silver'}`}
              role="status"
            >
              {status.text}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
          >
            <Send className="w-5 h-5 mr-2" />
            {isPending ? 'Submitting…' : 'Submit Feedback'}
          </Button>
        </form>
      </Card>

      {/* Feedback History */}
      {feedbackHistory.length > 0 && (
        <Card variant="default" padding="md">
          <h2 className="text-xl font-semibold text-white mb-4">Your Recent Feedback</h2>
          <div className="space-y-4">
            {feedbackHistory.map((item) => (
              <Card key={item.id} variant="ghost" padding="sm">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={item.severity === 'critical' || item.severity === 'high' ? 'error' : item.severity === 'medium' ? 'warning' : 'default'} size="sm">
                    {item.severity}
                  </Badge>
                  <span className="text-xs text-silver uppercase tracking-wider">{item.category}</span>
                  {item.checklist_item_id && (
                    <span className="text-xs text-silver-gray">
                      {CHECKLIST_ITEMS.find((i) => i.id === item.checklist_item_id)?.label || item.checklist_item_id}
                    </span>
                  )}
                </div>
                <p className="text-light-gray text-sm whitespace-pre-wrap">{item.message}</p>
                <p className="text-silver-gray text-xs mt-2">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
