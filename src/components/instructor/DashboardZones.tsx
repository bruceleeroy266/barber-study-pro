import React from 'react'
import Link from 'next/link'
import { Users, UserCheck, AlertTriangle, TrendingUp, Calendar, MessageSquare, FileText, Download } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { AlertPanel } from '@/components/ui/AlertPanel'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface DashboardZone1Props {
  instructorName: string
  schoolName: string
  totalStudents: number
  activeToday: number
  atRiskCount: number
}

/**
 * Dashboard Zone 1: Orientation
 * 
 * Welcome message, context, and quick stats
 */
export const DashboardZone1: React.FC<DashboardZone1Props> = ({
  instructorName,
  schoolName,
  totalStudents,
  activeToday,
  atRiskCount,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {instructorName}
        </h1>
        <p className="text-silver">
          {schoolName} • {currentDate}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Total Students"
          value={totalStudents}
          icon={Users}
          variant="default"
        />
        <MetricCard
          label="Active Today"
          value={activeToday}
          icon={UserCheck}
          variant="info"
        />
        <MetricCard
          label="At-Risk Students"
          value={atRiskCount}
          icon={AlertTriangle}
          variant={atRiskCount > 0 ? 'error' : 'success'}
        />
      </div>
    </div>
  )
}

export interface DashboardZone2Props {
  atRiskStudents: Array<{
    id: string
    name: string
    riskFactors: string[]
  }>
  classAvgProgress: number
  classAvgQuiz: number
  classAvgReadiness: number
  pendingApprovals: number
  unreadMessages: number
}

/**
 * Dashboard Zone 2: Key Metrics
 * 
 * At-risk alerts, class metrics, and important notifications
 */
export const DashboardZone2: React.FC<DashboardZone2Props> = ({
  atRiskStudents,
  classAvgProgress,
  classAvgQuiz,
  classAvgReadiness,
  pendingApprovals,
  unreadMessages,
}) => {
  return (
    <div className="space-y-6">
      {/* At-Risk Alert */}
      {atRiskStudents.length > 0 && (
        <AlertPanel
          title={`${atRiskStudents.length} Student${atRiskStudents.length === 1 ? '' : 's'} Need${atRiskStudents.length === 1 ? 's' : ''} Attention`}
          description="These students are at risk of falling behind"
          variant="warning"
          action={{
            label: 'View At-Risk Students',
            onClick: () => {
              // Navigate to filtered view
              window.location.href = '/instructor/students?filter=at-risk'
            },
          }}
        >
          <div className="mt-3 space-y-2">
            {atRiskStudents.slice(0, 3).map((student) => (
              <div key={student.id} className="flex items-center justify-between text-sm">
                <span className="text-white font-medium">{student.name}</span>
                <div className="flex gap-1">
                  {student.riskFactors.map((factor) => (
                    <Badge key={factor} variant="warning" size="sm">
                      {factor}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            {atRiskStudents.length > 3 && (
              <p className="text-xs text-silver mt-2">
                +{atRiskStudents.length - 3} more
              </p>
            )}
          </div>
        </AlertPanel>
      )}

      {/* Class Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-silver">Class Avg Progress</span>
              <TrendingUp className="w-4 h-4 text-silver" />
            </div>
            <div className={`text-3xl font-bold ${
              classAvgProgress >= 80 ? 'text-gold' :
              classAvgProgress >= 50 ? 'text-warm-bronze' : 'text-silver'
            }`}>
              {classAvgProgress}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-silver">Class Avg Quiz</span>
              <FileText className="w-4 h-4 text-silver" />
            </div>
            <div className={`text-3xl font-bold ${
              classAvgQuiz >= 80 ? 'text-gold' :
              classAvgQuiz >= 60 ? 'text-warm-bronze' :
              classAvgQuiz > 0 ? 'text-silver' : 'text-silver-gray'
            }`}>
              {classAvgQuiz > 0 ? `${classAvgQuiz}%` : '—'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-silver">Avg Readiness</span>
              <TrendingUp className="w-4 h-4 text-silver" />
            </div>
            <div className={`text-3xl font-bold ${
              classAvgReadiness >= 90 ? 'text-gold' :
              classAvgReadiness >= 80 ? 'text-warm-bronze' :
              classAvgReadiness >= 70 ? 'text-warm-bronze' :
              classAvgReadiness > 0 ? 'text-silver' : 'text-silver-gray'
            }`}>
              {classAvgReadiness > 0 ? classAvgReadiness : '—'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingApprovals > 0 && (
          <AlertPanel
            title={`${pendingApprovals} Pending Approval${pendingApprovals === 1 ? '' : 's'}`}
            description="Students waiting for approval"
            variant="info"
            action={{
              label: 'Review',
              onClick: () => {
                // Scroll to approvals section
                document.getElementById('pending-approvals')?.scrollIntoView({ behavior: 'smooth' })
              },
            }}
          />
        )}

        {unreadMessages > 0 && (
          <AlertPanel
            title={`${unreadMessages} Unread Message${unreadMessages === 1 ? '' : 's'}`}
            description="You have unread messages"
            variant="info"
            icon={MessageSquare}
            action={{
              label: 'View Messages',
              onClick: () => {
                window.location.href = '/instructor/messages'
              },
            }}
          />
        )}
      </div>
    </div>
  )
}

export interface DashboardZone3Props {
  children: React.ReactNode
}

/**
 * Dashboard Zone 3: Detail Content
 * 
 * Main content area for roster, analytics, etc.
 */
export const DashboardZone3: React.FC<DashboardZone3Props> = ({ children }) => {
  return (
    <div className="space-y-6">
      {children}
    </div>
  )
}

export interface QuickActionsProps {
  onAddAssessment?: () => void
  onTakeAttendance?: () => void
  onSendMessage?: () => void
  onGenerateReport?: () => void
  onExportData?: () => void
}

/**
 * Quick Actions Panel
 * 
 * Common instructor tasks
 */
export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddAssessment,
  onTakeAttendance,
  onSendMessage,
  onGenerateReport,
  onExportData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {onAddAssessment && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddAssessment}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">Add Assessment</span>
            </Button>
          )}
          
          {onTakeAttendance && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTakeAttendance}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Take Attendance</span>
            </Button>
          )}
          
          {onSendMessage && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSendMessage}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs">Send Message</span>
            </Button>
          )}
          
          {onGenerateReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateReport}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="w-5 h-5" />
              <span className="text-xs">Generate Report</span>
            </Button>
          )}
          
          {onExportData && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExportData}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Download className="w-5 h-5" />
              <span className="text-xs">Export Data</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
