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

const AGREEMENT_VERSION = 'v1.0'
const LOCAL_STORAGE_KEY = 'ascyn_beta_checklist_v1'

export interface ChecklistItem {
  id: string
  label: string
  description?: string
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'signup',
    label: 'Sign up and verify email',
    description: 'Create a student account and complete email verification.',
  },
  {
    id: 'login-logout',
    label: 'Log in and log out',
    description: 'Confirm login works and logout returns you to the login page.',
  },
  {
    id: 'dashboard',
    label: 'View dashboard',
    description: 'Dashboard loads and shows your progress overview.',
  },
  {
    id: 'chapter-16',
    label: 'Open Chapter 16',
    description: 'Navigate to the chapter list and open Chapter 16.',
  },
  {
    id: 'flashcards',
    label: 'Complete flashcards',
    description: 'Work through the Chapter 16 flashcard deck.',
  },
  {
    id: 'flashcard-progress',
    label: 'Flashcards set progress to 50%',
    description: 'After completing flashcards, progress should show 50%.',
  },
  {
    id: 'quiz-fail',
    label: 'Failed quiz does NOT set progress to 100%',
    description: 'Fail the quiz and confirm progress stays at 50%.',
  },
  {
    id: 'quiz-pass',
    label: 'Passed quiz DOES set progress to 100%',
    description: 'Pass the quiz and confirm progress reaches 100%.',
  },
  {
    id: 'progress-persist',
    label: 'Progress persists after logout/login',
    description: 'Log out and back in — your progress should still be there.',
  },
  {
    id: 'beta-agreement',
    label: 'Load Beta Agreement page',
    description: 'The agreement page loads without errors.',
  },
  {
    id: 'accept-beta-agreement',
    label: 'Accept Beta Agreement',
    description: 'Enter your name and email, then accept the agreement.',
  },
  {
    id: 'beta-checklist',
    label: 'Load Beta Checklist page',
    description: 'This checklist page loads correctly.',
  },
  {
    id: 'submit-feedback',
    label: 'Submit feedback',
    description: 'Use the form below to report a bug, idea, or observation.',
  },
  {
    id: 'mobile-viewport',
    label: 'Test on mobile viewport',
    description: 'Open the site on a phone or narrow browser window.',
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
  { value: 'low', label: 'Low', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { value: 'high', label: 'High', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
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
      JSON.stringify({ completed: Array.from(completed), version: AGREEMENT_VERSION })
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
        <p className="text-gray-400">
          Work through each item and submit feedback as you go.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">Your progress</span>
          <span className="text-[#D4AF37] font-bold">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-[#D4AF37] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm">
          {completed.size} of {CHECKLIST_ITEMS.length} items completed
        </p>
      </div>

      {/* Checklist */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#D4AF37]" />
            Tasks
          </h2>
          <button
            onClick={resetProgress}
            className="text-sm text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
            type="button"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
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
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
                type="button"
              >
                {isComplete ? (
                  <CheckCircle2 className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${isComplete ? 'text-white line-through opacity-70' : 'text-white'}`}>
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#D4AF37]" />
          Submit Feedback
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Report bugs, suggest improvements, or share observations. Your feedback goes directly to the ASCYN PRO team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="feedback-item" className="block text-sm font-medium text-gray-400 mb-1">
              Related checklist item (optional)
            </label>
            <select
              id="feedback-item"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
            >
              <option value="">General feedback</option>
              {CHECKLIST_ITEMS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      category === cat.value
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Severity</label>
              <div className="flex flex-wrap gap-2">
                {SEVERITIES.map((sev) => (
                  <button
                    key={sev.value}
                    type="button"
                    onClick={() => setSeverity(sev.value)}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      severity === sev.value
                        ? sev.color
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-400 mb-1">
              Message
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe what happened, what you expected, and steps to reproduce if applicable."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
              required
            />
          </div>

          {status && (
            <p
              className={`text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
              role="status"
            >
              {status.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#c4a030] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
            {isPending ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </form>
      </div>

      {/* Feedback History */}
      {feedbackHistory.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Recent Feedback</h2>
          <div className="space-y-4">
            {feedbackHistory.map((item) => (
              <div key={item.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded border uppercase ${
                    SEVERITIES.find((s) => s.value === item.severity)?.color || 'bg-gray-700 text-gray-300'
                  }`}>
                    {item.severity}
                  </span>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">{item.category}</span>
                  {item.checklist_item_id && (
                    <span className="text-xs text-gray-500">
                      {CHECKLIST_ITEMS.find((i) => i.id === item.checklist_item_id)?.label || item.checklist_item_id}
                    </span>
                  )}
                </div>
                <p className="text-gray-200 text-sm whitespace-pre-wrap">{item.message}</p>
                <p className="text-gray-500 text-xs mt-2">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
