-- Barber Study Pro v2.0 - Supabase Database Schema
-- Complete schema with RLS policies for secure multi-tenant education platform

-- ============================================
-- 1. SCHOOLS TABLE
-- ============================================
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    contact_email TEXT,
    subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('active', 'inactive', 'trial')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE schools IS 'Barber schools using the platform';

-- ============================================
-- 2. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth';

-- ============================================
-- 3. CHAPTERS TABLE
-- ============================================
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_number INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE chapters IS 'Barber study chapters (1-21)';

-- ============================================
-- 4. FLASHCARDS TABLE
-- ============================================
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    category TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE flashcards IS 'Study flashcards per chapter';

-- ============================================
-- 5. QUIZZES TABLE
-- ============================================
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quizzes IS 'Quizzes per chapter';

-- ============================================
-- 6. QUIZ QUESTIONS TABLE
-- ============================================
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer_a TEXT NOT NULL,
    answer_b TEXT NOT NULL,
    answer_c TEXT NOT NULL,
    answer_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
    explanation TEXT,
    difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quiz_questions IS 'Individual quiz questions';

-- ============================================
-- 7. QUIZ ATTEMPTS TABLE
-- ============================================
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    answers_json JSONB DEFAULT '{}',
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, quiz_id, completed_at)
);

COMMENT ON TABLE quiz_attempts IS 'Student quiz attempt records';

-- ============================================
-- 8. STUDENT PROGRESS TABLE
-- ============================================
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    flashcards_completed BOOLEAN DEFAULT false,
    quiz_completed BOOLEAN DEFAULT false,
    best_quiz_score INTEGER,
    last_studied_at TIMESTAMPTZ,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, chapter_id)
);

COMMENT ON TABLE student_progress IS 'Tracks student progress per chapter';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_flashcards_chapter_id ON flashcards(chapter_id);
CREATE INDEX idx_quizzes_chapter_id ON quizzes(chapter_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_student_progress_user_id ON student_progress(user_id);
CREATE INDEX idx_student_progress_chapter_id ON student_progress(chapter_id);
CREATE INDEX idx_chapters_number ON chapters(chapter_number);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SCHOOLS POLICIES
-- ============================================
CREATE POLICY "Schools are viewable by all authenticated users"
    ON schools FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins can manage schools"
    ON schools FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- PROFILES POLICIES
-- ============================================
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Instructors can view students in their school"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles instructor
            WHERE instructor.id = auth.uid()
            AND instructor.role = 'instructor'
            AND instructor.school_id = profiles.school_id
        )
    );

CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- CHAPTERS POLICIES (Public read)
-- ============================================
CREATE POLICY "Chapters are viewable by everyone"
    ON chapters FOR SELECT
    USING (is_active = true);

CREATE POLICY "Only admins can manage chapters"
    ON chapters FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- FLASHCARDS POLICIES (Public read)
-- ============================================
CREATE POLICY "Flashcards are viewable by everyone"
    ON flashcards FOR SELECT
    USING (is_active = true);

CREATE POLICY "Only admins can manage flashcards"
    ON flashcards FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- QUIZZES POLICIES (Public read)
-- ============================================
CREATE POLICY "Quizzes are viewable by everyone"
    ON quizzes FOR SELECT
    USING (is_active = true);

CREATE POLICY "Only admins can manage quizzes"
    ON quizzes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- QUIZ QUESTIONS POLICIES (Public read)
-- ============================================
CREATE POLICY "Quiz questions are viewable by everyone"
    ON quiz_questions FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage quiz questions"
    ON quiz_questions FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- QUIZ ATTEMPTS POLICIES (Private to user)
-- ============================================
CREATE POLICY "Users can view own quiz attempts"
    ON quiz_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz attempts"
    ON quiz_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Instructors can view attempts from their school"
    ON quiz_attempts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles instructor
            JOIN profiles student ON student.id = quiz_attempts.user_id
            WHERE instructor.id = auth.uid()
            AND instructor.role = 'instructor'
            AND instructor.school_id = student.school_id
        )
    );

-- ============================================
-- STUDENT PROGRESS POLICIES (Private to user)
-- ============================================
CREATE POLICY "Users can view own progress"
    ON student_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
    ON student_progress FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view progress from their school"
    ON student_progress FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles instructor
            JOIN profiles student ON student.id = student_progress.user_id
            WHERE instructor.id = auth.uid()
            AND instructor.role = 'instructor'
            AND instructor.school_id = student.school_id
        )
    );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA - 21 Barber Chapters
