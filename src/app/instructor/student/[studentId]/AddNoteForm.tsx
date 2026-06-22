'use client'

import { useState } from 'react'
import { addInstructorNote, NoteType } from './actions'

interface AddNoteFormProps {
  studentId: string
}

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
      <div>
        <label htmlFor="note-type" className="block text-sm font-medium text-gray-300 mb-1">
          Note Type
        </label>
        <select
          id="note-type"
          value={noteType}
          onChange={(e) => setNoteType(e.target.value as NoteType)}
          className="w-full md:w-64 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
        >
          {NOTE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="note-text" className="block text-sm font-medium text-gray-300 mb-1">
          Note
        </label>
        <textarea
          id="note-text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter coaching feedback, remediation plan, readiness observation, or general note..."
          rows={3}
          className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <button
          type="submit"
          disabled={pending || !noteText.trim()}
          className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F4E4A6] disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-semibold rounded-lg transition-colors"
        >
          {pending ? 'Adding...' : 'Add Note'}
        </button>

        {status && (
          <span
            className={`text-sm ${
              status.type === 'success' ? 'text-green-400' : 'text-yellow-400'
            }`}
          >
            {status.message}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Notes are visible to all instructors and admins for this student.
      </p>
    </form>
  )
}
