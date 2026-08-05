// Direct server action test — run with: node test-server-actions.js
// This tests which async operation hangs by calling them directly with timeouts.

// Load env vars manually from .env.local
const fs = require('fs');
const path = require('path');
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        let value = trimmed.substring(eqIdx + 1).trim();
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        // Handle multiline values (quoted with continuation)
        if (value.endsWith('\\')) {
          // skip multiline for now
        }
        process.env[key] = value;
      }
    }
  }
} catch (e) {
  console.error('Failed to load .env.local:', e.message);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

// Simulate what createServerClient does
const { createClient } = require('@supabase/supabase-js');

async function testWithTimeout(name, fn, timeoutMs = 10000) {
  console.log(`\n--- Testing: ${name} ---`);
  const start = Date.now();
  
  try {
    const result = await Promise.race([
      fn(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs))
    ]);
    const duration = Date.now() - start;
    console.log(`✅ ${name} completed in ${duration}ms`);
    return result;
  } catch (err) {
    const duration = Date.now() - start;
    if (err.message === 'TIMEOUT') {
      console.log(`⏳ ${name} TIMED OUT after ${duration}ms — THIS IS THE HANGING OPERATION`);
    } else {
      console.log(`❌ ${name} failed in ${duration}ms: ${err.message}`);
    }
    return null;
  }
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Test 1: Basic connectivity
  await testWithTimeout('Basic profiles count', async () => {
    const { count, error } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    if (error) throw new Error(error.message);
    return count;
  });

  // Test 2: Profiles with schools join (the exact query from getUsers)
  await testWithTimeout('Profiles with schools join', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        school_id,
        approval_status,
        is_disabled,
        requires_password_change,
        created_at,
        updated_at,
        schools (name)
      `)
      .order('created_at', { ascending: false })
      .range(0, 49);
    if (error) throw new Error(error.message);
    return data?.length;
  });

  // Test 3: Schools list (from getSchools)
  await testWithTimeout('Schools list', async () => {
    const { data, error } = await supabase.from('schools').select('id, name').order('name');
    if (error) throw new Error(error.message);
    return data?.length;
  });

  // Test 4: Maintenance mode (from getMaintenanceMode)
  await testWithTimeout('Maintenance mode', async () => {
    const { data, error } = await supabase
      .from('maintenance_mode')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

  // Test 5: Pilot inquiries (from pilot-inquiries page)
  await testWithTimeout('Pilot inquiries', async () => {
    const { data, error } = await supabase
      .from('pilot_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data?.length;
  });

  // Test 6: Diagnostics tables (from runDiagnostics)
  const tables = ['profiles', 'schools', 'school_settings', 'security_logs', 'notifications', 'feature_flags', 'background_jobs', 'maintenance_mode', 'backup_status'];
  for (const table of tables) {
    await testWithTimeout(`Table check: ${table}`, async () => {
      const { error } = await supabase.from(table).select('*', { count: 'exact', head: true });
      if (error) throw new Error(error.message);
      return 'ok';
    }, 5000);
  }

  // Test 7: Promise.all with count + data (the exact pattern from getUsers)
  await testWithTimeout('Promise.all count + data', async () => {
    const countQuery = supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    const dataQuery = supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        school_id,
        approval_status,
        is_disabled,
        requires_password_change,
        created_at,
        updated_at,
        schools (name)
      `)
      .order('created_at', { ascending: false })
      .range(0, 49);

    const [countResult, dataResult] = await Promise.all([countQuery, dataQuery]);
    if (countResult.error) throw new Error(countResult.error.message);
    if (dataResult.error) throw new Error(dataResult.error.message);
    return { count: countResult.count, dataLength: dataResult.data?.length };
  });

  console.log('\n=== ALL TESTS COMPLETE ===');
}

main().catch(console.error);
