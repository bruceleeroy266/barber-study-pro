import React, { useState } from 'react'
import { X, Plus, Calendar, Target, FileText, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'

export interface InterventionPlan {
  id: string
  studentId: string
  studentName: string
  riskFactors: string[]
  strategies: string[]
  goals: string[]
  startDate: string
  endDate?: string
  status: 'active' | 'completed' | 'cancelled'
  progress: number
  notes: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface InterventionPlanFormProps {
  studentId: string
  studentName: string
  riskFactors: string[]
  onSave: (plan: Partial<InterventionPlan>) => void
  onClose: () => void
}

/**
 * Intervention Plan Form
 * 
 * Create a new intervention plan for an at-risk student
 */
export const InterventionPlanForm: React.FC<InterventionPlanFormProps> = ({
  studentId,
  studentName,
  riskFactors,
  onSave,
  onClose,
}) => {
  const [strategies, setStrategies] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])
  const [newStrategy, setNewStrategy] = useState('')
  const [newGoal, setNewGoal] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [notes, setNotes] = useState('')

  const commonStrategies = [
    'Schedule one-on-one meeting',
    'Assign additional practice',
    'Provide study resources',
    'Pair with peer tutor',
    'Weekly check-ins',
    'Modified assignment schedule',
    'Extra tutoring sessions',
    'Parent/guardian contact',
  ]

  const handleAddStrategy = () => {
    if (newStrategy.trim()) {
      setStrategies([...strategies, newStrategy.trim()])
      setNewStrategy('')
    }
  }

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()])
      setNewGoal('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    onSave({
      studentId,
      studentName,
      riskFactors,
      strategies,
      goals,
      startDate,
      endDate: endDate || undefined,
      status: 'active',
      progress: 0,
      notes,
    })
    
    onClose()
  }

  return (
    <Modal isOpen onClose={onClose} title="Create Intervention Plan">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{studentName}</h3>
          <div className="flex flex-wrap gap-2">
            {riskFactors.map((factor) => (
              <Badge key={factor} variant="warning" size="sm">
                {factor}
              </Badge>
            ))}
          </div>
        </div>

        {/* Strategies */}
        <div>
          <label className="block text-sm font-medium text-light-gray mb-2">
            Intervention Strategies
          </label>
          <div className="space-y-2 mb-3">
            {strategies.map((strategy, index) => (
              <div key={index} className="flex items-center gap-2 bg-graphite rounded-lg p-2">
                <span className="flex-1 text-sm text-white">{strategy}</span>
                <button
                  type="button"
                  onClick={() => setStrategies(strategies.filter((_, i) => i !== index))}
                  className="text-silver hover:text-silver"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              placeholder="Add strategy..."
              className="flex-1 bg-graphite border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddStrategy}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {commonStrategies.map((strategy) => (
              <button
                key={strategy}
                type="button"
                onClick={() => {
                  if (!strategies.includes(strategy)) {
                    setStrategies([...strategies, strategy])
                  }
                }}
                className="text-xs px-2 py-1 bg-graphite hover:bg-[var(--color-border-secondary)] text-light-gray rounded transition-colors"
              >
                + {strategy}
              </button>
            ))}
          </div>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-light-gray mb-2">
            Goals & Milestones
          </label>
          <div className="space-y-2 mb-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex items-center gap-2 bg-graphite rounded-lg p-2">
                <Target className="w-4 h-4 text-[var(--color-brand-gold)] flex-shrink-0" />
                <span className="flex-1 text-sm text-white">{goal}</span>
                <button
                  type="button"
                  onClick={() => setGoals(goals.filter((_, i) => i !== index))}
                  className="text-silver hover:text-silver"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="Add goal..."
              className="flex-1 bg-graphite border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddGoal}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full bg-graphite border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-light-gray mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-graphite border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-light-gray mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Additional notes about this intervention plan..."
            className="w-full bg-graphite border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Create Intervention Plan
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export interface InterventionCardProps {
  plan: InterventionPlan
  onUpdate?: (plan: InterventionPlan) => void
  onViewDetails?: () => void
}

/**
 * Intervention Card
 * 
 * Display an intervention plan with progress tracking
 */
export const InterventionCard: React.FC<InterventionCardProps> = ({
  plan,
  onUpdate,
  onViewDetails,
}) => {
  const statusColors = {
    active: 'info' as const,
    completed: 'success' as const,
    cancelled: 'default' as const,
  }

  // Calculate days active - use a stable reference to avoid impure function during render
  const [daysActive] = useState(() => {
    return Math.floor(
      (Date.now() - new Date(plan.startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{plan.studentName}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={statusColors[plan.status]} size="sm">
                {plan.status}
              </Badge>
              <span className="text-xs text-silver">
                {daysActive} day{daysActive === 1 ? '' : 's'} active
              </span>
            </div>
          </div>
          {onViewDetails && (
            <Button variant="ghost" size="sm" onClick={onViewDetails}>
              View Details →
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Factors */}
        <div>
          <h4 className="text-sm font-medium text-silver mb-2">Risk Factors</h4>
          <div className="flex flex-wrap gap-2">
            {plan.riskFactors.map((factor) => (
              <Badge key={factor} variant="warning" size="sm">
                {factor}
              </Badge>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-silver">Progress</span>
            <span className="text-sm font-semibold text-white">{plan.progress}%</span>
          </div>
          <div className="w-full bg-graphite rounded-full h-2">
            <div
              className="bg-[var(--color-brand-gold)] h-2 rounded-full transition-all"
              style={{ width: `${plan.progress}%` }}
            />
          </div>
        </div>

        {/* Goals */}
        <div>
          <h4 className="text-sm font-medium text-silver mb-2">
            Goals ({plan.goals.length})
          </h4>
          <ul className="space-y-1">
            {plan.goals.slice(0, 3).map((goal, index) => (
              <li key={index} className="text-sm text-light-gray flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{goal}</span>
              </li>
            ))}
            {plan.goals.length > 3 && (
              <li className="text-xs text-silver-gray">
                +{plan.goals.length - 3} more goals
              </li>
            )}
          </ul>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-4 text-xs text-silver">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Started {new Date(plan.startDate).toLocaleDateString()}</span>
          </div>
          {plan.endDate && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>Target {new Date(plan.endDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
