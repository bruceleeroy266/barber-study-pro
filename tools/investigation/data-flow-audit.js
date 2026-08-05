const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.production manually
const envPath = path.join(__dirname, '.env.production');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[match[1].trim()] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Key:', supabaseKey ? 'Set (length: ' + supabaseKey.length + ')' : 'Missing');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return { table: tableName, exists: false, error: error.message, code: error.code };
    }
    return { table: tableName, exists: true, rowCount: count };
  } catch (err) {
    return { table: tableName, exists: false, error: err.message };
  }
}

async function main() {
  const results = {
    timestamp: new Date().toISOString(),
    tables: {},
    dataChecks: {}
  };

  const tables = [
    'profiles', 'schools', 'school_settings', 'security_logs',
    'notifications', 'feature_flags', 'background_jobs',
    'maintenance_mode', 'backup_status', 'pilot_inquiries'
  ];

  console.log('\nChecking database tables...');
  for (const table of tables) {
    const result = await checkTable(table);
    results.tables[table] = result;
    console.log(`  ${table}: ${result.exists ? '✅ exists' : '❌ missing'} ${result.rowCount !== undefined ? `(${result.rowCount} rows)` : ''} ${result.error || ''}`);
  }

  // Check specific data
  console.log('\nChecking data...');
  
  // Security logs
  const { data: logs, error: logsError, count: logsCount } = await supabase
    .from('security_logs')
    .select('*', { count: 'exact' })
    .limit(5);
  results.dataChecks.securityLogs = { count: logsCount, error: logsError?.message, sample: logs?.[0] };
  console.log(`  security_logs: ${logsCount || 0} rows`);

  // Pilot inquiries
  const { data: inquiries, error: inquiriesError, count: inquiriesCount } = await supabase
    .from('pilot_inquiries')
    .select('*', { count: 'exact' })
    .limit(5);
  results.dataChecks.pilotInquiries = { count: inquiriesCount, error: inquiriesError?.message, sample: inquiries?.[0] };
  console.log(`  pilot_inquiries: ${inquiriesCount || 0} rows`);

  // Maintenance mode
  const { data: maintenance, error: maintenanceError } = await supabase
    .from('maintenance_mode')
    .select('*')
    .limit(1)
    .maybeSingle();
  results.dataChecks.maintenanceMode = { data: maintenance, error: maintenanceError?.message };
  console.log(`  maintenance_mode: ${maintenance ? 'configured' : 'not configured'}`);

  // Schools
  const { data: schools, error: schoolsError, count: schoolsCount } = await supabase
    .from('schools')
    .select('*', { count: 'exact' });
  results.dataChecks.schools = { count: schoolsCount, error: schoolsError?.message, sample: schools?.[0] };
  console.log(`  schools: ${schoolsCount || 0} rows`);

  // Profiles
  const { data: profiles, error: profilesError, count: profilesCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .limit(5);
  results.dataChecks.profiles = { count: profilesCount, error: profilesError?.message, sample: profiles?.[0] };
  console.log(`  profiles: ${profilesCount || 0} rows`);

  // Save results
  const outputPath = path.join(__dirname, 'certification-screenshots', 'data-flow-audit.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to: ${outputPath}`);
}

main().catch(console.error);
