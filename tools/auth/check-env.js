const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/)[1].trim().replace(/['"]/g, '');
console.log('URL:', url);
console.log('Ref:', url.match(/https:\/\/([^.]+)/)[1]);
