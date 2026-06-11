import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import FlashcardClient from '@/components/FlashcardClient'
import QuizClient from '@/components/QuizClient'
import ChapterContent from '@/components/chapter/ChapterContent'
import ChapterHeader from '@/components/chapter/ChapterHeader'
import { getChapterContent } from '@/lib/chapter-content'
import { localChapters, getLocalFlashcards, getLocalQuiz, getLocalQuizQuestions } from '@/lib/local-data'

interface ChapterPageProps {
  params: Promise<{
    chapterNumber: string
  }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterNumber } = await params
  const num = parseInt(chapterNumber)
  
  if (isNaN(num)) {
    notFound()
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get chapter from local data
  const chapter = localChapters.find(ch => ch.chapter_number === num && ch.is_active)

  if (!chapter) {
    notFound()
  }

  // Get flashcards from local data
  const flashcards = getLocalFlashcards(chapter.id)

  // Get quiz from local data
  const quiz = getLocalQuiz(chapter.id)

  // Get quiz questions from local data
  const questions = quiz ? getLocalQuizQuestions(quiz.id) : []

  // Get user progress
  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', user?.id)
    .eq('chapter_id', chapter.id)
    .single()

  // Get best quiz attempt
  const { data: bestAttempt } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user?.id)
    .eq('quiz_id', quiz?.id)
    .order('percentage', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/dashboard/chapters" className="hover:text-[#D4AF37] transition-colors">
          Chapters
        </Link>
        <span>/</span>
        <span className="text-white">Chapter {num}</span>
      </div>

      {/* Back to Dashboard */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Themed Header */}
      <ChapterHeader
        num={num}
        title={chapter.title}
        description={chapter.description || ''}
        subtitle={getChapterContent(num)?.subtitle}
        flashcardsCount={flashcards?.length || 0}
        questionsCount={questions?.length || 0}
        bestAttempt={bestAttempt}
        theme={getChapterContent(num)?.theme}
      />

      {/* Chapter Content */}
      <ChapterContent 
        sections={getChapterContent(num)?.sections || []} 
        theme={getChapterContent(num)?.theme}
      />

      {/* Flashcards Section */}
      {flashcards && flashcards.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Flashcards</h2>
              <p className="text-gray-400 text-sm">Master key concepts with interactive flashcards</p>
            </div>
            {progress?.flashcards_completed && (
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full">
                ✓ Completed
              </span>
            )}
          </div>
          
          <FlashcardClient 
            flashcards={flashcards} 
            chapterId={chapter.id}
            userId={user?.id}
            isCompleted={progress?.flashcards_completed || false}
          />
        </div>
      )}

      {/* Quiz Section */}
      {quiz && questions && questions.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Chapter Quiz</h2>
              <p className="text-gray-400 text-sm">Test your knowledge with {questions.length} questions</p>
            </div>
            {progress?.quiz_completed && (
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full">
                ✓ Completed
              </span>
            )}
          </div>

          <QuizClient
            quiz={quiz}
            questions={questions}
            chapterId={chapter.id}
            userId={user?.id}
            bestAttempt={bestAttempt}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {num > 1 && (
          <Link
            href={`/dashboard/chapters/${num - 1}`}
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            ← Chapter {num - 1}
          </Link>
        )}
        {num < 21 && (
          <Link
            href={`/dashboard/chapters/${num + 1}`}
            className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors ml-auto"
          >
            Chapter {num + 1} →
          </Link>
        )}
      </div>
    </div>
  )
}
