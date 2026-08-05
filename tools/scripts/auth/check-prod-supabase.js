// Check production site's Supabase configuration by fetching JS bundles
const https = require('https');
const fs = require('fs');
const path = require('path');

const PROD_URL = 'https://barber-study-c345wjqdt-gabebot24-5010s-projects.vercel.app';
const LOCAL_PROJECT_REF = 'hgyznydxepjsvbjsirpv';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function checkProduction() {
  console.log('=== PRODUCTION SUPABASE CONFIGURATION CHECK ===\n');
  console.log('Production URL: ' + PROD_URL);
  console.log('Local project ref: ' + LOCAL_PROJECT_REF);
  console.log('');

  // 1. Fetch the main HTML page
  console.log('[1] Fetching main page...');
  const mainPage = await fetch(PROD_URL);
  console.log('  Status: ' + mainPage.status);

  // Extract script src URLs
  const scriptSrcs = [];
  const scriptRegex = /src="([^"]*\.js[^"]*)"/g;
  let match;
  while ((match = scriptRegex.exec(mainPage.data)) !== null) {
    scriptSrcs.push(match[1]);
  }
  console.log('  Script tags found: ' + scriptSrcs.length);

  // 2. Check for Supabase references in HTML
  console.log('\n[2] Checking HTML for Supabase references...');
  const supabaseRefs = mainPage.data.match(/https:\/\/[a-z0-9]+\.supabase\.[a-z]+/g);
  if (supabaseRefs) {
    [...new Set(supabaseRefs)].forEach(ref => console.log('  Found: ' + ref));
  } else {
    console.log('  No direct Supabase URLs in HTML (expected - they\'re in JS bundles)');
  }

  // Check for project ref in HTML
  if (mainPage.data.includes(LOCAL_PROJECT_REF)) {
    console.log('  ✓ Local project ref "' + LOCAL_PROJECT_REF + '" found in HTML');
  } else {
    console.log('  Local project ref not in HTML (checking JS bundles...)');
  }

  // 3. Fetch JS bundles and check for Supabase URLs
  console.log('\n[3] Checking JS bundles for Supabase configuration...');
  const foundUrls = new Set();
  const foundRefs = new Set();
  let checkedCount = 0;

  for (const src of scriptSrcs) {
    const fullUrl = src.startsWith('http') ? src : new URL(src, PROD_URL).href;
    try {
      const jsResult = await fetch(fullUrl);
      if (jsResult.status === 200) {
        checkedCount++;
        
        // Look for Supabase URLs
        const urls = jsResult.data.match(/https:\/\/[a-z0-9]+\.supabase\.[a-z]+/g);
        if (urls) {
          urls.forEach(u => foundUrls.add(u));
        }
        
        // Look for project refs
        const refs = jsResult.data.match(/[a-z]{20}(?=\.supabase)/g);
        if (refs) {
          refs.forEach(r => foundRefs.add(r));
        }

        // Check for local project ref specifically
        if (jsResult.data.includes(LOCAL_PROJECT_REF)) {
          foundRefs.add(LOCAL_PROJECT_REF + ' (direct match)');
        }
      }
    } catch (err) {
      // Skip failed fetches
    }
  }

  console.log('  JS bundles checked: ' + checkedCount);
  
  console.log('\n[4] Results:');
  if (foundUrls.size > 0) {
    console.log('  Supabase URLs found in production JS:');
    [...foundUrls].forEach(u => console.log('    - ' + u));
  } else {
    console.log('  No Supabase URLs found in JS bundles');
    console.log('  (May be in environment variables injected at runtime)');
  }

  if (foundRefs.size > 0) {
    console.log('  Project refs found:');
    [...foundRefs].forEach(r => console.log('    - ' + r));
  }

  // 5. Check the _next/static chunks for env vars
  console.log('\n[5] Checking Next.js build manifest...');
  try {
    const buildManifest = await fetch(PROD_URL + '/_next/static/BUILD_ID');
    console.log('  Build ID status: ' + buildManifest.status);
  } catch (e) {
    console.log('  Could not fetch build ID');
  }

  // 6. Summary
  console.log('\n=== SUMMARY ===');
  const prodUsesLocalRef = foundUrls.size > 0 && [...foundUrls].some(u => u.includes(LOCAL_PROJECT_REF));
  
  if (prodUsesLocalRef) {
    console.log('✓ CONFIRMED: Production site uses the SAME Supabase project as local');
    console.log('  Project: ' + LOCAL_PROJECT_REF);
  } else if (foundUrls.size > 0) {
    console.log('⚠ MISMATCH: Production site uses a DIFFERENT Supabase project');
    console.log('  Local project: ' + LOCAL_PROJECT_REF);
    console.log('  Production URLs found: ' + [...foundUrls].join(', '));
  } else {
    console.log('⚠ CANNOT DETERMINE: No Supabase URLs found in client-side JS');
    console.log('  This could mean:');
    console.log('  - Environment variables are injected server-side only');
    console.log('  - The Supabase client is initialized differently');
    console.log('  - Need to check Vercel dashboard for actual env values');
  }

  console.log('\nLocal environment:');
  console.log('  URL: https://' + LOCAL_PROJECT_REF + '.supabase.co');
  console.log('  Project: ' + LOCAL_PROJECT_REF);
}

checkProduction().catch(console.error);
