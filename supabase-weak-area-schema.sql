-- ============================================================================
-- WEAK AREA MAPPING + ADAPTIVE LEARNING SYSTEM
-- Database Schema for Supabase
-- Barber Study Pro v2.0
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- QUIZ PERFORMANCE TRACKING
-- ============================================================================

CREATE TABLE quiz_performances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER NOT NULL, -- seconds
    attempts INTEGER DEFAULT 1,
    hints_used INTEGER DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX idx_quiz_performances_user ON quiz_performances(user_id);
CREATE INDEX idx_quiz_performances_chapter ON quiz_performances(chapter_number);
CREATE INDEX idx_quiz_performances_category ON quiz_performances(category);
CREATE INDEX idx_quiz_performances_timestamp ON quiz_performances(timestamp);

-- ============================================================================
-- FLASHCARD PERFORMANCE TRACKING
-- ============================================================================

CREATE TABLE flashcard_performances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    confidence_rating INTEGER CHECK (confidence_rating BETWEEN 1 AND 5),
    time_spent INTEGER NOT NULL, -- seconds
    flip_count INTEGER DEFAULT 1,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flashcard_performances_user ON flashcard_performances(user_id);
CREATE INDEX idx_flashcard_performances_chapter ON flashcard_performances(chapter_number);
CREATE INDEX idx_flashcard_performances_category ON flashcard_performances(category);

-- ============================================================================
-- WEAK AREAS (IDENTIFIED WEAKNESSES)
-- ============================================================================

CREATE TABLE weak_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    concept_id TEXT NOT NULL,
    concept_name TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    weakness_type TEXT CHECK (weakness_type IN ('quiz', 'flashcard', 'both')),
    miss_count INTEGER DEFAULT 0,
    last_attempt TIMESTAMPTZ,
    confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    recommended_actions JSONB DEFAULT '[]',
    related_concepts JSONB DEFAULT '[]',
    next_review_date TIMESTAMPTZ,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, concept_id)
);

CREATE INDEX idx_weak_areas_user ON weak_areas(user_id);
CREATE INDEX idx_weak_areas_priority ON weak_areas(priority);
CREATE INDEX idx_weak_areas_chapter ON weak_areas(chapter_number);
CREATE INDEX idx_weak_areas_resolved ON weak_areas(is_resolved);
CREATE INDEX idx_weak_areas_review ON weak_areas(next_review_date);

-- ============================================================================
-- STUDENT ANALYTICS
-- ============================================================================

CREATE TABLE student_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Study metrics
    total_study_time INTEGER DEFAULT 0, -- minutes
    quizzes_completed INTEGER DEFAULT 0,
    flashcards_reviewed INTEGER DEFAULT 0,
    
    -- Progress tracking
    weak_areas_count INTEGER DEFAULT 0,
    improving_areas_count INTEGER DEFAULT 0,
    mastered_areas_count INTEGER DEFAULT 0,
    
    -- Streak and consistency
    streak_days INTEGER DEFAULT 0,
    last_study_date DATE,
    
    -- Confidence and readiness
    overall_confidence INTEGER CHECK (overall_confidence BETWEEN 0 AND 100),
    exam_readiness INTEGER CHECK (exam_readiness BETWEEN 0 AND 100),
    confidence_trend TEXT CHECK (confidence_trend IN ('improving', 'stable', 'declining')),
    
    -- Adaptive learning
    current_focus JSONB DEFAULT '[]',
    next_milestone TEXT,
    suggested_daily_time INTEGER DEFAULT 20, -- minutes
    
    -- High-risk concepts tracking
    high_risk_weak_areas JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_student_analytics_user ON student_analytics(user_id);
CREATE INDEX idx_student_analytics_readiness ON student_analytics(exam_readiness);

-- ============================================================================
-- CONCEPT DIFFICULTY TRACKING (GLOBAL ANALYTICS)
-- ============================================================================

