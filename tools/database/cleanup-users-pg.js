import { Client } from 'pg';

// Validate required environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(key => console.error(`   - ${key}`));
  console.error('\nPlease set these variables before running this script.');
  console.error('Example:');
  console.error('  $env:DATABASE_URL="postgresql://postgres:password@host:port/database"');
  console.error('  $env:ADMIN_EMAIL="admin@example.com"');
  process.exit(1);
}

// PostgreSQL connection
const connectionString = requiredEnvVars.DATABASE_URL;
const ADMIN_EMAIL = requiredEnvVars.ADMIN_EMAIL;

// Tables that contain user-owned data (to be cleaned)
const USER_TABLES = [
  'profiles',
  'attendance_records',
  'attendance_audit_log',
  'attendance_corrections',
  'attendance_notes',
  'grades',
  'quiz_attempts',
  'student_progress',
  'missed_questions',
  'notifications',
  'owner_notifications',
  'enrollments',
  'hour_logs',
  'instructor_notes',
  'beta_feedback',
  'beta_agreements',
  'user_management_audit_logs',
  'security_logs',
  'background_jobs',
];

async function cleanupUsers() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('✓ Connected to database');
    console.log(`Admin email: ${ADMIN_EMAIL}`);
    
    // Get admin user ID
    const adminResult = await client.query(
      'SELECT id FROM auth.users WHERE email = $1',
      [ADMIN_EMAIL]
    );
    
    if (adminResult.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }
    
    const adminId = adminResult.rows[0].id;
    console.log(`Admin user ID: ${adminId}`);
    
    // Get all non-admin users
    const usersResult = await client.query(
      'SELECT id, email FROM auth.users WHERE email != $1',
      [ADMIN_EMAIL]
    );
    
    console.log(`\nFound ${usersResult.rows.length} non-admin users to delete:`);
    usersResult.rows.forEach(u => console.log(`  - ${u.email}`));
    
    if (usersResult.rows.length === 0) {
      console.log('\nNo users to delete');
      return;
    }
    
    const userIds = usersResult.rows.map(u => u.id);
    
    // Delete from user tables
    console.log('\nDeleting user data from tables...');
    for (const table of USER_TABLES) {
      try {
        const result = await client.query(
          `DELETE FROM ${table} WHERE user_id = ANY($1)`,
          [userIds]
        );
        console.log(`  ✓ ${table}: ${result.rowCount} rows deleted`);
      } catch (err) {
        console.log(`  ⚠ ${table}: ${err.message}`);
      }
    }
    
    // Delete from auth.users
    console.log('\nDeleting from auth.users...');
    const deleteResult = await client.query(
      'DELETE FROM auth.users WHERE id = ANY($1)',
      [userIds]
    );
    console.log(`  ✓ auth.users: ${deleteResult.rowCount} rows deleted`);
    
    console.log('\n✅ User cleanup complete');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await client.end();
  }
}

cleanupUsers().catch(console.error);