-- ============================================
INSERT INTO chapters (chapter_number, title, description, order_index) VALUES
(1, 'History of Barbering', 'The evolution of barbering from ancient times to modern day', 1),
(2, 'Life Skills', 'Professional development and personal growth for barbers', 2),
(3, 'Professional Image', 'Maintaining professional appearance and conduct', 3),
(4, 'Infection Control', 'Sanitation, disinfection, and safety protocols', 4),
(5, 'Implements, Tools, and Equipment', 'Understanding and maintaining barbering tools', 5),
(6, 'General Anatomy and Physiology', 'Body systems and structures relevant to barbering', 6),
(7, 'Basics of Chemistry', 'Chemical principles for hair products and services', 7),
(8, 'Basics of Electricity', 'Electrical safety and tools in the barbershop', 8),
(9, 'The Skin', 'Structure, disorders, and diseases of the skin', 9),
(10, 'Properties and Disorders of the Hair and Scalp', 'Hair science and common conditions', 10),
(11, 'Treatment of the Hair and Scalp', 'Therapeutic services and treatments', 11),
(12, 'Men''s Facial Massage and Treatments', 'Facial services and massage techniques', 12),
(13, 'Shaving and Facial Hair Design', 'Classic and modern shaving techniques', 13),
(14, 'Men''s Haircutting and Styling', 'Fundamental and advanced cutting techniques', 14),
(15, 'Haircoloring', 'Color theory and application techniques', 15),
(16, 'Chemical Texture Services', 'Perms, relaxers, and curl reforming', 16),
(17, 'State Board Preparation', 'Licensing requirements and exam preparation', 17),
(18, 'Seeking Employment', 'Resume building and job search strategies', 18),
(19, 'Barbershop Management', 'Business operations and management principles', 19),
(20, 'History of Barbering (Advanced)', 'Deep dive into barbering heritage', 20),
(21, 'Working Behind the Chair', 'Real-world professional practice', 21);

-- ============================================
-- SAMPLE FLASHCARDS (Chapter 1 - History)
-- ============================================
INSERT INTO flashcards (chapter_id, front, back, difficulty, order_index) 
SELECT 
    c.id,
    'Where does the word "barber" originate?',
    'From the Latin word "barba" meaning beard.',
    'easy',
    1
FROM chapters c WHERE c.chapter_number = 1;

INSERT INTO flashcards (chapter_id, front, back, difficulty, order_index)
SELECT 
    c.id,
    'What did the barber pole originally represent?',
    'Bloodletting services - the red and white stripes represent bloody and clean bandages.',
    'medium',
    2
FROM chapters c WHERE c.chapter_number = 1;

-- ============================================
-- SAMPLE QUIZ (Chapter 1)
-- ============================================
INSERT INTO quizzes (chapter_id, title, description)
SELECT 
    c.id,
    'Chapter 1: History of Barbering Quiz',
    'Test your knowledge of barbering history'
FROM chapters c WHERE c.chapter_number = 1;

-- Sample quiz questions
INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT 
    q.id,
    'Where does the word "barber" originate from?',
    'Greek word for hair',
    'Latin word "barba" meaning beard',
    'French word for cut',
    'English word for shop',
    'b',
    'The word "barber" comes from the Latin word "barba" meaning beard.',
    'easy',
    1
FROM quizzes q 
JOIN chapters c ON q.chapter_id = c.id 
WHERE c.chapter_number = 1;

INSERT INTO quiz_questions (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer, explanation, difficulty, order_index)
SELECT 
    q.id,
    'When did barbers and surgeons separate into different professions?',
    'Ancient times',
    '1745 in England',
    '20th century',
    'They never separated',
    'b',
    'In 1745, a bill was passed in England separating barbers from surgeons.',
    'medium',
    2
FROM quizzes q 
JOIN chapters c ON q.chapter_id = c.id 
WHERE c.chapter_number = 1;

-- ============================================
-- DEMO SCHOOL
-- ============================================
INSERT INTO schools (name, address, contact_email, subscription_status) VALUES
('Demo Barber School', '123 Education Ave, Oklahoma City, OK', 'admin@demobarberschool.edu', 'active');