CREATE TABLE concept_difficulty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concept_id TEXT NOT NULL UNIQUE,
    concept_name TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    category TEXT NOT NULL,
    
    -- Difficulty metrics
    overall_difficulty INTEGER CHECK (overall_difficulty BETWEEN 0 AND 100),
    quiz_failure_rate DECIMAL(5,2), -- percentage
    flashcard_low_confidence_rate DECIMAL(5,2), -- percentage
    avg_time_to_answer INTEGER, -- seconds
    
    -- Risk assessment
    high_risk_for_exam BOOLEAN DEFAULT FALSE,
    
    -- Relationships
    prerequisite_concepts JSONB DEFAULT '[]',
    related_concepts JSONB DEFAULT '[]',
    
    -- Statistics
    total_attempts INTEGER DEFAULT 0,
    unique_students INTEGER DEFAULT 0,
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_concept_difficulty_chapter ON concept_difficulty(chapter_number);
CREATE INDEX idx_concept_difficulty_category ON concept_difficulty(category);
CREATE INDEX idx_concept_difficulty_risk ON concept_difficulty(high_risk_for_exam);

-- ============================================================================
-- STUDY SESSIONS
-- ============================================================================

CREATE TABLE study_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    session_type TEXT CHECK (session_type IN ('quiz', 'flashcard', 'mixed', 'review')),
    chapter_number INTEGER,
    
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration INTEGER, -- minutes
    
    items_completed INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2), -- percentage
    
    weak_areas_addressed JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_date ON study_sessions(start_time);

-- ============================================================================
-- ADAPTIVE LEARNING PATHS
-- ============================================================================

CREATE TABLE adaptive_learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    
    current_focus JSONB DEFAULT '[]',
    recommended_chapters JSONB DEFAULT '[]',
    priority_weak_area_ids JSONB DEFAULT '[]',
    suggested_study_time INTEGER DEFAULT 20,
    next_milestone TEXT,
    confidence_trend TEXT CHECK (confidence_trend IN ('improving', 'stable', 'declining')),
    
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_adaptive_paths_user ON adaptive_learning_paths(user_id);

-- ============================================================================
-- DAILY RECOMMENDATIONS
-- ============================================================================

CREATE TABLE daily_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    focus_area TEXT NOT NULL,
    activities JSONB DEFAULT '[]',
    estimated_time INTEGER,
    priority TEXT,
    
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_recommendations_user ON daily_recommendations(user_id);
CREATE INDEX idx_daily_recommendations_date ON daily_recommendations(date);

-- ============================================================================
-- HIGH-RISK EXAM CONCEPTS MASTER LIST
-- ============================================================================

CREATE TABLE high_risk_exam_concepts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concept_id TEXT NOT NULL UNIQUE,
    concept_name TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    category TEXT NOT NULL,
    risk_level TEXT CHECK (risk_level IN ('high', 'critical')),
    exam_frequency TEXT CHECK (exam_frequency IN ('rare', 'occasional', 'frequent', 'always')),
    description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert high-risk concepts
INSERT INTO high_risk_exam_concepts (concept_id, concept_name, chapter_number, category, risk_level, exam_frequency, description) VALUES
-- Infection Control (Chapter 4)
('universal_precautions', 'Universal Precautions', 4, 'infection-control', 'critical', 'always', 'OSHA required safety standard'),
('bloodborne_pathogens', 'Bloodborne Pathogens', 4, 'infection-control', 'critical', 'always', 'HIV, HBV, HCV safety protocols'),
('sterilization_methods', 'Sterilization Methods', 4, 'infection-control', 'critical', 'frequent', 'Proper tool sterilization techniques'),
('disinfection_procedures', 'Disinfection Procedures', 4, 'infection-control', 'critical', 'always', 'Surface and tool disinfection'),
('contaminated_sharps', 'Contaminated Sharps Handling', 4, 'infection-control', 'critical', 'frequent', 'Safe disposal of blades and needles'),

-- Anatomy (Chapter 6)
('cranial_nerves', 'Cranial Nerves', 6, 'anatomy', 'high', 'frequent', '12 pairs of nerves, especially 5th and 7th'),
('facial_muscles', 'Facial Muscles', 6, 'anatomy', 'high', 'frequent', 'Muscles of expression and mastication'),
('facial_bones', 'Facial Bones', 6, 'anatomy', 'high', 'occasional', '14 bones of the face'),
('circulatory_system', 'Circulatory System', 6, 'anatomy', 'medium', 'occasional', 'Blood flow and facial arteries'),

-- Chemistry (Chapter 7)
('ph_scale', 'pH Scale', 7, 'chemistry', 'high', 'frequent', 'Acid-base balance in products'),
('chemical_reactions', 'Chemical Reactions', 7, 'chemistry', 'high', 'occasional', 'Oxidation, reduction, neutralization'),

