'use client'

import { InstructorPerformanceRow } from '@/types'
import { Users, TrendingUp, Award, ClipboardCheck, MessageSquare, Star } from 'lucide-react'

interface Props {
  rows: InstructorPerformanceRow[]
}

export default function InstructorPerformancePanel({ rows }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Instructor Performance</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-950 text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-gray-400">Instructor</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400">Students</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400">Avg Attendance</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400">Avg Readiness</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400">Avg Grade</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400">Assessments</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400">Messages</th>
              <th className="px-4 py-3 text-xs font-medium text-gray-400">Success</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rows.map((row) => (
              <tr key={row.instructorId} className="hover:bg-gray-800/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{row.fullName}</div>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-gray-500" />
                    {row.studentsAssigned}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.averageAttendance >= 80 ? 'text-green-400' : row.averageAttendance >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {row.averageAttendance}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.averageReadiness >= 80 ? 'text-green-400' : row.averageReadiness >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {row.averageReadiness}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.averageGrade >= 80 ? 'text-green-400' : row.averageGrade >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {row.averageGrade}%
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <div className="flex items-center gap-1">
                    <ClipboardCheck className="w-3.5 h-3.5 text-gray-500" />
                    {row.assessmentsCompleted}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-300">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
                    {row.messagesSent}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {row.successIndicator === 'high' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      <Star className="w-3 h-3" /> High
                    </span>
                  ) : row.successIndicator === 'medium' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      <TrendingUp className="w-3 h-3" /> Medium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                      <Award className="w-3 h-3" /> Low
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No instructors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
