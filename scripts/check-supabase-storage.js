const fs = require('fs');
const path = require('path');
const { createClient } = require('../backend/node_modules/@supabase/supabase-js');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  const envExamplePath = path.resolve(__dirname, '../.env.example');

  let envFile = fs.existsSync(envPath) ? envPath : envExamplePath;
  const content = fs.readFileSync(envFile, 'utf8');

  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...values] = trimmed.split('=');
      const val = values.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

async function checkStorage() {
  loadEnv();
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'resumes';

  console.log('--- Supabase Storage Health Check ---');

  if (
    !supabaseUrl ||
    !secretKey ||
    supabaseUrl.includes('your-project-ref') ||
    secretKey.includes('sb_secret_xxxxxxxxx') ||
    secretKey.includes('your-service-role-key')
  ) {
    console.log('Status: DOWN');
    console.log('Reason: SUPABASE_URL or SUPABASE_SECRET_KEY contains placeholder values.');
    process.exit(0);
  }

  try {
    const supabase = createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) {
      console.log('Status: DOWN');
      console.log(`Reason: Bucket '${bucketName}' check error - ${error.message}`);
      process.exit(1);
    }

    console.log('Status: UP');
    console.log(`Bucket '${bucketName}' is accessible (Public: ${data.public ? 'TRUE' : 'FALSE - PRIVATE'}).`);
    process.exit(0);
  } catch (error) {
    console.log('Status: DOWN');
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
}

checkStorage();
