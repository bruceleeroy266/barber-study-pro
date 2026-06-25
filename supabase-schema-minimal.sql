-- ============================================
-- Barber Study Pro V2 — MINIMAL Supabase Schema
-- For: profiles, schools, student_progress, quiz_attempts ONLY
-- Flashcards, quizzes, chapters remain in TypeScript files
-- ============================================

-- ============================================
-- PHASE 1: CREATE ALL TABLES
-- ============================================

-- SCHOOLS
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  contact_email TEXT,
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('active', 'inactive', 'trial')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'apprentice', 'admin')),
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  barber_shop_name TEXT,
  mentor_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STUDENT PROGRESS
-- NOTE: chapter_id is TEXT (not UUID) because chapters are in TypeScript files
CREATE TABLE IF NOT EXISTS public.student_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chapter_id TEXT NOT NULL,
  flashcards_completed BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  best_quiz_score INT,
  last_studied_at TIMESTAMPTZ,
  progress_percentage INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- QUIZ ATTEMPTS
-- NOTE: quiz_id is TEXT (not UUID) because quizzes are in TypeScript files
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_id TEXT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  percentage INT NOT NULL DEFAULT 0,
  answers_json JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PHASE 2: CREATE ALL INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_student_progress_user_id ON public.student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_chapter_id ON public.student_progress(chapter_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_completed_at ON public.quiz_attempts(completed_at DESC);

-- ============================================
-- PHASE 3: CREATE FUNCTIONS
-- ============================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  allowed_role TEXT;
  requested_role TEXT;
BEGIN
  requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  -- Self-registration may only produce student, apprentice, or instructor.
  IF requested_role IN ('student', 'apprentice', 'instructor') THEN
    allowed_role := requested_role;
  ELSE
    allowed_role := 'student';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    allowed_role,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PHASE 4: CREATE TRIGGERS
-- ============================================
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at
  BEFORE UPDATE ON public.student_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PHASE 5: ENABLE RLS
-- ============================================
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PHASE 6: CREATE RLS POLICIES
-- ============================================

-- SCHOOLS POLICIES
CREATE POLICY "Schools are viewable by everyone" ON public.schools
  FOR SELECT USING (true);

CREATE POLICY "Instructors can create schools" ON public.schools
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
    )
  );

CREATE POLICY "School creators can update their school" ON public.schools
  FOR UPDATE USING (created_by = auth.uid());

-- PROFILES POLICIES
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Instructors can read school profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS instructor
      WHERE instructor.id = auth.uid()
      AND instructor.role IN ('instructor', 'admin')
      AND instructor.school_id = profiles.school_id
    )
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- STUDENT PROGRESS POLICIES
CREATE POLICY "Users can read own progress" ON public.student_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can read school student progress" ON public.student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS instructor
      JOIN public.profiles AS student ON student.id = student_progress.user_id
      WHERE instructor.id = auth.uid()
      AND instructor.role IN ('instructor', 'admin')
      AND instructor.school_id = student.school_id
    )
  );

CREATE POLICY "Users can insert own progress" ON public.student_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.student_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- QUIZ ATTEMPTS POLICIES
CREATE POLICY "Users can read own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can read school quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles AS instructor
      JOIN public.profiles AS student ON student.id = quiz_attempts.user_id
      WHERE instructor.id = auth.uid()
      AND instructor.role IN ('instructor', 'admin')
      AND instructor.school_id = student.school_id
    )
  );

CREATE POLICY "Users can insert own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
