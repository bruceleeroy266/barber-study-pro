'use client'

import { useState, useRef } from 'react'
import Modal from '@/components/ui/Modal'
import StudentIdentity from '@/components/StudentIdentity'
import { PrintButton } from './PrintButton'
import { Profile, StudentProgress, QuizAttempt, InstructorNote } from '@/types'

interface ChapterInfo {
  id: string
  chapter_number: number
  title: string
}

interface WeakAreaInfo {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  score: number
}

interface ProgressReportModalProps {
  student: Profile
  lastActivityAt: string | null
  overallProgress: number
  avgQuizScore: number
  readiness: { label: string; score: number }
  boardRisk: { label: string }
  chapters: ChapterInfo[]
  progressRecords: StudentProgress[]
  attemptRecords: QuizAttempt[]
  hasEnoughQuizData: boolean
  weakAreas: WeakAreaInfo[]
  noteRecords: InstructorNote[]
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDaysAgo(dateString: string | null): string {
  if (!dateString) return 'Never'
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function ProgressReportModal({
  student,
  lastActivityAt,
  overallProgress,
  avgQuizScore,
  readiness,
  boardRisk,
  chapters,
  progressRecords,
  attemptRecords,
  hasEnoughQuizData,
  weakAreas,
  noteRecords,
}: ProgressReportModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const openButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button
        ref={openButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#F4E4A6] text-gray-950 font-medium rounded-lg transition-colors"
      >
        View Progress Report
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Student Progress Report"
        size="xl"
        triggerRef={openButtonRef}
      >
        <section id="student-report" className="report-section bg-white text-black rounded-xl p-2 print:shadow-none">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              .report-section, .report-section * { visibility: visible; }
              .report-section { position: absolute; left: 0; top: 0; width: 100%; padding: 0.5in !important; }
              .report-section button { display: none !important; }
            }
          `}</style>

          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Student Progress Report</h2>
              <p className="text-sm text-gray-500">Generated {new Date().toLocaleDateString()}</p>
            </div>
            <PrintButton />
          </div>

          {/* Student Info */}
          <div className="mb-6">
            <StudentIdentity student={student} variant="light" showRole />
            <p className="text-sm text-gray-500 mt-2">Joined: {formatDate(student.created_at)}</p>
            {lastActivityAt && (
              <p className="text-sm text-gray-500">Last active: {formatDaysAgo(lastActivityAt)}</p>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{overallProgress}%</div>
              <div className="text-xs text-gray-500">Overall Progress</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{avgQuizScore > 0 ? `${avgQuizScore}%` : '—'}</div>
              <div className="text-xs text-gray-500">Quiz Average</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{readiness.label}</div>
              <div className="text-xs text-gray-500">Board Readiness ({readiness.score})</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{boardRisk.label}</div>
              <div className="text-xs text-gray-500">Board Exam Risk</div>
            </div>
          </div>

          {/* Chapter Progress */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Chapter Progress</h3>
            {chapters.length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 pr-4">Chapter</th>
                    <th className="py-2 pr-4">Progress</th>
                    <th className="py-2 pr-4">Flashcards</th>
                    <th className="py-2 pr-4">Quiz</th>
                    <th className="py-2">Best Score</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter) => {
                    const chapterProgress = progressRecords.find((p) => p.chapter_id === chapter.id)
                    return (
                      <tr key={chapter.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4">
                          <span className="font-medium">{chapter.chapter_number}. {chapter.title}</span>
                        </td>
                        <td className="py-2 pr-4">{chapterProgress?.progress_percentage || 0}%</td>
                        <td className="py-2 pr-4">{chapterProgress?.flashcards_completed ? 'Done' : '—'}</td>
                        <td className="py-2 pr-4">{chapterProgress?.quiz_completed ? 'Passed' : '—'}</td>
                        <td className="py-2">{chapterProgress?.best_quiz_score !== null && chapterProgress?.best_quiz_score !== undefined ? `${chapterProgress.best_quiz_score}%` : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No chapter data available.</p>
            )}
          </div>

          {/* Recent Quiz Attempts */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Quiz Attempts</h3>
            {attemptRecords.length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 pr-4">Quiz</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2 pr-4">Percentage</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attemptRecords.slice(0, 10).map((attempt) => (
                    <tr key={attempt.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4">{attempt.quiz_id}</td>
                      <td className="py-2 pr-4">{attempt.score} / {attempt.total_questions}</td>
                      <td className="py-2 pr-4">{attempt.percentage}%</td>
                      <td className="py-2">{formatDate(attempt.completed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No quiz attempts yet.</p>
            )}
          </div>

          {/* Weak Areas */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Weak Areas & Study Focus</h3>
            {!hasEnoughQuizData ? (
              <p className="text-gray-500">Not enough quiz data yet.</p>
            ) : weakAreas.length > 0 ? (
              <div className="space-y-2">
                {weakAreas.map((area) => (
                  <div key={area.chapterId} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                    <span className="font-medium">Ch.{area.chapterNumber} — {area.chapterTitle}</span>
                    <span className="font-bold">{area.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No weak areas found.</p>
            )}
          </div>

          {/* Instructor Notes */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Instructor Notes</h3>
            {noteRecords.length > 0 ? (
              <div className="space-y-3">
                {noteRecords.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {note.note_type}
                      </span>
                      <span className="text-xs text-gray-500">by {note.instructor_name} • {formatDate(note.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.note_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No instructor notes yet.</p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
            ASCYN PRO — Student Progress Report
          </div>
        </section>
      </Modal>
    </>
  )
}
