import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { buildAITutorContext } from '@/lib/ai/context-builder'
import AITutorChat from '@/components/ai/AITutorChat'
import { Bot, Sparkles, BookOpen, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AITutorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?redirect=/dashboard/ai-tutor')
  }
  
  // Build AI context
  const context = await buildAITutorContext(user.id)
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-gold)]/10 flex items-center justify-center">
          <Bot className="w-6 h-6 text-[var(--color-brand-gold)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Tutor</h1>
          <p className="text-[var(--color-text-muted)]">
            Your personal state board exam preparation assistant
          </p>
        </div>
      </div>
      
      {/* Context Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[var(--color-brand-gold)]" />
            <span className="text-sm text-[var(--color-text-muted)]">Readiness Score</span>
          </div>
          <p className="text-2xl font-bold text-white">{context.readiness.score}%</p>
          <p className="text-xs text-[var(--color-text-muted)]">{context.readiness.level}</p>
        </div>
        
        <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-[var(--color-brand-gold)]" />
            <span className="text-sm text-[var(--color-text-muted)]">Chapters Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {context.readiness.chaptersCompleted}/{context.readiness.totalChapters}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {context.readiness.totalChapters - context.readiness.chaptersCompleted} remaining
          </p>
        </div>
        
        <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[var(--color-brand-gold)]" />
            <span className="text-sm text-[var(--color-text-muted)]">Focus Areas</span>
          </div>
          <p className="text-2xl font-bold text-white">{context.weakAreas.length}</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {context.weakAreas.length > 0 ? context.weakAreas[0].name : 'No weak areas'}
          </p>
        </div>
      </div>
      
      {/* Chat Interface */}
      <div className="h-[600px]">
        <AITutorChat initialContext={context} />
      </div>
      
      {/* Help Text */}
      <div className="bg-[var(--color-background-primary)]/50 border border-[var(--color-border-primary)] rounded-xl p-4">
        <h3 className="text-sm font-semibold text-white mb-2">What can I help you with?</h3>
        <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
          <li>• Explain barbering concepts in simple terms</li>
          <li>• Help you review weak areas and missed questions</li>
          <li>• Create personalized study plans</li>
          <li>• Provide encouragement and motivation</li>
          <li>• Answer questions about state board exam topics</li>
        </ul>
      </div>
    </div>
  )
}
