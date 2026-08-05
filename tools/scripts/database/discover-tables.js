// Discover all tables in the database and check for user_id references
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  let v = t.slice(eq + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  process.env[t.slice(0, eq).trim()] = v;
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function discoverTables() {
  const tablesToCheck = [
    'profiles', 'student_progress', 'quiz_attempts', 'enrollments',
    'attendance_records', 'notifications', 'audit_log', 'flashcard_progress',
    'lesson_completions', 'user_progress', 'grades', 'user_achievements',
    'user_activity_log', 'user_preferences', 'school_memberships',
    'chapter_progress', 'module_progress', 'exam_attempts', 'exam_results',
    'study_sessions', 'certificates', 'messages', 'announcements',
    'school_settings', 'schools', 'chapters', 'lessons', 'quizzes', 'flashcards',
    'user_roles', 'role_permissions', 'permission_overrides', 'audit_events',
    'security_events', 'login_attempts', 'password_resets', 'email_verifications',
    'user_sessions', 'refresh_tokens', 'api_keys', 'webhooks', 'subscriptions',
    'payments', 'invoices', 'receipts', 'certificates_issued', 'badges',
    'achievements', 'leaderboards', 'study_groups', 'group_members',
    'discussion_posts', 'comments', 'likes', 'bookmarks', 'notes',
    'highlights', 'annotations', 'progress_tracking', 'learning_paths',
    'path_enrollments', 'path_progress', 'competencies', 'skills',
    'skill_assessments', 'skill_progress', 'badges_earned', 'certificates_earned'
  ];

  console.log('=== DISCOVERING TABLES ===\n');
  
  const existingTables = [];
  const missingTables = [];
  
  for (const table of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          missingTables.push(table);
        } else {
          console.log(`⚠ ${table}: ${error.message} (code: ${error.code})`);
          existingTables.push({ name: table, error: error.message });
        }
      } else {
        console.log(`✓ ${table}: ${count} rows`);
        existingTables.push({ name: table, count });
      }
    } catch (err) {
      console.log(`✗ ${table}: ${err.message}`);
      missingTables.push(table);
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log(`Existing tables: ${existingTables.length}`);
  console.log(`Missing tables: ${missingTables.length}`);
  
  console.log('\nExisting tables:');
  existingTables.forEach(t => {
    if (t.error) {
      console.log(`  - ${t.name}: ERROR - ${t.error}`);
    } else {
      console.log(`  - ${t.name}: ${t.count} rows`);
    }
  });
  
  console.log('\nMissing tables (first 20):');
  missingTables.slice(0, 20).forEach(t => console.log(`  - ${t}`));
  if (missingTables.length > 20) {
    console.log(`  ... and ${missingTables.length - 20} more`);
  }
  
  return { existingTables, missingTables };
}

discoverTables().catch(console.error);
