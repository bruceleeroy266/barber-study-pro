export interface Profile {
  id: string
  email: string
  full_name: string
  role: 'student' | 'instructor' | 'admin'
  school_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface School {
  id: string
  name: string
  address: string | null
  contact_email: string | null
  subscription_status: 'active' | 'inactive' | 'trial'
  created_at: string
}

export interface Chapter {
  id: string
  chapter_number: number
  title: string
  description: string | null
  content: string | null
  order_index: number
  is_active: boolean
}

export interface Flashcard {
  id: string
  chapter_id: string
  front: string
  back: string
  category: string | null
  difficulty: 'easy' | 'medium' | 'hard' | null
  order_index: number
  is_active: boolean
}

export interface Quiz {
  id: string
  chapter_id: string
  title: string
  description: string | null
  is_active: boolean
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correct_answer: 'a' | 'b' | 'c' | 'd'
  explanation: string | null
  difficulty: 'easy' | 'medium' | 'hard'
  order_index: number
}

export interface QuizAttempt {
  id: string
  user_id: string
  quiz_id: string
  score: number
  total_questions: number
  percentage: number
  answers_json: Record<string, string>
  completed_at: string
}

export interface StudentProgress {
  id: string
  user_id: string
  chapter_id: string
  flashcards_completed: boolean
  quiz_completed: boolean
  best_quiz_score: number | null
  last_studied_at: string | null
  progress_percentage: number
}

export interface ChapterWithProgress extends Chapter {
  progress?: StudentProgress
  flashcardCount?: number
  quizQuestionCount?: number
}
