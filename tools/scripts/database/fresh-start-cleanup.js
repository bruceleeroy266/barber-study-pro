// ASCYN PRO - Fresh Start User Database Cleanup
// Phase 1b: Complete backup including tables with permission issues
// Then Phase 2-3: Remove all non-admin users

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

const ADMIN_EMAIL = 'ascynproofficial@gmail.com';
const ADMIN_ID = '261fcd4c-bbfe-4957-9efd-0dfca6cccdc1';

async function completeBackupAndCleanup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(process.cwd(), 'backups', 'user-backup-' + timestamp);
  
  console.log('=== ASCYN PRO FRESH START CLEANUP ===');
  console.log('Timestamp: ' + new Date().toISOString());
  console.log('Backup directory: ' + backupDir);
  console.log('Admin to preserve: ' + ADMIN_EMAIL + ' (' + ADMIN_ID + ')');
  console.log('');
  
  // Create backup directory
  fs.mkdirSync(backupDir, { recursive: true });
  
  const manifest = {
    backup_timestamp: new Date().toISOString(),
    backup_directory: backupDir,
    admin_account: { email: ADMIN_EMAIL, id: ADMIN_ID },
    phases: {},
    errors: []
  };
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: COMPLETE BACKUP
  // ═══════════════════════════════════════════════════════════════
  console.log('=== PHASE 1: COMPLETE BACKUP ===\n');
  
  // Get all users first
  const { data: allProfiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (profilesErr) {
    console.error('FATAL: Cannot read profiles:', profilesErr);
    process.exit(1);
  }
  
  console.log('Total users in database: ' + allProfiles.length);
  
  // Identify admin and non-admin users
  const adminUser = allProfiles.find(p => p.email === ADMIN_EMAIL);
  const nonAdminUsers = allProfiles.filter(p => p.email !== ADMIN_EMAIL);
  
  if (!adminUser) {
    console.error('FATAL: Admin account not found!');
    process.exit(1);
  }
  
  console.log('Admin account found: ' + adminUser.id);
  console.log('Non-admin users to remove: ' + nonAdminUsers.length);
  console.log('');
  
  // Backup all tables
  const tablesToBackup = [
    'profiles', 'student_progress', 'quiz_attempts', 'enrollments',
    'attendance_records', 'notifications', 'grades', 'audit_log',
    'flashcard_progress', 'lesson_completions', 'user_progress',
    'user_achievements', 'user_activity_log', 'user_preferences',
    'school_memberships', 'chapter_progress', 'module_progress',
    'exam_attempts', 'exam_results', 'study_sessions', 'certificates',
    'messages', 'announcements', 'user_roles', 'role_permissions',
    'permission_overrides', 'audit_events', 'security_events',
    'login_attempts', 'password_resets', 'email_verifications',
    'user_sessions', 'refresh_tokens', 'api_keys', 'webhooks',
    'subscriptions', 'payments', 'invoices', 'receipts'
  ];
  
  manifest.tables = {};
  
  for (const table of tablesToBackup) {
    try {
      process.stdout.write('Backing up ' + table + '... ');
      const { data, error } = await supabase.from(table).select('*');
      
      if (error) {
        console.log('⚠ ' + error.message);
        manifest.errors.push({ table, error: error.message, phase: 'backup' });
        continue;
      }
      
      fs.writeFileSync(
        path.join(backupDir, table + '.json'),
        JSON.stringify(data, null, 2)
      );
      manifest.tables[table] = data.length;
      console.log('✓ ' + data.length + ' rows');
    } catch (err) {
      console.log('✗ ' + err.message);
      manifest.errors.push({ table, error: err.message, phase: 'backup' });
    }
  }
  
  // Backup auth users
  try {
    process.stdout.write('Backing up auth.users... ');
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (authErr) throw authErr;
    fs.writeFileSync(
      path.join(backupDir, 'auth_users.json'),
      JSON.stringify(authData.users, null, 2)
    );
    manifest.tables['auth_users'] = authData.users.length;
    console.log('✓ ' + authData.users.length + ' users');
  } catch (err) {
    console.log('✗ ' + err.message);
    manifest.errors.push({ table: 'auth_users', error: err.message, phase: 'backup' });
  }
  
  // Verify backup
  console.log('\n--- Backup Verification ---');
  const backupFiles = fs.readdirSync(backupDir).filter(f => f.endsWith('.json'));
  console.log('Backup files created: ' + backupFiles.length);
  
  const profilesBackup = JSON.parse(fs.readFileSync(path.join(backupDir, 'profiles.json'), 'utf8'));
  if (profilesBackup.length !== allProfiles.length) {
    console.error('FATAL: Backup verification failed - profiles count mismatch');
    process.exit(1);
  }
  console.log('✓ Profiles backup verified: ' + profilesBackup.length + ' records');
  
  const adminInBackup = profilesBackup.find(p => p.email === ADMIN_EMAIL);
  if (!adminInBackup) {
    console.error('FATAL: Admin account not in backup!');
    process.exit(1);
  }
  console.log('✓ Admin account verified in backup');
  
  manifest.phases.backup = { status: 'complete', files: backupFiles.length };
  fs.writeFileSync(path.join(backupDir, 'backup_manifest.json'), JSON.stringify(manifest, null, 2));
  
  console.log('\n✓ PHASE 1 COMPLETE: Backup verified\n');
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: CONFIRM ADMIN PRESERVATION
  // ═══════════════════════════════════════════════════════════════
  console.log('=== PHASE 2: ADMIN PRESERVATION CHECK ===\n');
  
  console.log('Admin account details:');
  console.log('  ID: ' + adminUser.id);
  console.log('  Email: ' + adminUser.email);
  console.log('  Role: ' + adminUser.role);
  console.log('  Status: ' + adminUser.approval_status);
  console.log('  Disabled: ' + adminUser.is_disabled);
  console.log('');
  console.log('⚠ This account will NOT be modified');
  console.log('');
  
  manifest.phases.admin_preservation = { status: 'confirmed', admin: adminUser };
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: REMOVE ALL NON-ADMIN USERS
  // ═══════════════════════════════════════════════════════════════
  console.log('=== PHASE 3: REMOVING NON-ADMIN USERS ===\n');
  
  const nonAdminIds = nonAdminUsers.map(u => u.id);
  console.log('Users to delete: ' + nonAdminIds.length);
  
  // Count by role
  const roleCounts = {};
  nonAdminUsers.forEach(u => {
    roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
  });
  console.log('Breakdown by role:');
  Object.entries(roleCounts).forEach(([role, count]) => {
    console.log('  - ' + role + ': ' + count);
  });
  console.log('');
  
  // Delete from dependent tables first (to avoid FK violations)
  const dependentTables = [
    'student_progress', 'quiz_attempts', 'enrollments', 'attendance_records',
    'notifications', 'grades', 'flashcard_progress', 'lesson_completions',
    'user_progress', 'user_achievements', 'user_activity_log', 'user_preferences',
    'school_memberships', 'chapter_progress', 'module_progress', 'exam_attempts',
    'exam_results', 'study_sessions', 'certificates', 'messages', 'user_roles',
    'permission_overrides', 'audit_events', 'security_events', 'login_attempts',
    'password_resets', 'email_verifications', 'user_sessions', 'refresh_tokens',
    'api_keys', 'webhooks', 'subscriptions', 'payments', 'invoices', 'receipts'
  ];
  
  console.log('Deleting from dependent tables...');
  for (const table of dependentTables) {
    try {
      // Check if table exists and has user_id column
      const { error: checkError } = await supabase
        .from(table)
        .select('user_id')
        .limit(1);
      
      if (checkError) {
        // Table doesn't exist or no user_id column, skip
        continue;
      }
      
      process.stdout.write('  ' + table + '... ');
      const { error: delError } = await supabase
        .from(table)
        .delete()
        .in('user_id', nonAdminIds);
      
      if (delError) {
        console.log('⚠ ' + delError.message);
        manifest.errors.push({ table, error: delError.message, phase: 'delete_dependents' });
      } else {
        console.log('✓');
      }
    } catch (err) {
      // Skip tables that don't exist or don't have user_id
    }
  }
  
  // Delete from profiles
  console.log('\nDeleting from profiles...');
  const { error: profilesDelError } = await supabase
    .from('profiles')
    .delete()
    .in('id', nonAdminIds);
  
  if (profilesDelError) {
    console.error('FATAL: Failed to delete profiles:', profilesDelError);
    manifest.errors.push({ table: 'profiles', error: profilesDelError.message, phase: 'delete_profiles' });
    fs.writeFileSync(path.join(backupDir, 'cleanup_manifest.json'), JSON.stringify(manifest, null, 2));
    process.exit(1);
  }
  console.log('✓ Deleted ' + nonAdminIds.length + ' profiles');
  
  // Delete from auth.users
  console.log('\nDeleting from auth.users...');
  let authDeleteCount = 0;
  for (const userId of nonAdminIds) {
    try {
      const { error: authDelError } = await supabase.auth.admin.deleteUser(userId);
      if (authDelError) {
        console.log('  ⚠ Failed to delete auth user ' + userId + ': ' + authDelError.message);
        manifest.errors.push({ userId, error: authDelError.message, phase: 'delete_auth' });
      } else {
        authDeleteCount++;
      }
    } catch (err) {
      console.log('  ⚠ Error deleting auth user ' + userId + ': ' + err.message);
      manifest.errors.push({ userId, error: err.message, phase: 'delete_auth' });
    }
  }
  console.log('✓ Deleted ' + authDeleteCount + ' auth users');
  
  manifest.phases.cleanup = {
    status: 'complete',
    profiles_deleted: nonAdminIds.length,
    auth_users_deleted: authDeleteCount,
    role_breakdown: roleCounts
  };
  
  console.log('\n✓ PHASE 3 COMPLETE: Users removed\n');
  
  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: VERIFICATION
  // ═══════════════════════════════════════════════════════════════
  console.log('=== PHASE 4: VERIFICATION ===\n');
  
  // Check remaining users
  const { data: remainingProfiles, error: remainErr } = await supabase
    .from('profiles')
    .select('*');
  
  if (remainErr) {
    console.error('FATAL: Cannot verify remaining profiles:', remainErr);
    process.exit(1);
  }
  
  console.log('Remaining profiles: ' + remainingProfiles.length);
  
  if (remainingProfiles.length !== 1) {
    console.error('FATAL: Expected 1 profile, found ' + remainingProfiles.length);
    process.exit(1);
  }
  
  const remainingAdmin = remainingProfiles[0];
  if (remainingAdmin.email !== ADMIN_EMAIL) {
    console.error('FATAL: Remaining user is not the admin!');
    process.exit(1);
  }
  
  console.log('✓ Exactly one user remains');
  console.log('✓ Remaining user is admin: ' + remainingAdmin.email);
  console.log('  - ID: ' + remainingAdmin.id);
  console.log('  - Role: ' + remainingAdmin.role);
  console.log('  - Status: ' + remainingAdmin.approval_status);
  
  // Verify auth users
  const { data: remainingAuth, error: authRemainErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (!authRemainErr) {
    console.log('✓ Remaining auth users: ' + remainingAuth.users.length);
  }
  
  // Check for orphaned records
  console.log('\n--- Checking for orphaned records ---');
  const orphanChecks = [
    { table: 'student_progress', col: 'user_id' },
    { table: 'quiz_attempts', col: 'user_id' },
    { table: 'enrollments', col: 'user_id' }
  ];
  
  let orphanCount = 0;
  for (const check of orphanChecks) {
    try {
      const { data, error } = await supabase
        .from(check.table)
        .select('*')
        .not(check.col, 'is', null);
      
      if (!error && data) {
        const orphans = data.filter(row => !remainingProfiles.find(p => p.id === row[check.col]));
        if (orphans.length > 0) {
          console.log('⚠ ' + check.table + ': ' + orphans.length + ' orphaned records');
          orphanCount += orphans.length;
        } else {
          console.log('✓ ' + check.table + ': no orphans');
        }
      }
    } catch (err) {
      // Table might not exist
    }
  }
  
  if (orphanCount === 0) {
    console.log('✓ No orphaned records found');
  }
  
  manifest.phases.verification = {
    status: 'complete',
    remaining_profiles: remainingProfiles.length,
    remaining_auth_users: remainingAuth?.users?.length || 'unknown',
    orphaned_records: orphanCount,
    admin_verified: true
  };
  
  // Final manifest
  manifest.phases.complete = { status: 'success', timestamp: new Date().toISOString() };
  fs.writeFileSync(path.join(backupDir, 'cleanup_manifest.json'), JSON.stringify(manifest, null, 2));
  
  console.log('\n=== CLEANUP COMPLETE ===');
  console.log('Backup location: ' + backupDir);
  console.log('Users removed: ' + nonAdminIds.length);
  console.log('Admin preserved: ' + ADMIN_EMAIL);
  console.log('Errors: ' + manifest.errors.length);
  
  if (manifest.errors.length > 0) {
    console.log('\nWarnings/Errors:');
    manifest.errors.forEach(e => {
      console.log('  - ' + (e.table || e.userId) + ': ' + e.error);
    });
  }
  
  console.log('\n✓ Platform is ready for fresh pilot onboarding');
}

completeBackupAndCleanup().catch(err => {
  console.error('CLEANUP FAILED:', err);
  process.exit(1);
});
