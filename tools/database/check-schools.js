// Check schools in production
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const eq = t.indexOf('=');
  if (eq === -1) continue;
  let v = t.slice(eq + 1).trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  env[t.slice(0, eq).trim()] = v;
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchools() {
  const { data: schools, error } = await supabase
    .from('schools')
    .select('id, name, is_active, created_at')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.log('Error:', error.message);
    return;
  }
  
  console.log('Schools in production:');
  console.log('Total:', schools.length);
  schools.forEach((school, i) => {
    console.log(`${i + 1}. ${school.name}`);
    console.log(`   ID: ${school.id}`);
    console.log(`   Active: ${school.is_active}`);
    console.log('');
  });
}

checkSchools().catch(console.error);
