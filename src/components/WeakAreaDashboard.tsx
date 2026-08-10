'use client'

import React, { useState } from 'react'
import { 
  WeakArea, 
  StudentAnalytics, 
  AdaptiveLearningPath
} from '@/lib/weak-area-mapping'
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Clock,
  Award,
  BookOpen,
  Zap,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Brain,
  Calendar
} from 'lucide-react'

// Captured once at module load so mock dates are stable and component render
// remains pure (avoids calling MOCK_BASE_TIME during render).
const MOCK_BASE_TIME = Date.now()

interface WeakAreaDashboardProps {
  userId: string
}

export default function WeakAreaDashboard({ userId }: WeakAreaDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'weak-areas' | 'progress' | 'study-plan'>('overview')

  // Mock data computed directly during render to avoid setState-in-effect.
  const weakAreas: WeakArea[] = [
    {
      id: '1',
      userId,
      chapterNumber: 4,
      conceptId: 'infection-control-universal-precautions',
      conceptName: 'Universal Precautions',
      category: 'infection-control',
      difficulty: 'medium',
      weaknessType: 'both',
      missCount: 5,
      lastAttempt: new Date(MOCK_BASE_TIME - 86400000),
      confidenceScore: 35,
      priority: 'critical',
      recommendedActions: [
        'Review flashcards for this topic',
        'Read chapter study notes',
        'CRITICAL: Master for state board exam',
        'Practice sanitation procedures'
      ],
      relatedConcepts: ['sanitation', 'safety', 'state-board']
    },
    {
      id: '2',
      userId,
      chapterNumber: 6,
      conceptId: 'anatomy-cranial-nerves',
      conceptName: 'Cranial Nerves',
      category: 'anatomy',
      difficulty: 'hard',
      weaknessType: 'quiz',
      missCount: 4,
      lastAttempt: new Date(MOCK_BASE_TIME - 172800000),
      confidenceScore: 45,
      priority: 'high',
      recommendedActions: [
        'Review flashcards for this topic',
        'Use anatomical diagrams',
        'Practice with 3D models if available'
      ],
      relatedConcepts: ['physiology', 'skin', 'hair']
    },
    {
      id: '3',
      userId,
      chapterNumber: 7,
      conceptId: 'chemistry-ph-scale',
      conceptName: 'pH Scale',
      category: 'chemistry',
      difficulty: 'medium',
      weaknessType: 'flashcard',
      missCount: 3,
      lastAttempt: new Date(MOCK_BASE_TIME - 259200000),
      confidenceScore: 55,
      priority: 'high',
      recommendedActions: [
        'Take practice quiz on this topic',
        'Create custom flashcards',
        'Study with a partner'
      ],
      relatedConcepts: ['haircoloring', 'chemical-texture']
    },
    {
      id: '4',
      userId,
      chapterNumber: 9,
      conceptId: 'skin-contagious-conditions',
      conceptName: 'Contagious Skin Conditions',
      category: 'skin',
      difficulty: 'medium',
      weaknessType: 'both',
      missCount: 3,
      lastAttempt: new Date(MOCK_BASE_TIME - 345600000),
      confidenceScore: 50,
      priority: 'high',
      recommendedActions: [
        'Review flashcards for this topic',
        'Read chapter study notes',
        'CRITICAL: Master for state board exam'
      ],
      relatedConcepts: ['anatomy', 'disorders', 'treatments']
    },
    {
      id: '5',
      userId,
      chapterNumber: 17,
      conceptId: 'state-board-licensing',
      conceptName: 'Licensing Requirements',
      category: 'state-board',
      difficulty: 'easy',
      weaknessType: 'quiz',
      missCount: 2,
      lastAttempt: new Date(MOCK_BASE_TIME - 432000000),
      confidenceScore: 65,
      priority: 'medium',
      recommendedActions: [
        'Review flashcards for this topic',
        'Read chapter study notes'
      ],
      relatedConcepts: ['infection-control', 'professional', 'legal']
    }
  ]

  const analytics: StudentAnalytics = {
    userId,
    totalStudyTime: 480, // 8 hours
    quizzesCompleted: 127,
    flashcardsReviewed: 342,
    weakAreasCount: 5,
    improvingAreasCount: 3,
    masteredAreasCount: 12,
    streakDays: 7,
    lastStudyDate: new Date(MOCK_BASE_TIME - 86400000),
    overallConfidence: 68,
    examReadiness: 62
  }

  const learningPath: AdaptiveLearningPath = {
    userId,
    currentFocus: ['Universal Precautions', 'Cranial Nerves', 'pH Scale'],
    recommendedChapters: [4, 6, 7, 9, 17],
    priorityWeakAreas: weakAreas.slice(0, 3),
    suggestedStudyTime: 35,
    nextMilestone: 'Master Universal Precautions',
    confidenceTrend: 'improving'
  }

  const isLoading = false

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-silver text-white'
      case 'high': return 'bg-warm-bronze text-white'
      case 'medium': return 'bg-warm-bronze text-black'
      case 'low': return 'bg-gold text-white'
      default: return 'bg-silver-gray text-white'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-gold" />
      case 'declining': return <TrendingDown className="w-5 h-5 text-silver" />
      default: return <Minus className="w-5 h-5 text-warm-bronze" />
    }
  }

  const getExamReadinessColor = (score: number) => {
    if (score >= 80) return 'text-gold'
    if (score >= 60) return 'text-warm-bronze'
    if (score >= 40) return 'text-warm-bronze'
    return 'text-silver'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-bronze"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Adaptive Learning Dashboard</h2>
          <p className="text-silver">Personalized insights to improve your state board readiness</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-silver">Exam Readiness</p>
            <p className={`text-3xl font-bold ${getExamReadinessColor(analytics?.examReadiness || 0)}`}>
              {analytics?.examReadiness}%
            </p>
          </div>
          <div className="w-16 h-16 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-silver-gray"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={`${(analytics?.examReadiness || 0) * 1.76} 176`}
                className={getExamReadinessColor(analytics?.examReadiness || 0)}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--color-border-secondary)] pb-4">
        {([
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'weak-areas', label: 'Weak Areas', icon: AlertTriangle },
          { id: 'progress', label: 'Progress', icon: TrendingUp },
          { id: 'study-plan', label: 'Study Plan', icon: Calendar }
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-warm-bronze text-black'
                : 'bg-graphite text-light-gray hover:bg-[var(--color-border-secondary)]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-graphite rounded-xl p-4 border border-[var(--color-border-secondary)]">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-warm-bronze" />
                <span className="text-silver text-sm">Study Time</span>
              </div>
              <p className="text-2xl font-bold text-white">{analytics?.totalStudyTime}m</p>
              <p className="text-xs text-silver-gray">Total time studied</p>
            </div>
            
            <div className="bg-graphite rounded-xl p-4 border border-[var(--color-border-secondary)]">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-silver" />
                <span className="text-silver text-sm">Quizzes</span>
              </div>
              <p className="text-2xl font-bold text-white">{analytics?.quizzesCompleted}</p>
              <p className="text-xs text-silver-gray">Questions answered</p>
            </div>
            
            <div className="bg-graphite rounded-xl p-4 border border-[var(--color-border-secondary)]">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-5 h-5 text-warm-bronze" />
                <span className="text-silver text-sm">Flashcards</span>
              </div>
              <p className="text-2xl font-bold text-white">{analytics?.flashcardsReviewed}</p>
              <p className="text-xs text-silver-gray">Cards reviewed</p>
            </div>
            
            <div className="bg-graphite rounded-xl p-4 border border-[var(--color-border-secondary)]">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-gold" />
                <span className="text-silver text-sm">Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{analytics?.streakDays} days</p>
              <p className="text-xs text-silver-gray">Keep it up!</p>
            </div>
          </div>

          {/* Current Focus Areas */}
          <div className="bg-graphite rounded-xl p-6 border border-[var(--color-border-secondary)]">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-warm-bronze" />
              <h3 className="text-lg font-semibold text-white">Current Focus Areas</h3>
            </div>
            <div className="space-y-3">
              {learningPath?.priorityWeakAreas.slice(0, 3).map((area, index) => (
                <div key={area.id} className="flex items-center gap-4 p-3 bg-charcoal rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-silver text-white' :
                    index === 1 ? 'bg-warm-bronze text-white' :
                    'bg-warm-bronze text-black'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{area.conceptName}</p>
                    <p className="text-sm text-silver">Chapter {area.chapterNumber} • {area.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(area.priority)}`}>
                    {area.priority.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Trend */}
          <div className="bg-graphite rounded-xl p-6 border border-[var(--color-border-secondary)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-silver" />
                <h3 className="text-lg font-semibold text-white">Confidence Trend</h3>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(learningPath?.confidenceTrend || 'stable')}
                <span className={`font-medium ${
                  learningPath?.confidenceTrend === 'improving' ? 'text-gold' :
                  learningPath?.confidenceTrend === 'declining' ? 'text-silver' :
                  'text-warm-bronze'
                }`}>
                  {learningPath?.confidenceTrend?.charAt(0).toUpperCase()}{learningPath?.confidenceTrend?.slice(1)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-charcoal rounded-lg">
                <p className="text-3xl font-bold text-silver">{analytics?.weakAreasCount}</p>
                <p className="text-sm text-silver">Need Work</p>
              </div>
              <div className="text-center p-4 bg-charcoal rounded-lg">
                <p className="text-3xl font-bold text-warm-bronze">{analytics?.improvingAreasCount}</p>
                <p className="text-sm text-silver">Improving</p>
              </div>
              <div className="text-center p-4 bg-charcoal rounded-lg">
                <p className="text-3xl font-bold text-gold">{analytics?.masteredAreasCount}</p>
                <p className="text-sm text-silver">Mastered</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weak Areas Tab */}
      {activeTab === 'weak-areas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">All Weak Areas</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-silver/20 text-silver rounded-full text-sm">
                {weakAreas.filter(w => w.priority === 'critical').length} Critical
              </span>
              <span className="px-3 py-1 bg-warm-bronze/20 text-warm-bronze rounded-full text-sm">
                {weakAreas.filter(w => w.priority === 'high').length} High
              </span>
            </div>
          </div>
          
          {weakAreas.map(area => (
            <div key={area.id} className="bg-graphite rounded-xl p-6 border border-[var(--color-border-secondary)] hover:border-warm-bronze/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white text-lg">{area.conceptName}</h4>
                  <p className="text-silver">Chapter {area.chapterNumber} • {area.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(area.priority)}`}>
                  {area.priority.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-silver-gray">Confidence</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[var(--color-border-secondary)] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          area.confidenceScore < 30 ? 'bg-silver' :
                          area.confidenceScore < 50 ? 'bg-warm-bronze' :
                          area.confidenceScore < 70 ? 'bg-warm-bronze' :
                          'bg-gold'
                        }`}
                        style={{ width: `${area.confidenceScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white">{area.confidenceScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-silver-gray">Missed</p>
                  <p className="font-medium text-white">{area.missCount} times</p>
                </div>
                <div>
                  <p className="text-sm text-silver-gray">Type</p>
                  <p className="font-medium text-white capitalize">{area.weaknessType}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-light-gray">Recommended Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {area.recommendedActions.map((action, i) => (
                    <span 
                      key={i}
                      className={`px-3 py-1 rounded-full text-xs ${
                        action.includes('CRITICAL') 
                          ? 'bg-silver/20 text-silver border border-silver/50' 
                          : 'bg-[var(--color-border-secondary)] text-light-gray'
                      }`}
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Tab */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="bg-graphite rounded-xl p-6 border border-[var(--color-border-secondary)]">
            <h3 className="text-lg font-semibold text-white mb-4">Study Progress</h3>
            <div className="space-y-4">
              {[
                { label: 'Chapter 4: Infection Control', progress: 75, total: 100 },
                { label: 'Chapter 6: Anatomy', progress: 45, total: 100 },
                { label: 'Chapter 7: Chemistry', progress: 60, total: 100 },
                { label: 'Chapter 9: Skin', progress: 55, total: 100 },
                { label: 'Chapter 17: State Board', progress: 80, total: 100 }
              ].map((chapter, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-light-gray">{chapter.label}</span>
                    <span className="text-warm-bronze">{chapter.progress}%</span>
                  </div>
                  <div className="h-2 bg-[var(--color-border-secondary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-warm-bronze to-warm-bronze rounded-full transition-all"
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Study Plan Tab */}
      {activeTab === 'study-plan' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-warm-bronze/20 to-warm-bronze/20 rounded-xl p-6 border border-warm-bronze/30">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-warm-bronze" />
              <h3 className="text-lg font-semibold text-white">Today&apos;s Study Plan</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-silver mb-1">Suggested Time</p>
                <p className="text-3xl font-bold text-white">{learningPath?.suggestedStudyTime} minutes</p>
              </div>
              <div>
                <p className="text-sm text-silver mb-1">Next Milestone</p>
                <p className="text-xl font-semibold text-warm-bronze">{learningPath?.nextMilestone}</p>
              </div>
            </div>
          </div>

          <div className="bg-graphite rounded-xl p-6 border border-[var(--color-border-secondary)]">
            <h3 className="text-lg font-semibold text-white mb-4">Recommended Activities</h3>
            <div className="space-y-3">
              {[
                { icon: AlertCircle, text: 'Review 5 missed questions on Universal Precautions', time: '10 min', priority: 'critical' },
                { icon: BookOpen, text: 'Study flashcards for Cranial Nerves', time: '15 min', priority: 'high' },
                { icon: CheckCircle, text: 'Take practice quiz on pH Scale', time: '10 min', priority: 'high' },
                { icon: Brain, text: 'Review chapter notes on Skin Conditions', time: '15 min', priority: 'medium' }
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-charcoal rounded-lg hover:bg-charcoal transition-colors cursor-pointer">
                  <activity.icon className={`w-5 h-5 ${
                    activity.priority === 'critical' ? 'text-silver' :
                    activity.priority === 'high' ? 'text-warm-bronze' :
                    'text-warm-bronze'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.text}</p>
                  </div>
                  <span className="text-silver text-sm">{activity.time}</span>
                  <ChevronRight className="w-5 h-5 text-silver-gray" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
