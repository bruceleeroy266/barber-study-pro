'use client'

import { StudentGradePerformance, Grade, GradeCategory, Profile, Assessment } from '@/types'
import { getLetterGrade, getGradeColorClass } from '@/lib/gradebook'
import { formatScore } from '@/lib/assessments'

interface StudentGradeReportProps {
  student: Profile
  performance: StudentGradePerformance
  grades: Grade[]
  categories: GradeCategory[]
  assessments: Assessment[]
}

export default function StudentGradeReport({
  student,
  performance,
  grades,
  categories,
  assessments,
}: StudentGradeReportProps) {
  const studentGrades = grades.filter((g) => g.studentId === student.id && !g.isExcused)
  const studentAssessments = assessments.filter((a) => a.studentId === student.id)

  return (
    <div className="bg-white text-gray-900 rounded-xl p-8 print:p-0 print:shadow-none max-w-3xl mx-auto">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Grade Report</h1>
        <p className="text-gray-600 mt-1">Professional Licensing Platform</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-sm text-gray-500">Student</p>
          <p className="text-xl font-semibold">{student.full_name}</p>
          <p className="text-sm text-gray-600">{student.email}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Overall Grade</p>
          <p className={`text-4xl font-bold ${getGradeColorClass(performance.overallGrade)}`}>
            {performance.overallGrade}%
          </p>
          <p className="text-lg text-gray-700">{getLetterGrade(performance.overallGrade)}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Grade Breakdown</h2>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600">
              <th className="py-2">Category</th>
              <th className="py-2">Weight</th>
              <th className="py-2">Average</th>
              <th className="py-2">Contributions</th>
            </tr>
          </thead>
          <tbody>
            {performance.gradeBreakdown.map((breakdown) => (
              <tr key={breakdown.categoryId} className="border-b border-gray-100">
                <td className="py-2">{breakdown.categoryName}</td>
                <td className="py-2">{Math.round(breakdown.weight * 100)}%</td>
                <td className="py-2">
                  {breakdown.gradeCount > 0 ? `${breakdown.averagePercentage}%` : '—'}
                </td>
                <td className="py-2">{breakdown.weightedContribution.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Grades</h2>
        {studentGrades.length === 0 ? (
          <p className="text-gray-600">No grades recorded.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="py-2">Date</th>
                <th className="py-2">Category</th>
                <th className="py-2">Score</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {studentGrades.slice(0, 10).map((grade) => {
                const category = categories.find((c) => c.id === grade.categoryId)
                return (
                  <tr key={grade.id} className="border-b border-gray-100">
                    <td className="py-2">{new Date(grade.dateEntered).toLocaleDateString()}</td>
                    <td className="py-2">{category?.name || grade.categoryType}</td>
                    <td className="py-2 font-medium">
                      {grade.score}/{grade.maxScore} ({grade.percentage}%)
                    </td>
                    <td className="py-2 text-gray-600">{grade.notes || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Assessments</h2>
        {studentAssessments.length === 0 ? (
          <p className="text-gray-600">No assessments recorded.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="py-2">Date</th>
                <th className="py-2">Type</th>
                <th className="py-2">Result</th>
                <th className="py-2">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {studentAssessments.slice(0, 10).map((assessment) => (
                <tr key={assessment.id} className="border-b border-gray-100">
                  <td className="py-2">{new Date(assessment.assessmentDate).toLocaleDateString()}</td>
                  <td className="py-2">{assessment.assessmentType}</td>
                  <td className="py-2 font-medium">
                    {formatScore(assessment)} · {assessment.isPassed ? 'Pass' : 'Not Pass'}
                  </td>
                  <td className="py-2 text-gray-600">{assessment.feedback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="mt-8 text-xs text-gray-500 border-t border-gray-200 pt-4">
        Generated by ASCYN PRO Gradebook · This is an internal academic report.
      </div>
    </div>
  )
}
