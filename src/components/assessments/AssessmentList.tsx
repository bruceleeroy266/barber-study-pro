'use client'

import { useState } from 'react'
import { Assessment, Profile } from '@/types'
import { getPassFailColorClass, formatScore } from '@/lib/assessments'
import { CheckCircle, XCircle, Filter } from 'lucide-react'

interface AssessmentListProps {
  assessments: Assessment[]
  students?: Profile[]
  showStudentName?: boolean
}

export default function AssessmentList({ assessments, students = [], showStudentName = false }: AssessmentListProps) {
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all')

  const filteredAssessments = assessments.filter((a) => {
    const typeMatch = filterType === 'all' || a.assessmentType === filterType
    const statusMatch =
      filterStatus === 'all' || (filterStatus === 'passed' ? a.isPassed : !a.isPassed)
    return typeMatch && statusMatch
  })

  function getStudentName(studentId: string): string {
    return students.find((s) => s.id === studentId)?.full_name || studentId
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            <option value="all">All Types</option>
            <option value="HAIRCUT">Haircut</option>
            <option value="COLOR">Color</option>
            <option value="CHEMICAL">Chemical</option>
            <option value="SANITATION">Sanitation</option>
            <option value="CONSULTATION">Consultation</option>
          </select>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'passed' | 'failed')}
          className="bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <option value="all">All Statuses</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="divide-y divide-gray-800 border border-gray-800 rounded-xl overflow-hidden">
        {filteredAssessments.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-gray-900 p-5 hover:bg-gray-800/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white">{assessment.assessmentType}</span>
                  {assessment.isPassed ? (
                    <span className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" /> Passed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-red-400">
                      <XCircle className="w-3 h-3" /> Not Passed
                    </span>
                  )}
                </div>
                {showStudentName && (
                  <div className="text-sm text-gray-400 mb-1">{getStudentName(assessment.studentId)}</div>
                )}
                <div className="text-xs text-gray-500">
                  {new Date(assessment.assessmentDate).toLocaleDateString()} · {assessment.evaluatorName}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getPassFailColorClass(assessment.isPassed)}`}>
                  {formatScore(assessment)}
                </div>
                <div className="text-xs text-gray-500">
                  {assessment.scoringType === 'NUMERIC' ? `${assessment.score}/${100}` : assessment.qualitativeResult}
                </div>
              </div>
            </div>
            {assessment.feedback && (
              <p className="mt-3 text-sm text-gray-400 bg-gray-950 border border-gray-800 rounded-lg p-3">
                {assessment.feedback}
              </p>
            )}
          </div>
        ))}
        {filteredAssessments.length === 0 && (
          <div className="p-8 text-center text-gray-500">No assessments match the selected filters.</div>
        )}
      </div>
    </div>
  )
}
