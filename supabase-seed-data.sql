-- ============================================
-- BARBER STUDY PRO V2 - SEED DATA MIGRATION
-- ============================================
-- Run this AFTER creating the schema (supabase-schema.sql)
-- This imports all demo data into real Supabase tables

-- ============================================
-- 1. SEED CHAPTERS (21 chapters)
-- ============================================
INSERT INTO chapters (chapter_number, title, description, order_index, is_active) VALUES
(1, 'History of Barbering', 'Explore the rich history and evolution of the barbering profession from ancient times to modern day.', 1, true),
(2, 'Life Skills', 'Develop essential life skills including time management, communication, and professional ethics.', 2, true),
(3, 'Professional Image', 'Learn how to maintain a professional appearance and build a strong personal brand.', 3, true),
(4, 'Infection Control', 'Master sanitation, sterilization, and infection control practices to ensure client safety.', 4, true),
(5, 'Implements, Tools, and Equipment', 'Identify and properly use barbering tools including clippers, shears, razors, and more.', 5, true),
(6, 'General Anatomy and Physiology', 'Understand the structure and function of the human body systems relevant to barbering.', 6, true),
(7, 'Basics of Chemistry', 'Learn the chemical principles behind hair products, coloring, and chemical services.', 7, true),
(8, 'Basics of Electricity', 'Understand electrical safety and the use of electrical equipment in the barbershop.', 8, true),
(9, 'The Skin – Structure, Disorders, and Diseases', 'Study skin anatomy, common disorders, and diseases relevant to barbering services.', 9, true),
(10, 'Properties and Disorders of the Hair and Scalp', 'Learn about hair structure, growth cycles, and common scalp conditions.', 10, true),
(11, 'Treatment of the Hair and Scalp', 'Master hair and scalp treatments including conditioning, medicated treatments, and scalp massages.', 11, true),
(12, 'Men''s Facial Massage and Treatments', 'Learn facial massage techniques and treatments specifically designed for male clients.', 12, true),
(13, 'Shaving and Facial-Hair Design', 'Master the art of shaving, beard shaping, and facial hair design techniques.', 13, true),
(14, 'Men''s Haircutting and Styling', 'Learn fundamental and advanced men''s haircutting and styling techniques.', 14, true),
(15, 'Men''s Chemical Services', 'Understand chemical processes including perms, relaxers, and hair coloring for men.', 15, true),
(16, 'Women''s Haircutting', 'Master women''s haircutting techniques, layering, and styling approaches.', 16, true),
(17, 'Barbershop Management', 'Learn the business side of barbering including shop management and operations.', 17, true),
(18, 'Advanced Cutting Techniques', 'Master advanced cutting techniques including fades, tapers, and texturizing.', 18, true),
(19, 'Hair Replacement Systems', 'Explore hair replacement options, toupees, and non-surgical hair restoration.', 19, true),
(20, 'Color Theory and Application', 'Deep dive into hair color theory, formulation, and application techniques.', 20, true),
(21, 'Final Exam Preparation', 'Comprehensive final exam preparation with practice tests and review materials.', 21, true)
ON CONFLICT (chapter_number) DO NOTHING;

-- ============================================
-- 2. SEED QUIZZES (one per chapter)
-- ============================================
-- Note: Run this AFTER chapters are inserted to get UUIDs
-- This requires a follow-up script or manual insertion

-- ============================================
-- 3. SEED FLASHCARDS
-- ============================================
-- Flashcards must be inserted per-chapter using chapter UUIDs
-- The TypeScript data files contain 967 flashcards total
-- Use the seed script (scripts/seed-supabase.js) to import from JSON

-- ============================================
-- 4. SEED QUIZ QUESTIONS
-- ============================================
-- Quiz questions must be inserted per-quiz using quiz UUIDs
-- The TypeScript data files contain 50+ questions (Ch 1-2 complete)
-- Use the seed script (scripts/seed-supabase.js) to import from JSON

-- ============================================
-- NOTE: For bulk data import, use:
-- 1. Export demo-data.ts to JSON
-- 2. Use Supabase Dashboard CSV import, OR
-- 3. Run the Node.js seed script
-- ============================================
