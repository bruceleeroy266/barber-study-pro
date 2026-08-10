'use client'

import { InstructorPerformanceRow } from '@/types'
import { Users, TrendingUp, Award, ClipboardCheck, MessageSquare, Star } from 'lucide-react'

interface Props {
  rows: InstructorPerformanceRow[]
}

export default function InstructorPerformancePanel({ rows }: Props) {
  return (
    <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
      <div className="p-4 border-b border-graphite">
        <h2 className="text-lg font-semibold text-white">Instructor Performance</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black text-left">
            <tr>
              <th className="px-4 py-3 text-xs font-medium text-silver">Instructor</th>
              <th className="px-4 py-3 text-xs font-medium text-silver">Students</th>
              <th className="px-4 py-3 text-xs font-medium text-silver">Avg Attendance</th>
              <th className="px-4 py-3 text-xs font-medium text-silver">Avg Readiness</th>
              <th className="px-4 py-3 text-xs font-medium text-silver">Avg Grade</th>
              <th className="px-4 py-3 text-xs font-medium text-silver">Assessments</th>
              <th className="px-4 py-3 text-xs font-medium text-silver">Messages</th>
              <th className="px-4 py-3 text-xs font-medium text-silver">Success</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite">
            {rows.map((row) => (
              <tr key={row.instructorId} className="hover:bg-graphite/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{row.fullName}</div>
                </td>
                <td className="px-4 py-3 text-light-gray">
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-silver-gray" />
                    {row.studentsAssigned}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.averageAttendance >= 80 ? 'text-gold' : row.averageAttendance >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                    {row.averageAttendance}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.averageReadiness >= 80 ? 'text-gold' : row.averageReadiness >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                    {row.averageReadiness}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.averageGrade >= 80 ? 'text-gold' : row.averageGrade >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                    {row.averageGrade}%
                  </span>
                </td>
                <td className="px-4 py-3 text-light-gray">
                  <div className="flex items-center gap-1">
                    <ClipboardCheck className="w-3.5 h-3.5 text-silver-gray" />
                    {row.assessmentsCompleted}
                  </div>
                </td>
                <td className="px-4 py-3 text-light-gray">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-silver-gray" />
                    {row.messagesSent}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {row.successIndicator === 'high' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                      <Star className="w-3 h-3" /> High
                    </span>
                  ) : row.successIndicator === 'medium' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-warm-bronze/10 text-warm-bronze border border-warm-bronze/20">
                      <TrendingUp className="w-3 h-3" /> Medium
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-silver/10 text-silver border border-silver/20">
                      <Award className="w-3 h-3" /> Low
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-silver-gray">
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
