'use client'

import { useState, useTransition, FormEvent, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Send, ArrowLeft, User } from 'lucide-react'
import { Profile } from '@/types'

interface NewMessageClientProps {
  students: Profile[]
}

function NewMessageForm({ students }: NewMessageClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [recipientIds, setRecipientIds] = useState<string[]>(
    searchParams.get('to') ? [searchParams.get('to')!] : []
  )
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (recipientIds.length === 0 || !subject.trim() || !body.trim()) return

    startTransition(() => {
      // Demo-only simulation: real message persistence will replace this redirect.
      router.push('/instructor/messages')
    })
  }

  const toggleRecipient = (id: string) => {
    setRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/instructor/messages"
            className="inline-flex items-center gap-2 text-silver hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Messages
          </Link>
        </div>

        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white mb-2">New Message</h1>
          <p className="text-silver mb-6">Send a message to one or more students.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Recipients
              </label>
              {students.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {students.map((student) => {
                    const selected = recipientIds.includes(student.id)
                    return (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => toggleRecipient(student.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          selected
                            ? 'bg-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]/50'
                            : 'bg-graphite text-light-gray border-[var(--color-border-secondary)] hover:bg-[var(--color-border-secondary)]'
                        }`}
                      >
                        <User className="w-3 h-3" />
                        {student.full_name}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-silver-gray">No students available to message.</p>
              )}
              {recipientIds.length === 0 && students.length > 0 && (
                <p className="text-xs text-silver mt-2">Select at least one recipient.</p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Chapter 4 Quiz Follow-up"
                className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-2.5 text-white placeholder-silver-gray focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="body" className="block text-sm font-medium text-white mb-2">
                Message
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                rows={8}
                className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-4 py-2.5 text-white placeholder-silver-gray focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/instructor/messages"
                className="px-5 py-2.5 bg-graphite hover:bg-[var(--color-border-secondary)] text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isPending || recipientIds.length === 0 || !subject.trim() || !body.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-light)] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isPending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function NewMessageClient({ students }: NewMessageClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black p-8 text-white">Loading...</div>}>
      <NewMessageForm students={students} />
    </Suspense>
  )
}
