// Demo data for soft launch without Supabase
// This provides safe mock data when NEXT_PUBLIC_DEMO_MODE=true

import { Chapter, Flashcard, Quiz, QuizQuestion, QuizAttempt, StudentProgress, Profile } from '@/types'

export const demoUser = {
  id: 'demo-user',
  email: 'demo@barberstudypro.test',
  role: 'admin' as const,
}

export const demoProfile: Profile = {
  id: 'demo-user',
  email: 'demo@barberstudypro.test',
  full_name: 'Demo Student',
  role: 'admin',
  school_id: null,
  avatar_url: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

export const demoChapters: Chapter[] = [
  { id: 'ch-1', chapter_number: 1, title: 'History of Barbering', description: 'Explore the rich history and evolution of the barbering profession from ancient times to modern day.', content: null, order_index: 1, is_active: true },
  { id: 'ch-2', chapter_number: 2, title: 'Life Skills', description: 'Develop essential life skills including time management, communication, and professional ethics.', content: null, order_index: 2, is_active: true },
  { id: 'ch-3', chapter_number: 3, title: 'Professional Image', description: 'Learn how to maintain a professional appearance and build a strong personal brand.', content: null, order_index: 3, is_active: true },
  { id: 'ch-4', chapter_number: 4, title: 'Infection Control', description: 'Master sanitation, sterilization, and infection control practices to ensure client safety.', content: null, order_index: 4, is_active: true },
  { id: 'ch-5', chapter_number: 5, title: 'Implements, Tools, and Equipment', description: 'Identify and properly use barbering tools including clippers, shears, razors, and more.', content: null, order_index: 5, is_active: true },
  { id: 'ch-6', chapter_number: 6, title: 'General Anatomy and Physiology', description: 'Understand the structure and function of the human body systems relevant to barbering.', content: null, order_index: 6, is_active: true },
  { id: 'ch-7', chapter_number: 7, title: 'Basics of Chemistry', description: 'Learn the chemical principles behind hair products, coloring, and chemical services.', content: null, order_index: 7, is_active: true },
  { id: 'ch-8', chapter_number: 8, title: 'Basics of Electricity', description: 'Understand electrical safety and the use of electrical equipment in the barbershop.', content: null, order_index: 8, is_active: true },
  { id: 'ch-9', chapter_number: 9, title: 'The Skin – Structure, Disorders, and Diseases', description: 'Study skin anatomy, common disorders, and diseases relevant to barbering services.', content: null, order_index: 9, is_active: true },
  { id: 'ch-10', chapter_number: 10, title: 'Properties and Disorders of the Hair and Scalp', description: 'Learn about hair structure, growth cycles, and common scalp conditions.', content: null, order_index: 10, is_active: true },
  { id: 'ch-11', chapter_number: 11, title: 'Treatment of the Hair and Scalp', description: 'Master hair and scalp treatments including conditioning, medicated treatments, and scalp massages.', content: null, order_index: 11, is_active: true },
  { id: 'ch-12', chapter_number: 12, title: "Men's Facial Massage and Treatments", description: 'Learn facial massage techniques and treatments specifically designed for male clients.', content: null, order_index: 12, is_active: true },
  { id: 'ch-13', chapter_number: 13, title: 'Shaving and Facial-Hair Design', description: 'Master the art of shaving, beard shaping, and facial hair design techniques.', content: null, order_index: 13, is_active: true },
  { id: 'ch-14', chapter_number: 14, title: 'Men\'s Haircutting and Styling', description: 'Learn fundamental and advanced men\'s haircutting and styling techniques.', content: null, order_index: 14, is_active: true },
  { id: 'ch-15', chapter_number: 15, title: 'Men\'s Chemical Services', description: 'Understand chemical processes including perms, relaxers, and hair coloring for men.', content: null, order_index: 15, is_active: true },
  { id: 'ch-16', chapter_number: 16, title: 'State Board Preparation', description: 'Prepare for your state board examination with comprehensive review materials.', content: null, order_index: 16, is_active: true },
  { id: 'ch-17', chapter_number: 17, title: 'Barbershop Management', description: 'Learn the business side of barbering including shop management and operations.', content: null, order_index: 17, is_active: true },
  { id: 'ch-18', chapter_number: 18, title: 'Advanced Cutting Techniques', description: 'Master advanced cutting techniques including fades, tapers, and texturizing.', content: null, order_index: 18, is_active: true },
  { id: 'ch-19', chapter_number: 19, title: 'Hair Replacement Systems', description: 'Explore hair replacement options, toupees, and non-surgical hair restoration.', content: null, order_index: 19, is_active: true },
  { id: 'ch-20', chapter_number: 20, title: 'Color Theory and Application', description: 'Deep dive into hair color theory, formulation, and application techniques.', content: null, order_index: 20, is_active: true },
  { id: 'ch-21', chapter_number: 21, title: 'Final Exam Preparation', description: 'Comprehensive final exam preparation with practice tests and review materials.', content: null, order_index: 21, is_active: true },
]

export const demoFlashcards: Record<string, Flashcard[]> = {
  'ch-1': [
    { id: 'fc-1-1', chapter_id: 'ch-1', front: 'What is the origin of the word "barber"?', back: 'From the Latin word "barba" meaning beard.', category: 'History', difficulty: 'easy', order_index: 1, is_active: true },
    { id: 'fc-1-2', chapter_id: 'ch-1', front: 'When did barbering begin?', back: 'Barbering dates back to ancient Egypt around 5000 BC.', category: 'History', difficulty: 'easy', order_index: 2, is_active: true },
    { id: 'fc-1-3', chapter_id: 'ch-1', front: 'What was a barber-surgeon?', back: 'A practitioner who performed both haircuts and medical procedures like bloodletting and dentistry.', category: 'History', difficulty: 'medium', order_index: 3, is_active: true },
    { id: 'fc-1-4', chapter_id: 'ch-1', front: 'What does the barber pole represent?', back: 'The red and white stripes represent blood and bandages from the barber-surgeon era.', category: 'History', difficulty: 'medium', order_index: 4, is_active: true },
    { id: 'fc-1-5', chapter_id: 'ch-1', front: 'When did barbering become a separate profession from surgery?', back: 'In 1745 in England, when barbers and surgeons formed separate guilds.', category: 'History', difficulty: 'hard', order_index: 5, is_active: true },
  ],
  'ch-2': [
    { id: 'fc-2-1', chapter_id: 'ch-2', front: 'What are the key life skills for a barber?', back: 'Communication, time management, goal setting, and stress management.', category: 'Life Skills', difficulty: 'easy', order_index: 1, is_active: true },
    { id: 'fc-2-2', chapter_id: 'ch-2', front: 'Why is time management important in barbering?', back: 'It ensures efficient scheduling, reduces client wait times, and maximizes income.', category: 'Life Skills', difficulty: 'easy', order_index: 2, is_active: true },
    { id: 'fc-2-3', chapter_id: 'ch-2', front: 'What is SMART goal setting?', back: 'Specific, Measurable, Achievable, Relevant, Time-bound goals.', category: 'Life Skills', difficulty: 'medium', order_index: 3, is_active: true },
  ],
}

// Generate flashcards for remaining chapters (minimal)
for (let i = 3; i <= 21; i++) {
  const chId = `ch-${i}`
  if (!demoFlashcards[chId]) {
    demoFlashcards[chId] = [
      { id: `fc-${i}-1`, chapter_id: chId, front: `Key concept from Chapter ${i}`, back: `This is a demo flashcard for Chapter ${i}. Real content will be loaded when Supabase is connected.`, category: 'General', difficulty: 'easy', order_index: 1, is_active: true },
      { id: `fc-${i}-2`, chapter_id: chId, front: `Important term from Chapter ${i}`, back: `This is another demo flashcard for Chapter ${i}.`, category: 'General', difficulty: 'easy', order_index: 2, is_active: true },
      { id: `fc-${i}-3`, chapter_id: chId, front: `Study point for Chapter ${i}`, back: `Demo content - will be replaced with real data.`, category: 'General', difficulty: 'medium', order_index: 3, is_active: true },
    ]
  }
}

export const demoQuizzes: Record<string, Quiz> = {
  'ch-1': { id: 'quiz-1', chapter_id: 'ch-1', title: 'History of Barbering Quiz', description: 'Test your knowledge of barbering history.', is_active: true },
  'ch-2': { id: 'quiz-2', chapter_id: 'ch-2', title: 'Life Skills Quiz', description: 'Test your understanding of essential life skills.', is_active: true },
}

for (let i = 3; i <= 21; i++) {
  const chId = `ch-${i}`
  if (!demoQuizzes[chId]) {
    demoQuizzes[chId] = { id: `quiz-${i}`, chapter_id: chId, title: `Chapter ${i} Quiz`, description: `Test your knowledge of Chapter ${i}.`, is_active: true }
  }
}

export const demoQuizQuestions: Record<string, QuizQuestion[]> = {
  'quiz-1': [
    { id: 'qq-1-1', quiz_id: 'quiz-1', question: 'What is the origin of the word "barber"?', answer_a: 'Greek word for "hair"', answer_b: 'Latin word "barba" meaning beard', answer_c: 'French word for "cutter"', answer_d: 'English word for "stylist"', correct_answer: 'b', explanation: 'The word barber comes from the Latin "barba" meaning beard.', difficulty: 'easy', order_index: 1 },
    { id: 'qq-1-2', quiz_id: 'quiz-1', question: 'When did barber-surgeons exist?', answer_a: '19th century', answer_b: 'Renaissance period through 18th century', answer_c: 'Ancient Egypt only', answer_d: '20th century', correct_answer: 'b', explanation: 'Barber-surgeons existed from the Renaissance period until they were separated into distinct professions in 1745.', difficulty: 'medium', order_index: 2 },
    { id: 'qq-1-3', quiz_id: 'quiz-1', question: 'What do the colors on a barber pole represent?', answer_a: 'American flag colors', answer_b: 'Blood and bandages from barber-surgeons', answer_c: 'Hair colors', answer_d: 'Shop branding', correct_answer: 'b', explanation: 'The red represents blood and white represents bandages from the barber-surgeon era.', difficulty: 'easy', order_index: 3 },
    { id: 'qq-1-4', quiz_id: 'quiz-1', question: 'In what year did barbers and surgeons separate in England?', answer_a: '1600', answer_b: '1745', answer_c: '1900', answer_d: '1500', correct_answer: 'b', explanation: 'Barbers and surgeons formed separate guilds in England in 1745.', difficulty: 'medium', order_index: 4 },
    { id: 'qq-1-5', quiz_id: 'quiz-1', question: 'Which ancient civilization practiced barbering around 5000 BC?', answer_a: 'Rome', answer_b: 'Greece', answer_c: 'Egypt', answer_d: 'China', correct_answer: 'c', explanation: 'Ancient Egyptians practiced barbering as early as 5000 BC.', difficulty: 'easy', order_index: 5 },
  ],
  'quiz-2': [
    { id: 'qq-2-1', quiz_id: 'quiz-2', question: 'What does the "S" in SMART goals stand for?', answer_a: 'Simple', answer_b: 'Specific', answer_c: 'Strategic', answer_d: 'Short-term', correct_answer: 'b', explanation: 'SMART stands for Specific, Measurable, Achievable, Relevant, Time-bound.', difficulty: 'easy', order_index: 1 },
    { id: 'qq-2-2', quiz_id: 'quiz-2', question: 'Why is communication important for barbers?', answer_a: 'Only for scheduling', answer_b: 'To understand client needs and build relationships', answer_c: 'Not important', answer_d: 'Only for complaints', correct_answer: 'b', explanation: 'Good communication helps barbers understand client needs and build lasting relationships.', difficulty: 'easy', order_index: 2 },
  ],
}

for (let i = 3; i <= 21; i++) {
  const quizId = `quiz-${i}`
  if (!demoQuizQuestions[quizId]) {
    demoQuizQuestions[quizId] = [
      { id: `qq-${i}-1`, quiz_id: quizId, question: `Demo question 1 for Chapter ${i}`, answer_a: 'Option A', answer_b: 'Option B', answer_c: 'Option C', answer_d: 'Option D', correct_answer: 'a', explanation: `This is a demo question for Chapter ${i}.`, difficulty: 'easy', order_index: 1 },
      { id: `qq-${i}-2`, quiz_id: quizId, question: `Demo question 2 for Chapter ${i}`, answer_a: 'Option A', answer_b: 'Option B', answer_c: 'Option C', answer_d: 'Option D', correct_answer: 'b', explanation: `This is another demo question for Chapter ${i}.`, difficulty: 'easy', order_index: 2 },
      { id: `qq-${i}-3`, quiz_id: quizId, question: `Demo question 3 for Chapter ${i}`, answer_a: 'Option A', answer_b: 'Option B', answer_c: 'Option C', answer_d: 'Option D', correct_answer: 'c', explanation: `Demo explanation for Chapter ${i}.`, difficulty: 'medium', order_index: 3 },
    ]
  }
}

export const demoProgress: StudentProgress[] = [
  { id: 'prog-1', user_id: 'demo-user', chapter_id: 'ch-1', flashcards_completed: true, quiz_completed: true, best_quiz_score: 100, last_studied_at: '2026-05-17T10:00:00Z', progress_percentage: 100 },
  { id: 'prog-2', user_id: 'demo-user', chapter_id: 'ch-2', flashcards_completed: true, quiz_completed: false, best_quiz_score: null, last_studied_at: '2026-05-17T11:00:00Z', progress_percentage: 50 },
]

export const demoQuizAttempts: QuizAttempt[] = [
  { id: 'attempt-1', user_id: 'demo-user', quiz_id: 'quiz-1', score: 5, total_questions: 5, percentage: 100, answers_json: { 'qq-1-1': 'b', 'qq-1-2': 'b', 'qq-1-3': 'b', 'qq-1-4': 'b', 'qq-1-5': 'c' }, completed_at: '2026-05-17T10:30:00Z' },
]

// Helper to get all flashcards for a chapter
export function getDemoFlashcards(chapterId: string): Flashcard[] {
  return demoFlashcards[chapterId] || []
}

// Helper to get quiz for a chapter
export function getDemoQuiz(chapterId: string): Quiz | null {
  return demoQuizzes[chapterId] || null
}

// Helper to get quiz questions
export function getDemoQuizQuestions(quizId: string): QuizQuestion[] {
  return demoQuizQuestions[quizId] || []
}

// Helper to get progress for user
export function getDemoProgress(userId: string): StudentProgress[] {
  if (userId !== 'demo-user') return []
  return demoProgress
}

// Helper to get quiz attempts for user
export function getDemoQuizAttempts(userId: string): QuizAttempt[] {
  if (userId !== 'demo-user') return []
  return demoQuizAttempts
}