-- Electricity (Chapter 8)
('electrical_safety', 'Electrical Safety', 8, 'electricity', 'critical', 'frequent', 'Grounding, circuit protection'),

-- Skin (Chapter 9)
('skin_disorders', 'Skin Disorders', 9, 'skin', 'high', 'frequent', 'Contagious vs non-contagious conditions'),
('contagious_conditions', 'Contagious Conditions', 9, 'skin', 'critical', 'always', 'When to refuse service'),

-- State Board (Chapter 17)
('licensing_requirements', 'Licensing Requirements', 17, 'state-board', 'critical', 'always', 'Hours, exams, renewal'),
('scope_of_practice', 'Scope of Practice', 17, 'state-board', 'critical', 'frequent', 'What barbers can legally do'),
('sanitation_regulations', 'Sanitation Regulations', 17, 'state-board', 'critical', 'always', 'State-specific rules');

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE quiz_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE weak_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_difficulty ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adaptive_learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_recommendations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own quiz performances" 
    ON quiz_performances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz performances" 
    ON quiz_performances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quiz performances" 
    ON quiz_performances FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own flashcard performances" 
    ON flashcard_performances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flashcard performances" 
    ON flashcard_performances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flashcard performances" 
    ON flashcard_performances FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own weak areas" 
    ON weak_areas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weak areas" 
    ON weak_areas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weak areas" 
    ON weak_areas FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own weak areas" 
    ON weak_areas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics" 
    ON student_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own analytics" 
    ON student_analytics FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view concept difficulty" 
    ON concept_difficulty FOR SELECT USING (true); -- Public read

