-- ASCYN PRO — Demo Accounts Creation Script
-- Run in Supabase SQL Editor to create demo accounts for NABBA conference
-- Date: 2026-08-09

-- ============================================
-- 1. CREATE DEMO SCHOOL
-- ============================================

INSERT INTO schools (
  id,
  name,
  address,
  city,
  state,
  postal_code,
  contact_email,
  contact_phone,
  website,
  timezone,
  license_number,
  accreditation,
  school_type,
  subscription_status,
  created_by,
  created_at
) VALUES (
  'demo-school-nabba',
  'NABBA Demo Academy',
  '123 Conference Lane',
  'Oklahoma City',
  'OK',
  '73102',
  'demo@nabbaacademy.test',
  '(405) 555-0123',
  'https://nabbaacademy.test',
  'America/Chicago',
  'OK-BARBER-2026-DEMO',
  'NACCAS',
  'barber',
  'trial',
  'demo-admin',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CREATE DEMO PROFILES
-- ============================================

-- Demo Student Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  school_id,
  approval_status,
  is_disabled,
  requires_password_change,
  created_at,
  updated_at
) VALUES (
  'demo-student-nabba',
  'demo-student@ascynpro.com',
  'Demo Student',
  'student',
  'demo-school-nabba',
  'approved',
  false,
  false,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Demo Instructor Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  school_id,
  approval_status,
  is_disabled,
  requires_password_change,
  created_at,
  updated_at
) VALUES (
  'demo-instructor-nabba',
  'demo-instructor@ascynpro.com',
  'Demo Instructor',
  'instructor',
  'demo-school-nabba',
  'approved',
  false,
  false,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Demo Admin Profile
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  school_id,
  approval_status,
  is_disabled,
  requires_password_change,
  created_at,
  updated_at
) VALUES (
  'demo-admin-nabba',
  'demo-admin@ascynpro.com',
  'Demo Admin',
  'admin',
  'demo-school-nabba',
  'approved',
  false,
  false,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. CREATE DEMO STUDENT ROSTER
-- ============================================

-- Alex Johnson — Strong student
INSERT INTO profiles (
  id, email, full_name, role, school_id, approval_status, is_disabled, requires_password_change, created_at, updated_at
) VALUES (
  'demo-student-alex', 'alex@nabbaacademy.test', 'Alex Johnson', 'student', 'demo-school-nabba', 'approved', false, false, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Maria Garcia — Moderate student
INSERT INTO profiles (
  id, email, full_name, role, school_id, approval_status, is_disabled, requires_password_change, created_at, updated_at
) VALUES (
  'demo-student-maria', 'maria@nabbaacademy.test', 'Maria Garcia', 'student', 'demo-school-nabba', 'approved', false, false, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Jordan Smith — Struggling student
INSERT INTO profiles (
  id, email, full_name, role, school_id, approval_status, is_disabled, requires_password_change, created_at, updated_at
) VALUES (
  'demo-student-jordan', 'jordan@nabbaacademy.test', 'Jordan Smith', 'student', 'demo-school-nabba', 'approved', false, false, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Taylor Williams — Average student
INSERT INTO profiles (
  id, email, full_name, role, school_id, approval_status, is_disabled, requires_password_change, created_at, updated_at
) VALUES (
  'demo-student-taylor', 'taylor@nabbaacademy.test', 'Taylor Williams', 'student', 'demo-school-nabba', 'approved', false, false, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Riley Brown — Improving student
INSERT INTO profiles (
  id, email, full_name, role, school_id, approval_status, is_disabled, requires_password_change, created_at, updated_at
) VALUES (
  'demo-student-riley', 'riley@nabbaacademy.test', 'Riley Brown', 'student', 'demo-school-nabba', 'approved', false, false, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- Morgan Lee — Advanced student
INSERT INTO profiles (
  id, email, full_name, role, school_id, approval_status, is_disabled, requires_password_change, created_at, updated_at
) VALUES (
  'demo-student-morgan', 'morgan@nabbaacademy.test', 'Morgan Lee', 'student', 'demo-school-nabba', 'approved', false, false, NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CREATE DEMO PROGRESS RECORDS
-- ============================================

-- Alex Johnson progress (strong)
INSERT INTO student_progress (id, user_id, chapter_id, flashcards_completed, quiz_completed, best_quiz_score, last_studied_at, progress_percentage)
SELECT 
  'prog-alex-' || chapter_id,
  'demo-student-alex',
  chapter_id,
  true,
  true,
  85 + (random() * 15)::int,
  NOW() - (random() * interval '7 days'),
  100
FROM chapters WHERE chapter_number <= 5
ON CONFLICT (id) DO NOTHING;

-- Maria Garcia progress (moderate)
INSERT INTO student_progress (id, user_id, chapter_id, flashcards_completed, quiz_completed, best_quiz_score, last_studied_at, progress_percentage)
SELECT 
  'prog-maria-' || chapter_id,
  'demo-student-maria',
  chapter_id,
  true,
  true,
  70 + (random() * 15)::int,
  NOW() - (random() * interval '14 days'),
  100
FROM chapters WHERE chapter_number <= 3
ON CONFLICT (id) DO NOTHING;

-- Jordan Smith progress (struggling)
INSERT INTO student_progress (id, user_id, chapter_id, flashcards_completed, quiz_completed, best_quiz_score, last_studied_at, progress_percentage)
SELECT 
  'prog-jordan-' || chapter_id,
  'demo-student-jordan',
  chapter_id,
  true,
  false,
  45 + (random() * 20)::int,
  NOW() - (random() * interval '21 days'),
  60
FROM chapters WHERE chapter_number <= 2
ON CONFLICT (id) DO NOTHING;

-- Taylor Williams progress (average)
INSERT INTO student_progress (id, user_id, chapter_id, flashcards_completed, quiz_completed, best_quiz_score, last_studied_at, progress_percentage)
SELECT 
  'prog-taylor-' || chapter_id,
  'demo-student-taylor',
  chapter_id,
  true,
  true,
  75 + (random() * 10)::int,
  NOW() - (random() * interval '10 days'),
  100
FROM chapters WHERE chapter_number <= 4
ON CONFLICT (id) DO NOTHING;

-- Riley Brown progress (improving)
INSERT INTO student_progress (id, user_id, chapter_id, flashcards_completed, quiz_completed, best_quiz_score, last_studied_at, progress_percentage)
SELECT 
  'prog-riley-' || chapter_id,
  'demo-student-riley',
  chapter_id,
  true,
  true,
  60 + (random() * 20)::int,
  NOW() - (random() * interval '5 days'),
  100
FROM chapters WHERE chapter_number <= 3
ON CONFLICT (id) DO NOTHING;

-- Morgan Lee progress (advanced)
INSERT INTO student_progress (id, user_id, chapter_id, flashcards_completed, quiz_completed, best_quiz_score, last_studied_at, progress_percentage)
SELECT 
  'prog-morgan-' || chapter_id,
  'demo-student-morgan',
  chapter_id,
  true,
  true,
  85 + (random() * 15)::int,
  NOW() - (random() * interval '3 days'),
  100
FROM chapters WHERE chapter_number <= 6
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CREATE DEMO QUIZ ATTEMPTS
-- ============================================

-- Alex Johnson quiz attempts
INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total_questions, percentage, answers_json, completed_at)
SELECT 
  'attempt-alex-' || quiz_id,
  'demo-student-alex',
  quiz_id,
  (total_questions * 0.85)::int + (random() * total_questions * 0.15)::int,
  total_questions,
  85 + (random() * 15)::int,
  '{}',
  NOW() - (random() * interval '7 days')
FROM quizzes WHERE chapter_id IN (SELECT id FROM chapters WHERE chapter_number <= 5)
ON CONFLICT (id) DO NOTHING;

-- Maria Garcia quiz attempts
INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total_questions, percentage, answers_json, completed_at)
SELECT 
  'attempt-maria-' || quiz_id,
  'demo-student-maria',
  quiz_id,
  (total_questions * 0.70)::int + (random() * total_questions * 0.15)::int,
  total_questions,
  70 + (random() * 15)::int,
  '{}',
  NOW() - (random() * interval '14 days')
FROM quizzes WHERE chapter_id IN (SELECT id FROM chapters WHERE chapter_number <= 3)
ON CONFLICT (id) DO NOTHING;

-- Jordan Smith quiz attempts
INSERT INTO quiz_attempts (id, user_id, quiz_id, score, total_questions, percentage, answers_json, completed_at)
SELECT 
  'attempt-jordan-' || quiz_id,
  'demo-student-jordan',
  quiz_id,
  (total_questions * 0.45)::int + (random() * total_questions * 0.20)::int,
  total_questions,
  45 + (random() * 20)::int,
  '{}',
  NOW() - (random() * interval '21 days')
FROM quizzes WHERE chapter_id IN (SELECT id FROM chapters WHERE chapter_number <= 2)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. CREATE DEMO INSTRUCTOR NOTES
-- ============================================

INSERT INTO instructor_notes (id, instructor_id, student_id, note_text, note_type, follow_up_date, created_at)
VALUES
  ('note-1', 'demo-instructor-nabba', 'demo-student-jordan', 'Struggling with infection control concepts. Scheduled 1:1 review session.', 'intervention', NOW() + interval '3 days', NOW()),
  ('note-2', 'demo-instructor-nabba', 'demo-student-maria', 'Showing improvement in state rules. Continue current study plan.', 'progress', NOW() + interval '7 days', NOW()),
  ('note-3', 'demo-instructor-nabba', 'demo-student-alex', 'Excellent progress. Consider advanced placement.', 'achievement', NULL, NOW()),
  ('note-4', 'demo-instructor-nabba', 'demo-student-riley', 'Retest showed improvement. Keep up the good work.', 'progress', NOW() + interval '5 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. CREATE DEMO ATTENDANCE RECORDS
-- ============================================

INSERT INTO attendance_records (id, student_id, school_id, date, status, hours_logged, created_at)
SELECT 
  'att-' || s.id || '-' || (CURRENT_DATE - (random() * 30)::int),
  s.id,
  'demo-school-nabba',
  CURRENT_DATE - (random() * 30)::int,
  CASE WHEN random() > 0.1 THEN 'present' ELSE 'absent' END,
  6 + (random() * 4)::int,
  NOW()
FROM profiles s
WHERE s.school_id = 'demo-school-nabba' AND s.role = 'student'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. CREATE DEMO HOUR LOGS
-- ============================================

INSERT INTO hour_logs (id, student_id, school_id, date, category, hours, description, approved_by, approved_at, created_at)
SELECT 
  'hours-' || s.id || '-' || (CURRENT_DATE - (random() * 30)::int),
  s.id,
  'demo-school-nabba',
  CURRENT_DATE - (random() * 30)::int,
  (ARRAY['Theory', 'Practical', 'Clinic', 'Sanitation'])[floor(random() * 4 + 1)],
  2 + (random() * 6)::int,
  'Demo hour log entry',
  'demo-instructor-nabba',
  NOW(),
  NOW()
FROM profiles s
WHERE s.school_id = 'demo-school-nabba' AND s.role = 'student'
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 9. VERIFICATION QUERIES
-- ============================================

-- Verify demo school
SELECT 'School' as type, COUNT(*) as count FROM schools WHERE id = 'demo-school-nabba';

-- Verify demo profiles
SELECT 'Profiles' as type, role, COUNT(*) as count FROM profiles WHERE school_id = 'demo-school-nabba' GROUP BY role;

-- Verify demo progress
SELECT 'Progress' as type, COUNT(*) as count FROM student_progress sp JOIN profiles p ON sp.user_id = p.id WHERE p.school_id = 'demo-school-nabba';

-- Verify demo quiz attempts
SELECT 'Quiz Attempts' as type, COUNT(*) as count FROM quiz_attempts qa JOIN profiles p ON qa.user_id = p.id WHERE p.school_id = 'demo-school-nabba';

-- Verify demo notes
SELECT 'Notes' as type, COUNT(*) as count FROM instructor_notes WHERE instructor_id = 'demo-instructor-nabba';

-- ============================================
-- 10. CLEANUP (if needed)
-- ============================================

-- Uncomment to remove demo data:
-- DELETE FROM hour_logs WHERE school_id = 'demo-school-nabba';
-- DELETE FROM attendance_records WHERE school_id = 'demo-school-nabba';
-- DELETE FROM instructor_notes WHERE instructor_id = 'demo-instructor-nabba';
-- DELETE FROM quiz_attempts WHERE user_id IN (SELECT id FROM profiles WHERE school_id = 'demo-school-nabba');
-- DELETE FROM student_progress WHERE user_id IN (SELECT id FROM profiles WHERE school_id = 'demo-school-nabba');
-- DELETE FROM profiles WHERE school_id = 'demo-school-nabba';
-- DELETE FROM schools WHERE id = 'demo-school-nabba';
