// ASCYN PRO - Fresh Start User Database Cleanup
// Phase 1: Full Backup of all user-related data
// Run from: C:\Users\gabeb\Projects\barber-study-pro

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env from .env.local manually (no dotenv dependency)
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('FATAL: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_EMAIL = 'ascynproofficial@gmail.com';
const ADMIN_ID = '261fcd4c-bbfe-4957-9efd-0dfca6cccdc1';

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(process.cwd(), 'backups', 'user-backup-' + timestamp);

  fs.mkdirSync(backupDir, { recursive: true });
  console.log('Backup directory: ' + backupDir);
  console.log('Timestamp: ' + new Date().toISOString());
  console.log('');

  const manifest = {
    backup_timestamp: new Date().toISOString(),
    backup_directory: backupDir,
    tables: {},
    total_profiles: 0,
    admin_account: { email: ADMIN_EMAIL, id: ADMIN_ID },
    errors: []
  };

  // ── 1. Profiles ──────────────────────────────────────────────
  console.log('[1/10] Backing up profiles...');
  const { data: profiles, error: profilesErr } = await supabase
    .from('profiles')
    .select('*');

  if (profilesErr) {
    console.error('FATAL: Cannot read profiles:', profilesErr.message);
    manifest.errors.push({ table: 'profiles', error: profilesErr.message });
    writeManifest(backupDir, manifest);
    process.exit(1);
  }

  fs.writeFileSync(path.join(backupDir, 'profiles.json'), JSON.stringify(profiles, null, 2));
  manifest.tables['profiles'] = profiles.length;
  manifest.total_profiles = profiles.length;
  console.log('  ✓ ' + profiles.length + ' profiles');

  // ── 2. Auth users (via admin API) ───────────────────────────
  console.log('[2/10] Backing up auth.users (admin API)...');
  try {
    const { data: authData, error: authErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (authErr) throw authErr;
    fs.writeFileSync(path.join(backupDir, 'auth_users.json'), JSON.stringify(authData.users, null, 2));
    manifest.tables['auth_users'] = authData.users.length;
    console.log('  ✓ ' + authData.users.length + ' auth users');
  } catch (err) {
    console.log('  ⚠ auth.users backup failed: ' + err.message);
    manifest.errors.push({ table: 'auth_users', error: err.message });
    // Write what we can from profiles as reference
    const authRef = profiles.map(p => ({ id: p.id, email: p.email, note: 'from profiles table' }));
    fs.writeFileSync(path.join(backupDir, 'auth_users_from_profiles.json'), JSON.stringify(authRef, null, 2));
    manifest.tables['auth_users_from_profiles'] = authRef.length;
  }

  // ── 3-10. Dependent tables ──────────────────────────────────
  const dependentTables = [
    'student_progress',
    'quiz_attempts',
    'flashcard_progress',
    'lesson_completions',
    'attendance_records',
    'enrollments',
    'audit_log',
    'notifications'
  ];

  for (let i = 0; i < dependentTables.length; i++) {
    const table = dependentTables[i];
    const step = i + 3;
    console.log('[' + step + '/10] Backing up ' + table + '...');
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.log('  ⚠ ' + table + ': ' + error.message);
        manifest.errors.push({ table: table, error: error.message });
        continue;
      }
      fs.writeFileSync(path.join(backupDir, table + '.json'), JSON.stringify(data, null, 2));
      manifest.tables[table] = data.length;
      console.log('  ✓ ' + data.length + ' rows');
    } catch (err) {
      console.log('  ⚠ ' + table + ': ' + err.message);
      manifest.errors.push({ table: table, error: err.message });
    }
  }

  // ── Manifest ────────────────────────────────────────────────
  writeManifest(backupDir, manifest);

  // ── Verification ────────────────────────────────────────────
  console.log('');
  console.log('=== BACKUP VERIFICATION ===');
  const files = fs.readdirSync(backupDir);
  console.log('Files in backup: ' + files.length);
  for (const f of files) {
    const stat = fs.statSync(path.join(backupDir, f));
    console.log('  ' + f + ' (' + stat.size + ' bytes)');
  }

  // Verify profiles backup is readable and has expected count
  const readBack = JSON.parse(fs.readFileSync(path.join(backupDir, 'profiles.json'), 'utf8'));
  if (readBack.length !== profiles.length) {
    console.error('FATAL: Backup verification failed - profiles count mismatch');
    process.exit(1);
  }
  console.log('✓ Profiles backup verified: ' + readBack.length + ' records match');

  // Verify admin is in backup
  const adminInBackup = readBack.find(p => p.email === ADMIN_EMAIL);
  if (!adminInBackup) {
    console.error('FATAL: Admin account not found in backup!');
    process.exit(1);
  }
  console.log('✓ Admin account verified in backup: ' + adminInBackup.id);

  console.log('');
  console.log('=== BACKUP COMPLETE ===');
  console.log('Location: ' + backupDir);
  console.log('Total profiles: ' + profiles.length);
  console.log('Errors: ' + manifest.errors.length);
  if (manifest.errors.length > 0) {
    console.log('Warnings:');
    manifest.errors.forEach(e => console.log('  - ' + e.table + ': ' + e.error));
  }

  return backupDir;
}

function writeManifest(dir, manifest) {
  fs.writeFileSync(path.join(dir, 'backup_manifest.json'), JSON.stringify(manifest, null, 2));
}

createBackup().catch(err => {
  console.error('BACKUP FAILED:', err);
  process.exit(1);
});