CREATE POLICY "Users can view own study sessions" 
    ON study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own study sessions" 
    ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own learning paths" 
    ON adaptive_learning_paths FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own learning paths" 
    ON adaptive_learning_paths FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations" 
    ON daily_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" 
    ON daily_recommendations FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_quiz_performances_updated_at BEFORE UPDATE ON quiz_performances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_flashcard_performances_updated_at BEFORE UPDATE ON flashcard_performances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_weak_areas_updated_at BEFORE UPDATE ON weak_areas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_analytics_updated_at BEFORE UPDATE ON student_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_adaptive_learning_paths_updated_at BEFORE UPDATE ON adaptive_learning_paths
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate exam readiness
CREATE OR REPLACE FUNCTION calculate_exam_readiness(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_overall_confidence INTEGER;
    v_critical_count INTEGER;
    v_high_count INTEGER;
    v_high_risk_count INTEGER;
    v_readiness INTEGER;
BEGIN
    -- Get overall confidence
    SELECT overall_confidence INTO v_overall_confidence
    FROM student_analytics WHERE user_id = p_user_id;
    
    IF v_overall_confidence IS NULL THEN
        v_overall_confidence := 0;
    END IF;
    
    -- Count weak areas by priority
    SELECT 
        COUNT(*) FILTER (WHERE priority = 'critical'),
        COUNT(*) FILTER (WHERE priority = 'high')
    INTO v_critical_count, v_high_count
    FROM weak_areas 
    WHERE user_id = p_user_id AND is_resolved = FALSE;
    
    -- Count high-risk weak areas
    SELECT COUNT(*) INTO v_high_risk_count
    FROM weak_areas w
    JOIN high_risk_exam_concepts h ON w.category = h.category
    WHERE w.user_id = p_user_id AND w.is_resolved = FALSE;
    
    -- Calculate readiness
    v_readiness := v_overall_confidence;
    v_readiness := v_readiness - (v_critical_count * 10);
    v_readiness := v_readiness - (v_high_count * 5);
    v_readiness := v_readiness - (v_high_risk_count * 8);
    
    RETURN GREATEST(0, LEAST(100, v_readiness));
END;
$$ LANGUAGE plpgsql;

-- Function to update analytics after quiz
CREATE OR REPLACE FUNCTION update_analytics_after_quiz()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or create student analytics
    INSERT INTO student_analytics (user_id, quizzes_completed, last_study_date)
    VALUES (NEW.user_id, 1, CURRENT_DATE)
    ON CONFLICT (user_id) 
    DO UPDATE SET
        quizzes_completed = student_analytics.quizzes_completed + 1,
        last_study_date = CURRENT_DATE,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_analytics_after_quiz
    AFTER INSERT ON quiz_performances
    FOR EACH ROW EXECUTE FUNCTION update_analytics_after_quiz();

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- View: Student weak areas summary
CREATE VIEW student_weak_areas_summary AS
SELECT 
    user_id,
    COUNT(*) as total_weak_areas,
    COUNT(*) FILTER (WHERE priority = 'critical') as critical_count,
    COUNT(*) FILTER (WHERE priority = 'high') as high_count,
    COUNT(*) FILTER (WHERE priority = 'medium') as medium_count,
    COUNT(*) FILTER (WHERE priority = 'low') as low_count,
    COUNT(*) FILTER (WHERE is_resolved = TRUE) as resolved_count,
    AVG(confidence_score) as avg_confidence
FROM weak_areas
GROUP BY user_id;

-- View: Chapter difficulty summary
CREATE VIEW chapter_difficulty_summary AS
SELECT 
    chapter_number,
    COUNT(*) as total_concepts,
    AVG(overall_difficulty) as avg_difficulty,
    AVG(quiz_failure_rate) as avg_failure_rate,
    COUNT(*) FILTER (WHERE high_risk_for_exam = TRUE) as high_risk_count
FROM concept_difficulty
GROUP BY chapter_number;

-- View: Daily study activity
CREATE VIEW daily_study_activity AS
SELECT 
    user_id,
    DATE(start_time) as study_date,
    COUNT(*) as sessions_count,
    SUM(duration) as total_minutes,
    SUM(items_completed) as items_completed,
    AVG(accuracy) as avg_accuracy
FROM study_sessions
GROUP BY user_id, DATE(start_time);

-- ============================================================================
-- SEED DATA FOR CONCEPT DIFFICULTY
-- ============================================================================

INSERT INTO concept_difficulty (concept_id, concept_name, chapter_number, category, overall_difficulty, high_risk_for_exam, prerequisite_concepts) VALUES
('cell-biology', 'Cell Biology', 6, 'cell-biology', 65, FALSE, '[]'),
('skeletal-system', 'Skeletal System', 6, 'skeletal', 70, TRUE, '["cell-biology"]'),
('muscular-system', 'Muscular System', 6, 'muscular', 75, TRUE, '["skeletal-system"]'),
('nervous-system', 'Nervous System', 6, 'nervous', 80, TRUE, '["cell-biology"]'),
('circulatory-system', 'Circulatory System', 6, 'circulatory', 70, FALSE, '["cell-biology"]'),
('infection-control', 'Infection Control', 4, 'infection-control', 60, TRUE, '[]'),
('chemistry-basics', 'Chemistry Basics', 7, 'chemistry', 75, TRUE, '[]'),
('electricity-safety', 'Electrical Safety', 8, 'electricity', 70, TRUE, '[]'),
('skin-structure', 'Skin Structure', 9, 'skin', 65, TRUE, '["cell-biology"]'),
('hair-structure', 'Hair Structure', 10, 'hair', 60, FALSE, '["cell-biology", "skin-structure"]'),
('shaving-techniques', 'Shaving Techniques', 13, 'shaving', 70, FALSE, '["skin-structure", "muscular-system"]'),
('haircutting-methods', 'Haircutting Methods', 14, 'haircutting', 75, FALSE, '["hair-structure"]'),
('state-board-prep', 'State Board Preparation', 17, 'state-board', 80, TRUE, '["infection-control", "anatomy", "chemistry-basics"]');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

COMMENT ON TABLE quiz_performances IS 'Tracks individual quiz question attempts';
COMMENT ON TABLE flashcard_performances IS 'Tracks flashcard review confidence ratings';
COMMENT ON TABLE weak_areas IS 'Identified student weaknesses with priority and recommendations';
COMMENT ON TABLE student_analytics IS 'Aggregated student performance metrics';
COMMENT ON TABLE concept_difficulty IS 'Global difficulty ratings for concepts across all students';
COMMENT ON TABLE study_sessions IS 'Study session tracking for time and progress';
COMMENT ON TABLE adaptive_learning_paths IS 'Personalized learning paths for each student';
COMMENT ON TABLE daily_recommendations IS 'Daily study recommendations';
COMMENT ON TABLE high_risk_exam_concepts IS 'Master list of high-risk state board exam concepts';
