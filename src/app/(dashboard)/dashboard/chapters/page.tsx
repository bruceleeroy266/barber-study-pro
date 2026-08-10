import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { StudentProgress } from '@/types'
import { localChapters } from '@/lib/local-data'

// Phase 4 Design System Components
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function ChaptersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const chapters = localChapters

  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', user?.id) as { data: StudentProgress[] | null; error: Error | null }

  // Calculate overall progress
  const totalChapters = chapters.length
  const completedChapters = progress?.filter(p => p.progress_percentage === 100).length || 0
  const overallProgress = totalChapters > 0
    ? Math.round((completedChapters / totalChapters) * 100)
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">All Chapters</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Complete all 21 chapters to master your craft</p>
      </div>

      {/* Overall Progress Card */}
      <Card variant="elevated" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white mb-2">Curriculum Progress</h2>
            <p className="text-[var(--color-text-muted)] text-sm mb-4">
              {completedChapters} of {totalChapters} chapters completed
            </p>
            <ProgressBar
              value={overallProgress}
              max={100}
              size="lg"
              showLabel
              label="Overall Completion"
            />
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-[var(--color-brand-gold)]">{overallProgress}%</div>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Complete</p>
          </div>
        </div>
      </Card>

      {/* Chapter Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Chapters</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Click any chapter to continue learning</p>
        </div>
        
        {chapters.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No chapters available"
            description="Chapters will appear here once they are added to the curriculum."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => {
              const chapterProgress = progress?.find(p => p.chapter_id === chapter.id)
              const progressPercent = chapterProgress?.progress_percentage || 0
              const isCompleted = progressPercent === 100
              const isStarted = progressPercent > 0

              return (
                <Link
                  key={chapter.id}
                  href={`/dashboard/chapters/${chapter.chapter_number}`}
                  className="group"
                >
                  <Card variant="default" padding="none" hover className="overflow-hidden h-full">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl font-bold text-[var(--color-brand-gold)]">
                          {String(chapter.chapter_number).padStart(2, '0')}
                        </span>
                        <Badge
                          variant={isCompleted ? 'success' : isStarted ? 'info' : 'default'}
                          size="sm"
                        >
                          {isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
                        </Badge>
                      </div>

                      <h2 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-[var(--color-brand-gold)] transition-colors">
                        {chapter.title}
                      </h2>

                      <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
                        {chapter.description}
                      </p>

                      <ProgressBar
                        value={progressPercent}
                        max={100}
                        size="sm"
                        showLabel
                      />
                    </div>

                    <div className="px-6 py-4 bg-[var(--color-background-secondary)]/50 border-t border-[var(--color-border-primary)] flex items-center justify-between">
                      <span className="text-sm text-[var(--color-text-muted)]">
                        {isCompleted ? 'Review Chapter' : isStarted ? 'Continue' : 'Start Chapter'}
                      </span>
                      <span className="text-[var(--color-brand-gold)] group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
