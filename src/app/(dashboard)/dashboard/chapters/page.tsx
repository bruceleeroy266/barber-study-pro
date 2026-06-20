import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { StudentProgress } from '@/types'
import { localChapters } from '@/lib/local-data'

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
    .eq('user_id', user?.id) as { data: StudentProgress[] | null; error: any }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">All Chapters</h1>
        <p className="text-gray-400">Complete all 21 chapters to master your craft</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters?.map((chapter) => {
          const chapterProgress = progress?.find(p => p.chapter_id === chapter.id)
          const progressPercent = chapterProgress?.progress_percentage || 0
          const isCompleted = progressPercent === 100
          const isStarted = progressPercent > 0

          return (
            <Link
              key={chapter.id}
              href={`/dashboard/chapters/${chapter.chapter_number}`}
              className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-[#D4AF37]/30 transition-all card-hover"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-[#D4AF37]">
                    {String(chapter.chapter_number).padStart(2, '0')}
                  </span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                      <span>✓</span> Completed
                    </span>
                  )}
                  {isStarted && !isCompleted && (
                    <span className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                      <span>🔄</span> In Progress
                    </span>
                  )}
                  {!isStarted && (
                    <span className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                      <span>📖</span> Not Started
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {chapter.title}
                </h2>

                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {chapter.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isCompleted ? 'bg-green-500' : 'bg-[#D4AF37]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-800 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {isCompleted ? 'Review Chapter' : isStarted ? 'Continue' : 'Start Chapter'}
                </span>
                <span className="text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
