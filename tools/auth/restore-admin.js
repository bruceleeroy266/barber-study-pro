import { Client } from 'pg';

// Validate required environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_USER_ID: process.env.ADMIN_USER_ID,
  ADMIN_ENCRYPTED_PASSWORD: process.env.ADMIN_ENCRYPTED_PASSWORD,
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
  console.error('  $env:ADMIN_USER_ID="uuid-of-admin-user"');
  console.error('  $env:ADMIN_ENCRYPTED_PASSWORD="bcrypt-hash-of-password"');
  process.exit(1);
}

const connectionString = requiredEnvVars.DATABASE_URL;

const ADMIN_USER = {
  id: requiredEnvVars.ADMIN_USER_ID,
  email: requiredEnvVars.ADMIN_EMAIL,
  encrypted_password: requiredEnvVars.ADMIN_ENCRYPTED_PASSWORD,
  email_confirmed_at: new Date().toISOString(),
  raw_app_meta_data: '{"provider": "email", "providers": ["email"]}',
  raw_user_meta_data: '{"role": "admin", "full_name": "ASCYN PRO Administrator", "email_verified": true}',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const ADMIN_PROFILE = {
  id: requiredEnvVars.ADMIN_USER_ID,
  email: requiredEnvVars.ADMIN_EMAIL,
  full_name: 'ASCYN PRO Administrator',
  role: 'admin',
  approval_status: 'approved',
  is_disabled: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

async function restoreAdmin() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('✓ Connected to database');

    // Check if admin already exists
    const checkResult = await client.query(
      'SELECT id FROM auth.users WHERE email = $1',
      [ADMIN_USER.email]
    );

    if (checkResult.rows.length > 0) {
      console.log('✓ Admin user already exists');
      return;
    }

    // Insert admin user into auth.users
    await client.query(`
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at, is_super_admin, is_sso_user, is_anonymous
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        $1, 'authenticated', 'authenticated', $2, $3,
        $4, $5, $6,
        $7, $8, NULL, false, false
      )
    `, [
      ADMIN_USER.id,
      ADMIN_USER.email,
      ADMIN_USER.encrypted_password,
      ADMIN_USER.email_confirmed_at,
      ADMIN_USER.raw_app_meta_data,
      ADMIN_USER.raw_user_meta_data,
      ADMIN_USER.created_at,
      ADMIN_USER.updated_at
    ]);

    console.log('✓ Admin user restored to auth.users');

    // Insert identity
    await client.query(`
      INSERT INTO auth.identities (
        id, provider_id, user_id, identity_data, provider, 
        last_sign_in_at, created_at, updated_at
      ) VALUES (
        gen_random_uuid(),
        $1, $2, $3, 'email',
        $4, $5, $6
      )
    `, [
      ADMIN_USER.id,
      ADMIN_USER.id,
      `{"sub": "${ADMIN_USER.id}", "email": "${ADMIN_USER.email}", "email_verified": true, "phone_verified": false}`,
      ADMIN_USER.created_at,
      ADMIN_USER.created_at,
      ADMIN_USER.updated_at
    ]);

    console.log('✓ Admin identity restored');

    // Check if profile exists
    const profileCheck = await client.query(
      'SELECT id FROM public.profiles WHERE id = $1',
      [ADMIN_PROFILE.id]
    );

    if (profileCheck.rows.length === 0) {
      // Insert admin profile
      await client.query(`
        INSERT INTO public.profiles (
          id, email, full_name, role, approval_status, is_disabled,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        ADMIN_PROFILE.id,
        ADMIN_PROFILE.email,
        ADMIN_PROFILE.full_name,
        ADMIN_PROFILE.role,
        ADMIN_PROFILE.approval_status,
        ADMIN_PROFILE.is_disabled,
        ADMIN_PROFILE.created_at,
        ADMIN_PROFILE.updated_at
      ]);

      console.log('✓ Admin profile restored');
    } else {
      console.log('✓ Admin profile already exists');
    }

    console.log('\n✅ ADMIN RESTORE COMPLETE');
    console.log(`   Email: ${ADMIN_USER.email}`);
    console.log(`   ID: ${ADMIN_USER.id}`);
    console.log(`   Role: admin`);
    console.log(`   Status: approved, enabled, email confirmed`);

  } catch (error) {
    console.error('❌ Error restoring admin:', error);
    throw error;
  } finally {
    await client.end();
  }
}

restoreAdmin().catch(console.error);
