'use client'

import { useState } from 'react'
import { ExternalLink, X, Send, CheckCircle, AlertCircle, Copy, Check } from 'lucide-react'
import { sendPilotInquiryReply } from './actions'

interface ReplyModalProps {
  inquiryId: string
  email: string
  contactName: string | null
  schoolName: string
  defaultSubject: string
}

export default function ReplyModal({
  inquiryId,
  email,
  contactName,
  schoolName,
  defaultSubject,
}: ReplyModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [subject, setSubject] = useState(defaultSubject)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const result = await sendPilotInquiryReply(inquiryId, subject, message)

    if (result.success) {
      setStatus('success')
      setMessage('')
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Failed to send reply.')
    }
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#0a0a0a] bg-[#D4AF37] rounded-lg hover:bg-[#F4E4A6] transition-colors"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        Reply
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-white">Reply to {schoolName}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {contactName || 'Contact'} • {email}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={email}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-300 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={8}
                  placeholder="Write your reply here..."
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-[#D4AF37] resize-y"
                />
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Reply sent successfully and inquiry marked as contacted.
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Open in email app
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === 'submitting' || status === 'success'}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0a0a0a] bg-[#D4AF37] rounded-lg hover:bg-[#F4E4A6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {status === 'submitting' ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
</>
  )
}
