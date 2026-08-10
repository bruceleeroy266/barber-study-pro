'use client'

import { useState } from 'react'
import { addInstructorNote, NoteType } from './actions'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { Button, Select, Textarea, Alert } from '@/components/ui'

interface AddNoteFormProps {
  studentId: string
}

const isDemo = isDemoFallbackEnabled()

const NOTE_TYPES: { value: NoteType; label: string }[] = [
  { value: 'coaching', label: 'Coaching' },
  { value: 'remediation', label: 'Remediation' },
  { value: 'readiness', label: 'Readiness' },
  { value: 'general', label: 'General' },
]

export function AddNoteForm({ studentId }: AddNoteFormProps) {
  const [noteType, setNoteType] = useState<NoteType>('general')
  const [noteText, setNoteText] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)
    setPending(true)

    const result = await addInstructorNote(studentId, noteType, noteText)

    setPending(false)
    setStatus({
      type: result.success ? 'success' : 'error',
      message: result.message,
    })

    if (result.success) {
      setNoteText('')
      setNoteType('general')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isDemo && (
        <Alert variant="warning">
          <span className="font-semibold">Demo mode:</span> Instructor notes are read-only while running without a configured Supabase database. Notes you enter here will not be saved.
        </Alert>
      )}

      <div>
        <label htmlFor="note-type" className="block text-sm font-medium text-light-gray mb-1">
          Note Type
        </label>
        <Select
          id="note-type"
          value={noteType}
          onChange={(e) => setNoteType(e.target.value as NoteType)}
          options={NOTE_TYPES.map((type) => ({ value: type.value, label: type.label }))}
          className="w-full md:w-64"
        />
      </div>

      <div>
        <label htmlFor="note-text" className="block text-sm font-medium text-light-gray mb-1">
          Note
        </label>
        <Textarea
          id="note-text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter coaching feedback, remediation plan, readiness observation, or general note..."
          rows={3}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={pending || !noteText.trim() || isDemo}
        >
          {pending ? 'Adding...' : isDemo ? 'Notes read-only' : 'Add Note'}
        </Button>

        {status && (
          <span
            className={`text-sm ${
              status.type === 'success' ? 'text-gold' : 'text-warm-bronze'
            }`}
          >
            {status.message}
          </span>
        )}
      </div>

      <p className="text-xs text-silver-gray">
        Notes are visible to all instructors and admins for this student.
      </p>
    </form>
  )
}
